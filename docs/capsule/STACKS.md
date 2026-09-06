# Capsule — Sheets, Stacks, and the Rail

The marquee pattern. A **sheet** is one square bordered surface. A **stack** is
a gathering of sheets in a real order. A **rail** is the index down the edge
that names the positions in that order. Together they are the whole of the
system's navigation vocabulary: everything else is a list.

Credit: the stack adapts Carl Traberg's *reMarkable Stacks* concept — order as
the organising paradigm, not decoration.

## Where a stack is allowed

A stack implies a dealing order and a front. Use it only where one exists.

| Surface | Pattern | Why |
| --- | --- | --- |
| Photography set | Stack | Plates have a sequence; you page through them |
| An essay's sections | Rail only | Order is real, but the reader scrolls it |
| Writing index | Rows + rail | Chronology is real; there is no front sheet |
| Project archive | Rows | A list, not a deck |
| Home | Sheets, no stack | Independent surfaces with no order between them |
| Tag listing | Rows | No inherent order |

If you cannot name what the front sheet is, it is a list. Use rows.

## Geometry

Values are the shipped tokens. All spacing comes from `--space-*`.

- **Front sheet.** Full column width. 1px `border-hairline`, radius 0, padding
  `--space-5` (24px). A 2px `text-primary` top edge marks it as the front — the
  seam. Nothing else distinguishes it: no shadow, no scale, no tint.
- **Peeks.** Later sheets sit behind, offset by geometry only: `--space-2`,
  then `--space-4`, then `--space-5`, capped at three visible. Each peek strip
  is at least 44px tall — it is a touch target, because activating it brings
  that sheet to the front.
- **Z-order carries nothing.** Stacking order conveys no information the visible
  labels do not. A screen-reader user reading the list in DOM order loses
  nothing. That is the invariant the gate checks.
- **Rail.** A column at one edge, separated by the single line. Entries are
  buttons, min-height 44px, in the label font. The current entry is
  `surface-inverted` — a solid ink slab with reversed text — plus
  `aria-current`. Never a tint, never a coloured bar alone.

## The page turn

- **Trigger.** Activating a peek, or advancing to the next plate.
- **Motion.** The front sheet leaves (opacity to 0 over `--beat`, 180ms,
  `--ease-paper`; an optional 8–16px translate within the same 180ms). The next
  sheet becomes the front, remaining peeks move up one level, the rail mark
  advances.
- **Budget.** 180ms is the ceiling the rules lint enforces. There is no second
  beat and no easing curve bouncier than `--ease-paper`.
- **Reduced motion.** Under `prefers-reduced-motion: reduce` there is no
  transition: the next sheet is simply already in place, and the rail mark and
  any count update the same way. This is the canonical design; the animation is
  the enhancement, not the reverse.

## Keyboard map

- `Tab` / `Shift+Tab` — through the sheets (front first, then peeks in DOM
  order), then the rail. DOM order is reading order.
- `Enter` / `Space` on a peek — bring that sheet to the front.
- `Enter` / `Space` on a rail entry — same, from the index.
- After a turn, focus moves to the new front sheet, so a keyboard user keeps
  their place without hunting.
- `←` / `→` page a photography stack when the stack itself has focus. Arrow keys
  are an addition, never the only way.

## ARIA structure

- The stack is an ordered list: `<ol data-capsule-stack aria-label="…">`, one
  `<li>` per sheet, DOM order matching the rail exactly.
- Each sheet's interactive element is a real `<button>` carrying `data-time`
  (its ordinal, date, or plate number) so the behavioral gate can assert
  stack-order equals rail-order.
- The rail is `<nav data-capsule-rail aria-label="…">` with a
  `<button data-time>` per entry; the current one carries `aria-current="true"`.
- An empty stack is a designed state with a heading and a line of copy, not a
  blank region.

## Gate expectations

`behavioral-gate.mjs` asserts, in both stocks:

1. The stack is an `<ol>`.
2. `data-time` order in the stack equals `data-time` order in the rail.
3. Every sheet and rail entry is keyboard focusable and operable.
4. Every interactive element computes to at least 44px.
5. axe-core reports zero violations.

The gate skips cleanly (rather than failing) on pages with no stack, so it can
run against every route.
