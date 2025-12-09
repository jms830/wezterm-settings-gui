"use client";

import { useMemo } from "react";
import { useConfigStore } from "@/lib/store/config-store";
import { getOptionsByCategory } from "@/data/wezterm-options";
import { getCategoryById } from "@/data/categories";
import { SettingRenderer } from "@/components/settings/SettingRenderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeGrid } from "@/components/settings/ThemePicker";

export function SettingsPanel() {
  const activeCategory = useConfigStore((state) => state.activeCategory);
  
  const categoryInfo = getCategoryById(activeCategory as Parameters<typeof getCategoryById>[0]);
  
  const options = useMemo(
    () => getOptionsByCategory(activeCategory),
    [activeCategory]
  );

  // Group options by subcategory
  const groupedOptions = useMemo(() => {
    const groups: Record<string, typeof options> = {};
    const noSubcategory: typeof options = [];

    for (const option of options) {
      if (option.subcategory) {
        if (!groups[option.subcategory]) {
          groups[option.subcategory] = [];
        }
        groups[option.subcategory].push(option);
      } else {
        noSubcategory.push(option);
      }
    }

    return { groups, noSubcategory };
  }, [options]);

  if (!categoryInfo) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a category
      </div>
    );
  }

  const Icon = categoryInfo.icon;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {categoryInfo.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {categoryInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6 pb-8 space-y-8">
          {/* Theme Grid for colors category */}
          {activeCategory === "colors" && (
            <ThemeGrid />
          )}

          {/* Options without subcategory */}
          {groupedOptions.noSubcategory.length > 0 && (
            <div className="space-y-1">
              {groupedOptions.noSubcategory.map((option) => (
                <SettingRenderer key={option.id} option={option} />
              ))}
            </div>
          )}

          {/* Options grouped by subcategory */}
          {Object.entries(groupedOptions.groups).map(([subcategory, opts]) => (
            <div key={subcategory}>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                {subcategory}
              </h3>
              <div className="space-y-1">
                {opts.map((option) => (
                  <SettingRenderer key={option.id} option={option} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
