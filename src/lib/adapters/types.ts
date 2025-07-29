import { TinteTheme } from "@/types/tinte";

export interface ThemeAdapter<TOutput = any> {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly version: string;
  readonly fileExtension: string;
  readonly mimeType?: string;
  
  convert(theme: TinteTheme): TOutput;
  
  export?(theme: TinteTheme, filename?: string): {
    content: string;
    filename: string;
    mimeType: string;
  };
  
  validate?(output: TOutput): boolean;
}

export interface PreviewableAdapter<TOutput = any> extends ThemeAdapter<TOutput> {
  preview: {
    component: React.ComponentType<{ theme: TOutput; className?: string }>;
    defaultProps?: Record<string, any>;
  };
}

export interface AdapterMetadata {
  id: string;
  name: string;
  description?: string;
  category: 'editor' | 'terminal' | 'ui' | 'design' | 'other';
  tags: string[];
  icon?: React.ComponentType<{ className?: string }>;
  website?: string;
  documentation?: string;
}

export type AdapterWithMetadata<T = any> = ThemeAdapter<T> & {
  metadata: AdapterMetadata;
};

export type PreviewableAdapterWithMetadata<T = any> = PreviewableAdapter<T> & {
  metadata: AdapterMetadata;
};