/* global CSS, console, document, getComputedStyle, performance, setTimeout, window */
// MED-0023 — the box of the captured element in the page, read in src/editor/canvas/chrome.tsx:602
// `const found = iframe && origin ? capturedBox(iframe, id) : null;` (ENT-L07-0015, step 4).
// State: the captured-mixed.json project open and a captured element selected (capture.select).
// The box is read from the drawn outline ([data-chrome="captured-selection"]) and from the label tag
// ([data-chrome="captured-label"]), and recomputed by capturedBox (src/editor/canvas/coordinates.ts:131) from the same
// values the browser computes.
// Run: cat auditoria/medicoes/MED-0023.mjs | node --input-type=module -
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const PROJECT = fs.readFileSync('manifest/features/fixtures/captured-mixed.json', 'utf8');
const CAPTURED = 'captured-story';
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};
const BOOT = { project: PROJECT, commands: [{ command: 'capture.select', args: { target: CAPTURED } }], drawn: [] };

const MEASURE = (id) => {
  const iframe = document.querySelector('.frame__page');
  const geometryOf = (f) => {
    const win = f.contentWindow;
    const zoom = f.currentCSSZoom;
    const box = f.getBoundingClientRect();
    if (!win || !f.contentDocument || !(zoom > 0) || box.width === 0) return null;
    const st = getComputedStyle(f);
    return { left: box.left + (parseFloat(st.borderLeftWidth) + parseFloat(st.paddingLeft)) * zoom, top: box.top + (parseFloat(st.borderTopWidth) + parseFloat(st.paddingTop)) * zoom, zoom };
  };
  const g = geometryOf(iframe);
  const element = iframe.contentDocument.querySelector(`[data-capture-node="${CSS.escape(id)}"]`);
  const r = element === null ? null : element.getBoundingClientRect();
  const screen = element === null || g === null ? null : { x: g.left + r.left * g.zoom, y: g.top + r.top * g.zoom, width: r.width * g.zoom, height: r.height * g.zoom };
  const frame = document.querySelector('[data-chrome="captured-selection"]');
  const label = document.querySelector('[data-chrome="captured-label"]');
  return {
    capturedId: id,
    found: screen === null ? null : { box: screen, tag: element.localName },
    drawnFrame: frame === null ? null : { left: frame.style.left, top: frame.style.top, width: frame.style.width, height: frame.style.height },
    drawnTag: label === null ? null : label.textContent,
    zoom: iframe?.currentCSSZoom ?? null,
  };
};

for (const [name, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: BOOT }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.evaluate(async (n) => {
    const until = performance.now() + 10000;
    const ready = () => document.querySelector('.workbench') !== null && window.__builderTestPort !== undefined && window.__builderTestPort.boot().length >= n;
    while (!ready() && performance.now() < until) await new Promise((r) => setTimeout(r, 10));
    await new Promise((r) => setTimeout(r, 500));
  }, BOOT.commands.length + 1);
  const boot = await page.evaluate(() => window.__builderTestPort.boot().map((b) => `${b.command}:${b.status}`));
  const value = await page.evaluate(MEASURE, CAPTURED);
  console.log(JSON.stringify({ config: name, boot, value }));
  await browser.close();
}
