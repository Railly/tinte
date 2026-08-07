import {
  type Line,
  roleVariable,
  SHIKI_TOKEN_VARIABLES,
  type Token,
  tokenizeTranscript,
} from "@/lib/terminal-highlight";
import { cn } from "@/lib/utils";

/**
 * Emits the provider's `--shiki-*` variables once per page. The values are
 * compiler output, so they live in a style block the same way tokens.css does
 * rather than being restated as literals in component markup.
 */
export function ShikiTokenStyle() {
  const declarations = Object.entries(SHIKI_TOKEN_VARIABLES)
    .map(([name, value]) => `${name}: ${value};`)
    .join("");

  return (
    <style dangerouslySetInnerHTML={{ __html: `.home{${declarations}}` }} />
  );
}

function renderToken(token: Token, index: number) {
  return (
    <span key={index} style={{ color: roleVariable(token.role) }}>
      {token.text}
    </span>
  );
}

function renderLine(line: Line, index: number) {
  return (
    <span key={index} className="block">
      {line.tokens.map(renderToken)}
    </span>
  );
}

/**
 * A bare command with no prompt and no output, for the reference list. Same
 * tokenizer, so a flag reads the same here as it does inside a transcript.
 */
export function CommandLine({ command }: { command: string }) {
  const [line] = tokenizeTranscript(`$ ${command}`);
  const withoutPrompt = line.tokens.slice(2);

  return <>{withoutPrompt.map(renderToken)}</>;
}

interface TerminalBlockProps {
  snippet: string;
  className?: string;
  label: string;
}

/**
 * Highlighting runs on the server: this is a plain async-free server component,
 * so the colored markup ships in the HTML with no client highlighter and no
 * hydration cost.
 */
export function TerminalBlock({
  snippet,
  className,
  label,
}: TerminalBlockProps) {
  const lines = tokenizeTranscript(snippet);

  return (
    <pre
      role="figure"
      aria-label={label}
      className={cn(
        "min-w-0 overflow-x-auto rounded-sm border border-border bg-card font-mono text-[13px] leading-[1.7]",
        className,
      )}
    >
      <code>{lines.map(renderLine)}</code>
    </pre>
  );
}
