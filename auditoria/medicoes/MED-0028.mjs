/* global NodeFilter, console, document, getComputedStyle, performance, setTimeout, window */
// MED-0028 — the content boxes of the page, read in src/editor/canvas/chrome.tsx:456
// `const content = [...contentBoxes(iframe).map((b) => local(b) as Box), ...(layer.current === null ? [] : controlBoxes(layer.current, origin))];` (ENT-L07-0011, step 10).
// State: the aurora.json project open, the Hero selected (the label is placed with these boxes: the frame loop
// reads them in src/editor/canvas/chrome.tsx:744). The content boxes of the page are recomputed by contentBoxes
// (src/editor/canvas/coordinates.ts:485) from the same values the browser computes (Range.getClientRects of each
// text node and getBoundingClientRect of each replaced element).
// Run: cat auditoria/medicoes/MED-0028.mjs | node --input-type=module -
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const AURORA = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};
const REPLACED = 'img, picture, video, audio, canvas, svg, iframe, embed, object, input, textarea, select, button, progress, meter';

const MEASURE = (replaced) => {
  const iframe = document.querySelector('.frame__page');
  const doc = iframe.contentDocument;
  const g = (() => {
    const win = iframe.contentWindow;
    const zoom = iframe.currentCSSZoom;
    const box = iframe.getBoundingClientRect();
    if (!win || !doc || !(zoom > 0) || box.width === 0) return null;
    const st = getComputedStyle(iframe);
    return { left: box.left + (parseFloat(st.borderLeftWidth) + parseFloat(st.paddingLeft)) * zoom, top: box.top + (parseFloat(st.borderTopWidth) + parseFloat(st.paddingTop)) * zoom, zoom };
  })();
  const toScreen = (r) => ({ x: g.left + r.left * g.zoom, y: g.top + r.top * g.zoom, width: r.width * g.zoom, height: r.height * g.zoom });
  const boxes = [];
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const range = doc.createRange();
  for (let text = walker.nextNode(); text !== null; text = walker.nextNode()) {
    if ((text.textContent ?? '').trim() === '') continue;
    range.selectNodeContents(text);
    for (const r of range.getClientRects()) if (r.width > 0 && r.height > 0) boxes.push({ from: 'text', text: text.textContent.trim(), ...toScreen(r) });
  }
  for (const element of doc.body.querySelectorAll(replaced)) {
    const r = element.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) boxes.push({ from: element.localName, ...toScreen(r) });
  }
  const xs = boxes.map((b) => b.x), ys = boxes.map((b) => b.y);
  return {
    count: boxes.length,
    union: boxes.length === 0 ? null : { left: Math.min(...xs), top: Math.min(...ys), right: Math.max(...boxes.map((b) => b.x + b.width)), bottom: Math.max(...boxes.map((b) => b.y + b.height)) },
    firstBoxes: boxes.slice(0, 6),
    zoom: iframe.currentCSSZoom,
  };
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
  const value = await page.evaluate(MEASURE, REPLACED);
  console.log(JSON.stringify({ config: name, value }));
  await browser.close();
}
