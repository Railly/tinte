import { useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { themeAtom } from "@/lib/atoms";
import { useTheme } from "next-themes";

export function useThemeApplier() {
  const [shadcnTheme, setShadcnTheme] = useAtom(themeAtom);
  const { resolvedTheme } = useTheme();

  const isCurrentlyDark = resolvedTheme === "dark";

  const currentColorScheme = useMemo(
    () => (isCurrentlyDark ? shadcnTheme.dark : shadcnTheme.light),
    [isCurrentlyDark, shadcnTheme.dark, shadcnTheme.light],
  );

  const currentChartTheme = useMemo(
    () =>
      isCurrentlyDark ? shadcnTheme.charts.dark : shadcnTheme.charts.light,
    [isCurrentlyDark, shadcnTheme.charts.dark, shadcnTheme.charts.light],
  );

  useEffect(() => {
    const applyTheme = () => {
      // Apply theme colors
      Object.entries(currentColorScheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(
          `--${key}`,
          `${value.h} ${value.s}% ${value.l}%`,
        );
      });

      // Apply chart colors
      Object.entries(currentChartTheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(
          `--${key}`,
          `${value.h} ${value.s}% ${value.l}%`,
        );
      });

      // Apply other theme properties
      document.documentElement.style.setProperty(
        "--radius",
        `${shadcnTheme?.radius}rem`,
      );
    };

    applyTheme();

    // Set up a MutationObserver to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          applyTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [shadcnTheme, isCurrentlyDark]); // Only depend on shadcnTheme and isCurrentlyDark

  return {
    currentTheme: shadcnTheme,
    setCurrentTheme: setShadcnTheme,
    currentColorScheme,
    currentChartTheme,
    isCurrentlyDark,
  };
}
