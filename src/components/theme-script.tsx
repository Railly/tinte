"use client";

import { DEFAULT_THEME } from "@/utils/tinte-presets";

export function TinteThemeScript() {
  const scriptContent = `
    // ----- CLEAN THEME INITIALIZATION -----
    (function() {
      const STORAGE_KEY = "tinte-selected-theme";
      const root = document.documentElement;
      const DEFAULT_THEME = ${JSON.stringify(DEFAULT_THEME)};

      // Load theme from storage
      let storedTheme = null;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        storedTheme = stored ? JSON.parse(stored) : null;
      } catch (e) {}

      // Get current mode
      const mode = root.classList.contains('dark') ? "dark" : "light";
      
      // Get tokens and apply immediately
      const theme = storedTheme || DEFAULT_THEME;
      const tokens = theme.computedTokens ? theme.computedTokens[mode] : DEFAULT_THEME.computedTokens[mode];
      
      if (tokens) {
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

      // Initialize global state
      window.__TINTE_THEME__ = {
        theme: theme,
        mode: mode,
        tokens: tokens,
        allowTransitions: false
      };

      // Enable transitions after load
      setTimeout(function() {
        if (window.__TINTE_THEME__) {
          window.__TINTE_THEME__.allowTransitions = true;
        }
      }, 1000);

      // Watch for mode changes
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.attributeName === 'class') {
            const newMode = root.classList.contains('dark') ? "dark" : "light";
            const state = window.__TINTE_THEME__;
            
            if (state && newMode !== state.mode) {
              const newTokens = state.theme.computedTokens[newMode];
              
              const apply = function() {
                if (newTokens) {
                  Object.entries(newTokens).forEach(function([key, value]) {
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
                state.mode = newMode;
                state.tokens = newTokens;
              };
              
              if (state.allowTransitions && 
                  document.startViewTransition && 
                  !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.startViewTransition(apply);
              } else {
                apply();
              }
            }
          }
        });
      });
      
      observer.observe(root, { attributes: true, attributeFilter: ['class'] });
      
      // Watch for theme changes in localStorage
      window.addEventListener('storage', function(e) {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const newTheme = JSON.parse(e.newValue);
            const currentMode = root.classList.contains('dark') ? "dark" : "light";
            const newTokens = newTheme.computedTokens ? newTheme.computedTokens[currentMode] : null;
            
            if (newTokens && window.__TINTE_THEME__) {
              Object.entries(newTokens).forEach(function([key, value]) {
                if (typeof value === "string" && 
                    !key.startsWith("font-") && 
                    !key.startsWith("shadow-") &&
                    key !== "radius" && 
                    key !== "spacing" && 
                    key !== "letter-spacing") {
                  root.style.setProperty("--" + key, value);
                }
              });
              
              window.__TINTE_THEME__.theme = newTheme;
              window.__TINTE_THEME__.tokens = newTokens;
            }
          } catch (e) {}
        }
      });
    })();
  `;

  return (
    <script 
      dangerouslySetInnerHTML={{ __html: scriptContent }} 
      suppressHydrationWarning 
    />
  );
}