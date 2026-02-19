"use client";

import { useRef, useState } from "react";
import { GRADIENTS } from "@/lib/gradients";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BackgroundPickerProps {
  value: string;
  onChange: (id: string) => void;
}

export function BackgroundPicker({ value, onChange }: BackgroundPickerProps) {
  const [open, setOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const isCustom = value.startsWith("#");

  const activeGradient = GRADIENTS.find((g) => g.id === value);
  const activeCss = activeGradient
    ? activeGradient.css === "transparent"
      ? "repeating-conic-gradient(#666 0% 25%, #333 0% 50%) 0 0 / 8px 8px"
      : activeGradient.css
    : isCustom
      ? value
      : GRADIENTS[0].css;

  const activeName = activeGradient?.name ?? (isCustom ? "Custom" : "Background");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs h-7 px-2"
        >
          <div
            className="size-4 rounded shrink-0"
            style={{
              background: activeCss,
              border: activeGradient?.css === "transparent"
                ? "1px solid hsl(var(--border))"
                : "none",
            }}
          />
          <span className="text-muted-foreground">BG</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-[220px] p-0 overflow-hidden"
        onFocusOutside={(e) => e.preventDefault()}
      >
        <div className="px-3 py-2 border-b">
          <span className="text-xs font-medium">Background</span>
        </div>
        <div className="p-2">
          <div className="grid grid-cols-4 gap-1.5">
            {GRADIENTS.map((gradient) => (
              <button
                key={gradient.id}
                type="button"
                title={gradient.name}
                onClick={() => {
                  onChange(gradient.id);
                  setOpen(false);
                }}
                className={cn(
                  "aspect-square rounded-lg transition-all relative group",
                  value === gradient.id
                    ? "ring-2 ring-foreground ring-offset-1 ring-offset-background scale-105"
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
              >
                <span className="absolute inset-x-0 bottom-0 text-[8px] text-white/80 text-center py-0.5 bg-black/40 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate px-1">
                  {gradient.name}
                </span>
              </button>
            ))}
            <div className="relative aspect-square">
              <button
                type="button"
                title="Custom color"
                onClick={() => colorInputRef.current?.click()}
                className={cn(
                  "size-full rounded-lg transition-all border border-dashed border-muted-foreground/40",
                  isCustom
                    ? "ring-2 ring-foreground ring-offset-1 ring-offset-background scale-105"
                    : "hover:scale-105 opacity-80 hover:opacity-100",
                )}
                style={{
                  background: isCustom ? value : "transparent",
                }}
              >
                <span className="text-[10px] text-muted-foreground">+</span>
              </button>
              <input
                ref={colorInputRef}
                type="color"
                value={isCustom ? value : "#1a1a2e"}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
        {(activeGradient || isCustom) && (
          <div className="px-3 py-2 border-t">
            <div
              className="h-6 rounded-md w-full"
              style={{
                background: activeCss,
                border: activeGradient?.css === "transparent"
                  ? "1px solid hsl(var(--border))"
                  : "none",
              }}
            />
            <span className="text-[10px] text-muted-foreground mt-1 block text-center">
              {activeName}
            </span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
