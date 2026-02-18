"use client";

import type * as React from "react";
import { TailwindIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CanonicalGroup } from "@tinte/core";
import { generateTailwindPalette } from "@tinte/core";
import { cn } from "@/lib/utils";
import type { TinteBlock } from "@tinte/core";

interface CanonicalColorInputProps {
  group: CanonicalGroup;
  colorKey: keyof TinteBlock;
  value?: string;
  onChange: (key: keyof TinteBlock, value: string) => void;
  disabled?: boolean;
}

export const CanonicalColorInput: React.FC<CanonicalColorInputProps> = ({
  group,
  colorKey,
  value,
  onChange,
  disabled = false,
}) => {
  const handleTailwindColorSelect = (color: string) => {
    onChange(colorKey, color);
  };

  // Show loading state if no value or if it's a skeleton
  const isLoading = group.skeleton || !value || value.trim() === "";

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <div className="h-10 bg-muted/30 rounded border flex items-center px-3 flex-1 animate-pulse">
          <div className="w-6 h-6 rounded bg-slate-400/40 mr-3"></div>
          <div className="h-4 bg-muted/50 rounded flex-1"></div>
        </div>
        <div className="h-10 w-10 bg-muted/30 rounded border flex items-center justify-center animate-pulse">
          <div className="w-5 h-5 bg-muted/50 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-2 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex-1">
        <ColorPickerInput
          color={value}
          onChange={(newValue) => onChange(colorKey, newValue)}
          disabled={disabled}
        />
      </div>

      {/* Tailwind Palette Generator */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-10 p-0 flex items-center justify-center"
            title="Generate Tailwind palette from current color"
            disabled={disabled}
          >
            <TailwindIcon className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {value &&
            (() => {
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
  );
};
