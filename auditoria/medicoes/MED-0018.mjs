/* global console, document, performance, setTimeout, window */
// MED-0018 — the id is cited by two areas with different values; both are measured:
//  (a) ENT-L05b-0049 (test-boot.ts:111): the measured stage box (`getBoundingClientRect`), on which the decision to wait
//      for more frames depends;
//  (b) ENT-L07-0002 (anchor-tabs.tsx:71): the boxes of the label and the quick panel chip; ENT-L07-0011
//      (chrome.tsx:456): the content boxes and the chrome control boxes; ENT-L07-0021 (chrome.tsx:748, 755): the boxes
//      of the breakpoint tabs and of the stage; ENT-L07-0066 (chip-fit): the measured widths of the fields.
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
  const value = await page.evaluate(() => {
    const r = (el) => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height }; };
    const stage = document.querySelector('[data-canvas-stage]');
    const label = document.querySelector('[data-chrome="label"]');
    const chip = document.querySelector('.quick-panel-chip');
    const tabs = [...document.querySelectorAll('[data-region="canvas-breakpoints"] button, [data-region="canvas-breakpoints"] [role="tab"]')].filter((el) => el.getClientRects().length > 0 && el.getBoundingClientRect().width > 0);
    const chrome = [...stage.querySelectorAll('[data-chrome]')].map((el) => ({ chrome: el.getAttribute('data-chrome'), box: r(el) }));
    return { stageBox: r(stage), labelBox: label ? r(label) : null, chipBox: chip ? r(chip) : null, tabs: tabs.map(r), chromeBoxes: chrome };
  });
  console.log(JSON.stringify({ config: name, value }));
  await browser.close();
}
