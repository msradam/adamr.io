# Slop audit

Capsule audited against the 66 patterns in
[impeccable.style/slop](https://impeccable.style/slop) — the catalog of tells
that mark an interface as AI-generated or poorly built. Worth doing honestly:
several of them fired on the first draft of this system, and two of them fire
on values that are staying.

Read with `DESIGN.md`, which is written in the form the detector's personalized
rules expect, and `docs/PRINCIPLES.md`.

## Fixed

| Pattern | Where it was | What changed |
| --- | --- | --- |
| Kicker / eyebrow above heading · Hero eyebrow | Every template and specimen had a tracked uppercase label above the `h1`; the system document had nine of them | Deleted. The words moved into the headline or the standfirst. Section labels that remained are real `h2`s, so the outline is carried by headings rather than styled paragraphs |
| Tiny numbered section labels | `01 02 03` beside every row on the home and writing indexes | Deleted. Plate numbers in a photography stack stay: they are identity, asserted against the rail by the behavioral gate, not editorial garnish |
| Oversized hero headline | A full-sentence headline at `--text-banner` (up to 68px) | Dropped to `--text-display`. A long sentence does not get display size |
| Identical card grids | Three equal project cards, icon-free but the same shape | The lead project spans the row with its own type size; the rest sit beside it |
| Content invisible at rest | The photography stack set every plate to `opacity: 0` and let script reveal the front one — with JS off, the page was blank | The front plate is marked in the markup. This was a real bug, not just a smell |
| Repeating-gradient stripes as decoration | `.capsule-hatch` was offered as a general surface background, and closed every essay as a colophon | The hatch is now capped at 64×24px and means one thing: provisional state, beside a label. The essay ends on a 1px rule |
| Crushed letter spacing | Display type at `-0.03em` | `--track-display`, `-0.012em`. The old token remains only as a Lokta alias, unused |
| Single font · Overused font | — | Three families, none of them Inter, Geist, Space Grotesk, or Instrument Serif |
| Cramped padding | Chips had 4px of vertical padding inside their border | 8px |
| Decorative blinking cursor · pulsing dot · marquee | The site's wordmark has a 1.1s blinking caret today | Already on the migration list (`ADAMR-IO-MAPPING.md` §4); this is independent corroboration |
| Side-tab accent border · Border accent on rounded element | The site's `.callout`, `.project-sidecar` and `blockquote` use a 4px accent left border | Already on the list (§6), now also a lint rule |

## Enforced, not just documented

`validate/rules-lint.mjs` gained deterministic checks for the source-level
patterns: thick one-side borders, gradient text, radial and conic gradients,
transitions on layout properties, font-size under 11px, wide tracking on
running text, and overshooting easing curves. It runs on Capsule's own CSS and
passes.

For the app, add the detector to CI beside the gates:

```bash
npx impeccable detect src/
```

## Accepted, with reasons

Two rules fire on values that are staying. Both are judgment calls, and the
catalog says as much — so here is the argument rather than a silent exception.

**Cream / beige palette.** The rule: a warm cream page background is the
default "tasteful" AI surface, reached for by reflex. Capsule's ground is
`#FFFCF0`. The defence is that it is not a reflex: it is Flexoki's paper, a
published palette with a stated rationale, chosen because real e-ink white is
warm and about 44% reflectance — the system is an argument about a specific
physical material, and a cool `#FAFAFA` would contradict it. The rule asks that
the background come from a deliberate palette rather than the safe warm
off-white, and that test is met. The slate stock is there for anyone who
disagrees.

**Cyan on dark.** The rule names purple gradients and cyan-on-dark as the most
recognisable AI palettes. Capsule's slate accent is cyan-400 `#3AA99F` on
`#1C1B1A`. What the rule is really about is neon: a saturated cyan with a glow.
Ours is a desaturated teal at 6.02:1 with no glow, no gradient, and no
box-shadow anywhere in the system — and the paper stock's `#1C6C66` is dark
enough to read as ink. Still, it is the flagged combination.

If it grates, the accent is one line in each stock block. The verified
alternative is olive, which no generator reaches for:

```css
[data-stock="paper"] { --accent-ink: #5C7307; } /* green-700, 5.23:1 */
[data-stock="slate"] { --accent-ink: #879A39; } /* green-400, 5.50:1 */
```

## Open questions for the site

**Line length** — settled: narrow. `--measure` goes `38rem` → `34rem`, about
72 CPL, inside the 65–75 optimum its own comment cites. Recorded in
`ADAMR-IO-MAPPING.md` §8.

**Em-dashes and aphoristic cadence.** Two copy rules — more than a couple of
em-dashes in body copy, and sections that land on a manufactured contrast
("Not a feature. A platform.") — fire on the prose in this handoff and on the
system document's old hero. The hero is rewritten and the copy register in
`PRINCIPLES.md` now names both. The documentation itself is still fond of the
em-dash; that is a tell worth knowing about while editing the site's own copy.

## Not applicable

Glassmorphism, glow borders, radial halos, dark-mode glows, gradient text,
extreme radii, nested cards, icon tiles above headings, hero metric layouts,
italic serif display headlines, hand-drawn SVG mascots, shape-assembled hero
art, image hover transforms, bounce easing, justified text, skipped heading
levels, low-contrast text, tiny body text, tight line height, monotonous
spacing, decorative grid backgrounds, and hairline-plus-wide-shadow: none of
these exist in Capsule, most of them because the grammar already forbade them
and the gates already checked.
