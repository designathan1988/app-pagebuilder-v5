// Run of MED-0017: the same measurement, which measured the parts cited by flows from different areas; this record keeps the part about the active element passed to carryOut, ENT-L05b-0044.
/* global console, document, performance, requestAnimationFrame, setTimeout, window */
// MED-0017 — the id is cited by two areas with distinct values, both measured:
//  (a) ENT-L05b-0044 (focus.ts:253): the document's active element passed to `carryOut`;
//  (b) ENT-L07-0052, 0053 (frame.tsx:229, 241): the scroll of the frame's page (`scrollY`); ENT-L07-0079
//      (screenshot.ts:12-13): the page's width and height in the capture.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

// canonical.json: the page is taller than the frame's view, so the page scrolls (grid-page fits whole).
const PROJECT = fs.readFileSync('manifest/features/fixtures/canonical.json', 'utf8');
const COMMANDS = [];

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
  const value = await page.evaluate(async () => {
    const f = document.querySelector('.frame__page');
    const doc = f.contentDocument;
    const before = f.contentWindow.scrollY;
    f.contentWindow.scrollTo(0, 120);
    await new Promise((r) => requestAnimationFrame(r));
    const after = f.contentWindow.scrollY;
    const active = document.activeElement;
    return {
      scrollYBefore: before,
      scrollYAfter: after,
      pageScrollX: f.contentWindow.scrollX,
      capture: {
        frameClientWidth: f.clientWidth, frameClientHeight: f.clientHeight,
        pageScrollWidth: doc.documentElement.scrollWidth, pageScrollHeight: doc.documentElement.scrollHeight,
        width: Math.ceil(Math.max(f.clientWidth, doc.documentElement.scrollWidth)),
        height: Math.ceil(Math.max(f.clientHeight, doc.documentElement.scrollHeight)),
      },
      active: { tag: active.tagName, isBody: active === document.body },
    };
  });
  console.log(JSON.stringify({ config: configName, value }));
  await browser.close();
}
