// WezTerm Config Option Type Definitions
// Mirrors Spectre's discriminated union approach

export type OptionType =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "color"
  | "palette"
  | "keybind"
  | "duration"
  | "font"
  | "padding";

export type Category =
  | "fonts"
  | "colors"
  | "window"
  | "cursor"
  | "gpu"
  | "keys"
  | "general"
  | "shell"
  | "advanced";

export type Platform = "macos" | "linux" | "windows";

// Base interface all options share
export interface BaseConfigOption {
  id: string;
  name: string;
  description: string;
  type: OptionType;
  category: Category;
  subcategory?: string;
  platform?: Platform[];
  sinceVersion?: string;
  deprecated?: boolean;
  note?: string;
  hidden?: boolean;
  // Lua generation helpers
  luaKey?: string;
  luaTransform?: (value: unknown) => string;
}

// Type-specific extensions
export interface StringOption extends BaseConfigOption {
  type: "string";
  default: string;
  placeholder?: string;
  repeatable?: boolean;
}

export interface NumberOption extends BaseConfigOption {
  type: "number";
  default: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface BooleanOption extends BaseConfigOption {
  type: "boolean";
  default: boolean;
}

export interface EnumOption extends BaseConfigOption {
  type: "enum";
  default: string;
  options: { value: string; label: string; description?: string }[];
}

export interface ColorOption extends BaseConfigOption {
  type: "color";
  default: string;
}

export interface PaletteOption extends BaseConfigOption {
  type: "palette";
  default: string[];
  size: number; // 8 for ansi, 8 for brights
}

export interface KeybindOption extends BaseConfigOption {
  type: "keybind";
  default: Keybind[];
}

export interface DurationOption extends BaseConfigOption {
  type: "duration";
  default: number;
  min?: number;
  max?: number;
  unit: "ms" | "s";
}

export interface FontOption extends BaseConfigOption {
  type: "font";
  default: FontConfig;
}

export interface PaddingOption extends BaseConfigOption {
  type: "padding";
  default: PaddingConfig;
}

// Union type for all options
export type ConfigOption =
  | StringOption
  | NumberOption
  | BooleanOption
  | EnumOption
  | ColorOption
  | PaletteOption
  | KeybindOption
  | DurationOption
  | FontOption
  | PaddingOption;

// Supporting types
export interface Keybind {
  key: string;
  mods?: string[];
  action: string;
  actionArgs?: Record<string, unknown>;
}

export interface FontConfig {
  family: string;
  weight?: string;
  style?: string;
  harfbuzz_features?: string[];
}

export interface PaddingConfig {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface TabColors {
  bg_color: string;
  fg_color: string;
  intensity?: string;
  underline?: string;
  italic?: boolean;
  strikethrough?: boolean;
}

export interface TabBarColors {
  background: string;
  active_tab: TabColors;
  inactive_tab: TabColors;
  inactive_tab_hover: TabColors;
  new_tab: TabColors;
  new_tab_hover: TabColors;
}

// Color scheme structure
export interface ColorScheme {
  name: string;
  foreground: string;
  background: string;
  cursor_bg: string;
  cursor_fg: string;
  cursor_border: string;
  selection_bg: string;
  selection_fg: string;
  ansi: string[];
  brights: string[];
  tab_bar?: TabBarColors;
}

// Config values stored in state
export type ConfigValues = Record<string, unknown>;
