// Run of MED-0036: the same measurement, which measured the parts cited by flows from different areas; this record keeps the part about the focus of the resume branch (ENT-L08-0006 and ENT-L08-0008).
/* global console, document, getComputedStyle, window */
// MED-0036 — the browser-computed values that the id cites.
//  - L08 (ENT-L08-0006, ENT-L08-0008): the focus (the document's active element) of the resume branch
//    (src/editor/motion/runtime/behaviours.ts:109), measured in the element's document (the canvas frame).
//  - L09a (ENT-L09a-0052, ENT-L09a-0053): the box of the colour anchor field and the height of the picker popover
//    (src/editor/shell/color.tsx:336 and :337).
//  - L09a (ENT-L09a-0110, ENT-L09a-0111): the active element when a text field's value list closes
//    (src/editor/shell/field.tsx:1090) — another state; see MED-0036.md.
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

for (const [configName, c] of Object.entries(CONFIGS)) {
  // L08 — the active element of the document of the element under the marquee (the resume branch reads document.activeElement)
  const a = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }, { command: 'motion.setBehaviour', args: { behaviour: 'marquee', amount: 60 } }]);
  for (const b of await a.page.locator('.menu-button').all()) { if (/Exibir|View/.test((await b.textContent()) ?? '')) { await b.click(); break; } }
  await a.page.waitForTimeout(200);
  await a.page.click('[data-door="motion.toggleRun#menu-view-run-interactions"]').catch(() => {});
  await a.page.waitForTimeout(700);
  const focus = await a.page.evaluate(() => {
    const w = document.querySelector('.frame__page').contentWindow;
    const el = w.document.querySelector('h1');
    const active = w.document.activeElement;
    return { ownerTag: active?.tagName ?? null, ownerIsBody: active === w.document.body, elementContainsActive: el.contains(active), elementHover: el.matches(':hover') };
  });
  await a.browser.close();

  // L09a — the colour picker
  const b = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  await b.page.click('[data-door="workspace.setPanelOpen#toolbar-activity-bar-styles"]');
  await b.page.waitForTimeout(500);
  const swatchSelector = `[data-door="colorPicker.open#field-color-swatch"][data-args='${JSON.stringify({ property: 'color' })}']`;
  await b.page.click(swatchSelector);
  await b.page.waitForTimeout(400);
  const color = await b.page.evaluate((sel) => {
    const swatch = document.querySelector(sel);
    const popover = document.querySelector('[style*="--picker-top"]');
    if (swatch === null || popover === null) return { error: 'the colour picker did not open' };
    const box = swatch.getBoundingClientRect();
    return { anchorTop: box.top, anchorLeft: box.left, anchorHeight: box.height, popoverHeight: popover.offsetHeight, pickerTop: getComputedStyle(popover).getPropertyValue('--picker-top').trim(), windowHeight: window.innerHeight };
  }, swatchSelector);
  await b.browser.close();

  console.log(JSON.stringify({ config: configName, focus, color }));
}
