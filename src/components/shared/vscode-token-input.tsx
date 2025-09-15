"use client";

import * as React from "react";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Logo from "@/components/shared/logo";
import { TailwindIcon } from "@/components/shared/icons/tailwind";
import { generateTailwindPalette } from "@/lib/ice-theme";
import { useThemeContext } from "@/providers/theme";
import { cn } from "@/lib/utils";
import type { SemanticToken } from "@/lib/providers/vscode";
import type { TinteBlock } from "@/types/tinte";
import InvertedLogo from "./inverted-logo";
import { Info } from "lucide-react";

interface VSCodeTokenInputProps {
  tokenKey: SemanticToken;
  value: string | undefined;
  onChange: (tokenKey: SemanticToken, value: string) => void;
  displayName?: string;
  description?: string;
  skeleton?: boolean;
}

const CANONICAL_COLOR_KEYS: (keyof TinteBlock)[] = [
  "bg", "bg_2", "ui", "ui_2", "ui_3",
  "tx_3", "tx_2", "tx",
  "pr", "sc", "ac_1", "ac_2", "ac_3"
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
  ac_3: "AC3"
};

export function VSCodeTokenInput({
  tokenKey,
  value,
  onChange,
  displayName,
  description,
  skeleton = false,
}: VSCodeTokenInputProps) {
  const { tinteTheme, currentMode } = useThemeContext();
  const currentColors = tinteTheme?.[currentMode];

  if (skeleton || !value) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1 mb-1">
          <div className="h-4 w-20 bg-muted/30 rounded animate-pulse"></div>
          <div className="w-3 h-3 bg-muted/30 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-muted/30 rounded border flex items-center px-3 flex-1 animate-pulse">
            <div className="w-6 h-6 rounded bg-slate-400/40 mr-3"></div>
            <div className="h-4 bg-muted/50 rounded flex-1"></div>
          </div>
          <div className="h-10 w-10 bg-muted/30 rounded border flex items-center justify-center animate-pulse">
            <div className="w-5 h-5 bg-muted/50 rounded"></div>
          </div>
          <div className="h-10 w-10 bg-muted/30 rounded border flex items-center justify-center animate-pulse">
            <div className="w-5 h-5 bg-muted/50 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleCanonicalColorSelect = (colorKey: keyof TinteBlock) => {
    const colorValue = currentColors?.[colorKey];
    if (colorValue) {
      onChange(tokenKey, colorValue);
    }
  };

  const handleTailwindColorSelect = (color: string) => {
    onChange(tokenKey, color);
  };

  return (
    <div className="space-y-1">
      <Label htmlFor={tokenKey} className="text-xs font-medium flex items-center gap-1">
        {displayName || tokenKey.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
        {description && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3 h-3 text-muted-foreground/60 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{description}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </Label>

      <div className="flex gap-2">
        <div className="flex-1">
          <ColorPickerInput
            color={value}
            onChange={(newValue) => onChange(tokenKey, newValue)}
          />
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
              const isSelected = colorValue === value;

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
                      isSelected ? "border-foreground border-2" : "border-border"
                    )}
                    style={{ backgroundColor: colorValue || "#000000" }}
                  />
                  <span className="font-mono text-xs">{COLOR_LABELS[colorKey]}</span>
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
    </div>
  );
}