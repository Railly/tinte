import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const getSystemTheme = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

export const useBinaryTheme = (initialTheme: Theme = "system") => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(initialTheme);

  useEffect(() => {
    // This effect runs only on the client-side
    if (theme === "system") {
      setTheme(getSystemTheme());
    }
  }, [theme]);

  const currentTheme = theme === "system" ? getSystemTheme() : theme;

  return { currentTheme, setTheme };
};
