'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TinteTheme } from '@/types/tinte';
import { ShadcnTheme } from '@/types/shadcn';
import { ThemeColorPreview } from '@/components/shared/theme-color-preview';
import { shadcnToTinte } from '@/lib/shadcn-to-tinte';
import { buildShadcnFromTinte, makePolineFromTinte, polineRampHex } from '@/lib/ice-theme';
import { getAvailableProviders, getPreviewableProviders } from '@/config/providers';

// Import theme presets
import { extractRaysoThemeData } from '@/utils/rayso-presets';
import { extractTinteThemeData } from '@/utils/tinte-presets';
import { extractTweakcnThemeData } from '@/utils/tweakcn-presets';

export interface UnifiedThemeData {
  id: string;
  name: string;
  author?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  createdAt: string;
  rawTheme: TinteTheme;
  sourceFormat: 'rayso' | 'tinte' | 'tweakcn';
  originalTheme?: any; // Store original theme for reference
}

interface EnhancedTinteThemeSwitcherProps {
  activeTheme?: UnifiedThemeData | null;
  onSelect: (theme: UnifiedThemeData) => void;
  triggerClassName?: string;
  label?: string;
  enablePoline?: boolean;
  polineConfig?: {
    numPoints?: number;
    preserveKeys?: ('primary' | 'secondary' | 'accent' | 'accent_2' | 'accent_3')[];
  };
}

function convertTweakcnToTinte(tweakcnTheme: ShadcnTheme): TinteTheme {
  return shadcnToTinte(tweakcnTheme);
}

function applyPolineTransformation(
  theme: TinteTheme, 
  config: {
    numPoints?: number;
    preserveKeys?: ('primary' | 'secondary' | 'accent' | 'accent_2' | 'accent_3')[];
  } = {}
): TinteTheme {
  const { numPoints = 11, preserveKeys = ['primary', 'secondary', 'accent', 'accent_2', 'accent_3'] } = config;
  
  const transformBlock = (block: any) => {
    // Create Poline instance
    const poline = makePolineFromTinte(block);
    poline.numPoints = numPoints;
    
    // Generate ramp
    const ramp = polineRampHex(poline);
    
    // Create transformed block with preserved keys
    const transformed = { ...block };
    
    // Apply Poline extrapolation to non-preserved keys
    const nonPreservedKeys = [
      'interface', 'interface_2', 'interface_3',
      'text_3', 'text_2', 'background_2'
    ];
    
    nonPreservedKeys.forEach((key, index) => {
      if (ramp[index]) {
        transformed[key] = ramp[index];
      }
    });
    
    return transformed;
  };

  return {
    light: transformBlock(theme.light),
    dark: transformBlock(theme.dark),
  };
}

export function EnhancedTinteThemeSwitcher({
  activeTheme,
  onSelect,
  triggerClassName,
  label = 'Select Theme',
  enablePoline = false,
  polineConfig = {},
}: EnhancedTinteThemeSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'rayso' | 'tinte' | 'tweakcn'>('rayso');

  // Get all theme data organized by source
  const allThemes = React.useMemo(() => {
    const isDark = false; // You might want to make this dynamic based on current theme mode
    
    const raysoThemes = extractRaysoThemeData(isDark).map(theme => ({
      ...theme,
      sourceFormat: 'rayso' as const,
      originalTheme: theme.rawTheme,
    }));
    
    const tinteThemes = extractTinteThemeData(isDark).map(theme => ({
      ...theme,
      sourceFormat: 'tinte' as const,
      originalTheme: theme.rawTheme,
    }));
    
    const tweakcnThemes = extractTweakcnThemeData(isDark).map(theme => {
      const convertedTheme = convertTweakcnToTinte(theme.rawTheme as ShadcnTheme);
      return {
        ...theme,
        sourceFormat: 'tweakcn' as const,
        rawTheme: convertedTheme,
        originalTheme: theme.rawTheme,
      };
    });
    
    return {
      rayso: raysoThemes,
      tinte: tinteThemes,
      tweakcn: tweakcnThemes,
    };
  }, []);

  const handleThemeSelection = (theme: UnifiedThemeData) => {
    let finalTheme = theme;
    
    // Apply Poline transformation if enabled
    if (enablePoline) {
      const transformedRawTheme = applyPolineTransformation(theme.rawTheme, polineConfig);
      finalTheme = {
        ...theme,
        rawTheme: transformedRawTheme,
      };
    }
    
    onSelect(finalTheme);
    setOpen(false);
  };

  const currentTabThemes = allThemes[activeTab] || [];

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            size="sm"
            className={cn('justify-between gap-2 min-w-[200px]', triggerClassName)}
            title={label}
          >
            <div className="flex items-center gap-2 min-w-0">
              {activeTheme && <ThemeColorPreview colors={activeTheme.colors} maxColors={3} />}
              <span className="truncate">
                {activeTheme ? `${activeTheme.name} (${activeTheme.sourceFormat})` : label}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[400px] p-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rayso" className="text-xs">
                Rayso ({allThemes.rayso.length})
              </TabsTrigger>
              <TabsTrigger value="tinte" className="text-xs">
                Tinte ({allThemes.tinte.length})
              </TabsTrigger>
              <TabsTrigger value="tweakcn" className="text-xs">
                TweakCN ({allThemes.tweakcn.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <Command>
                <CommandInput placeholder={`Search ${activeTab} themes...`} className="h-9" />
                <CommandList className="max-h-[300px]">
                  <CommandEmpty>No theme found.</CommandEmpty>
                  <CommandGroup>
                    {currentTabThemes.map((theme) => (
                      <CommandItem
                        key={theme.id}
                        value={`${theme.name} ${theme.author || ''}`}
                        onSelect={() => handleThemeSelection(theme)}
                        className="gap-2"
                      >
                        <ThemeColorPreview colors={theme.colors} maxColors={3} />
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium truncate">{theme.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              {theme.sourceFormat}
                            </span>
                          </div>
                          {theme.author && (
                            <span className="text-[10px] text-muted-foreground truncate">
                              {theme.author}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
      
      {enablePoline && (
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>🎨 Poline transformation enabled</span>
            <span className="text-[10px] bg-muted px-2 py-1 rounded">
              Points: {polineConfig.numPoints || 11} | 
              Preserved: {(polineConfig.preserveKeys || []).length} keys
            </span>
          </div>
        </div>
      )}
      
      {activeTheme && (
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Active:</span>
            <span>{activeTheme.name}</span>
            <span className="text-[10px] bg-muted px-2 py-1 rounded uppercase">
              {activeTheme.sourceFormat}
            </span>
          </div>
          {activeTheme.author && (
            <div className="text-muted-foreground">
              By {activeTheme.author}
            </div>
          )}
        </div>
      )}
    </div>
  );
}