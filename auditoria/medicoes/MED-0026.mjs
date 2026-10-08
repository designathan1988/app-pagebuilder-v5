/* global console, document, performance, setTimeout, window */
// MED-0026 — a preferência de movimento reduzido, lida em src/editor/canvas/chrome.tsx:645
// `const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;` (ENT-L07-0016, passo 5).
// Roda: cat auditoria/medicoes/MED-0026.mjs | node --input-type=module -
import { chromium } from '@playwright/test';

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

const BOOT = { commands: [], drawn: [] };

for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
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
  const valor = await page.evaluate(() => ({
    reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    noPreference: window.matchMedia('(prefers-reduced-motion: no-preference)').matches,
    devicePixelRatio: window.devicePixelRatio,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  }));
  console.log(JSON.stringify({ config: nome, valor }));
  await browser.close();
}
