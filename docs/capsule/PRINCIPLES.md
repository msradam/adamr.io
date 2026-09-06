# Capsule — Principles

The grammar, written as rules a machine can check. Each rule names the gate that
enforces it. A principle with no gate is not a principle here; it is a wish.

## 1. Two grounds, no third

The system ships two stocks: paper (positive) and slate (negative). A stock
re-points the semantic layer; it never introduces a value. Neither stock is
claimed calmer or more correct. Ground is never pure white or pure black: paper
is #FFFCF0, slate is #1C1B1A.

- Gate: `contrast-gate.mjs` runs the full cartesian product of every text role on
  every surface in every stock. `rules-lint.mjs` rejects any hex outside the
  Flexoki primitive allowlist.

## 2. Contrast is measured, never asserted

Body text meets 4.5:1. Large text, the focus ring, and control borders meet
3:1 (WCAG 1.4.11). Ratios are computed from the shipped hexes with the WCAG 2.x
relative-luminance formula. No ratio in any doc is hand-entered.

Capsule tightens one of Lokta's rules: **accent ink is gated at 4.5:1**, not
3:1, because the accent's main job on a reading site is a body-size link. That
is why the paper accent is cyan-700 `#1C6C66` (6.03:1) rather than Flexoki
cyan-600 `#24837B`, which measures 4.43:1 and fails.

- Gate: `contrast-gate.mjs`. APCA Lc is printed as advisory only; nothing gates
  on it.

## 3. Hierarchy survives grayscale

Colour is never the sole carrier of meaning (WCAG 1.4.1). Every distinction the
UI makes must hold when hue is removed. The three text tiers stay separable and
each still meets its gate after desaturation.

- Gate: `grayscale-gate.mjs` re-runs the contrast math through Rec.601 luma.

## 4. One line

There is a single divider: 1px, one colour (`border.hairline`). It draws every
rule, card edge, table line, and frame. `border.strong` is an alias of the same
line, kept so product code can request emphasis without introducing a second
weight. reMarkable idiom: no varying line weights.

- Gate: `rules-lint.mjs` (the CSS declares one border colour token; no widths
  above 2px appear on dividers).

## 5. Surfaces are square, controls are pills

Radius is binary. Surfaces (panels, sheets, rails, dividers, thumbnails,
buttons, inputs, the modal) are 0. Controls that detach and float on content
(chips, tags, toggles) are full radius. Nothing is in between.

- Gate: `rules-lint.mjs` fails any non-zero radius on a class that is not a
  control (chip / tag / toggle / switch / fab / key / pill).

## 6. No elevation

Nothing casts a shadow. No blur, no gradient fill. The only depth cue is a paper
veil (`scrim`): the page colour at 0.62 alpha, drawn behind a popup to fade the
page. Never a dark overlay.

- Gate: `rules-lint.mjs` rejects `box-shadow`, blur filters, and any gradient
  outside the one sanctioned `--pattern-hatch` token.

## 7. One motion beat

The system animates exactly once: the page turn (the sheet deal in a Stack),
180ms. Everything else is static. Under `prefers-reduced-motion` the
beat is removed and the next state is simply in place; reduced motion is the
canonical design, not a downgrade.

- Gate: `rules-lint.mjs` fails any transition or animation longer than 180ms.

## 8. Focus is always visible

Every interactive class carries a `:focus-visible` rule: a plain 2px
rectangular ring in the focus colour, offset 2px. No rounded glow.

- Gate: `rules-lint.mjs` fails any interactive class missing `:focus-visible`.
  `behavioral-gate.mjs` confirms keyboard operation in a real browser.

## 9. Targets are large enough

Pointer targets are at least 24px (WCAG 2.5.8); touch targets are 44px. Both
sizes ship as tokens (`size.target-min`, `size.target-touch`).

- Gate: `behavioral-gate.mjs` measures computed sizes of every interactive
  element in both stocks.

## 10. Ink is provisional; the hatch says pending

A 1-bit diagonal hatch is the texture for the provisional or pending state. It
survives grayscale, so it never relies on colour. It must always sit beside a
text label, and never under body text.

- Gate: `grayscale-gate.mjs` (texture survives). Structural rule enforced in
  review: the hatch is paired with a label (see `capsule-pending-bar` usage).

## 11. Accent is rationed

Accent ink is pigment on the page: one element class per screen, never the sole
carrier of meaning. It marks, it does not decorate.

## 12. Inverted fill means mode

A solid ink fill with reversed text is reserved for modes: the active rail
selection, a contextual action bar, the on-screen keyboard. It is not
decoration and not a resting style.

## 13. The display voice is the serif

Source Serif 4 sets every headline, page title, card title, and the running
body of long-form. Archivo is chrome: nav, controls, table rows, meta, at 400
and 500. A slightly condensed grotesque set large and heavy is the harshest
thing that can sit on a warm ground, so the system does not offer the option —
the serif ships 400 and 600 and there is no weight above it to reach for.
Spline Sans Mono sets labels, folios and figures.

- Gate: enforced in review. `--font-weight-display` is 600 and no token
  exposes a heavier display weight.

## 14. Adoption is a redesign, not a re-theme

Capsule keeps the public token names of the system it replaces so a build stays
green from the first commit. That is scaffolding for a migration, not the
migration. Everything in this document above the values — the single line, the
square surface, the rail, the sheet, the stack, the one beat, the quiet
register — is structural: it lives in the markup, not in the token file. A
product that swaps tokens and keeps its old components has not adopted Capsule;
it has recoloured. Filled panels become ruled rows, card grids become lists,
disclosures become rails, sequences become stacks. Content is preserved
exactly; presentation is not.

- Gate: enforced in review, and mechanically visible — the old component layer
  should be deleted, not left live. If both layers still load, the migration is
  unfinished.

## Copy register (enforced in review, not by CSS)

These are system-level rules. The site's actual voice is the author's and is not
the design system's business.

- The UI never says "AI".
- Numbers carry their uncertainty: a figure without a margin is a claim.
- Red is reserved for failures and destructive confirmations. Nothing else is
  red, ever.
- No badges, no streaks, no view counts, no celebration. If a number does not
  change a reader's decision, it does not ship.
- Dates are absolute ("March 2026"), never "3 months ago".
- Labels are nouns, in the label font, uppercase, tracked. Not sentences.
- No kicker above a heading. A tracked uppercase label sitting over a headline
  borrows editorial authority it has not earned; fold the words into the
  heading or drop them.
- No decorative ordinals. A number beside a title ships only when it is
  identity the interface uses elsewhere (a plate number the rail indexes), not
  to imply editorial structure.
- At most one em-dash in a paragraph. More is a cadence tell; commas, colons
  and periods are available.
- No manufactured contrast as a closer ("Not a feature. A platform."), and
  nothing is dismissed as "theater". Say what the thing does.
- No marketing verbs: streamline, empower, supercharge, world-class,
  enterprise-grade. Name the specific action.
