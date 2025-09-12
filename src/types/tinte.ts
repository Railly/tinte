import { z } from "zod";

export const TinteBlockSchema = z.object({
  bg: z.string().describe("Main background color in hex format"),
  bg_2: z.string().describe("Secondary background color in hex format"),

  ui: z.string().describe("Border color in hex format"),
  ui_2: z.string().describe("Hovered border color in hex format"),
  ui_3: z.string().describe("Active border color in hex format"),

  tx: z.string().describe("Primary text color in hex format"),
  tx_3: z.string().describe("Faint text/comment color in hex format"),
  tx_2: z.string().describe("Muted text/punctuation color in hex format"),

  pr: z.string().describe("Primary accent color in hex format"),
  sc: z.string().describe("Secondary accent color in hex format"),

  ac_1: z.string().describe("Accent color 1 in hex format"),
  ac_2: z.string().describe("Accent color 2 in hex format"),
  ac_3: z.string().describe("Accent color 3 in hex format"),
});

export type TinteBlock = z.infer<typeof TinteBlockSchema>;

export type TinteTheme = {
  light: TinteBlock;
  dark: TinteBlock;
};
