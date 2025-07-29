import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import {
  applyThemeWithTransition,
  applyThemeModeChange,
  ThemeData as AppThemeData,
} from "@/lib/theme-applier";
import { extractTweakcnThemeData } from "@/utils/tweakcn-presets";
import { extractRaysoThemeData } from "@/utils/rayso-presets";
import { extractTinteThemeData } from "@/utils/tinte-presets";

export function useTinteTheme() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const activeThemeRef = useRef<AppThemeData | null>(null);
  const lastThemeChangeRef = useRef<number>(0);
  const previousThemeStateRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = mounted && currentTheme === "dark";

  const handleThemeSelect = useCallback(
    (selectedTheme: AppThemeData) => {
      const now = Date.now();
      if (now - lastThemeChangeRef.current < 100) return;
      lastThemeChangeRef.current = now;

      activeThemeRef.current = selectedTheme;
      applyThemeWithTransition(selectedTheme, isDark ? "dark" : "light");
    },
    [isDark]
  );

  useEffect(() => {
    if (!mounted) return;

    const currentState = `${currentTheme}-${
      activeThemeRef.current?.id || "none"
    }`;
    if (currentState === previousThemeStateRef.current) return;
    previousThemeStateRef.current = currentState;

    const now = Date.now();
    if (now - lastThemeChangeRef.current < 50) return;

    if (activeThemeRef.current) {
      lastThemeChangeRef.current = now;
      applyThemeWithTransition(
        activeThemeRef.current,
        isDark ? "dark" : "light"
      );
    } else {
      applyThemeModeChange(isDark ? "dark" : "light");
    }
  }, [isDark, mounted, currentTheme]);

  const tweakcnThemes = useMemo(() => {
    return extractTweakcnThemeData(isDark).map((themeData, index) => ({
      ...themeData,
      description: `Beautiful ${themeData.name.toLowerCase()} theme with carefully crafted color combinations`,
      author: "tweakcn",
      downloads: 8000 + index * 500,
      likes: 400 + index * 50,
      views: 15000 + index * 2000,
      tags: [
        themeData.name.split(" ")[0].toLowerCase(),
        "modern",
        "preset",
        "community",
      ],
    }));
  }, [isDark]);

  const raysoThemes = useMemo(() => {
    return extractRaysoThemeData(isDark).map((themeData, index) => ({
      ...themeData,
      description: `Beautiful ${themeData.name.toLowerCase()} theme from ray.so with carefully crafted color combinations`,
      author: "ray.so",
      downloads: 6000 + index * 400,
      likes: 300 + index * 40,
      views: 12000 + index * 1500,
      tags: [themeData.name.toLowerCase(), "rayso", "modern", "community"],
    }));
  }, [isDark]);

  const tinteThemes = useMemo(() => {
    return extractTinteThemeData(isDark).map((themeData, index) => ({
      ...themeData,
      description: `Stunning ${themeData.name.toLowerCase()} theme created by tinte with modern design principles`,
      author: "tinte",
      downloads: 5000 + index * 350,
      likes: 250 + index * 35,
      views: 10000 + index * 1200,
      tags: [
        themeData.name.toLowerCase().split(" ")[0],
        "tinte",
        "premium",
        "design",
      ],
    }));
  }, [isDark]);

  const allThemes = useMemo(
    () => [...tinteThemes, ...raysoThemes, ...tweakcnThemes],
    [tinteThemes, raysoThemes, tweakcnThemes]
  );

  return {
    mounted,
    isDark,
    currentTheme,
    activeThemeRef,
    handleThemeSelect,
    tweakcnThemes,
    raysoThemes,
    tinteThemes,
    allThemes,
  };
}
