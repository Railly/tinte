import { z } from "zod";

export const AnimatedIdeSettingsSchema = z.object({
  theme: z.string().default("one-hunter").describe("Tinte theme name"),
  mode: z.enum(["light", "dark"]).default("dark").describe("Color mode"),
});

export const AnimatedIdeStepSchema = z.object({
  code: z.string().describe("Source code content"),
  fileName: z.string().describe("File name shown in tab (e.g. page.tsx)"),
  filePath: z
    .array(z.string())
    .default(["app"])
    .describe("Breadcrumb path segments"),
  lang: z
    .string()
    .default("tsx")
    .describe("Language identifier for syntax highlighting"),
  meta: z.string().optional().describe("Optional code meta string"),
});

export const AnimatedIdePropsSchema = z.object({
  steps: z.array(AnimatedIdeStepSchema).min(1),
  settings: AnimatedIdeSettingsSchema,
  durationPerStep: z
    .number()
    .default(120)
    .describe("Frames per step at 30fps (120 = 4 seconds)"),
  transitionDuration: z
    .number()
    .default(30)
    .describe("Transition frames between steps (30 = 1 second)"),
});

export type AnimatedIdePropsInput = z.input<typeof AnimatedIdePropsSchema>;
export type AnimatedIdePropsOutput = z.output<typeof AnimatedIdePropsSchema>;
