import type {
  ConfigOption,
  StringOption,
  NumberOption,
  BooleanOption,
  EnumOption,
  ColorOption,
  PaletteOption,
  KeybindOption,
  Keybind,
} from "@/lib/schema/types";

// ============================================================================
// Font Options
// ============================================================================

const WEZTERM_DOCS = "https://wezfurlong.org/wezterm/config/lua/config";

const fontOptions: ConfigOption[] = [
  {
    id: "font_family",
    name: "Font Family",
    description: "Primary font for terminal text. Supports fallback fonts separated by commas.",
    type: "string",
    default: "JetBrains Mono",
    category: "fonts",
    placeholder: "JetBrains Mono, Fira Code, monospace",
    docUrl: `${WEZTERM_DOCS}/font.html`,
  } as StringOption,
  {
    id: "font_size",
    name: "Font Size",
    description: "Font size in points.",
    type: "number",
    default: 14.0,
    min: 6,
    max: 72,
    step: 0.5,
    category: "fonts",
    unit: "pt",
    docUrl: `${WEZTERM_DOCS}/font_size.html`,
  } as NumberOption,
  {
    id: "font_weight",
    name: "Font Weight",
    description: "Weight (boldness) of the regular font.",
    type: "enum",
    default: "Regular",
    category: "fonts",
    docUrl: `${WEZTERM_DOCS}/font.html`,
    options: [
      { value: "Thin", label: "Thin" },
      { value: "ExtraLight", label: "Extra Light" },
      { value: "Light", label: "Light" },
      { value: "Regular", label: "Regular" },
      { value: "Medium", label: "Medium" },
      { value: "DemiBold", label: "Demi Bold" },
      { value: "Bold", label: "Bold" },
      { value: "ExtraBold", label: "Extra Bold" },
      { value: "Black", label: "Black" },
    ],
  } as EnumOption,
  {
    id: "font_weight_bold",
    name: "Bold Font Weight",
    description: "Weight for bold text.",
    type: "enum",
    default: "Bold",
    category: "fonts",
    docUrl: `${WEZTERM_DOCS}/font.html`,
    options: [
      { value: "Thin", label: "Thin" },
      { value: "ExtraLight", label: "Extra Light" },
      { value: "Light", label: "Light" },
      { value: "Regular", label: "Regular" },
      { value: "Medium", label: "Medium" },
      { value: "DemiBold", label: "Demi Bold" },
      { value: "Bold", label: "Bold" },
      { value: "ExtraBold", label: "Extra Bold" },
      { value: "Black", label: "Black" },
    ],
  } as EnumOption,
  {
    id: "line_height",
    name: "Line Height",
    description: "Line height multiplier. 1.0 is the default.",
    type: "number",
    default: 1.0,
    min: 0.5,
    max: 2.0,
    step: 0.05,
    category: "fonts",
    docUrl: `${WEZTERM_DOCS}/line_height.html`,
  } as NumberOption,
  {
    id: "cell_width",
    name: "Cell Width",
    description: "Cell width multiplier. 1.0 is the default.",
    type: "number",
    default: 1.0,
    min: 0.5,
    max: 2.0,
    step: 0.05,
    category: "fonts",
    docUrl: `${WEZTERM_DOCS}/cell_width.html`,
  } as NumberOption,
  {
    id: "freetype_load_target",
    name: "FreeType Load Target",
    description: "FreeType font hinting mode for loading glyphs.",
    type: "enum",
    default: "Normal",
    category: "fonts",
    subcategory: "Rendering",
    docUrl: `${WEZTERM_DOCS}/freetype_load_target.html`,
    options: [
      { value: "Normal", label: "Normal", description: "Default hinting" },
      { value: "Light", label: "Light", description: "Lighter hinting" },
      { value: "Mono", label: "Mono", description: "Monochrome hinting" },
      { value: "HorizontalLcd", label: "Horizontal LCD", description: "LCD subpixel rendering" },
    ],
  } as EnumOption,
  {
    id: "freetype_render_target",
    name: "FreeType Render Target",
    description: "FreeType font rendering target.",
    type: "enum",
    default: "Normal",
    category: "fonts",
    subcategory: "Rendering",
    docUrl: `${WEZTERM_DOCS}/freetype_render_target.html`,
    options: [
      { value: "Normal", label: "Normal" },
      { value: "Light", label: "Light" },
      { value: "Mono", label: "Mono" },
      { value: "HorizontalLcd", label: "Horizontal LCD" },
    ],
  } as EnumOption,
];

// ============================================================================
// Color Options
// ============================================================================

const colorOptions: ConfigOption[] = [
  {
    id: "color_scheme",
    name: "Color Scheme",
    description: "Name of the built-in or custom color scheme to use.",
    type: "string",
    default: "",
    category: "colors",
    placeholder: "Catppuccin Mocha",
    docUrl: `${WEZTERM_DOCS}/color_scheme.html`,
  } as StringOption,
  {
    id: "foreground",
    name: "Foreground",
    description: "Default text color.",
    type: "color",
    default: "#cdd6f4",
    category: "colors",
    subcategory: "Base Colors",
    docUrl: `${WEZTERM_DOCS}/colors.html`,
  } as ColorOption,
  {
    id: "background",
    name: "Background",
    description: "Terminal background color.",
    type: "color",
    default: "#1e1e2e",
    category: "colors",
    subcategory: "Base Colors",
    docUrl: `${WEZTERM_DOCS}/colors.html`,
  } as ColorOption,
  {
    id: "cursor_bg",
    name: "Cursor Background",
    description: "Cursor background color.",
    type: "color",
    default: "#f5e0dc",
    category: "colors",
    subcategory: "Cursor Colors",
    docUrl: `${WEZTERM_DOCS}/colors.html`,
  } as ColorOption,
  {
    id: "cursor_fg",
    name: "Cursor Foreground",
    description: "Cursor text color.",
    type: "color",
    default: "#1e1e2e",
    category: "colors",
    subcategory: "Cursor Colors",
    docUrl: `${WEZTERM_DOCS}/colors.html`,
  } as ColorOption,
  {
    id: "cursor_border",
    name: "Cursor Border",
    description: "Cursor border color (for hollow cursor).",
    type: "color",
    default: "#f5e0dc",
    category: "colors",
    subcategory: "Cursor Colors",
    docUrl: `${WEZTERM_DOCS}/colors.html`,
  } as ColorOption,
  {
    id: "selection_bg",
    name: "Selection Background",
    description: "Background color for selected text.",
    type: "color",
    default: "#45475a",
    category: "colors",
    subcategory: "Selection Colors",
    docUrl: `${WEZTERM_DOCS}/colors.html`,
  } as ColorOption,
  {
    id: "selection_fg",
    name: "Selection Foreground",
    description: "Text color for selected text.",
    type: "color",
    default: "#cdd6f4",
    category: "colors",
    subcategory: "Selection Colors",
    docUrl: `${WEZTERM_DOCS}/colors.html`,
  } as ColorOption,
  {
    id: "ansi",
    name: "ANSI Colors",
    description: "The 8 standard ANSI colors (black, red, green, yellow, blue, magenta, cyan, white).",
    type: "palette",
    default: [
      "#45475a", "#f38ba8", "#a6e3a1", "#f9e2af",
      "#89b4fa", "#f5c2e7", "#94e2d5", "#bac2de",
    ],
    size: 8,
    category: "colors",
    subcategory: "ANSI Palette",
    docUrl: `${WEZTERM_DOCS}/colors.html`,
  } as PaletteOption,
  {
    id: "brights",
    name: "Bright Colors",
    description: "The 8 bright ANSI colors.",
    type: "palette",
    default: [
      "#585b70", "#f38ba8", "#a6e3a1", "#f9e2af",
      "#89b4fa", "#f5c2e7", "#94e2d5", "#a6adc8",
    ],
    size: 8,
    category: "colors",
    subcategory: "ANSI Palette",
    docUrl: `${WEZTERM_DOCS}/colors.html`,
  } as PaletteOption,
];

// ============================================================================
// Window Options
// ============================================================================

const windowOptions: ConfigOption[] = [
  {
    id: "window_background_opacity",
    name: "Background Opacity",
    description: "Window background transparency. 1.0 is fully opaque.",
    type: "number",
    default: 1.0,
    min: 0.0,
    max: 1.0,
    step: 0.05,
    category: "window",
    docUrl: `${WEZTERM_DOCS}/window_background_opacity.html`,
  } as NumberOption,
  {
    id: "window_decorations",
    name: "Window Decorations",
    description: "Style of window decorations (title bar, borders).",
    type: "enum",
    default: "FULL",
    category: "window",
    docUrl: `${WEZTERM_DOCS}/window_decorations.html`,
    options: [
      { value: "FULL", label: "Full", description: "Standard title bar and borders" },
      { value: "RESIZE", label: "Resize Only", description: "No title bar, resizable borders" },
      { value: "NONE", label: "None", description: "No decorations" },
      { value: "TITLE", label: "Title Only", description: "Title bar only" },
      { value: "INTEGRATED_BUTTONS|RESIZE", label: "Integrated Buttons", description: "macOS-style integrated buttons" },
    ],
  } as EnumOption,
  {
    id: "window_padding_left",
    name: "Left Padding",
    description: "Padding on the left side of the terminal.",
    type: "number",
    default: 0,
    min: 0,
    max: 100,
    step: 1,
    category: "window",
    subcategory: "Padding",
    unit: "px",
    docUrl: `${WEZTERM_DOCS}/window_padding.html`,
  } as NumberOption,
  {
    id: "window_padding_right",
    name: "Right Padding",
    description: "Padding on the right side of the terminal.",
    type: "number",
    default: 0,
    min: 0,
    max: 100,
    step: 1,
    category: "window",
    subcategory: "Padding",
    unit: "px",
    docUrl: `${WEZTERM_DOCS}/window_padding.html`,
  } as NumberOption,
  {
    id: "window_padding_top",
    name: "Top Padding",
    description: "Padding on the top of the terminal.",
    type: "number",
    default: 0,
    min: 0,
    max: 100,
    step: 1,
    category: "window",
    subcategory: "Padding",
    unit: "px",
    docUrl: `${WEZTERM_DOCS}/window_padding.html`,
  } as NumberOption,
  {
    id: "window_padding_bottom",
    name: "Bottom Padding",
    description: "Padding on the bottom of the terminal.",
    type: "number",
    default: 0,
    min: 0,
    max: 100,
    step: 1,
    category: "window",
    subcategory: "Padding",
    unit: "px",
    docUrl: `${WEZTERM_DOCS}/window_padding.html`,
  } as NumberOption,
  {
    id: "enable_tab_bar",
    name: "Enable Tab Bar",
    description: "Show the tab bar at the top of the window.",
    type: "boolean",
    default: true,
    category: "window",
    subcategory: "Tab Bar",
    docUrl: `${WEZTERM_DOCS}/enable_tab_bar.html`,
  } as BooleanOption,
  {
    id: "hide_tab_bar_if_only_one_tab",
    name: "Hide Tab Bar If Only One Tab",
    description: "Automatically hide the tab bar when only one tab is open.",
    type: "boolean",
    default: false,
    category: "window",
    subcategory: "Tab Bar",
    docUrl: `${WEZTERM_DOCS}/hide_tab_bar_if_only_one_tab.html`,
  } as BooleanOption,
  {
    id: "use_fancy_tab_bar",
    name: "Use Fancy Tab Bar",
    description: "Use the fancy (styled) tab bar instead of the retro one.",
    type: "boolean",
    default: true,
    category: "window",
    subcategory: "Tab Bar",
    docUrl: `${WEZTERM_DOCS}/use_fancy_tab_bar.html`,
  } as BooleanOption,
  {
    id: "tab_bar_at_bottom",
    name: "Tab Bar At Bottom",
    description: "Place the tab bar at the bottom of the window.",
    type: "boolean",
    default: false,
    category: "window",
    subcategory: "Tab Bar",
    docUrl: `${WEZTERM_DOCS}/tab_bar_at_bottom.html`,
  } as BooleanOption,
  {
    id: "tab_max_width",
    name: "Tab Max Width",
    description: "Maximum width of each tab in pixels.",
    type: "number",
    default: 16,
    min: 1,
    max: 100,
    step: 1,
    category: "window",
    subcategory: "Tab Bar",
    docUrl: `${WEZTERM_DOCS}/tab_max_width.html`,
  } as NumberOption,
  {
    id: "show_tab_index_in_tab_bar",
    name: "Show Tab Index",
    description: "Show the tab number in the tab bar.",
    type: "boolean",
    default: false,
    category: "window",
    subcategory: "Tab Bar",
    docUrl: `${WEZTERM_DOCS}/show_tab_index_in_tab_bar.html`,
  } as BooleanOption,
  {
    id: "window_close_confirmation",
    name: "Close Confirmation",
    description: "Whether to prompt before closing a window with multiple tabs.",
    type: "enum",
    default: "AlwaysPrompt",
    category: "window",
    docUrl: `${WEZTERM_DOCS}/window_close_confirmation.html`,
    options: [
      { value: "AlwaysPrompt", label: "Always Prompt" },
      { value: "NeverPrompt", label: "Never Prompt" },
    ],
  } as EnumOption,
  {
    id: "initial_cols",
    name: "Initial Columns",
    description: "Initial number of columns for new windows.",
    type: "number",
    default: 80,
    min: 20,
    max: 500,
    step: 1,
    category: "window",
    subcategory: "Size",
    docUrl: `${WEZTERM_DOCS}/initial_cols.html`,
  } as NumberOption,
  {
    id: "initial_rows",
    name: "Initial Rows",
    description: "Initial number of rows for new windows.",
    type: "number",
    default: 24,
    min: 5,
    max: 200,
    step: 1,
    category: "window",
    subcategory: "Size",
    docUrl: `${WEZTERM_DOCS}/initial_rows.html`,
  } as NumberOption,
];

// ============================================================================
// Cursor Options
// ============================================================================

const cursorOptions: ConfigOption[] = [
  {
    id: "default_cursor_style",
    name: "Cursor Style",
    description: "The shape and behavior of the cursor.",
    type: "enum",
    default: "SteadyBlock",
    category: "cursor",
    docUrl: `${WEZTERM_DOCS}/default_cursor_style.html`,
    options: [
      { value: "SteadyBlock", label: "Steady Block" },
      { value: "BlinkingBlock", label: "Blinking Block" },
      { value: "SteadyUnderline", label: "Steady Underline" },
      { value: "BlinkingUnderline", label: "Blinking Underline" },
      { value: "SteadyBar", label: "Steady Bar" },
      { value: "BlinkingBar", label: "Blinking Bar" },
    ],
  } as EnumOption,
  {
    id: "cursor_blink_rate",
    name: "Blink Rate",
    description: "Cursor blink rate in milliseconds. 0 disables blinking.",
    type: "number",
    default: 500,
    min: 0,
    max: 2000,
    step: 50,
    category: "cursor",
    unit: "ms",
    docUrl: `${WEZTERM_DOCS}/cursor_blink_rate.html`,
  } as NumberOption,
  {
    id: "cursor_blink_ease_in",
    name: "Blink Ease In",
    description: "Easing function for cursor fade-in.",
    type: "enum",
    default: "EaseIn",
    category: "cursor",
    subcategory: "Animation",
    docUrl: `${WEZTERM_DOCS}/cursor_blink_ease_in.html`,
    options: [
      { value: "Linear", label: "Linear" },
      { value: "EaseIn", label: "Ease In" },
      { value: "EaseOut", label: "Ease Out" },
      { value: "EaseInOut", label: "Ease In/Out" },
      { value: "Constant", label: "Constant" },
    ],
  } as EnumOption,
  {
    id: "cursor_blink_ease_out",
    name: "Blink Ease Out",
    description: "Easing function for cursor fade-out.",
    type: "enum",
    default: "EaseOut",
    category: "cursor",
    subcategory: "Animation",
    docUrl: `${WEZTERM_DOCS}/cursor_blink_ease_out.html`,
    options: [
      { value: "Linear", label: "Linear" },
      { value: "EaseIn", label: "Ease In" },
      { value: "EaseOut", label: "Ease Out" },
      { value: "EaseInOut", label: "Ease In/Out" },
      { value: "Constant", label: "Constant" },
    ],
  } as EnumOption,
  {
    id: "animation_fps",
    name: "Animation FPS",
    description: "Frames per second for cursor and other animations.",
    type: "number",
    default: 60,
    min: 1,
    max: 120,
    step: 1,
    category: "cursor",
    subcategory: "Animation",
    docUrl: `${WEZTERM_DOCS}/animation_fps.html`,
  } as NumberOption,
  {
    id: "force_reverse_video_cursor",
    name: "Force Reverse Video Cursor",
    description: "Always use reverse video for cursor, ignoring color settings.",
    type: "boolean",
    default: false,
    category: "cursor",
    docUrl: `${WEZTERM_DOCS}/force_reverse_video_cursor.html`,
  } as BooleanOption,
];

// ============================================================================
// GPU Options
// ============================================================================

const gpuOptions: ConfigOption[] = [
  {
    id: "front_end",
    name: "Graphics Frontend",
    description: "The graphics API to use for rendering.",
    type: "enum",
    default: "WebGpu",
    category: "gpu",
    docUrl: `${WEZTERM_DOCS}/front_end.html`,
    options: [
      { value: "WebGpu", label: "WebGPU", description: "Modern, fastest option (recommended)" },
      { value: "OpenGL", label: "OpenGL", description: "Legacy graphics API" },
      { value: "Software", label: "Software", description: "CPU rendering (slowest)" },
    ],
  } as EnumOption,
  {
    id: "webgpu_power_preference",
    name: "Power Preference",
    description: "GPU power preference for WebGPU.",
    type: "enum",
    default: "HighPerformance",
    category: "gpu",
    docUrl: `${WEZTERM_DOCS}/webgpu_power_preference.html`,
    options: [
      { value: "HighPerformance", label: "High Performance", description: "Use discrete GPU" },
      { value: "LowPower", label: "Low Power", description: "Use integrated GPU" },
    ],
  } as EnumOption,
  {
    id: "max_fps",
    name: "Max FPS",
    description: "Maximum frames per second for rendering.",
    type: "number",
    default: 60,
    min: 1,
    max: 240,
    step: 1,
    category: "gpu",
    docUrl: `${WEZTERM_DOCS}/max_fps.html`,
  } as NumberOption,
];

// ============================================================================
// General Options
// ============================================================================

const generalOptions: ConfigOption[] = [
  {
    id: "scrollback_lines",
    name: "Scrollback Lines",
    description: "Number of lines to keep in scrollback buffer.",
    type: "number",
    default: 3500,
    min: 0,
    max: 100000,
    step: 500,
    category: "general",
    docUrl: `${WEZTERM_DOCS}/scrollback_lines.html`,
  } as NumberOption,
  {
    id: "enable_scroll_bar",
    name: "Enable Scroll Bar",
    description: "Show a scroll bar on the right side.",
    type: "boolean",
    default: false,
    category: "general",
    docUrl: `${WEZTERM_DOCS}/enable_scroll_bar.html`,
  } as BooleanOption,
  {
    id: "audible_bell",
    name: "Audible Bell",
    description: "Play a sound when the terminal bell is triggered.",
    type: "enum",
    default: "SystemBeep",
    category: "general",
    docUrl: `${WEZTERM_DOCS}/audible_bell.html`,
    options: [
      { value: "SystemBeep", label: "System Beep" },
      { value: "Disabled", label: "Disabled" },
    ],
  } as EnumOption,
  {
    id: "visual_bell",
    name: "Visual Bell",
    description: "Flash the screen when the terminal bell is triggered.",
    type: "enum",
    default: "Disabled",
    category: "general",
    docUrl: `${WEZTERM_DOCS}/visual_bell.html`,
    options: [
      { value: "Disabled", label: "Disabled" },
      { value: "FadeIn", label: "Fade In" },
      { value: "FadeOut", label: "Fade Out" },
      { value: "Bounce", label: "Bounce" },
    ],
  } as EnumOption,
  {
    id: "automatically_reload_config",
    name: "Auto Reload Config",
    description: "Automatically reload configuration when the file changes.",
    type: "boolean",
    default: true,
    category: "general",
    docUrl: `${WEZTERM_DOCS}/automatically_reload_config.html`,
  } as BooleanOption,
  {
    id: "check_for_updates",
    name: "Check for Updates",
    description: "Periodically check for WezTerm updates.",
    type: "boolean",
    default: true,
    category: "general",
    docUrl: `${WEZTERM_DOCS}/check_for_updates.html`,
  } as BooleanOption,
  {
    id: "exit_behavior",
    name: "Exit Behavior",
    description: "What to do when the shell exits.",
    type: "enum",
    default: "CloseOnCleanExit",
    category: "general",
    docUrl: `${WEZTERM_DOCS}/exit_behavior.html`,
    options: [
      { value: "Close", label: "Close", description: "Always close the pane" },
      { value: "Hold", label: "Hold", description: "Keep the pane open" },
      { value: "CloseOnCleanExit", label: "Close on Clean Exit", description: "Close if exit code is 0" },
    ],
  } as EnumOption,
];

// ============================================================================
// Shell Options
// ============================================================================

const shellOptions: ConfigOption[] = [
  {
    id: "default_prog",
    name: "Default Program",
    description: "The program to run in new tabs/windows. Leave empty for default shell.",
    type: "string",
    default: "",
    category: "shell",
    placeholder: "/bin/zsh",
    docUrl: `${WEZTERM_DOCS}/default_prog.html`,
  } as StringOption,
  {
    id: "default_cwd",
    name: "Default Working Directory",
    description: "Starting directory for new tabs/windows.",
    type: "string",
    default: "",
    category: "shell",
    placeholder: "~",
    docUrl: `${WEZTERM_DOCS}/default_cwd.html`,
  } as StringOption,
  {
    id: "term",
    name: "TERM Variable",
    description: "Value of the TERM environment variable.",
    type: "string",
    default: "xterm-256color",
    category: "shell",
    docUrl: `${WEZTERM_DOCS}/term.html`,
  } as StringOption,
];

// ============================================================================
// Keybinding Options
// ============================================================================

const defaultKeybinds: Keybind[] = [
  // Tab management
  { key: "t", mods: ["CTRL", "SHIFT"], action: "SpawnTab", actionArgs: { domain: "CurrentPaneDomain" } },
  { key: "w", mods: ["CTRL", "SHIFT"], action: "CloseCurrentTab", actionArgs: { confirm: true } },
  { key: "Tab", mods: ["CTRL"], action: "ActivateTabRelative", actionArgs: { offset: 1 } },
  { key: "Tab", mods: ["CTRL", "SHIFT"], action: "ActivateTabRelative", actionArgs: { offset: -1 } },
  // Pane management
  { key: "%", mods: ["CTRL", "SHIFT", "ALT"], action: "SplitHorizontal", actionArgs: { domain: "CurrentPaneDomain" } },
  { key: '"', mods: ["CTRL", "SHIFT", "ALT"], action: "SplitVertical", actionArgs: { domain: "CurrentPaneDomain" } },
  { key: "LeftArrow", mods: ["CTRL", "SHIFT"], action: "ActivatePaneDirection", actionArgs: { direction: "Left" } },
  { key: "RightArrow", mods: ["CTRL", "SHIFT"], action: "ActivatePaneDirection", actionArgs: { direction: "Right" } },
  { key: "UpArrow", mods: ["CTRL", "SHIFT"], action: "ActivatePaneDirection", actionArgs: { direction: "Up" } },
  { key: "DownArrow", mods: ["CTRL", "SHIFT"], action: "ActivatePaneDirection", actionArgs: { direction: "Down" } },
  // Copy/Paste
  { key: "c", mods: ["CTRL", "SHIFT"], action: "CopyTo", actionArgs: { destination: "Clipboard" } },
  { key: "v", mods: ["CTRL", "SHIFT"], action: "PasteFrom", actionArgs: { source: "Clipboard" } },
  // Font size
  { key: "+", mods: ["CTRL"], action: "IncreaseFontSize" },
  { key: "-", mods: ["CTRL"], action: "DecreaseFontSize" },
  { key: "0", mods: ["CTRL"], action: "ResetFontSize" },
  // Search
  { key: "f", mods: ["CTRL", "SHIFT"], action: "Search", actionArgs: { CaseSensitiveString: "" } },
  // Command palette
  { key: "p", mods: ["CTRL", "SHIFT"], action: "ActivateCommandPalette" },
];

const keybindOptions: ConfigOption[] = [
  {
    id: "keys",
    name: "Keybindings",
    description: "Custom keyboard shortcuts.",
    type: "keybind",
    default: defaultKeybinds,
    category: "keys",
    docUrl: "https://wezfurlong.org/wezterm/config/keys.html",
  } as KeybindOption,
  {
    id: "disable_default_key_bindings",
    name: "Disable Default Keybindings",
    description: "Disable all built-in keybindings. You'll need to define your own.",
    type: "boolean",
    default: false,
    category: "keys",
    docUrl: `${WEZTERM_DOCS}/disable_default_key_bindings.html`,
  } as BooleanOption,
  {
    id: "leader",
    name: "Leader Key",
    description: "Key combination that acts as a prefix for other shortcuts.",
    type: "string",
    default: "",
    category: "keys",
    placeholder: "CTRL+a",
    docUrl: `${WEZTERM_DOCS}/leader.html`,
  } as StringOption,
];

// ============================================================================
// Advanced Options
// ============================================================================

const advancedOptions: ConfigOption[] = [
  {
    id: "enable_wayland",
    name: "Enable Wayland",
    description: "Use Wayland instead of X11 on Linux.",
    type: "boolean",
    default: true,
    category: "advanced",
    platform: ["linux"],
    docUrl: `${WEZTERM_DOCS}/enable_wayland.html`,
  } as BooleanOption,
  {
    id: "hyperlink_rules",
    name: "Hyperlink Rules",
    description: "Enable automatic URL detection and hyperlinking.",
    type: "boolean",
    default: true,
    category: "advanced",
    note: "Uses default URL regex patterns",
    docUrl: `${WEZTERM_DOCS}/hyperlink_rules.html`,
  } as BooleanOption,
  {
    id: "warn_about_missing_glyphs",
    name: "Warn About Missing Glyphs",
    description: "Show warnings when fonts are missing glyphs.",
    type: "boolean",
    default: true,
    category: "advanced",
    docUrl: `${WEZTERM_DOCS}/warn_about_missing_glyphs.html`,
  } as BooleanOption,
  {
    id: "adjust_window_size_when_changing_font_size",
    name: "Adjust Window Size on Font Change",
    description: "Resize window when font size changes to keep same cell count.",
    type: "boolean",
    default: true,
    category: "advanced",
    docUrl: `${WEZTERM_DOCS}/adjust_window_size_when_changing_font_size.html`,
  } as BooleanOption,
  {
    id: "use_ime",
    name: "Enable IME",
    description: "Enable Input Method Editor for international text input.",
    type: "boolean",
    default: true,
    category: "advanced",
    docUrl: `${WEZTERM_DOCS}/use_ime.html`,
  } as BooleanOption,
  {
    id: "hide_mouse_cursor_when_typing",
    name: "Hide Mouse When Typing",
    description: "Hide the mouse cursor while typing.",
    type: "boolean",
    default: true,
    category: "advanced",
    docUrl: `${WEZTERM_DOCS}/hide_mouse_cursor_when_typing.html`,
  } as BooleanOption,
];

// ============================================================================
// Export All Options
// ============================================================================

export const allOptions: ConfigOption[] = [
  ...fontOptions,
  ...colorOptions,
  ...windowOptions,
  ...cursorOptions,
  ...gpuOptions,
  ...generalOptions,
  ...shellOptions,
  ...keybindOptions,
  ...advancedOptions,
];

// Pre-computed maps for O(1) lookups
const optionsByCategory: Map<string, ConfigOption[]> = new Map();
const optionsById: Map<string, ConfigOption> = new Map();

// Initialize maps once at module load
for (const option of allOptions) {
  // Build category map
  const categoryOptions = optionsByCategory.get(option.category) || [];
  categoryOptions.push(option);
  optionsByCategory.set(option.category, categoryOptions);
  
  // Build id map
  optionsById.set(option.id, option);
}

// Helper functions - now O(1) instead of O(n)
export function getOptionsByCategory(category: string): ConfigOption[] {
  return optionsByCategory.get(category) || [];
}

export function getOptionById(id: string): ConfigOption | undefined {
  return optionsById.get(id);
}

export function getDefaultValues(): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const option of allOptions) {
    defaults[option.id] = option.default;
  }
  return defaults;
}

export function getDefaultValue(id: string): unknown {
  const option = getOptionById(id);
  return option?.default;
}
