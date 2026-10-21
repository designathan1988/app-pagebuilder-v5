// Run of MED-0019: the same measurement, which measured the parts cited by flows from different areas; this record keeps the part about the stage box read by settle, ENT-L05b-0050.
/* global console, document, performance, setTimeout, window */
// MED-0019 — the id is cited by two areas with distinct values, both measured:
//  (a) ENT-L05b-0050 (test-boot.ts:111): the measured box of the stage (`getBoundingClientRect`), read by `settle`;
//  (b) ENT-L07-0021 (chrome.tsx:855): whether the page moves by itself (`pageAnimating`, coordinates.ts:658-660:
//      `page.getAnimations().some(a => a.playState === 'running')`); ENT-L07-0102, 0103, 0104, 0105
//      (selection-size.ts:22, 44): the element's box on the page via `pageLayout.box` (coordinates.ts:421-428).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/grid-page.json', 'utf8');
const COMMANDS = [
  { command: 'selection.select', args: { target: { $node: '/Page/Grid' } } },
];

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
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
  const value = await page.evaluate(() => {
    const f = document.querySelector('.frame__page');
    const d = f.contentDocument;
    const stage = document.querySelector('[data-canvas-stage]').getBoundingClientRect();
    const animations = d.getAnimations();
    const running = animations.filter((a) => a.playState === 'running').length;
    const boxOf = (id) => { const el = d.querySelector(`[data-node="${id}"]`); if (el === null) return null; const r = el.getBoundingClientRect(); return { x: r.left + f.contentWindow.scrollX, y: r.top + f.contentWindow.scrollY, width: r.width, height: r.height }; };
    const ids = window.__builderTestPort.selection();
    const boxes = ids.map((id) => ({ id, box: boxOf(id) })).filter((b) => b.box !== null);
    const union = boxes.length === 0 ? null : (() => { const l = Math.min(...boxes.map((b) => b.box.x)); const t = Math.min(...boxes.map((b) => b.box.y)); const rr = Math.max(...boxes.map((b) => b.box.x + b.box.width)); const bb = Math.max(...boxes.map((b) => b.box.y + b.box.height)); return { width: Math.round(rr - l), height: Math.round(bb - t) }; })();
    return { stageBox: { x: stage.x, y: stage.y, width: stage.width, height: stage.height }, pageAnimating: running > 0, runningAnimations: running, selection: ids, boxes, union };
  });
  console.log(JSON.stringify({ config: configName, value }));
  await browser.close();
}
