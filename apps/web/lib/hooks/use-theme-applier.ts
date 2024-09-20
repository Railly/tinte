import { useEffect } from "react";
import { useAtom } from "jotai";
import { themeAtom } from "@/lib/atoms";
import { useTheme } from "next-themes";

export function useThemeApplier() {
  const [shadcnTheme, setShadcnTheme] = useAtom(themeAtom);
  const { resolvedTheme } = useTheme();

  const isCurrentlyDark = resolvedTheme === "dark";

  const currentColorScheme = isCurrentlyDark
    ? shadcnTheme.dark
    : shadcnTheme.light;
  const currentChartTheme = isCurrentlyDark
    ? shadcnTheme.charts.dark
    : shadcnTheme.charts.light;

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

      //document.documentElement.style.setProperty("--space", shadcnTheme.space);
      //document.documentElement.style.setProperty(
      //  "--shadow",
      //  shadcnTheme.shadow,
      //);
      //document.documentElement.style.setProperty(
      //  "--font-heading",
      //  shadcnTheme.fonts.heading,
      //);
      //document.documentElement.style.setProperty(
      //  "--font-body",
      //  shadcnTheme.fonts.body,
      //);
      //document.documentElement.style.setProperty("--icons", shadcnTheme.icons);
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
  }, [shadcnTheme, currentColorScheme, currentChartTheme, isCurrentlyDark]);

  return {
    currentTheme: shadcnTheme,
    setCurrentTheme: setShadcnTheme,
    currentColorScheme,
    currentChartTheme,
    isCurrentlyDark,
  };
}
