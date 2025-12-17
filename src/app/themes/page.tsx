"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colorSchemes } from "@/data/color-schemes";
import { extendedThemes, categorizeThemes } from "@/data/wezterm-themes";
import { useConfigStore } from "@/lib/store/config-store";
import { ThemePreviewCard } from "@/components/settings/ThemePicker";
import type { ColorScheme } from "@/lib/schema/types";

export default function ThemesPage() {
  const router = useRouter();
  const applyTheme = useConfigStore((state) => state.applyTheme);
  const currentTheme = useConfigStore((state) => state.appliedTheme);
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "dark" | "light">("all");
  const [visibleCount, setVisibleCount] = useState(48);
  const [isApplying, setIsApplying] = useState<string | null>(null);

  const allThemes = useMemo(() => {
    const combined = [...colorSchemes, ...extendedThemes];
    const uniqueMap = new Map<string, ColorScheme>();
    combined.forEach(theme => uniqueMap.set(theme.name, theme));
    return Array.from(uniqueMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const categorized = useMemo(() => {
    return categorizeThemes(allThemes);
  }, [allThemes]);

  const filteredThemes = useMemo(() => {
    let themes = allThemes;

    if (filter === "dark") {
      themes = categorized.dark;
    } else if (filter === "light") {
      themes = categorized.light;
    }

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      themes = themes.filter(theme => 
        theme.name.toLowerCase().includes(lowerSearch)
      );
    }

    return themes;
  }, [allThemes, categorized, filter, search]);

  const visibleThemes = filteredThemes.slice(0, visibleCount);
  const hasMore = visibleThemes.length < filteredThemes.length;

  const handleApplyTheme = async (scheme: ColorScheme) => {
    setIsApplying(scheme.name);
    
    await new Promise(resolve => setTimeout(resolve, 100));

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

    router.push("/editor");
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 48);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/editor")}
              className="-ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Editor
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Themes Gallery</h1>
              <p className="text-sm text-muted-foreground">
                Browse and preview {allThemes.length} WezTerm color schemes
              </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full md:w-auto">
                <TabsList className="grid w-full grid-cols-3 md:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="dark">Dark</TabsTrigger>
                  <TabsTrigger value="light">Light</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search themes by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 max-w-md"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {visibleThemes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {visibleThemes.map((theme) => (
                <div key={theme.name} className="flex flex-col">
                  <ThemePreviewCard
                    scheme={theme}
                    isSelected={currentTheme === theme.name}
                    onSelectAction={() => handleApplyTheme(theme)}
                  />
                  {isApplying === theme.name && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-lg">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12 pb-8">
                <Button 
                  onClick={handleLoadMore} 
                  variant="outline" 
                  size="lg"
                  className="min-w-[200px]"
                >
                  Load More Themes
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No themes found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              We couldn't find any themes matching "{search}" in the {filter !== 'all' ? filter : ''} category.
            </p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-4"
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
