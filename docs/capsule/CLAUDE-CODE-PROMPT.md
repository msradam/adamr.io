# Implement Capsule on adamr.io

You are a coding agent working in the `msradam/adamr.io` repository — an Astro 6
static site, Tailwind 4 via the Vite plugin, TypeScript, content in Markdown
collections, Pagefind search. It currently ships **Lokta**, the author's own
design system, vendored at `src/styles/lokta/`.

This task **fully replaces** Lokta with **Capsule**, its e-ink successor.
Lokta is retired in this pull request — not run alongside. It is a
presentation-layer change: you swap the token layer, retire a short list of
rules that Capsule bans, and add the device grammar. **You do not restructure
the site, change routing, touch the content collections, or rewrite components
that only need new values.**

The handoff is the folder this prompt shipped in: `tokens/`, `fonts/`, `css/`,
`validate/`, `proof/`, `specimens/`, `docs/`, `templates/`. Read
`docs/MIGRATING-FROM-LOKTA.md`, `docs/ADAMR-IO-MAPPING.md`, and
`docs/PRINCIPLES.md` before you start, plus `docs/SLOP-AUDIT.md` for the
generated-UI patterns this system is audited against — several of them are live
on the site today. Treat Capsule v1.0 as fixed: do not
invent tokens, dials, or components. If a surface needs something Capsule
lacks, add it to the Open items list in `docs/ADAMR-IO-MAPPING.md` and stop,
rather than improvising a value.

## Invariants

Read `docs/PRINCIPLES.md` for the full grammar with the gate that enforces each
rule. The ones this migration breaks most often:

- No `box-shadow`, no blur, no gradient. The only sanctioned gradient in the
  codebase is `--pattern-hatch`.
- One line: 1px, `--border-hairline`. No 4px accent borders, no 0.5px hairlines.
- Surfaces radius 0. Pills only on chips, tags, toggles.
- No transition or animation over 180ms. Nothing loops.
- Accent at full opacity. No `color-mix` alpha washes standing in for ink.
- Two stocks only: `paper`, `slate`.
- The display voice is the serif: headings are `--font-head` (Source Serif 4)
  at `--font-weight-display`. Archivo is chrome only, 400/500. Nothing on the
  site is set in a grotesque above 600.
- Every interactive element: visible 2px focus ring, ≥44px touch target.

## Steps

### 1. Vendor the system
Copy `tokens/`, `fonts/`, `css/`, and `validate/` into `src/styles/capsule/`
(fonts to `src/styles/capsule/fonts/`). No external fetches, no Google Fonts.
Do **not** delete `src/styles/lokta/` yet — it comes out in step 6.

### 2. Swap the token layer
In `src/styles/global.css`, replace the four Lokta `@import`s with, in order:
`capsule/fonts/fonts.css`, `capsule/tokens/capsule.tokens.css`,
`capsule/tokens/lokta-compat.css`, `capsule/css/capsule.components.css`.
Leave the `@theme` block and the bridge aliases alone for now: they resolve to
semantic names Capsule ships, which is the whole point.

Run `node src/styles/capsule/validate/verify.mjs` and `npm run build`. Both
should pass **before you change a single component**. That is the proof the
swap is source-compatible.

### 3. Work the mapping list
`docs/ADAMR-IO-MAPPING.md` items 1–9, in order. They are specific: retire the
grain, turn the marigold contact strip into the ink slab, de-glow the theme
toggle, bring three animations inside the motion budget, un-alpha the link
underlines, replace the 4px accent borders, re-point the Shiki tokens, keep the
type scale and the reading measure as they are.

### 4. Add the device grammar
Only where `docs/ADAMR-IO-MAPPING.md` calls for it: the TOC becomes a rail, the
photography and theater archives become stacks (`docs/STACKS.md` is the spec —
including the keyboard map and the ARIA structure the gate asserts), the
colophon end-mark becomes the hatch, tags become chips.

### 5. Two stocks
The theme toggle cycles four Lokta stocks. Make it a two-state control over
`data-stock` (`paper` / `slate`). Keep the existing before-paint inline script,
the `localStorage` key `adamr-theme`, and the `astro:before-swap` re-apply —
add a migration that maps a stored `bone` to `paper` and `ink`/`indigo` to
`slate`. No reader should land on an unstyled page or lose their preference.

### 6. Remove Lokta (in this same PR)
Delete `src/styles/lokta/`, then `capsule/tokens/lokta-compat.css`, then fix
what breaks by re-pointing to roles. Also delete the `data-theme` aliases once
the toggle is on `data-stock`. Do not leave two systems live, and do not defer
this step to a follow-up — the swap is the deliverable. If a
reference cannot be re-pointed without inventing a value, record it as an open
item.

### 7. Templates
`templates/` holds Astro starting points for the pages the author asked for —
home, writing index, essay, project detail, now, photography, CV, links. They
are written against Capsule roles and the repo's real collection schemas. Use
them as reference or as a starting file; adapt them to the existing components
rather than replacing working pages wholesale. Where a template disagrees with
an existing page's information architecture, the existing page wins — the
templates are about style, not sitemap.

### 8. Gates
All of these must pass:
- `npm run lint`, `npm run format:check`
- `npm run build` (which runs `astro check`) with zero errors and zero warnings
- `node src/styles/capsule/validate/verify.mjs`
- `npx impeccable detect src/` — copy `DESIGN.md` to the repo root first so
  the personalized font / color / radius / size rules resolve against Capsule.
  Fix what it finds or record it in `docs/SLOP-AUDIT.md` with a reason; do not
  silently accept a finding.
- `node src/styles/capsule/validate/behavioral-gate.mjs`, and again with
  `CAPSULE_TARGET_URL` pointed at `npm run preview` for `/`, an essay, a
  project, and the photography archive

Fix regressions by fixing the code, never by loosening a gate.

### 9. Screenshots
Capture before-and-after at 390px and 1280px in both stocks into
`docs/design-review/capsule/`. Cover home, an essay, a project detail, the
photography archive, and the CV.

## Definition of done

- Capsule tokens and components are live; `src/styles/lokta/` is gone and
  `lokta-compat.css` is deleted.
- Every invariant above holds, and every gate passes on every route.
- The stock toggle has two honest states and migrates stored preferences.
- Content, routing, RSS, sitemap, JSON-LD, and Pagefind behave exactly as
  before. This was a re-skin.
- Anything you could not do without inventing a value is written down as an
  open item, not guessed.
