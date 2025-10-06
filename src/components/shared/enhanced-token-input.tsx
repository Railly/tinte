"use client";

import type * as React from "react";
import { TailwindIcon } from "@/components/shared/icons/tailwind";
import InvertedLogo from "@/components/shared/inverted-logo";
import { Button } from "@/components/ui/button";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { NumberSlider } from "@/components/ui/number-slider";
import { ShadowPropertiesEditor } from "@/components/ui/shadow-properties-editor";
import { generateTailwindPalette } from "@/lib/ice-theme";
import type { TokenGroup } from "@/lib/theme-editor-utils";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme";
import type { FontInfo } from "@/types/fonts";
import type { TinteBlock } from "@/types/tinte";
import { extractFontFamily, loadGoogleFont } from "@/utils/fonts";
import { FontSelector } from "./font-selector";

interface EnhancedTokenInputProps {
  group: TokenGroup;
  tokenKey: string;
  value: string;
  currentTokens: Record<string, string>;
  onEdit: (key: string, value: string) => void;
  onFontSelect: (key: string, font: FontInfo) => void;
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

export const EnhancedTokenInput: React.FC<EnhancedTokenInputProps> = ({
  group,
  tokenKey,
  value,
  currentTokens,
  onEdit,
  onFontSelect,
}) => {
  const { tinteTheme, currentMode } = useThemeContext();
  const currentColors = tinteTheme?.[currentMode];

  const handleCanonicalColorSelect = (colorKey: keyof TinteBlock) => {
    const colorValue = currentColors?.[colorKey];
    if (colorValue) {
      onEdit(tokenKey, colorValue);
    }
  };

  const handleTailwindColorSelect = (color: string) => {
    onEdit(tokenKey, color);
  };

  if (group.skeleton) {
    if (group.type === "shadow-properties") {
      return (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 bg-muted/30 rounded animate-pulse"
            ></div>
          ))}
        </div>
      );
    }

    if (group.type === "color") {
      return (
        <div className="flex gap-2">
          <div className="h-10 bg-muted/30 rounded animate-pulse flex-1"></div>
          <div className="h-10 w-10 bg-muted/30 rounded animate-pulse"></div>
          <div className="h-10 w-10 bg-muted/30 rounded animate-pulse"></div>
        </div>
      );
    }

    return <div className="h-8 bg-muted/30 rounded animate-pulse"></div>;
  }

  if (group.type === "color") {
    return (
      <div className="flex gap-2">
        <div className="flex-1">
          <ColorPickerInput
            color={value}
            onChange={(newValue) => onEdit(tokenKey, newValue)}
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
  }

  if (group.type === "fonts") {
    // Extract and preload the current font
    const currentFontFamily = extractFontFamily(value);
    if (currentFontFamily && typeof window !== "undefined") {
      loadGoogleFont(currentFontFamily, ["400", "500"]);
    }

    return (
      <FontSelector
        value={value.split(",")[0].trim().replace(/['"]/g, "")}
        category={
          tokenKey.includes("sans")
            ? "sans-serif"
            : tokenKey.includes("serif")
              ? "serif"
              : tokenKey.includes("mono")
                ? "monospace"
                : "sans-serif"
        }
        onSelect={(font) => onFontSelect(tokenKey, font)}
        placeholder="Select font..."
        className="h-7 text-xs"
        style={{
          fontFamily: currentFontFamily
            ? `"${currentFontFamily}", ${
                tokenKey.includes("sans")
                  ? "sans-serif"
                  : tokenKey.includes("serif")
                    ? "serif"
                    : tokenKey.includes("mono")
                      ? "monospace"
                      : "sans-serif"
              }`
            : undefined,
        }}
      />
    );
  }

  if (tokenKey === "radius") {
    return (
      <NumberSlider
        value={parseFloat(value.replace(/px|rem|em/, "")) || 0}
        onChange={(newValue) => onEdit(tokenKey, `${newValue}rem`)}
        min={0}
        max={2}
        step={0.125}
        unit="rem"
        className="mt-1"
      />
    );
  }

  if (tokenKey === "letter-spacing") {
    return (
      <NumberSlider
        value={parseFloat(value.replace(/px|rem|em/, "")) || 0}
        onChange={(newValue) => onEdit(tokenKey, `${newValue}em`)}
        min={-0.5}
        max={1}
        step={0.01}
        unit="em"
        className="mt-1"
      />
    );
  }

  if (group.type === "shadow-properties") {
    const shadowValues = {
      "shadow-color": currentTokens["shadow-color"] || "0 0 0",
      "shadow-opacity": currentTokens["shadow-opacity"] || "0.1",
      "shadow-blur": currentTokens["shadow-blur"] || "3px",
      "shadow-spread": currentTokens["shadow-spread"] || "0px",
      "shadow-offset-x": currentTokens["shadow-offset-x"] || "0px",
      "shadow-offset-y": currentTokens["shadow-offset-y"] || "1px",
    };

    return (
      <ShadowPropertiesEditor
        values={shadowValues}
        onChange={onEdit}
        className="mt-1"
      />
    );
  }

  return (
    <Input
      id={tokenKey}
      value={value}
      onChange={(e) => onEdit(tokenKey, e.target.value)}
      className="h-7 text-xs font-mono"
      placeholder={
        group.type === "shadow"
          ? "Box shadow..."
          : group.type === "base"
            ? "CSS value..."
            : "Value..."
      }
    />
  );
};
