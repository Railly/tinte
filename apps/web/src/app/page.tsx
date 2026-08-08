import type { Metadata } from "next";
import { CopyCommand } from "@/components/home/copy-command";
import {
  CommandLine,
  ShikiTokenStyle,
  TerminalBlock,
} from "@/components/home/terminal-block";
import InvertedLogo from "@/components/shared/layout/inverted-logo";
import { siteConfig } from "@/config/site";
import "./home.css";

export const metadata: Metadata = {
  title: "Compile your design system into an Agent Plugin",
  description:
    "Tinte reads a live site, compiles its design system into an Agent Plugin, and fails the build on any color that bypasses the tokens.",
  alternates: { canonical: siteConfig.url },
};

// Both commands are the ones packages/cli/README.md documents, verbatim. The
// skill install comes first because it is what a coding agent needs before it
// can write on-brand UI; the CLI is the compiler behind it.
const SKILL_INSTALL_COMMAND = "npx skills add Railly/tinte";
const CLI_INSTALL_COMMAND = "bun add -g tinte";

// Emitted by `bun run generate:design` into apps/web/public/. The first two are
// the loose artifacts; the rest are the Agent Plugin tree an agent mirrors.
const ARTIFACT_PATHS = [
  "/design.md",
  "/tokens.css",
  "/plugin/plugin.json",
  "/plugin/skills/tinte-design/SKILL.md",
];

const EXTRACT_SNIPPET = `$ tinte from --normalize candidates.json --name acme

acme-draft.json
  theme.light.bg   oklch(0 0 0)
  theme.light.tx   oklch(0.9461 0 0)
  primaryStyle     inverted`;

const BUILD_SNIPPET = `$ tinte build --plugin

acme-plugin/
├── plugin.json
└── skills/
    └── acme-design/
        ├── SKILL.md
        └── references/
            └── tokens.css`;

// The linter reports a violation by kind, not by echoing the literal it found,
// so this example names each defect in words and shows the repaired line. Every
// piece of color syntax rendered on this page is already token-based — the
// syntax highlighting included, which references `--shiki-*` variables the
// compiler emitted rather than literal colors — which is why the page passes
// its own `tinte lint` with no per-line escapes.
const LINT_SNIPPET = `$ tinte lint src/

card.tsx:12  hex literal       ->  var(--card)
card.tsx:19  tailwind palette  ->  text-muted-foreground

2 violations found
exit 1

$ tinte lint src/   # after the fix

tinte lint: clean
exit 0`;

// The full human path: read a reference, emit the artifact, install it. The
// VS Code artifact is the one the classic installer accepts, so the last line
// is a real command and not an illustration.
const THEME_SNIPPET = `$ tinte from --normalize candidates.json --name acme

$ tinte build --to vscode --config acme.json

acme-vscode.json

$ tinte acme-vscode.json --code

Theme installed successfully!`;

// Registered --to targets, mirroring src/lib/build-targets.ts exactly. Only
// providers whose artifact is a theme a tool consumes are listed; the shadcn,
// design-system and brand-guidelines providers emit UI documents instead.
const THEME_TARGETS = [
  { id: "vscode", does: "VS Code and Cursor, installable with tinte --code" },
  { id: "zed", does: "Zed theme family, light and dark" },
  { id: "kitty", does: "Kitty terminal conf" },
  { id: "warp", does: "Warp terminal YAML" },
  { id: "alacritty", does: "Alacritty terminal YAML" },
  { id: "windows-terminal", does: "Windows Terminal color scheme" },
  { id: "slack", does: "Slack sidebar theme" },
  { id: "gimp", does: "GIMP palette" },
  { id: "shiki", does: "Shiki syntax highlighting CSS" },
];

const COMMANDS = [
  {
    command: "tinte from --emit-script",
    does: "Prints the extraction script you run against a live page.",
  },
  {
    command: "tinte from --normalize <json>",
    does: "Turns captured computed styles into a draft identity config.",
  },
  {
    command: "tinte build --plugin",
    does: "Compiles the config into an Agent Plugin directory.",
  },
  {
    command: "tinte build --out <dir>",
    does: "Emits design.md and tokens.css as two loose files instead.",
  },
  {
    command: "tinte build --to <provider>",
    does: "Emits a theme artifact for one provider: vscode, zed, kitty, and six more.",
  },
  {
    command: "tinte build --to",
    does: "Lists every provider target available to build against.",
  },
  {
    command: "tinte lint <paths>",
    does: "Exits 1 on hex literals, functional color notation, and framework palette classes.",
  },
  {
    command: "bunx tinte <slug>",
    does: "Installs a theme into VS Code, Cursor, or Zed.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Read a site you already trust",
    body: "Point the extractor at a page that is already on-brand. It records computed styles, not opinions, and normalizes them into thirteen semantic tokens.",
    snippet: EXTRACT_SNIPPET,
  },
  {
    n: "02",
    title: "Compile the identity into a plugin",
    body: "The compiler emits a token file an agent reads as an API and a SKILL.md that carries the type scale, the voice, and the composition law.",
    snippet: BUILD_SNIPPET,
  },
  {
    n: "03",
    title: "Fail the build on off-palette color",
    body: "The linter reads the same config and names each defect by kind next to the token that replaces it. A color that bypasses the system is caught by the build, not by a reviewer who happens to notice. This page is linted the same way.",
    snippet: LINT_SNIPPET,
  },
];

export default function Home() {
  return (
    <div className="home dark min-h-screen flex flex-col font-sans">
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-sm focus-visible:bg-foreground focus-visible:px-4 focus-visible:py-2 focus-visible:text-background"
      >
        Skip to content
      </a>

      <ShikiTokenStyle />

      <header className="mx-auto flex w-full max-w-5xl items-center gap-2.5 px-6 pt-8">
        <InvertedLogo size={22} />
        <span className="font-mono text-[13px] font-medium tracking-tight">
          tinte
        </span>
      </header>

      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-6">
        <section className="grid gap-x-10 gap-y-10 pt-24 pb-20 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-center">
          <div className="min-w-0">
            <h1 className="text-[2.5rem] font-medium leading-[1.05] tracking-tight text-balance sm:text-[3.5rem]">
              Compile your design system into an Agent Plugin
            </h1>
            <p className="mt-6 max-w-[34ch] text-base leading-relaxed text-muted-foreground">
              A coding agent writes on-brand UI when it can read your tokens as
              an API and your composition rules as instructions. Tinte emits
              both as one installable artifact, and compiles the same identity
              into a theme for your editor and terminal.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <CopyCommand
                command={SKILL_INSTALL_COMMAND}
                label="Install the skill"
                variant="primary"
              />
              <CopyCommand
                command={CLI_INSTALL_COMMAND}
                label="Install the CLI"
                variant="secondary"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The first installs the skill into{" "}
              <code className="font-mono text-[13px]">.agents/skills/</code> for
              Claude Code, Codex, and Cursor. The second installs the compiler
              itself.{" "}
              <a
                href={siteConfig.links.github}
                className="underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Source on GitHub
              </a>
            </p>
          </div>

          <TerminalBlock
            snippet={BUILD_SNIPPET}
            label="tinte build --plugin output"
            className="p-6"
          />
        </section>

        <section className="border-t border-border pt-14 pb-4">
          <h2 className="text-2xl font-medium leading-tight tracking-tight">
            Three commands, one config
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
            Extraction, compilation, and enforcement read the same
            tinte.config.json. Nothing is restated by hand.
          </p>

          <ol className="mt-12 space-y-14">
            {STEPS.map(({ n, title, body, snippet }) => (
              <li
                key={n}
                className="grid gap-x-10 gap-y-5 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start"
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[13px] text-muted-foreground tabular-nums">
                      {n}
                    </span>
                    <h3 className="text-base font-medium tracking-tight">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
                <TerminalBlock
                  snippet={snippet}
                  label={`Step ${n}: ${title}`}
                  className="p-5"
                />
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 border-t border-border pt-14 pb-4">
          <h2 className="text-2xl font-medium leading-tight tracking-tight">
            The same identity, as a theme for humans
          </h2>
          <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-muted-foreground">
            A design system an agent can read is also a theme you can look at
            all day. One config compiles both ways:{" "}
            <code className="font-mono text-[13px]">--plugin</code> for the
            agent, <code className="font-mono text-[13px]">--to</code> for the
            editor and terminal you already use.
          </p>

          <div className="mt-10 grid gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
            <div className="min-w-0">
              <h3 className="text-base font-medium tracking-tight">
                Nine targets, one command
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Each target is a provider that converts the thirteen tokens into
                that tool's own format. The VS Code artifact is accepted by the
                classic installer, so the theme lands in your editor without a
                marketplace round trip.
              </p>
              <dl className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
                {THEME_TARGETS.map(({ id, does }) => (
                  <div key={id} className="contents">
                    {/* Target ids are values, not commands, so they stay in
                        foreground rather than taking the command color. */}
                    <dt className="min-w-0 font-mono text-[13px] leading-[1.7]">
                      {id}
                    </dt>
                    <dd className="min-w-0 text-sm leading-[1.7] text-muted-foreground">
                      {does}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <TerminalBlock
              snippet={THEME_SNIPPET}
              label="Reference to installed theme"
              className="p-5"
            />
          </div>
        </section>

        <section className="mt-20 border-t border-border py-14">
          <h2 className="text-2xl font-medium leading-tight tracking-tight">
            Every command
          </h2>
          <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
            {COMMANDS.map(({ command, does }) => (
              <div key={command} className="contents">
                <dt className="min-w-0 font-mono text-[13px] leading-[1.7]">
                  <CommandLine command={command} />
                </dt>
                <dd className="min-w-0 text-base leading-relaxed text-muted-foreground">
                  {does}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-t border-border py-14">
          <h2 className="text-2xl font-medium leading-tight tracking-tight">
            This site serves its own design context
          </h2>
          <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-muted-foreground">
            The page you are reading is styled by the plugin tinte compiles from
            its own config. Every artifact is fetchable at its real path, so an
            agent can install this design system the same way it would install
            yours. The full plugin is served as an Agent Plugins 1.0.0 tree.
          </p>
          <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[13px]">
            {ARTIFACT_PATHS.map((path) => (
              <a
                key={path}
                href={path}
                className="underline underline-offset-4 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {path}
              </a>
            ))}
          </p>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-10 text-sm text-muted-foreground">
        <p>
          Looking for the theme workbench?{" "}
          <a
            href="/legacy"
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            It moved to /legacy
          </a>
        </p>
        <a
          href="https://vercel.com/oss"
          target="_blank"
          rel="noreferrer"
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://vercel.com/oss/program-badge.svg"
            alt="Vercel OSS Program"
            width={160}
            height={32}
          />
        </a>
      </footer>
    </div>
  );
}
