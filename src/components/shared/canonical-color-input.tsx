"use client";

import type * as React from "react";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TailwindIcon } from "@/components/shared/icons/tailwind";
import { generateTailwindPalette } from "@/lib/ice-theme";
import { cn } from "@/lib/utils";
import type { CanonicalGroup } from "@/lib/canonical-utils";
import type { TinteBlock } from "@/types/tinte";

interface CanonicalColorInputProps {
  group: CanonicalGroup;
  colorKey: keyof TinteBlock;
  value?: string;
  onChange: (key: keyof TinteBlock, value: string) => void;
}

export const CanonicalColorInput: React.FC<CanonicalColorInputProps> = ({
  group,
  colorKey,
  value,
  onChange,
}) => {
  const handleTailwindColorSelect = (color: string) => {
    onChange(colorKey, color);
  };

  if (group.skeleton || !value) {
    return (
      <div className="flex gap-2">
        <div className="h-10 bg-muted/30 rounded animate-pulse flex-1"></div>
        <div className="h-10 w-10 bg-muted/30 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <ColorPickerInput
          color={value}
          onChange={(newValue) => onChange(colorKey, newValue)}
        />
      </div>

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
          {value && (() => {
            const palette = generateTailwindPalette(value);
            return palette.map((color) => {
              const isSelected = color.value === value;
              
              return (
                <DropdownMenuItem
                  key={color.name}
                  onClick={() => handleTailwindColorSelect(color.value)}
                  className="flex items-center gap-2"
                >
                  <div 
                    className={cn(
                      "w-4 h-4 rounded border",
                      isSelected ? "border-foreground border-2" : "border-border"
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
  );
};
