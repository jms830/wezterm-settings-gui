"use client";

import type { ConfigOption } from "@/lib/schema/types";
import { ColorInput } from "./ColorInput";
import { NumberInput } from "./NumberInput";
import { SelectInput } from "./SelectInput";
import { SwitchInput } from "./SwitchInput";
import { PaletteInput } from "./PaletteInput";
import { TextInput } from "./TextInput";
import { KeybindInput } from "./KeybindInput";
import { LaunchMenuInput } from "./LaunchMenuInput";

interface SettingRendererProps {
  option: ConfigOption;
}

export function SettingRenderer({ option }: SettingRendererProps) {
  // Skip hidden options
  if (option.hidden) {
    return null;
  }

  switch (option.type) {
    case "string":
      return <TextInput option={option} />;
    
    case "number":
    case "duration":
      return <NumberInput option={option} />;
    
    case "boolean":
      return <SwitchInput option={option} />;
    
    case "enum":
      return <SelectInput option={option} />;
    
    case "color":
      return <ColorInput option={option} />;
    
    case "palette":
      return <PaletteInput option={option} />;
    
    case "keybind":
      return <KeybindInput option={option} />;
    
    case "launchmenu":
      return <LaunchMenuInput option={option} />;
    
    case "font":
      // TODO: Implement FontInput for font configuration
      return (
        <div className="py-4 text-sm text-muted-foreground">
          Font configuration coming soon...
        </div>
      );
    
    case "padding":
      // TODO: Implement PaddingInput for padding configuration
      return (
        <div className="py-4 text-sm text-muted-foreground">
          Padding configuration coming soon...
        </div>
      );
    
    default:
      console.warn(`Unknown option type: ${(option as ConfigOption).type}`);
      return null;
  }
}
