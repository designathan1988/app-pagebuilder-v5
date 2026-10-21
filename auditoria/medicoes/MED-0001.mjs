/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0001 — the width and left edge of the stage (zoomIn). The stage the canvas registers (registerStage) and that the
// camera measures in src/editor/view/camera.ts:49-53: left = box.left + paddingLeft + borderLeftWidth; width = box.width
// minus the padding and borders on both sides. The id is cited by ENT-P-view-0001..0004 and trechos/TRC-view.zoomIn.md.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/grid-page.json', 'utf8');
const COMMANDS = [];
const DRAWN = [{ command: 'view.zoomIn', args: {} }];

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

for (const [name, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: COMMANDS, drawn: DRAWN } }));
  await page.goto('http://localhost:5399/?test-boot');
  const value = await page.evaluate(async () => {
    const port = () => window.__builderTestPort;
    const shown = (el) => el !== null && el.getClientRects().length > 0;
    const until = performance.now() + 10000;
    while ((!shown(document.querySelector('.workbench')) || (port()?.boot().length ?? -1) < 1) && performance.now() < until) await new Promise((r) => setTimeout(r, 10));
    const st = document.querySelector('[data-canvas-stage]');
    if (!st) return null;
    const box = st.getBoundingClientRect();
    const cs = getComputedStyle(st);
    const n = (v) => parseFloat(v) || 0;
    const start = n(cs.paddingLeft) + n(cs.borderLeftWidth);
    const end = n(cs.paddingRight) + n(cs.borderRightWidth);
    return { stageLeft: box.left + start, stageWidth: box.width - start - end, zoom: port()?.boot()?.length };
  });
  console.log(JSON.stringify({ config: name, value }));
  await browser.close();
}
