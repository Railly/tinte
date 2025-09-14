"use client";

import { DEFAULT_THEME } from "@/utils/tinte-presets";

export function TinteThemeScript() {
  const scriptContent = `(function() {
    const THEME_KEY = 'tinte-selected-theme';
    const MODE_KEY = 'tinte-current-mode';
    const DEFAULT_THEME = ${JSON.stringify(DEFAULT_THEME)};
    const root = document.documentElement;

    function applyTokens(tokens) {
      if (!tokens) return;
      Object.entries(tokens).forEach(function([key, value]) {
        if (typeof value === 'string') {
          root.style.setProperty('--' + key, value);
        }
      });
    }

    function getMode() {
      try {
        const stored = localStorage.getItem(MODE_KEY);
        if (stored === 'dark' || stored === 'light') return stored;
      } catch (e) {}
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    let theme = DEFAULT_THEME;
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) theme = JSON.parse(stored);
    } catch (e) {}

    const mode = getMode();
    
    if (mode === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Get base tokens - prioritize computedTokens for DOM application
    let tokens;
    if (theme.computedTokens && theme.computedTokens[mode]) {
      tokens = theme.computedTokens[mode];
    } else if (theme.rawTheme && theme.rawTheme[mode]) {
      // If no computedTokens, convert rawTheme to shadcn format for DOM
      const tinteTokens = theme.rawTheme[mode];
      tokens = {
        background: tinteTokens.bg || '#ffffff',
        foreground: tinteTokens.tx || '#000000',
        card: tinteTokens.bg_2 || tinteTokens.bg || '#ffffff',
        'card-foreground': tinteTokens.tx || '#000000',
        popover: tinteTokens.bg_2 || tinteTokens.bg || '#ffffff',
        'popover-foreground': tinteTokens.tx || '#000000',
        primary: tinteTokens.pr || '#3b82f6',
        'primary-foreground': '#ffffff',
        secondary: tinteTokens.sc || '#f1f5f9',
        'secondary-foreground': tinteTokens.tx || '#000000',
        muted: tinteTokens.ui || '#f1f5f9',
        'muted-foreground': tinteTokens.tx_3 || '#64748b',
        accent: tinteTokens.ac_1 || '#f1f5f9',
        'accent-foreground': tinteTokens.tx || '#000000',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        border: tinteTokens.ui || '#e2e8f0',
        input: tinteTokens.ui_2 || tinteTokens.ui || '#e2e8f0',
        ring: tinteTokens.pr || '#3b82f6'
      };
    } else {
      // Fallback to flattened format (dark_bg, light_bg, etc.)
      const tinteTokens = {};
      const prefix = mode + '_';
      for (const key in theme) {
        if (key.startsWith(prefix)) {
          const tokenKey = key.substring(prefix.length);
          tinteTokens[tokenKey] = theme[key];
        }
      }

      if (Object.keys(tinteTokens).length > 0) {
        tokens = {
          background: tinteTokens.bg || '#ffffff',
          foreground: tinteTokens.tx || '#000000',
          card: tinteTokens.bg_2 || tinteTokens.bg || '#ffffff',
          'card-foreground': tinteTokens.tx || '#000000',
          popover: tinteTokens.bg_2 || tinteTokens.bg || '#ffffff',
          'popover-foreground': tinteTokens.tx || '#000000',
          primary: tinteTokens.pr || '#3b82f6',
          'primary-foreground': '#ffffff',
          secondary: tinteTokens.sc || '#f1f5f9',
          'secondary-foreground': tinteTokens.tx || '#000000',
          muted: tinteTokens.ui || '#f1f5f9',
          'muted-foreground': tinteTokens.tx_3 || '#64748b',
          accent: tinteTokens.ac_1 || '#f1f5f9',
          'accent-foreground': tinteTokens.tx || '#000000',
          destructive: '#ef4444',
          'destructive-foreground': '#ffffff',
          border: tinteTokens.ui || '#e2e8f0',
          input: tinteTokens.ui_2 || tinteTokens.ui || '#e2e8f0',
          ring: tinteTokens.pr || '#3b82f6'
        };
      } else {
        tokens = DEFAULT_THEME.computedTokens[mode];
      }
    }

    // Apply overrides if they exist (prioritize shadcn overrides for visual consistency)
    if (theme.overrides && theme.overrides.shadcn && theme.overrides.shadcn[mode]) {
      const overrideTokens = theme.overrides.shadcn[mode];
      // Convert colors to hex and merge
      Object.entries(overrideTokens).forEach(function([key, value]) {
        if (typeof value === 'string') {
          tokens = Object.assign({}, tokens, { [key]: value });
        }
      });
    }

    applyTokens(tokens);

    window.__TINTE_THEME__ = { theme, mode, tokens };
  })();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: scriptContent }}
      suppressHydrationWarning
    />
  );
}
