'use client';

import { motion } from 'motion/react';
import { Swatch } from '@/lib/input-detection';

interface PaletteControlsProps {
  base: string;
  setBase: (value: string) => void;
  ramp: Swatch[];
}

export function PaletteControls({
  base,
  setBase,
  ramp
}: PaletteControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mt-5 grid gap-3 md:grid-cols-[auto] md:items-center"
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

    </motion.div>
  );
} 