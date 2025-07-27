'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Globe, Palette, Code, MessageSquare } from 'lucide-react';
import { CSSIcon } from '@/components/shared/icons/css';
import { JSONIcon } from '@/components/shared/icons/json';
import { PastedItem, Kind, generatePreview } from '@/lib/input-detection';

const kindIcons = {
  url: Globe,
  json: JSONIcon,
  cssvars: CSSIcon,
  tailwind: Code,
  palette: Palette,
  prompt: MessageSquare
};

interface PastedItemCardProps {
  item: PastedItem;
  onRemove: (id: string) => void;
}

export function PastedItemCard({ item, onRemove }: PastedItemCardProps) {
  const Icon = kindIcons[item.kind];
  const preview = useMemo(() => generatePreview(item.content, item.kind), [item.content, item.kind]);

  const displayTitle = item.metadata?.title || preview.title;
  const displaySubtitle = item.metadata?.description || preview.subtitle;
  const favicon = item.metadata?.favicon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
      className="group relative rounded-lg border border-border/25 bg-background hover:border-border hover:shadow-md shadow-black/5 transition-all cursor-pointer"
      style={{ width: '120px', height: '120px', minWidth: '120px' }}
    >
      {/* Close button */}
      <button
        onClick={() => onRemove(item.id)}
        className="transition-all hover:bg-background text-muted-foreground hover:text-foreground group-focus-within:opacity-100 group-hover:opacity-100 opacity-0 w-5 h-5 absolute -top-2 -left-2 rounded-lg border border-border bg-background shadow-sm flex items-center justify-center z-10"
      >
        <X className="h-3 w-3" />
      </button>

      {/* Content area with mask */}
      <div className="relative flex flex-col gap-1 min-h-0">
        <div className="max-w-full overflow-hidden absolute h-[90px] p-2.5 mask-b-from-40% mask-b-to-100%">
          {item.kind === 'url' && favicon ? (
            <div className="flex items-start gap-2 mb-2">
              <img
                src={favicon}
                alt="favicon"
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="min-w-0">
                <p className="text-[8px] font-medium text-foreground break-words leading-tight mb-1">
                  {displayTitle}
                </p>
                {displaySubtitle && (
                  <p className="text-[8px] text-muted-foreground break-words leading-tight">
                    {displaySubtitle}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[8px] text-muted-foreground break-words leading-tight">
              {item.content}
            </p>
          )}
        </div>
      </div>

      {/* Bottom badge with icon */}
      <div className="absolute bottom-2 left-2.5 right-2.5">
        <div className="relative flex flex-row items-center gap-1 justify-between">
          <div className="flex flex-row gap-1 shrink min-w-0">
            <div className="min-w-0 h-[18px] flex flex-row items-center justify-center gap-1 px-1 border border-border/25 shadow-sm rounded bg-muted/80 backdrop-blur-sm font-medium">
              <Icon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <p className="uppercase truncate text-muted-foreground text-[11px] leading-[13px]">
                pasted
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 