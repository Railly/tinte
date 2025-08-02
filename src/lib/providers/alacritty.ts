import { TinteTheme } from '@/types/tinte';
import { ThemeProvider, ProviderOutput, ProviderMetadata } from './types';
import { AlacrittyIcon } from '@/components/shared/icons/alacritty';
import { 
  createPolineColorMapping, 
  processPaletteHexToInt, 
  toYAML, 
  getThemeName, 
  getDisplayName,
  hexToInt 
} from './poline-base';

export interface AlacrittyTheme {
  colors: {
    primary: {
      background: string;
      foreground: string;
      dim_foreground?: string;
      bright_foreground?: string;
    };
    cursor: {
      text: string;
      cursor: string;
    };
    normal: {
      black: string;
      red: string;
      green: string;
      yellow: string;
      blue: string;
      magenta: string;
      cyan: string;
      white: string;
    };
    bright: {
      black: string;
      red: string;
      green: string;
      yellow: string;
      blue: string;
      magenta: string;
      cyan: string;
      white: string;
    };
    dim?: {
      black: string;
      red: string;
      green: string;
      yellow: string;
      blue: string;
      magenta: string;
      cyan: string;
      white: string;
    };
  };
}

function generateAlacrittyTheme(theme: TinteTheme, mode: 'light' | 'dark'): AlacrittyTheme {
  const block = theme[mode];
  const colorMapping = createPolineColorMapping(block);
  
  // Use opposite mode for some contrast colors
  const oppositeBlock = theme[mode === 'light' ? 'dark' : 'light'];
  const oppositeMapping = createPolineColorMapping(oppositeBlock);
  
  return {
    colors: {
      primary: {
        background: colorMapping.bg,
        foreground: colorMapping.tx,
        dim_foreground: colorMapping.tx2,
        bright_foreground: colorMapping.tx,
      },
      cursor: {
        text: colorMapping.tx2,
        cursor: colorMapping.accent,
      },
      normal: {
        black: oppositeMapping.bg, // Use opposite mode for black
        red: colorMapping.red2,
        green: colorMapping.green2,
        yellow: colorMapping.yellow2,
        blue: colorMapping.blue2,
        magenta: colorMapping.magenta2,
        cyan: colorMapping.cyan2,
        white: colorMapping.tx,
      },
      bright: {
        black: colorMapping.tx3,
        red: colorMapping.red,
        green: colorMapping.green,
        yellow: colorMapping.yellow,
        blue: colorMapping.blue,
        magenta: colorMapping.magenta,
        cyan: colorMapping.cyan,
        white: oppositeMapping.bg, // Use opposite mode for bright white
      },
      dim: {
        black: oppositeMapping.bg,
        red: colorMapping.red2,
        green: colorMapping.green2,
        yellow: colorMapping.yellow2,
        blue: colorMapping.blue2,
        magenta: colorMapping.magenta2,
        cyan: colorMapping.cyan2,
        white: colorMapping.tx2,
      },
    },
  };
}

export class AlacrittyProvider implements ThemeProvider<{ light: AlacrittyTheme; dark: AlacrittyTheme }> {
  readonly metadata: ProviderMetadata = {
    id: 'alacritty',
    name: 'Alacritty',
    description: 'Cross-platform, OpenGL terminal emulator',
    category: 'terminal',
    tags: ['terminal', 'opengl', 'cross-platform'],
    icon: AlacrittyIcon,
    website: 'https://alacritty.org/',
    documentation: 'https://alacritty.org/config.html',
  };

  readonly fileExtension = '.yml';
  readonly mimeType = 'application/x-yaml';

  convert(theme: TinteTheme): { light: AlacrittyTheme; dark: AlacrittyTheme } {
    return {
      light: generateAlacrittyTheme(theme, 'light'),
      dark: generateAlacrittyTheme(theme, 'dark'),
    };
  }

  export(theme: TinteTheme, filename?: string): ProviderOutput {
    const converted = this.convert(theme);
    const themeName = filename || getThemeName('tinte-theme');
    
    // Create both light and dark theme files
    const lightTheme = converted.light;
    const darkTheme = converted.dark;
    
    // For Alacritty, we'll export the dark theme by default (more common)
    // But include both in a structured format
    const output = {
      // Main theme (dark mode)
      ...darkTheme,
      
      // Add metadata
      '# Theme': getDisplayName('Tinte Theme'),
      '# Generator': 'Tinte Theme Converter',
      '# Light mode available': 'Switch colors.primary.background and colors.primary.foreground',
    };

    return {
      content: toYAML(output),
      filename: `${themeName}-alacritty.yml`,
      mimeType: this.mimeType,
    };
  }

  validate(output: { light: AlacrittyTheme; dark: AlacrittyTheme }): boolean {
    const validateTheme = (theme: AlacrittyTheme): boolean => {
      return !!(
        theme.colors?.primary?.background &&
        theme.colors?.primary?.foreground &&
        theme.colors?.normal?.red &&
        theme.colors?.normal?.green &&
        theme.colors?.normal?.blue &&
        theme.colors?.bright?.red &&
        theme.colors?.bright?.green &&
        theme.colors?.bright?.blue
      );
    };

    return validateTheme(output.light) && validateTheme(output.dark);
  }
}