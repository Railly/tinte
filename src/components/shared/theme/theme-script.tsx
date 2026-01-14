import { DEFAULT_THEME } from "@/utils/default-theme";

export function TinteThemeScript() {
  const scriptContent = `(function() {
    const STORAGE_THEME = 'tinte-selected-theme';
    const STORAGE_MODE = 'tinte-theme-mode';
    const FALLBACK_THEME = ${JSON.stringify(DEFAULT_THEME)};
    const WEIGHTS = ['400', '500', '600', '700'];
    const SYS_FONTS = ['ui-sans-serif', 'ui-serif', 'ui-monospace', 'system-ui', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
    const html = document.documentElement;

    function parseFontName(value) {
      if (!value) return null;
      const name = value.split(',')[0].trim().replace(/['"]/g, '');
      return SYS_FONTS.includes(name.toLowerCase()) ? null : name;
    }

    function createFontUrl(name, weights) {
      const w = (weights || WEIGHTS).join(';');
      return 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(name) + ':wght@' + w + '&display=swap';
    }

    function injectFont(name) {
      const url = createFontUrl(name);
      if (document.querySelector('link[href="' + url + '"]')) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }

    // Detect theme mode
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let activeMode = isDark ? 'dark' : 'light';

    try {
      const saved = localStorage.getItem(STORAGE_MODE);
      if (saved === 'dark' || saved === 'light') activeMode = saved;
    } catch (e) {}

    // Load theme data
    let themeData = FALLBACK_THEME;
    try {
      const saved = localStorage.getItem(STORAGE_THEME);
      if (saved) themeData = JSON.parse(saved);
    } catch (e) {}

    // Extract theme tokens for current mode
    let styleVars;
    if (themeData.computedTokens && themeData.computedTokens[activeMode]) {
      styleVars = themeData.computedTokens[activeMode];
    } else if (themeData.rawTheme && themeData.rawTheme[activeMode]) {
      // Fallback: convert rawTheme to shadcn format
      const raw = themeData.rawTheme[activeMode];
      styleVars = {
        background: raw.bg || '#ffffff',
        foreground: raw.tx || '#000000',
        card: raw.bg_2 || raw.bg || '#ffffff',
        'card-foreground': raw.tx || '#000000',
        popover: raw.bg_2 || raw.bg || '#ffffff',
        'popover-foreground': raw.tx || '#000000',
        primary: raw.pr || '#3b82f6',
        'primary-foreground': '#ffffff',
        secondary: raw.sc || '#f1f5f9',
        'secondary-foreground': raw.tx || '#000000',
        muted: raw.ui || '#f1f5f9',
        'muted-foreground': raw.tx_3 || '#64748b',
        accent: raw.ac_1 || '#f1f5f9',
        'accent-foreground': raw.tx || '#000000',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        border: raw.ui || '#e2e8f0',
        input: raw.ui_2 || raw.ui || '#e2e8f0',
        ring: raw.pr || '#3b82f6'
      };
    } else {
      // Fallback to flattened format
      const flat = {};
      const pre = activeMode + '_';
      for (const k in themeData) {
        if (k.startsWith(pre)) {
          flat[k.substring(pre.length)] = themeData[k];
        }
      }

      if (Object.keys(flat).length > 0) {
        styleVars = {
          background: flat.bg || '#ffffff',
          foreground: flat.tx || '#000000',
          card: flat.bg_2 || flat.bg || '#ffffff',
          'card-foreground': flat.tx || '#000000',
          popover: flat.bg_2 || flat.bg || '#ffffff',
          'popover-foreground': flat.tx || '#000000',
          primary: flat.pr || '#3b82f6',
          'primary-foreground': '#ffffff',
          secondary: flat.sc || '#f1f5f9',
          'secondary-foreground': flat.tx || '#000000',
          muted: flat.ui || '#f1f5f9',
          'muted-foreground': flat.tx_3 || '#64748b',
          accent: flat.ac_1 || '#f1f5f9',
          'accent-foreground': flat.tx || '#000000',
          destructive: '#ef4444',
          'destructive-foreground': '#ffffff',
          border: flat.ui || '#e2e8f0',
          input: flat.ui_2 || flat.ui || '#e2e8f0',
          ring: flat.pr || '#3b82f6'
        };
      } else {
        styleVars = FALLBACK_THEME.computedTokens[activeMode];
      }
    }

    // Merge overrides if present
    if (themeData.overrides && themeData.overrides.shadcn && themeData.overrides.shadcn[activeMode]) {
      const overrides = themeData.overrides.shadcn[activeMode];
      Object.entries(overrides).forEach(function([k, v]) {
        if (typeof v === 'string') styleVars = Object.assign({}, styleVars, { [k]: v });
      });
    }

    // Apply tokens to DOM immediately
    if (styleVars) {
      Object.entries(styleVars).forEach(function([k, v]) {
        if (typeof v === 'string') html.style.setProperty('--' + k, v);
      });
    }

    // Set dark mode class
    if (activeMode === 'dark') html.classList.add('dark');
    html.style.colorScheme = activeMode;

    window.__TINTE_THEME__ = { theme: themeData, mode: activeMode, tokens: styleVars };

    // Load fonts and show body when ready
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(function() {
        document.body.classList.add('fonts-loaded');
      }).catch(function() {
        // Fallback: show content after timeout even if fonts fail
        setTimeout(function() {
          document.body.classList.add('fonts-loaded');
        }, 100);
      });
    } else {
      // No font loading API support, show immediately
      if (document.body) {
        document.body.classList.add('fonts-loaded');
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          document.body.classList.add('fonts-loaded');
        });
      }
    }
  })();`;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: scriptContent,
      }}
      suppressHydrationWarning
    />
  );
}
