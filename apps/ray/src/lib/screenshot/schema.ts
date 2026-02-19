import { z } from "zod";
import { TinteBlockSchema } from "@tinte/core";
import { LANGUAGES } from "@/lib/code-samples";

const GradientIdSchema = z.enum([
  "midnight",
  "sunset",
  "ocean",
  "forest",
  "ember",
  "steel",
  "aurora",
  "none",
]);

export const ScreenshotRequestSchema = z.object({
  code: z.string().min(1).max(10_000),
  language: z.enum(LANGUAGES).default("typescript"),
  theme: z.union([z.string(), TinteBlockSchema]).default("one-hunter"),
  mode: z.enum(["dark", "light"]).default("dark"),
  padding: z.number().int().min(0).max(256).default(32),
  fontSize: z.number().int().min(8).max(32).default(14),
  lineNumbers: z.boolean().default(true),
  title: z.string().max(100).default(""),
  background: GradientIdSchema.default("midnight"),
  format: z.enum(["png", "svg"]).default("png"),
  scale: z.number().int().min(1).max(4).default(2),
});

export type ScreenshotRequest = z.infer<typeof ScreenshotRequestSchema>;
