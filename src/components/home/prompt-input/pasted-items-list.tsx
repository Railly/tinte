'use client';

import { AnimatePresence, motion } from 'motion/react';
import { PastedItem } from '@/lib/input-detection';
import { PastedItemCard } from './pasted-item-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface PastedItemsListProps {
  pastedItems: PastedItem[];
  onRemoveItem: (id: string) => void;
  onEditItem?: (item: PastedItem) => void;
}

export function PastedItemsList({ pastedItems, onRemoveItem, onEditItem }: PastedItemsListProps) {
  return (
    <AnimatePresence>
      {pastedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3"
        >
          <ScrollArea className="w-full overflow-visible">
            <div className="flex gap-2 pb-2 pt-3 px-3">
              {pastedItems.slice().reverse().map((item) => (
                <PastedItemCard
                  key={item.id}
                  item={item}
                  onRemove={onRemoveItem}
                  onEdit={onEditItem}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 