import { ReactNode } from 'react';
import { TinteTheme, TinteBlock } from '@/types/tinte';

export type ThemeMode = 'light' | 'dark';
export type ThemeDensity = 'comfort' | 'compact';

export interface ThemeSpec extends TinteTheme {
  meta?: {
    name?: string;
    author?: string;
    version?: string;
  };
}

export interface ExportBundle {
  files: Record<string, string>;
  instructions?: string[];
}

export interface ProviderAdapter {
  id: string;
  title: string;
  icon: React.FC<{ className?: string }>;
  Panel?: React.FC<{ 
    theme: ThemeSpec; 
    onChange: (partial: Partial<ThemeSpec>) => void;
    mode: ThemeMode;
  }>;
  Preview: React.FC<{ 
    theme: ThemeSpec; 
    mode: ThemeMode;
    density?: ThemeDensity;
  }>;
  import?: (input: string) => Partial<ThemeSpec>;
  export: (theme: ThemeSpec) => ExportBundle;
  supports?: {
    fonts?: boolean;
    ansi16?: boolean;
    semanticTokens?: boolean;
    density?: boolean;
  };
}

export interface StressState {
  hover: boolean;
  focus: boolean;
  disabled: boolean;
  error: boolean;
  rtl: boolean;
  highContrast: boolean;
}