import { allOptions } from "@/data/wezterm-options";

// Maximum allowed file size (1MB)
const MAX_FILE_SIZE = 1024 * 1024;

// Maximum parsing time (5 seconds)
const PARSE_TIMEOUT_MS = 5000;

/**
 * Parse a WezTerm Lua configuration file and extract values.
 * This is a simplified parser that handles common patterns.
 * 
 * @throws Error if input is too large, malformed, or parsing times out
 */
export function parseLuaConfig(lua: string): Record<string, unknown> {
  // Input validation
  if (!lua || typeof lua !== "string") {
    throw new Error("Invalid input: expected a string");
  }
  
  if (lua.length > MAX_FILE_SIZE) {
    throw new Error(`File too large: maximum size is ${MAX_FILE_SIZE / 1024}KB`);
  }
  
  const startTime = Date.now();
  const checkTimeout = () => {
    if (Date.now() - startTime > PARSE_TIMEOUT_MS) {
      throw new Error("Parsing timeout: configuration may be malformed or too complex");
    }
  };

  const config: Record<string, unknown> = {};

  // Remove comments safely
  const lines = lua
    .split("\n")
    .map((line) => {
      checkTimeout();
      // Remove single-line comments, but be careful about strings
      // Simple approach: just find -- outside of quotes
      let inString = false;
      let stringChar = "";
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const prevChar = i > 0 ? line[i - 1] : "";
        
        if (!inString && (char === '"' || char === "'")) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar && prevChar !== "\\") {
          inString = false;
        } else if (!inString && char === "-" && line[i + 1] === "-") {
          return line.substring(0, i);
        }
      }
      return line;
    })
    .join("\n");

  checkTimeout();

  // Parse simple assignments: config.key = value
  // Use a safer regex with limited backtracking
  const simpleAssignmentRegex = /config\.([a-z_][a-z0-9_]*)\s*=\s*([^\n]+)/gi;
  let match;

  while ((match = simpleAssignmentRegex.exec(lines)) !== null) {
    checkTimeout();
    const key = match[1];
    const valueStr = match[2].trim();

    // Check if this is a valid option
    const option = allOptions.find((opt) => opt.id === key);
    if (option) {
      try {
        const value = parseLuaValue(valueStr);
        if (value !== undefined) {
          config[key] = value;
        }
      } catch {
        // Skip values that can't be parsed
        console.warn(`Could not parse value for ${key}:`, valueStr);
      }
    }
  }

  checkTimeout();

  // Parse colors table with non-greedy matching
  const colorsMatch = lines.match(/config\.colors\s*=\s*\{([\s\S]*?)\}/);
  if (colorsMatch) {
    const colorsContent = colorsMatch[1];
    parseColorsTable(colorsContent, config);
  }

  checkTimeout();

  // Parse window_padding table
  const paddingMatch = lines.match(/config\.window_padding\s*=\s*\{([\s\S]*?)\}/);
  if (paddingMatch) {
    const paddingContent = paddingMatch[1];
    parsePaddingTable(paddingContent, config);
  }

  return config;
}

/**
 * Parse a Lua value string into a JavaScript value.
 */
function parseLuaValue(valueStr: string): unknown {
  const trimmed = valueStr.trim();
  
  // Limit input length to prevent DoS
  if (trimmed.length > 10000) {
    return undefined;
  }

  // Boolean
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  // Nil
  if (trimmed === "nil") return undefined;

  // Number (strict pattern to avoid ReDoS)
  if (/^-?\d{1,15}(\.\d{1,15})?$/.test(trimmed)) {
    const num = parseFloat(trimmed);
    if (Number.isFinite(num)) {
      return num;
    }
  }

  // String (double quotes) - use indexOf for safety
  if (trimmed.startsWith('"')) {
    const endQuote = findClosingQuote(trimmed, '"');
    if (endQuote > 0) {
      return unescapeLuaString(trimmed.slice(1, endQuote));
    }
  }

  // String (single quotes)
  if (trimmed.startsWith("'")) {
    const endQuote = findClosingQuote(trimmed, "'");
    if (endQuote > 0) {
      return unescapeLuaString(trimmed.slice(1, endQuote));
    }
  }

  // Simple array of strings (for palettes)
  if (trimmed.startsWith("{")) {
    const endBrace = findMatchingBrace(trimmed);
    if (endBrace > 0) {
      return parseLuaArray(trimmed.slice(0, endBrace + 1));
    }
  }

  return undefined;
}

/**
 * Find the closing quote index, accounting for escapes.
 */
function findClosingQuote(str: string, quote: string): number {
  for (let i = 1; i < str.length; i++) {
    if (str[i] === quote && str[i - 1] !== "\\") {
      return i;
    }
  }
  return -1;
}

/**
 * Find the matching closing brace.
 */
function findMatchingBrace(str: string): number {
  let depth = 0;
  let inString = false;
  let stringChar = "";
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const prevChar = i > 0 ? str[i - 1] : "";
    
    if (!inString && (char === '"' || char === "'")) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar && prevChar !== "\\") {
      inString = false;
    } else if (!inString) {
      if (char === "{") depth++;
      else if (char === "}") {
        depth--;
        if (depth === 0) return i;
      }
    }
  }
  return -1;
}

/**
 * Parse a Lua array/table literal.
 */
function parseLuaArray(arrayStr: string): unknown[] | undefined {
  const content = arrayStr.slice(1, -1).trim();
  if (!content) return [];

  const result: unknown[] = [];
  let i = 0;
  
  while (i < content.length && result.length < 100) { // Limit array size
    // Skip whitespace and commas
    while (i < content.length && /[\s,]/.test(content[i])) i++;
    if (i >= content.length) break;
    
    const char = content[i];
    
    // String value
    if (char === '"' || char === "'") {
      const endQuote = findClosingQuote(content.slice(i), char);
      if (endQuote > 0) {
        result.push(unescapeLuaString(content.slice(i + 1, i + endQuote)));
        i += endQuote + 1;
      } else {
        break; // Malformed
      }
    }
    // Number value
    else if (/[-\d]/.test(char)) {
      let numStr = "";
      while (i < content.length && /[-\d.]/.test(content[i])) {
        numStr += content[i];
        i++;
      }
      const num = parseFloat(numStr);
      if (Number.isFinite(num)) {
        result.push(num);
      }
    }
    // Skip unknown characters
    else {
      i++;
    }
  }

  return result.length > 0 ? result : undefined;
}

/**
 * Parse colors table content.
 */
function parseColorsTable(content: string, config: Record<string, unknown>): void {
  // Parse simple color assignments
  const colorKeys = [
    "foreground", "background", "cursor_bg", "cursor_fg",
    "cursor_border", "selection_bg", "selection_fg",
  ];

  for (const key of colorKeys) {
    // Use a specific pattern to avoid ReDoS
    const regex = new RegExp(`${key}\\s*=\\s*["']([#a-fA-F0-9]{3,8})["']`);
    const match = content.match(regex);
    if (match && isValidColor(match[1])) {
      config[key] = match[1];
    }
  }

  // Parse ansi palette
  const ansiMatch = content.match(/ansi\s*=\s*\{([^}]*)\}/);
  if (ansiMatch) {
    const ansiArray = parseLuaArray(`{${ansiMatch[1]}}`);
    if (ansiArray && ansiArray.length === 8 && ansiArray.every(c => typeof c === "string" && isValidColor(c))) {
      config["ansi"] = ansiArray;
    }
  }

  // Parse brights palette
  const brightsMatch = content.match(/brights\s*=\s*\{([^}]*)\}/);
  if (brightsMatch) {
    const brightsArray = parseLuaArray(`{${brightsMatch[1]}}`);
    if (brightsArray && brightsArray.length === 8 && brightsArray.every(c => typeof c === "string" && isValidColor(c))) {
      config["brights"] = brightsArray;
    }
  }
}

/**
 * Validate color format (hex colors only for security).
 */
function isValidColor(color: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(color);
}

/**
 * Parse window_padding table content.
 */
function parsePaddingTable(content: string, config: Record<string, unknown>): void {
  const paddingKeys = ["left", "right", "top", "bottom"];

  for (const key of paddingKeys) {
    const regex = new RegExp(`${key}\\s*=\\s*(\\d{1,5})`);
    const match = content.match(regex);
    if (match) {
      const value = parseInt(match[1], 10);
      if (value >= 0 && value <= 99999) {
        config[`window_padding_${key}`] = value;
      }
    }
  }
}

/**
 * Unescape Lua string escape sequences.
 */
function unescapeLuaString(str: string): string {
  return str
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}
