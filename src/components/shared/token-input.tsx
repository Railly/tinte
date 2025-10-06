"use client";

import type * as React from "react";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import { Input } from "@/components/ui/input";
import { NumberSlider } from "@/components/ui/number-slider";
import { ShadowPropertiesEditor } from "@/components/ui/shadow-properties-editor";
import type { TokenGroup } from "@/lib/theme-editor-utils";
import type { FontInfo } from "@/types/fonts";
import { FontSelector } from "./font-selector";

interface TokenInputProps {
  group: TokenGroup;
  tokenKey: string;
  value: string;
  currentTokens: Record<string, string>;
  onEdit: (key: string, value: string) => void;
  onFontSelect: (key: string, font: FontInfo) => void;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  group,
  tokenKey,
  value,
  currentTokens,
  onEdit,
  onFontSelect,
}) => {
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
    return (
      <div
        className={`${group.type === "color" ? "h-10" : "h-8"} bg-muted/30 rounded animate-pulse`}
      ></div>
    );
  }

  if (group.type === "color") {
    return (
      <ColorPickerInput
        color={value}
        onChange={(newValue) => onEdit(tokenKey, newValue)}
      />
    );
  }

  if (group.type === "fonts") {
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
    return (
      <ShadowPropertiesEditor
        values={{
          "shadow-color": currentTokens["shadow-color"] || "",
          "shadow-opacity": currentTokens["shadow-opacity"] || "",
          "shadow-blur": currentTokens["shadow-blur"] || "",
          "shadow-spread": currentTokens["shadow-spread"] || "",
          "shadow-offset-x": currentTokens["shadow-offset-x"] || "",
          "shadow-offset-y": currentTokens["shadow-offset-y"] || "",
        }}
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
