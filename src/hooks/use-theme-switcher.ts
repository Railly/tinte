import { useTheme } from "next-themes";

export function useThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };
  
  return {
    theme,
    toggleTheme,
    isDark: theme === "dark"
  };
}