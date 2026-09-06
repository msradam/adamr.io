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

Flexoki (Steph Ango, MIT), extended with two darkened stops. Nothing outside
this list is a Capsule value.

**Grounds** `#FFFCF0` paper · `#1C1B1A` slate
**Ink / neutrals** `#100F0F` `#F2F0E5` `#E6E4D9` `#DAD8CE` `#CECDC3` `#B7B5AC` `#9F9D96` `#878580` `#6F6E69` `#575653` `#403E3C` `#343331` `#282726`
**Pigment** `#1C6C66` cyan-700 (accent) · `#3AA99F` cyan-400 · `#5C7307` green-700 · `#879A39` green-400 · `#5E409D` purple-600 · `#8B7EC8` purple-400 · `#AF3029` red-600 · `#D14D41` red-400 · `#205EA6` blue-600 (focus) · `#4385BE` blue-400
**Superseded, do not use as text** `#24837B` cyan-600 (4.43:1) · `#66800B` green-600 (4.39:1)

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
