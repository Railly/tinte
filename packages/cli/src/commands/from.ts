import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { oklch } from "culori";
import { z } from "zod";
import { moduleDir } from "../lib/module-dir";

// Intentionally a LOOSE draft schema, not the strict TinteIdentitySchema from
// @tinte/core: extraction from a homepage cannot derive every token (destructive,
// ring, input need app states). `tinte from` emits a draft identity; `tinte build`
// is the strict gate that validates the final config against the core schema.
const TypeRoleSchema = z.object({
  size: z.number(),
  lineHeight: z.number(),
  weight: z.number(),
});

const TinteIdentitySchema = z.object({
  name: z.string(),
  theme: z
    .object({
      light: z.record(z.string(), z.string()),
      dark: z.record(z.string(), z.string()).optional(),
    })
    .partial({ dark: true }),
  typography: z.object({
    families: z.object({
      sans: z.string(),
      mono: z.string(),
    }),
    roles: z.object({
      display: TypeRoleSchema.optional(),
      title: TypeRoleSchema.optional(),
      heading: TypeRoleSchema.optional(),
      body: TypeRoleSchema.optional(),
      label: TypeRoleSchema.optional(),
      mono: TypeRoleSchema.optional(),
    }),
  }),
  radius: z.string(),
  primaryStyle: z.enum(["hue", "inverted"]),
  voiceWords: z.array(z.string()).optional(),
  dosDonts: z.array(z.string()).optional(),
  tokensCssUrl: z.string().optional(),
});

type TinteIdentity = z.infer<typeof TinteIdentitySchema>;

interface ColorCandidate {
  color: string;
  area: number;
  count: number;
}

interface RawCandidates {
  fontFamilies: string[];
  fontSizesSorted: Array<{ size: string; count: number }>;
  fontWeights: string[];
  lineHeights: string[];
  styleSheets: Array<{
    href: string;
    ok: boolean;
    ruleCount?: number;
    error?: string;
  }>;
  topBgColorsByArea: ColorCandidate[];
  topTextColorsByArea: ColorCandidate[];
  totalElements: number;
  uniqueBgColors: number;
  uniqueRadii: Array<[string, number]>;
  uniqueShadows: Array<[string, number]>;
  uniqueTextColors: number;
  visibleElements: number;
}

const FULL_RADIUS_THRESHOLD_PX = 9000;
const OKLCH_CHROMA_SATURATED_THRESHOLD = 0.09;
const TOP_N_PER_CHANNEL = 10;

function resolveExtractScriptPath(): string {
  const dir = moduleDir(import.meta.url);

  const candidates = [
    // dev via tsx: dir = packages/cli/src/commands
    join(dir, "..", "..", "assets", "extract.js"),
    // built via tsup (cjs bundle at packages/cli/dist/cli.js): dir = dist
    join(dir, "..", "assets", "extract.js"),
    join(dir, "assets", "extract.js"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    `tinte from: could not locate extract.js from ${dir} (tried ${candidates.join(", ")})`,
  );
}

function normalizeRadius(raw: string): string {
  const trimmed = raw.trim();
  const numeric = Number.parseFloat(trimmed);
  if (!Number.isNaN(numeric) && numeric >= FULL_RADIUS_THRESHOLD_PX) {
    return "full";
  }
  // Mixed pill shorthand like "3.35544e+07px 6px 6px 3.35544e+07px"
  if (/e\+0?[7-9]/i.test(trimmed)) {
    return "full";
  }
  if (trimmed === "100%") return "full";
  return trimmed;
}

const AREA_HIGH_THRESHOLD = 100_000;

function isDecorative(candidate: ColorCandidate): boolean {
  // High-area, count==1 = painted once, large surface - a decorative
  // gradient/hero background, not a recurring system token. Low-area
  // count==1 is just noise, not decorative; leave it to the area sort
  // to drop it naturally.
  return candidate.count === 1 && candidate.area >= AREA_HIGH_THRESHOLD;
}

function topCandidates(
  candidates: ColorCandidate[],
  n: number,
): ColorCandidate[] {
  // Area is the primary signal (what dominates the canvas); count is the
  // tie-breaker (what recurs as a system token). Decorative area-high
  // count-1 entries (hero gradients) are dropped before ranking.
  return candidates
    .filter((c) => !isDecorative(c))
    .sort((a, b) => {
      if (b.area !== a.area) return b.area - a.area;
      return b.count - a.count;
    })
    .slice(0, n);
}

function toOklchString(cssColor: string): string | null {
  const parsed = oklch(cssColor);
  if (!parsed) return null;
  const l = Number.isFinite(parsed.l) ? parsed.l : 0;
  const c = Number.isFinite(parsed.c) ? parsed.c : 0;
  const h = Number.isFinite(parsed.h) ? (parsed.h as number) : 0;
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
}

function chroma(cssColor: string): number {
  const parsed = oklch(cssColor);
  return parsed?.c ?? 0;
}

function isSaturated(candidate: ColorCandidate): boolean {
  return chroma(candidate.color) > OKLCH_CHROMA_SATURATED_THRESHOLD;
}

const PRIMARY_HUE_MIN_RANK = 3;

function detectPrimaryStyle(
  bgTop: ColorCandidate[],
  textTop: ColorCandidate[],
): "hue" | "inverted" {
  // "hue" wins only if a saturated color ranks among the top area-dominant
  // candidates (a real recurring surface, e.g. a CTA button fill) - not
  // just any saturated color that shows up anywhere in the top-10 (a
  // small success/error badge chroma is noise, not a primary). Otherwise
  // the site's CTA is an inverted fg/bg pair (linear.app/vercel.com
  // pattern from the spike).
  const rankedTop = [...bgTop, ...textTop]
    .slice(0, PRIMARY_HUE_MIN_RANK * 2)
    .filter((c) => c.count > 1);
  const saturatedRecurring = rankedTop.find((c) => isSaturated(c));
  return saturatedRecurring ? "hue" : "inverted";
}

function pickFamilies(fontFamilies: string[]): { sans: string; mono: string } {
  const mono =
    fontFamilies.find((f) => /mono/i.test(f)) ?? "ui-monospace, monospace";
  const sans =
    fontFamilies.find((f) => f !== mono) ?? fontFamilies[0] ?? "sans-serif";
  return { sans, mono };
}

function normalize(
  raw: RawCandidates,
  name: string,
): {
  identity: Partial<TinteIdentity>;
  warnings: string[];
} {
  const warnings: string[] = [];

  const bgTop = topCandidates(raw.topBgColorsByArea, TOP_N_PER_CHANNEL);
  const textTop = topCandidates(raw.topTextColorsByArea, TOP_N_PER_CHANNEL);

  if (bgTop.length === 0) {
    warnings.push(
      "no usable bg candidates after filtering decorative area-1 entries",
    );
  }
  if (textTop.length === 0) {
    warnings.push(
      "no usable text candidates after filtering decorative area-1 entries",
    );
  }

  // bg = highest-area recurring background; fg = highest-area recurring text.
  const bgCandidate = bgTop[0];
  const fgCandidate = textTop[0];

  const bg = bgCandidate ? toOklchString(bgCandidate.color) : null;
  const fg = fgCandidate ? toOklchString(fgCandidate.color) : null;

  if (!bg)
    warnings.push("bg: could not derive - no dominant background color found");
  if (!fg) warnings.push("fg: could not derive - no dominant text color found");

  for (const token of ["destructive", "ring", "input"]) {
    warnings.push(
      `${token}: not derivable from homepage-only capture - requires crawling form/focus states`,
    );
  }

  const primaryStyle = detectPrimaryStyle(bgTop, textTop);

  const radiusEntries = raw.uniqueRadii
    .map(([r, count]) => ({ radius: normalizeRadius(r), count }))
    .filter((r) => /^\d/.test(r.radius) || r.radius === "full");
  const radiusWinner = radiusEntries.sort((a, b) => b.count - a.count)[0];
  const radius = radiusWinner?.radius ?? "0px";

  const { sans, mono } = pickFamilies(raw.fontFamilies);

  const sortedSizes = raw.fontSizesSorted
    .filter((s) => Number.parseFloat(s.size) > 0)
    .sort((a, b) => Number.parseFloat(a.size) - Number.parseFloat(b.size));

  const weightsSorted = raw.fontWeights
    .map((w) => Number.parseFloat(w))
    .filter((w) => !Number.isNaN(w))
    .sort((a, b) => a - b);

  function sizeAt(fromEnd: number): number {
    const idx = sortedSizes.length - 1 - fromEnd;
    const entry =
      sortedSizes[Math.max(0, Math.min(idx, sortedSizes.length - 1))];
    return entry ? Number.parseFloat(entry.size) : 16;
  }

  const bodySize = sortedSizes.find(
    (s) => s.count === Math.max(...sortedSizes.map((x) => x.count)),
  )?.size;
  const bodySizeNum = bodySize ? Number.parseFloat(bodySize) : 16;
  const maxWeight = weightsSorted[weightsSorted.length - 1] ?? 500;
  const minWeight = weightsSorted[0] ?? 400;

  const identity: Partial<TinteIdentity> = {
    name,
    theme: {
      light: {
        ...(bg ? { bg } : {}),
        ...(fg ? { tx: fg } : {}),
      },
    },
    typography: {
      families: { sans, mono },
      roles: {
        display: {
          size: sizeAt(0),
          lineHeight: sizeAt(0) * 1.1,
          weight: maxWeight,
        },
        body: {
          size: bodySizeNum,
          lineHeight: bodySizeNum * 1.5,
          weight: minWeight,
        },
      },
    },
    radius,
    primaryStyle,
  };

  return { identity, warnings };
}

function parseFlagValue(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

export async function fromCommand(args: string[]): Promise<number> {
  if (args.includes("--emit-script")) {
    const scriptPath = resolveExtractScriptPath();
    const script = readFileSync(scriptPath, "utf-8");
    console.log(script);
    return 0;
  }

  const normalizeIdx = args.indexOf("--normalize");
  if (normalizeIdx !== -1) {
    const candidatesPath = args[normalizeIdx + 1];
    if (!candidatesPath) {
      console.error(
        "tinte from: --normalize requires a <candidates.json> path",
      );
      return 2;
    }

    let raw: RawCandidates;
    try {
      raw = JSON.parse(readFileSync(candidatesPath, "utf-8"));
    } catch (error) {
      console.error(
        `tinte from: could not read/parse ${candidatesPath} - ${error instanceof Error ? error.message : String(error)}`,
      );
      return 2;
    }

    const name = parseFlagValue(args, "--name") ?? "untitled";
    const outPath = parseFlagValue(args, "--out");

    const { identity, warnings } = normalize(raw, name);

    for (const warning of warnings) {
      console.error(`tinte from: warning - ${warning}`);
    }

    let parsed: TinteIdentity;
    try {
      parsed = TinteIdentitySchema.parse(identity);
    } catch (error) {
      console.error(
        `tinte from: normalized output failed schema validation - ${error instanceof Error ? error.message : String(error)}`,
      );
      return 1;
    }

    const output = JSON.stringify(parsed, null, 2);

    if (outPath) {
      writeFileSync(outPath, output);
    } else {
      console.log(output);
    }

    return 0;
  }

  console.error(
    "tinte from: usage - tinte from --emit-script | tinte from --normalize <candidates.json> [--name <n>] [--out <file>]",
  );
  return 2;
}
