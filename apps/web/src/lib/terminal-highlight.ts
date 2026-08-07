import { convertTinteToShiki } from "@tinte/providers";
import tinteConfig from "../../../../tinte.config.json";

/**
 * Syntax color for the landing comes from tinte's own compiler, not from a
 * third-party theme: the config's TinteBlock is run through the shiki provider,
 * which is the same conversion a user gets from `tinte`. The provider emits
 * `--shiki-*` CSS variables rather than literal colors, so the highlighted
 * markup references tokens instead of hex. That is what keeps `tinte lint`
 * clean on this page without a single `tinte-ignore`.
 */
const shikiTheme = convertTinteToShiki(
  tinteConfig.theme as Parameters<typeof convertTinteToShiki>[0],
);

/** The dark block is the one the landing renders; the page is dark-only. */
export const SHIKI_TOKEN_VARIABLES = shikiTheme.dark.variables;

type TokenRole =
  | "prompt"
  | "command"
  | "flag"
  | "path"
  | "comment"
  | "output"
  | "alert"
  | "plain";

export interface Token {
  text: string;
  role: TokenRole;
}

export interface Line {
  tokens: Token[];
}

/**
 * Each role reads a variable the provider produced, so a change to
 * tinte.config.json repaints this page through the compiler.
 *
 * `pr` and `sc` stay monochrome by design (the identity's primary is an
 * inversion, not a hue), so the roles bound to them render as foreground and
 * only the three accents carry color.
 */
const ROLE_VARIABLE: Record<TokenRole, string> = {
  prompt: "--shiki-token-comment",
  command: "--shiki-token-string",
  flag: "--shiki-token-function",
  path: "--shiki-token-parameter",
  comment: "--shiki-token-comment",
  output: "--shiki-token-parameter",
  alert: "--shiki-token-string-expression",
  plain: "--shiki-foreground",
};

export function roleVariable(role: TokenRole): string {
  return `var(${ROLE_VARIABLE[role]})`;
}

const TREE_GLYPHS = /^[\s│├└─]+$/;

/**
 * Tokenizes a terminal transcript.
 *
 * A stock `bash` grammar is wrong for this content: it paints tree glyphs and
 * output rows as if they were commands, which inverts the emphasis we want.
 * These snippets are transcripts, so they are tokenized by transcript
 * structure instead: the typed command line is the subject, and everything the
 * program printed back is secondary.
 */
export function tokenizeTranscript(source: string): Line[] {
  return source.split("\n").map((line) => ({ tokens: tokenizeLine(line) }));
}

function tokenizeLine(line: string): Token[] {
  if (line.trim() === "") return [{ text: line, role: "plain" }];

  const promptMatch = line.match(/^(\s*)(\$)(\s+)(.*)$/);
  if (promptMatch) {
    const [, indent, dollar, gap, rest] = promptMatch;
    const tokens: Token[] = [];
    if (indent) tokens.push({ text: indent, role: "plain" });
    tokens.push({ text: dollar, role: "prompt" });
    tokens.push({ text: gap, role: "plain" });
    return tokens.concat(tokenizeCommand(rest));
  }

  return tokenizeOutput(line);
}

/** The typed line: binary and subcommands read as command, flags as flag. */
function tokenizeCommand(rest: string): Token[] {
  const commentSplit = rest.match(/^(.*?)(\s*#.*)$/);
  const body = commentSplit ? commentSplit[1] : rest;
  const trailingComment = commentSplit ? commentSplit[2] : null;

  const tokens: Token[] = [];
  for (const piece of body.split(/(\s+)/)) {
    if (piece === "") continue;
    if (/^\s+$/.test(piece)) {
      tokens.push({ text: piece, role: "plain" });
    } else if (piece.startsWith("-")) {
      tokens.push({ text: piece, role: "flag" });
    } else if (/[/.]/.test(piece) || piece.startsWith("<")) {
      tokens.push({ text: piece, role: "path" });
    } else {
      tokens.push({ text: piece, role: "command" });
    }
  }

  if (trailingComment) tokens.push({ text: trailingComment, role: "comment" });
  return tokens;
}

/**
 * Printed output. Emphasis follows meaning rather than syntax: the alert accent
 * is spent only on failure (a violation kind, a non-zero exit), success reads
 * in the calm accent, and tree glyphs stay dim so the filenames beside them
 * carry the line.
 */
function tokenizeOutput(line: string): Token[] {
  const arrowMatch = line.match(/^(.*?)(->)(\s*)(.*)$/);
  if (arrowMatch) {
    const [, before, arrow, gap, after] = arrowMatch;
    return [
      ...tokenizeOutputWords(before, "alert"),
      { text: arrow, role: "prompt" },
      { text: gap, role: "plain" },
      { text: after, role: "command" },
    ];
  }

  if (/^\s*(exit\s+[1-9]|\d+\s+violations?\s+found)/.test(line)) {
    return [{ text: line, role: "alert" }];
  }

  if (/^\s*(exit\s+0|tinte lint: clean)/.test(line)) {
    return [{ text: line, role: "command" }];
  }

  return tokenizeOutputWords(line, "output");
}

/**
 * `defectRole` colors the words that name what went wrong on a violation row,
 * leaving the file:line reference dim.
 */
function tokenizeOutputWords(source: string, defectRole: TokenRole): Token[] {
  const tokens: Token[] = [];
  for (const piece of source.split(/(\s+)/)) {
    if (piece === "") continue;
    if (/^\s+$/.test(piece)) {
      tokens.push({ text: piece, role: "plain" });
    } else if (TREE_GLYPHS.test(piece)) {
      tokens.push({ text: piece, role: "output" });
    } else if (/^(oklch|inverted)/.test(piece)) {
      tokens.push({ text: piece, role: "command" });
    } else if (/^\w+\.\w+:\d+$/.test(piece)) {
      tokens.push({ text: piece, role: "output" });
    } else if (defectRole === "alert" && /^[a-z-]+$/.test(piece)) {
      tokens.push({ text: piece, role: "alert" });
    } else if (piece.endsWith("/")) {
      // A directory is scaffolding; the files inside it are the artifact.
      tokens.push({ text: piece, role: "path" });
    } else if (/\.\w+$/.test(piece)) {
      // An emitted filename is what the command produced, so it reads as the
      // subject of the output rather than as chrome.
      tokens.push({ text: piece, role: "command" });
    } else if (/[/.]/.test(piece) && !/^\d+$/.test(piece)) {
      tokens.push({ text: piece, role: "path" });
    } else {
      tokens.push({ text: piece, role: "output" });
    }
  }
  return tokens;
}
