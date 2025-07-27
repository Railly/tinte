'use client';

import { motion } from 'motion/react';
import { Swatch } from '@/lib/input-detection';

interface PaletteControlsProps {
  base: string;
  setBase: (value: string) => void;
  shift: number;
  setShift: (value: number) => void;
  ramp: Swatch[];
  onApplyPalette?: (ramp: Swatch[]) => void;
}

export function PaletteControls({
  base,
  setBase,
  shift,
  setShift,
  ramp,
  onApplyPalette
}: PaletteControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mt-5 grid gap-3 md:grid-cols-[auto,1fr,auto] md:items-center"
    >
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-md border p-0"
          aria-label="Base color"
        />
        <input
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="w-28 rounded-md border bg-background/70 px-2 py-1.5 font-mono text-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-24">Contrast</span>
        <input
          type="range"
          min={-0.1}
          max={0.2}
          step={0.01}
          value={shift}
          onChange={(e) => setShift(parseFloat(e.target.value))}
          className="w-full"
          aria-label="Contrast shift"
        />
        <span className="text-xs tabular-nums w-10 text-muted-foreground">{shift.toFixed(2)}</span>
      </div>

      <motion.button
        onClick={() => onApplyPalette?.(ramp)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="justify-self-start rounded-xl border px-3 py-2 hover:bg-muted transition-colors"
      >
        Apply as Primary
      </motion.button>
    </motion.div>
  );
} 