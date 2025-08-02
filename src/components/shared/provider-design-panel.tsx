'use client';

import * as React from 'react';
import { motion, stagger, useAnimate } from 'motion/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPickerInput } from '@/components/ui/color-picker-input';
import { TinteThemeSwitcher } from './tinte-theme-switcher';
import { useTheme } from '@/hooks/use-theme';

export function ProviderDesignPanel() {
  const [scope, animate] = useAnimate();

  const { currentTokens, allThemes, activeTheme, handleThemeSelect, handleTokenEdit, mounted } = useTheme();
  const tokenEntries = Object.entries(currentTokens);
  
  // Check if we have immediate data available
  const hasImmediateData = typeof window !== 'undefined' && window.__TINTE_THEME__ && mounted;

  React.useEffect(() => {
    if (tokenEntries.length > 0) {
      animate(
        ".token-item",
        { opacity: [0, 1], y: [8, 0] },
        {
          duration: 0.3,
          delay: stagger(0.05, { startDelay: 0.1 })
        }
      );
    }
  }, [animate, tokenEntries.length]);
  const activeId = activeTheme?.id || null;

  return (
    <ScrollArea className="h-[calc(100dvh-var(--header-height)_-_4.5rem)]">
      <div className="px-3 space-y-4 border-b flex-shrink-0">
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Theme</div>
          <TinteThemeSwitcher
            themes={allThemes}
            activeId={activeId}
            onSelect={handleThemeSelect}
            triggerClassName="w-full"
            label="Browse themes…"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0" ref={scope}>
        <div className="p-3 space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Tokens</div>
          <div className="space-y-2">
            {tokenEntries.length === 0 && !hasImmediateData ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    className="space-y-1"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="h-3 bg-muted/50 rounded w-20"></div>
                    <div className="h-9 bg-muted/30 rounded"></div>
                  </motion.div>
                ))}
              </div>
            ) : (
              tokenEntries.map(([key, value], index) => (
                <motion.div
                  key={key}
                  className="token-item space-y-1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05 + 0.1
                  }}
                >
                  <div className="text-xs font-mono text-muted-foreground">{key}</div>
                  <ColorPickerInput
                    color={value}
                    onChange={(newValue) => handleTokenEdit(key, newValue)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}