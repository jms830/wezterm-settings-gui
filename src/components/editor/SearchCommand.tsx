"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { allOptions } from "@/data/wezterm-options";
import { categories } from "@/data/categories";
import { useConfigStore } from "@/lib/store/config-store";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const setActiveCategory = useConfigStore((state) => state.setActiveCategory);
  const config = useConfigStore((state) => state.config);

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Group options by category
  const groupedOptions = useMemo(() => {
    const groups: Record<string, typeof allOptions> = {};
    for (const option of allOptions) {
      if (!groups[option.category]) {
        groups[option.category] = [];
      }
      groups[option.category].push(option);
    }
    return groups;
  }, []);

  const handleSelect = (optionId: string, category: string) => {
    setActiveCategory(category);
    setOpen(false);
    
    // Scroll to the option after a short delay
    setTimeout(() => {
      const element = document.getElementById(optionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }, 100);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search options...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all options..." />
        <CommandList>
          <CommandEmpty>No options found.</CommandEmpty>
          {categories.map((category) => {
            const categoryOptions = groupedOptions[category.id] || [];
            if (categoryOptions.length === 0) return null;

            return (
              <CommandGroup key={category.id} heading={category.name}>
                {categoryOptions.map((option) => {
                  const isModified = option.id in config;
                  const Icon = category.icon;

                  return (
                    <CommandItem
                      key={option.id}
                      value={`${option.name} ${option.description} ${option.id}`}
                      onSelect={() => handleSelect(option.id, option.category)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option.name}</span>
                          {isModified && (
                            <Badge variant="secondary" className="text-xs">
                              Modified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {option.type}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
