# templates/

Astro page specifications for adamr.io, written against Capsule roles and the
repo's real collection schemas (`blog`, `dev`).

**These are the specification, not a style reference.** Where a template's
structure, hierarchy, or register disagrees with the page on the site today,
the template is correct and the page changes. Adopting Capsule is a redesign;
re-theming the existing markup is the failure mode, not the goal. If a template
genuinely cannot work for a route, record why in `docs/ADAMR-IO-MAPPING.md`
under Open items and use the closest Capsule pattern — never the old layout.

They are not pixel mandates: adapt them to the real components, data, and
routes. Their *shape* is what ships — which elements exist, in what order, in
which face, at what volume.

## The quiet register

These are set at a deliberately lower volume than the site today. The content
is the same; the furniture around it is not. Removed on purpose:

- the boxed four-cell credential strip, now one line of secondary text
- project cards with borders, meta grids and chip rows, now a list with room
- the inverted contact slab on the home page, now a line of links
- section counts, row ordinals, and row hover fills

The slab, the chip and the sheet all still exist in the system — see the
specimen page. They are just not what a personal site needs on its front page.
A site belonging to someone who already has the job does not have to argue.

| File | Route it's for | The pattern it demonstrates |
| --- | --- | --- |
| `index.astro` | `/` | Standfirst, credentials as a sentence, work as a list, ruled writing rows, contact as a line |
| `writing-index.astro` | `/blog` | Rows grouped by topic, then a year archive |
| `EssayLayout.astro` | `/blog/[...id]` | The reading register, TOC as a rail, the hatch colophon |
| `dev-detail.astro` | `/dev/[id]` | Case study with a ruled meta sidecar, stack as text, essay cross-link |
| `photography.astro` | `/photography` | The stack and the page turn, with the full keyboard map |
| `now.astro` | `/now` | A dated status sheet |
| `cv.astro` | `/cv` | A résumé that prints — forces the paper stock, restores it after |
| `links.astro` | `/links` | Ruled rows, email as a line |

## Rebuilding a page against one of these

1. **Fix the imports.** They use `@layouts`, `@components`, `@lib`, `@consts`,
   `@types` — match whatever `tsconfig.json` actually defines.
2. **Delete the CSS that becomes dead.** A rebuilt page leaves classes behind
   in `global.css`. Remove them in the same commit; leaving both layers live is
   how a redesign decays back into a re-theme.
3. **Keep `Layout.astro`.** Every template assumes the existing shell: the
   before-paint stock script, `Head.astro` meta and JSON-LD, header, footer,
   skip link. None of that is re-specified here.
4. **The fluid display clamps are the site's own.** `--text-banner`,
   `--text-display`, `--text-lede` and `--measure` come from `global.css` and
   the templates reference them deliberately. Capsule's `--type-*` steps are
   for chrome, not the editorial display.
5. **Placeholder content is marked.** `now.astro`, `cv.astro` and
   `photography.astro` carry sample entries; the real copy is the author's.
   `cv.astro`'s role history is a plausible skeleton drawn from the site's own
   metadata — check every line before publishing it.

## Routes with no template here

Pagefind search UI, the tag pages, poetry, theater, and the design archive.
These still get rebuilt — they are not exempt. Compose them from the same
parts: rows for lists, sheets for detail, chips for tags, the rail where an
order is real, the slab for a mode. `CLAUDE-CODE-PROMPT.md` §3 lists what must
be gone from each. If a surface needs
something not in `css/capsule.components.css`, that is an open item — add it to
`docs/ADAMR-IO-MAPPING.md` rather than inventing a value.
