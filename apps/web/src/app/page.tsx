import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Compile your design system into an Agent Plugin",
  description:
    "Tinte compiles a design system into an Agent Plugin: a token file coding agents read as an API, plus the composition rules that keep generated UI on-brand.",
  alternates: { canonical: siteConfig.url },
};

const BUILD_SNIPPET = `$ tinte build --plugin

acme-plugin/
├── plugin.json
└── skills/
    └── acme-design/
        ├── SKILL.md
        └── references/
            └── tokens.css`;

const COMMANDS = [
  {
    command: "tinte from <url>",
    does: "Reads a live site and derives a token graph from its computed styles.",
  },
  {
    command: "tinte build --plugin",
    does: "Compiles that graph into an Agent Plugin directory.",
  },
  {
    command: "tinte lint <paths>",
    does: "Fails the build on hex literals and off-palette classes.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-foreground focus-visible:px-4 focus-visible:py-2 focus-visible:text-background"
      >
        Skip to content
      </a>

      <header className="mx-auto w-full max-w-4xl px-6 pt-8">
        <span className="font-mono text-sm font-medium">tinte</span>
      </header>

      <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-6">
        <section className="pt-20 pb-16">
          <h1 className="max-w-2xl text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Compile your design system into an Agent Plugin
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            A coding agent writes on-brand UI when it can read your tokens as an
            API and your composition rules as instructions. Tinte emits both as
            one installable artifact.
          </p>

          <pre className="mt-10 overflow-x-auto rounded-lg border border-border bg-card p-6 font-mono text-[13px] leading-relaxed">
            <code>{BUILD_SNIPPET}</code>
          </pre>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="https://www.npmjs.com/package/@tinte/cli"
              className="rounded-md bg-primary px-4 py-2.5 font-mono text-sm text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{ touchAction: "manipulation" }}
            >
              bunx tinte
            </a>
            <a
              href={siteConfig.links.github}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Source on GitHub
            </a>
          </div>
        </section>

        <section className="border-t border-border py-14">
          <h2 className="text-xl font-medium tracking-tight">Three commands</h2>
          <dl className="mt-8 grid gap-y-6 sm:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] sm:gap-x-10">
            {COMMANDS.map(({ command, does }) => (
              <div key={command} className="contents">
                <dt className="min-w-0 font-mono text-[13px] text-foreground">
                  {command}
                </dt>
                <dd className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                  {does}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-t border-border py-14">
          <h2 className="text-xl font-medium tracking-tight">
            Tinte runs on its own output
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            This site is styled by the plugin tinte compiles from its own
            config. The same two files an agent would install are served here.
          </p>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[13px]">
            <a
              href="/design.md"
              className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              /design.md
            </a>
            <a
              href="/tokens.css"
              className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              /tokens.css
            </a>
          </p>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-4xl px-6 py-10 text-sm text-muted-foreground">
        <p>
          Looking for the theme workbench?{" "}
          <a
            href="/legacy"
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            It moved to /legacy
          </a>
        </p>
      </footer>
    </div>
  );
}
