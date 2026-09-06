#!/usr/bin/env node
// scripts/verify.mjs — the entry point CI runs before anything builds.
// Runs each deterministic gate in order; the first non-zero exit blocks the build.
// The behavioral gate (Playwright + axe-core, target sizes) runs separately in CI
// because it needs a browser; see .github/workflows/verify.yml.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const gates = ['contrast-gate.mjs', 'rules-lint.mjs', 'grayscale-gate.mjs', 'drift-gate.mjs'];

console.log('\n=== CAPSULE DETERMINISTIC VERIFICATION ===');
for (const gate of gates) {
  const res = spawnSync(process.execPath, [join(HERE, gate)], { stdio: 'inherit' });
  if (res.status !== 0) { console.error(`\nBLOCKED at ${gate}.\n`); process.exit(res.status || 1); }
}
console.log('=== ALL DETERMINISTIC GATES PASS ===\n');
