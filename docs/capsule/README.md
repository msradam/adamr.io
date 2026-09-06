# Capsule v1.0 — adamr.io handoff

Capsule is a calm, e-ink design system: warm paper, one line, no elevation, one
motion beat. It is the successor to **Lokta**, the author's "paper on screen"
system that adamr.io ships today.

**Adopting it is a redesign.** Capsule keeps Lokta's public token names so the
build survives the first commit while the pages are rebuilt — that is
scaffolding, not the goal. A site that ends up as Lokta's markup in Capsule's
colours has not adopted Capsule. The page specifications live in `templates/`;
`CLAUDE-CODE-PROMPT.md` is the brief, and it names that failure mode
explicitly.

This zip is self-contained: no CDN, no external fetch, every font binary
included. Every value is the verified one; the tokens, the built CSS, the proof
page and the docs agree, and the gates are what make that true rather than a
claim.

Start with `CLAUDE-CODE-PROMPT.md` — the implementation brief to run inside the
`adamr.io` repo — then `templates/README.md`, `docs/ADAMR-IO-MAPPING.md`, and
`docs/MIGRATING-FROM-LOKTA.md`.

## Contents

```
tokens/
  tokens.dtcg.json       W3C DTCG source. Layers: primitive, semantic, stock.
  capsule.tokens.css     Built custom properties, one block per stock.
  reference.css          Hand-verified reference; the drift gate's truth.
  lokta-compat.css       Optional migration crutch. Delete when done.
fonts/
  *.woff2                Archivo, Source Serif 4, Spline Sans Mono, Datatype.
  fonts.css              @font-face, self-hosted. No CDN.
  README.md              Roles, weights, and the one open item.
css/
  capsule.components.css Base, controls, and the device grammar.
validate/
  verify.mjs             Runs the deterministic gates in order.
  contrast-gate.mjs      Every text role on every surface in every stock.
  grayscale-gate.mjs     Rec.601 luma; hierarchy must survive without hue.
  rules-lint.mjs         Hex allowlist, radius split, no elevation, motion,
                         and the generated-UI signature checks.
  drift-gate.mjs         Built token CSS vs the hand-verified reference.
  behavioral-gate.mjs    Playwright + axe: keyboard, targets, DOM order.
  verify.yml             CI workflow.
proof/index.html         Contrast + grayscale computed live in the browser.
specimens/index.html     The site's surfaces, 390px and 1280px, both stocks.
DESIGN.md                The documented system, in the form `npx impeccable
                         detect` reads for its personalized rules.
docs/
  PRINCIPLES.md          The grammar, each rule naming the gate that holds it.
  SLOP-AUDIT.md          Audited against the 66 generated-UI tells: what was
                         fixed, what is accepted, and why.
  STACKS.md              Sheets, stacks, the rail, and the page turn.
  MIGRATING-FROM-LOKTA.md What is compatible, what changes, in what order.
  ADAMR-IO-MAPPING.md    File-by-file work list for this site.
CLAUDE-CODE-PROMPT.md    The implementation brief.
```

## Load order

```html
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="tokens/capsule.tokens.css">
<link rel="stylesheet" href="tokens/lokta-compat.css"><!-- optional, temporary -->
<link rel="stylesheet" href="css/capsule.components.css">
```

Set the stock on the document element: `<html data-stock="paper">`. Capsule also
answers to Lokta's `data-theme`, with `bone` resolving to paper and
`ink`/`indigo` to slate, so a stored preference never lands on an unstyled page.

## Verify

```bash
node validate/verify.mjs            # contrast, grayscale, rules, drift
npx playwright install --with-deps chromium
node validate/behavioral-gate.mjs   # runs against proof/index.html
CAPSULE_TARGET_URL="http://localhost:4321/" node validate/behavioral-gate.mjs
```

Gates fail the build. Fix the code, never the gate — if a gate exposes a real
conflict with a requirement, record it as an open item and raise it.

## The short version of the grammar

- Two grounds: paper `#FFFCF0`, slate `#1C1B1A`. Never pure white or black.
- One line: 1px, one colour, every divider and edge.
- Surfaces are square; only detached controls (chips, tags, toggles) are pills.
- No shadow, no blur, no gradient. The only depth cue is a veil of the page
  colour behind a popup.
- One motion beat: 180ms, the page turn. Reduced motion is the canonical design.
- Accent is rationed and measured at body size: cyan-700 `#1C6C66`, 6.03:1.
- The display voice is Source Serif 4 at 600. Archivo is chrome, at 400/500.
- The 1-bit hatch means provisional, and always sits beside a text label.
- A solid ink slab with reversed text means *mode*, not decoration.

## Open item

The OFL license copies for Source Serif 4 and Spline Sans Mono are not in this
zip; the binaries are. See `fonts/README.md`. That is the only unfinished thing
here.

## Credits

Palette: Flexoki by Steph Ango (MIT), extended with two darkened stops.
Fonts: Archivo, Source Serif 4, Spline Sans Mono, Datatype — all SIL OFL 1.1.
Stacks adapts Carl Traberg's *reMarkable Stacks* concept.
