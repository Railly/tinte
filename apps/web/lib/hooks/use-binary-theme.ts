import { useTheme } from "next-themes";
import { useEffect } from "react";

const getSystemTheme = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

export const useBinaryTheme = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "system") {
      setTheme(getSystemTheme());
    }
  }, [theme]);

  const currentTheme = (theme || getSystemTheme()) as "light" | "dark";

  return { currentTheme, setTheme };
};
