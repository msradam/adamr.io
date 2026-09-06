# DESIGN.md — Capsule

The documented system, in the form `npx impeccable detect` reads for its
personalized rules (font, color, radius, and font-size outside DESIGN.md). If a
value is not here, it is not in Capsule — either use a token or add the value
deliberately, to this file, with the reason.

Full grammar: `docs/PRINCIPLES.md`. Source of truth for values:
`tokens/tokens.dtcg.json`, built to `tokens/capsule.tokens.css`.

## Fonts

| Family | Role | Weights used |
| --- | --- | --- |
| Source Serif 4 | Display **and** reading: headlines, page and card titles, long-form prose | 400, 400 italic, 600 |
| Archivo | Chrome only: nav, controls, rows, meta, fields | 400, 500 |
| Spline Sans Mono | Code only: fenced blocks, inline `code`, `kbd`, Shiki tokens | 400, 500 |
| Datatype | Inline 1-bit charts, via ligature substitution | variable |

No other family ships. All four are SIL OFL 1.1, self-hosted, no CDN. There is
deliberately no display weight above 600.

**Site deviation, deliberate.** Capsule v1.0 assigns Spline Sans Mono to
labels, folios and dates. On adamr.io `--font-label` resolves to Archivo and
label rules drop uppercase and wide tracking: a monospace uppercase section
heading implies terminal output where there is none, which is the costume the
generated-UI catalog is about. Monospace is kept for what is genuinely code.
Recorded in `docs/capsule/ADAMR-IO-MAPPING.md`.

## Colors

**Site palette, not Flexoki.** Capsule v1.0 ships Flexoki, whose paper stock is
`#FFFCF0`. That warm cream now reads as a specific company's brand rather than
as a neutral choice, and the generated-UI catalog makes the same point from the
other side: a warm cream page is the default "tasteful" surface, reached for by
reflex. `tokens/adamr.palette.css` replaces the colour layer and loads last;
type, space, radius and motion are untouched Capsule.

The ground is a cool neutral grey. Real E Ink Carta reflects a slightly cool
light grey rather than a cream, so this is closer to the material the system
argues about, not a compromise away from it.

Every stop below was solved against the **worst surface it can sit on**, not
against the page. A value that clears 4.5:1 on the page can fall under it on a
sunken or inset surface, which is the defect Capsule's own contrast gate has on
`text-tertiary`.

**Paper** page `#EDEEEC` · sunken `#E1E3E0` · inset `#D3D6D2`
**Paper ink** primary `#14161A` (15.56 / 14.03 / 12.35) · secondary `#4E5257`
(6.76 / 6.10 / 5.37) · muted `#595D62` (5.70 / 5.14 / 4.52) · line `#6A6E73`
(4.41:1, clears 1.4.11)

**Slate** page `#191A1C` · sunken `#232528` · inset `#2E3134`
**Slate ink** primary `#E4E5E3` (13.78 / 12.16 / 10.35) · secondary `#B2B5B8`
(8.45 / 7.46 / 6.35) · muted `#94989D` (6.00 / 5.30 / 4.51) · line `#7E8286`

**Pigment** accent iron red `#8C2F23` / `#D08A7E` · feature ink blue `#23457C` /
`#8FA9D4` · success moss `#44562A` / `#9FB070` · danger oxblood `#7A2E2A` /
`#D08A7E` · warning bronze `#7A5320` / `#C9A46B`

Iron red is printer's red, the emphasis colour of the letterpress tradition the
poster work on `/design` comes out of. It is neither cyan nor violet, the two
palettes the catalog names as the recognisable generated-UI tells.

Alpha is used in exactly two places: `--scrim` (the page colour at 0.62) and
`--state-disabled-opacity` (0.45). No `color-mix` washes stand in for ink.


## Radii

`0px` — every surface: panels, sheets, rails, dividers, thumbnails, buttons,
fields, modals.
`999px` — detached pressable controls only: chips, tags, toggles.

Nothing in between exists. There is no 4px, 8px, or 12px radius in Capsule.

## Type scale

`11px` `13px` `16px` `18px` `24px` `32px` `48px` `72px`
(`--type-xs` `sm` `base` `md` `lg` `xl` `2xl` `3xl`)

11px is the floor, and only for short uppercase labels. Body is 16px minimum.
Long-form prose is 18px. Fluid display clamps in the consuming app
(`--text-display`, `--text-banner`) are that app's own and sit above this scale.

Line heights: `1.05` `1.2` `1.45` `1.6`. Tracking: `-0.03em` (unused — legacy
alias), `-0.012em` display, `-0.01em`, `0.12em` labels.

## Space

4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 (`--space-1` … `--space-9`)

## Motion

One duration: `180ms` (`--beat`). One curve: `cubic-bezier(0.2, 0, 0.1, 1)`.
Under `prefers-reduced-motion` there is no transition, and that is the
canonical design. No looping animation ships — no pulse, no blink, no marquee.

## Banned by grammar, enforced by `validate/rules-lint.mjs`

box-shadow · blur · radial and conic gradients · gradient text · any gradient
outside `--pattern-hatch` · radius other than 0 or 999px · motion over 180ms ·
overshooting easing · thick one-side accent borders · transitions on layout
properties · font-size under 11px · tracking over 0.05em on running text ·
interactive classes without `:focus-visible`
