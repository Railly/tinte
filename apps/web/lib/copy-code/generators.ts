import { Theme } from "../atoms";

export const generateCSSCode = (theme: Theme) => {
  const generateColorVars = (colorScheme: Theme["light"] | Theme["dark"]) =>
    Object.entries(colorScheme)
      .map(([key, value]) => `--${key}: ${value.h} ${value.s}% ${value.l}%;`)
      .join("\n  ");

  const generateChartVars = (
    chartColors: Theme["charts"]["light"] | Theme["charts"]["dark"],
  ) =>
    Object.entries(chartColors)
      .map(([key, value]) => `--${key}: ${value.h} ${value.s}% ${value.l}%;`)
      .join("\n  ");

  const lightVars = generateColorVars(theme.light);
  const darkVars = generateColorVars(theme.dark);
  const lightChartVars = generateChartVars(theme.charts.light);
  const darkChartVars = generateChartVars(theme.charts.dark);

  return `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
  ${lightVars}
  ${lightChartVars}

    --radius: ${theme.radius}rem;
    --space: ${theme.space}rem;
    --shadow: ${theme.shadow};
  }

  .dark {
  ${darkVars}
  ${darkChartVars}
  }
}
`;
};

export const generateTailwindConfig = (theme: Theme) => {
  const generateColors = (colorScheme: Theme["light"] | Theme["dark"]) =>
    Object.entries(colorScheme).reduce(
      (acc, [key]) => {
        if (
          [
            "primary",
            "secondary",
            "destructive",
            "muted",
            "accent",
            "popover",
            "card",
          ].includes(key)
        ) {
          acc[key] = {
            DEFAULT: `hsl(var(--${key}))`,
            foreground: `hsl(var(--${key}-foreground))`,
          };
        } else {
          acc[key] = `hsl(var(--${key}))`;
        }
        return acc;
      },
      {} as Record<string, string | { DEFAULT: string; foreground: string }>,
    );

  const generateChartColors = (
    chartColors: Theme["charts"]["light"] | Theme["charts"]["dark"],
  ) =>
    Object.fromEntries(
      Object.keys(chartColors).map((key) => [key, `hsl(var(--${key}))`]),
    );

  const lightColors = generateColors(theme.light);
  const darkColors = generateColors(theme.dark);
  const lightChartColors = generateChartColors(theme.charts.light);
  const darkChartColors = generateChartColors(theme.charts.dark);

  return `
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      colors: ${JSON.stringify({ ...lightColors, ...lightChartColors }, null, 6)},
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bg-shine": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bg-shine": "bg-shine 2.1s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
`;
};

export const createCopyCodeFunction = (theme: Theme) => {
  return (format: "css" | "tailwind" | "json") => {
    let code = "";

    switch (format) {
      case "css":
        code = generateCSSCode(theme);
        break;
      case "tailwind":
        code = generateTailwindConfig(theme);
        break;
      case "json":
        code = JSON.stringify(theme, null, 2);
        break;
    }

    navigator.clipboard.writeText(code).then(() => {
      console.log(`${format.toUpperCase()} code copied to clipboard`);
    });
  };
};
