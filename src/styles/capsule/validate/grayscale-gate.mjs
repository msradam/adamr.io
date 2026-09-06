#!/usr/bin/env node
// scripts/grayscale-gate.mjs — the grayscale gate.
// Re-runs the contrast math with every token pushed through Rec.601 luma.
// Proves the hierarchy-survives-grayscale invariant mechanically: structure
// must hold without hue, and the three text tiers must stay distinguishable.
import { contrastRatio, toGray } from './lib/color.mjs';
import { resolveStocks, BODY_TEXT_ROLES } from './lib/tokens.mjs';

const stocks = resolveStocks();
let failures = 0;
const rows = [];

for (const [stock, r] of Object.entries(stocks)) {
  const bg = toGray(r['surface.page']);
  // Text still meets its gate after desaturation.
  for (const role of BODY_TEXT_ROLES) {
    const ratio = contrastRatio(toGray(r[role]), bg);
    const pass = ratio >= 4.5;
    if (!pass) failures++;
    rows.push({ label: `${stock} · ${role} (gray)`, ratio: ratio.toFixed(2), pass });
  }
  // Adjacent text tiers stay separable (>= 1.2:1 between neighbours).
  const tiers = BODY_TEXT_ROLES.map(role => toGray(r[role]));
  for (let i = 0; i < tiers.length - 1; i++) {
    const sep = contrastRatio(tiers[i], tiers[i + 1]);
    const pass = sep >= 1.2;
    if (!pass) failures++;
    rows.push({ label: `${stock} · tier separation ${i}->${i + 1} (gray)`, ratio: sep.toFixed(2), pass });
  }
}

console.log('\nCAPSULE GRAYSCALE GATE — Rec.601 luma, hierarchy must survive\n');
for (const row of rows) console.log('  ' + (row.pass ? '✓' : '✗') + ' ' + row.label.padEnd(44) + row.ratio + ':1');
if (failures) { console.error(`\n${failures} grayscale failure(s). Build blocked.\n`); process.exit(1); }
console.log('\n  Hierarchy survives grayscale.\n');
