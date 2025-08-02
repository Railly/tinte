import { useTinteTheme } from "@/providers/tinte-theme-provider";

export function useThemeSwitcher() {
  const { theme, setTheme, toggleTheme, isDark } = useTinteTheme();
  
  return {
    theme,
    toggleTheme,
    isDark
  };
}