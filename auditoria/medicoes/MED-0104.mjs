// Corrida de MED-0011: a mesma medição, que mediu as partes citadas por fluxos de áreas diferentes; este registro guarda a parte do submenu (View → Tema), ENT-L05b-0028.
/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0011 — o id é citado por duas áreas com valores distintos, medidos os dois:
//  (a) ENT-L05b-0028 (submenu): src/editor/doors/menu.tsx:118-131 — a largura medida do submenu, a caixa medida do item
//      que o abre, a barra de rolagem do menu que o contém e o tamanho da janela;
//  (b) ENT-L07-0002, 0011, 0012, 0021, 0029, 0056, 0059, 0060, 0077, 0078, 0092 (canvas/chrome): a caixa de um nó na
//      página (nodeBox, coordinates.ts:371-374), a origem da caixa do palco e a caixa da sobreposição/camada das
//      sobreposições (chrome.tsx, guides.tsx, view-overlays.tsx).
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
  const canvas = await page.evaluate(() => {
    const n = (v) => parseFloat(v) || 0;
    const f = document.querySelector('.frame__page');
    const fb = f.getBoundingClientRect();
    const fsx = getComputedStyle(f);
    const zoom = f.currentCSSZoom;
    const left = fb.left + (n(fsx.borderLeftWidth) + n(fsx.paddingLeft)) * zoom;
    const top = fb.top + (n(fsx.borderTopWidth) + n(fsx.paddingTop)) * zoom;
    const el = f.contentDocument.querySelector('[data-node="n-grid"]');
    const r = el.getBoundingClientRect();
    const stage = document.querySelector('[data-canvas-stage]').getBoundingClientRect();
    const overlay = document.querySelector('.frame__overlay')?.getBoundingClientRect();
    return {
      nodeBox: { x: left + r.left * zoom, y: top + r.top * zoom, width: r.width * zoom, height: r.height * zoom },
      stageOrigin: { x: stage.x, y: stage.y, width: stage.width, height: stage.height },
      overlayBox: overlay ? { x: overlay.x, y: overlay.y, width: overlay.width, height: overlay.height } : null,
    };
  });
  await page.locator('.menu-button[data-menu="view"]').first().click();
  await page.waitForTimeout(150);
  await page.locator('.menu__sub > .menu__item').first().click();
  await page.waitForTimeout(200);
  const submenu = await page.evaluate(() => {
    const sub = document.querySelector('.menu__sub.is-open');
    if (sub === null) return null;
    const list = sub.querySelector('.menu[role="menu"]');
    const item = sub.querySelector(':scope > .menu__item');
    const parent = item.closest('[role="menu"]');
    const ps = getComputedStyle(parent);
    const bar = parent.offsetWidth - parent.clientWidth - (parseFloat(ps.borderLeftWidth) || 0) - (parseFloat(ps.borderRightWidth) || 0);
    const b = item.getBoundingClientRect();
    return { width: list.getBoundingClientRect().width, itemBox: { left: b.left, top: b.top, right: b.right, bottom: b.bottom }, menuBar: bar, winWidth: window.innerWidth, winHeight: window.innerHeight };
  });
  console.log(JSON.stringify({ config: nome, valor: { ...canvas, submenu } }));
  await browser.close();
}
