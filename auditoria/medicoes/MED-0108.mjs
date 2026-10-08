// Corrida de MED-0015: a mesma medição, que mediu as partes citadas por fluxos de áreas diferentes; este registro guarda a parte do elemento ativo do documento do editor no pedido de foco, ENT-L05b-0042.
/* global HTMLInputElement, console, document, getComputedStyle, performance, setTimeout, window */
// MED-0015 — o id é citado por duas áreas com valores distintos, medidos os dois:
//  (a) ENT-L05b-0042 (focus.ts:195): o elemento ativo do documento (`document.activeElement`) no momento do pedido de
//      foco a uma região de painel, de que a decisão de mover o foco depende;
//  (b) ENT-L07-0003 (chip-fit.ts:55): o campo ativo do documento; ENT-L07-0046 (frame.tsx:131): o elemento ativo do
//      documento do quadro; ENT-L07-0088 (side-frame.tsx:69): o token `--color-canvas-selection` do tema.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJETO = fs.readFileSync('manifest/features/fixtures/grid-page.json', 'utf8');
const COMANDOS = [{ command: 'selection.select', args: { target: { $node: '/Page/Grid' } } }];

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

const DESCREVE = () => {
  const el = document.activeElement;
  return el === null ? null : { tag: el.tagName, cls: typeof el.className === 'string' ? el.className : '', isInput: el instanceof HTMLInputElement, isBody: el === document.body };
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
  const depoisDoBoot = await page.evaluate(() => {
    const colour = getComputedStyle(document.documentElement).getPropertyValue('--color-canvas-selection').trim();
    const frame = document.querySelector('.frame__page');
    const fdoc = frame.contentDocument;
    const fActive = fdoc.activeElement;
    return {
      corSelecao: colour,
      hostAtivo: { tag: document.activeElement.tagName, isBody: document.activeElement === document.body },
      quadroAtivo: fActive === null ? null : { tag: fActive.tagName, isFrameElement: fActive === frame, isBody: fActive === fdoc.body },
    };
  });
  await page.evaluate(() => document.querySelector('.quick-panel-chip')?.click());
  await page.waitForTimeout(300);
  const comPainel = await page.evaluate(DESCREVE);
  console.log(JSON.stringify({ config: nome, valor: { depoisDoBoot, ativoComPainelAberto: comPainel } }));
  await browser.close();
}
