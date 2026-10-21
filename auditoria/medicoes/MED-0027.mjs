/* global CSS, console, document, performance, setTimeout, window */
// MED-0027 — the computed values of a node, read in src/editor/canvas/edit-handles.tsx:109
// `const values = computedValues(node, wanted, lineStyles(MODEL_RULES));` (ENT-L07-0027, step 2).
// State: the aurora.json project open, the Hero selected (EditHandles draws the bands and the useComputed loop reads the
// values). The properties read are those written by the band handles (spacing and gap): padding-* , margin-*,
// row-gap and column-gap. The value is read the way computedValues reads it (src/editor/canvas/coordinates.ts:527):
// `element.computedStyleMap()` -> `get(property).toString()` for the properties that are not line properties.
// Run: cat auditoria/medicoes/MED-0027.mjs | node --input-type=module -
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const AURORA = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};
const PROPS = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'row-gap', 'column-gap'];

const MEASURE = (props) => {
  const iframe = document.querySelector('.frame__page');
  const element = iframe.contentDocument.querySelector('[data-node="n-hero"]');
  if (element === null) return null;
  const map = element.computedStyleMap();
  const typed = (property) => (CSS.supports(property, 'initial') ? (map.get(property)?.toString() ?? '') : '');
  const values = Object.fromEntries(props.map((p) => [p, typed(p)]));
  const handles = [...document.querySelectorAll('[data-canvas-overlay] [data-edit-handle]')].map((h) => ({ door: h.dataset.door, start: h.dataset.start }));
  return { computedValues: values, drawnHandles: handles };
};

for (const [name, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  const boot = { project: AURORA, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Hero' } } }], drawn: [] };
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: boot }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.evaluate(async (n) => {
    const until = performance.now() + 10000;
    const ready = () => document.querySelector('.workbench') !== null && window.__builderTestPort !== undefined && window.__builderTestPort.boot().length >= n;
    while (!ready() && performance.now() < until) await new Promise((r) => setTimeout(r, 10));
    await new Promise((r) => setTimeout(r, 500));
  }, 2);
  const value = await page.evaluate(MEASURE, PROPS);
  console.log(JSON.stringify({ config: name, value }));
  await browser.close();
}
