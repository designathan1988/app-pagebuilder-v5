/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0012 — the id is cited by two areas with different values; both are measured:
//  (a) ENT-L05b-0029 (submenu): src/editor/doors/menu.tsx:118, 124, 127 — the measured width of the submenu, the item box
//      and the window size, on which each repositioning by the resize observer depends;
//  (b) ENT-L07-0021, 0056, 0058, 0067, 0068, 0071, 0072, 0073, 0074, 0075, 0076, 0077, 0078 (canvas): the frame zoom
//      (chrome.tsx:790, grid-editor.tsx:36) and the box of a node on screen (nodeBox, coordinates.ts:85-91 and 371-374).
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
  const frameInfo = await page.evaluate(() => {
    const n = (v) => parseFloat(v) || 0;
    const f = document.querySelector('.frame__page');
    const fb = f.getBoundingClientRect();
    const fsx = getComputedStyle(f);
    const zoom = f.currentCSSZoom;
    const left = fb.left + (n(fsx.borderLeftWidth) + n(fsx.paddingLeft)) * zoom;
    const top = fb.top + (n(fsx.borderTopWidth) + n(fsx.paddingTop)) * zoom;
    const el = f.contentDocument.querySelector('[data-node="n-grid"]');
    const r = el.getBoundingClientRect();
    return {
      zoom,
      frameBox: { left: fb.left, top: fb.top, width: fb.width, height: fb.height },
      nodeBox: { x: left + r.left * zoom, y: top + r.top * zoom, width: r.width * zoom, height: r.height * zoom },
    };
  });
  await page.locator('.menu-button[data-menu="view"]').first().click();
  await page.waitForTimeout(150);
  await page.locator('.menu__sub > .menu__item').first().click();
  await page.waitForTimeout(200);
  const submenu = await page.evaluate(() => {
    const sub = document.querySelector('.menu__sub.is-open');
    if (sub === null) return null;
    const list = sub.querySelector('.menu[role="menu"]');
    const item = sub.querySelector(':scope > .menu__item');
    const b = item.getBoundingClientRect();
    return { width: list.getBoundingClientRect().width, itemBox: { left: b.left, top: b.top, right: b.right, bottom: b.bottom }, winWidth: window.innerWidth, winHeight: window.innerHeight };
  });
  console.log(JSON.stringify({ config: name, value: { ...frameInfo, submenu } }));
  await browser.close();
}
