"use client";

import type { TinteBlock } from "@tinte/core";
import { Palette, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const COLOR_GROUPS = [
  {
    label: "Background",
    fields: [
      { key: "bg" as const, label: "Base" },
      { key: "bg_2" as const, label: "Raised" },
    ],
  },
  {
    label: "Surface",
    fields: [
      { key: "ui" as const, label: "Border" },
      { key: "ui_2" as const, label: "Hover" },
      { key: "ui_3" as const, label: "Active" },
    ],
  },
  {
    label: "Text",
    fields: [
      { key: "tx" as const, label: "Primary" },
      { key: "tx_2" as const, label: "Muted" },
      { key: "tx_3" as const, label: "Faint" },
    ],
  },
  {
    label: "Accent",
    fields: [
      { key: "pr" as const, label: "Primary" },
      { key: "sc" as const, label: "Secondary" },
      { key: "ac_1" as const, label: "Accent 1" },
      { key: "ac_2" as const, label: "Accent 2" },
      { key: "ac_3" as const, label: "Accent 3" },
    ],
  },
] as const;

interface ColorEditorProps {
  block: TinteBlock;
  onChange: (block: TinteBlock) => void;
  originalBlock?: TinteBlock;
}

export function ColorEditor({
  block,
  onChange,
  originalBlock,
}: ColorEditorProps) {
  const [open, setOpen] = useState(false);
  const [localBlock, setLocalBlock] = useState<TinteBlock>(block);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!open) setLocalBlock(block);
  }, [block, open]);

  const handleColorChange = useCallback(
    (key: keyof TinteBlock, value: string) => {
      setLocalBlock((prev) => {
        const next = { ...prev, [key]: value };
        onChangeRef.current(next);
        return next;
      });
    },
    [],
  );

  const handleReset = useCallback(() => {
    if (originalBlock) {
      setLocalBlock(originalBlock);
      onChangeRef.current(originalBlock);
    }
  }, [originalBlock]);

  const hasChanges = originalBlock
    ? JSON.stringify(localBlock) !== JSON.stringify(originalBlock)
    : false;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          title="Edit colors"
          className="text-muted-foreground hover:text-foreground"
        >
          <Palette className="size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-[280px] p-0 overflow-hidden"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement | null;
          if (target?.closest?.("input[type='color']")) {
            e.preventDefault();
          }
        }}
        onFocusOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <span className="text-xs font-medium">Edit Colors</span>
          {hasChanges && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="size-2.5" />
              Reset
            </button>
          )}
        </div>
        <div className="p-2 space-y-3 max-h-[320px] overflow-y-auto">
          {COLOR_GROUPS.map((group) => (
            <div key={group.label}>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
                {group.label}
              </span>
              <div className="mt-1 grid grid-cols-1 gap-0.5">
                {group.fields.map((field) => (
                  <ColorField
                    key={field.key}
                    fieldKey={field.key}
                    label={field.label}
                    value={localBlock[field.key]}
                    original={originalBlock?.[field.key]}
                    onChange={handleColorChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-3 py-2 border-t">
          <PaletteStrip block={localBlock} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ColorField({
  fieldKey,
  label,
  value,
  original,
  onChange,
}: {
  fieldKey: keyof TinteBlock;
  label: string;
  value: string;
  original?: string;
  onChange: (key: keyof TinteBlock, value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const modified = original && value !== original;

  return (
    <div className="flex items-center gap-2 px-1 py-0.5 rounded-md hover:bg-accent/30 group transition-colors">
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="size-5 rounded border border-foreground/10 transition-transform hover:scale-110 cursor-pointer"
          style={{ background: value }}
        />
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer size-5"
        />
      </div>
      <span className="text-[11px] text-muted-foreground flex-1">{label}</span>
      <span className="text-[10px] font-mono text-muted-foreground/70 group-hover:text-muted-foreground transition-colors tabular-nums">
        {value.toUpperCase()}
      </span>
      {modified && (
        <div
          className="size-1.5 rounded-full bg-blue-500 shrink-0"
          title="Modified"
        />
      )}
    </div>
  );
}

function PaletteStrip({ block }: { block: TinteBlock }) {
  const colors = [
    block.bg,
    block.pr,
    block.sc,
    block.ac_1,
    block.ac_2,
    block.ac_3,
    block.tx,
  ];

  return (
    <div className="h-3 rounded-full overflow-hidden flex">
      {colors.map((color, i) => (
        <div
          key={`${color}-${i}`}
          className="flex-1 h-full"
          style={{ background: color }}
        />
      ))}
    </div>
  );
}
