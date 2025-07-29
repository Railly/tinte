'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { adapterRegistry } from '@/lib/adapters';
import type { ThemeData as AppThemeData } from '@/lib/theme-applier';
import type { TinteTheme } from '@/types/tinte';
import { ScrollArea } from '../ui/scroll-area';

interface MappingPanelProps {
  provider: string;
  mode: 'light' | 'dark';
  theme: AppThemeData;
}

interface MappingRow {
  token: string;
  source: string;
  transform?: string;
  result: string;
  isOverridden?: boolean;
}

export function MappingPanel({ provider, mode, theme }: MappingPanelProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Convert theme to mapping data
  const mappingData = React.useMemo(() => {
    return generateMappingData(provider, mode, theme);
  }, [provider, mode, theme]);

  // Filter mappings based on search
  const filteredMappings = React.useMemo(() => {
    if (!searchTerm) return mappingData;

    return mappingData.filter(row =>
      row.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.source.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mappingData, searchTerm]);

  return (
    <ScrollArea className="h-[calc(100dvh-var(--header-height)_-_4.5rem)] px-3">
      {/* Compact header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="font-medium text-sm">Mapping</h3>
          <p className="text-xs text-muted-foreground">
            {filteredMappings.length} tokens
          </p>
        </div>
      </div>

      {/* Simplified search */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
        <Input
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-7 h-8 text-xs"
        />
      </div>

      {/* Simple card list instead of complex table */}
      <div className="flex-1 space-y-2 overflow-auto pt-3">
        {filteredMappings.slice(0, 20).map((row, index) => (
          <MappingCard key={`${row.token}-${index}`} row={row} />
        ))}
        {filteredMappings.length > 20 && (
          <div className="text-xs text-muted-foreground text-center py-2">
            +{filteredMappings.length - 20} more tokens
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

function MappingCard({ row }: { row: MappingRow }) {
  return (
    <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="font-mono text-xs font-medium">{row.token}</code>
            {row.isOverridden && (
              <Badge variant="secondary" className="h-4 text-[10px] px-1">
                Override
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            <span className="font-mono">{row.source}</span>
            {row.transform && (
              <>
                <span className="mx-1">→</span>
                <span className="font-mono">{row.transform}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded border flex-shrink-0"
              style={{ backgroundColor: row.result }}
            />
            <code className="font-mono text-xs text-muted-foreground truncate">
              {row.result}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate mapping data for different providers
function generateMappingData(
  provider: string,
  mode: 'light' | 'dark',
  theme: AppThemeData
): MappingRow[] {
  const mappings: MappingRow[] = [];

  // Extract actual theme data from ThemeData
  const themeTokens = theme.rawTheme?.[mode] || {};

  // Convert to TinteTheme format for our converters
  const tinteTheme: TinteTheme = {
    light: theme.rawTheme?.light || {},
    dark: theme.rawTheme?.dark || {},
  };

  try {
    if (provider === 'shadcn') {
      const shadcnTheme = adapterRegistry.convert("shadcn", tinteTheme);
      const shadcnBlock = shadcnTheme[mode];

      Object.entries(shadcnBlock).forEach(([token, value]) => {
        let source = 'tinte.background';
        let transform = '';

        // Enhanced mapping logic
        const mappingLogic: Record<string, { source: string; transform: string }> = {
          'primary': { source: 'tinte.primary', transform: 'tone(L:±0.0)' },
          'background': { source: 'tinte.background', transform: '' },
          'foreground': { source: 'tinte.text', transform: 'contrastText(bg)' },
          'card': { source: 'tinte.background', transform: `surface(${mode === 'light' ? '+0.03' : '-0.03'})` },
          'border': { source: 'tinte.interface', transform: 'tone(L:±0.0)' },
          'input': { source: 'tinte.interface', transform: 'tone(L:±0.0)' },
          'muted': { source: 'tinte.interface_2', transform: `tone(L:${mode === 'light' ? '+0.04' : '-0.06'}, C:-0.10)` },
          'muted-foreground': { source: 'tinte.text_2', transform: `tone(L:${mode === 'light' ? '-0.10' : '+0.15'})` },
          'accent': { source: 'tinte.accent_2', transform: `tone(L:${mode === 'light' ? '+0.02' : '-0.06'})` },
          'secondary': { source: 'tinte.accent', transform: `tone(L:${mode === 'light' ? '+0.00' : '-0.08'})` },
        };

        const mapping = mappingLogic[token];
        if (mapping) {
          source = mapping.source;
          transform = mapping.transform;
        } else if (token.includes('foreground')) {
          source = 'calculated';
          transform = 'contrastText()';
        }

        mappings.push({
          token,
          source,
          transform,
          result: value,
          isOverridden: false,
        });
      });
    } else if (provider === 'vscode') {
      const vscodeThemes = adapterRegistry.convert("vscode", tinteTheme);
      const vscodeTheme = vscodeThemes[mode];
      const vscodeColors = vscodeTheme?.colors || {};

      Object.entries(vscodeColors).forEach(([token, value]) => {
        let source = 'tinte.background';
        let transform = '';

        // VS Code token mapping
        const vscodeMapping: Record<string, { source: string; transform: string }> = {
          'editor.background': { source: 'tinte.background', transform: '' },
          'editor.foreground': { source: 'tinte.text', transform: '' },
          'activityBar.background': { source: 'tinte.background_2', transform: '' },
          'sideBar.background': { source: 'tinte.background_2', transform: '' },
          'statusBar.background': { source: 'tinte.primary', transform: '' },
          'titleBar.activeBackground': { source: 'tinte.background', transform: '' },
          'button.background': { source: 'tinte.primary', transform: '' },
          'input.background': { source: 'tinte.interface_3', transform: '' },
          'dropdown.background': { source: 'tinte.background_2', transform: '' },
        };

        const mapping = vscodeMapping[token];
        if (mapping) {
          source = mapping.source;
          transform = mapping.transform;
        }

        mappings.push({
          token,
          source,
          transform,
          result: typeof value === 'string' ? value : JSON.stringify(value),
          isOverridden: false,
        });
      });

      // Add token colors
      const tokenColors = vscodeTheme?.tokenColors || [];
      tokenColors.slice(0, 20).forEach((tokenColor, index) => {
        const scopeName = Array.isArray(tokenColor.scope)
          ? tokenColor.scope[0]
          : tokenColor.scope || `token-${index}`;

        mappings.push({
          token: `syntax.${scopeName}`,
          source: 'tinte.primary',
          transform: 'syntax mapping',
          result: tokenColor.settings?.foreground || '#ffffff',
          isOverridden: false,
        });
      });
    }
  } catch (error) {
    console.warn('Error generating mapping data:', error);
    // Fallback to basic mappings
    Object.entries(themeTokens).slice(0, 10).forEach(([token, value]) => {
      mappings.push({
        token,
        source: 'tinte.raw',
        transform: '',
        result: String(value || '#000000'),
        isOverridden: false,
      });
    });
  }

  return mappings.slice(0, 100); // Reasonable limit
}