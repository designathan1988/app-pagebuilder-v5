/* global console, document, performance, setTimeout, window */
// MED-0022 — the text selection of the page being edited, read in src/editor/canvas/frame.tsx:113
// `const content = renderer.editedContent();` (ENT-L07-0044 step 3, ENT-L07-0045 step 3): what the draft stores
// (src/editor/canvas/frame.tsx:114 `if (node && content) saveCanvasDraft(node, content.runs, content.range);`).
// State: the aurora.json project open, the Title edited in place (text.startEdit), a typed change and a text
// selection. The value is read from the draft that captureDraft wrote to window.sessionStorage['editing-draft'] (runs and range
// are exactly those of editedContent).
// Run: cat auditoria/medicoes/MED-0022.mjs | node --input-type=module -
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const PROJECT = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};
const BOOT = {
  project: PROJECT,
  commands: [
    { command: 'selection.select', args: { target: { $node: '/Page/Hero/Title' } } },
    { command: 'text.startEdit', args: {} },
  ],
  drawn: [],
};

for (const [name, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: BOOT }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.evaluate(async (n) => {
    const until = performance.now() + 10000;
    const ready = () => document.querySelector('.workbench') !== null && window.__builderTestPort !== undefined && window.__builderTestPort.boot().length >= n;
    while (!ready() && performance.now() < until) await new Promise((r) => setTimeout(r, 10));
    await new Promise((r) => setTimeout(r, 400));
  }, BOOT.commands.length + 1);
  // in-place editing: the text is changed (the draft is only stored when the runs differ from the original) and a text
  // selection is left, so the draft range is a range and not a point
  await page.evaluate(() => document.querySelector('.frame__page').contentWindow.focus());
  await page.keyboard.type('X');
  await page.waitForTimeout(150);
  await page.keyboard.down('Shift');
  for (let i = 0; i < 5; i += 1) await page.keyboard.press('ArrowLeft');
  await page.keyboard.up('Shift');
  await page.waitForTimeout(250);
  const value = await page.evaluate(() => {
    const draft = JSON.parse(window.sessionStorage.getItem('editing-draft') ?? 'null');
    const f = document.querySelector('.frame__page');
    const s = f.contentWindow.getSelection();
    const el = f.contentDocument.querySelector('[contenteditable]');
    return {
      draft: draft === null ? null : { kind: draft.kind, node: draft.node, runs: draft.runs, range: draft.range },
      selectionText: s.toString(),
      editedHtml: el === null ? null : el.innerHTML,
    };
  });
  console.log(JSON.stringify({ config: name, value }));
  await browser.close();
}
