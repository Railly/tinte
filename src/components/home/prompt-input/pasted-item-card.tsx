'use client';

import { useMemo, useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { X } from 'lucide-react';
import { Globe, Palette, MessageSquare, Image, FileCode } from 'lucide-react';
import { CSSIcon } from '@/components/shared/icons/css';
import { TailwindIcon } from '@/components/shared/icons/tailwind';
import { PastedItem, Kind, generatePreview } from '@/lib/input-detection';
import { ColorBadge } from './color-badge';

const kindIcons = {
  url: Globe,
  json: FileCode,
  cssvars: CSSIcon,
  tailwind: TailwindIcon,
  palette: Palette,
  prompt: MessageSquare,
  image: Image
};

interface PastedItemCardProps {
  item: PastedItem;
  onRemove: (id: string) => void;
  onEdit?: (item: PastedItem) => void;
}

export function PastedItemCard({ item, onRemove, onEdit }: PastedItemCardProps) {
  const Icon = kindIcons[item.kind];
  const preview = useMemo(() => generatePreview(item.content, item.kind), [item.content, item.kind]);

  const displayTitle = item.metadata?.title || preview.title;
  const displaySubtitle = item.metadata?.description || preview.subtitle;
  const favicon = item.metadata?.favicon;
  const canEdit = ['url', 'tailwind', 'cssvars', 'palette'].includes(item.kind);
  const hasError = item.metadata?.error;
  const isLoading = item.metadata?.loading;
  const controls = useAnimationControls();
  const hasTriggeredError = useRef(false);

  // Initial mount animation
  useEffect(() => {
    controls.start({ opacity: 1, scale: 1 });
  }, [controls]);

  // Trigger shake animation when error occurs
  useEffect(() => {
    if (hasError && item.kind === 'url' && !hasTriggeredError.current) {
      hasTriggeredError.current = true;

      // Trigger device vibration if available
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]); // Short buzz pattern
      }

      // Start shake animation sequence
      const shakeSequence = async () => {
        await controls.start({
          x: [0, -5, 5, -5, 5, -3, 3, -1, 1, 0],
          rotateZ: [0, -2, 2, -2, 2, -1.5, 1.5, -0.5, 0.5, 0],
          transition: {
            duration: 0.6,
            ease: "easeInOut"
          }
        });
      };

      shakeSequence();
    }
  }, [hasError, item.kind, controls]);

  function handleClick() {
    if (canEdit && onEdit) {
      onEdit(item);
    }
  }

  // Test function to trigger shake manually (for debugging)
  const triggerShake = async () => {
    // Trigger device vibration if available
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    await controls.start({
      x: [0, -5, 5, -5, 5, -3, 3, -1, 1, 0],
      rotateZ: [0, -2, 2, -2, 2, -1.5, 1.5, -0.5, 0.5, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 0, rotateZ: 0 }}
      animate={controls}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }}
      layout
      onClick={handleClick}
      onDoubleClick={hasError ? triggerShake : undefined}
      className={`group relative rounded-lg overflow-visible ${hasError
        ? 'border border-red-200 bg-red-50 hover:border-red-300 hover:shadow-md shadow-red-100/20'
        : 'border border-border/40 bg-background/80 hover:border-border/60 hover:shadow-md shadow-black/5'
        } ${canEdit ? 'cursor-pointer' : 'cursor-default'}`}
      style={{ width: '120px', height: '120px', minWidth: '120px' }}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        className="hover:bg-background text-muted-foreground hover:text-foreground w-6 h-6 absolute -top-3 -left-3 rounded-full border border-border bg-background shadow-sm flex items-center justify-center z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>

      {/* Content area with mask */}
      <div className="relative flex flex-col gap-1 h-full">
        <div className={`max-w-full overflow-hidden absolute ${item.kind === 'image'
          ? 'inset-0 p-0'
          : item.kind === 'palette'
            ? 'h-[90px] p-2.5'
            : 'h-[90px] p-2.5 mask-b-from-40% mask-b-to-100%'
          }`}>
          {item.kind === 'image' && item.imageData ? (
            <div className="w-full h-full">
              <img
                src={item.imageData}
                alt="Pasted screenshot"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : item.kind === 'url' && favicon ? (
            <div className="flex items-start gap-2 mb-2">
              <img
                src={favicon}
                alt="favicon"
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="min-w-0">
                <p className={`text-[8px] font-medium break-words leading-tight mb-1 ${hasError ? 'text-red-700' : 'text-foreground'
                  }`}>
                  {displayTitle}
                </p>
                {displaySubtitle && (
                  <p className={`text-[8px] break-words leading-tight ${hasError ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                    {displaySubtitle}
                  </p>
                )}
              </div>
            </div>
          ) : item.kind === 'palette' ? (
            <div className="flex flex-wrap gap-1 p-1">
              {item.colors && item.colors.slice(0, 11).map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded border cursor-pointer hover:scale-110"
                  style={{ backgroundColor: color }}
                  onClick={() => navigator.clipboard.writeText(color)}
                />
              ))}
            </div>
          ) : item.colors && item.colors.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[8px] text-muted-foreground break-words leading-tight">
                {item.content}
              </p>
              <div className="flex flex-wrap gap-1">
                {item.colors.slice(0, 4).map((color) => (
                  <ColorBadge
                    key={color}
                    color={color}
                    size="sm"
                    showHex={false}
                    className="cursor-pointer"
                  />
                ))}
                {item.colors.length > 4 && (
                  <span className="text-[8px] text-muted-foreground">
                    +{item.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className={`text-[8px] break-words leading-tight ${hasError ? 'text-red-600' : 'text-muted-foreground'
              }`}>
              {item.content}
            </p>
          )}
        </div>
      </div>

      {/* Bottom badge with icon */}
      <div className="absolute bottom-2 left-2.5 right-2.5">
        <div className="relative flex flex-row items-center gap-1 justify-between">
          <div className="flex flex-row gap-1 shrink min-w-0">
            <div className={`min-w-0 h-[18px] flex flex-row items-center justify-center gap-1 px-1 border shadow-sm rounded backdrop-blur-sm font-medium ${hasError
              ? 'border-red-200 bg-red-100/80'
              : 'border-border/25 bg-muted/80'
              }`}>
              <Icon className={`h-3 w-3 flex-shrink-0 ${hasError ? 'text-red-600' : 'text-muted-foreground'
                }`} />
              <p className={`uppercase truncate text-[11px] leading-[13px] ${hasError ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                {hasError ? 'error' : item.kind === 'palette' ? 'added' : 'pasted'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 