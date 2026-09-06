# fonts/

Four families, all SIL Open Font License 1.1, all self-hosted. No CDN, no
Google Fonts, no external fetch at runtime.

| Family | Role | Weights shipped | Token |
| --- | --- | --- | --- |
| Archivo | Chrome only: nav, controls, rows, meta | 400, 500 (600–800 ship, unused) | `--font-ui` |
| Source Serif 4 | Display **and** reading: headlines, titles, prose | 400, 400 italic, 600 | `--font-head`, `--font-read` |
| Spline Sans Mono | Tracked labels, folios, dates | 400, 500 | `--font-label` |
| Datatype | Inline 1-bit charts via ligatures | variable 100–900 | `--font-data` |

Every binary listed above **ships in this zip**. Archivo, Source Serif 4 and
Spline Sans Mono are byte-identical to the latin-subset files adamr.io already
vendors under `src/styles/lokta/fonts/`, so the migration adds exactly one new
font file (`Datatype.woff2`, 1 request, only on pages that use an inline chart)
and drops none.

Capsule adopts Source Serif 4 as the reading serif instead of Newsreader for
that reason: same role, one fewer binary, already on the site.

## Open item

`Archivo-OFL.txt` and `Datatype-OFL.txt` are included. The OFL copies for
Source Serif 4 and Spline Sans Mono are **not** in this zip — drop each
family's `LICENSE`/`OFL.txt` in from its upstream repository beside the
binaries before publishing. The files are already OFL-licensed and already
shipping on adamr.io today; this is a redistribution-hygiene item, not a
blocker, and it is the only unfinished thing in the handoff.

## Datatype

Datatype renders inline charts by ligature substitution, so the markup stays
readable text. Keep the raw expression meaningful — if the font fails to load
the reader sees the numbers, not a broken glyph run. Ink only, no colour, which
is why it survives the grayscale gate.
