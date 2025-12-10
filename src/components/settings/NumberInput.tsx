"use client";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useConfigStore } from "@/lib/store/config-store";
import { SettingWrapper } from "./SettingWrapper";
import type { NumberOption, DurationOption } from "@/lib/schema/types";

interface NumberInputProps {
  option: NumberOption | DurationOption;
}

export function NumberInput({ option }: NumberInputProps) {
  const value = useConfigStore((state) => state.getValue(option.id)) as number;
  const setValue = useConfigStore((state) => state.setValue);

  const handleSliderChange = (values: number[]) => {
    setValue(option.id, values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      // Clamp to min/max if defined
      const clamped = Math.min(
        Math.max(newValue, option.min ?? -Infinity),
        option.max ?? Infinity
      );
      setValue(option.id, clamped);
    }
  };

  const showSlider = option.min !== undefined && option.max !== undefined;

  return (
    <SettingWrapper option={option}>
      <div className="flex items-center gap-4">
        {showSlider && (
          <Slider
            value={[value]}
            onValueChange={handleSliderChange}
            min={option.min}
            max={option.max}
            step={"step" in option ? option.step ?? 1 : 1}
            className="flex-1"
          />
        )}
        
        <div className="flex items-center gap-2">
          <Input
            id={option.id}
            name={option.id}
            aria-labelledby={`${option.id}-label`}
            type="number"
            value={value}
            onChange={handleInputChange}
            min={option.min}
            max={option.max}
            step={"step" in option ? option.step ?? 1 : 1}
            className="w-24 font-mono"
          />
          {option.unit && (
            <span className="text-sm text-muted-foreground">
              {option.unit}
            </span>
          )}
        </div>
      </div>
    </SettingWrapper>
  );
}
