# Migrating from Lokta to Capsule

Capsule is Lokta's e-ink successor, not a rival system. It keeps Lokta's public
token names on purpose: an app authored against Lokta's **semantic** layer swaps
one CSS file and keeps rendering.

**That compatibility is a migration convenience, not the migration.** It buys a
green build while the pages get rebuilt against `templates/`. Stopping at the
swap leaves you with the old site in new colours, which is the one outcome this
handoff is written to prevent — see `CLAUDE-CODE-PROMPT.md`. What follows is
what survives the swap and what changes underneath it.

## What is source-compatible

These Lokta names ship in `capsule.tokens.css` with the same meaning:

`--surface-page` `--surface-raised` `--surface-sunken` `--surface-inset`
`--surface-inverse` · `--text-primary` `--text-body` `--text-secondary`
`--text-muted` `--text-disabled` `--text-on-fill` · `--border-hairline`
`--border-default` `--border-strong` · `--accent-success` `--accent-danger`
`--accent-feature` `--accent-*-fill` `--accent-info-fill` `--accent-warning-fill`
`--accent-feature-ground` · `--field-bg` `--field-border` `--field-placeholder` ·
`--focus-ring` `--focus-ring-width` `--focus-offset` · `--space-1…9`
`--type-xs…3xl` `--rule-1…3` `--lh-*` `--wt-*` `--track-*` `--target-*`
`--dur-*` `--ease-*` `--state-hover` `--state-selected`
`--state-disabled-opacity` `--lk-accent` `--lk-radius` `--lk-density-step`

The nine-step `--space-*` scale is Lokta's, kept verbatim rather than
re-indexed, so existing spacing keeps its meaning. `--type-base` moves 15px →
16px; that is the only size change.

Lokta's primitive variables (`--ink-*`, `--paper-*`, `--pigment-*`) are **not**
exposed — Capsule's primitives live in the DTCG file and are consumed as roles.
`tokens/lokta-compat.css` re-points them so the swap commit is not a breaking
change — but this is a full swap, not a coexistence: delete the compat file in
the same pull request, once the app's direct references are re-pointed.

## The six rules that change values

1. **One line.** `--border-hairline`, `--border-default` and `--border-strong`
   are the same 1px, same colour. Lokta's `0.5px` hairline retires. Anywhere
   the app used line weight to signal importance, it now uses the ink slab, the
   label font, or nothing.
2. **No elevation.** `--surface-raised` is an alias of `--surface-page`. Any
   `box-shadow`, glow, or blur must go — the rules lint fails on the token or
   component layer, and review catches the app layer.
3. **One pigment per role.** Because Capsule verified each pigment as both ink
   and fill, the `-ink` variants collapse. The accent moves from aubergine to
   **cyan-700 `#1C6C66`** (6.03:1 as ink, 6.03:1 reversed).
4. **Marigold retires.** Lokta's hero ground was a pigment panel with dark ink
   text. Capsule's feature ground is `--surface-inverted` — a solid ink slab
   with reversed text at 18.62:1. `--accent-feature-ground` now points there.
5. **One motion beat.** `--dur-slow` is capped at 180ms, equal to `--beat`.
   `--ease-expressive` aliases `--ease-paper`. Any transition or animation over
   180ms fails the lint.
6. **The display voice is the serif.** Lokta set headings in Archivo at 700/800
   and reserved Source Serif 4 for "literary surfaces". Capsule inverts that:
   `--font-head` **is** Source Serif 4, at `--font-weight-display` (600), with
   `--track-display` (-0.012em) instead of a grotesque's tight -0.03em.
   Archivo becomes chrome only, at 400/500, and `--font-weight-body` drops
   500 → 400. No binaries change: all three families were already vendored.

## Stocks: four become two

Capsule ships `paper` and `slate`. In the built CSS, Lokta's selectors alias on:

| Lokta stock | Resolves to | Note |
| --- | --- | --- |
| `paper` | paper | unchanged |
| `bone` | paper | the cool neutral retires; e-ink white is warm |
| `ink` | slate | |
| `indigo` | slate | the cool dark retires |

So a stored `data-theme` value keeps working and no reader lands on an unstyled
page. Capsule reads **either** `data-stock` or `data-theme`. Once the app's
toggle is down to two options, switch it to `data-stock` and drop the aliases.

## What Capsule adds

The device grammar Lokta has no vocabulary for, in `capsule.components.css`:
the **rail** (`.capsule-rail`), the **sheet** and **stack** (`.capsule-sheet`,
`.capsule-stack`), the **hatch** (`.capsule-hatch`, the pending texture), the
**ink slab** (`.capsule-slab`), the **folio label** (`.capsule-label`), and
`--font-data` for inline 1-bit charts. See `docs/STACKS.md`.

## Order of operations

1. Drop in `fonts/`, `tokens/`, `css/`, `validate/`.
2. Load `fonts.css` → `capsule.tokens.css` → `lokta-compat.css` →
   `capsule.components.css`, then the app's own CSS.
3. Run `node validate/verify.mjs`. It should pass before you touch a component.
4. Work the app-layer list in `ADAMR-IO-MAPPING.md`.
5. Delete `lokta-compat.css` and the `data-theme` aliases.
