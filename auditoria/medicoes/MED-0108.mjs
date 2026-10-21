// Run of MED-0015: the same measurement, which measured the parts cited by flows from different areas; this record keeps the part about the editor document's active element on a focus request, ENT-L05b-0042.
/* global HTMLInputElement, console, document, getComputedStyle, performance, setTimeout, window */
// MED-0015 — the id is cited by two areas with distinct values, both measured:
//  (a) ENT-L05b-0042 (focus.ts:195): the document's active element (`document.activeElement`) at the moment of a focus
//      request to a panel region, on which the decision to move focus depends;
//  (b) ENT-L07-0003 (chip-fit.ts:55): the document's active field; ENT-L07-0046 (frame.tsx:131): the active element of the
//      frame's document; ENT-L07-0088 (side-frame.tsx:69): the theme's `--color-canvas-selection` token.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/grid-page.json', 'utf8');
const COMMANDS = [{ command: 'selection.select', args: { target: { $node: '/Page/Grid' } } }];

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

const DESCRIBE = () => {
  const el = document.activeElement;
  return el === null ? null : { tag: el.tagName, cls: typeof el.className === 'string' ? el.className : '', isInput: el instanceof HTMLInputElement, isBody: el === document.body };
};

for (const [configName, c] of Object.entries(CONFIGS)) {
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
  const afterBoot = await page.evaluate(() => {
    const colour = getComputedStyle(document.documentElement).getPropertyValue('--color-canvas-selection').trim();
    const frame = document.querySelector('.frame__page');
    const fdoc = frame.contentDocument;
    const fActive = fdoc.activeElement;
    return {
      selectionColour: colour,
      hostActive: { tag: document.activeElement.tagName, isBody: document.activeElement === document.body },
      frameActive: fActive === null ? null : { tag: fActive.tagName, isFrameElement: fActive === frame, isBody: fActive === fdoc.body },
    };
  });
  await page.evaluate(() => document.querySelector('.quick-panel-chip')?.click());
  await page.waitForTimeout(300);
  const withPanel = await page.evaluate(DESCRIBE);
  console.log(JSON.stringify({ config: configName, value: { afterBoot, activeWithPanelOpen: withPanel } }));
  await browser.close();
}
