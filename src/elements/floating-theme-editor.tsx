"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ChevronDown, X, RefreshCw } from "lucide-react";
import { formatHex, oklch } from "culori";
import Logo from "./logo";
import { ColorPickerInput } from "./color-picker-input";

type ShadcnTokens = Record<string, string>;

interface ShadcnTheme {
  light: ShadcnTokens;
  dark: ShadcnTokens;
}

// Token groups for organized UI
const TOKEN_GROUPS = [
  {
    label: "Background & Text",
    tokens: ["background", "foreground", "muted", "muted-foreground"],
  },
  {
    label: "Cards & Surfaces",
    tokens: ["card", "card-foreground", "popover", "popover-foreground"],
  },
  {
    label: "Interactive Elements",
    tokens: ["primary", "primary-foreground", "secondary", "secondary-foreground", "accent", "accent-foreground"],
  },
  {
    label: "Forms & States",
    tokens: ["border", "input", "ring", "destructive", "destructive-foreground"],
  },
  {
    label: "Charts",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    label: "Sidebar",
    tokens: ["sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring"],
  },
] as const;

interface FloatingThemeEditorProps {
  onChange?: (theme: ShadcnTheme) => void;
}

export function FloatingThemeEditor({ onChange }: FloatingThemeEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<ShadcnTheme>({ light: {}, dark: {} });
  const [originalFormats, setOriginalFormats] = useState<Record<string, Record<string, string>>>({ light: {}, dark: {} });
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Background & Text": true,
    "Cards & Surfaces": false,
    "Interactive Elements": false,
    "Forms & States": false,
    "Charts": false,
    "Sidebar": false,
  });

  // Detect color format
  const detectColorFormat = useCallback((colorValue: string): 'hex' | 'oklch' | 'rgb' | 'hsl' | 'unknown' => {
    const trimmed = colorValue.trim();
    if (trimmed.startsWith('#')) return 'hex';
    if (trimmed.startsWith('oklch(')) return 'oklch';
    if (trimmed.startsWith('rgb(')) return 'rgb';
    if (trimmed.startsWith('hsl(')) return 'hsl';
    return 'unknown';
  }, []);

  // Convert any color to hex for color picker
  const convertToHex = useCallback((colorValue: string): string => {
    try {
      const trimmed = colorValue.trim();

      // If it's already hex, return it
      if (trimmed.startsWith('#')) {
        return trimmed;
      }

      // For oklch, rgb, hsl - use culori to convert
      const colorObj = oklch(trimmed);
      if (colorObj) {
        const hex = formatHex(colorObj);
        return hex || '#000000';
      }

      return '#000000';
    } catch {
      return '#000000';
    }
  }, []);

  // Convert hex back to original format
  const convertFromHex = useCallback((hexColor: string, originalValue: string): string => {
    try {
      const format = detectColorFormat(originalValue);

      switch (format) {
        case 'hex':
          return hexColor;

        case 'oklch':
          const oklchColor = oklch(hexColor);
          if (oklchColor) {
            const l = (oklchColor.l || 0);
            const c = (oklchColor.c || 0);
            const h = (oklchColor.h || 0);

            // Match the original format style
            if (originalValue.includes(' / ')) {
              // Handle alpha values like "oklch(1 0 0 / 10%)"
              const alphaMatch = originalValue.match(/\/\s*([\d.]+%?)/);
              const alpha = alphaMatch ? ` / ${alphaMatch[1]}` : '';
              return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)}${alpha})`;
            } else {
              return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`;
            }
          }
          return originalValue;

        default:
          return hexColor;
      }
    } catch {
      return originalValue;
    }
  }, [detectColorFormat]);

  // Load theme from globals.css
  const loadTheme = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/read-globals');
      if (response.ok) {
        const data = await response.json();
        setTheme(data.theme);

        // Store original formats for each token
        const lightFormats: Record<string, string> = {};
        const darkFormats: Record<string, string> = {};

        Object.entries(data.theme.light).forEach(([key, value]) => {
          lightFormats[key] = value as string;
        });

        Object.entries(data.theme.dark).forEach(([key, value]) => {
          darkFormats[key] = value as string;
        });

        setOriginalFormats({ light: lightFormats, dark: darkFormats });

        // Apply to DOM
        applyThemeToDom(data.theme, mode);
      } else {
        console.error('Failed to load theme from globals.css');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
    setLoading(false);
  }, [mode]);

  // Apply theme to DOM
  const applyThemeToDom = useCallback((currentTheme: ShadcnTheme, currentMode: 'light' | 'dark') => {
    const root = document.documentElement;

    // Set mode class
    if (currentMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply CSS custom properties
    const tokens = currentTheme[currentMode];
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, []);

  // Initialize theme
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    setMode(isDark ? 'dark' : 'light');
    loadTheme();
  }, [loadTheme]);

  const handleTokenEdit = useCallback((token: string, hexColor: string) => {
    const originalValue = originalFormats[mode][token] || hexColor;
    const newValue = convertFromHex(hexColor, originalValue);

    setTheme(prev => {
      const updated = {
        ...prev,
        [mode]: {
          ...prev[mode],
          [token]: newValue,
        },
      };

      // Apply immediately to DOM
      applyThemeToDom(updated, mode);
      onChange?.(updated);

      return updated;
    });

    // Update original formats with new value
    setOriginalFormats(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [token]: newValue,
      }
    }));
  }, [mode, originalFormats, convertFromHex, applyThemeToDom, onChange]);

  const handleModeToggle = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    applyThemeToDom(theme, newMode);
  }, [mode, theme, applyThemeToDom]);

  const toggleGroup = useCallback((groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  }, []);

  // Write to globals.css file
  const writeToGlobals = useCallback(async () => {
    try {
      const lightTokens = Object.entries(theme.light)
        .map(([key, value]) => `  --${key}: ${value};`)
        .join('\n');

      const darkTokens = Object.entries(theme.dark)
        .map(([key, value]) => `  --${key}: ${value};`)
        .join('\n');

      const cssContent = `:root {\n${lightTokens}\n}\n\n.dark {\n${darkTokens}\n}`;

      const response = await fetch('/api/write-globals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ css: cssContent })
      });

      if (response.ok) {
        const result = await response.json();
        alert('✅ ' + result.message);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to write globals.css');
      }
    } catch (error) {
      console.error('Failed to write globals.css:', error);
      alert('❌ Failed to write globals.css: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [theme]);

  const availableTokens = TOKEN_GROUPS.flatMap(group =>
    group.tokens.filter(token => theme[mode][token] !== undefined)
  );

  return (
    <>
      {/* Floating Ball */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-card border-2 border-border rounded-full shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center hover:shadow-xl"
          title="Open Theme Editor"
        >
          <Logo size={28} className="drop-shadow-sm" />
        </button>
      </div>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Logo size={24} />
                <div>
                  <h3 className="text-lg font-semibold">Theme Editor</h3>
                  <p className="text-sm text-muted-foreground">
                    Live editing • {availableTokens.length} tokens • {mode} mode
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadTheme}
                  disabled={loading}
                  className="p-1.5 hover:bg-accent rounded-md transition-colors disabled:opacity-50"
                  title="Reload from globals.css"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={handleModeToggle}
                  className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-accent transition-colors"
                >
                  {mode === 'light' ? '☀️ Light' : '🌙 Dark'}
                </button>
                <button
                  onClick={writeToGlobals}
                  className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Save CSS
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-accent rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="animate-spin mr-2" size={20} />
                  <span>Loading theme...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {TOKEN_GROUPS.map((group) => {
                    const groupTokens = group.tokens.filter(token => theme[mode][token] !== undefined);
                    if (groupTokens.length === 0) return null;

                    return (
                      <div key={group.label} className="border border-border rounded-md overflow-hidden">
                        <button
                          onClick={() => toggleGroup(group.label)}
                          className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium hover:bg-accent/50 transition-colors"
                        >
                          <span className="uppercase tracking-wide">
                            {group.label} ({groupTokens.length})
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${openGroups[group.label] ? "rotate-180" : ""}`}
                          />
                        </button>

                        {openGroups[group.label] && (
                          <div className="border-t border-border bg-muted/20 p-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                              {groupTokens.map((token) => (
                                <div key={token} className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                      {token.replace(/_/g, "-")}
                                    </label>
                                    <span className="text-xs text-muted-foreground font-mono">
                                      {detectColorFormat(theme[mode][token])}
                                    </span>
                                  </div>
                                  <ColorPickerInput
                                    color={convertToHex(theme[mode][token])}
                                    onChange={(hexColor) => handleTokenEdit(token, hexColor)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/50">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Changes apply instantly • Original formats preserved (oklch→oklch, hex→hex)</p>
                <p>• Use reload button to refresh from globals.css • Save writes to file</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}