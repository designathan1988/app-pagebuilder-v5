// Run of MED-0014: the same measurement, which measured the parts cited by flows from different areas; this record keeps the context menu part, ENT-L05b-0035.
/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0014 — the id is cited by two areas with distinct values, both measured:
//  (a) ENT-L05b-0035 (context menu, menu.tsx:320-322): the `--space-4` margin, the measured width of the menu, the natural
//      height, the point of the last press and the window size, on which the position depends;
//  (b) ENT-L07-0003, 0067, 0068, 0071, 0072, 0073, 0074 (canvas/reveal-selection/chip-fit): the stage's box, the box
//      of the `.frame__view` view and the `--space-8` token (reveal-selection.tsx:44-49), and the measured widths of the fields and
//      of their text boxes (chip-fit.ts:25-33).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/grid-page.json', 'utf8');
const COMMANDS = [{ command: 'selection.select', args: { target: { $node: '/Page/Grid' } } }];

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
  const reveal = await page.evaluate(() => {
    const stage = document.querySelector('[data-canvas-stage]');
    const stageBox = stage.getBoundingClientRect();
    const view = stage.querySelector('.frame__view')?.getBoundingClientRect() ?? stageBox;
    const inset = parseFloat(getComputedStyle(stage).getPropertyValue('--space-8')) || 0;
    return { stageBox: { left: stageBox.left, top: stageBox.top, right: stageBox.right, bottom: stageBox.bottom, width: stageBox.width, height: stageBox.height }, viewBox: { left: view.left, top: view.top, right: view.right, bottom: view.bottom, width: view.width, height: view.height }, space8: inset };
  });
  await page.evaluate(() => document.querySelector('.quick-panel-chip')?.click());
  await page.waitForTimeout(300);
  const fields = await page.evaluate(() => {
    const p = document.querySelector('.quick-panel');
    if (p === null) return null;
    const list = [...p.querySelectorAll('.quick-panel__group-fields > .field-row')];
    return list.map((field) => {
      const clips = [...field.querySelectorAll('.field__rest-value, .field__keyword-value')];
      const inputs = [...field.querySelectorAll('input')];
      return { fieldWidth: field.getBoundingClientRect().width, wide: 'wide' in field.dataset, clips: clips.map((cl) => ({ text: (cl.textContent ?? '').trim(), clientWidth: cl.clientWidth, rects: cl.getClientRects().length })), inputWidths: inputs.map((i) => i.clientWidth) };
    });
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(120);
  const stage = await page.evaluate(() => { const r = document.querySelector('[data-canvas-stage]').getBoundingClientRect(); return { left: r.left, top: r.top }; });
  const px = Math.round(stage.left + 120);
  const py = Math.round(stage.top + 120);
  await page.mouse.click(px, py, { button: 'right' });
  await page.waitForTimeout(250);
  const contextMenu = await page.evaluate(() => {
    const m = document.querySelector('.menu[data-region="context-menu"]');
    if (m === null) return null;
    const cs = getComputedStyle(m);
    return { width: m.getBoundingClientRect().width, space4: cs.getPropertyValue('--space-4').trim(), naturalHeight: m.scrollHeight + (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0), left: m.getBoundingClientRect().left, top: m.getBoundingClientRect().top, winWidth: window.innerWidth, winHeight: window.innerHeight };
  });
  console.log(JSON.stringify({ config: configName, value: { reveal, fields, pressPoint: { x: px, y: py }, contextMenu } }));
  await browser.close();
}
