/* global console, document, performance, setTimeout, window */
// MED-0030 — the focus order and the selection of the typed field, set in src/editor/canvas/edit-handles.tsx:232
// `input.current?.focus();` and :233 `input.current?.select();` (ENT-L07-0030, steps 4 and 5).
// State: the aurora.json project open, the Hero selected; a spacing band is pressed without dragging, which
// opens the typed field (src/editor/input/pointer/events.ts:471 `if (opposite !== '') typedBand.open(entry.ref);`).
// The value is the document's active element after the field mounts and the field's own selection range.
// Run: cat auditoria/medicoes/MED-0030.mjs | node --input-type=module -
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const AURORA = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};
const BAND = '[data-canvas-overlay] [data-door="style.setSpacing#handle-padding-top-band"]';

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
  const box = await page.locator(BAND).boundingBox();
  // the point far from the selection label (which sits at the top of the frame), in the top padding band
  const at = { x: box.x + box.width / 2, y: box.y + box.height - 6 };
  await page.mouse.move(at.x, at.y);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(300);
  const value = await page.evaluate(() => {
    const form = document.querySelector('[data-band-field]');
    const input = form?.querySelector('input') ?? null;
    const active = document.activeElement;
    return {
      fieldMounted: form !== null,
      active: active === null ? null : { tag: active.tagName, className: active.className, isField: active === input },
      field: input === null ? null : { value: input.value, selectionStart: input.selectionStart, selectionEnd: input.selectionEnd, ariaLabel: input.getAttribute('aria-label') },
    };
  });
  console.log(JSON.stringify({ config: name, value }));
  await browser.close();
}
