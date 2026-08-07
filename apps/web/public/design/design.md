---
name: tinte-landing
description: "Design or substantially improve a landing page for tinte. Use when building a marketing site, hero section, product page, pricing page, or any page whose job is to make a first-time visitor understand and want the product. Carries tinte composition rules, type scale, voice, and token API."
---

# Design a landing page like tinte

Act as an excellent designer, editor, and design engineer working on tinte's
own marketing surface. Shape the argument and the interface together. Do not restyle a
feature list into components.

Eighty percent of visitors never scroll past the first viewport. If they do not
understand what this is and want it within seconds, nothing below matters.

## Priority order

When requirements compete, protect them in this order:

1. Preserve supplied facts, numbers, names, claims, pricing, and task constraints.
2. Preserve the caller's framework, routes, file structure, and existing token foundation.
3. Make the visitor's problem, the product's one job, and the proof immediately clear.
4. Establish unmistakable tinte authorship through the token foundation, type
   scale, and restraint.
5. Choose a composition specific to this product; avoid both generic model defaults and
   a fixed landing template.
6. Refine responsive behavior, interaction, and detail without weakening the hierarchy.

Ask one grouped set of questions only when proceeding could change a price, a claim, a
guarantee, a legal or security statement, a customer name, or a call to action.
Otherwise omit the unknown, label it honestly, and proceed.

## Identity injection

This section is the only part of this skill that varies by project. Everything else is
fixed archetype law.

### Token foundation

Load `./references/tokens.css` once at the nearest shared page boundary. Use its public token
API for every color, radius, spacing step, and type role. Never read the stylesheet
implementation into context, never inline a translated copy of the token system, never
emit a `file://` URL, an unresolved path, or a CSS `@import`.

Every color in the output resolves to a token from that file. A hardcoded hex, an
`rgb()` literal, or a Tailwind palette class (`bg-blue-500`, `text-slate-400`) is a
defect, not a shortcut. If no token fits, the composition is wrong — change the
composition, not the palette.

The primary action style is an inverted foreground/background pair, not a hue. Do not introduce an accent color for CTAs.

### Type scale

Six roles only: display 48/1.05 500 · title 30/1.15 500 · heading 20/1.3 500 · body 16/1.6 400 · label 13/1.4 500 · mono 13/1.6 400. Sans: Geist. Mono: Geist Mono. No other sizes or weights exist.

Use only these roles. Do not create arbitrary font sizes or numeric weights. Equivalent
peers always share role, size, weight, line-height, and numeric treatment. Never resize
one peer because its string is longer or its number is larger.

### Voice

Write in these words: compile, token, plugin, deterministic, on-brand, artifact

Write every headline so a fifth grader gets it. Prefer concrete nouns and active verbs.
Numbers, not adjectives: "renders in 40ms", not "blazingly fast". No weak quantifiers
("most", "many", "rarely", "up to"). Second person. Sentence case unless
Show the emitted artifact. The plugin directory and the token file are the proof, so never describe an output you could print; Name the three commands with their real flags. Never paraphrase a command into prose; The primary action installs or builds something. Never write Get Started or Learn More; Stay monochrome. The accent is reserved for code syntax, never for a CTA fill says otherwise.

Write copy only this company could write. If a competitor could paste this page onto
their own domain and change one word, it is too generic — rewrite from what this product
actually does.

### Brand-specific rules

- Show the emitted artifact. The plugin directory and the token file are the proof, so never describe an output you could print.
- Name the three commands with their real flags. Never paraphrase a command into prose.
- The primary action installs or builds something. Never write Get Started or Learn More.
- Stay monochrome. The accent is reserved for code syntax, never for a CTA fill.

These override the archetype defaults below when they conflict, and only then.

## Composition law (fixed — does not vary by brand)

### Frame the visitor's job

Before designing, privately establish:

- Who arrives here, from where, in what state of ignorance?
- What is the one thing this product does?
- What pain does the visitor already feel that this removes?
- What proof makes the claim credible — a number, a demo, a named customer, a repo?
- What is the single next step?

Support two reading speeds. The **skim path** — headline, subhead, one visual proof, one
CTA — must carry the whole argument alone. The **evaluation path** — specifics, pricing,
comparison, docs, objections — preserves the detail for the visitor who is actually
deciding.

Every section answers a new visitor question. Merge duplicates. Remove ceremony. One
claim has one home: a later section may add specificity, but a second card grid,
summary, or closing block must not restate the same claim at equal prominence.

### Choose the composition

The first viewport is the argument, not a masthead followed by setup. Before designing,
privately name the obvious layout this product category would suggest — then reject it
unless the material earns it.

When the material admits multiple structures, privately compare two materially different
composition hypotheses before writing code. Change topology, density, and proof
placement, not merely palette or component choice.

Match the opening to what the product is:

- **A tool with a visible result** — show the result. The artifact it produces is the
  hero. Do not describe an output you could display.
- **A tool whose value is speed or removal of work** — show the before/after, or the
  command, at full size.
- **Infrastructure or a primitive** — lead with the one-line integration, real code,
  correct syntax. The snippet is the hero.
- **A product with no demonstrable surface** — lead with the strongest specific claim
  plus its proof. Never invent a hero visual to fill the space.

Choose geometry before components. Map the argument to a visual variable:

- Comparison against an alternative → aligned rows or deliberately contrasted columns on
  one shared basis.
- A sequence or workflow → connection and order.
- Magnitude of the improvement → position or length on a common scale.
- One decisive number → a single figure at display size, not a row of stat boxes.
- A capability set → a table or a dense list; not a 3×2 icon-card grid.

Compose the page as a field, not a stack of sections. One page-level throughline. One
focal object per reading moment, surrounded by a small number of supporting objects and
enough open space to amplify it. Pace the scroll: vary density and quiet while holding
one visual grammar. Repetition creates rhythm only when the repeated items are true
peers; otherwise it is template noise.

Give the page one organizing move that belongs to this product and could not be
transplanted unchanged onto a competitor's site. It may be a comparison geometry, a live
demo, a specific diagram, an unusual proof, or the interaction itself. It must clarify,
not decorate.

### Hierarchy and geometry

Every object aligns to a shared edge, baseline, grid line, or deliberate optical center.
Equivalent blocks share type roles, value positions, internal rows, and action alignment.

Establish hierarchy through typography and space before surfaces or color. Earn a
border, card, or background only when it communicates grouping, selection, or state that
spacing cannot express. Prefer spacing, alignment, and a change in density first.

Vertical rhythm is relational, not uniform:

- Heading → its first paragraph: close.
- Paragraph → paragraph: one body rhythm.
- Label → value → detail: identical across peers.
- Content group → new section: clearly larger.
- Caption → the thing it qualifies: close enough to read together.

Give every gap one owner. A flow, stack, or grid sets the gap; its children do not add
competing default margins.

Open space must amplify the focal object. Large empty rectangles caused by an underfilled
split, an orphaned third item, or a delayed proof are layout failures — reflow or
rebalance them. Do not force materially unequal claims into equal cells: rank them, group
them, or give the decisive one more visual consequence so the geometry matches the
argument.

Keep prose near 60–68 characters per line. Keep body text at a comfortable reading size.
Never use tiny gray copy to fit more in. Rewrite before shrinking. Fix stranded words in
large headings by improving the copy or the measure, not by shrinking one element.

### Density

A landing page is not a slide deck. Sections should differ in density on purpose: a dense
proof block earns the quiet that follows it. If every section is one heading, two lines of
copy, and three cards at equal weight, the page has no argument — it has a rhythm loop.

Full-viewport sections are a choice, not a default. Do not set `min-h-screen` on every
band. Content decides height.

### Color and surfaces

Design in the token palette, mostly monochrome. Color carries meaning: state, action, or
data. One accent owns the primary action. Do not color something merely because it is
important or favorable.

The page is normally one continuous canvas. Do not wrap every section in a card. Do not
nest panels. Keep radii consistent with the token foundation.

Light and dark are both first-class if the token file defines both. No visible theme
switcher unless the product's audience expects one.

Diagnose quantity separately from intensity. If it feels busy, remove or combine content.
If it feels loud, reduce competing color, scale, weight, borders, surfaces, and motion.
Restraint must not flatten the page into neutral sameness — preserve one deliberate
anchor.

### Motion and media

Default to stillness. Add motion only when it explains a state change, preserves
continuity, or confirms an action. Never reveal every section on scroll, never gate
reading behind animation, never add parallax, bounce, cinematic transitions, marquees,
simulated typing cursors, or pulsing status dots. Respect `prefers-reduced-motion`. The
page must be complete without motion.

Use real screenshots, real diagrams, real customer logos. Never stock imagery, generated
illustrations, abstract 3D shapes, floating gradient orbs, fake dashboards, or a
mandatory hero image. Icons are labels, not decoration — no icon tiles, no oversized
icons, no mixed icon styles.

### Conversion structure

- **One primary CTA.** Every extra button creates hesitation. A secondary link may exist
  (docs, repo, pricing) but it must be visually subordinate.
- **The CTA says what happens next.** "Start monitoring" or "Install the CLI", never "Get
  Started", "Learn More", or "Try it now".
- **Pricing is reachable from the first viewport** if the product is paid. Visitors read
  pricing to understand the product, not only its cost.
- **Proof appears before the second CTA.** Named customers, real numbers, a working demo,
  or a repo with real stars. A page with zero proof asks strangers to trust blindly.
- **Compare to the real alternative** when a visitor is obviously switching from
  something. One honest table on the axes they care about.
- **The footer is the last thing they see.** Finish it deliberately.

### Accessibility (non-negotiable)

- One descriptive `h1`; ordered headings with no skipped levels; landmarks; skip link.
- Every interactive element is a real `<button>` or `<a>` — never a `<div onClick>`.
- Visible `:focus-visible` state on everything focusable. Never `outline: none` without a
  replacement.
- Icon-only buttons carry `aria-label`; decorative icons carry `aria-hidden="true"`.
- Images carry `alt` (or `alt=""` when decorative) and explicit `width`/`height`.
- Contrast meets WCAG AA. Never encode meaning by color alone.
- Touch targets ≥ 44×44px. `touch-action: manipulation`.
- Forms: real `<label>`, correct `type`, `autocomplete`, inline errors, never block paste.
- Source order is reading order. Flex and grid children get `min-width: 0`.

### Typographic detail

`…` not `...`. Curly quotes. Non-breaking spaces in `10 MB`, `⌘ K`, and brand names.
`text-wrap: balance` on headings. `tabular-nums` only where numbers align vertically —
never on a large standalone figure. No em dashes.

## Reject these generated-design reflexes

Do not ship any of these. Each is a recognizable AI-output tell:

- A centered hero with an eyebrow pill, a two-line headline, a gray subheading, and two
  buttons side by side.
- A gradient headline, gradient background, gradient border, glow, blob, mesh, aurora,
  animated grid, dot grid, radial spotlight, glass panel, or noise texture.
- An all-caps tracked eyebrow, kicker, or overline above a heading.
- A pill or badge announcing "New", "v2.0", "Backed by X", or "AI-powered" above the
  headline.
- A 3×2 grid of feature cards, each with an icon in a rounded tinted square, a
  three-word title, and one sentence of filler.
- Emoji used as bullets, section markers, or feature icons.
- Em dashes.
- A row of three or more stat boxes when one composed relationship would be clearer.
- Cards nested inside cards, or borders used to repair weak hierarchy.
- Fabricated testimonials, invented customer logos, made-up star counts, or placeholder
  avatars presented as real people.
- "Trusted by teams at" above logos the product does not actually have.
- `min-h-screen` on every section, producing identical silhouettes down the page.
- Repeated "Ready to get started?" closing sections that restate the hero.
- Every section entering with a fade-up on scroll.
- Copy that could belong to any product in the category: "Built for modern teams",
  "Scale with confidence", "Everything you need", "The all-in-one platform".
- Tiny muted body copy, arbitrary font sizes, inconsistent peer values, misaligned
  baselines.
- Icons as decoration, oversized icons, or mixed icon families.
- A dark rounded rectangle around every visual.

Do not compensate by producing a sterile anti-design template. Restraint is precise
hierarchy, excellent typography, real proof, strong alignment, and deliberate tension. It
is not black text, white background, thin rules, and large empty margins.

## Final checks

Render the actual result before calling it done. Inspect the first viewport, the full
page, and both themes if the tokens define both. Verify responsive reflow.

1. **Squint test.** Blur the page. The dominant claim and the primary action must still
   be obvious, and the reading path stable. If every block has equal weight, redesign
   before refining.
2. **Text-mask test.** Replace every string with gray bars. The hierarchy must still
   communicate identity, emphasis, grouping, and progression. If the page becomes an
   undifferentiated stack of equal rectangles, the typography is doing no work.
3. **Transplant test.** Could this page be a competitor's with one word changed? If yes,
   the organizing move is missing.
4. **Token audit.** Grep the output for hex literals, `rgb(`, `hsl(`, and framework
   palette classes. Every hit is a defect.
5. **Restraint pass.** Can any surface, border, pill, icon, label, paragraph, or section
   be removed without losing meaning, affordance, or rhythm? If yes, remove it.
6. **Access pass.** Headings ordered, focus visible, labels present, contrast met,
   reflow clean, keyboard path complete.

Fix the highest-impact systemic defect, render again, repeat. Keep this work internal —
deliver the implementation, not a score, a critique, or a process diary.
