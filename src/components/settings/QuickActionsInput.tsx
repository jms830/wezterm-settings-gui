"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Copy,
  ClipboardPaste,
  SplitSquareHorizontal,
  SplitSquareVertical,
  Search,
  Plus,
  Minus,
  RotateCcw,
  Command,
  PanelLeft,
  X,
  Keyboard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useConfigStore } from "@/lib/store/config-store";
import type { Keybind } from "@/lib/schema/types";

// Define common actions with their default keybindings
interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: "clipboard" | "panes" | "tabs" | "navigation" | "font" | "search";
  defaultKeybind: Keybind;
}

const QUICK_ACTIONS: QuickAction[] = [
  // Clipboard
  {
    id: "copy",
    name: "Copy",
    description: "Copy selected text to clipboard",
    icon: Copy,
    category: "clipboard",
    defaultKeybind: { key: "c", mods: ["CTRL", "SHIFT"], action: "CopyTo", actionArgs: { destination: "Clipboard" } },
  },
  {
    id: "paste",
    name: "Paste",
    description: "Paste from clipboard",
    icon: ClipboardPaste,
    category: "clipboard",
    defaultKeybind: { key: "v", mods: ["CTRL", "SHIFT"], action: "PasteFrom", actionArgs: { source: "Clipboard" } },
  },
  // Panes
  {
    id: "split_horizontal",
    name: "Split Horizontal",
    description: "Split pane horizontally",
    icon: SplitSquareHorizontal,
    category: "panes",
    defaultKeybind: { key: "%", mods: ["CTRL", "SHIFT", "ALT"], action: "SplitHorizontal", actionArgs: { domain: "CurrentPaneDomain" } },
  },
  {
    id: "split_vertical",
    name: "Split Vertical",
    description: "Split pane vertically",
    icon: SplitSquareVertical,
    category: "panes",
    defaultKeybind: { key: '"', mods: ["CTRL", "SHIFT", "ALT"], action: "SplitVertical", actionArgs: { domain: "CurrentPaneDomain" } },
  },
  {
    id: "close_pane",
    name: "Close Pane",
    description: "Close current pane",
    icon: X,
    category: "panes",
    defaultKeybind: { key: "w", mods: ["CTRL", "SHIFT"], action: "CloseCurrentPane", actionArgs: { confirm: true } },
  },
  {
    id: "navigate_panes",
    name: "Navigate Panes",
    description: "Move between panes with arrow keys",
    icon: PanelLeft,
    category: "panes",
    defaultKeybind: { key: "LeftArrow", mods: ["CTRL", "SHIFT"], action: "ActivatePaneDirection", actionArgs: { direction: "Left" } },
  },
  // Tabs
  {
    id: "new_tab",
    name: "New Tab",
    description: "Open a new tab",
    icon: Plus,
    category: "tabs",
    defaultKeybind: { key: "t", mods: ["CTRL", "SHIFT"], action: "SpawnTab", actionArgs: { domain: "CurrentPaneDomain" } },
  },
  {
    id: "close_tab",
    name: "Close Tab",
    description: "Close current tab",
    icon: X,
    category: "tabs",
    defaultKeybind: { key: "w", mods: ["CTRL", "SHIFT"], action: "CloseCurrentTab", actionArgs: { confirm: true } },
  },
  // Font
  {
    id: "increase_font",
    name: "Increase Font",
    description: "Increase font size",
    icon: Plus,
    category: "font",
    defaultKeybind: { key: "+", mods: ["CTRL"], action: "IncreaseFontSize" },
  },
  {
    id: "decrease_font",
    name: "Decrease Font",
    description: "Decrease font size",
    icon: Minus,
    category: "font",
    defaultKeybind: { key: "-", mods: ["CTRL"], action: "DecreaseFontSize" },
  },
  {
    id: "reset_font",
    name: "Reset Font",
    description: "Reset font size to default",
    icon: RotateCcw,
    category: "font",
    defaultKeybind: { key: "0", mods: ["CTRL"], action: "ResetFontSize" },
  },
  // Search & Commands
  {
    id: "search",
    name: "Search",
    description: "Search in terminal",
    icon: Search,
    category: "search",
    defaultKeybind: { key: "f", mods: ["CTRL", "SHIFT"], action: "Search", actionArgs: { CaseSensitiveString: "" } },
  },
  {
    id: "command_palette",
    name: "Command Palette",
    description: "Open command palette",
    icon: Command,
    category: "search",
    defaultKeybind: { key: "p", mods: ["CTRL", "SHIFT"], action: "ActivateCommandPalette" },
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  clipboard: "Clipboard",
  panes: "Pane Management",
  tabs: "Tab Management",
  font: "Font Size",
  search: "Search & Commands",
  navigation: "Navigation",
};

function formatKeybind(keybind: Keybind): string {
  const mods = keybind.mods?.join("+") || "";
  return mods ? `${mods}+${keybind.key}` : keybind.key;
}

// Check if a keybind matches an action (by action name)
function keybindMatchesAction(keybind: Keybind, action: QuickAction): boolean {
  return keybind.action === action.defaultKeybind.action;
}

export function QuickActionsInput() {
  const [mounted, setMounted] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["clipboard", "panes"])
  );

  const keybinds = useConfigStore((state) => state.getValue("keys")) as Keybind[];
  const setValue = useConfigStore((state) => state.setValue);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate which actions are enabled based on current keybinds
  const enabledActions = useMemo(() => {
    const enabled = new Set<string>();
    for (const action of QUICK_ACTIONS) {
      const hasKeybind = keybinds.some((kb) => keybindMatchesAction(kb, action));
      if (hasKeybind) {
        enabled.add(action.id);
      }
    }
    return enabled;
  }, [keybinds]);

  const toggleAction = (action: QuickAction) => {
    const isEnabled = enabledActions.has(action.id);
    
    if (isEnabled) {
      // Remove keybind(s) for this action
      const newKeybinds = keybinds.filter((kb) => !keybindMatchesAction(kb, action));
      setValue("keys", newKeybinds);
    } else {
      // Add the default keybind for this action
      const newKeybinds = [...keybinds, action.defaultKeybind];
      setValue("keys", newKeybinds);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Group actions by category
  const actionsByCategory = useMemo(() => {
    const grouped: Record<string, QuickAction[]> = {};
    for (const action of QUICK_ACTIONS) {
      if (!grouped[action.category]) {
        grouped[action.category] = [];
      }
      grouped[action.category].push(action);
    }
    return grouped;
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted/50 rounded-md animate-pulse" />
      </div>
    );
  }

  const categoryOrder = ["clipboard", "panes", "tabs", "font", "search"];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Keyboard className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Quickly enable or disable common keyboard shortcuts
        </p>
      </div>

      {categoryOrder.map((category) => {
        const actions = actionsByCategory[category];
        if (!actions) return null;

        const enabledCount = actions.filter((a) => enabledActions.has(a.id)).length;
        const isExpanded = expandedCategories.has(category);

        return (
          <Collapsible
            key={category}
            open={isExpanded}
            onOpenChange={() => toggleCategory(category)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-3 py-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {CATEGORY_LABELS[category]}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {enabledCount}/{actions.length}
                  </Badge>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border rounded-md divide-y divide-border mt-2">
                {actions.map((action) => {
                  const Icon = action.icon;
                  const isEnabled = enabledActions.has(action.id);

                  return (
                    <div
                      key={action.id}
                      className="flex items-center justify-between p-3 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <Label
                            htmlFor={`action-${action.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {action.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-xs">
                          {formatKeybind(action.defaultKeybind)}
                        </Badge>
                        <Switch
                          id={`action-${action.id}`}
                          checked={isEnabled}
                          onCheckedChange={() => toggleAction(action)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}

      <p className="text-xs text-muted-foreground mt-4">
        These shortcuts use WezTerm defaults. For custom key combinations, use the Keybindings editor below.
      </p>
    </div>
  );
}
