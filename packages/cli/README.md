<h3 align="center">
  <a href="https://tinte.dev" target="_blank">
    <img src="https://github.com/Railly/tinte/blob/main/apps/web/src/app/icon.svg" width="80" alt="Tinte Logo"/>
  </a>
  <br/>
  <span style="font-weight:600;font-size:20px;color:#2563EB;">tinte</span>
  <br/>
  <br/>
  <a href="https://vercel.com/oss" target="_blank">
    <img src="https://vercel.com/oss/program-badge.svg" alt="Vercel OSS Program"/>
  </a>
</h3>

<p align="center">
  Compile your design system into an Agent Plugin. Also the classic Tinte theme installer for VS Code, Cursor, and Zed.
</p>

## Install

```bash
bunx tinte <command>
```

No install step required. For a global binary:

```bash
bun add -g tinte
```

## Quickstart

### Compile an identity into an Agent Plugin

Reads `./tinte.config.json` (a Tinte identity) and emits a plugin directory a coding agent can load.

```bash
bunx tinte build --plugin
```

Writes `plugin.json`, `skills/<name>-design/SKILL.md`, and `skills/<name>-design/references/tokens.css`.

Without `--plugin` it emits the two loose artifacts instead:

```bash
bunx tinte build
```

Writes `design.md` and `tokens.css`.

Flags: `--config <path>` (default `./tinte.config.json`), `--out <dir>` (default `./<name>-plugin`).

### Lint what bypasses the token system

Scans source files for hardcoded colors that should be tokens. Exits `1` when violations are found, so it works as a CI gate.

```bash
bunx tinte lint
bunx tinte lint src/ app/
bunx tinte lint --json
```

### Extract an identity from a reference

Two steps. First print the browser extraction script, run it against a live page with [agent-browser](https://github.com/vercel-labs/agent-browser) or any DOM evaluator, and save the result:

```bash
bunx tinte from --emit-script > extract.js
```

Then normalize the captured candidates into a draft identity:

```bash
bunx tinte from --normalize candidates.json --name acme --out tinte.config.json
```

Without `--out` the identity is printed to stdout.

### Export a theme file

Turns an identity into a real theme file for one of the 14 providers. Reads the same `tinte.config.json` the compiler uses.

```bash
bunx tinte export --list                          # see every provider
bunx tinte export --provider vscode --out themes/ # write themes/vscode-theme.json
bunx tinte export --provider zed --json           # print to stdout
```

Providers span editors (VS Code, Zed, Shiki, Codex), terminals (Kitty, Alacritty, Warp, Windows Terminal), UI (shadcn/ui), and design tools (GIMP).

Flags: `--config <path>` (default `./tinte.config.json`), `--out <dir>`, `--out-file <path>` for an exact filename, `--json` to print instead of write.

Exits `1` on an unknown provider or an unreadable config, so it works as a CI step. A repo can regenerate its themes on every build and diff the result:

```bash
tinte export --provider vscode --out themes/
git diff --exit-code themes/
```

### Install a theme into your editor

The classic installer. Accepts a theme slug, a URL, or a local JSON file.

```bash
bunx tinte flexoki-theme                # VS Code (default)
bunx tinte flexoki-theme --cursor       # Cursor
bunx tinte flexoki-theme --zed          # Zed
bunx tinte flexoki-theme --light        # light variant (default: dark)
bunx tinte https://tinte.dev/api/themes/slug/flexoki-theme
bunx tinte ./my-theme.json --zed
```

Other flags: `--close` auto-closes the editor after install, `--timeout=<ms>` sets the delay (default `3000`).

Housekeeping:

```bash
bunx tinte list       # list installed Tinte themes
bunx tinte cleanup    # remove temporary theme files
```

## For agents

There is an official Tinte skill. Install it into your project:

```bash
npx skills add Railly/tinte
```

This installs the `tinte` skill (and `ray`, the preview companion) into `.agents/skills/`, readable by Claude Code, Codex, Cursor, and other agent runtimes.

The same skill is served over HTTP at [tinte.dev/api/skill](https://tinte.dev/api/skill).

For an example of what `tinte build` produces, see [tinte.dev/design.md](https://tinte.dev/design.md) - the design system of tinte.dev itself, compiled by this CLI.

## Links

- Repository: [github.com/Railly/tinte](https://github.com/Railly/tinte)
- Site: [tinte.dev](https://tinte.dev)

## License

MIT
