/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0031 — four distinct quantities cited under this same id in the flows:
//  (1) the value of (prefers-reduced-motion: reduce) (ENT-L08-0001/0002/0006/0008/0009/0010/0022), read in
//      src/editor/motion/runtime/start.ts:55 `const reduced = typeof win.matchMedia === 'function' ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;`;
//  (2) the distance from the pivot to the top of the frame (ENT-L07-0052, step 6), read in
//      src/editor/canvas/frame.tsx:224 `const at = pivot !== null ? pivot.y - frame.getBoundingClientRect().top : height / 2;`;
//  (3) the document's active element (ENT-L09a-0011, ENT-L09b-0005), read in
//      src/editor/shell/breakpoints-dialog.tsx:180 `    if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;`
//      and src/editor/shell/outside-layer.ts:41 `    const before = returnFocus?.current ?? anchor?.current ?? document.activeElement;`;
//  (4) the layer's box on screen, the frame zoom and the node boxes (ENT-L10a-0003, step 3), read in
//      src/modules/layout-composer/ui/overlay.tsx:83 `      const origin = layer.current?.parentElement?.getBoundingClientRect();`.
// Run: cat auditoria/medicoes/MED-0031.mjs | node --input-type=module -
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const AURORA = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

async function open(c, boot, waitFor) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: boot }));
  await page.goto('http://localhost:5399/?test-boot');
  const handed = (boot.project === undefined ? 0 : 1) + (boot.commands?.length ?? 0) + (boot.drawn?.length ?? 0);
  await page.evaluate(async ({ n, waitFor }) => {
    const until = performance.now() + 10000;
    const ready = () => document.querySelector('.workbench') !== null && window.__builderTestPort !== undefined && window.__builderTestPort.boot().length >= n && (waitFor === null || document.querySelector(waitFor) !== null);
    while (!ready() && performance.now() < until) await new Promise((r) => setTimeout(r, 10));
    await new Promise((r) => setTimeout(r, 500));
  }, { n: handed, waitFor });
  return { browser, page };
}

for (const [name, c] of Object.entries(CONFIGS)) {
  const value = {};
  // (1) reduced motion
  {
    const { browser, page } = await open(c, { commands: [], drawn: [] }, null);
    value.reducedMotion = await page.evaluate(() => ({ reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches }));
    await browser.close();
  }
  // (2) distance from the pivot to the top of the frame: view.zoomAt with a known point sets pivot = point
  {
    const POINT = { x: 640, y: 300 };
    const { browser, page } = await open(c, { project: AURORA, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Hero' } } }], drawn: [{ command: 'view.zoomAt', args: { factor: 1.25, point: POINT } }] }, null);
    value.pivot = await page.evaluate((point) => {
      const frame = document.querySelector('.frame__page');
      const top = frame.getBoundingClientRect().top;
      return { point, frameTop: top, at: point.y - top, zoom: frame.currentCSSZoom };
    }, POINT);
    await browser.close();
  }
  // (3) the document's active element: at rest and with the breakpoints dialog open
  {
    const { browser, page } = await open(c, { project: AURORA, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Hero' } } }], drawn: [] }, null);
    const idle = await page.evaluate(() => { const a = document.activeElement; return a === null ? null : { tag: a.tagName, className: a.className }; });
    await browser.close();
    const { browser: b2, page: p2 } = await open(c, { project: AURORA, commands: [{ command: 'workspace.openDialog', args: { dialog: 'breakpoints' } }], drawn: [] }, '[data-region="breakpoints-dialog"]');
    const dialog = await p2.evaluate(() => { const a = document.activeElement; return { tag: a?.tagName ?? null, className: a?.className ?? null, inDialog: a?.closest('[data-region="breakpoints-dialog"]') !== null && a !== null }; });
    await b2.close();
    value.activeElement = { idle, dialogOpen: dialog };
  }
  // (4) the layer's box, the frame zoom and a node's box, in the layout composer
  {
    const { browser, page } = await open(c, { project: AURORA, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Hero' } } }], drawn: [{ command: 'layout.enter', args: { target: { $node: '/Page/Hero' } } }] }, '[data-region="layout-composer-canvas"]:not([hidden])');
    value.layoutComposer = await page.evaluate(() => {
      const iframe = document.querySelector('.frame__page');
      const layer = document.querySelector('.layout-composer');
      const parent = layer?.parentElement;
      const origin = parent === undefined || parent === null ? null : (() => { const r = parent.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; })();
      const geometryOf = (f) => { const win = f.contentWindow; const zoom = f.currentCSSZoom; const box = f.getBoundingClientRect(); if (!win || !f.contentDocument || !(zoom > 0) || box.width === 0) return null; const st = getComputedStyle(f); return { left: box.left + (parseFloat(st.borderLeftWidth) + parseFloat(st.paddingLeft)) * zoom, top: box.top + (parseFloat(st.borderTopWidth) + parseFloat(st.paddingTop)) * zoom, zoom }; };
      const g = geometryOf(iframe);
      const element = iframe.contentDocument.querySelector('[data-node="n-hero"]');
      const r = element?.getBoundingClientRect();
      const nodeBox = element === undefined || g === null || r === undefined ? null : { x: g.left + r.left * g.zoom, y: g.top + r.top * g.zoom, width: r.width * g.zoom, height: r.height * g.zoom };
      return { origin, zoom: iframe.currentCSSZoom, composerShown: layer !== null && layer.getAttribute('hidden') === null, nodeBox };
    });
    await browser.close();
  }
  console.log(JSON.stringify({ config: name, value }));
}
