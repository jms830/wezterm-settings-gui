"use client";

import { useState, useRef, useCallback } from "react";
import {
  FolderArchive,
  Upload,
  AlertCircle,
  Loader2,
  Check,
  FileCode,
  ChevronRight,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useConfigStore } from "@/lib/store/config-store";
import { parseZipArchive, ZipImportResult } from "@/lib/import/zip-importer";
import { getOptionById } from "@/data/wezterm-options";

const MAX_ZIP_SIZE = 10 * 1024 * 1024; // 10MB max

interface MergedConfig {
  config: Record<string, unknown>;
  sources: Record<string, string>; // key -> source file path
  conflicts: Array<{
    key: string;
    values: Array<{ file: string; value: unknown }>;
  }>;
}

/**
 * Merge parsed configs from multiple files into a single config.
 * Entry file values take precedence. Arrays are concatenated.
 */
function mergeConfigs(
  parsedPerFile: Record<string, Record<string, unknown>>,
  entryPath: string | null,
  resolvedGraph: string[]
): MergedConfig {
  const config: Record<string, unknown> = {};
  const sources: Record<string, string> = {};
  const valueHistory: Record<string, Array<{ file: string; value: unknown }>> = {};

  // Process files in resolved order (entry file first)
  const orderedFiles = entryPath
    ? [entryPath, ...resolvedGraph.filter((f) => f !== entryPath)]
    : resolvedGraph;

  for (const filePath of orderedFiles) {
    const fileConfig = parsedPerFile[filePath];
    if (!fileConfig) continue;

    for (const [key, value] of Object.entries(fileConfig)) {
      // Track all values for conflict detection
      if (!valueHistory[key]) {
        valueHistory[key] = [];
      }
      valueHistory[key].push({ file: filePath, value });

      // Check if this is a known option
      const option = getOptionById(key);
      
      if (option) {
        // For arrays (like keys, launch_menu), concatenate
        if (option.type === "keybind" || option.type === "launchmenu") {
          const existing = config[key] as unknown[] | undefined;
          const newValue = value as unknown[];
          if (Array.isArray(newValue)) {
            config[key] = existing ? [...existing, ...newValue] : newValue;
            sources[key] = filePath;
          }
        } else {
          // For scalar values, entry file wins (first in order)
          if (!(key in config)) {
            config[key] = value;
            sources[key] = filePath;
          }
        }
      } else {
        // Unknown option - still import it, entry file wins
        if (!(key in config)) {
          config[key] = value;
          sources[key] = filePath;
        }
      }
    }
  }

  // Build conflict list for keys with multiple different values
  const conflicts: MergedConfig["conflicts"] = [];
  for (const [key, history] of Object.entries(valueHistory)) {
    if (history.length > 1) {
      // Check if values are actually different
      const uniqueValues = new Set(history.map((h) => JSON.stringify(h.value)));
      if (uniqueValues.size > 1) {
        conflicts.push({ key, values: history });
      }
    }
  }

  return { config, sources, conflicts };
}

export function ZipImporter() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ZipImportResult | null>(null);
  const [merged, setMerged] = useState<MergedConfig | null>(null);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [importSuccess, setImportSuccess] = useState(false);
  const [createdProfileName, setCreatedProfileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importConfig = useConfigStore((state) => state.importConfig);
  const createProfile = useConfigStore((state) => state.createProfile);

  const resetState = useCallback(() => {
    setResult(null);
    setMerged(null);
    setError(null);
    setIsLoading(false);
    setExpandedFiles(new Set());
    setImportSuccess(false);
    setCreatedProfileName(null);
  }, []);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset state
      resetState();
      setIsLoading(true);

      try {
        // Validate file
        if (!file.name.endsWith(".zip")) {
          throw new Error("Please upload a .zip file");
        }

        if (file.size > MAX_ZIP_SIZE) {
          throw new Error(
            `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max size is ${MAX_ZIP_SIZE / 1024 / 1024}MB.`
          );
        }

        // Parse the zip
        const importResult = await parseZipArchive(file);
        setResult(importResult);

        // Merge configs
        const mergedConfig = mergeConfigs(
          importResult.parsedPerFile,
          importResult.entryPath,
          importResult.resolvedGraph
        );
        setMerged(mergedConfig);

        // Auto-expand entry file if exists
        if (importResult.entryPath) {
          setExpandedFiles(new Set([importResult.entryPath]));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse zip file");
      } finally {
        setIsLoading(false);
        // Reset input so same file can be selected again
        e.target.value = "";
      }
    },
    [resetState]
  );

  const handleImport = useCallback(
    (createNewProfile: boolean) => {
      if (!merged) return;

      try {
        // Import the merged config
        importConfig(merged.config);

        if (createNewProfile) {
          // Extract name from zip or use default
          const profileName = `Imported Config ${new Date().toLocaleDateString()}`;
          const profile = createProfile(profileName);
          setCreatedProfileName(profile.name);
        }

        setImportSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to import configuration");
      }
    },
    [merged, importConfig, createProfile]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    // Delay reset to allow dialog animation
    setTimeout(resetState, 200);
  }, [resetState]);

  const toggleFileExpanded = useCallback((filePath: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(filePath)) {
        next.delete(filePath);
      } else {
        next.add(filePath);
      }
      return next;
    });
  }, []);

  const totalKeys = merged ? Object.keys(merged.config).length : 0;
  const recognizedKeys = merged
    ? Object.keys(merged.config).filter((k) => getOptionById(k)).length
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Import from zip archive">
          <FolderArchive className="h-4 w-4 mr-2" aria-hidden="true" />
          Import Zip
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Configuration from Zip</DialogTitle>
          <DialogDescription>
            Upload a .zip archive containing your WezTerm configuration folder.
            Modular configs with require() statements are supported.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Upload Area */}
          {!result && !isLoading && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload zip file"
              />
              <FolderArchive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop a .zip file here, or click to browse
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Max file size: {MAX_ZIP_SIZE / 1024 / 1024}MB
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Parsing zip archive...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div
              className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm text-destructive">{error}</div>
            </div>
          )}

          {/* Success State */}
          {importSuccess && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Import Successful!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {recognizedKeys} settings imported
                  {createdProfileName && (
                    <>
                      {" "}
                      to profile <span className="font-medium">{createdProfileName}</span>
                    </>
                  )}
                </p>
              </div>
              <Button onClick={handleClose}>Close</Button>
            </div>
          )}

          {/* Results */}
          {result && merged && !importSuccess && (
            <>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-2xl font-bold text-foreground">
                    {result.resolvedGraph.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Files resolved</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-2xl font-bold text-foreground">{totalKeys}</p>
                  <p className="text-xs text-muted-foreground">Settings found</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-2xl font-bold text-foreground">{recognizedKeys}</p>
                  <p className="text-xs text-muted-foreground">Recognized</p>
                </div>
              </div>

              {/* Entry Point */}
              {result.entryPath && (
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="text-muted-foreground">Entry point:</span>
                  <code className="px-1.5 py-0.5 bg-muted rounded text-xs">
                    {result.entryPath}
                  </code>
                </div>
              )}

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    {result.warnings.length} warning{result.warnings.length !== 1 && "s"}
                    <ChevronRight className="h-4 w-4 transition-transform [[data-state=open]>&]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground pl-6">
                      {result.warnings.map((warning, i) => (
                        <li key={i} className="list-disc">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Conflicts */}
              {merged.conflicts.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    {merged.conflicts.length} conflict{merged.conflicts.length !== 1 && "s"}{" "}
                    (entry file values used)
                    <ChevronRight className="h-4 w-4 transition-transform [[data-state=open]>&]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="mt-2 space-y-2 text-xs pl-6">
                      {merged.conflicts.slice(0, 10).map((conflict) => (
                        <li key={conflict.key} className="border-l-2 border-amber-500/30 pl-2">
                          <code className="text-foreground">{conflict.key}</code>
                          <span className="text-muted-foreground">
                            {" "}
                            defined in {conflict.values.length} files
                          </span>
                        </li>
                      ))}
                      {merged.conflicts.length > 10 && (
                        <li className="text-muted-foreground">
                          ...and {merged.conflicts.length - 10} more
                        </li>
                      )}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* File List */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-1">
                  {result.resolvedGraph.map((filePath) => {
                    const fileConfig = result.parsedPerFile[filePath] || {};
                    const keyCount = Object.keys(fileConfig).length;
                    const isExpanded = expandedFiles.has(filePath);
                    const isEntry = filePath === result.entryPath;

                    return (
                      <Collapsible
                        key={filePath}
                        open={isExpanded}
                        onOpenChange={() => toggleFileExpanded(filePath)}
                      >
                        <CollapsibleTrigger className="w-full flex items-center gap-2 p-2 hover:bg-muted rounded-md text-sm text-left">
                          <ChevronRight
                            className={`h-4 w-4 text-muted-foreground transition-transform ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                          <FileCode className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1 font-mono text-xs truncate">
                            {filePath}
                          </span>
                          {isEntry && (
                            <Badge variant="outline" className="text-xs">
                              entry
                            </Badge>
                          )}
                          {keyCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {keyCount} key{keyCount !== 1 && "s"}
                            </Badge>
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          {keyCount > 0 ? (
                            <ul className="ml-10 mb-2 space-y-0.5">
                              {Object.entries(fileConfig).map(([key, value]) => {
                                const isRecognized = !!getOptionById(key);
                                return (
                                  <li
                                    key={key}
                                    className="flex items-center gap-2 text-xs py-0.5"
                                  >
                                    <span
                                      className={`font-mono ${
                                        isRecognized
                                          ? "text-foreground"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      {key}
                                    </span>
                                    {!isRecognized && (
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] px-1 py-0"
                                      >
                                        unknown
                                      </Badge>
                                    )}
                                    <span className="text-muted-foreground truncate max-w-[200px]">
                                      ={" "}
                                      {typeof value === "object"
                                        ? Array.isArray(value)
                                          ? `[${value.length} items]`
                                          : "{...}"
                                        : String(value)}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="ml-10 mb-2 text-xs text-muted-foreground">
                              No config keys extracted
                            </p>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        {/* Actions */}
        {result && merged && !importSuccess && (
          <div className="flex justify-between items-center gap-2 pt-4 border-t border-border">
            <Button variant="ghost" onClick={resetState}>
              Upload Different File
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleImport(false)}>
                Import to Current
              </Button>
              <Button onClick={() => handleImport(true)}>
                Create New Profile
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
