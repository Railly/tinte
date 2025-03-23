import { useTheme } from "next-themes";

export const useBinaryTheme = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  const getCurrentTheme = (): "light" | "dark" => {
    if (theme === "system") {
      return systemTheme === "light" ? "light" : "dark";
    }
    return theme === "light" ? "light" : "dark";
  };

  const currentTheme = getCurrentTheme();

  return { currentTheme, setTheme };
};
