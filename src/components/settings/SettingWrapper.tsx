"use client";

import { RotateCcw, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useConfigStore } from "@/lib/store/config-store";
import type { ConfigOption, Platform } from "@/lib/schema/types";

// Platform badge styling
const platformStyles: Record<Platform, { bg: string; text: string; label: string }> = {
  macos: { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", label: "macOS" },
  linux: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", label: "Linux" },
  windows: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", label: "Windows" },
};

interface SettingWrapperProps {
  option: ConfigOption;
  children: React.ReactNode;
}

export function SettingWrapper({ option, children }: SettingWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const isModified = useConfigStore((state) => state.isModified(option.id));
  const resetValue = useConfigStore((state) => state.resetValue);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="group flex flex-col gap-2 py-4 border-b border-border/50 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              id={`${option.id}-label`}
              className="text-sm font-medium text-foreground"
            >
              {option.name}
            </span>
            {option.docUrl && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={option.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`View documentation for ${option.name}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View WezTerm docs</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {mounted && isModified && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Modified
              </span>
            )}
            {option.platform && option.platform.map((p) => {
              const style = platformStyles[p];
              return (
                <span
                  key={p}
                  className={`inline-flex items-center rounded-full ${style.bg} px-2 py-0.5 text-xs ${style.text}`}
                >
                  {style.label}
                </span>
              );
            })}
            {option.deprecated && (
              <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600 dark:text-yellow-400">
                Deprecated
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {option.description}
          </p>
          {option.note && (
            <p className="mt-1 text-xs text-muted-foreground/70 italic">
              Note: {option.note}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {mounted && isModified && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => resetValue(option.id)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset to default</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      <div className="mt-1">
        {children}
      </div>
    </div>
  );
}
