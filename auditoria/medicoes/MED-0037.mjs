/* global console, document, getComputedStyle, window */
// MED-0037 — the browser-computed values that the id cites.
//  - L08 (ENT-L08-0013): the scrollable room, the page's scroll position and the element's box
//    (src/editor/motion/runtime/scroll.ts:49, :50 and :52), measured in the element's document (the canvas frame).
//  - L09a (ENT-L09a-0121, ENT-L09a-0122): the usable space of a value field's row, the computed style and the
//    width of the copy of the words (src/editor/shell/field.tsx:1407, :1408 and :1409).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/responsive-title.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

async function open(c, commands) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForFunction((n) => (window.__builderTestPort?.boot().length ?? -1) >= n, commands.length + 1).catch(() => {});
  await page.waitForTimeout(400);
  return { browser, page };
}

for (const [name, c] of Object.entries(CONFIGS)) {
  // L08 — the scrollable room, the scroll position and the element's box (the canvas frame)
  const a = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  const scroll = await a.page.evaluate(() => {
    const w = document.querySelector('.frame__page').contentWindow;
    const root = w.document.documentElement;
    const source = w.document.querySelector('h1');
    const box = source.getBoundingClientRect();
    const room = root.scrollHeight - w.innerHeight;
    return { scrollableRoom: room, scrollY: w.scrollY, innerHeight: w.innerHeight, scrollHeight: root.scrollHeight, sourceBox: { top: box.top, height: box.height }, pageScrollProgress: room <= 0 ? 1 : w.scrollY / room };
  });
  await a.browser.close();

  // L09a — the usable space of a value field's row
  const b = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  await b.page.click('[data-door="workspace.setPanelOpen#toolbar-activity-bar-styles"]');
  await b.page.waitForTimeout(500);
  const fieldChoice = await b.page.evaluate(() => [...document.querySelectorAll('.field-choice')].map((room) => {
    const style = getComputedStyle(room);
    const available = room.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
    const copy = room.querySelector('.field-choice__measure');
    const needed = copy?.offsetWidth ?? null;
    return { className: room.className.toString(), clientWidth: room.clientWidth, paddingLeft: style.paddingLeft, paddingRight: style.paddingRight, available, needed, fits: needed !== null ? available > 0 && needed > 0 && needed <= available + 0.5 : null };
  }));
  await b.browser.close();

  console.log(JSON.stringify({ config: name, scroll, fieldChoice }));
}
