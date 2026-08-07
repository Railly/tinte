import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

type ViolationKind = "hex" | "rgb-hsl" | "tailwind-palette";

interface Violation {
  file: string;
  line: number;
  kind: ViolationKind;
  match: string;
}

const SCAN_EXTENSIONS = new Set([
  ".tsx",
  ".ts",
  ".jsx",
  ".js",
  ".css",
  ".html",
]);

const SKIP_DIRS = new Set(["node_modules", "dist", ".git", ".next"]);

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const RGB_HSL_RE = /\b(?:rgb|rgba|hsl|hsla)\(/g;
const TAILWIND_PALETTE_RE =
  /\b(?:bg|text|border|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+\b/g;

const IGNORE_MARKER = "tinte-ignore";

function isTokensCssFile(filePath: string): boolean {
  return filePath.split(/[\\/]/).pop() === "tokens.css";
}

function collectFiles(root: string): string[] {
  const results: string[] = [];

  const stat = statSync(root);
  if (stat.isFile()) {
    if (SCAN_EXTENSIONS.has(extname(root))) {
      results.push(root);
    }
    return results;
  }

  const walk = (dir: string) => {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }

    for (const entry of entries) {
      if (SKIP_DIRS.has(entry)) continue;
      const fullPath = join(dir, entry);
      let entryStat: ReturnType<typeof statSync>;
      try {
        entryStat = statSync(fullPath);
      } catch {
        continue;
      }

      if (entryStat.isDirectory()) {
        walk(fullPath);
      } else if (entryStat.isFile() && SCAN_EXTENSIONS.has(extname(fullPath))) {
        results.push(fullPath);
      }
    }
  };

  walk(root);
  return results;
}

function scanFile(filePath: string): Violation[] {
  if (isTokensCssFile(filePath)) return [];

  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const violations: Violation[] = [];

  lines.forEach((line, index) => {
    if (line.includes(IGNORE_MARKER)) return;

    for (const match of line.matchAll(HEX_RE)) {
      violations.push({
        file: filePath,
        line: index + 1,
        kind: "hex",
        match: match[0],
      });
    }

    for (const match of line.matchAll(RGB_HSL_RE)) {
      violations.push({
        file: filePath,
        line: index + 1,
        kind: "rgb-hsl",
        match: match[0],
      });
    }

    for (const match of line.matchAll(TAILWIND_PALETTE_RE)) {
      violations.push({
        file: filePath,
        line: index + 1,
        kind: "tailwind-palette",
        match: match[0],
      });
    }
  });

  return violations;
}

export async function lintCommand(args: string[]): Promise<number> {
  const jsonOutput = args.includes("--json");
  const paths = args.filter((arg) => !arg.startsWith("--"));
  const targets = paths.length > 0 ? paths : ["."];

  let files: string[];
  try {
    files = targets.flatMap((target) => collectFiles(target));
  } catch (error) {
    console.error(
      `tinte lint: error reading path — ${error instanceof Error ? error.message : String(error)}`,
    );
    return 2;
  }

  const violations = files.flatMap((file) => scanFile(file));

  if (jsonOutput) {
    console.log(
      JSON.stringify(
        {
          violations: violations.map((v) => ({
            file: v.file,
            line: v.line,
            kind: v.kind,
            match: v.match,
          })),
          count: violations.length,
        },
        null,
        2,
      ),
    );
    return violations.length > 0 ? 1 : 0;
  }

  if (violations.length === 0) {
    console.log("tinte lint: clean — no hardcoded colors found");
    return 0;
  }

  for (const violation of violations) {
    const displayPath =
      relative(process.cwd(), violation.file) || violation.file;
    console.log(
      `${displayPath}:${violation.line}  ${violation.kind}  ${violation.match}`,
    );
  }

  console.log(
    `\n${violations.length} violation${violations.length === 1 ? "" : "s"} found`,
  );

  return 1;
}
