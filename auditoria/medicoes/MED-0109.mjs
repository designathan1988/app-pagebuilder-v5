// Run of MED-0016: the same measurement, which measured the parts cited by flows from different areas; this record keeps the part about the document's active element in the second frame, ENT-L05b-0043.
/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0016 — the id is cited by two areas with distinct values, both measured:
//  (a) ENT-L05b-0043 (focus.ts:195): the document's active element in the second frame, on which the decision to move focus
//      depends;
//  (b) ENT-L07-0035 (frame.tsx:57-58): the height of the frame's view, the `contentRect.height` of `.frame__view`;
//      ENT-L07-0075, 0076 (rulers.tsx:57-58): the box of the ruler bands (`.ruler--x`, `.ruler--y`).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/grid-page.json', 'utf8');
const COMMANDS = [{ command: 'selection.select', args: { target: { $node: '/Page/Grid' } } }];

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

for (const [configName, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: COMMANDS } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.evaluate(async () => {
    const port = () => window.__builderTestPort;
    const until = performance.now() + 10000;
    while ((port()?.boot().length ?? -1) < 2 && performance.now() < until) await new Promise((r) => setTimeout(r, 20));
    await new Promise((r) => setTimeout(r, 400));
  });
  const value = await page.evaluate(() => {
    const view = document.querySelector('.frame__view');
    const vb = view.getBoundingClientRect();
    const vbStyle = getComputedStyle(view);
    const ruler = (sel) => { const el = document.querySelector(sel); if (el === null) return null; const r = el.getBoundingClientRect(); return { hidden: el.hidden, start: sel === '.ruler--x' ? r.left : r.top, length: sel === '.ruler--x' ? r.width : r.height, box: { left: r.left, top: r.top, width: r.width, height: r.height } }; };
    const active = document.activeElement;
    return {
      viewHeight: vb.height - (parseFloat(vbStyle.borderTopWidth) || 0) - (parseFloat(vbStyle.borderBottomWidth) || 0) - (parseFloat(vbStyle.paddingTop) || 0) - (parseFloat(vbStyle.paddingBottom) || 0),
      viewBox: { left: vb.left, top: vb.top, width: vb.width, height: vb.height },
      rulerX: ruler('.ruler--x'), rulerY: ruler('.ruler--y'),
      active: { tag: active.tagName, isBody: active === document.body },
    };
  });
  console.log(JSON.stringify({ config: configName, value }));
  await browser.close();
}
