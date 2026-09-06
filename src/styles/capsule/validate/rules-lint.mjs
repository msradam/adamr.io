#!/usr/bin/env node
// validate/rules-lint.mjs — the rules lint.
// Statically parses the built CSS (token layer + component layer) and fails on:
// any hex not in the primitive allowlist, any border-radius other than 0 on a
// non-control class, any box-shadow, any blur/gradient, any transition/animation
// longer than the single sanctioned beat, and any interactive class missing a
// :focus-visible rule.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { primitiveAllowlist } from './lib/tokens.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCES = [
  join(HERE, '..', 'tokens', 'capsule.tokens.css'),
  join(HERE, '..', 'css', 'capsule.components.css'),
];
const CSS = SOURCES.map((p) => readFileSync(p, 'utf8')).join('\n');
const SANCTIONED_BEAT_MS = 180;
const INTERACTIVE = ['.capsule-btn', '.capsule-btn--secondary', '.capsule-field__input', '.capsule-chip', '.capsule-rail__item', '.capsule-link'];

const errors = [];
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');
const css = stripComments(CSS);

// 1. Hex allowlist. The token-layer --* declarations carry raw primitives;
//    the component layer must reach them only through var().
const allow = primitiveAllowlist();
for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
  const hex = m[0].toUpperCase();
  if (!allow.has(hex)) errors.push(`Disallowed hex ${hex} (not a primitive token).`);
}

// 2. Radius: surfaces are square (0); only control classes may be pills
//    (chip / tag / toggle / switch / fab / key / pill — detached pressable controls).
const CONTROL_RE = /(chip|tag|toggle|switch|fab|key|pill)/i;
for (const rule of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
  const selector = rule[1].trim(), body = rule[2];
  for (const m of body.matchAll(/border-radius\s*:\s*([^;]+);/g)) {
    const v = m[1].trim();
    if (/^(0px|0|var\(--radius-surface\))$/.test(v)) continue;
    if (/^(999px|9999px|50%|var\(--radius-control\))$/.test(v) && CONTROL_RE.test(selector)) continue;
    errors.push(`border-radius ${v} on "${selector.slice(0, 40)}" — surfaces must be 0; pills only on control classes.`);
  }
}

// 3. No elevation vocabulary.
if (/box-shadow\s*:/.test(css)) errors.push('box-shadow present — elevation banned.');
if (/filter\s*:\s*[^;]*blur/.test(css)) errors.push('blur filter present — banned.');
// Gradient is banned in paint. The hatch pattern is the one sanctioned use and
// lives only in the --pattern-hatch token declaration.
const gradients = [...css.matchAll(/(linear|radial|conic)-gradient/g)];
const hatchDecls = [...css.matchAll(/--pattern-hatch\s*:[^;]*gradient/g)];
if (gradients.length > hatchDecls.length) errors.push('gradient present outside the --pattern-hatch token — banned.');

// 4. Motion budget: no transition/animation duration over the sanctioned beat.
for (const d of css.matchAll(/(?:transition|animation)[^;{}]*?(\d+(?:\.\d+)?)(ms|s)/g)) {
  const ms = parseFloat(d[1]) * (d[2] === 's' ? 1000 : 1);
  if (ms > SANCTIONED_BEAT_MS) errors.push(`Motion ${ms}ms exceeds the ${SANCTIONED_BEAT_MS}ms sanctioned beat.`);
}

// 5. Generated-UI signatures (the /impeccable "slop" catalog), as source rules.
//    These are patterns Capsule bans by grammar; the lint makes the ban checkable.
//    Reference: https://impeccable.style/slop
for (const rule of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
  const selector = rule[1].trim(), body = rule[2];
  // 5a. Side-tab accent border: a thick border on ONE side. The single most
  //     recognisable AI-UI tell, and a second line weight besides.
  for (const m of body.matchAll(/border-(left|right|top|bottom)\s*:\s*([^;]+);/g)) {
    const px = /(\d+(?:\.\d+)?)px/.exec(m[2]);
    const viaToken = /var\(--rule-(2|3)\)/.test(m[2]);
    if ((px && parseFloat(px[1]) >= 3) || /var\(--rule-3\)/.test(m[2])) {
      // The front-sheet seam is the one sanctioned two-px edge; 3px+ never ships.
      errors.push(`Thick one-side border "${m[0].trim()}" on "${selector.slice(0, 40)}" — side-tab accent borders are banned; Capsule has one 1px line.`);
    } else if (viaToken && /(left|right)/.test(m[1]) && !/rail|toc/i.test(selector)) {
      errors.push(`2px side border on "${selector.slice(0, 40)}" — reserved for the rail edge and the front-sheet seam.`);
    }
  }
  // 5b. Gradient text.
  if (/background-clip\s*:\s*text/.test(body) || /-webkit-background-clip\s*:\s*text/.test(body)) {
    errors.push(`Gradient text on "${selector.slice(0, 40)}" — text is solid ink.`);
  }
  // 5c. Layout-property animation (jank, and never calm).
  for (const m of body.matchAll(/transition\s*:\s*([^;]+);/g)) {
    if (/\b(width|height|padding|margin|top|left|right|bottom)\b/.test(m[1])) {
      errors.push(`Transition on a layout property in "${selector.slice(0, 40)}" — animate opacity or transform.`);
    }
  }
  // 5d. Undersized functional text.
  for (const m of body.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/g)) {
    if (parseFloat(m[1]) < 11) errors.push(`font-size ${m[1]}px on "${selector.slice(0, 40)}" — functional text stays at 11px or above.`);
  }
  // 5e. Wide tracking on running text (labels are exempt: they are short and uppercase).
  const isLabel = /label|eyebrow|folio|track|uppercase/i.test(selector) || /text-transform\s*:\s*uppercase/.test(body);
  for (const m of body.matchAll(/letter-spacing\s*:\s*(0?\.\d+)em/g)) {
    if (!isLabel && parseFloat(m[1]) > 0.05) errors.push(`letter-spacing ${m[1]}em on "${selector.slice(0, 40)}" — wide tracking is for short uppercase labels only.`);
  }
}

// 5f. Radial and conic gradients: halos and spotlights, banned outright.
if (/(radial|conic)-gradient/.test(css)) errors.push('radial/conic gradient present — glow halos and spotlights are banned.');
// 5g. Bounce / elastic easing: a cubic-bezier whose control points overshoot.
for (const m of css.matchAll(/cubic-bezier\(([^)]+)\)/g)) {
  const pts = m[1].split(',').map((n) => parseFloat(n));
  if (pts.some((n) => n > 1 || n < 0)) errors.push(`Overshooting easing ${m[0]} — interface motion eases out, it does not bounce.`);
}

// 7. Per-stock completeness of var()-valued tokens.
//    A custom property whose value contains var() is substituted at the element
//    where it is DECLARED, so a token defined once on :root keeps the default
//    stock's resolved value even after a stock re-points what it references.
//    The contrast gate cannot see this: it reads the DTCG stock maps, not the
//    built CSS. So it is checked here.
{
  const blocks = {};
  for (const rule of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    if (/\[data-stock="paper"\]/.test(rule[1])) blocks.paper = rule[2];
    if (/\[data-stock="slate"\]/.test(rule[1])) blocks.slate = rule[2];
  }
  if (blocks.paper && blocks.slate) {
    for (const m of blocks.paper.matchAll(/(--[\w-]+)\s*:\s*[^;]*var\([^;]*;/g)) {
      if (!new RegExp(m[1] + '\\s*:').test(blocks.slate)) {
        errors.push(`${m[1]} is var()-valued but declared only in the default stock — it keeps paper's resolved value in slate. Re-declare it in the slate block.`);
      }
    }
  }
}

// 8. Every interactive class must have a :focus-visible rule.
for (const sel of INTERACTIVE) {
  const re = new RegExp(sel.replace(/[.\-]/g, '\\$&') + ':focus-visible');
  if (!re.test(css)) errors.push(`${sel} has no :focus-visible rule.`);
}

console.log('\nCAPSULE RULES LINT — tokens/capsule.tokens.css + css/capsule.components.css\n');
if (errors.length) { for (const e of errors) console.error('  \u2717 ' + e); console.error(`\n${errors.length} rule violation(s). Build blocked.\n`); process.exit(1); }
console.log('  \u2713 hex allowlist  \u2713 radius (surfaces 0, controls pill)  \u2713 no elevation  \u2713 motion budget  \u2713 no generated-UI signatures  \u2713 focus-visible on all interactive classes\n');
