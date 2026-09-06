// scripts/lib/tokens.mjs — resolve the DTCG file into flat per-stock role maps.
// Zero dependencies. Primitives are never treated as consumable roles.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = join(HERE, '..', '..', 'tokens', 'tokens.dtcg.json');

export function loadTokens() {
  return JSON.parse(readFileSync(TOKENS_PATH, 'utf8'));
}

// Resolve a {primitive.color.x.y} alias to its hex.
function resolveAlias(ref, tokens) {
  const path = ref.replace(/[{}]/g, '').split('.');
  let node = tokens;
  for (const key of path) node = node?.[key];
  return node?.$value ?? node;
}

// -> { paper: {role: hex, ...}, slate: {...} }
export function resolveStocks() {
  const tokens = loadTokens();
  const out = {};
  for (const [stock, roles] of Object.entries(tokens.stock)) {
    if (stock === '$description') continue;
    out[stock] = {};
    for (const [role, ref] of Object.entries(roles)) {
      out[stock][role] = resolveAlias(ref, tokens);
    }
  }
  return out;
}

// The full primitive hex allowlist (every raw value that may appear in built CSS).
export function primitiveAllowlist() {
  const tokens = loadTokens();
  const hexes = new Set();
  const walk = (node) => {
    if (node && typeof node === 'object') {
      if (typeof node.$value === 'string' && /^#[0-9a-fA-F]{3,6}$/.test(node.$value)) {
        hexes.add(node.$value.toUpperCase());
      }
      for (const v of Object.values(node)) walk(v);
    }
  };
  walk(tokens.primitive);
  hexes.add('#0000'); hexes.add('#FFFCF0'); // transparent shorthand + paper already included
  return hexes;
}

// Which roles are body-text (must hit 4.5) vs large/non-text (3:1 is enough).
// BODY_TEXT_ROLES is also the ORDERED text-tier list: the grayscale gate
// asserts each neighbouring pair stays separable, so aliases of a tier
// (text.body, text.muted) belong in EXTRA_BODY_ROLES, not here.
export const BODY_TEXT_ROLES = ['text.primary', 'text.secondary', 'text.tertiary'];

// Also gated at 4.5:1, but not part of the tier ladder. accent.ink sits here
// because Capsule uses it for links at body size — which is why the accent is
// cyan-700 (6.0:1) and not Flexoki cyan-600 (4.4:1).
export const EXTRA_BODY_ROLES = ['text.body', 'text.muted', 'accent.ink', 'accent.success', 'accent.feature'];

export const LARGE_ONLY_ROLES = ['text.disabled', 'accent.danger', 'state.danger', 'focus.ring']; // 3:1
export const CONTROL_BORDER_ROLES = ['border.control', 'border.hairline']; // 3:1 vs surface (1.4.11)

// Ink-slab and pigment-fill pairs: reversed text riding a solid fill.
export const REVERSED_PAIRS = [
  ['text.on-fill', 'surface.inverted'],
  ['text.on-accent', 'accent.ink'],
  ['text.on-fill', 'accent.success'],
  ['text.on-fill', 'accent.feature'],
];
