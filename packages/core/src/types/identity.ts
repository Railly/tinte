import { z } from "zod";
import { TinteBlockSchema } from "./tinte";

/**
 * Zod schema for TinteTheme. `tinte.ts` only exports the TinteTheme *type*
 * (the providers depend on it), so the runtime schema lives here and is built
 * from the existing TinteBlockSchema without touching tinte.ts.
 */
export const TinteThemeSchema = z.object({
  light: TinteBlockSchema,
  dark: TinteBlockSchema.optional(),
  name: z.string().optional(),
  author: z.string().optional(),
});

export type TinteThemeInput = z.infer<typeof TinteThemeSchema>;

/**
 * A single typographic role: the exact size/leading/weight triple an agent is
 * allowed to use. Sizes are px, lineHeight is a unitless ratio, weight is a
 * numeric CSS font-weight.
 */
export const TypeRoleSchema = z.object({
  size: z.number().positive().describe("Font size in px"),
  lineHeight: z.number().positive().describe("Unitless line-height ratio"),
  weight: z
    .number()
    .int()
    .min(100)
    .max(900)
    .describe("Numeric CSS font-weight"),
});

export type TypeRole = z.infer<typeof TypeRoleSchema>;

export const TYPE_ROLE_NAMES = [
  "display",
  "title",
  "heading",
  "body",
  "label",
  "mono",
] as const;

export const TypographySchema = z.object({
  families: z.object({
    sans: z.string().min(1),
    mono: z.string().min(1),
  }),
  roles: z.object({
    display: TypeRoleSchema,
    title: TypeRoleSchema,
    heading: TypeRoleSchema,
    body: TypeRoleSchema,
    label: TypeRoleSchema,
    mono: TypeRoleSchema,
  }),
});

export type Typography = z.infer<typeof TypographySchema>;

/**
 * How the primary action is expressed.
 * - "hue": a saturated accent color owns the CTA.
 * - "inverted": the CTA is a foreground/background inversion, no accent hue.
 *   (Spike finding: 2/3 of surveyed sites use inversion, not a hue.)
 */
export const PrimaryStyleSchema = z.enum(["hue", "inverted"]);

export type PrimaryStyle = z.infer<typeof PrimaryStyleSchema>;

export const TinteIdentitySchema = z.object({
  name: z.string().min(1),
  theme: TinteThemeSchema,
  typography: TypographySchema,
  radius: z.string().min(1).describe('CSS length, e.g. "2px" or "0.5rem"'),
  primaryStyle: PrimaryStyleSchema,
  voiceWords: z.array(z.string()).optional(),
  dosDonts: z.array(z.string()).optional(),
  tokensCssUrl: z.string().optional(),
});

export type TinteIdentity = z.infer<typeof TinteIdentitySchema>;
