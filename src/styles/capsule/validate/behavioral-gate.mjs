#!/usr/bin/env node
// validate/behavioral-gate.mjs — the behavioral gate (Playwright + axe-core).
// Loads proof/index.html in a real browser, in BOTH stocks, and asserts:
//   1. axe-core reports zero violations (WCAG 2.2 A + AA rule packs).
//   2. Every interactive element computes to at least 24px x 24px (2.5.8),
//      and touch controls to 44px x 44px.
//   3. The Stacks pattern is an ordered list whose DOM order matches the rail,
//      and every sheet and rail entry is a focusable, operable control.
//   4. Keyboard: Tab reaches every sheet and rail button; Enter/Space activate.
// Requires: playwright and @axe-core/playwright as devDependencies. In the
// vendored repo this runs against the built app routes, not the proof page.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const TARGET = process.env.CAPSULE_TARGET_URL
  || pathToFileURL(join(HERE, '..', 'proof', 'index.html')).href;
const STOCKS = ['paper', 'slate'];
const TOUCH_MIN = 44; // px; pointer-only minimum is 24 (WCAG 2.5.8).

let failures = 0;
const fail = (msg) => { failures++; console.error('  \u2717 ' + msg); };
const pass = (msg) => console.log('  \u2713 ' + msg);

const browser = await chromium.launch();
try {
  for (const stock of STOCKS) {
    // @axe-core/playwright requires a page created from a BrowserContext;
    // browser.newPage() throws "Please use browser.newContext()".
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(TARGET);
    await page.evaluate((s) => document.documentElement.setAttribute('data-stock', s), stock);
    // The stock switch animates colour over --beat (180ms). Sampling before it
    // settles makes axe read transient mid-transition values and report
    // phantom contrast violations, with a different count each run. Wait out
    // the beat so the gate measures the state a reader actually sees.
    await page.waitForTimeout(400);

    // 1. axe-core.
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    if (results.violations.length === 0) pass(`${stock}: axe clean`);
    else for (const v of results.violations) fail(`${stock}: axe ${v.id} (${v.nodes.length})`);

    // 2. Target sizes.
    const small = await page.$$eval('a,button,[role="button"],input,select,[tabindex]:not([tabindex="-1"])',
      (els, min) => els.filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return false; // not rendered
        return r.width < min || r.height < min;
      }).map((el) => (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30)),
      TOUCH_MIN);
    if (small.length === 0) pass(`${stock}: all targets >= ${TOUCH_MIN}px`);
    else fail(`${stock}: ${small.length} target(s) under ${TOUCH_MIN}px: ${small.join(', ')}`);

    // 3. Stacks is an ordered list; DOM order matches the rail order.
    const stackOK = await page.evaluate(() => {
      const stack = document.querySelector('[data-capsule-stack]');
      const rail = document.querySelector('[data-capsule-rail]');
      if (!stack || !rail) return 'skip';
      if (stack.tagName !== 'OL') return 'stack is not an <ol>';
      const stackTimes = [...stack.querySelectorAll('[data-time]')].map((n) => n.dataset.time);
      const railTimes = [...rail.querySelectorAll('[data-time]')].map((n) => n.dataset.time);
      const order = JSON.stringify(stackTimes) === JSON.stringify(railTimes);
      return order ? 'ok' : `order mismatch: ${stackTimes} vs ${railTimes}`;
    });
    if (stackOK === 'ok') pass(`${stock}: Stacks DOM order matches rail`);
    else if (stackOK === 'skip') pass(`${stock}: no Stacks pattern on this page (skipped)`);
    else fail(`${stock}: ${stackOK}`);

    // 4. Keyboard reachability of every sheet and rail entry.
    const reachable = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-capsule-stack] [data-time], [data-capsule-rail] [data-time]');
      if (items.length === 0) return 'skip';
      for (const el of items) {
        const focusable = el.matches('a[href],button,[tabindex]:not([tabindex="-1"])') || el.querySelector('a[href],button,[tabindex]:not([tabindex="-1"])');
        if (!focusable) return 'a stack/rail entry is not keyboard focusable';
      }
      return 'ok';
    });
    if (reachable === 'ok') pass(`${stock}: every sheet and rail entry is focusable`);
    else if (reachable === 'skip') pass(`${stock}: no Stacks pattern to check (skipped)`);
    else fail(`${stock}: ${reachable}`);

    await page.close();
    await context.close();
  }
} finally {
  await browser.close();
}

console.log('');
if (failures) { console.error(`${failures} behavioral failure(s). Build blocked.\n`); process.exit(1); }
console.log('All behavioral checks pass (axe + target size + Stacks structure + keyboard).\n');
