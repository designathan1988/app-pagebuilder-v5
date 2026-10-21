/* global console, document, window */
// MED-0041 — the browser-computed values that the id cites.
//  - L09b (ENT-L09b-0047 to ENT-L09b-0049): the width of the name and of its box (`name.scrollWidth`, `name.clientWidth`)
//    and the width of the details (`details.offsetWidth`) of each row of the file tree, read in
//    src/editor/shell/sidebar/name-first.ts:22 and :23.
//  - L09a (ENT-L09a-0085 to ENT-L09a-0088): the values the page computes for a node, through the `computedValues` port
//    (src/editor/shell/field.tsx:151 and :249) — see MED-0041.md.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/layout-wireframe.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

for (const [configName, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: [] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForFunction(() => (window.__builderTestPort?.boot().length ?? -1) >= 1);
  await page.click('[data-door="workspace.setPanelOpen#toolbar-activity-bar-explorer"]');
  await page.waitForTimeout(500);

  const rows = await page.evaluate(() => [...document.querySelectorAll('.row__main')].map((row) => {
    const name = row.querySelector(':scope > .row__name');
    const details = row.querySelector(':scope > .row__meta');
    return { name: name?.textContent ?? null, nameScrollWidth: name?.scrollWidth ?? null, nameClientWidth: name?.clientWidth ?? null, detailsOffsetWidth: details?.offsetWidth ?? null, nameFirst: 'nameFirst' in row.dataset, detailsWidth: row.dataset.detailsWidth ?? null };
  }));

  console.log(JSON.stringify({ config: configName, rows }));
  await browser.close();
}
