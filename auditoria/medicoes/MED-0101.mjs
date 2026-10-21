/* global console */
// MED-0101 — the gradient bar's box on screen, read in `src/editor/shell/gradient.tsx:116`
// `    const box = event.currentTarget.getBoundingClientRect();`, on which the stop's position depends
// (`src/editor/shell/gradient.tsx:117`
// `    const at = Math.round(Math.min(100, Math.max(0, ((event.clientX - box.left) / box.width) * 100)));`).
//
// State: the editor open with the manifest/features/fixtures/aurora.json project, the card n-card-a chosen, the
// inspector's Style tab open in full mode, and a gradient added to the card's `background-image` — the
// `[data-gradient-bar]` bar drawn. The bar is brought into view (scrollIntoViewIfNeeded) and its
// box is read as `addHere` would read it on click.
//
// Run from the root: cat auditoria/medicoes/MED-0101.mjs | node --input-type=module -
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
  { command: 'style.setBackgroundImage', args: { property: 'background-image', edit: { add: true } } },
];

for (const [configName, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: COMMANDS, drawn: [] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForSelector('.workbench');
  await page.waitForTimeout(700);

  const bar = page.locator('[data-gradient-bar]');
  await bar.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await bar.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { left: +r.left.toFixed(2), top: +r.top.toFixed(2), width: +r.width.toFixed(2), height: +r.height.toFixed(2), right: +r.right.toFixed(2), bottom: +r.bottom.toFixed(2) };
  });
  // the position a click in the middle of the bar would give, by the formula of step 5
  const at = Math.round(Math.min(100, Math.max(0, ((box.left + box.width / 2 - box.left) / box.width) * 100)));

  console.log(JSON.stringify({ config: configName, box, at_middle: at }));
  await browser.close();
}
