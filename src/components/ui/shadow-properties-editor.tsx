"use client";

import { formatHex, parse } from "culori";
import * as React from "react";
import { TailwindIcon } from "@/components/shared/icons";
import { InvertedLogo } from "@/components/shared/layout";
import { Button } from "@/components/ui/button";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { NumberSlider } from "@/components/ui/number-slider";
import { generateTailwindPalette } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { useActiveTheme, useThemeMode } from "@/stores/hooks";
import type { TinteBlock } from "@/types/tinte";

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

const CANONICAL_COLOR_KEYS: (keyof TinteBlock)[] = [
  "bg",
  "bg_2",
  "ui",
  "ui_2",
  "ui_3",
  "tx_3",
  "tx_2",
  "tx",
  "pr",
  "sc",
  "ac_1",
  "ac_2",
  "ac_3",
];

const COLOR_LABELS: Record<keyof TinteBlock, string> = {
  bg: "BG",
  bg_2: "BG2",
  ui: "UI",
  ui_2: "UI2",
  ui_3: "UI3",
  tx_3: "TX3",
  tx_2: "TX2",
  tx: "TX",
  pr: "PR",
  sc: "SC",
  ac_1: "AC1",
  ac_2: "AC2",
  ac_3: "AC3",
};

const parseColor = (colorValue: string): string => {
  // Already hex
  if (colorValue.startsWith("#")) {
    return colorValue;
  }

  // Use culori to parse any color format (HSL, RGB, etc.) to hex
  try {
    const parsed = parse(colorValue);
    if (parsed) {
      return formatHex(parsed);
    }
  } catch {
    // Silently fail
  }

  // Fallback
  return "#000000";
};

export function ShadowPropertiesEditor({
  values,
  onChange,
  className,
}: ShadowPropertiesEditorProps) {
  const { tinteTheme } = useActiveTheme();
  const { mode } = useThemeMode();
  const currentColors = tinteTheme?.[mode];

  // Local state for immediate updates
  const [localColor, setLocalColor] = React.useState(() =>
    parseColor(values["shadow-color"]),
  );

  // Sync local state when prop changes (e.g., mode switch or external update)
  React.useEffect(() => {
    setLocalColor(parseColor(values["shadow-color"]));
  }, [values["shadow-color"]]);

  const handleCanonicalColorSelect = (colorKey: keyof TinteBlock) => {
    const colorValue = currentColors?.[colorKey];
    if (colorValue) {
      setLocalColor(parseColor(colorValue));
      onChange("shadow-color", colorValue);
    }
  };

  const handleTailwindColorSelect = (color: string) => {
    setLocalColor(color);
    onChange("shadow-color", color);
  };

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    onChange("shadow-color", newColor);
  };

  const parseValue = (value: string): number => {
    return parseFloat(value.replace(/px|rem|em/, "")) || 0;
  };

  const formatValue = (value: number, unit = "px"): string => {
    return `${value}${unit}`;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Color picker */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">shadow-color</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <ColorPickerInput color={localColor} onChange={handleColorChange} />
          </div>

          {/* Quick Canonical Color Picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 w-10 p-0 flex items-center justify-center"
                title="Select from canonical colors"
              >
                <InvertedLogo size={20} className="!w-5 !h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {CANONICAL_COLOR_KEYS.map((colorKey) => {
                const colorValue = currentColors?.[colorKey];
                const isSelected = parseColor(colorValue || "") === localColor;

                return (
                  <DropdownMenuItem
                    key={colorKey}
                    onClick={() => handleCanonicalColorSelect(colorKey)}
                    disabled={!colorValue}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded border",
                        isSelected
                          ? "border-foreground border-2"
                          : "border-border",
                      )}
                      style={{ backgroundColor: colorValue || "#000000" }}
                    />
                    <span className="font-mono text-xs">
                      {COLOR_LABELS[colorKey]}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground font-mono">
                      {colorValue}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tailwind Palette Generator */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 w-10 p-0 flex items-center justify-center"
                title="Generate Tailwind palette from current color"
              >
                <TailwindIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {localColor &&
                (() => {
                  const palette = generateTailwindPalette(localColor);
                  return palette.map((color) => {
                    const isSelected = color.value === localColor;

                    return (
                      <DropdownMenuItem
                        key={color.name}
                        onClick={() => handleTailwindColorSelect(color.value)}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded border",
                            isSelected
                              ? "border-foreground border-2"
                              : "border-border",
                          )}
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="font-mono text-xs">{color.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground font-mono">
                          {color.value}
                        </span>
                      </DropdownMenuItem>
                    );
                  });
                })()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
