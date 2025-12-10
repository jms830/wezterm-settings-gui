"use client";

import { Input } from "@/components/ui/input";
import { useConfigStore } from "@/lib/store/config-store";
import { SettingWrapper } from "./SettingWrapper";
import type { StringOption } from "@/lib/schema/types";

interface TextInputProps {
  option: StringOption;
}

export function TextInput({ option }: TextInputProps) {
  const value = useConfigStore((state) => state.getValue(option.id)) as string;
  const setValue = useConfigStore((state) => state.setValue);

  return (
    <SettingWrapper option={option}>
      <Input
        id={option.id}
        name={option.id}
        aria-labelledby={`${option.id}-label`}
        type="text"
        value={value}
        onChange={(e) => setValue(option.id, e.target.value)}
        placeholder={option.placeholder}
        className="max-w-md"
      />
    </SettingWrapper>
  );
}
