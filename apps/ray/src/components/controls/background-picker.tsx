"use client";

import { useRef } from "react";
import { GRADIENTS } from "@/lib/gradients";
import { cn } from "@/lib/utils";

interface BackgroundPickerProps {
  value: string;
  onChange: (id: string) => void;
}

export function BackgroundPicker({ value, onChange }: BackgroundPickerProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const isCustom = value.startsWith("#");

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground mr-1">BG</span>
      {GRADIENTS.map((gradient) => (
        <button
          type="button"
          key={gradient.id}
          title={gradient.name}
          onClick={() => onChange(gradient.id)}
          className={cn(
            "size-7 rounded-md transition-all",
            value === gradient.id
              ? "ring-2 ring-foreground ring-offset-1 ring-offset-background scale-110"
              : "hover:scale-105 opacity-80 hover:opacity-100",
          )}
          style={{
            background:
              gradient.css === "transparent"
                ? "repeating-conic-gradient(#666 0% 25%, #333 0% 50%) 0 0 / 8px 8px"
                : gradient.css,
            border:
              gradient.css === "transparent"
                ? "1px solid hsl(var(--border))"
                : "none",
          }}
        />
      ))}
      <div className="relative">
        <button
          type="button"
          title="Custom color"
          onClick={() => colorInputRef.current?.click()}
          className={cn(
            "size-7 rounded-md transition-all border border-dashed border-muted-foreground/40",
            isCustom
              ? "ring-2 ring-foreground ring-offset-1 ring-offset-background scale-110"
              : "hover:scale-105 opacity-80 hover:opacity-100",
          )}
          style={{
            background: isCustom ? value : "transparent",
          }}
        />
        <input
          ref={colorInputRef}
          type="color"
          value={isCustom ? value : "#1a1a2e"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer size-7"
        />
      </div>
    </div>
  );
}
