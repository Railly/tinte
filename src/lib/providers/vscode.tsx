import React from 'react';
import { ProviderAdapter, ThemeMode } from './types';
import { VSCodePreview } from '@/components/preview/vscode/preview';
import { ThemeData } from '../theme-applier';
import { VSCodeIcon } from '@/components/shared/icons/vscode';

const VSCodePreviewComponent: React.FC<{
  theme: ThemeData;
  mode: ThemeMode;
}> = ({ theme, mode }) => {
  return <VSCodePreview theme={theme} mode={mode} />;
};

export const vscodeAdapter: ProviderAdapter = {
  id: 'vscode',
  title: 'VS Code',
  icon: VSCodeIcon,
  Preview: VSCodePreviewComponent,
  export: (theme: ThemeData) => {
    // no light for now
    // const tokens = theme.light;
    const darkTokens = theme.rawTheme.dark;

    return {
      files: {
        'theme.json': JSON.stringify({
          name: theme.name || 'Custom Theme',
          type: 'dark',
          colors: {
            'editor.background': darkTokens.background,
            'editor.foreground': darkTokens.foreground,
            'activityBar.background': darkTokens.background,
            'sideBar.background': darkTokens.background,
            'statusBar.background': darkTokens.primary,
            'titleBar.activeBackground': darkTokens.background,
          },
          tokenColors: [
            {
              scope: ['comment'],
              settings: {
                foreground: darkTokens['muted-foreground'],
                fontStyle: 'italic'
              }
            },
            {
              scope: ['keyword'],
              settings: {
                foreground: darkTokens.primary,
              },
            },
            {
              scope: ["string"],
              settings: {
                foreground: darkTokens.accent,
              },
            },
          ],
        },
          null,
          2,
        ),
      },
      instructions: [
        "Save as .json file in your VS Code themes folder",
        "Open VS Code > Preferences > Color Theme",
        "Select your custom theme from the list",
      ],
    };
  },
  supports: {
    semanticTokens: true,
    fonts: false,
    ansi16: false,
  },
};