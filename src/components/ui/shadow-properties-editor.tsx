"use client";

import { ColorPickerInput } from "@/components/ui/color-picker-input";
import { Label } from "@/components/ui/label";
import { NumberSlider } from "@/components/ui/number-slider";
import { cn } from "@/lib/utils";

interface ShadowPropertiesEditorProps {
  values: {
    "shadow-color": string;
    "shadow-opacity": string;
    "shadow-blur": string;
    "shadow-spread": string;
    "shadow-offset-x": string;
    "shadow-offset-y": string;
  };
  onChange: (key: string, value: string) => void;
  className?: string;
}

export function ShadowPropertiesEditor({
  values,
  onChange,
  className,
}: ShadowPropertiesEditorProps) {
  const parseValue = (value: string): number => {
    return parseFloat(value.replace(/px|rem|em/, "")) || 0;
  };

  const formatValue = (value: number, unit = "px"): string => {
    return `${value}${unit}`;
  };

  const parseColor = (colorValue: string): string => {
    // Handle HSL colors like "hsl(0 0% 0%)" or "hsl(0 0% 0% / 0.5)"
    if (colorValue.startsWith("hsl(")) {
      // For now, return a fallback - we could parse HSL later
      return "#000000";
    }

    // Handle RGBA colors
    if (colorValue.startsWith("rgba(")) {
      const match = colorValue.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/,
      );
      if (match) {
        const [, r, g, b] = match;
        return `#${parseInt(r).toString(16).padStart(2, "0")}${parseInt(g).toString(16).padStart(2, "0")}${parseInt(b).toString(16).padStart(2, "0")}`;
      }
    }

    // Return as-is if already hex or other format
    return colorValue.startsWith("#") ? colorValue : "#000000";
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Color picker */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">shadow-color</Label>
        <ColorPickerInput
          color={parseColor(values["shadow-color"])}
          onChange={(newColor) => onChange("shadow-color", newColor)}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium">shadow-offset-x</Label>
          <NumberSlider
            value={parseValue(values["shadow-offset-x"])}
            onChange={(v) => onChange("shadow-offset-x", formatValue(v))}
            min={-20}
            max={20}
            step={1}
            unit="px"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">shadow-offset-y</Label>
          <NumberSlider
            value={parseValue(values["shadow-offset-y"])}
            onChange={(v) => onChange("shadow-offset-y", formatValue(v))}
            min={-20}
            max={20}
            step={1}
            unit="px"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">shadow-blur</Label>
          <NumberSlider
            value={parseValue(values["shadow-blur"])}
            onChange={(v) => onChange("shadow-blur", formatValue(v))}
            min={0}
            max={40}
            step={1}
            unit="px"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">shadow-spread</Label>
          <NumberSlider
            value={parseValue(values["shadow-spread"])}
            onChange={(v) => onChange("shadow-spread", formatValue(v))}
            min={-10}
            max={10}
            step={1}
            unit="px"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">shadow-opacity</Label>
        <NumberSlider
          value={parseFloat(values["shadow-opacity"]) || 0}
          onChange={(v) => onChange("shadow-opacity", v.toString())}
          min={0}
          max={1}
          step={0.01}
        />
      </div>
    </div>
  );
}
