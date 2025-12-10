"use client";

import { ExternalLink, GitBranch, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/data/categories";
import { useConfigStore } from "@/lib/store/config-store";
import { getOptionsByCategory } from "@/data/wezterm-options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchCommand } from "./SearchCommand";

export function Sidebar() {
  const activeCategory = useConfigStore((state) => state.activeCategory);
  const setActiveCategory = useConfigStore((state) => state.setActiveCategory);
  const config = useConfigStore((state) => state.config);

  // Count modified options per category
  const getModifiedCount = (categoryId: string): number => {
    const categoryOptions = getOptionsByCategory(categoryId);
    return categoryOptions.filter((opt) => opt.id in config).length;
  };

  return (
    <aside className="w-64 border-r border-border bg-muted/30 flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">WezTerm</h1>
            <p className="text-xs text-muted-foreground">Configuration Editor</p>
          </div>
        </div>
      </div>

      <div className="p-2 border-b border-border">
        <SearchCommand />
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          const modifiedCount = getModifiedCount(category.id);

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left">{category.name}</span>
              {modifiedCount > 0 && (
                <Badge
                  variant={isActive ? "secondary" : "outline"}
                  className="h-5 min-w-5 px-1.5 text-xs"
                >
                  {modifiedCount}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <div className="text-xs text-muted-foreground">
          {Object.keys(config).length} option
          {Object.keys(config).length !== 1 ? "s" : ""} modified
        </div>

        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 text-xs text-muted-foreground hover:text-foreground"
            asChild
          >
            <a
              href="https://wezfurlong.org/wezterm/config/files.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3 mr-2" />
              WezTerm Docs
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 text-xs text-muted-foreground hover:text-foreground"
            asChild
          >
            <a
              href="https://github.com/jms830/wezterm-settings-gui"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitBranch className="h-3 w-3 mr-2" />
              Source Code
            </a>
          </Button>
        </div>
      </div>
    </aside>
  );
}
