# Capsule on adamr.io — the mapping

Grounded in `msradam/adamr.io@master`: `src/styles/global.css`,
`src/styles/lokta/*`, `src/consts.ts`, `src/content.config.ts`. Every path and
selector below exists in the repo today.

**Read this as a demolition list.** Adopting Capsule means rebuilding the
pages, not re-pointing the values — the token compatibility below exists so
the build stays green while that happens, and nothing more. A migration that
ends with Lokta's markup wearing Capsule's colours has failed. The page
specifications are in `templates/`; `CLAUDE-CODE-PROMPT.md` §3 has the
per-route list of what must be gone.

## The site's bridge holds while you work

`global.css` authors the whole site against short aliases that resolve to
Lokta's semantic layer. Capsule ships every one of those semantic names, so the
alias block keeps resolving — which buys you a green build on day one, not a
finished migration. The aliases survive; most of the component CSS beneath them
does not:

`--bg` `--bg-alt` `--bg-3` `--doc-bg` `--text` `--text-2` `--rule`
`--rule-strong` `--accent-contrast` → all fine.

Three need a decision, not a rename:

| Alias | Today | Change to | Why |
| --- | --- | --- | --- |
| `--accent` / `--accent-text` | `--accent-feature` (aubergine) | `--accent-ink` | Cyan-700 is Capsule's verified body-size accent (6.03:1). Aubergine stays available as `--accent-feature` for the rare feature panel. |
| `--hover` / `--tag-bg` | `color-mix(… 5–6%, transparent)` | `--state-hover` / `--surface-sunken` | Capsule has real sunken surfaces; an alpha wash of ink over paper is a tint, and tints are how e-ink looks muddy. |
| `--accent-wash` | `color-mix(… 14%, --surface-page)` | `--surface-sunken` | Same reason. The row hover becomes a paper change, not a colour change. |

## App-layer work list

Ordered by how visible the change is. Each item is a rule in `global.css`
unless noted.

### 1. Retire the grain — `body::before`
Three `radial-gradient` layers at 1.2–1.8% alpha, `mix-blend-mode: multiply`.
Capsule's only texture is the 1-bit hatch, and its only gradient is
`--pattern-hatch`. Delete the block and the `[data-grain]` knob. E-ink is flat;
simulated tooth on a screen is the thing Capsule is arguing against.

### 2. The contact strip — `.contact-strip`
Currently the one full marigold ground with dark ink text. Marigold retires:
make it `.capsule-slab` — `--surface-inverted` with `--text-on-fill` at
18.62:1. The buttons inside (`.contact-btn`, ink border, ink text) invert with
it: paper border, paper text, and on hover the fill and text swap. Drop
`--ink-90` / `--paper-00` for `--text-on-fill` / `--surface-inverted`.

### 3. The theme toggle — `.theme-toggle`
Two changes. The `::before` swatch carries a `box-shadow` glow on the light
stocks — elevation, banned; use the hatch or a plain 9px ink square instead.
And the control cycles four stocks; Capsule has two. Once it is a two-state
control, switch the attribute from `data-theme` to `data-stock` and drop the
compat selectors.

### 4. Motion — three places over budget
- `body { transition: background-color 0.3s, color 0.3s }` → `--beat` (180ms).
- `.site-name .cursor` blink, 1.1s infinite → delete. An infinite animation is
  the opposite of calm, and e-ink cannot render it.
- `.wave-icon`, 1.8s → delete, or fire once at `--beat`. Keep the existing
  `prefers-reduced-motion` block; extend it to cover anything that survives.
- `.read-progress-bar { transition: width 0.08s }` is under budget — keep.

### 5. Link underlines — `.content-link`, `.prose :where(a)`
Both underline with `color-mix(… --accent-text 45%, transparent)`. An
alpha-muted keyline is unverifiable and reads grey. Use the accent at full
opacity, 1px: `border-bottom: var(--rule-1) solid var(--accent-ink)`. The
persistent underline itself is right and stays (1.4.1).

### 6. Heavy keylines — `.prose blockquote`, `.callout`, `.project-sidecar`
All three use `border-left: var(--rule-3)` (4px) in the accent. One line means
1px. Replace the weight with a real device: the sidecar becomes
`.capsule-sheet--sunken`, the pull quote takes a 1px rule plus the reading
serif it already has, the callout takes a `.capsule-label` heading. A 4px
coloured left border is also the exact "rounded container with an accent bar"
trope Capsule exists to avoid.

### 7. Shiki code tokens — the `--astro-code-*` block
Reaches straight into `--pigment-*`, `--ink-60`, and one hard-coded `#9a6b00`.
`lokta-compat.css` keeps it resolving; then re-point each to a role and replace
the raw hex with `--accent-warning-fill`. Both stock blocks collapse into one
paper block and one slate block.

### 8. Type scale
`html { font-size: 18px }` with rem-anchored clamps is good and stays. The
fluid `--text-banner` / `--text-display` clamps are the site's own voice — keep
them; Capsule's `--type-*` steps are for chrome, not the editorial display.
Narrow `--measure` from `38rem` to **`34rem`**. The existing comment reasons
its way to ~81 CPL and calls it a deliberate trade; 34rem lands around 72 CPL,
inside the 65–75 optimum the comment itself cites. `--page-max` follows it
automatically. This is the one type value Capsule asks the site to change.

### 9. The display voice inverts
`global.css` sets `h1–h6 { font-family: var(--sans); font-weight: 700 }` and
comments that "display voice is Archivo. Source Serif 4 is reserved for the
literary surfaces". Capsule inverts this: headings become `var(--font-head)` —
which now *is* Source Serif 4 — at `--font-weight-display` (600) with
`--track-display`. Archivo stays on `.nav-link`, `.ruled-row`, `.row-title`,
`.meta-*`, `.cred-value`, buttons and fields, at 400/500. In the `@theme`
block, `--font-sans` / `--font-serif` / `--font-mono` keep their values — only
which one the headings reach for changes. `.page-heading-lg` at `--wt-black`
(800) has no serif equivalent: use 600 and let the size carry the weight.

### 10. Poetry and the reading register
`.poem-body`, `.post-prose`, `.project-content`, `.about-prose` all set the
serif. Capsule's `--font-read` is that same Source Serif 4, so these are
already right. Do not convert them to Archivo.

## Component / page map

| Site file | Capsule part | Note |
| --- | --- | --- |
| `layouts/Layout.astro` | `data-stock` on `<html>` | Keep the before-paint inline script; keep `astro:before-swap`; keep the `adamr-theme` key. Add the two-value migration for stored `bone`/`indigo`. |
| `components/Header.astro` | `.capsule-rail` idiom, horizontal | `.nav-link` active state becomes an ink slab, not a colour change. |
| `components/Footer.astro` | `.capsule-label` | Already mono + tracked; that is `--font-label`. |
| `.cred-strip` / `.cred-cell` | retire — becomes a sentence | The four boxed cells are a job-seeking device. Same facts, set as one line of secondary text under the standfirst (`templates/index.astro`). Drop `.cred-icon` with them. |
| `.ruled-list` / `.ruled-row` | rows, per `STACKS.md` | A list, not a stack — no front sheet. Hover → `--state-hover`. |
| `.section-header` | `.capsule-label` + `.capsule-rule` | |
| `.toc` | `.capsule-rail` | The one place a rail is literal: an essay's sections. |
| `.tag` / `.tag-active` | `.capsule-chip` | The one pill family. Chips are 999px; everything else stays square. |
| `.post-nav` | two sheets | |
| `.article-end` | `.capsule-hatch` | Lokta's colophon device is Capsule's hatch, unchanged in spirit. |
| Photography / theater archives | `.capsule-stack` | Plates have a sequence; this is where the page turn earns its place. |
| `pages/dev/[id].astro` | `.capsule-sheet` + sidecar | `stack`/`role`/`venue` are label-font rows. |
| Pagefind search | `.capsule-field__input` | Square, 44px, 1px control border, 2px focus ring. |

## Open items

- **axe flags three violations inside the YouTube iframe on essay pages.**
  `aria-allowed-attr` on `.ytmVideoInfoVideoTitle`, `aria-prohibited-attr` on
  `#movie_player`, `button-name` on `.ytmVideoInfoChannelAvatar` — all inside
  YouTube's cross-origin player, none of it our markup. Re-running the same
  scan with `.exclude('iframe')` gives **0 violations in both stocks**. The
  behavioral gate does not exclude iframes, so it will keep reporting these on
  `/blog/amanat`, `/blog/kassandra`, `/blog/dreamstreets`, `/blog/askstreets`
  and `/blog/dream-meridian` until it does.
- **`/now`, `/cv` and `/links` were skipped by the author's decision.** The
  three new routes in `CLAUDE-CODE-PROMPT.md` §3 are not built and the nav is
  unchanged; the site keeps its existing sitemap. `templates/now.astro`,
  `cv.astro` and `links.astro` remain unimplemented specifications.
- **Capsule's base rule silently reset the site's root font-size.**
  `capsule.components.css` sets `html, body { font-size: var(--type-base) }`
  unlayered, which beats `global.css`'s `@layer base { html { font-size: 18px } }`
  — the site's root went 18px → 16px and every rem-anchored size, including
  `--page-max` and the fluid display clamps, shrank ~11% without any rule
  changing. `--type-base` is a body step, not a root basis, and
  `templates/README.md` says the fluid clamps are the site's own. The 18px root
  is restated unlayered in `global.css` and `body` takes `--type-base`
  explicitly. Capsule should scope that declaration to `body`.
- **Labels depart from Capsule's spec, by the author's decision.** `DESIGN.md`
  assigns Spline Sans Mono to "labels, folios, dates, figures". On this site
  `--font-label` is overridden to Archivo and label rules drop uppercase and
  wide tracking: a monospace uppercase section heading implies terminal output
  where there is none. Monospace is kept for code, `kbd` and Shiki. The site's
  call over the system's; `DESIGN.md` should be re-derived to match.
- **The hero uses an emoji where the craft floor asks for a drawn icon.** The
  wave in "Hi! I'm Adam. 👋" is a Unicode glyph, which the floor lists under
  refusals. It is pinned by the author, who asked for it back by name, and a
  pinned brief outranks the floor. Left as-is deliberately.
- OFL license copies for Source Serif 4 and Spline Sans Mono (`fonts/README.md`).
- ~~Four stocks or two~~ — settled: two. The toggle becomes an honest
  two-state `data-stock` switch, and stored `bone` / `indigo` preferences
  migrate to `paper` / `slate`.
- Datatype is shipped but unused until there is a figure worth setting inline.
  Do not add one for its own sake.
