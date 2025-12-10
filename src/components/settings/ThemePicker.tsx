"use client";

import { useState, useMemo } from "react";
import { Check, Palette, ChevronDown, Plus, Search } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { colorSchemes } from "@/data/color-schemes";
import { extendedThemes } from "@/data/wezterm-themes";
import { useConfigStore } from "@/lib/store/config-store";
import type { ColorScheme } from "@/lib/schema/types";

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

// Browse More Themes Dialog
function BrowseThemesDialog({ onSelectTheme }: { onSelectTheme: (scheme: ColorScheme) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const appliedTheme = useConfigStore((state) => state.appliedTheme);

  // Combine all themes and filter by search
  const allThemes = useMemo(() => {
    const combined = [...colorSchemes, ...extendedThemes];
    // Remove duplicates by name
    const uniqueMap = new Map<string, ColorScheme>();
    combined.forEach(theme => uniqueMap.set(theme.name, theme));
    return Array.from(uniqueMap.values());
  }, []);

  const filteredThemes = useMemo(() => {
    if (!search.trim()) return allThemes;
    const lowerSearch = search.toLowerCase();
    return allThemes.filter(theme => 
      theme.name.toLowerCase().includes(lowerSearch)
    );
  }, [allThemes, search]);

  const handleSelect = (scheme: ColorScheme) => {
    onSelectTheme(scheme);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50 transition-all min-h-[100px]"
          aria-label="Browse more themes"
        >
          <Plus className="h-8 w-8 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground">Browse More</span>
          <span className="text-xs text-muted-foreground/70">{extendedThemes.length}+ themes</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Browse WezTerm Themes</DialogTitle>
          <DialogDescription>
            Choose from {allThemes.length} color schemes. Themes sourced from WezTerm&apos;s built-in collection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search themes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[50vh] pr-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-4">
            {filteredThemes.map((scheme) => (
              <ThemePreviewCard
                key={scheme.name}
                scheme={scheme}
                isSelected={appliedTheme === scheme.name}
                onSelectAction={() => handleSelect(scheme)}
              />
            ))}
          </div>
          {filteredThemes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No themes found matching &quot;{search}&quot;
            </div>
          )}
        </ScrollArea>

        <div className="text-xs text-muted-foreground text-center">
          Full theme list available at{" "}
          <a 
            href="https://wezfurlong.org/wezterm/colorschemes/index.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            wezfurlong.org/wezterm/colorschemes
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Grid of theme previews for colors category
export function ThemeGrid() {
  const appliedTheme = useConfigStore((state) => state.appliedTheme);
  const applyTheme = useConfigStore((state) => state.applyTheme);

  const handleSelectTheme = (scheme: ColorScheme) => {
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
        {/* Browse More Themes - First card */}
        <BrowseThemesDialog onSelectTheme={handleSelectTheme} />
        
        {/* Curated themes */}
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
