/* global console, document, performance, setTimeout, window */
// MED-0009 — the left edge of the track (`data-motion-track`), read in src/editor/motion/drag-tool.ts:40
// (`track.getBoundingClientRect().left`): what the drag times depend on. The id is cited by
// ENT-P-motion-0045, 0046, 0047, 0052, 0057 and 0066.
//
// State: opens motion.json, selects the Hero, adds a motion interaction (motion.add) and opens the Motion panel
// (workspace.setPanelOpen panel 'motion'), which draws the track.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/motion.json', 'utf8');
const COMMANDS = [
  { command: 'selection.select', args: { target: { $node: '/Page/Hero' } } },
  { command: 'motion.add', args: {} },
  { command: 'workspace.setPanelOpen', args: { panel: 'motion', open: 'open' } },
];

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
  const value = await page.evaluate(async () => {
    const port = () => window.__builderTestPort;
    const until = performance.now() + 10000;
    while ((port()?.boot().length ?? -1) < 4 && performance.now() < until) await new Promise((r) => setTimeout(r, 20));
    await new Promise((r) => setTimeout(r, 400));
    const t = document.querySelector('[data-motion-track]');
    return t === null ? null : { trackLeft: t.getBoundingClientRect().left, trackWidth: t.getBoundingClientRect().width, pixelsPerSecond: t.getAttribute('data-pixels-per-second') };
  });
  console.log(JSON.stringify({ config: name, value }));
  await browser.close();
}
