# Tinte - Theme Converter & Generator

A Next.js application for converting themes between Rayso, TweakCN, VS Code, shadcn/ui, and 8+ other formats with live previews.

## What It Does

- Convert between theme formats (Rayso ↔ TweakCN ↔ VS Code ↔ shadcn/ui)
- Generate semantic color palettes using OKLCH color space
- Live theme editing with real-time preview
- Export themes for editors, terminals, and design tools
- Universal theme previews for all supported providers

## Tech Stack

- **Next.js 14** with TypeScript and App Router
- **Tailwind CSS + shadcn/ui** for UI components
- **Culori** for OKLCH color manipulation
- **Shiki + Monaco Editor** for syntax highlighting
- **Zustand + nuqs** for state management
- **React Context** for theme state
- **Bun** for package management

## Architecture

### Key Directories

```
src/
├── app/                  # Pages (workbench, experiment, bingo, vscode)
├── providers/theme.tsx   # Single theme context provider
├── components/
│   ├── shared/          # Theme components (switcher, selector, editor)
│   ├── preview/         # Provider-specific previews (vscode, shadcn, terminals)
│   └── workbench/       # Workbench components
├── hooks/               # Custom hooks (theme, monaco, shiki, workbench)
├── stores/              # Zustand stores (workbench, export)
├── lib/                 # Conversion logic and providers registry
└── types/               # TypeScript definitions
```

### Color Philosophy - Flexoki-Inspired

**Continuous Scale**: `bg → bg-2 → ui → ui-2 → ui-3 → tx-3 → tx-2 → tx`

- Light mode: bg (lightest) → tx (darkest)
- Dark mode: bg (darkest) → tx (lightest)
- OKLCH color space for perceptual consistency

**Token Meanings**:

- `bg`/`bg-2`: Main/elevated surfaces
- `ui`/`ui-2`/`ui-3`: Borders, hover states, active states
- `tx-3`/`tx-2`/`tx`: Faint, muted, primary text
- `primary`/`accent`/`secondary`: Functional colors

## State Management

### Theme System (Context Provider)

- Single `ThemeProvider` wraps entire app
- localStorage persistence with DOM updates
- Zero state desync between components
- Perfect SSR/hydration handling

### Workbench (Zustand + nuqs)

- **Zustand stores**: Server state (chatId, split, loading)
- **nuqs**: URL state (activeTab, provider) with automatic sync
- Zero prop drilling, zero useState/useEffect patterns
- Perfect browser navigation support

## Providers System

### Type-Safe Registry

- **ThemeProvider**: Basic conversion & export
- **PreviewableProvider**: Adds live preview component
- Registry-based with compile-time validation

### Supported Providers

**Editors**: shadcn/ui, VS Code
**Terminals**: Alacritty, Kitty, Warp, Windows Terminal
**Design Tools**: GIMP, Slack

All providers have rich visual previews using actual theme data.

## Development

### Commands

```bash
bun install      # Install dependencies
bun dev          # Start development server
bun build        # Production build
bun run lint     # Lint code
bun run type-check # TypeScript validation
```

### Key Pages

- `/workbench` - Main theme editor with live preview
- `/experiment` - Rayso → shadcn conversion testing
- `/bingo` - TweakCN → Rayso conversion testing
- `/vscode` - VS Code theme preview and export

## Architecture Highlights

### VS Code Preview (Optimized)

- Modular components: monaco-preview, shiki-preview, tokens-preview
- Custom hooks: use-monaco-editor, use-shiki-highlighter
- Version-based caching, 50ms transitions, zero theme conflicts

### Monaco + Shiki Integration

- Perfect consistency using `@shikijs/monaco`
- Identical theme structure between both systems
- Smart initialization, no disposal conflicts

### Provider Previews

- All previews use real converted theme data
- Dynamic light/dark mode switching
- Type-safe integration with provider outputs
- Performance optimized with memoization

## Code Style

- No comments unless requested
- Semantic naming following Flexoki philosophy
- Type safety throughout
- Modular architecture with single responsibility
- Custom hooks for complex logic
- Minimal useEffect usage

## Testing

### Theme Conversion

- Test all format conversions (Rayso ↔ TweakCN ↔ VS Code ↔ shadcn)
- Verify WCAG contrast ratios
- Test light/dark mode switching
- Export and install themes in target applications

### State Management

- URL synchronization with browser navigation
- Theme persistence across page refreshes
- Component isolation with global state access
- No infinite loops or circular dependencies

## Key Features

- **Live workbench**: Real-time editing with instant preview
- **Universal previews**: Rich visuals for all supported providers
- **Type-safe conversions**: Compile-time validation throughout
- **Performance optimized**: Smart caching, minimal re-renders
- **URL state sync**: Shareable URLs with preserved state
- **Provider status**: Clear indicators for available vs planned providers
- **Export functionality**: Download themes in multiple formats
- **Responsive design**: Works on mobile and desktop

Concise rules for building accessible, fast, delightful UIs Use MUST/SHOULD/NEVER to guide decisions

## Interactions

- Keyboard
  - MUST: Full keyboard support per [WAI-ARIA APG](https://wwww3org/WAI/ARIA/apg/patterns/)
  - MUST: Visible focus rings (`:focus-visible`; group with `:focus-within`)
  - MUST: Manage focus (trap, move, and return) per APG patterns
- Targets & input
  - MUST: Hit target ≥24px (mobile ≥44px) If visual <24px, expand hit area
  - MUST: Mobile `<input>` font-size ≥16px or set:
    ```html
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
    />
    ```
  - NEVER: Disable browser zoom
  - MUST: `touch-action: manipulation` to prevent double-tap zoom; set `-webkit-tap-highlight-color` to match design
- Inputs & forms (behavior)
  - MUST: Hydration-safe inputs (no lost focus/value)
  - NEVER: Block paste in `<input>/<textarea>`
  - MUST: Loading buttons show spinner and keep original label
  - MUST: Enter submits focused text input In `<textarea>`, ⌘/Ctrl+Enter submits; Enter adds newline
  - MUST: Keep submit enabled until request starts; then disable, show spinner, use idempotency key
  - MUST: Don’t block typing; accept free text and validate after
  - MUST: Allow submitting incomplete forms to surface validation
  - MUST: Errors inline next to fields; on submit, focus first error
  - MUST: `autocomplete` + meaningful `name`; correct `type` and `inputmode`
  - SHOULD: Disable spellcheck for emails/codes/usernames
  - SHOULD: Placeholders end with ellipsis and show example pattern (eg, `+1 (123) 456-7890`, `sk-012345…`)
  - MUST: Warn on unsaved changes before navigation
  - MUST: Compatible with password managers & 2FA; allow pasting one-time codes
  - MUST: Trim values to handle text expansion trailing spaces
  - MUST: No dead zones on checkboxes/radios; label+control share one generous hit target
- State & navigation
  - MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels) Prefer libs like [nuqs](https://nuqs.dev)
  - MUST: Back/Forward restores scroll
  - MUST: Links are links—use `<a>/<Link>` for navigation (support Cmd/Ctrl/middle-click)
- Feedback
  - SHOULD: Optimistic UI; reconcile on response; on failure show error and rollback or offer Undo
  - MUST: Confirm destructive actions or provide Undo window
  - MUST: Use polite `aria-live` for toasts/inline validation
  - SHOULD: Ellipsis (`…`) for options that open follow-ups (eg, “Rename…”)
- Touch/drag/scroll
  - MUST: Design forgiving interactions (generous targets, clear affordances; avoid finickiness)
  - MUST: Delay first tooltip in a group; subsequent peers no delay
  - MUST: Intentional `overscroll-behavior: contain` in modals/drawers
  - MUST: During drag, disable text selection and set `inert` on dragged element/containers
  - MUST: No “dead-looking” interactive zones—if it looks clickable, it is
- Autofocus
  - SHOULD: Autofocus on desktop when there’s a single primary input; rarely on mobile (to avoid layout shift)

## Animation

- MUST: Honor `prefers-reduced-motion` (provide reduced variant)
- SHOULD: Prefer CSS > Web Animations API > JS libraries
- MUST: Animate compositor-friendly props (`transform`, `opacity`); avoid layout/repaint props (`top/left/width/height`)
- SHOULD: Animate only to clarify cause/effect or add deliberate delight
- SHOULD: Choose easing to match the change (size/distance/trigger)
- MUST: Animations are interruptible and input-driven (avoid autoplay)
- MUST: Correct `transform-origin` (motion starts where it “physically” should)

## Layout

- SHOULD: Optical alignment; adjust by ±1px when perception beats geometry
- MUST: Deliberate alignment to grid/baseline/edges/optical centers—no accidental placement
- SHOULD: Balance icon/text lockups (stroke/weight/size/spacing/color)
- MUST: Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
- MUST: Respect safe areas (use env(safe-area-inset-\*))
- MUST: Avoid unwanted scrollbars; fix overflows

## Content & Accessibility

- SHOULD: Inline help first; tooltips last resort
- MUST: Skeletons mirror final content to avoid layout shift
- MUST: `<title>` matches current context
- MUST: No dead ends; always offer next step/recovery
- MUST: Design empty/sparse/dense/error states
- SHOULD: Curly quotes (“ ”); avoid widows/orphans
- MUST: Tabular numbers for comparisons (`font-variant-numeric: tabular-nums` or a mono like Geist Mono)
- MUST: Redundant status cues (not color-only); icons have text labels
- MUST: Don’t ship the schema—visuals may omit labels but accessible names still exist
- MUST: Use the ellipsis character `…` (not ``)
- MUST: `scroll-margin-top` on headings for anchored links; include a “Skip to content” link; hierarchical `<h1–h6>`
- MUST: Resilient to user-generated content (short/avg/very long)
- MUST: Locale-aware dates/times/numbers/currency
- MUST: Accurate names (`aria-label`), decorative elements `aria-hidden`, verify in the Accessibility Tree
- MUST: Icon-only buttons have descriptive `aria-label`
- MUST: Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA
- SHOULD: Right-clicking the nav logo surfaces brand assets
- MUST: Use non-breaking spaces to glue terms: `10&nbsp;MB`, `⌘&nbsp;+&nbsp;K`, `Vercel&nbsp;SDK`

## Performance

- SHOULD: Test iOS Low Power Mode and macOS Safari
- MUST: Measure reliably (disable extensions that skew runtime)
- MUST: Track and minimize re-renders (React DevTools/React Scan)
- MUST: Profile with CPU/network throttling
- MUST: Batch layout reads/writes; avoid unnecessary reflows/repaints
- MUST: Mutations (`POST/PATCH/DELETE`) target <500 ms
- SHOULD: Prefer uncontrolled inputs; make controlled loops cheap (keystroke cost)
- MUST: Virtualize large lists (eg, `virtua`)
- MUST: Preload only above-the-fold images; lazy-load the rest
- MUST: Prevent CLS from images (explicit dimensions or reserved space)

## Design

- SHOULD: Layered shadows (ambient + direct)
- SHOULD: Crisp edges via semi-transparent borders + shadows
- SHOULD: Nested radii: child ≤ parent; concentric
- SHOULD: Hue consistency: tint borders/shadows/text toward bg hue
- MUST: Accessible charts (color-blind-friendly palettes)
- MUST: Meet contrast—prefer [APCA](https://apcacontrastcom/) over WCAG 2
- MUST: Increase contrast on `:hover/:active/:focus`
- SHOULD: Match browser UI to bg
- SHOULD: Avoid gradient banding (use masks when needed)
