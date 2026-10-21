/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0010 — the id is cited by three areas with different values; all three are measured:
//  (a) ENT-L05b-0027 (menu bar menu): src/editor/doors/menu.tsx:105-108 — the `--space-4` gap, the measured width of the
//      list, the natural height (`scrollHeight` plus borders) and the window size;
//  (b) ENT-L06-0039 (screenshot): src/editor/canvas/screenshot.ts:12-13 — frame.clientWidth/scrollWidth and
//      frame.clientHeight/scrollHeight and the resulting width/height (Math.ceil of the larger);
//  (c) ENT-L07-0002 and the others (chrome/canvas): geometryOf(iframe) — src/editor/canvas/coordinates.ts:62-71 — the box
//      of the frame with zoom and scroll, and the origin of the stage box (anchor-tabs.tsx:69).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/grid-page.json', 'utf8');
const COMMANDS = [{ command: 'selection.select', args: { target: { $node: '/Page/Grid' } } }];

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

for (const [name, c] of Object.entries(CONFIGS)) {
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
  const withoutMenu = await page.evaluate(() => {
    const n = (v) => parseFloat(v) || 0;
    const f = document.querySelector('.frame__page');
    const fb = f.getBoundingClientRect();
    const fsx = getComputedStyle(f);
    const zoom = f.currentCSSZoom;
    const geom = { left: fb.left + (n(fsx.borderLeftWidth) + n(fsx.paddingLeft)) * zoom, top: fb.top + (n(fsx.borderTopWidth) + n(fsx.paddingTop)) * zoom, zoom, scrollX: f.contentWindow.scrollX, scrollY: f.contentWindow.scrollY };
    const page_ = f.contentDocument;
    const stage = document.querySelector('[data-canvas-stage]').getBoundingClientRect();
    return {
      capture: {
        frameClientWidth: f.clientWidth, frameClientHeight: f.clientHeight,
        pageScrollWidth: page_.documentElement.scrollWidth, pageScrollHeight: page_.documentElement.scrollHeight,
        width: Math.ceil(Math.max(f.clientWidth, page_.documentElement.scrollWidth)),
        height: Math.ceil(Math.max(f.clientHeight, page_.documentElement.scrollHeight)),
      },
      geometryOf: geom,
      stageOrigin: { x: stage.x, y: stage.y, width: stage.width, height: stage.height },
    };
  });
  await page.locator('.menu-button[data-menu="file"]').first().click();
  await page.waitForTimeout(200);
  const menu = await page.evaluate(() => {
    const list = document.querySelector('.menu[role="menu"]');
    if (list === null) return null;
    const cs = getComputedStyle(list);
    return { width: list.getBoundingClientRect().width, space4: cs.getPropertyValue('--space-4').trim(), naturalHeight: list.scrollHeight + (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0), winWidth: window.innerWidth, winHeight: window.innerHeight };
  });
  console.log(JSON.stringify({ config: name, value: { ...withoutMenu, fileMenu: menu } }));
  await browser.close();
}
