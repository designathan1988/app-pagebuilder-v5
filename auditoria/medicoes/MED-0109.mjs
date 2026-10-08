// Corrida de MED-0016: a mesma medição, que mediu as partes citadas por fluxos de áreas diferentes; este registro guarda a parte do elemento ativo do documento no segundo quadro, ENT-L05b-0043.
/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0016 — o id é citado por duas áreas com valores distintos, medidos os dois:
//  (a) ENT-L05b-0043 (focus.ts:195): o elemento ativo do documento no segundo quadro, de que a decisão de mover o foco
//      depende;
//  (b) ENT-L07-0035 (frame.tsx:57-58): a altura da vista do quadro, o `contentRect.height` do `.frame__view`;
//      ENT-L07-0075, 0076 (rulers.tsx:57-58): a caixa das bandas das réguas (`.ruler--x`, `.ruler--y`).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJETO = fs.readFileSync('manifest/features/fixtures/grid-page.json', 'utf8');
const COMANDOS = [{ command: 'selection.select', args: { target: { $node: '/Page/Grid' } } }];

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJETO, commands: COMANDOS } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.evaluate(async () => {
    const port = () => window.__builderTestPort;
    const until = performance.now() + 10000;
    while ((port()?.boot().length ?? -1) < 2 && performance.now() < until) await new Promise((r) => setTimeout(r, 20));
    await new Promise((r) => setTimeout(r, 400));
  });
  const valor = await page.evaluate(() => {
    const view = document.querySelector('.frame__view');
    const vb = view.getBoundingClientRect();
    const vbStyle = getComputedStyle(view);
    const ruler = (sel) => { const el = document.querySelector(sel); if (el === null) return null; const r = el.getBoundingClientRect(); return { hidden: el.hidden, start: sel === '.ruler--x' ? r.left : r.top, length: sel === '.ruler--x' ? r.width : r.height, box: { left: r.left, top: r.top, width: r.width, height: r.height } }; };
    const active = document.activeElement;
    return {
      viewHeight: vb.height - (parseFloat(vbStyle.borderTopWidth) || 0) - (parseFloat(vbStyle.borderBottomWidth) || 0) - (parseFloat(vbStyle.paddingTop) || 0) - (parseFloat(vbStyle.paddingBottom) || 0),
      viewBox: { left: vb.left, top: vb.top, width: vb.width, height: vb.height },
      rulerX: ruler('.ruler--x'), rulerY: ruler('.ruler--y'),
      ativo: { tag: active.tagName, isBody: active === document.body },
    };
  });
  console.log(JSON.stringify({ config: nome, valor }));
  await browser.close();
}
