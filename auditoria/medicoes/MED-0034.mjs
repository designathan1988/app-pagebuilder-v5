/* global HTMLInputElement, HTMLTextAreaElement, WheelEvent, console, document, getComputedStyle, requestAnimationFrame, window */
// MED-0034 — the browser-computed values that the id cites.
//  - L08 (ENT-L08-0009): the length of the marquee track (src/editor/motion/runtime/behaviours.ts:100).
//  - L09a (ENT-L09a-0016): the stage's width and height as seen by the observer (src/editor/shell/canvas.tsx:265).
//  - L09a (ENT-L09a-0083, ENT-L09a-0084): the active element over the number field when the wheel fires
//    (src/editor/shell/field.tsx:127).
//  - L09b (ENT-L09b-0023 to ENT-L09b-0028): the active element and the widths of the inspector rows
//    (src/editor/shell/row-fit.ts:107, :47, :60).
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
  // L08 — the title's marquee: the track length
  const a = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }, { command: 'motion.setBehaviour', args: { behaviour: 'marquee', amount: 60 } }]);
  for (const b of await a.page.locator('.menu-button').all()) { if (/Exibir|View/.test((await b.textContent()) ?? '')) { await b.click(); break; } }
  await a.page.waitForTimeout(200);
  await a.page.click('[data-door="motion.toggleRun#menu-view-run-interactions"]').catch(() => {});
  await a.page.waitForTimeout(700);
  const marquee = await a.page.evaluate(() => {
    const w = document.querySelector('.frame__page').contentWindow;
    const el = w.document.querySelector('h1');
    const holder = el.querySelector('div');
    const track = holder?.firstElementChild;
    return { overflow: w.getComputedStyle(el).overflow, trackLength: track?.offsetWidth ?? null, holderWidth: holder?.offsetWidth ?? null };
  });
  await a.browser.close();

  // L09a — the stage's content box, the wheel over the number field; L09b — the inspector rows
  const b = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  await b.page.click('[data-door="workspace.setPanelOpen#toolbar-activity-bar-styles"]');
  await b.page.waitForTimeout(500);
  const measured = await b.page.evaluate(() => {
    const stage = document.querySelector('[data-canvas-stage]');
    const sStyle = getComputedStyle(stage);
    const content = { width: stage.clientWidth - (parseFloat(sStyle.paddingLeft) || 0) - (parseFloat(sStyle.paddingRight) || 0), height: stage.clientHeight - (parseFloat(sStyle.paddingTop) || 0) - (parseFloat(sStyle.paddingBottom) || 0) };
    const row = document.querySelector('.field-row');
    const rowStyle = row ? getComputedStyle(row) : null;
    return {
      stageContent: content,
      row: row ? { clientWidth: row.clientWidth, paddingLeft: rowStyle.paddingLeft, paddingRight: rowStyle.paddingRight, gridTemplateColumns: rowStyle.gridTemplateColumns, stacked: 'stacked' in row.dataset } : null,
      typing: document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement ? document.activeElement.tagName : null,
    };
  });
  const wheel = await b.page.evaluate(async () => {
    const input = document.querySelector('.inspector input.box__input');
    if (input === null) return { error: 'no number field' };
    input.focus();
    const atFocus = document.activeElement === input;
    input.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true }));
    await new Promise((r) => requestAnimationFrame(r));
    return { fieldFocused: atFocus, activeIsField: document.activeElement === input };
  });
  await b.browser.close();

  console.log(JSON.stringify({ config: name, marquee, ...measured, wheel }));
}
