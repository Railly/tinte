import type { TinteBlock } from "@tinte/core";

export const DEFAULT_THEME: { light: TinteBlock; dark: TinteBlock } = {
  light: {
    bg: "#fafafa",
    bg_2: "#f0f0f0",
    ui: "#dddddd",
    ui_2: "#cccccc",
    ui_3: "#bbbbbb",
    tx: "#282c34",
    tx_2: "#5c6370",
    tx_3: "#9da5b4",
    pr: "#986801",
    sc: "#4078f2",
    ac_1: "#a626a4",
    ac_2: "#50a14f",
    ac_3: "#e45649",
  },
  dark: {
    bg: "#181818",
    bg_2: "#222222",
    ui: "#333333",
    ui_2: "#444444",
    ui_3: "#555555",
    tx: "#eeeeee",
    tx_2: "#aaaaaa",
    tx_3: "#666666",
    pr: "#e5c07b",
    sc: "#61afef",
    ac_1: "#c678dd",
    ac_2: "#98c379",
    ac_3: "#e06c75",
  },
};
