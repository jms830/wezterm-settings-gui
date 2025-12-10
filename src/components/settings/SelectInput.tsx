"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfigStore } from "@/lib/store/config-store";
import { SettingWrapper } from "./SettingWrapper";
import type { EnumOption } from "@/lib/schema/types";

interface SelectInputProps {
  option: EnumOption;
}

export function SelectInput({ option }: SelectInputProps) {
  const value = useConfigStore((state) => state.getValue(option.id)) as string;
  const setValue = useConfigStore((state) => state.setValue);

  return (
    <SettingWrapper option={option}>
      <Select value={value} onValueChange={(v) => setValue(option.id, v)}>
        <SelectTrigger id={option.id} aria-labelledby={`${option.id}-label`} className="w-64">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {option.options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <div className="flex flex-col">
                <span>{opt.label}</span>
                {opt.description && (
                  <span className="text-xs text-muted-foreground">
                    {opt.description}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SettingWrapper>
  );
}
