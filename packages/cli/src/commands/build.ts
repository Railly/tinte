import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type TinteBlock,
  type TinteIdentity,
  TinteIdentitySchema,
  type Typography,
} from "@tinte/core";
import { formatCss, oklch, parse } from "culori";

const PLUGIN_SCHEMA_URL =
  "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";

const INVERTED_PRIMARY_NOTE =
  "The primary action style is an inverted foreground/background pair, not a hue. Do not introduce an accent color for CTAs.";

const TOKENS_CSS_URL = "./references/tokens.css";

interface BuildOptions {
  configPath: string;
  outDir: string;
  plugin: boolean;
}

/**
 * `tinte build [--plugin] [--config <file>] [--out <dir>]`
 *
 * Reads a TinteIdentity config, validates it against the V4 schema, and emits
 * either a full Agent Plugin directory (--plugin) or the two loose artifacts
 * (design.md + tokens.css).
 */
export async function buildCommand(args: string[]): Promise<number> {
  let options: BuildOptions;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(`Error: ${messageOf(error)}`);
    return 1;
  }

  const configPath = resolve(process.cwd(), options.configPath);
  if (!existsSync(configPath)) {
    console.error(`Error: config not found at ${configPath}`);
    return 1;
  }

  let raw: unknown;
  try {
    raw = JSON.parse(await readFile(configPath, "utf8"));
  } catch (error) {
    console.error(
      `Error: ${configPath} is not valid JSON. ${messageOf(error)}`,
    );
    return 1;
  }

  const parsed = TinteIdentitySchema.safeParse(raw);
  if (!parsed.success) {
    console.error(`Error: ${configPath} is not a valid tinte identity.`);
    for (const issue of parsed.error.issues) {
      const path = issue.path.length > 0 ? issue.path.join(".") : "<root>";
      console.error(`  ${path}: ${issue.message}`);
    }
    return 1;
  }

  const identity = parsed.data;
  const outDir = resolve(
    process.cwd(),
    options.outDir ?? `./${identity.name}-plugin`,
  );

  let template: string;
  try {
    template = await loadTemplate();
  } catch (error) {
    console.error(`Error: ${messageOf(error)}`);
    return 1;
  }

  const skillMarkdown = renderSkill(template, identity);
  const tokensCss = renderTokensCss(identity);

  const written: string[] = [];

  if (options.plugin) {
    const skillName = `${identity.name}-design`;
    const skillDir = join(outDir, "skills", skillName);
    const referencesDir = join(skillDir, "references");

    await mkdir(referencesDir, { recursive: true });

    const pluginJson = `${JSON.stringify(
      { $schema: PLUGIN_SCHEMA_URL, name: skillName },
      null,
      2,
    )}\n`;

    written.push(await write(join(outDir, "plugin.json"), pluginJson));
    written.push(await write(join(skillDir, "SKILL.md"), skillMarkdown));
    written.push(await write(join(referencesDir, "tokens.css"), tokensCss));
  } else {
    await mkdir(outDir, { recursive: true });
    written.push(await write(join(outDir, "design.md"), skillMarkdown));
    written.push(await write(join(outDir, "tokens.css"), tokensCss));
  }

  for (const file of written) {
    console.log(file);
  }

  return 0;
}

function parseArgs(args: string[]): BuildOptions {
  let configPath = "./tinte.config.json";
  let outDir = "";
  let plugin = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--plugin") {
      plugin = true;
    } else if (arg === "--config" || arg === "--out") {
      const value = args[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${arg} requires a value`);
      }
      if (arg === "--config") configPath = value;
      else outDir = value;
      i++;
    } else if (arg.startsWith("--config=")) {
      configPath = arg.slice("--config=".length);
    } else if (arg.startsWith("--out=")) {
      outDir = arg.slice("--out=".length);
    } else {
      throw new Error(`unknown argument "${arg}"`);
    }
  }

  return { configPath, outDir, plugin };
}

/**
 * Resolve assets/templates/landing.md relative to this module so the command
 * works from src (bun test, tsx) and from the bundled dist/ output, where the
 * bundle sits one level deeper than the package root.
 */
async function loadTemplate(): Promise<string> {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    // src/commands/build.ts -> packages/cli/assets
    resolve(here, "../../assets/templates/landing.md"),
    // dist/cli.js -> packages/cli/assets
    resolve(here, "../assets/templates/landing.md"),
    resolve(here, "assets/templates/landing.md"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return readFile(candidate, "utf8");
    }
  }

  throw new Error(
    `landing template not found. Looked in:\n  ${candidates.join("\n  ")}`,
  );
}

function renderSkill(template: string, identity: TinteIdentity): string {
  const slots: Record<string, string> = {
    brand_name: identity.name,
    tokens_css_url: identity.tokensCssUrl ?? TOKENS_CSS_URL,
    type_scale: renderTypeScale(identity.typography),
    voice_words: renderVoiceWords(identity.voiceWords),
    brand_dos_donts: renderDosDonts(identity.dosDonts),
  };

  // The template uses {{brand_dos_donts}} twice in different grammatical
  // contexts: once inline mid-sentence ("… unless {{slot}} says otherwise.")
  // and once as a standalone rules block. A bulleted list is right for the
  // block and wrong for the sentence, so the inline occurrence is resolved
  // first, against its surrounding prose.
  let output = template.replaceAll(
    "{{brand_dos_donts}} says otherwise.",
    `${renderDosDontsInline(identity.dosDonts)} says otherwise.`,
  );

  for (const [slot, value] of Object.entries(slots)) {
    output = output.replaceAll(`{{${slot}}}`, value);
  }

  if (identity.primaryStyle === "inverted") {
    output = injectInvertedNote(output);
  }

  return output;
}

/**
 * Append the inverted-primary rule to the "Token foundation" section, right
 * before the section that follows it.
 */
function injectInvertedNote(markdown: string): string {
  const heading = "### Token foundation";
  const start = markdown.indexOf(heading);
  if (start === -1) {
    return `${markdown.trimEnd()}\n\n${INVERTED_PRIMARY_NOTE}\n`;
  }

  const nextHeading = markdown.indexOf("\n### ", start + heading.length);
  const insertAt = nextHeading === -1 ? markdown.length : nextHeading;

  const before = markdown.slice(0, insertAt).trimEnd();
  const after = markdown.slice(insertAt);

  return `${before}\n\n${INVERTED_PRIMARY_NOTE}\n${after}`;
}

function renderTypeScale(typography: Typography): string {
  const roles = typography.roles;
  const parts = (
    ["display", "title", "heading", "body", "label", "mono"] as const
  ).map((name) => {
    const role = roles[name];
    return `${name} ${role.size}/${role.lineHeight} ${role.weight}`;
  });

  return `Six roles only: ${parts.join(" · ")}. Sans: ${
    typography.families.sans
  }. Mono: ${typography.families.mono}. No other sizes or weights exist.`;
}

function renderVoiceWords(words?: string[]): string {
  if (!words || words.length === 0) {
    return "plain, concrete, specific";
  }
  return words.join(", ");
}

function renderDosDonts(rules?: string[]): string {
  if (!rules || rules.length === 0) {
    return "No brand-specific overrides. The archetype defaults stand alone.";
  }
  return rules.map((rule) => `- ${rule}`).join("\n");
}

/**
 * Same rules, flattened into one clause so the sentence that embeds them stays
 * a sentence.
 */
function renderDosDontsInline(rules?: string[]): string {
  if (!rules || rules.length === 0) {
    return "a brand rule";
  }
  return rules.map((rule) => rule.replace(/\.$/, "")).join("; ");
}

/**
 * TinteBlock (13 tokens) -> shadcn CSS variables.
 *
 * Mapping rationale — the theme graph is a semantic 13-token model, shadcn is a
 * role-based surface API, so several shadcn roles legitimately share one source
 * token:
 *
 *   bg    -> background            the page canvas
 *   tx    -> foreground            body text on the canvas
 *   bg_2  -> card, popover,        every raised/recessed surface one step off
 *            secondary, muted      the canvas; the graph has a single such step
 *   tx    -> card-foreground,      text on those surfaces is the same ink; the
 *            popover-foreground    graph does not model per-surface ink
 *   tx_2  -> muted-foreground      the muted/secondary text tier
 *   sc    -> secondary-foreground  falls back to tx when sc is missing
 *   ui    -> border, input         the resting border tier (ui_2/ui_3 are the
 *                                  hover/active tiers, which shadcn does not
 *                                  express as base tokens)
 *   pr    -> primary, ring, accent one accent owns the primary action, its
 *                                  focus ring, and the accent surface
 *   ac_3  -> destructive           the graph's third accent is the alert slot
 *
 * primaryStyle "inverted": the CTA is a foreground/background inversion rather
 * than a hue, so --primary becomes tx and --primary-foreground becomes bg. ring
 * follows primary; accent stays on pr so a non-CTA accent surface remains
 * available.
 */
function mapBlockToShadcn(
  block: TinteBlock,
  primaryStyle: TinteIdentity["primaryStyle"],
): Array<[string, string]> {
  const inverted = primaryStyle === "inverted";

  const primary = inverted ? block.tx : block.pr;
  const primaryForeground = inverted ? block.bg : bestContrast(block.pr, block);

  return [
    ["background", block.bg],
    ["foreground", block.tx],
    ["card", block.bg_2],
    ["card-foreground", block.tx],
    ["popover", block.bg_2],
    ["popover-foreground", block.tx],
    ["primary", primary],
    ["primary-foreground", primaryForeground],
    ["secondary", block.bg_2],
    ["secondary-foreground", block.sc || block.tx],
    ["muted", block.bg_2],
    ["muted-foreground", block.tx_2],
    ["accent", block.pr],
    ["accent-foreground", bestContrast(block.pr, block)],
    ["destructive", block.ac_3],
    ["destructive-foreground", bestContrast(block.ac_3, block)],
    ["border", block.ui],
    ["input", block.ui],
    ["ring", primary],
  ];
}

/**
 * Pick bg or tx as the readable ink over `color`, by OKLCH lightness. The graph
 * gives no explicit on-accent ink, so this is a deterministic approximation.
 * The 0.7 threshold keeps mid-lightness accents (an amber at L≈0.68) on the
 * light ink, which is what a designer picks for a saturated CTA fill.
 */
const INK_FLIP_LIGHTNESS = 0.7;

function bestContrast(color: string, block: TinteBlock): string {
  const parsed = oklch(parse(color));
  if (!parsed) return block.tx;
  return parsed.l > INK_FLIP_LIGHTNESS ? block.tx : block.bg;
}

/**
 * culori's formatCss emits full float precision, which makes the token file
 * unreadable and churns diffs. Round to 4 decimals, matching the format the
 * shadcn provider already emits.
 */
function toOklch(color: string): string {
  const parsed = oklch(parse(color));
  if (!parsed) return color;
  const round = (n: number) => Number.parseFloat(n.toFixed(4));
  return formatCss({
    mode: "oklch",
    l: round(parsed.l),
    c: round(parsed.c),
    h: round(parsed.h ?? 0),
    alpha: parsed.alpha,
  });
}

function renderTokensCss(identity: TinteIdentity): string {
  const { theme, radius, primaryStyle, name } = identity;

  const block = (
    entries: Array<[string, string]>,
    selector: string,
    withRadius: boolean,
  ): string => {
    const lines = entries.map(
      ([token, value]) => `  --${token}: ${toOklch(value)};`,
    );
    if (withRadius) lines.push(`  --radius: ${radius};`);
    return `${selector} {\n${lines.join("\n")}\n}`;
  };

  const parts = [
    `/* ${name} design tokens — public API. Do not read implementation into context. */`,
    block(mapBlockToShadcn(theme.light, primaryStyle), ":root", true),
  ];

  if (theme.dark) {
    parts.push(
      block(mapBlockToShadcn(theme.dark, primaryStyle), ".dark", false),
    );
  }

  return `${parts.join("\n\n")}\n`;
}

async function write(path: string, contents: string): Promise<string> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, contents, "utf8");
  return path;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
