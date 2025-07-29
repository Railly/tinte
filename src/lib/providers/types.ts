import { ShadcnTheme } from "@/types/shadcn";
import { ThemeData } from "../theme-applier";

export type ThemeMode = "light" | "dark";

export interface ExportBundle {
  files: Record<string, string>;
  instructions?: string[];
}

export interface ProviderAdapter {
  id: string;
  title: string;
  icon: React.FC<{ className?: string }>;
  Panel?: React.FC<{
    theme: ThemeData;
    onChange: (partial: Partial<ThemeData>) => void;
    mode: ThemeMode;
  }>;
  Preview: React.FC<{
    theme: ThemeData;
    mode: ThemeMode;
  }>;
  import?: (input: string) => Partial<ThemeData>;
  export: (theme: ThemeData) => ExportBundle;
  supports?: {
    fonts?: boolean;
    ansi16?: boolean;
    semanticTokens?: boolean;
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
