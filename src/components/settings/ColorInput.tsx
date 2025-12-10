"use client";

import { useState, useCallback } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useConfigStore } from "@/lib/store/config-store";
import { SettingWrapper } from "./SettingWrapper";
import type { ColorOption } from "@/lib/schema/types";

interface ColorInputProps {
  option: ColorOption;
}

export function ColorInput({ option }: ColorInputProps) {
  const value = useConfigStore((state) => state.getValue(option.id)) as string;
  const setValue = useConfigStore((state) => state.setValue);
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = useCallback((newValue: string) => {
    setInputValue(newValue);
    // Validate hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      setValue(option.id, newValue);
    }
  }, [option.id, setValue]);

  const handleBlur = useCallback(() => {
    // Reset to stored value if invalid
    if (!/^#[0-9A-Fa-f]{6}$/.test(inputValue)) {
      setInputValue(value);
    }
  }, [inputValue, value]);

  // Sync input when external value changes
  if (value !== inputValue && /^#[0-9A-Fa-f]{6}$/.test(value)) {
    setInputValue(value);
  }

  return (
    <SettingWrapper option={option}>
      <div className="flex items-center gap-3">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-14 p-1 border-2"
              style={{ backgroundColor: value }}
              aria-label={`Pick color for ${option.name}`}
            >
              <span className="sr-only">Pick color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <div className="flex flex-col gap-3">
              <input
                type="color"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                className="h-32 w-32 cursor-pointer border-0 p-0"
              />
              <div className="grid grid-cols-8 gap-1">
                {/* Quick color palette */}
                {[
                  "#1e1e2e", "#313244", "#45475a", "#585b70",
                  "#6c7086", "#7f849c", "#9399b2", "#a6adc8",
                  "#bac2de", "#cdd6f4", "#f5e0dc", "#f2cdcd",
                  "#f5c2e7", "#cba6f7", "#f38ba8", "#eba0ac",
                  "#fab387", "#f9e2af", "#a6e3a1", "#94e2d5",
                  "#89dceb", "#74c7ec", "#89b4fa", "#b4befe",
                ].map((color) => (
                  <button
                    key={color}
                    className="h-6 w-6 rounded border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      handleChange(color);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Input
          id={option.id}
          name={option.id}
          aria-labelledby={`${option.id}-label`}
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder="#000000"
          className="w-28 font-mono"
          maxLength={7}
        />
        
        <div
          className="h-6 flex-1 rounded border border-border"
          style={{ backgroundColor: value }}
        />
      </div>
    </SettingWrapper>
  );
}
