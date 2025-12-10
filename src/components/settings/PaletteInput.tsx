"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useConfigStore } from "@/lib/store/config-store";
import { SettingWrapper } from "./SettingWrapper";
import type { PaletteOption } from "@/lib/schema/types";

interface PaletteInputProps {
  option: PaletteOption;
}

const ANSI_LABELS = [
  "Black", "Red", "Green", "Yellow", 
  "Blue", "Magenta", "Cyan", "White"
];

export function PaletteInput({ option }: PaletteInputProps) {
  const value = useConfigStore((state) => state.getValue(option.id)) as string[];
  const setValue = useConfigStore((state) => state.setValue);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleColorChange = (index: number, color: string) => {
    const newPalette = [...value];
    newPalette[index] = color;
    setValue(option.id, newPalette);
  };

  return (
    <SettingWrapper option={option}>
      <div 
        className="grid grid-cols-8 gap-2"
        role="group"
        aria-labelledby={`${option.id}-label`}
      >
        {value.map((color, index) => (
          <Popover 
            key={`${option.id}-${index}`} 
            open={activeIndex === index}
            onOpenChange={(open) => setActiveIndex(open ? index : null)}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`${ANSI_LABELS[index]} color: ${color}`}
                className="group relative h-10 w-full rounded-md border-2 border-border hover:border-primary transition-colors"
                style={{ backgroundColor: color }}
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-background/80 text-foreground">
                    {ANSI_LABELS[index]}
                  </span>
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="center">
              <div className="flex flex-col gap-3">
                <div className="text-sm font-medium">
                  {ANSI_LABELS[index]}
                </div>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="h-24 w-24 cursor-pointer border-0 p-0"
                />
                <Input
                  type="text"
                  id={`${option.id}-${index}`}
                  name={`${option.id}-${index}`}
                  aria-label={`${ANSI_LABELS[index]} hex value`}
                  value={color}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      handleColorChange(index, e.target.value);
                    }
                  }}
                  placeholder="#000000"
                  className="w-24 font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        {ANSI_LABELS.map((label) => (
          <span key={label} className="w-full text-center truncate px-0.5">
            {label}
          </span>
        ))}
      </div>
    </SettingWrapper>
  );
}
