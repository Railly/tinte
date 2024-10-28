import { Users } from "@prisma/client";
import { atom } from "jotai";

export type HSLAColor = { h: number; s: number; l: number; a: number };

export type ColorScheme = {
  background: HSLAColor;
  foreground: HSLAColor;
  card: HSLAColor;
  "card-foreground": HSLAColor;
  popover: HSLAColor;
  "popover-foreground": HSLAColor;
  primary: HSLAColor;
  "primary-foreground": HSLAColor;
  secondary: HSLAColor;
  "secondary-foreground": HSLAColor;
  muted: HSLAColor;
  "muted-foreground": HSLAColor;
  accent: HSLAColor;
  "accent-foreground": HSLAColor;
  destructive: HSLAColor;
  "destructive-foreground": HSLAColor;
  border: HSLAColor;
  input: HSLAColor;
  ring: HSLAColor;
};

export type ChartColors = {
  "chart-1": HSLAColor;
  "chart-2": HSLAColor;
  "chart-3": HSLAColor;
  "chart-4": HSLAColor;
  "chart-5": HSLAColor;
};

export type Theme = {
  id: string;
  name: string;
  displayName: string;
  light: ColorScheme;
  dark: ColorScheme;
  //fonts: {
  //  heading: string;
  //  body: string;
  //};
  radius: string;
  //space: string;
  //shadow: string;
  charts: {
    light: ChartColors;
    dark: ChartColors;
  };
  user?: string | null;
  //icons: string;
};

export const themeAtom = atom<Theme>({
  id: "crm9hfdqrj62j62r2klg",
  name: "default-theme",
  displayName: "Default Theme",
  light: {
    background: { h: 0, s: 0, l: 100, a: 1 },
    foreground: { h: 240, s: 3, l: 10, a: 1 },
    card: { h: 0, s: 0, l: 100, a: 1 },
    "card-foreground": { h: 20, s: 14.3, l: 4.1, a: 1 },
    popover: { h: 0, s: 0, l: 100, a: 1 },
    "popover-foreground": { h: 20, s: 14.3, l: 4.1, a: 1 },
    primary: { h: 240, s: 3, l: 10, a: 1 },
    "primary-foreground": { h: 60, s: 9.1, l: 97.8, a: 1 },
    secondary: { h: 60, s: 4.8, l: 95.9, a: 1 },
    "secondary-foreground": { h: 24, s: 9.8, l: 10, a: 1 },
    muted: { h: 60, s: 4.8, l: 95.9, a: 1 },
    "muted-foreground": { h: 25, s: 5.3, l: 44.7, a: 1 },
    accent: { h: 60, s: 4.8, l: 95.9, a: 1 },
    "accent-foreground": { h: 24, s: 9.8, l: 10, a: 1 },
    destructive: { h: 0, s: 84.2, l: 60.2, a: 1 },
    "destructive-foreground": { h: 60, s: 9.1, l: 97.8, a: 1 },
    border: { h: 20, s: 5.9, l: 90, a: 1 },
    input: { h: 20, s: 5.9, l: 90, a: 1 },
    ring: { h: 20, s: 14.3, l: 4.1, a: 1 },
  },
  dark: {
    background: { h: 240, s: 3, l: 10, a: 1 },
    foreground: { h: 0, s: 0, l: 100, a: 1 },
    card: { h: 240, s: 3, l: 10, a: 1 },
    "card-foreground": { h: 0, s: 0, l: 100, a: 1 },
    popover: { h: 240, s: 3, l: 10, a: 1 },
    "popover-foreground": { h: 0, s: 0, l: 100, a: 1 },
    primary: { h: 0, s: 0, l: 100, a: 1 },
    "primary-foreground": { h: 240, s: 3, l: 10, a: 1 },
    secondary: { h: 240, s: 3, l: 20, a: 1 },
    "secondary-foreground": { h: 0, s: 0, l: 100, a: 1 },
    muted: { h: 240, s: 3, l: 20, a: 1 },
    "muted-foreground": { h: 240, s: 5, l: 64.9, a: 1 },
    accent: { h: 240, s: 3, l: 20, a: 1 },
    "accent-foreground": { h: 0, s: 0, l: 100, a: 1 },
    destructive: { h: 0, s: 62.8, l: 30.6, a: 1 },
    "destructive-foreground": { h: 0, s: 0, l: 100, a: 1 },
    border: { h: 240, s: 3, l: 20, a: 1 },
    input: { h: 240, s: 3, l: 20, a: 1 },
    ring: { h: 240, s: 4.9, l: 83.9, a: 1 },
  },
  //fonts: {
  //  heading: "inter",
  //  body: "inter",
  //},
  radius: "0.5",
  //space: "0.25",
  //shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  charts: {
    light: {
      "chart-1": { h: 12, s: 76, l: 61, a: 1 },
      "chart-2": { h: 173, s: 58, l: 39, a: 1 },
      "chart-3": { h: 197, s: 37, l: 24, a: 1 },
      "chart-4": { h: 43, s: 74, l: 66, a: 1 },
      "chart-5": { h: 27, s: 87, l: 67, a: 1 },
    },
    dark: {
      "chart-1": { h: 12, s: 76, l: 61, a: 1 },
      "chart-2": { h: 173, s: 58, l: 59, a: 1 },
      "chart-3": { h: 197, s: 37, l: 54, a: 1 },
      "chart-4": { h: 43, s: 74, l: 66, a: 1 },
      "chart-5": { h: 27, s: 87, l: 67, a: 1 },
    },
  },
  //icons: "@phosphor-icons/react",
});

export const activeTabAtom = atom<"code" | "preview">("preview");
