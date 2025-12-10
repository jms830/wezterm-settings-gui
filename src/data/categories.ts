import {
  Type,
  Palette,
  AppWindow,
  MousePointer2,
  Cpu,
  Keyboard,
  Mouse,
  Clipboard,
  Settings,
  Terminal,
  Wrench,
} from "lucide-react";
import type { Category } from "@/lib/schema/types";

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  icon: typeof Type;
}

export const categories: CategoryInfo[] = [
  {
    id: "fonts",
    name: "Fonts",
    description: "Font family, size, weight, and rendering options",
    icon: Type,
  },
  {
    id: "colors",
    name: "Colors",
    description: "Color schemes, palettes, and theme settings",
    icon: Palette,
  },
  {
    id: "window",
    name: "Window",
    description: "Window decorations, opacity, padding, and tab bar",
    icon: AppWindow,
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "Cursor style, blink rate, and animation",
    icon: MousePointer2,
  },
  {
    id: "gpu",
    name: "GPU",
    description: "Graphics backend, performance, and rendering",
    icon: Cpu,
  },
  {
    id: "keys",
    name: "Keybindings",
    description: "Custom keyboard shortcuts and key tables",
    icon: Keyboard,
  },
  {
    id: "mouse",
    name: "Mouse",
    description: "Mouse behavior, bindings, and scrolling",
    icon: Mouse,
  },
  {
    id: "clipboard",
    name: "Clipboard",
    description: "Copy, paste, and selection behavior",
    icon: Clipboard,
  },
  {
    id: "general",
    name: "General",
    description: "Scrollback, bell, exit behavior, and startup",
    icon: Settings,
  },
  {
    id: "shell",
    name: "Shell",
    description: "Default program, shell integration, and environment",
    icon: Terminal,
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Hyperlinks, SSH domains, and experimental features",
    icon: Wrench,
  },
];

export function getCategoryById(id: Category): CategoryInfo | undefined {
  return categories.find((c) => c.id === id);
}
