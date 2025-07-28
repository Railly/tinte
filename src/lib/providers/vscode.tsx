import React from 'react';
import { Code } from 'lucide-react';
import { ProviderAdapter, ThemeSpec, ThemeMode } from './types';
import { VSCodePreview } from '@/components/preview/vscode/preview';

const VSCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Code className={className} />
);

const VSCodePreviewComponent: React.FC<{ 
  theme: ThemeSpec; 
  mode: ThemeMode;
}> = ({ theme, mode }) => {
  return <VSCodePreview theme={theme} mode={mode} />;
};

export const vscodeAdapter: ProviderAdapter = {
  id: 'vscode',
  title: 'VS Code',
  icon: VSCodeIcon,
  Preview: VSCodePreviewComponent,
  export: (theme: ThemeSpec) => {
    const tokens = theme.light;
    const darkTokens = theme.dark;
    
    return {
      files: {
        'theme.json': JSON.stringify({
          name: theme.meta?.name || 'Custom Theme',
          type: 'dark',
          colors: {
            'editor.background': darkTokens.background,
            'editor.foreground': darkTokens.foreground,
            'activityBar.background': darkTokens['background-2'] || darkTokens.background,
            'sideBar.background': darkTokens['background-2'] || darkTokens.background,
            'statusBar.background': darkTokens.primary,
            'titleBar.activeBackground': darkTokens['background-2'] || darkTokens.background,
          },
          tokenColors: [
            {
              scope: ['comment'],
              settings: {
                foreground: darkTokens['text-3'] || darkTokens['muted-foreground'],
                fontStyle: 'italic'
              }
            },
            {
              scope: ['keyword'],
              settings: {
                foreground: darkTokens.primary
              }
            },
            {
              scope: ['string'],
              settings: {
                foreground: darkTokens.accent
              }
            }
          ]
        }, null, 2)
      },
      instructions: [
        'Save as .json file in your VS Code themes folder',
        'Open VS Code > Preferences > Color Theme',
        'Select your custom theme from the list'
      ]
    };
  },
  supports: {
    semanticTokens: true,
    fonts: false,
    ansi16: false,
    density: false
  }
};