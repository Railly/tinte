"use client";

import * as React from "react";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import type { TinteBlock } from "@/types/tinte";
import type { CanonicalGroup } from "@/lib/canonical-utils";

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
  onChange 
}) => {
  if (group.skeleton || !value) {
    return <div className="h-10 bg-muted/30 rounded animate-pulse"></div>;
  }

  return (
    <ColorPickerInput
      color={value}
      onChange={(newValue) => onChange(colorKey, newValue)}
    />
  );
};