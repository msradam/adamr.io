# Capsule redesign — before and after

Before images are captures of the Lokta site taken during the migration
session (indigo / bone stocks). After images are the rebuilt pages at 1280px
and 390px in both Capsule stocks.

The test in `CLAUDE-CODE-PROMPT.md` §8: if a page's sentence reads "new colours
and fonts", it was only re-themed and needs rebuilding. Each sentence below
names a structural change.

## `/` — home

The four boxed credential cells, each with an icon, a label, a value and a
subtitle, are **deleted** and their content is now one sentence of secondary
text; the thirteen-chip stack wall is one more sentence; the three-across
bordered featured-card grid is a **list** of title, note and meta with room
between entries; the inverted contact slab is **gone**, replaced by a line of
text links; and the numbered `01–04` ordinal column has been removed from the
writing rows along with the row hover fill.

## `/blog` — writing index

Per-section post counts (`5 POSTS`) are **removed**; topic sections are `<ol>`
row lists instead of `.ruled-list`/`.ruled-row` anchors; posts with no topic
now fall into a **year archive** rather than being dropped, so the grouping
stays honest as the collection grows.

## `/blog/[...id]` — essay

The table of contents is no longer a `<details>`/`<summary>` disclosure that
starts open — it is a **rail** with the label font, 44px rows and an inverted
slab for the current section; the pull quote's 4px accent left border is one
1px hairline; and the hatched Lokta endmark is a short 1px rule (the hatch is
reserved for "provisional" and its own spec forbids decorative use).

## `/dev` — projects

The featured **thumbnail card grid is deleted** — no images, no status tags, no
meta grid. Selected projects are a list with room; everything else is a row
list of title and date. "A list, not a deck."

## `/dev/[id]` — project detail

The accent-bordered `.project-sidecar` box is a **ruled `<dl>`** with one 1px
rule top and bottom, labels in the label font and values in chrome; the stack
is **plain text** rather than chips; and the two links are text links rather
than filled buttons.

## `/tags`, `/tags/[...id]`

Tag pills lose their `color-mix` background wash and become `.capsule-chip`,
the one sanctioned pill family; tag listings are row lists.

## Shell

The header nav moves to the label font at 44px, and the current section is an
**inverted ink slab** rather than a colour change; the wordmark's blinking
caret span is deleted; the Pagefind input is dressed as a Capsule field —
square, 44px, 1px control border, 2px focus ring.

## What did not change

Content, routing, RSS, sitemap, JSON-LD and Pagefind behave exactly as before.
The stock toggle keeps the `adamr-theme` key, the before-paint script and the
`astro:before-swap` re-apply.
