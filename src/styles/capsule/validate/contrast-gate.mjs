#!/usr/bin/env node
// scripts/contrast-gate.mjs — the contrast gate.
// Asserts the full cartesian product: every text role, on every surface, in
// every stock, at 4.5:1 (3:1 for large text and non-text UI parts per 1.4.11).
// APCA Lc printed beside each result as advisory only. Exits non-zero on any fail.
import { contrastRatio, apcaLc } from './lib/color.mjs';
import { resolveStocks, BODY_TEXT_ROLES, EXTRA_BODY_ROLES, LARGE_ONLY_ROLES, CONTROL_BORDER_ROLES, REVERSED_PAIRS } from './lib/tokens.mjs';

const stocks = resolveStocks();
let failures = 0;
const rows = [];

function assert(label, fg, bg, min) {
  const ratio = contrastRatio(fg, bg);
  const lc = apcaLc(fg, bg);
  const pass = ratio >= min;
  if (!pass) failures++;
  rows.push({ label, fg, bg, ratio: ratio.toFixed(2), min: min.toFixed(1), lc, pass });
}

for (const [stock, r] of Object.entries(stocks)) {
  const bg = r['surface.page'];
  for (const role of BODY_TEXT_ROLES) assert(`${stock} · ${role} on surface.page`, r[role], bg, 4.5);
  for (const role of EXTRA_BODY_ROLES) assert(`${stock} · ${role} on surface.page`, r[role], bg, 4.5);
  for (const role of LARGE_ONLY_ROLES) assert(`${stock} · ${role} on surface.page (large/non-text)`, r[role], bg, 3.0);
  for (const role of CONTROL_BORDER_ROLES) assert(`${stock} · ${role} vs surface.page (1.4.11)`, r[role], bg, 3.0);
  // Every text tier also has to hold on the two secondary surfaces.
  for (const surf of ['surface.sunken', 'surface.inset']) {
    for (const role of BODY_TEXT_ROLES) assert(`${stock} · ${role} on ${surf}`, r[role], r[surf], 4.5);
  }
  // Reversed text riding a solid fill (ink slab, pigment fills).
  for (const [fg, fill] of REVERSED_PAIRS) assert(`${stock} · ${fg} on ${fill}`, r[fg], r[fill], 4.5);
  // Primary button: fill vs its own label.
  assert(`${stock} · primary.text on primary.fill`, r['primary.text'], r['primary.fill'], 4.5);
}

const pad = (s, n) => String(s).padEnd(n);
console.log('\nCAPSULE CONTRAST GATE — WCAG 2.x relative luminance (APCA Lc advisory)\n');
console.log(pad('pair', 52), pad('ratio', 8), pad('min', 6), pad('APCA', 8), 'verdict');
console.log('-'.repeat(88));
for (const row of rows) {
  console.log(pad(row.label, 52), pad(row.ratio + ':1', 8), pad(row.min, 6), pad(row.lc + ' Lc', 8), row.pass ? 'PASS' : 'FAIL');
}
console.log('-'.repeat(88));
if (failures) { console.error(`\n${failures} contrast failure(s). Build blocked.\n`); process.exit(1); }
console.log(`\nAll ${rows.length} contrast pairs pass.\n`);
