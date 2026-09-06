# Rebuild adamr.io on Capsule

You are a coding agent working in the `msradam/adamr.io` repository — an Astro 6
static site, Tailwind 4 via the Vite plugin, TypeScript, Markdown content
collections, Pagefind search.

**This is a redesign, not a re-theme.** The site currently ships **Lokta**, a
different design system, at `src/styles/lokta/` with its own component classes
(`.lk-*`) and a large layer of page CSS in `src/styles/global.css`. Your job is
to rebuild the site's pages on **Capsule** — new page structure, new hierarchy,
new register — using the files in `templates/` as the specification.

## Read this first: how this task was failed once already

A previous attempt swapped Capsule's token file in, left every component and
page layout untouched, and stopped. The result rendered in Capsule's colours
and fonts and was otherwise the same site. **That is a failed attempt.** The
token compatibility exists only so the first commit does not break the build
while you work — it is scaffolding, not the deliverable.

You have **not** done this task if, at the end:

- `src/styles/lokta/` still exists, or any `.lk-*` class remains in the repo.
- `src/styles/global.css` is roughly the same size as it started. It should
  lose most of its component classes; the ones the templates replace are dead.
- Any page's DOM structure is unchanged from `master` apart from class names.
- Before/after screenshots of a page differ only in colour and typeface.
- The credential strip is still four boxed cells, the contact strip is still a
  coloured panel, the TOC is still a `<details>` disclosure, project pages
  still have a left-accent-bordered sidecar, or the wordmark still blinks.

If any of those are true, the work is not finished. Keep going.

## The specification

`templates/` holds eight Astro files written against Capsule roles and this
repo's real collection schemas. **The templates win.** Where a template's
structure, hierarchy, or copy register disagrees with the existing page, the
template is correct and the existing page changes. That is the point of the
exercise.

They are not pixel mandates — adapt them to the real components, real data, and
real routes. But their *shape* is the deliverable: what elements exist, what
order they sit in, what is set in which face, and how loud the page is.

If a template genuinely cannot work for a route, write down why in
`docs/ADAMR-IO-MAPPING.md` under Open items and pick the closest Capsule
pattern. Do not fall back to the old layout.

Read before starting, in order: `docs/PRINCIPLES.md` (the grammar and the gate
behind each rule), `docs/MIGRATING-FROM-LOKTA.md` (what is compatible and what
changes), `docs/ADAMR-IO-MAPPING.md` (the file-by-file demolition and rebuild
list), `docs/STACKS.md` (the one interaction pattern), `docs/SLOP-AUDIT.md`
(patterns to avoid, several of which are live on the site today), and
`templates/README.md` (the quiet register).

Treat Capsule v1.0 as fixed: do not invent tokens, dials, or components. If a
surface needs something Capsule lacks, add it to Open items and stop rather
than improvising a value.

## Invariants

- No `box-shadow`, no blur, no gradient except `--pattern-hatch`.
- One line: 1px, `--border-hairline`. No 4px accent borders, no 0.5px hairlines.
- Surfaces radius 0. Pills only on chips, tags, toggles.
- No transition or animation over 180ms. Nothing loops, ever.
- Accent at full opacity. No `color-mix` alpha washes standing in for ink.
- Two stocks: `paper`, `slate`.
- The display voice is the serif (`--font-head`, Source Serif 4, 600). Archivo
  is chrome only, 400/500. Nothing is set in a grotesque above 600.
- Every interactive element: visible 2px focus ring, ≥44px touch target.
- No kicker above a heading, no decorative ordinals, no section counts.

## Steps

### 1. Vendor Capsule
Copy `tokens/`, `fonts/`, `css/`, `validate/` into `src/styles/capsule/`, and
`DESIGN.md` to the repo root. No external fetches, no Google Fonts.

### 2. Get the build green on the new tokens (scaffolding, ~30 minutes)
Replace the four Lokta `@import`s in `global.css` with `capsule/fonts/fonts.css`,
`capsule/tokens/capsule.tokens.css`, `capsule/tokens/lokta-compat.css`,
`capsule/css/capsule.components.css`. Run
`node src/styles/capsule/validate/verify.mjs` and `npm run build`.

This is the *starting line*, not the finish. Commit it and move on immediately.

### 3. Rebuild the pages
For each route below, rebuild the page against its template. Delete the CSS
that becomes dead as you go — do not leave it in place "just in case".

| Route | Template | Must be gone |
| --- | --- | --- |
| `/` | `index.astro` | `.cred-strip` / `.cred-cell` / `.cred-icon`, the featured card grid, row ordinals, `.contact-strip` and its marigold ground, `.social-row` icon squares, `.site-name .cursor` blink, `.wave-icon`, `.currently-line` prompt glyph |
| `/blog` | `writing-index.astro` | Per-section counts, `.ruled-row` hover fills, the number column |
| `/blog/[...id]` | `EssayLayout.astro` | The `<details>`/`summary` TOC disclosure (becomes a rail), `blockquote`'s 4px accent border, the hatched `.article-end` (becomes a 1px rule), `.read-progress` if it cannot be justified |
| `/dev` | rows, per `STACKS.md` ("a list, not a deck") | The fixed featured grid |
| `/dev/[id]` | `dev-detail.astro` | `.project-sidecar` (accent-bordered box → ruled `dl`), stack chips (→ text), the two filled buttons (→ text links) |
| `/photography`, `/theater` | `photography.astro` | Any grid of thumbnails with hover transforms |
| `/design` | rows or a stack, your call — record it | — |
| `/now` | `now.astro` | New route. Add it to the nav |
| `/cv` | `cv.astro` | — |
| `/links` | `links.astro` | The marigold contact panel |
| `/tags`, `/tags/[...id]` | rows + `.capsule-chip` | `.tag` background washes |
| `/poetry` | serif, quiet, `--measure` | — |

Also rebuild the shell: header nav in the label font with the active item as an
ink slab (not a colour change), footer in the label font, and the Pagefind
search input as `.capsule-field__input`.

### 4. Work the mapping list
`docs/ADAMR-IO-MAPPING.md` items 1–10 in order: retire the paper grain, the
theme-toggle glow, the three over-budget animations, the alpha-washed link
underlines, the 4px accent borders, the Shiki `--pigment-*` references. Narrow
`--measure` to `34rem`.

### 5. Two stocks
The toggle cycles four Lokta stocks. Make it a two-state `data-stock` control
(`paper` / `slate`). Keep the before-paint inline script, the `adamr-theme`
key, and the `astro:before-swap` re-apply; migrate a stored `bone` → `paper`
and `ink` / `indigo` → `slate`.

### 6. Delete Lokta
`rm -rf src/styles/lokta/`, then delete `capsule/tokens/lokta-compat.css`, then
fix what breaks by re-pointing to roles. Then grep: `lk-`, `--ink-`, `--paper-`,
`--pigment-`, `data-theme`, `lokta`. Zero hits outside `docs/`.

### 7. Gates
- `npm run lint`, `npm run format:check`
- `npm run build` (runs `astro check`) — zero errors, zero warnings
- `node src/styles/capsule/validate/verify.mjs`
- `node src/styles/capsule/validate/behavioral-gate.mjs`, and again with
  `CAPSULE_TARGET_URL` against `npm run preview` for `/`, an essay, a project,
  and the photography archive
- `npx impeccable detect src/` — fix findings or record them in
  `docs/SLOP-AUDIT.md` with a reason; never silently accept one

Fix regressions by fixing the code, never by loosening a gate.

### 8. Prove the redesign
Capture before-and-after at 390px and 1280px in both stocks into
`docs/design-review/capsule/`, covering `/`, an essay, a project detail, the
photography archive, and the CV. Then write
`docs/design-review/capsule/README.md`: for each page, one sentence on what
structurally changed. If a sentence reads "new colours and fonts", go back to
step 3 for that page.

## Definition of done

- Every route above is rebuilt against its template; no page is only re-themed.
- `src/styles/lokta/` and `lokta-compat.css` are deleted and the greps in step 6
  are clean.
- `global.css` has shrunk substantially and holds no class the templates replace.
- Every invariant holds; every gate passes on every route.
- The stock toggle has two honest states and migrates stored preferences.
- Content, routing, RSS, sitemap, JSON-LD, and Pagefind behave exactly as
  before. **Content is preserved; presentation is not.**
- The before/after review reads like two different sites.
