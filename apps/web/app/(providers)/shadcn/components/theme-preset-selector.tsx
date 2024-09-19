import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Theme, ColorScheme, HSLAColor } from "@/lib/atoms";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { ShadcnThemes } from "@prisma/client";
import { RefreshCw } from "lucide-react";
import { getThemes } from "@/lib/actions/shadcn-theme-actions";
import { useDebounce } from "@/lib/hooks/use-debounce";

const createHSLAColor = (
  h: number,
  s: number,
  l: number,
  a: number = 1,
): HSLAColor => ({ h, s, l, a });

const convertToHSLA = (hslString: string): HSLAColor => {
  const trimmedString = hslString.trim();

  const parts = trimmedString
    .split(" ")
    .map((part) => parseFloat(part.replace("%", "")));

  const [h = 0, s = 0, l = 0] = parts;

  return createHSLAColor(h, s, l);
};
const createColorScheme = (colors: Partial<ColorScheme>): ColorScheme => ({
  background: createHSLAColor(0, 0, 100),
  foreground: createHSLAColor(240, 3, 10),
  card: createHSLAColor(0, 0, 100),
  "card-foreground": createHSLAColor(20, 14.3, 4.1),
  popover: createHSLAColor(0, 0, 100),
  "popover-foreground": createHSLAColor(20, 14.3, 4.1),
  primary: createHSLAColor(240, 3, 10),
  "primary-foreground": createHSLAColor(60, 9.1, 97.8),
  secondary: createHSLAColor(60, 4.8, 95.9),
  "secondary-foreground": createHSLAColor(24, 9.8, 10),
  muted: createHSLAColor(60, 4.8, 95.9),
  "muted-foreground": createHSLAColor(25, 5.3, 44.7),
  accent: createHSLAColor(60, 4.8, 95.9),
  "accent-foreground": createHSLAColor(24, 9.8, 10),
  destructive: createHSLAColor(0, 84.2, 60.2),
  "destructive-foreground": createHSLAColor(60, 9.1, 97.8),
  border: createHSLAColor(20, 5.9, 90),
  input: createHSLAColor(20, 5.9, 90),
  ring: createHSLAColor(20, 14.3, 4.1),
  ...colors,
});

const createChartColors = (
  colors: Partial<Theme["charts"]["light"]>,
): Theme["charts"]["light"] => ({
  chart1: createHSLAColor(12, 76, 61),
  chart2: createHSLAColor(173, 58, 39),
  chart3: createHSLAColor(197, 37, 24),
  chart4: createHSLAColor(43, 74, 66),
  chart5: createHSLAColor(27, 87, 67),
  ...colors,
});

const presets: Theme[] = [
  {
    id: "default-theme-preset",
    name: "default-theme",
    displayName: "Default Theme",
    light: createColorScheme({}),
    dark: createColorScheme({
      background: createHSLAColor(240, 3, 10),
      foreground: createHSLAColor(0, 0, 100),
      card: createHSLAColor(240, 3, 10),
      "card-foreground": createHSLAColor(0, 0, 100),
      popover: createHSLAColor(240, 3, 10),
      "popover-foreground": createHSLAColor(0, 0, 100),
      primary: createHSLAColor(0, 0, 100),
      "primary-foreground": createHSLAColor(240, 3, 10),
      secondary: createHSLAColor(240, 3, 20),
      "secondary-foreground": createHSLAColor(0, 0, 100),
      muted: createHSLAColor(240, 3, 20),
      "muted-foreground": createHSLAColor(240, 5, 64.9),
      accent: createHSLAColor(240, 3, 20),
      "accent-foreground": createHSLAColor(0, 0, 100),
      destructive: createHSLAColor(0, 62.8, 30.6),
      "destructive-foreground": createHSLAColor(0, 0, 100),
      border: createHSLAColor(240, 3, 20),
      input: createHSLAColor(240, 3, 20),
      ring: createHSLAColor(240, 4.9, 83.9),
    }),
    fonts: { heading: "inter", body: "inter" },
    radius: "0.5",
    space: "0.25",
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    charts: {
      light: createChartColors({}),
      dark: createChartColors({
        chart2: createHSLAColor(173, 58, 59),
        chart3: createHSLAColor(197, 37, 54),
      }),
    },
    icons: "@phosphor-icons/react",
  },
  {
    id: "midday-preset",
    name: "midday",
    displayName: "Midday",
    light: createColorScheme({
      background: createHSLAColor(0, 0, 100),
      foreground: createHSLAColor(0, 0, 7),
      card: createHSLAColor(45, 18, 96),
      "card-foreground": createHSLAColor(240, 10, 3.9),
      popover: createHSLAColor(45, 18, 96),
      "popover-foreground": createHSLAColor(240, 10, 3.9),
      primary: createHSLAColor(240, 5.9, 10),
      "primary-foreground": createHSLAColor(0, 0, 98),
      secondary: createHSLAColor(40, 11, 89),
      "secondary-foreground": createHSLAColor(240, 5.9, 10),
      muted: createHSLAColor(40, 11, 89),
      "muted-foreground": createHSLAColor(240, 3.8, 46.1),
      accent: createHSLAColor(40, 10, 94),
      "accent-foreground": createHSLAColor(240, 5.9, 10),
      destructive: createHSLAColor(0, 84.2, 60.2),
      "destructive-foreground": createHSLAColor(0, 0, 98),
      border: createHSLAColor(45, 5, 85),
      input: createHSLAColor(240, 5.9, 90),
      ring: createHSLAColor(240, 5.9, 10),
    }),
    dark: createColorScheme({
      background: createHSLAColor(0, 0, 7),
      foreground: createHSLAColor(0, 0, 98),
      card: createHSLAColor(0, 0, 7),
      "card-foreground": createHSLAColor(0, 0, 98),
      popover: createHSLAColor(0, 0, 7),
      "popover-foreground": createHSLAColor(0, 0, 98),
      primary: createHSLAColor(0, 0, 98),
      "primary-foreground": createHSLAColor(240, 5.9, 10),
      secondary: createHSLAColor(0, 0, 11),
      "secondary-foreground": createHSLAColor(0, 0, 98),
      muted: createHSLAColor(0, 0, 11),
      "muted-foreground": createHSLAColor(240, 5, 64.9),
      accent: createHSLAColor(0, 0, 11),
      "accent-foreground": createHSLAColor(0, 0, 98),
      destructive: createHSLAColor(359, 100, 61),
      "destructive-foreground": createHSLAColor(0, 0, 100),
      border: createHSLAColor(0, 0, 17),
      input: createHSLAColor(0, 0, 11),
      ring: createHSLAColor(240, 4.9, 83.9),
    }),
    fonts: { heading: "inter", body: "inter" },
    radius: "0",
    space: "0.25",
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    charts: {
      light: createChartColors({
        chart1: createHSLAColor(0, 0, 20), // Dark gray
        chart2: createHSLAColor(0, 0, 35), // Medium-dark gray
        chart3: createHSLAColor(0, 0, 50), // Medium gray
        chart4: createHSLAColor(0, 0, 65), // Medium-light gray
        chart5: createHSLAColor(0, 0, 80), // Light gray
      }),
      dark: createChartColors({
        chart1: createHSLAColor(0, 0, 80), // Light gray
        chart2: createHSLAColor(0, 0, 65), // Medium-light gray
        chart3: createHSLAColor(0, 0, 50), // Medium gray
        chart4: createHSLAColor(0, 0, 35), // Medium-dark gray
        chart5: createHSLAColor(0, 0, 20), // Dark gray
      }),
    },
    icons: "@phosphor-icons/react",
  },
  {
    id: "default-shadcn-preset",
    name: "default-shadcn",
    displayName: "Default Shadcn",
    light: {
      background: convertToHSLA("0 0% 100%"),
      foreground: convertToHSLA("240 10% 3.9%"),
      card: convertToHSLA("0 0% 100%"),
      "card-foreground": convertToHSLA("240 10% 3.9%"),
      popover: convertToHSLA("0 0% 100%"),
      "popover-foreground": convertToHSLA("240 10% 3.9%"),
      primary: convertToHSLA("240 5.9% 10%"),
      "primary-foreground": convertToHSLA("0 0% 98%"),
      secondary: convertToHSLA("240 4.8% 95.9%"),
      "secondary-foreground": convertToHSLA("240 5.9% 10%"),
      muted: convertToHSLA("240 4.8% 95.9%"),
      "muted-foreground": convertToHSLA("240 3.8% 46.1%"),
      accent: convertToHSLA("240 4.8% 95.9%"),
      "accent-foreground": convertToHSLA("240 5.9% 10%"),
      destructive: convertToHSLA("0 84.2% 60.2%"),
      "destructive-foreground": convertToHSLA("0 0% 98%"),
      border: convertToHSLA("240 5.9% 90%"),
      input: convertToHSLA("240 5.9% 90%"),
      ring: convertToHSLA("240 10% 3.9%"),
    },
    dark: {
      background: convertToHSLA("240 10% 3.9%"),
      foreground: convertToHSLA("0 0% 98%"),
      card: convertToHSLA("240 10% 3.9%"),
      "card-foreground": convertToHSLA("0 0% 98%"),
      popover: convertToHSLA("240 10% 3.9%"),
      "popover-foreground": convertToHSLA("0 0% 98%"),
      primary: convertToHSLA("0 0% 98%"),
      "primary-foreground": convertToHSLA("240 5.9% 10%"),
      secondary: convertToHSLA("240 3.7% 15.9%"),
      "secondary-foreground": convertToHSLA("0 0% 98%"),
      muted: convertToHSLA("240 3.7% 15.9%"),
      "muted-foreground": convertToHSLA("240 5% 64.9%"),
      accent: convertToHSLA("240 3.7% 15.9%"),
      "accent-foreground": convertToHSLA("0 0% 98%"),
      destructive: convertToHSLA("0 62.8% 30.6%"),
      "destructive-foreground": convertToHSLA("0 0% 98%"),
      border: convertToHSLA("240 3.7% 15.9%"),
      input: convertToHSLA("240 3.7% 15.9%"),
      ring: convertToHSLA("240 4.9% 83.9%"),
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    radius: "0.5r",
    space: "1",
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    charts: {
      light: {
        chart1: convertToHSLA("173 58% 39%"),
        chart2: convertToHSLA("12 76% 61%"),
        chart3: convertToHSLA("197 37% 24%"),
        chart4: convertToHSLA("43 74% 66%"),
        chart5: convertToHSLA("27 87% 67%"),
      },
      dark: {
        chart1: convertToHSLA("220 70% 50%"),
        chart2: convertToHSLA("160 60% 45%"),
        chart3: convertToHSLA("30 80% 55%"),
        chart4: convertToHSLA("280 65% 60%"),
        chart5: convertToHSLA("340 75% 55%"),
      },
    },
    icons: "lucide",
  },
  {
    id: "default-sapphire-preset",
    name: "default-sapphire",
    displayName: "Sapphire",
    light: {
      background: convertToHSLA("0 0% 100%"),
      foreground: convertToHSLA("222.2 84% 4.9%"),
      card: convertToHSLA("0 0% 100%"),
      "card-foreground": convertToHSLA("222.2 84% 4.9%"),
      popover: convertToHSLA("0 0% 100%"),
      "popover-foreground": convertToHSLA("222.2 84% 4.9%"),
      primary: convertToHSLA("221.2 83.2% 53.3%"),
      "primary-foreground": convertToHSLA("210 40% 98%"),
      secondary: convertToHSLA("210 40% 96.1%"),
      "secondary-foreground": convertToHSLA("222.2 47.4% 11.2%"),
      muted: convertToHSLA("210 40% 96.1%"),
      "muted-foreground": convertToHSLA("215.4 16.3% 46.9%"),
      accent: convertToHSLA("210 40% 96.1%"),
      "accent-foreground": convertToHSLA("222.2 47.4% 11.2%"),
      destructive: convertToHSLA("0 84.2% 60.2%"),
      "destructive-foreground": convertToHSLA("210 40% 98%"),
      border: convertToHSLA("214.3 31.8% 91.4%"),
      input: convertToHSLA("214.3 31.8% 91.4%"),
      ring: convertToHSLA("221.2 83.2% 53.3%"),
    },
    dark: {
      background: convertToHSLA("222.2 84% 4.9%"),
      foreground: convertToHSLA("210 40% 98%"),
      card: convertToHSLA("222.2 84% 4.9%"),
      "card-foreground": convertToHSLA("210 40% 98%"),
      popover: convertToHSLA("222.2 84% 4.9%"),
      "popover-foreground": convertToHSLA("210 40% 98%"),
      primary: convertToHSLA("217.2 91.2% 59.8%"),
      "primary-foreground": convertToHSLA("222.2 47.4% 11.2%"),
      secondary: convertToHSLA("217.2 32.6% 17.5%"),
      "secondary-foreground": convertToHSLA("210 40% 98%"),
      muted: convertToHSLA("217.2 32.6% 17.5%"),
      "muted-foreground": convertToHSLA("215 20.2% 65.1%"),
      accent: convertToHSLA("217.2 32.6% 17.5%"),
      "accent-foreground": convertToHSLA("210 40% 98%"),
      destructive: convertToHSLA("0 62.8% 30.6%"),
      "destructive-foreground": convertToHSLA("210 40% 98%"),
      border: convertToHSLA("217.2 32.6% 17.5%"),
      input: convertToHSLA("217.2 32.6% 17.5%"),
      ring: convertToHSLA("224.3 76.3% 48%"),
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    radius: "0.5",
    space: "1",
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    charts: {
      light: {
        chart1: convertToHSLA("221.2 83.2% 53.3%"),
        chart2: convertToHSLA("212 95% 68%"),
        chart3: convertToHSLA("216 92% 60%"),
        chart4: convertToHSLA("210 98% 78%"),
        chart5: convertToHSLA("212 97% 87%"),
      },
      dark: {
        chart1: convertToHSLA("221.2 83.2% 53.3%"),
        chart2: convertToHSLA("212 95% 68%"),
        chart3: convertToHSLA("216 92% 60%"),
        chart4: convertToHSLA("210 98% 78%"),
        chart5: convertToHSLA("212 97% 87%"),
      },
    },
    icons: "lucide",
  },
  {
    id: "default-ruby-preset",
    name: "default-ruby",
    displayName: "Ruby",
    light: {
      background: convertToHSLA("0 0% 100%"),
      foreground: convertToHSLA("240 10% 3.9%"),
      card: convertToHSLA("0 0% 100%"),
      "card-foreground": convertToHSLA("240 10% 3.9%"),
      popover: convertToHSLA("0 0% 100%"),
      "popover-foreground": convertToHSLA("240 10% 3.9%"),
      primary: convertToHSLA("346.8 77.2% 49.8%"),
      "primary-foreground": convertToHSLA("355.7 100% 97.3%"),
      secondary: convertToHSLA("240 4.8% 95.9%"),
      "secondary-foreground": convertToHSLA("240 5.9% 10%"),
      muted: convertToHSLA("240 4.8% 95.9%"),
      "muted-foreground": convertToHSLA("240 3.8% 46.1%"),
      accent: convertToHSLA("240 4.8% 95.9%"),
      "accent-foreground": convertToHSLA("240 5.9% 10%"),
      destructive: convertToHSLA("0 84.2% 60.2%"),
      "destructive-foreground": convertToHSLA("0 0% 98%"),
      border: convertToHSLA("240 5.9% 90%"),
      input: convertToHSLA("240 5.9% 90%"),
      ring: convertToHSLA("346.8 77.2% 49.8%"),
    },
    dark: {
      background: convertToHSLA("20 14.3% 4.1%"),
      foreground: convertToHSLA("0 0% 95%"),
      card: convertToHSLA("24 9.8% 10%"),
      "card-foreground": convertToHSLA("0 0% 95%"),
      popover: convertToHSLA("0 0% 9%"),
      "popover-foreground": convertToHSLA("0 0% 95%"),
      primary: convertToHSLA("346.8 77.2% 49.8%"),
      "primary-foreground": convertToHSLA("355.7 100% 97.3%"),
      secondary: convertToHSLA("240 3.7% 15.9%"),
      "secondary-foreground": convertToHSLA("0 0% 98%"),
      muted: convertToHSLA("0 0% 15%"),
      "muted-foreground": convertToHSLA("240 5% 64.9%"),
      accent: convertToHSLA("12 6.5% 15.1%"),
      "accent-foreground": convertToHSLA("0 0% 98%"),
      destructive: convertToHSLA("0 62.8% 30.6%"),
      "destructive-foreground": convertToHSLA("0 85.7% 97.3%"),
      border: convertToHSLA("240 3.7% 15.9%"),
      input: convertToHSLA("240 3.7% 15.9%"),
      ring: convertToHSLA("346.8 77.2% 49.8%"),
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    radius: "0.5",
    space: "1",
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    charts: {
      light: {
        chart1: convertToHSLA("347 77% 50%"),
        chart2: convertToHSLA("352 83% 91%"),
        chart3: convertToHSLA("350 80% 72%"),
        chart4: convertToHSLA("351 83% 82%"),
        chart5: convertToHSLA("349 77% 62%"),
      },
      dark: {
        chart1: convertToHSLA("347 77% 50%"),
        chart2: convertToHSLA("349 77% 62%"),
        chart3: convertToHSLA("350 80% 72%"),
        chart4: convertToHSLA("351 83% 82%"),
        chart5: convertToHSLA("352 83% 91%"),
      },
    },
    icons: "lucide",
  },
  {
    id: "default-emerald-preset",
    name: "default-emerald",
    displayName: "Emerald",
    light: {
      background: convertToHSLA("0 0% 100%"),
      foreground: convertToHSLA("240 10% 3.9%"),
      card: convertToHSLA("0 0% 100%"),
      "card-foreground": convertToHSLA("240 10% 3.9%"),
      popover: convertToHSLA("0 0% 100%"),
      "popover-foreground": convertToHSLA("240 10% 3.9%"),
      primary: convertToHSLA("142 86% 28%"),
      "primary-foreground": convertToHSLA("356 29% 98%"),
      secondary: convertToHSLA("240 4.8% 95.9%"),
      "secondary-foreground": convertToHSLA("240 5.9% 10%"),
      muted: convertToHSLA("240 4.8% 95.9%"),
      "muted-foreground": convertToHSLA("240 3.8% 46.1%"),
      accent: convertToHSLA("240 4.8% 95.9%"),
      "accent-foreground": convertToHSLA("240 5.9% 10%"),
      destructive: convertToHSLA("0 84.2% 60.2%"),
      "destructive-foreground": convertToHSLA("0 0% 98%"),
      border: convertToHSLA("240 5.9% 90%"),
      input: convertToHSLA("240 5.9% 90%"),
      ring: convertToHSLA("142 86% 28%"),
    },
    dark: {
      background: convertToHSLA("240 10% 3.9%"),
      foreground: convertToHSLA("0 0% 98%"),
      card: convertToHSLA("240 10% 3.9%"),
      "card-foreground": convertToHSLA("0 0% 98%"),
      popover: convertToHSLA("240 10% 3.9%"),
      "popover-foreground": convertToHSLA("0 0% 98%"),
      primary: convertToHSLA("142 86% 28%"),
      "primary-foreground": convertToHSLA("356 29% 98%"),
      secondary: convertToHSLA("240 3.7% 15.9%"),
      "secondary-foreground": convertToHSLA("0 0% 98%"),
      muted: convertToHSLA("240 3.7% 15.9%"),
      "muted-foreground": convertToHSLA("240 5% 64.9%"),
      accent: convertToHSLA("240 3.7% 15.9%"),
      "accent-foreground": convertToHSLA("0 0% 98%"),
      destructive: convertToHSLA("0 62.8% 30.6%"),
      "destructive-foreground": convertToHSLA("0 0% 98%"),
      border: convertToHSLA("240 3.7% 15.9%"),
      input: convertToHSLA("240 3.7% 15.9%"),
      ring: convertToHSLA("142 86% 28%"),
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    radius: "0.5",
    space: "1",
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    charts: {
      light: {
        chart1: convertToHSLA("139 65% 20%"),
        chart2: convertToHSLA("140 74% 44%"),
        chart3: convertToHSLA("142 88% 28%"),
        chart4: convertToHSLA("137 55% 15%"),
        chart5: convertToHSLA("141 40% 9%"),
      },
      dark: {
        chart1: convertToHSLA("142 88% 28%"),
        chart2: convertToHSLA("139 65% 20%"),
        chart3: convertToHSLA("140 74% 24%"),
        chart4: convertToHSLA("137 55% 15%"),
        chart5: convertToHSLA("141 40% 9%"),
      },
    },
    icons: "lucide",
  },
  {
    id: "default-daylight-preset",
    name: "default-daylight",
    displayName: "Daylight",
    light: {
      background: convertToHSLA("36 39% 88%"),
      foreground: convertToHSLA("36 45% 15%"),
      card: convertToHSLA("36 46% 82%"),
      "card-foreground": convertToHSLA("36 45% 20%"),
      popover: convertToHSLA("0 0% 100%"),
      "popover-foreground": convertToHSLA("240 10% 3.9%"),
      primary: convertToHSLA("36 45% 70%"),
      "primary-foreground": convertToHSLA("36 45% 11%"),
      secondary: convertToHSLA("40 35% 77%"),
      "secondary-foreground": convertToHSLA("36 45% 25%"),
      muted: convertToHSLA("36 33% 75%"),
      "muted-foreground": convertToHSLA("36 45% 25%"),
      accent: convertToHSLA("36 64% 57%"),
      "accent-foreground": convertToHSLA("36 72% 17%"),
      destructive: convertToHSLA("0 84% 37%"),
      "destructive-foreground": convertToHSLA("0 0% 98%"),
      border: convertToHSLA("36 45% 60%"),
      input: convertToHSLA("36 45% 60%"),
      ring: convertToHSLA("36 45% 30%"),
    },
    dark: {
      background: convertToHSLA("36 39% 88%"),
      foreground: convertToHSLA("36 45% 15%"),
      card: convertToHSLA("36 46% 82%"),
      "card-foreground": convertToHSLA("36 45% 20%"),
      popover: convertToHSLA("0 0% 100%"),
      "popover-foreground": convertToHSLA("240 10% 3.9%"),
      primary: convertToHSLA("36 45% 70%"),
      "primary-foreground": convertToHSLA("36 45% 11%"),
      secondary: convertToHSLA("40 35% 77%"),
      "secondary-foreground": convertToHSLA("36 45% 25%"),
      muted: convertToHSLA("36 33% 75%"),
      "muted-foreground": convertToHSLA("36 45% 25%"),
      accent: convertToHSLA("36 64% 57%"),
      "accent-foreground": convertToHSLA("36 72% 17%"),
      destructive: convertToHSLA("0 84% 37%"),
      "destructive-foreground": convertToHSLA("0 0% 98%"),
      border: convertToHSLA("36 45% 60%"),
      input: convertToHSLA("36 45% 60%"),
      ring: convertToHSLA("36 45% 30%"),
    },
    fonts: {
      heading: "DM Sans",
      body: "Space Mono",
    },
    radius: "0.5",
    space: "1",
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    charts: {
      light: {
        chart1: convertToHSLA("25 34% 28%"),
        chart2: convertToHSLA("26 36% 34%"),
        chart3: convertToHSLA("28 40% 40%"),
        chart4: convertToHSLA("31 41% 48%"),
        chart5: convertToHSLA("35 43% 53%"),
      },
      dark: {
        chart1: convertToHSLA("25 34% 28%"),
        chart2: convertToHSLA("26 36% 34%"),
        chart3: convertToHSLA("28 40% 40%"),
        chart4: convertToHSLA("31 41% 48%"),
        chart5: convertToHSLA("35 43% 53%"),
      },
    },
    icons: "lucide",
  },
  {
    id: "default-midnight-preset",
    name: "default-midnight",
    displayName: "Midnight",
    light: {
      background: convertToHSLA("240 5% 6%"),
      foreground: convertToHSLA("60 5% 90%"),
      card: convertToHSLA("240 4% 10%"),
      "card-foreground": convertToHSLA("60 5% 90%"),
      popover: convertToHSLA("240 5% 15%"),
      "popover-foreground": convertToHSLA("60 5% 85%"),
      primary: convertToHSLA("240 0% 90%"),
      "primary-foreground": convertToHSLA("60 0% 0%"),
      secondary: convertToHSLA("240 4% 15%"),
      "secondary-foreground": convertToHSLA("60 5% 85%"),
      muted: convertToHSLA("240 5% 25%"),
      "muted-foreground": convertToHSLA("60 5% 85%"),
      accent: convertToHSLA("240 0% 13%"),
      "accent-foreground": convertToHSLA("60 0% 100%"),
      destructive: convertToHSLA("0 60% 50%"),
      "destructive-foreground": convertToHSLA("0 0% 98%"),
      border: convertToHSLA("240 6% 20%"),
      input: convertToHSLA("240 6% 20%"),
      ring: convertToHSLA("240 5% 90%"),
    },
    dark: {
      background: convertToHSLA("240 5% 6%"),
      foreground: convertToHSLA("60 5% 90%"),
      card: convertToHSLA("240 4% 10%"),
      "card-foreground": convertToHSLA("60 5% 90%"),
      popover: convertToHSLA("240 5% 15%"),
      "popover-foreground": convertToHSLA("60 5% 85%"),
      primary: convertToHSLA("240 0% 90%"),
      "primary-foreground": convertToHSLA("60 0% 0%"),
      secondary: convertToHSLA("240 4% 15%"),
      "secondary-foreground": convertToHSLA("60 5% 85%"),
      muted: convertToHSLA("240 5% 25%"),
      "muted-foreground": convertToHSLA("60 5% 85%"),
      accent: convertToHSLA("240 0% 13%"),
      "accent-foreground": convertToHSLA("60 0% 100%"),
      destructive: convertToHSLA("0 60% 50%"),
      "destructive-foreground": convertToHSLA("0 0% 98%"),
      border: convertToHSLA("240 6% 20%"),
      input: convertToHSLA("240 6% 20%"),
      ring: convertToHSLA("240 5% 90%"),
    },
    fonts: {
      heading: "Manrope",
      body: "Manrope",
    },
    radius: "0.5",
    space: "1",
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    charts: {
      light: {
        chart1: convertToHSLA("359 2% 90%"),
        chart2: convertToHSLA("240 1% 74%"),
        chart3: convertToHSLA("240 1% 58%"),
        chart4: convertToHSLA("240 1% 42%"),
        chart5: convertToHSLA("240 2% 26%"),
      },
      dark: {
        chart1: convertToHSLA("359 2% 90%"),
        chart2: convertToHSLA("240 1% 74%"),
        chart3: convertToHSLA("240 1% 58%"),
        chart4: convertToHSLA("240 1% 42%"),
        chart5: convertToHSLA("240 2% 26%"),
      },
    },
    icons: "lucide",
  },
];

interface ThemePresetSelectorProps {
  onSelectPreset: (preset: Theme) => void;
  currentTheme: Theme;
  allThemes: ShadcnThemes[];
}

export function ThemePresetSelector({
  onSelectPreset,
  currentTheme,
  allThemes,
}: ThemePresetSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState(presets[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { resolvedTheme } = useTheme();
  const [themes, setThemes] = useState<ShadcnThemes[]>(allThemes);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchThemes = useCallback(async (search: string, pageNum: number) => {
    setIsLoading(true);
    try {
      const { themes: newThemes, pagination } = await getThemes(
        pageNum,
        12,
        search,
      );
      if (pageNum === 1) {
        setThemes(newThemes);
      } else {
        setThemes((prevThemes) => [...prevThemes, ...newThemes]);
      }
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching themes:", error);
      toast.error("Failed to fetch themes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchThemes = useDebounce(
    (search: string) => fetchThemes(search, 1),
    400,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setPage(1);
    debouncedFetchThemes(newSearchTerm);
  };

  const loadMore = () => fetchThemes(searchTerm, page + 1);

  useEffect(() => {
    setThemes(allThemes);
  }, [allThemes]);

  useEffect(() => {
    const matchingPreset = presets.find(
      (preset) => preset.name === currentTheme.name,
    );
    if (matchingPreset) {
      setSelectedPreset(matchingPreset);
    }
  }, [currentTheme]);

  const handleSelectPreset = (preset: Theme) => {
    setSelectedPreset(preset);
    onSelectPreset(preset);
    setIsOpen(false);
  };

  const convertShadcnThemeToTheme = (shadcnTheme: ShadcnThemes): Theme => {
    const parseIfString = (value: any) =>
      typeof value === "string" ? JSON.parse(value) : value;

    return {
      id: shadcnTheme.xata_id,
      name: shadcnTheme.name,
      displayName: shadcnTheme.display_name as string,
      light: parseIfString(shadcnTheme.light_scheme),
      dark: parseIfString(shadcnTheme.dark_scheme),
      fonts: parseIfString(shadcnTheme.fonts),
      radius: shadcnTheme.radius as string,
      space: shadcnTheme.space as string,
      shadow: shadcnTheme.shadow as string,
      charts: parseIfString(shadcnTheme.charts),
      icons: shadcnTheme.icons as string,
    };
  };

  const handleSelectTheme = async (shadcnTheme: ShadcnThemes) => {
    try {
      const theme = convertShadcnThemeToTheme(shadcnTheme);
      onSelectPreset(theme);
      setSelectedPreset(theme);
    } catch (error) {
      console.error("Error selecting theme:", error);
      toast.error("Failed to select theme");
    }
  };

  const filteredPresets = presets.filter((preset) =>
    preset.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderColorSwatches = (colors: ColorScheme) => (
    <div className="flex">
      {["background", "foreground", "primary", "secondary", "accent"].map(
        (key) => (
          <div
            key={key}
            className="w-4 h-4 border-t border-b border-r first:border-l first:rounded-l-sm last:rounded-r-sm"
            style={{
              backgroundColor: `hsl(${colors[key as keyof ColorScheme].h}deg ${colors[key as keyof ColorScheme].s}% ${colors[key as keyof ColorScheme].l}%)`,
            }}
          />
        ),
      )}
    </div>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center space-x-2">
            {renderColorSwatches(
              resolvedTheme === "dark" ? currentTheme.dark : currentTheme.light,
            )}
            <span>{currentTheme?.displayName}</span>
          </div>
          <span className="sr-only">Toggle theme preset menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="p-2" onKeyDown={(e) => e.stopPropagation()}>
          <Input
            type="text"
            placeholder="Search themes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-2"
          />
        </div>
        {filteredPresets.map((preset) => (
          <DropdownMenuItem
            key={preset.name}
            onClick={() => handleSelectPreset(preset)}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center border">
                {selectedPreset?.id === preset.id && (
                  <Check className="w-3 h-3 text-primary" />
                )}
              </div>
              <span>{preset.displayName}</span>
            </div>
            {renderColorSwatches(
              resolvedTheme === "dark" ? preset.dark : preset.light,
            )}
          </DropdownMenuItem>
        ))}
        {themes.map((theme) => {
          const colorScheme =
            resolvedTheme === "dark" ? theme.dark_scheme : theme.light_scheme;
          return (
            <DropdownMenuItem
              key={theme.xata_id}
              onClick={() => handleSelectTheme(theme)}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center border">
                  {selectedPreset?.id === theme.xata_id && (
                    <Check className="w-3 h-3 text-primary" />
                  )}
                </div>
                <span>{theme.display_name}</span>
              </div>
              {renderColorSwatches(colorScheme as ColorScheme)}
            </DropdownMenuItem>
          );
        })}
        {!isLoading && themes.length > 0 && themes.length % 3 === 0 && (
          <DropdownMenuItem
            className="justify-center font-semibold"
            onSelect={loadMore}
          >
            <RefreshCw className="size-4 mr-2" />
            Load more
          </DropdownMenuItem>
        )}
        {isLoading && <DropdownMenuItem disabled>Loading...</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
