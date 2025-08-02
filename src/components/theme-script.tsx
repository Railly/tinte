"use client";

import { DEFAULT_THEME } from "@/utils/tinte-presets";

export function TinteThemeScript() {
  const scriptContent = `
    (function() {
      const THEME_KEY = "tinte-selected-theme";
      const MODE_KEY = "tinte-current-mode";
      const DEFAULT_THEME = ${JSON.stringify(DEFAULT_THEME)};
      const root = document.documentElement;

      function applyTokens(tokens) {
        if (!tokens) return;
        Object.entries(tokens).forEach(function([key, value]) {
          if (typeof value === "string" && 
              !key.startsWith("font-") && 
              !key.startsWith("shadow-") &&
              key !== "radius" && 
              key !== "spacing" && 
              key !== "letter-spacing") {
            root.style.setProperty("--" + key, value);
          }
        });
      }

      function getMode() {
        try {
          const stored = localStorage.getItem(MODE_KEY);
          if (stored === "dark" || stored === "light") return stored;
        } catch (e) {}
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }

      function loadAndApplyTheme() {
        let theme = DEFAULT_THEME;
        try {
          const stored = localStorage.getItem(THEME_KEY);
          if (stored) {
            theme = JSON.parse(stored);
          }
        } catch (e) {}

        const mode = getMode();
        
        if (mode === "dark") {
          root.classList.add("dark");
          root.style.colorScheme = "dark";
        } else {
          root.classList.remove("dark");
          root.style.colorScheme = "light";
        }

        const tokens = theme.computedTokens ? theme.computedTokens[mode] : DEFAULT_THEME.computedTokens[mode];
        applyTokens(tokens);
        
        window.__TINTE_THEME__ = { theme, mode, tokens };
      }

      loadAndApplyTheme();
    })();
  `;

  return (
    <script 
      dangerouslySetInnerHTML={{ __html: scriptContent }} 
      suppressHydrationWarning 
    />
  );
}