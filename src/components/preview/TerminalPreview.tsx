"use client";

import { useEffect, useRef, useMemo } from "react";
import { Terminal } from "@xterm/xterm";
import { CanvasAddon } from "@xterm/addon-canvas";
import { useConfigStore } from "@/lib/store/config-store";
import "@xterm/xterm/css/xterm.css";

// Map WezTerm cursor styles to xterm cursor styles
function mapCursorStyle(weztermStyle: string): "block" | "underline" | "bar" {
  switch (weztermStyle) {
    case "SteadyBlock":
    case "BlinkingBlock":
      return "block";
    case "SteadyUnderline":
    case "BlinkingUnderline":
      return "underline";
    case "SteadyBar":
    case "BlinkingBar":
      return "bar";
    default:
      return "block";
  }
}

function shouldCursorBlink(weztermStyle: string): boolean {
  return weztermStyle?.startsWith("Blinking") ?? false;
}

// Demo content to display in the terminal preview
const DEMO_CONTENT = `\x1b[1;34m$\x1b[0m ls -la
\x1b[1;36mdrwxr-xr-x\x1b[0m  5 user user 4096 Dec  9 10:30 \x1b[1;34m.\x1b[0m
\x1b[1;36mdrwxr-xr-x\x1b[0m 12 user user 4096 Dec  9 10:30 \x1b[1;34m..\x1b[0m
\x1b[1;36m-rw-r--r--\x1b[0m  1 user user  220 Dec  9 10:30 .bash_logout
\x1b[1;36m-rw-r--r--\x1b[0m  1 user user 3526 Dec  9 10:30 .bashrc
\x1b[1;32m-rwxr-xr-x\x1b[0m  1 user user 8192 Dec  9 10:30 \x1b[1;32mwezterm.lua\x1b[0m

\x1b[1;34m$\x1b[0m echo "Hello, \x1b[1;33mWezTerm\x1b[0m!"
Hello, \x1b[1;33mWezTerm\x1b[0m!

\x1b[1;34m$\x1b[0m cat colors.txt
\x1b[30mBlack\x1b[0m   \x1b[31mRed\x1b[0m     \x1b[32mGreen\x1b[0m   \x1b[33mYellow\x1b[0m
\x1b[34mBlue\x1b[0m    \x1b[35mMagenta\x1b[0m \x1b[36mCyan\x1b[0m    \x1b[37mWhite\x1b[0m

\x1b[1;34m$\x1b[0m \x1b[5m_\x1b[0m`;

// Default ANSI colors as fallback
const DEFAULT_ANSI = [
  "#45475a", "#f38ba8", "#a6e3a1", "#f9e2af",
  "#89b4fa", "#f5c2e7", "#94e2d5", "#bac2de",
];
const DEFAULT_BRIGHTS = [
  "#585b70", "#f38ba8", "#a6e3a1", "#f9e2af",
  "#89b4fa", "#f5c2e7", "#94e2d5", "#a6adc8",
];

export function TerminalPreview() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const isInitializedRef = useRef(false);

  // Get config values with type safety
  const getValue = useConfigStore((state) => state.getValue);

  // Build font family with proper fallbacks for the preview
  // IMPORTANT: xterm.js doesn't resolve CSS variables, so we must use actual font names only
  // Use web-safe monospace fonts as fallbacks
  const configuredFont = (getValue("font_family") as string) || "JetBrains Mono";
  const fontFamily = `"${configuredFont}", "JetBrains Mono", "Cascadia Code", "Fira Code", "SF Mono", Consolas, "Liberation Mono", Menlo, Monaco, "Courier New", monospace`;
  
  const fontSize = (getValue("font_size") as number) || 14;
  const lineHeight = (getValue("line_height") as number) || 1.0;
  const cursorStyle = (getValue("default_cursor_style") as string) || "SteadyBlock";
  const cursorBlinkRate = (getValue("cursor_blink_rate") as number) ?? 500;
  
  // Colors with fallbacks
  const foreground = (getValue("foreground") as string) || "#cdd6f4";
  const background = (getValue("background") as string) || "#1e1e2e";
  const cursorBg = (getValue("cursor_bg") as string) || "#f5e0dc";
  const cursorAccent = (getValue("cursor_fg") as string) || "#1e1e2e";
  const selectionBg = (getValue("selection_bg") as string) || "#45475a";
  const selectionFg = (getValue("selection_fg") as string) || "#cdd6f4";
  
  // Arrays with fallbacks and validation
  const rawAnsi = getValue("ansi");
  const rawBrights = getValue("brights");
  const ansi = Array.isArray(rawAnsi) && rawAnsi.length >= 8 ? rawAnsi as string[] : DEFAULT_ANSI;
  const brights = Array.isArray(rawBrights) && rawBrights.length >= 8 ? rawBrights as string[] : DEFAULT_BRIGHTS;
  
  // Extract individual colors for stable memoization
  const [black, red, green, yellow, blue, magenta, cyan, white] = ansi;
  const [brightBlack, brightRed, brightGreen, brightYellow, brightBlue, brightMagenta, brightCyan, brightWhite] = brights;

  // Build xterm theme from WezTerm colors - memoized to prevent unnecessary updates
  const theme = useMemo(() => ({
    foreground,
    background,
    cursor: cursorBg,
    cursorAccent,
    selectionBackground: selectionBg,
    selectionForeground: selectionFg,
    black,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    white,
    brightBlack,
    brightRed,
    brightGreen,
    brightYellow,
    brightBlue,
    brightMagenta,
    brightCyan,
    brightWhite,
  }), [
    foreground, background, cursorBg, cursorAccent, selectionBg, selectionFg,
    black, red, green, yellow, blue, magenta, cyan, white,
    brightBlack, brightRed, brightGreen, brightYellow, brightBlue, brightMagenta, brightCyan, brightWhite,
  ]);

  // Initialize terminal with proper cleanup to prevent memory leaks
  // This effect intentionally only runs once on mount - config updates are handled by the second useEffect
  useEffect(() => {
    if (!terminalRef.current || isInitializedRef.current) return;
    
    let isMounted = true;
    let terminal: Terminal | null = null;

    const initTerminal = async () => {
      // Wait for fonts to be ready to ensure correct metrics
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn("Font loading check failed", e);
      }
      
      if (!isMounted || !terminalRef.current) return;
      
      isInitializedRef.current = true;

      // Use a larger font for the preview to ensure readability
      // Don't use FitAddon - it causes the font to shrink to fit many columns
      const previewFontSize = Math.max(fontSize, 16); // Minimum 16px for readability
      
      terminal = new Terminal({
        fontFamily,
        fontSize: previewFontSize,
        lineHeight,
        cursorStyle: mapCursorStyle(cursorStyle),
        cursorBlink: shouldCursorBlink(cursorStyle) && cursorBlinkRate > 0,
        theme,
        allowTransparency: true,
        disableStdin: true, // Read-only preview
        rows: 12,  // Fixed rows for consistent preview
        cols: 80,  // Standard terminal width
        letterSpacing: 0,
      });

      const canvasAddon = new CanvasAddon();
      terminal.loadAddon(canvasAddon);
      // Don't use FitAddon - let the terminal be a fixed size for readability

      terminal.open(terminalRef.current);
      
      // Write demo content immediately
      terminal.write(DEMO_CONTENT);

      xtermRef.current = terminal;

      // Force refresh after a short delay to ensure proper rendering
      setTimeout(() => {
        if (isMounted && terminal) {
          terminal.refresh(0, terminal.rows - 1);
        }
      }, 50);
    };
    
    initTerminal();

    return () => {
      isMounted = false;
      isInitializedRef.current = false;
      
      if (terminal) {
        terminal.dispose();
      }
      
      xtermRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - updates handled in separate effect

  // Update terminal options when config changes
  useEffect(() => {
    const terminal = xtermRef.current;
    if (!terminal) return;
    
    terminal.options.fontFamily = fontFamily;
    terminal.options.fontSize = fontSize;
    terminal.options.lineHeight = lineHeight;
    terminal.options.cursorStyle = mapCursorStyle(cursorStyle);
    terminal.options.cursorBlink = shouldCursorBlink(cursorStyle) && cursorBlinkRate > 0;
    terminal.options.theme = theme;
    terminal.options.letterSpacing = 0;

    // Refresh terminal after changes
    requestAnimationFrame(() => {
      terminal.refresh(0, terminal.rows - 1);
    });
  }, [fontFamily, fontSize, lineHeight, cursorStyle, cursorBlinkRate, theme]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b border-border bg-muted/30">
        <h3 className="text-sm font-medium text-foreground">Preview</h3>
      </div>
      <div 
        ref={terminalRef}
        className="flex-1 p-2 min-h-0 overflow-hidden"
        style={{ backgroundColor: background }}
        role="img"
        aria-label="Terminal preview showing your configuration"
      />
    </div>
  );
}
