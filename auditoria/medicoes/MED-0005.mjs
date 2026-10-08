/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0005 — a largura e a borda esquerda do palco (zoomFit). O palco que o canvas registra (registerStage) e que a
// câmera mede em src/editor/view/camera.ts:49-53: left = box.left + paddingLeft + borderLeftWidth; width = box.width
// menos o padding e as bordas dos dois lados. De que o zoom ajustado depende. O id é citado por ENT-P-view-0017..0020 e trechos/TRC-view.zoomFit.md.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJETO = fs.readFileSync('manifest/features/fixtures/grid-page.json', 'utf8');
const DESENHADOS = [{"command":"view.zoomFit","args":{}}];

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJETO, commands: [], drawn: DESENHADOS } }));
  await page.goto('http://localhost:5399/?test-boot');
  const valor = await page.evaluate(async () => {
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
    return { stageLeft: box.left + start, stageWidth: box.width - start - end, boot: port()?.boot() };
  });
  console.log(JSON.stringify({ config: nome, valor }));
  await browser.close();
}
