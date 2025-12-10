"use client";

import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useConfigStore } from "@/lib/store/config-store";
import type { BooleanOption } from "@/lib/schema/types";

interface SwitchInputProps {
  option: BooleanOption;
}

export function SwitchInput({ option }: SwitchInputProps) {
  const [mounted, setMounted] = useState(false);
  const value = useConfigStore((state) => state.getValue(option.id)) as boolean;
  const setValue = useConfigStore((state) => state.setValue);
  const isModified = useConfigStore((state) => state.isModified(option.id));
  const resetValue = useConfigStore((state) => state.resetValue);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="group flex items-center justify-between py-4 border-b border-border/50 last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor={option.id}
            className="text-sm font-medium text-foreground cursor-pointer"
          >
            {option.name}
          </label>
          {mounted && isModified && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Modified
            </span>
          )}
          {option.platform && (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {option.platform.join(", ")}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {option.description}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {mounted && isModified && (
          <button
            onClick={() => resetValue(option.id)}
            className="text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Reset
          </button>
        )}
        <Switch
          id={option.id}
          name={option.id}
          checked={value}
          onCheckedChange={(checked) => setValue(option.id, checked)}
        />
      </div>
    </div>
  );
}
