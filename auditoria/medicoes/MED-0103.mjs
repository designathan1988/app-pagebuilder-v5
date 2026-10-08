// Corrida de MED-0010: a mesma medição, que mediu as partes citadas por fluxos de áreas diferentes; este registro guarda a parte do menu da barra (File), ENT-L05b-0027.
/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0010 — o id é citado por três áreas com valores distintos, medidos os três:
//  (a) ENT-L05b-0027 (menu da barra): src/editor/doors/menu.tsx:105-108 — a folga `--space-4`, a largura medida da
//      lista, a altura natural (`scrollHeight` mais bordas) e o tamanho da janela;
//  (b) ENT-L06-0039 (captura): src/editor/canvas/screenshot.ts:12-13 — frame.clientWidth/scrollWidth e
//      frame.clientHeight/scrollHeight e a largura/altura resultantes (Math.ceil do maior);
//  (c) ENT-L07-0002 e as demais (chrome/canvas): geometryOf(iframe) — src/editor/canvas/coordinates.ts:62-71 — a caixa
//      do quadro com o zoom e a rolagem, e a origem da caixa do palco (anchor-tabs.tsx:69).
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
  const semMenu = await page.evaluate(() => {
    const n = (v) => parseFloat(v) || 0;
    const f = document.querySelector('.frame__page');
    const fb = f.getBoundingClientRect();
    const fsx = getComputedStyle(f);
    const zoom = f.currentCSSZoom;
    const geom = { left: fb.left + (n(fsx.borderLeftWidth) + n(fsx.paddingLeft)) * zoom, top: fb.top + (n(fsx.borderTopWidth) + n(fsx.paddingTop)) * zoom, zoom, scrollX: f.contentWindow.scrollX, scrollY: f.contentWindow.scrollY };
    const page_ = f.contentDocument;
    const stage = document.querySelector('[data-canvas-stage]').getBoundingClientRect();
    return {
      capture: {
        frameClientWidth: f.clientWidth, frameClientHeight: f.clientHeight,
        pageScrollWidth: page_.documentElement.scrollWidth, pageScrollHeight: page_.documentElement.scrollHeight,
        width: Math.ceil(Math.max(f.clientWidth, page_.documentElement.scrollWidth)),
        height: Math.ceil(Math.max(f.clientHeight, page_.documentElement.scrollHeight)),
      },
      geometryOf: geom,
      stageOrigin: { x: stage.x, y: stage.y, width: stage.width, height: stage.height },
    };
  });
  await page.locator('.menu-button[data-menu="file"]').first().click();
  await page.waitForTimeout(200);
  const menu = await page.evaluate(() => {
    const list = document.querySelector('.menu[role="menu"]');
    if (list === null) return null;
    const cs = getComputedStyle(list);
    return { width: list.getBoundingClientRect().width, space4: cs.getPropertyValue('--space-4').trim(), naturalHeight: list.scrollHeight + (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0), winWidth: window.innerWidth, winHeight: window.innerHeight };
  });
  console.log(JSON.stringify({ config: nome, valor: { ...semMenu, fileMenu: menu } }));
  await browser.close();
}
