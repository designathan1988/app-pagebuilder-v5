/* global HTMLInputElement, HTMLTextAreaElement, console, document */
// MED-0051 — the document's active element (document.activeElement), on which the decision of step 4 of
// auditoria/fluxos/ENT-L05a-0027.md depends (`src/editor/input/keymap.ts:576`
// `if (event.target instanceof Node && event.target !== event.target.ownerDocument?.activeElement) {`).
//
// State: the editor open with a real project (manifest/features/fixtures/aurora.json), the card n-card-a
// chosen and the inspector's Style tab showing. The active element is measured at two focus moments: (a) with no
// field focused, as the editor opens; (b) with focus in the font family field, the state in which an undo/redo
// `beforeinput` would carry an `event.target` equal to the active element.
//
// Run from the root: cat auditoria/medicoes/MED-0051.mjs | node --input-type=module -
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

const COMMANDS = [
  { command: 'workspace.setPanelOpen', args: { panel: 'inspector', open: 'open' } },
  { command: 'workspace.setActiveTab', args: { group: 'inspector', panel: 'style' } },
  { command: 'inspector.setMode', args: { mode: 'all' } },
  { command: 'selection.select', args: { target: 'n-card-a' } },
];

const describeActive = () => {
  const el = document.activeElement;
  return {
    tag: el.tagName,
    class: String(el.className).slice(0, 60),
    ariaLabel: el.getAttribute === undefined ? null : el.getAttribute('aria-label'),
    isInput: el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement,
  };
};

for (const [configName, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: COMMANDS, drawn: [] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForSelector('.workbench');
  await page.waitForTimeout(600);

  const unfocused = await page.evaluate(describeActive);

  const field = page.locator('[data-door="style.set#inspector-font-family"] input').first();
  await field.click();
  await page.waitForTimeout(200);
  const focused = await page.evaluate(describeActive);

  console.log(JSON.stringify({ config: configName, no_focus: unfocused, focus_in_field: focused }));
  await browser.close();
}
