'use client';

import { AnimatePresence, motion } from 'motion/react';
import { PastedItem } from '@/lib/input-detection';
import { PastedItemCard } from './pasted-item-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PastedItemsListProps {
  pastedItems: PastedItem[];
  onRemoveItem: (id: string) => void;
  onEditItem?: (item: PastedItem) => void;
  onClearAll?: () => void;
}

export function PastedItemsList({ pastedItems, onRemoveItem, onEditItem, onClearAll }: PastedItemsListProps) {
  return (
    <AnimatePresence>
      {pastedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3 relative"
        >
          {/* Clear All button */}
          {onClearAll && pastedItems.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="absolute rounded-none rounded-bl-sm top-0 right-0 z-10 h-6 w-6 p-0 text-destructive/60 bg-destructive/5 hover:text-destructive/80 hover:bg-destructive/10"
              title="Clear all items"
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          <ScrollArea className="w-full overflow-visible">
            <div className="flex gap-2 p-4">
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