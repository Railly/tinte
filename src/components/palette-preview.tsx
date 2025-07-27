'use client';

import { motion } from 'motion/react';
import { Swatch } from '@/lib/input-detection';

interface PalettePreviewProps {
  ramp: Swatch[];
}

export function PalettePreview({ ramp }: PalettePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-4"
    >
      <div className="mb-2 text-sm text-muted-foreground">Generated palette</div>
      <div className="grid grid-cols-6 md:grid-cols-11 gap-2">
        {ramp.map(({ step, hex }, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.4 + index * 0.03,
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => navigator.clipboard.writeText(hex)}
          >
            <div className="h-10 w-full rounded-md border" style={{ background: hex }} />
            <div className="text-[10px] text-muted-foreground">{step}</div>
            <div className="text-[10px] font-mono text-muted-foreground">{hex}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 