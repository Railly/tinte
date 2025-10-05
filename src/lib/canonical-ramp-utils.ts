import type { TinteBlock } from "@/types/tinte";
import { generateTailwindPalette } from "./palette-generator";

const FLEXOKI_ANCHORS = {
  light: {
    bg: 50,
    bg2: 100,
    ui: 200,
    ui2: 300,
    ui3: 400,
    tx3: 600,
    tx2: 700,
    tx: 900,
  },
  dark: {
    bg: 950,
    bg2: 900,
    ui: 800,
    ui2: 700,
    ui3: 600,
    tx3: 400,
    tx2: 300,
    tx: 100,
  },
} as const;

function buildRamp(seed: string): string[] {
  return generateTailwindPalette(seed).map((s) => s.value);
}

const pick = (ramp: string[], step: number) => {
  const idx = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].indexOf(
    step,
  );
  return ramp[Math.max(0, idx)];
};

export function generateFullNeutralRamp(
  baseColor: string,
  mode: "light" | "dark",
): Partial<TinteBlock> {
  const ramp = buildRamp(baseColor);
  const A = FLEXOKI_ANCHORS[mode];

  return {
    bg: pick(ramp, A.bg),
    bg_2: pick(ramp, A.bg2),
    ui: pick(ramp, A.ui),
    ui_2: pick(ramp, A.ui2),
    ui_3: pick(ramp, A.ui3),
    tx_3: pick(ramp, A.tx3),
    tx_2: pick(ramp, A.tx2),
    tx: pick(ramp, A.tx),
  };
}

export function isNeutralGroup(groupLabel: string): boolean {
  return ["background", "interface", "text"].includes(groupLabel.toLowerCase());
}

export function getAllNeutralKeys(): (keyof TinteBlock)[] {
  return ["bg", "bg_2", "ui", "ui_2", "ui_3", "tx_3", "tx_2", "tx"];
}
