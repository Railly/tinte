interface Coords {
  x: number;
  y: number;
}

export interface ThemeData {
  id: string;
  name: string;
  description: string;
  author: string;
  downloads: number;
  likes: number;
  views: number;
  createdAt: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  tags: string[];
  rawTheme?: any;
}

export function applyThemeWithTransition(
  themeData: ThemeData,
  currentMode: 'light' | 'dark',
  coords?: Coords
) {
  const root = document.documentElement;
  
  // Add haptic feedback (iOS-style vibration)
  if ('vibrate' in navigator) {
    // Subtle haptic pattern: short-long-short (like iOS selection feedback)
    navigator.vibrate([10, 20, 15]);
  }
  
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!document.startViewTransition || prefersReducedMotion) {
    applyThemeDirectly(themeData, currentMode);
    return;
  }

  if (coords) {
    const xPercent = (coords.x / window.innerWidth) * 100;
    const yPercent = (coords.y / window.innerHeight) * 100;
    root.style.setProperty("--x", `${xPercent}%`);
    root.style.setProperty("--y", `${yPercent}%`);
  }

  document.startViewTransition(() => {
    applyThemeDirectly(themeData, currentMode);
  });
}

function applyThemeDirectly(themeData: ThemeData, currentMode: 'light' | 'dark') {
  const root = document.documentElement;
  
  if (themeData.author === 'tweakcn' && themeData.rawTheme) {
    const tokens = themeData.rawTheme[currentMode];
    Object.entries(tokens).forEach(([key, value]) => {
      if (typeof value === 'string' && !key.startsWith('font-') && !key.startsWith('shadow-') && key !== 'radius' && key !== 'spacing' && key !== 'letter-spacing') {
        root.style.setProperty(`--${key}`, value);
      }
    });
  } else {
    const colors = themeData.colors;
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    
    const isDark = currentMode === 'dark';
    if (isDark) {
      root.style.setProperty('--card', colors.background);
      root.style.setProperty('--card-foreground', colors.foreground);
      root.style.setProperty('--popover', colors.background);
      root.style.setProperty('--popover-foreground', colors.foreground);
      root.style.setProperty('--primary-foreground', colors.background);
      root.style.setProperty('--secondary-foreground', colors.foreground);
      root.style.setProperty('--muted', adjustBrightness(colors.background, 10));
      root.style.setProperty('--muted-foreground', adjustBrightness(colors.foreground, -20));
      root.style.setProperty('--accent-foreground', colors.foreground);
      root.style.setProperty('--border', adjustOpacity(colors.foreground, 0.2));
      root.style.setProperty('--input', adjustOpacity(colors.foreground, 0.15));
    } else {
      root.style.setProperty('--card', colors.background);
      root.style.setProperty('--card-foreground', colors.foreground);
      root.style.setProperty('--popover', colors.background);
      root.style.setProperty('--popover-foreground', colors.foreground);
      root.style.setProperty('--primary-foreground', colors.background);
      root.style.setProperty('--secondary-foreground', colors.foreground);
      root.style.setProperty('--muted', adjustBrightness(colors.background, -3));
      root.style.setProperty('--muted-foreground', adjustBrightness(colors.foreground, 20));
      root.style.setProperty('--accent-foreground', colors.foreground);
      root.style.setProperty('--border', adjustBrightness(colors.background, -15));
      root.style.setProperty('--input', adjustBrightness(colors.background, -15));
    }
  }
}

function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function adjustOpacity(color: string, opacity: number): string {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
}