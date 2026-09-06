// scripts/lib/color.mjs — zero-dependency color math.
// WCAG 2.x relative luminance + contrast, implemented directly.
// APCA Lc is computed as advisory output only; nothing gates on it.

export function hexToRgb(hex) {
  const h = hex.replace('#', '').trim();
  const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  return [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16));
}

// WCAG relative luminance. sRGB -> linear -> weighted sum.
export function relativeLuminance(hex) {
  const lin = hexToRgb(hex).map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

// WCAG contrast ratio, 1..21.
export function contrastRatio(fg, bg) {
  const a = relativeLuminance(fg);
  const b = relativeLuminance(bg);
  const [hi, lo] = a >= b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

// APCA Lc (advisory only — SAPC-0.0.98G-4g constants). Sign = polarity.
export function apcaLc(text, bg) {
  const Y = (hex) => {
    const [r, g, b] = hexToRgb(hex).map(v => Math.pow(v / 255, 2.4));
    return 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
  };
  let Ytxt = Y(text), Ybg = Y(bg);
  const clamp = (y) => (y < 0.022 ? y + Math.pow(0.022 - y, 1.414) : y);
  Ytxt = clamp(Ytxt); Ybg = clamp(Ybg);
  let Lc;
  if (Ybg > Ytxt) Lc = (Math.pow(Ybg, 0.56) - Math.pow(Ytxt, 0.57)) * 1.14;
  else Lc = (Math.pow(Ybg, 0.65) - Math.pow(Ytxt, 0.62)) * 1.14;
  Lc = Math.abs(Lc) < 0.1 ? 0 : (Lc > 0 ? (Lc - 0.027) * 100 : (Lc + 0.027) * 100);
  return Math.round(Lc * 10) / 10;
}

// Rec. 601 luma grayscale, used by the grayscale gate.
export function toGray(hex) {
  const [r, g, b] = hexToRgb(hex);
  const y = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  const h = y.toString(16).padStart(2, '0');
  return '#' + h + h + h;
}
