import { z } from "zod";

const TinteBlockSchema = z.object({
  bg: z.string().describe("Main background"),
  bg_2: z.string().describe("Secondary background"),
  ui: z.string().describe("Borders"),
  ui_2: z.string().describe("Hovered borders"),
  ui_3: z.string().describe("Active borders"),
  tx_3: z.string().describe("Faint text, comments"),
  tx_2: z.string().describe("Muted text, punctuation, operators"),
  tx: z.string().describe("Primary text"),
  pr: z.string().describe("Primary color"),
  sc: z.string().describe("Secondary color"),
  ac_1: z.string().describe("Accent 1"),
  ac_2: z.string().describe("Accent 2"),
  ac_3: z.string().describe("Accent 3"),
});

export type TinteBlock = z.infer<typeof TinteBlockSchema>;

export type TinteTheme = {
  light: TinteBlock;
  dark: TinteBlock;
};
