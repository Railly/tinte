"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BrandGolang } from "@/components/shared/icons/golang";
import { Javascript } from "@/components/shared/icons/javascript";
import { Python } from "@/components/shared/icons/python";
import { Typescript } from "@/components/shared/icons/typescript";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShikiCssHighlighter } from "@/hooks/use-shiki-css-highlighter";
import { useThemeContext } from "@/providers/theme";
import type { ShikiTheme } from "@/types/shiki";

interface CodeTemplate {
  name: string;
  filename: string;
  language: string;
  code: string;
}

const codeTemplates: CodeTemplate[] = [
  {
    name: "Transformers Demo",
    filename: "transformers.ts",
    language: "typescript",
    code: `// [!code word:transformer:5] - Highlight "transformer" on next 5 lines
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';
import { codeToHtml, createHighlighter } from 'shiki';
import type { BundledLanguage, BundledTheme } from 'shiki';

// Theme configuration interface
interface ThemeConfig {
  light: BundledTheme;
  dark: BundledTheme;
  langs: BundledLanguage[];
}

// Basic transformer usage with diff notation
const oldFunction = () => console.log('old'); // [!code --]
const newFunction = () => console.log('new'); // [!code ++]
const deprecatedMethod = () => window.alert('deprecated'); // [!code --]
const modernMethod = () => window.showNotification('modern'); // [!code ++]

// [!code highlight:3]
const highlighted = true;
const alsoHighlighted = 'yes';
const criticalValue = 'important';

// Error handling patterns
try {
  const result = processData(input); // [!code error]
} catch (error) {
  console.error('Processing failed:', error); // [!code warning]
  return fallbackValue; // [!code highlight]
}

export async function createAdvancedHighlighter(config: ThemeConfig) { // [!code focus]
  const highlighter = await createHighlighter({
    themes: [config.light, config.dark],
    langs: config.langs,
    transformers: [
      transformerNotationDiff(), // Handles diff notation // [!code highlight]
      transformerNotationHighlight(), // Handles highlighting // [!code highlight]
    ]
  });

  return {
    highlight: (code: string, lang: BundledLanguage, theme: BundledTheme) => {
      return highlighter.codeToHtml(code, {
        lang,
        theme,
        transformers: [
          transformerNotationDiff(),
          transformerNotationHighlight(),
        ]
      });
    },
    dispose: () => highlighter.dispose()
  };
}

// Usage example with error handling
const config: ThemeConfig = {
  light: 'github-light',
  dark: 'github-dark',
  langs: ['typescript', 'javascript', 'json']
};

createAdvancedHighlighter(config)
  .then(highlighter => {
    const html = highlighter.highlight(sourceCode, 'typescript', 'github-dark');
    document.getElementById('preview')!.innerHTML = html; // [!code focus]
  })
  .catch(error => {
    console.error('Highlighter creation failed:', error); // [!code error]
  });`,
  },
  {
    name: "JavaScript",
    filename: "example.js",
    language: "javascript",
    code: `// Advanced theme system with dynamic loading
import { createTheme, createHighlighter } from 'shiki/core';
import { createCssVariablesTheme } from 'shiki/core';

// Theme configuration with fallbacks
const THEME_CONFIG = {
  name: 'tinte-css-theme',
  variablePrefix: '--shiki-',
  variableDefaults: {
    '--shiki-color-text': '#24292e',
    '--shiki-color-background': '#ffffff',
    '--shiki-token-constant': '#005cc5',
    '--shiki-token-string': '#032f62',
    '--shiki-token-comment': '#6a737d',
    '--shiki-token-keyword': '#d73a49',
    '--shiki-token-parameter': '#24292e',
    '--shiki-token-function': '#6f42c1',
    '--shiki-token-string-expression': '#032f62',
    '--shiki-token-punctuation': '#24292e',
    '--shiki-token-link': '#032f62'
  },
  fontStyle: true
};

// Create CSS variables theme
const theme = createCssVariablesTheme(THEME_CONFIG);

// Language registry for dynamic loading
const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'jsx', 'tsx',
  'python', 'rust', 'go', 'java', 'cpp',
  'css', 'scss', 'html', 'json', 'yaml'
];

// Cache for highlighters to avoid recreation
const highlighterCache = new Map();

/**
 * Create or retrieve cached highlighter instance
 * @param {string[]} langs - Languages to support
 * @param {string[]} themes - Themes to load
 * @returns {Promise<Object>} Highlighter instance
 */
async function getHighlighter(langs = ['javascript'], themes = [theme]) {
  const cacheKey = JSON.stringify({ langs, themes });

  if (highlighterCache.has(cacheKey)) {
    return highlighterCache.get(cacheKey);
  }

  try {
    const highlighter = await createHighlighter({
      themes,
      langs: langs.filter(lang => SUPPORTED_LANGUAGES.includes(lang))
    });

    highlighterCache.set(cacheKey, highlighter);
    return highlighter;
  } catch (error) {
    console.error('Failed to create highlighter:', error);
    throw new Error(\`Highlighter creation failed: \${error.message}\`);
  }
}

/**
 * Highlight code with error handling and fallbacks
 * @param {string} code - Source code to highlight
 * @param {string} lang - Programming language
 * @param {string} themeName - Theme identifier
 * @returns {Promise<string>} HTML string with syntax highlighting
 */
export async function highlightCode(code, lang, themeName = 'tinte-css-theme') {
  if (!code || typeof code !== 'string') {
    throw new Error('Invalid code input: expected non-empty string');
  }

  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    console.warn(\`Unsupported language: \${lang}, falling back to plaintext\`);
    lang = 'text';
  }

  try {
    const highlighter = await getHighlighter([lang], [theme]);

    return highlighter.codeToHtml(code, {
      lang,
      theme: themeName,
      transformers: []
    });
  } catch (error) {
    console.error('Highlighting failed:', error);
    return \`<pre><code>\${escapeHtml(code)}</code></pre>\`;
  }
}

/**
 * Batch highlight multiple code blocks efficiently
 * @param {Array} codeBlocks - Array of {code, lang} objects
 * @returns {Promise<string[]>} Array of highlighted HTML strings
 */
export async function highlightMultiple(codeBlocks) {
  const langs = [...new Set(codeBlocks.map(block => block.lang))];
  const highlighter = await getHighlighter(langs);

  return Promise.all(
    codeBlocks.map(async ({ code, lang }) => {
      try {
        return await highlighter.codeToHtml(code, {
          lang,
          theme: 'tinte-css-theme'
        });
      } catch (error) {
        console.error(\`Failed to highlight \${lang} code:\`, error);
        return \`<pre><code>\${escapeHtml(code)}</code></pre>\`;
      }
    })
  );
}

// Utility function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Cleanup function for cache management
export function clearHighlighterCache() {
  highlighterCache.forEach(highlighter => {
    if (highlighter.dispose) {
      highlighter.dispose();
    }
  });
  highlighterCache.clear();
}`,
  },
  {
    name: "TypeScript",
    filename: "theme.ts",
    language: "typescript",
    code: `// Advanced TypeScript theme system with generics and decorators
import { EventEmitter } from 'events';
import type { ColorSpace, ColorValue, ThemeMode, TokenType } from './types';

// Base theme interface with generic color system
interface ShikiCssTheme<T extends ColorSpace = 'oklch'> {
  readonly name: string;
  readonly colorSpace: T;
  readonly variables: Record<string, ColorValue<T>>;
  readonly metadata: ThemeMetadata;
}

interface ThemeMetadata {
  readonly author: string;
  readonly version: string;
  readonly description?: string;
  readonly tags: readonly string[];
  readonly created: Date;
  readonly modified: Date;
}

// Token configuration with semantic mapping
interface TokenConfiguration {
  readonly [K in TokenType]: {
    readonly colorKey: string;
    readonly fontWeight?: number;
    readonly fontStyle?: 'normal' | 'italic';
    readonly textDecoration?: 'none' | 'underline' | 'line-through';
  };
}

// Theme configuration with validation
interface ThemeConfig<T extends ColorSpace = 'oklch'> {
  readonly light: ShikiCssTheme<T>;
  readonly dark: ShikiCssTheme<T>;
  readonly tokens: TokenConfiguration;
  readonly preferences: UserPreferences;
}

interface UserPreferences {
  readonly autoSwitch: boolean;
  readonly preferredMode: ThemeMode;
  readonly highContrast: boolean;
  readonly reducedMotion: boolean;
  readonly fontSize: number;
  readonly lineHeight: number;
}

// Event types for theme changes
type ThemeEvent =
  | { type: 'theme-changed'; mode: ThemeMode; theme: ShikiCssTheme }
  | { type: 'variables-updated'; variables: Record<string, string> }
  | { type: 'error'; error: Error; context: string };

// Advanced theme manager with reactive updates
class AdvancedThemeManager<T extends ColorSpace = 'oklch'> extends EventEmitter {
  private currentMode: ThemeMode = 'light';
  private currentTheme: ShikiCssTheme<T>;
  private observer: MutationObserver | null = null;
  private mediaQuery: MediaQueryList;

  constructor(
    private readonly config: ThemeConfig<T>,
    private readonly options: ManagerOptions = {}
  ) {
    super();
    this.currentTheme = config.light;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.initializeManager();
    this.setupEventListeners();
  }

  private initializeManager(): void {
    // Apply initial theme
    this.applyTheme(this.currentTheme);

    // Setup DOM observer for external changes
    if (this.options.watchDom) {
      this.setupDomObserver();
    }

    // Auto-switch based on system preference
    if (this.config.preferences.autoSwitch) {
      this.currentMode = this.mediaQuery.matches ? 'dark' : 'light';
      this.currentTheme = this.config[this.currentMode];
    }
  }

  private setupEventListeners(): void {
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));

    // Listen for visibility changes to refresh theme
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.refreshTheme();
      }
    });
  }

  private handleSystemThemeChange(event: MediaQueryListEvent): void {
    if (!this.config.preferences.autoSwitch) return;

    const newMode: ThemeMode = event.matches ? 'dark' : 'light';
    this.switchMode(newMode);
  }

  private setupDomObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' &&
            mutation.attributeName === 'style') {
          this.validateThemeIntegrity();
        }
      });
    });

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  public switchMode(mode: ThemeMode): void {
    if (this.currentMode === mode) return;

    this.currentMode = mode;
    this.currentTheme = this.config[mode];

    this.applyTheme(this.currentTheme);
    this.emit('theme-changed', {
      type: 'theme-changed',
      mode,
      theme: this.currentTheme
    });
  }

  private applyTheme(theme: ShikiCssTheme<T>): void {
    try {
      const cssVariables = this.convertToCssVariables(theme.variables);

      Object.entries(cssVariables).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });

      // Apply token-specific styles
      this.applyTokenStyles(theme);

      this.emit('variables-updated', {
        type: 'variables-updated',
        variables: cssVariables
      });
    } catch (error) {
      this.emit('error', {
        type: 'error',
        error: error as Error,
        context: 'theme-application'
      });
    }
  }

  private convertToCssVariables(variables: Record<string, ColorValue<T>>): Record<string, string> {
    return Object.fromEntries(
      Object.entries(variables).map(([key, colorValue]) => [
        key.startsWith('--') ? key : \`--shiki-\${key}\`,
        this.formatColorValue(colorValue)
      ])
    );
  }

  private formatColorValue(colorValue: ColorValue<T>): string {
    if (typeof colorValue === 'string') return colorValue;

    // Handle complex color objects
    if ('oklch' in colorValue) {
      const { l, c, h, alpha = 1 } = colorValue.oklch;
      return \`oklch(\${l} \${c} \${h} / \${alpha})\`;
    }

    return String(colorValue);
  }

  private applyTokenStyles(theme: ShikiCssTheme<T>): void {
    Object.entries(this.config.tokens).forEach(([tokenType, config]) => {
      const selector = \`.shiki .token.\${tokenType}\`;
      const color = theme.variables[config.colorKey];

      if (color) {
        const rule = \`
          \${selector} {
            color: \${this.formatColorValue(color)};
            \${config.fontWeight ? \`font-weight: \${config.fontWeight};\` : ''}
            \${config.fontStyle ? \`font-style: \${config.fontStyle};\` : ''}
            \${config.textDecoration ? \`text-decoration: \${config.textDecoration};\` : ''}
          }
        \`;

        this.injectStyles(tokenType, rule);
      }
    });
  }

  private injectStyles(id: string, css: string): void {
    const existingStyle = document.getElementById(\`theme-\${id}\`);
    if (existingStyle) {
      existingStyle.textContent = css;
    } else {
      const style = document.createElement('style');
      style.id = \`theme-\${id}\`;
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  private validateThemeIntegrity(): void {
    const root = document.documentElement;
    const expectedVars = Object.keys(this.currentTheme.variables);

    const missingVars = expectedVars.filter(varName => {
      const cssVar = varName.startsWith('--') ? varName : \`--shiki-\${varName}\`;
      return !root.style.getPropertyValue(cssVar);
    });

    if (missingVars.length > 0) {
      console.warn('Theme integrity check failed:', missingVars);
      this.refreshTheme();
    }
  }

  public refreshTheme(): void {
    this.applyTheme(this.currentTheme);
  }

  public getCurrentTheme(): Readonly<ShikiCssTheme<T>> {
    return this.currentTheme;
  }

  public getCurrentMode(): ThemeMode {
    return this.currentMode;
  }

  public dispose(): void {
    this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange.bind(this));
    this.observer?.disconnect();
    this.removeAllListeners();

    // Clean up injected styles
    document.querySelectorAll('[id^="theme-"]').forEach(el => el.remove());
  }
}

// Configuration options for the manager
interface ManagerOptions {
  readonly watchDom?: boolean;
  readonly validateIntegrity?: boolean;
  readonly autoRefresh?: boolean;
}

// Export factory function for easy instantiation
export function createThemeManager<T extends ColorSpace = 'oklch'>(
  config: ThemeConfig<T>,
  options?: ManagerOptions
): AdvancedThemeManager<T> {
  return new AdvancedThemeManager(config, options);
}

export type {
  ShikiCssTheme,
  ThemeConfig,
  ThemeEvent,
  AdvancedThemeManager
};`,
  },
  {
    name: "React JSX",
    filename: "component.tsx",
    language: "tsx",
    code: `import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useThemeContext } from '@/providers/theme';
import { useShikiCssHighlighter } from '@/hooks/use-shiki-css-highlighter';
import type { ShikiTheme, CodeTemplate } from '@/types/shiki';

// Props interface with comprehensive theme support
interface ShikiPreviewProps {
  theme: ShikiTheme;
  className?: string;
  templates?: CodeTemplate[];
  onTemplateChange?: (template: CodeTemplate) => void;
  showControls?: boolean;
  allowFullscreen?: boolean;
  lineNumbers?: boolean;
  maxHeight?: string;
}

// Custom hook for managing fullscreen state
function useFullscreen(elementRef: React.RefObject<HTMLElement>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = useCallback(async () => {
    if (!elementRef.current || !document.fullscreenEnabled) return;

    try {
      await elementRef.current.requestFullscreen();
      setIsFullscreen(true);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  }, [elementRef]);

  const exitFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) return;

    try {
      await document.exitFullscreen();
      setIsFullscreen(false);
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, enterFullscreen, exitFullscreen };
}

// Performance optimized component with advanced features
export function ShikiPreview({
  theme,
  className = '',
  templates = [],
  onTemplateChange,
  showControls = true,
  allowFullscreen = false,
  lineNumbers = true,
  maxHeight = '600px'
}: ShikiPreviewProps) {
  const { currentMode } = useThemeContext();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [themeVersion, setThemeVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen(containerRef);

  // Memoized theme computation
  const currentTheme = useMemo(() => {
    return theme[currentMode];
  }, [theme, currentMode]);

  // CSS variables generation with caching
  const cssVariables = useMemo(() => {
    const variables = Object.entries(currentTheme.variables)
      .map(([key, value]) => \`  \${key}: \${value};\`)
      .join('\\n');

    const lineNumberStyles = lineNumbers ? \`
      .shiki-css-container code {
        counter-reset: step;
        counter-increment: step 0;
      }

      .shiki-css-container code .line::before {
        content: counter(step);
        counter-increment: step;
        width: 2.5rem;
        margin-right: 1rem;
        display: inline-block;
        text-align: right;
        color: hsl(var(--muted-foreground));
        opacity: 0.6;
        font-variant-numeric: tabular-nums;
        user-select: none;
      }

      .shiki-css-container code .line:last-child:empty::before {
        content: none;
        counter-increment: none;
      }
    \` : '';

    const fullscreenStyles = isFullscreen ? \`
      .shiki-fullscreen {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999 !important;
        background: var(--background) !important;
        padding: 2rem !important;
      }
    \` : '';

    return \`:root {\\n\${variables}\\n}\\n\${lineNumberStyles}\\n\${fullscreenStyles}\`;
  }, [currentTheme.variables, lineNumbers, isFullscreen]);

  // Template selection handler
  const handleTemplateChange = useCallback((index: number) => {
    if (index === selectedTemplate) return;

    setIsLoading(true);
    setError(null);
    setSelectedTemplate(index);
    setThemeVersion(prev => prev + 1);

    const newTemplate = templates[index];
    onTemplateChange?.(newTemplate);

    // Simulate loading state for better UX
    setTimeout(() => setIsLoading(false), 200);
  }, [selectedTemplate, templates, onTemplateChange]);

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showControls) return;

      switch (event.key) {
        case 'ArrowLeft':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            const prevIndex = selectedTemplate > 0 ? selectedTemplate - 1 : templates.length - 1;
            handleTemplateChange(prevIndex);
          }
          break;
        case 'ArrowRight':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            const nextIndex = selectedTemplate < templates.length - 1 ? selectedTemplate + 1 : 0;
            handleTemplateChange(nextIndex);
          }
          break;
        case 'f':
          if (allowFullscreen && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            isFullscreen ? exitFullscreen() : enterFullscreen();
          }
          break;
        case 'Escape':
          if (isFullscreen) {
            event.preventDefault();
            exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTemplate, templates.length, handleTemplateChange, allowFullscreen, isFullscreen, enterFullscreen, exitFullscreen, showControls]);

  // Theme change effect
  useEffect(() => {
    setThemeVersion(prev => prev + 1);
  }, [theme, currentMode]);

  // Get current template
  const currentTemplate = templates[selectedTemplate];

  // Shiki highlighter hook
  const { html, loading: shikiLoading, error: shikiError } = useShikiCssHighlighter({
    themeSet: theme,
    currentMode,
    template: currentTemplate,
    themeVersion,
  });

  // Combined loading state
  const combinedLoading = isLoading || shikiLoading;

  // Error boundary effect
  useEffect(() => {
    if (shikiError) {
      setError(shikiError);
    }
  }, [shikiError]);

  // Loading state component
  const LoadingState = () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
        <div className="text-sm">Loading syntax highlighting...</div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = ({ error }: { error: Error }) => (
    <div className="w-full h-full flex items-center justify-center bg-destructive/10 backdrop-blur-sm">
      <div className="text-center text-destructive p-4">
        <div className="font-semibold mb-2">Highlighting Error</div>
        <div className="text-sm opacity-80">{error.message}</div>
        <button
          className="mt-3 px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors"
          onClick={() => {
            setError(null);
            setThemeVersion(prev => prev + 1);
          }}
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Main preview content
  const PreviewContent = () => (
    <div
      ref={containerRef}
      className={\`h-full flex flex-col \${isFullscreen ? 'shiki-fullscreen' : ''} \${className}\`}
    >
      {/* Controls */}
      {showControls && (
        <div className="p-4 border-b bg-background/95 backdrop-blur-sm flex justify-between items-center">
          <div className="flex items-center gap-2">
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(Number(e.target.value))}
              className="px-3 py-1 bg-background border rounded text-sm"
              disabled={combinedLoading}
            >
              {templates.map((template, index) => (
                <option key={index} value={index}>
                  {template.name} ({template.language})
                </option>
              ))}
            </select>

            {combinedLoading && (
              <div className="animate-spin h-4 w-4 border border-current border-t-transparent rounded-full" />
            )}
          </div>

          {allowFullscreen && (
            <button
              onClick={isFullscreen ? exitFullscreen : enterFullscreen}
              className="px-3 py-1 bg-muted hover:bg-muted/80 rounded text-sm transition-colors"
              title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen (Cmd/Ctrl + F)'}
            >
              {isFullscreen ? '⤲' : '⤢'}
            </button>
          )}
        </div>
      )}

      {/* Preview Area */}
      <div
        className="flex-1 overflow-hidden relative"
        style={{ maxHeight: isFullscreen ? 'none' : maxHeight }}
      >
        <style dangerouslySetInnerHTML={{ __html: cssVariables }} />

        {error ? (
          <ErrorState error={error} />
        ) : combinedLoading ? (
          <LoadingState />
        ) : (
          <ScrollArea className="h-full" showScrollIndicators={true} indicatorType="shadow">
            <div
              className="text-sm !font-mono !text-[13px] !leading-[1.53] shiki-css-container p-4"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </ScrollArea>
        )}
      </div>

      {/* Status Bar */}
      {showControls && currentTemplate && (
        <div className="px-4 py-2 bg-muted/50 border-t text-xs text-muted-foreground flex justify-between">
          <span>{currentTemplate.filename}</span>
          <span>{currentMode} mode • {lineNumbers ? 'Line numbers on' : 'Line numbers off'}</span>
        </div>
      )}
    </div>
  );

  // Render with portal for fullscreen
  if (isFullscreen) {
    return createPortal(<PreviewContent />, document.body);
  }

  return <PreviewContent />;
}

// Export additional utilities
export { useFullscreen };
export type { ShikiPreviewProps };`,
  },
];

interface ShikiPreviewProps {
  theme: ShikiTheme;
  className?: string;
}

export function ShikiPreview({ theme, className }: ShikiPreviewProps) {
  const getLanguageIcon = (language: string, className: string) => {
    switch (language) {
      case "javascript":
        return <Javascript className={className} />;
      case "typescript":
      case "tsx":
        return <Typescript className={className} />;
      case "python":
        return <Python className={className} />;
      case "go":
        return <BrandGolang className={className} />;
      default:
        return (
          <svg className={className} viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75z" />
          </svg>
        );
    }
  };

  const { currentMode } = useThemeContext();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [themeVersion, setThemeVersion] = useState(0);
  const [currentThemeSet, setCurrentThemeSet] = useState(theme);

  // Apply theme changes
  useEffect(() => {
    setCurrentThemeSet(theme);
    setThemeVersion((prev) => prev + 1);
  }, [theme]);

  const template = codeTemplates[selectedTemplate];

  const { html, loading, cssVariables } = useShikiCssHighlighter({
    themeSet: { light: currentThemeSet.light, dark: currentThemeSet.dark },
    currentMode,
    template,
    themeVersion,
  });

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted backdrop-blur-sm text-muted-foreground">
        <div className="text-sm">Loading Shiki CSS...</div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${className || ""} relative`}>
      {/* Preview */}
      <div className="flex-1 overflow-hidden relative">
        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-10">
          <Select
            value={selectedTemplate.toString()}
            onValueChange={(value) => setSelectedTemplate(parseInt(value))}
          >
            <SelectTrigger className="w-[200px] flex items-center gap-2 bg-background/95 backdrop-blur-sm border shadow-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {codeTemplates.map((template, index) => (
                <SelectItem key={index} value={index.toString()}>
                  <div className="flex items-center gap-2">
                    {getLanguageIcon(template.language, "w-4 h-4")}
                    <span>{template.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            ${cssVariables}

            .shiki-css-container code {
              counter-reset: step;
              counter-increment: step 0;
            }

            .shiki-css-container code .line::before {
              content: counter(step);
              counter-increment: step;
              width: 2.5rem;
              margin-right: 1rem;
              display: inline-block;
              text-align: right;
              color: hsl(var(--muted-foreground));
              opacity: 0.6;
              font-variant-numeric: tabular-nums;
              user-select: none;
            }

            .shiki-css-container code .line:last-child:empty::before {
              content: none;
              counter-increment: none;
            }
          `,
          }}
        />
        <ScrollArea
          className="h-full"
          showScrollIndicators={true}
          indicatorType="shadow"
        >
          <div
            className="text-sm !font-mono !text-[13px] !leading-[1.53] !break-words shiki-css-container"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </ScrollArea>
      </div>
    </div>
  );
}
