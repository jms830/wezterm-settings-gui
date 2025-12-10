"use client";

import { useState } from "react";
import { Check, Palette, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { colorSchemes } from "@/data/color-schemes";
import { useConfigStore } from "@/lib/store/config-store";

export function ThemePicker() {
  const [open, setOpen] = useState(false);
  const appliedTheme = useConfigStore((state) => state.appliedTheme);
  const applyTheme = useConfigStore((state) => state.applyTheme);
  const clearTheme = useConfigStore((state) => state.clearTheme);

  const handleSelectTheme = (themeName: string) => {
    const scheme = colorSchemes.find((s) => s.name === themeName);
    if (scheme) {
      applyTheme(themeName, {
        foreground: scheme.foreground,
        background: scheme.background,
        cursor_bg: scheme.cursor_bg,
        cursor_fg: scheme.cursor_fg,
        cursor_border: scheme.cursor_border,
        selection_bg: scheme.selection_bg,
        selection_fg: scheme.selection_fg,
        ansi: scheme.ansi,
        brights: scheme.brights,
      });
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between min-w-[200px]"
          >
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              {appliedTheme || "Select theme..."}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search themes..." />
            <CommandList>
              <CommandEmpty>No theme found.</CommandEmpty>
              <CommandGroup>
                {colorSchemes.map((scheme) => (
                  <CommandItem
                    key={scheme.name}
                    value={scheme.name}
                    onSelect={handleSelectTheme}
                    className="flex items-center gap-3 py-2"
                  >
                    {/* Color preview */}
                    <div className="flex gap-0.5 rounded overflow-hidden">
                      <div
                        className="w-4 h-6"
                        style={{ backgroundColor: scheme.background }}
                      />
                      <div
                        className="w-4 h-6"
                        style={{ backgroundColor: scheme.foreground }}
                      />
                      <div
                        className="w-4 h-6"
                        style={{ backgroundColor: scheme.ansi[1] }}
                      />
                      <div
                        className="w-4 h-6"
                        style={{ backgroundColor: scheme.ansi[2] }}
                      />
                      <div
                        className="w-4 h-6"
                        style={{ backgroundColor: scheme.ansi[4] }}
                      />
                    </div>
                    <span className="flex-1">{scheme.name}</span>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        appliedTheme === scheme.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {appliedTheme && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearTheme}
          className="text-muted-foreground"
        >
          Clear
        </Button>
      )}
    </div>
  );
}

// Inline theme preview card for the colors category
export function ThemePreviewCard({
  scheme,
  isSelected,
  onSelectAction,
}: {
  scheme: typeof colorSchemes[0];
  isSelected: boolean;
  onSelectAction: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelectAction}
      aria-label={`Select ${scheme.name} theme${isSelected ? " (currently active)" : ""}`}
      aria-pressed={isSelected}
      className={cn(
        "relative flex flex-col rounded-lg border-2 overflow-hidden transition-all hover:scale-105",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-muted-foreground/50"
      )}
    >
      {/* Theme preview */}
      <div
        className="p-3 space-y-1 font-mono text-xs"
        style={{
          backgroundColor: scheme.background,
          color: scheme.foreground,
        }}
      >
        <div className="flex gap-1">
          <span style={{ color: scheme.ansi[4] }}>$</span>
          <span>ls -la</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {scheme.ansi.slice(0, 8).map((color, i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Theme name */}
      <div className="px-3 py-2 bg-card border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{scheme.name}</span>
          {isSelected && (
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

// Grid of theme previews for colors category
export function ThemeGrid() {
  const appliedTheme = useConfigStore((state) => state.appliedTheme);
  const applyTheme = useConfigStore((state) => state.applyTheme);

  const handleSelectTheme = (scheme: typeof colorSchemes[0]) => {
    applyTheme(scheme.name, {
      foreground: scheme.foreground,
      background: scheme.background,
      cursor_bg: scheme.cursor_bg,
      cursor_fg: scheme.cursor_fg,
      cursor_border: scheme.cursor_border,
      selection_bg: scheme.selection_bg,
      selection_fg: scheme.selection_fg,
      ansi: scheme.ansi,
      brights: scheme.brights,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Color Schemes</h3>
          <p className="text-xs text-muted-foreground">
            Choose a pre-built color scheme or customize below
          </p>
        </div>
        <ThemePicker />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {colorSchemes.map((scheme) => (
          <ThemePreviewCard
            key={scheme.name}
            scheme={scheme}
            isSelected={appliedTheme === scheme.name}
            onSelectAction={() => handleSelectTheme(scheme)}
          />
        ))}
      </div>
    </div>
  );
}
