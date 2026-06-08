# adamr.io

The personal website of Adam Munawar Rahman: a combined portfolio and archive
of software, writing, design, and theater work. It serves two questions at
once, "what is he doing now" and "what has he done," from a single content
collection surfaced through recency-ranked views and a complete back catalogue.

Live at [adamr.io](https://adamr.io).

## Stack

- [Astro 6](https://astro.build) static site, output to plain HTML/CSS/JS
- [Tailwind CSS 4](https://tailwindcss.com) via the Vite plugin, plus the
  typography plugin for prose
- TypeScript, with content validated by [Zod](https://zod.dev) schemas
- [Pagefind](https://pagefind.app) for static, client-side search
- [MDX](https://mdxjs.com), RSS, and sitemap through official Astro integrations
- [Lokta](https://github.com/msradam/lokta), the author's own "paper on screen"
  design system, vendored under `src/styles/lokta`. Archivo, Spline Sans Mono,
  and Source Serif 4 are self-hosted (SIL OFL, no Google Fonts CDN).

## Architecture

```
src/
  components/        Header, Footer, Head (meta + JSON-LD), cards, TOC, search
  content/
    blog/            Writing: essays and mirrored project writeups (Markdown)
    dev/             Software projects (Markdown)
  content.config.ts  Zod schemas for the blog and dev collections
  layouts/Layout.astro  HTML shell, theme toggle, sets data-theme on <html>
  lib/utils.ts       Date formatting, reading-time estimate
  pages/             File-based routes (see below)
  styles/
    lokta/           Vendored Lokta: tokens, base, components, self-hosted fonts
    global.css       Imports Lokta, bridges site aliases onto its semantic tokens
  consts.ts          Site metadata, social links, homepage counts
public/
  images/            Project thumbnails, theater photos, rendered theme previews
```

### Routing

Pages are file-based under `src/pages`:

- `index.astro` home: hero, credential strip, featured projects, recent
  projects, latest writing
- `dev/index.astro` and `dev/[id].astro` project list and detail
- `blog/index.astro` and `blog/[...id].astro` writing grouped by topic, with
  a per-post table of contents
- `design.astro`, `theater.astro`, `poetry.astro` the design, theater, and
  poetry archives
- `tags/index.astro` and `tags/[...id].astro` tag index and per-tag listings

### Content model

Two collections are defined in `content.config.ts`, both loaded from Markdown
via the glob loader. Each entry is a folder with an `index.md`.

- **blog** requires `title`, `description`, `date`; optional `tags`, `draft`,
  and a `topic` of `ai-infra`, `observability`, or `essays`. The blog index
  groups posts under their topic and drops the rest into a year-based archive.
- **dev** requires `title`, `description`, `date`; optional `role`, `stack`,
  `venue`, `recognition`, `repoURL`, `demoURL`, `featured`, `active`, `draft`,
  `hidden`. The dev index renders a fixed featured grid, a recent list, and a
  year-based archive.

When a blog post and a dev project share the same folder id, the templates
cross-link them automatically: the project page links to "the full story" and
the post links back to "the project." No manual wiring is needed.

### Theming

The site ships Lokta's four stocks (`paper`, `ink`, `bone`, `indigo`), selected
by a `data-theme` attribute on `<html>`. Lokta defines a primitive layer, a
role-based semantic layer (`--surface-*`, `--text-*`, `--border-*`, `--accent-*`),
and per-stock overrides; `global.css` builds the UI against the semantic layer,
so every stock and WCAG 2.2 AA come for free. An inline script in `Head.astro`
applies the stored stock before first paint to avoid a flash, persists the choice
to `localStorage` under `adamr-theme`, and re-applies it on `astro:before-swap`
so it survives client-side navigation. Marigold is reserved as a hero ground and
selection colour; aubergine is the text-safe interactive accent.

### Search, feeds, and SEO

Pagefind indexes the built HTML at the end of `astro build` and serves search
fully client-side. `@astrojs/rss` emits `/rss.xml`; `@astrojs/sitemap` emits
`/sitemap-index.xml`. `Head.astro` sets Open Graph and Twitter tags, a canonical
URL, and a JSON-LD `Person` block on every page.

## Development

```bash
npm install
npm run dev        # local dev server at http://localhost:4321
npm run build      # astro check, then a production build to dist/
npm run preview    # serve the production build locally
npm run lint       # eslint
npm run format     # prettier --write
```

## Deployment

`npm run build` produces a fully static site in `dist/`, deployable to any
static host. The canonical origin is set with `site` in `astro.config.mjs` and
is used for canonical URLs, the sitemap, and RSS.

## License

Source code is released under the MIT License (see `LICENSE`). Written, visual,
and creative content (essays, poetry, designs, photographs) is the author's and
is not covered by that license.
</content>
