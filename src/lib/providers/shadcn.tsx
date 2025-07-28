import React from 'react';
import { Palette } from 'lucide-react';
import { ProviderAdapter, ThemeSpec, ThemeMode, ThemeDensity } from './types';
import { KitchenSink } from '@/components/preview/shadcn/kitchen-sink';
import ExamplesPreviewContainer from '@/components/examples-preview-container';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const ShadcnIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Palette className={className} />
);

const ShadcnPreview: React.FC<{ 
  theme: ThemeSpec; 
  mode: ThemeMode;
  density?: ThemeDensity;
}> = ({ theme, mode, density = 'comfort' }) => {
  // Convert theme tokens to CSS variables (theme is already shadcn format)
  const tokens = theme[mode] as any;
  
  return (
    <div
      className={mode === 'dark' ? 'dark' : ''}
      style={{
        // Apply theme tokens as CSS variables
        ...Object.fromEntries(
          Object.entries(tokens).map(([key, value]) => [`--${key}`, value])
        )
      }}
    >
      <ExamplesPreviewContainer className="size-full">
        <ScrollArea className="size-full">
          <div className="relative w-full h-[600px] overflow-hidden">
            <KitchenSink mode={mode} density={density} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </ExamplesPreviewContainer>
    </div>
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
    density: true,
    fonts: false,
    ansi16: false,
    semanticTokens: false
  }
};