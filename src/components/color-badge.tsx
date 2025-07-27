'use client';

import { motion } from 'motion/react';

interface ColorBadgeProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  showHex?: boolean;
  className?: string;
}

export function ColorBadge({
  color,
  size = 'md',
  showHex = true,
  className = ''
}: ColorBadgeProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-xs'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center gap-1 ${className}`}
      onClick={() => navigator.clipboard.writeText(color)}
    >
      <div
        className={`${sizeClasses[size]} rounded border border-border/50 shadow-sm flex-shrink-0`}
        style={{ backgroundColor: color }}
        title={color}
      />
      {showHex && (
        <span className={`font-mono ${textSizes[size]} text-muted-foreground`}>
          {color}
        </span>
      )}
    </motion.div>
  );
} 