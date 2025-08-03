'use client';

import * as React from 'react';
import { motion, stagger, useAnimate } from 'motion/react';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPickerInput } from '@/components/ui/color-picker-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeSelector } from './theme-selector';
import { FontSelector } from './font-selector';
import { useThemeContext } from '@/providers/theme';
import { TOKEN_GROUPS, NON_COLOR_GROUPS, DEFAULT_FONTS, DEFAULT_BASE, DEFAULT_SHADOWS, type FontToken, type ShadowToken, type BaseVarToken } from '@/types/shadcn';
import { FontInfo } from '@/types/fonts';
import { buildFontFamily } from '@/utils/fonts';

export function ThemeEditorPanel() {
  const [scope, animate] = useAnimate();

  const { currentTokens, allThemes, activeTheme, handleThemeSelect, handleTokenEdit, navigateTheme, mounted } = useThemeContext();

  const handleFontSelect = React.useCallback((key: string, font: FontInfo) => {
    const fontCategory = key.includes('sans') ? 'sans-serif' :
      key.includes('serif') ? 'serif' :
        key.includes('mono') ? 'monospace' : 'sans-serif';
    const fontValue = buildFontFamily(font.family, fontCategory);
    handleTokenEdit(key, fontValue);
  }, [handleTokenEdit]);

  // Organize tokens by groups for better UI
  const organizedTokens = React.useMemo(() => {
    const groups: Array<{
      label: string;
      tokens: Array<[string, string]>;
      type: 'color' | 'fonts' | 'shadow' | 'base';
    }> = [];


    // Color token groups
    TOKEN_GROUPS.forEach(group => {
      const tokens = group.keys
        .map(key => [key, currentTokens[key]] as [string, string])
        .filter(([_, value]) => typeof value === 'string' && value.startsWith('#'));

      if (tokens.length > 0) {
        groups.push({
          label: group.label,
          tokens,
          type: 'color'
        });
      }
    });

    // Non-color token groups - add defaults if missing and display all
    Object.entries(NON_COLOR_GROUPS).forEach(([groupName, groupData]) => {
      if (Array.isArray(groupData)) {
        // Simple array like Fonts or Shadows
        const tokens = groupData.map(key => {
          let value = currentTokens[key];
          if (!value || typeof value !== 'string') {
            // Provide defaults for missing tokens
            if (groupName === 'Fonts') {
              value = DEFAULT_FONTS[key as FontToken] || '';
            } else if (groupName === 'Shadows') {
              value = DEFAULT_SHADOWS[key as ShadowToken] || '';
            }
          }
          return [key, value] as [string, string];
        }).filter(([_, value]) => typeof value === 'string' && value.trim().length > 0);

        if (tokens.length > 0) {
          groups.push({
            label: groupName,
            tokens,
            type: groupName === 'Fonts' ? 'fonts' : groupName === 'Shadows' ? 'shadow' : 'base'
          });
        }
      } else if (groupData.editable) {
        // Complex object like Radius or Tracking with editable fields
        const tokens = groupData.editable.map(key => {
          let value = currentTokens[key];
          if (!value || typeof value !== 'string') {
            // Provide defaults for missing base tokens
            value = DEFAULT_BASE[key as BaseVarToken] || '';
          }
          return [key, value] as [string, string];
        }).filter(([_, value]) => typeof value === 'string' && value.trim().length > 0);

        if (tokens.length > 0) {
          groups.push({
            label: groupName,
            tokens,
            type: 'base'
          });
        }
      }
    });

    return groups;
  }, [currentTokens]);

  const totalTokens = organizedTokens.reduce((sum, group) => sum + group.tokens.length, 0);

  // Check if we have immediate data available
  const hasImmediateData = typeof window !== 'undefined' && window.__TINTE_THEME__ && mounted;

  React.useEffect(() => {
    if (totalTokens > 0) {
      animate(
        ".token-item",
        { opacity: [0, 1], y: [8, 0] },
        {
          duration: 0.3,
          delay: stagger(0.05, { startDelay: 0.1 })
        }
      );
    }
  }, [animate, totalTokens]);
  const activeId = activeTheme?.id || null;

  return (
    <ScrollArea className="h-[calc(100dvh-var(--header-height)_-_4.5rem)]">
      <div className="px-3 space-y-4 flex-shrink-0">
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Theme</div>
          <div className="flex gap-2">
            <ThemeSelector
              themes={allThemes}
              activeId={activeId}
              onSelect={handleThemeSelect}
              triggerClassName="flex-1"
              label="Browse themes…"
            />
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTheme('prev')}
                className="px-2"
                title="Previous theme"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTheme('next')}
                className="px-2"
                title="Next theme"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTheme('random')}
                className="px-2"
                title="Random theme"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0" ref={scope}>
        <div className="p-3 space-y-4">
          <div className="text-xs font-medium text-muted-foreground">Tokens</div>

          {totalTokens === 0 && !hasImmediateData ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, groupIndex) => (
                <div key={`skeleton-group-${groupIndex}`} className="space-y-2">
                  <div className="h-4 bg-muted/50 rounded w-16"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, tokenIndex) => (
                      <motion.div
                        key={`skeleton-${groupIndex}-${tokenIndex}`}
                        className="space-y-1"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{
                          duration: 1.5,
                          delay: (groupIndex * 4 + tokenIndex) * 0.1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="h-3 bg-muted/50 rounded w-20"></div>
                        <div className="h-9 bg-muted/30 rounded"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {organizedTokens.map((group, groupIndex) => (
                <div key={group.label} className="space-y-3">
                  <div className="text-xs uppercase font-medium text-foreground border-b border-border pb-1">
                    {group.label}
                  </div>
                  <div className="space-y-2">
                    {group.tokens.map(([key, value], tokenIndex) => {
                      const globalIndex = organizedTokens
                        .slice(0, groupIndex)
                        .reduce((sum, g) => sum + g.tokens.length, 0) + tokenIndex;

                      return (
                        <motion.div
                          key={key}
                          className="token-item space-y-1"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: globalIndex * 0.02 + 0.1
                          }}
                        >
                          <div className="text-xs font-mono text-muted-foreground">{key}</div>
                          {group.type === 'color' ? (
                            <ColorPickerInput
                              color={value}
                              onChange={(newValue) => handleTokenEdit(key, newValue)}
                            />
                          ) : group.type === 'fonts' ? (
                            <FontSelector
                              value={value.split(',')[0].trim().replace(/['"]/g, '')}
                              category={key.includes('sans') ? 'sans-serif' :
                                key.includes('serif') ? 'serif' :
                                  key.includes('mono') ? 'monospace' : 'sans-serif'}
                              onSelect={(font) => handleFontSelect(key, font)}
                              placeholder="Select font..."
                              className="h-9 text-sm"
                            />
                          ) : (
                            <Input
                              value={value}
                              onChange={(e) => handleTokenEdit(key, e.target.value)}
                              className="h-9 text-sm font-mono"
                              placeholder={group.type === 'shadow' ? 'Box shadow...' :
                                         group.type === 'base' ? 'CSS value...' : 'Value...'}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}