#!/usr/bin/env node
// validate/drift-gate.mjs — the drift diff.
// The token layer (tokens/capsule.tokens.css) is a build artifact. reference.css
// is the hand-verified source of truth. If a token build pipeline regenerates
// the vars, its output must match the reference byte for byte. Any divergence
// means a value drifted from the verified set; the build is blocked.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILT = join(HERE, '..', 'tokens', 'capsule.tokens.css');
const REFERENCE = join(HERE, '..', 'tokens', 'reference.css');

// Compare only the meaningful lines: --custom-property declarations. Comments
// and blank lines are ignored so formatting never trips the gate.
const decls = (src) =>
  src.split('\n')
    .map((l) => l.trim())
    .filter((l) => /^--[a-z0-9-]+\s*:/i.test(l))
    .sort();

console.log('\nCAPSULE DRIFT GATE — built token CSS vs hand-verified reference\n');

if (!existsSync(BUILT) || !existsSync(REFERENCE)) {
  console.log('  built or reference CSS missing — nothing to diff. Skipping.\n');
  process.exit(0);
}

const a = decls(readFileSync(BUILT, 'utf8'));
const b = decls(readFileSync(REFERENCE, 'utf8'));
const setB = new Set(b), setA = new Set(a);
const onlyBuilt = a.filter((l) => !setB.has(l));
const onlyRef = b.filter((l) => !setA.has(l));

if (onlyBuilt.length || onlyRef.length) {
  for (const l of onlyBuilt) console.error('  \u2717 built only:     ' + l);
  for (const l of onlyRef) console.error('  \u2717 reference only: ' + l);
  console.error(`\nToken drift detected. Build blocked. Fix the build to match reference.css; do not edit the reference to match a drift.\n`);
  process.exit(1);
}
console.log(`  \u2713 ${a.length} token declarations match the reference exactly.\n`);
