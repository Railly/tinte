'use client';

import { AnimatePresence, motion } from 'motion/react';
import { PastedItem } from '@/lib/input-detection';
import { PastedItemCard } from './pasted-item-card';

interface PastedItemsListProps {
  pastedItems: PastedItem[];
  onRemoveItem: (id: string) => void;
}

export function PastedItemsList({ pastedItems, onRemoveItem }: PastedItemsListProps) {
  return (
    <AnimatePresence>
      {pastedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 flex flex-wrap gap-2"
        >
          {pastedItems.map((item) => (
            <PastedItemCard
              key={item.id}
              item={item}
              onRemove={onRemoveItem}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 