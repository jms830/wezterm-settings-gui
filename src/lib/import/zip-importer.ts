import JSZip from "jszip";
import { parseLuaConfig } from "@/lib/export/lua-parser";

export type FileMap = Record<string, string>;

export interface ZipImportResult {
  fileMap: FileMap; // path -> content
  entryPath: string | null;
  modules: Record<string, string[]>; // moduleName -> possible paths found
  resolvedGraph: string[]; // ordered list of file paths resolved from entry
  parsedPerFile: Record<string, Record<string, unknown>>; // file -> parsed config keys
  warnings: string[];
}

// Helper: normalize path (remove leading ./, backslashes)
function normalizePath(p: string): string {
  return p.replace(/^\.\//, "").replace(/\\/g, "/");
}

// Guess module-to-path variants for a require('foo.bar') -> [foo/bar.lua, foo/bar/init.lua]
function moduleNameToPaths(mod: string): string[] {
  const base = mod.replace(/\./g, "/");
  return [`${base}.lua`, `${base}/init.lua`];
}

// Find possible entry file candidates for wezterm.lua
function findEntryCandidate(fileMap: FileMap): string | null {
  const candidates = [
    "wezterm.lua",
    ".config/wezterm/wezterm.lua",
    "config/wezterm.lua",
    "wezterm/init.lua",
  ];
  for (const c of candidates) {
    const n = normalizePath(c);
    if (fileMap[n] !== undefined) return n;
  }
  // fallback: try any file named wezterm.lua
  for (const path of Object.keys(fileMap)) {
    if (path.endsWith("/wezterm.lua") || path === "wezterm.lua") return path;
  }
  return null;
}

// Extract require('...') strings from Lua text (simple, non-executing)
function extractRequires(lua: string): string[] {
  const re = /require\s*\(\s*['"]([^'"\)]+)['"]\s*\)/g;
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(lua)) !== null) {
    if (m[1]) results.push(m[1]);
  }
  return results;
}

export async function parseZipArchive(buffer: ArrayBuffer | Blob | File): Promise<ZipImportResult> {
  const zip = new JSZip();
  const jszip = await zip.loadAsync(buffer as any);

  const fileMap: FileMap = {};
  jszip.forEach((relativePath, file) => {
    // normalize and store
    const n = normalizePath(relativePath);
    // skip directories
    if (!file.dir) {
      // We'll read contents later lazily. For now add placeholder
      fileMap[n] = "";
    }
  });

  // read file contents (Lua files and small text files only)
  const readPromises: Promise<void>[] = [];
  for (const path of Object.keys(fileMap)) {
    if (path.endsWith(".lua") || path.endsWith(".txt") || path.endsWith(".conf") || path.endsWith(".json")) {
      readPromises.push(
        jszip.file(path)!.async("string").then((content) => {
          fileMap[path] = content;
        }).catch(() => {
          // ignore read errors
          fileMap[path] = "";
        })
      );
    }
  }
  await Promise.all(readPromises);

  const warnings: string[] = [];
  const entryPath = findEntryCandidate(fileMap);
  if (!entryPath) {
    warnings.push("No entry point (wezterm.lua) found in archive.");
  }

  // Build module map: moduleName -> matching paths existing in archive
  const modules: Record<string, string[]> = {};
  for (const path of Object.keys(fileMap)) {
    // derive possible module names from path, e.g., config/appearance.lua -> config.appearance
    const withoutExt = path.replace(/\.lua$/i, "");
    const modName = withoutExt.replace(/\//g, ".");
    // also add variants for files under top-level dirs
    modules[modName] = modules[modName] || [];
    modules[modName].push(path);
  }

  // Resolve dependency graph by following require() from entry
  const resolved: string[] = [];
  const visited = new Set<string>();
  async function resolveFromPath(p: string | null) {
    if (!p) return;
    if (visited.has(p)) return;
    visited.add(p);
    resolved.push(p);
    const content = fileMap[p] || "";
    const requires = extractRequires(content);
    for (const req of requires) {
      // try to map req to a file path
      const candidates = moduleNameToPaths(req).map(normalizePath);
      let found = false;
      for (const c of candidates) {
        // try absolute match
        if (fileMap[c] !== undefined) {
          await resolveFromPath(c);
          found = true;
          break;
        }
      }
      if (!found) {
        // also try module name variants mapped earlier
        const variant = req.replace(/\//g, ".");
        if (modules[variant] && modules[variant].length > 0) {
          for (const mapped of modules[variant]) {
            await resolveFromPath(mapped);
          }
          found = true;
        }
      }
      if (!found) {
        warnings.push(`Unresolved require('${req}') referenced from ${p}`);
      }
    }
  }

  if (entryPath) {
    await resolveFromPath(entryPath);
  } else {
    // If no entry, try to resolve from all top-level files
    for (const p of Object.keys(fileMap)) {
      if (p.endsWith("wezterm.lua") || p.endsWith("init.lua") || p.endsWith("config.lua")) {
        await resolveFromPath(p);
      }
    }
  }

  // Parse each resolved file with the existing Lua parser
  const parsedPerFile: Record<string, Record<string, unknown>> = {};
  for (const p of resolved) {
    const content = fileMap[p] || "";
    try {
      parsedPerFile[p] = parseLuaConfig(content);
    } catch (e) {
      warnings.push(`Failed to parse ${p}: ${(e as Error).message}`);
      parsedPerFile[p] = {};
    }
  }

  return {
    fileMap,
    entryPath,
    modules,
    resolvedGraph: resolved,
    parsedPerFile,
    warnings,
  };
}
