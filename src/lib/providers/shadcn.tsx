import React from 'react';
import { Palette } from 'lucide-react';
import { ProviderAdapter, ThemeSpec, ThemeMode } from './types';
import ExamplesPreviewContainer from '@/components/examples-preview-container';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ThemeData } from '../theme-applier';
import { CardsDemo } from '@/components/preview/shadcn/cards-demo';

const ShadcnIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Palette className={className} />
);

const ShadcnPreview: React.FC<{
  theme: ThemeData;
  mode: ThemeMode;
}> = ({ mode }) => {
  return (
    <ExamplesPreviewContainer>
      <CardsDemo />
    </ExamplesPreviewContainer>
  );
};

export const shadcnAdapter: ProviderAdapter = {
  id: 'shadcn',
  title: 'shadcn/ui',
  icon: ShadcnIcon,
  Preview: ShadcnPreview,
  export: (theme: ThemeSpec) => ({
    files: {
      'tailwind.config.js': `module.exports = {
  theme: {
    extend: {
      colors: {
        // Light mode
        ${Object.entries(theme.light)
          .map(([key, value]) => `        "${key}": "${value}",`)
          .join('\n')}
      }
    }
  }
}`,
      'globals.css': `:root {
${Object.entries(theme.light)
          .map(([key, value]) => `  --${key}: ${value};`)
          .join('\n')}
}

.dark {
${Object.entries(theme.dark)
          .map(([key, value]) => `  --${key}: ${value};`)
          .join('\n')}
}`
    },
    instructions: [
      'Copy the CSS variables to your globals.css',
      'Update your tailwind.config.js with the color tokens',
      'Use the design system tokens in your components'
    ]
  }),
  supports: {
    fonts: false,
    ansi16: false,
    semanticTokens: false
  }
};