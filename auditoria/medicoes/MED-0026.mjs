/* global console, document, performance, setTimeout, window */
// MED-0026 — the reduced-motion preference, read in src/editor/canvas/chrome.tsx:645
// `const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;` (ENT-L07-0016, step 5).
// Run: cat auditoria/medicoes/MED-0026.mjs | node --input-type=module -
import { chromium } from '@playwright/test';

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

const BOOT = { commands: [], drawn: [] };

for (const [name, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: BOOT }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.evaluate(async () => {
    const port = () => window.__builderTestPort;
    const until = performance.now() + 10000;
    while (document.querySelector('.workbench') === null && performance.now() < until) await new Promise((r) => setTimeout(r, 5));
    while (port() === undefined && performance.now() < until) await new Promise((r) => setTimeout(r, 5));
    await new Promise((r) => setTimeout(r, 200));
  });
  const value = await page.evaluate(() => ({
    reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    noPreference: window.matchMedia('(prefers-reduced-motion: no-preference)').matches,
    devicePixelRatio: window.devicePixelRatio,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  }));
  console.log(JSON.stringify({ config: name, value }));
  await browser.close();
}
