"use client";

import { DEFAULT_THEME } from "@/utils/tinte-presets";

export function TinteThemeScript() {
  const scriptContent = `
    (function() {
      const STORAGE_KEY = "tinte-selected-theme";
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

      function loadAndApplyTheme() {
        console.log('🚀 TinteThemeScript: Starting theme load...');
        
        let theme = DEFAULT_THEME;
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            theme = JSON.parse(stored);
            console.log('✅ TinteThemeScript: Loaded theme from storage:', theme.name || theme.id);
          } else {
            console.log('ℹ️ TinteThemeScript: No stored theme, using default');
          }
        } catch (e) {
          console.log('❌ TinteThemeScript: Error loading from storage:', e);
        }

        const mode = root.classList.contains('dark') ? "dark" : "light";
        const tokens = theme.computedTokens ? theme.computedTokens[mode] : DEFAULT_THEME.computedTokens[mode];
        
        console.log('🔧 TinteThemeScript: Applying tokens...', {
          mode,
          tokensCount: tokens ? Object.keys(tokens).length : 0,
          themeName: theme.name || theme.id
        });
        
        applyTokens(tokens);
        
        window.__TINTE_THEME__ = {
          theme: theme,
          mode: mode,
          tokens: tokens,
          allowTransitions: false
        };
        
        console.log('✅ TinteThemeScript: Theme applied successfully!');
      }

      // Initial load
      loadAndApplyTheme();

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
                applyTokens(newTokens);
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
              applyTokens(newTokens);
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