/* global console, document, performance, requestAnimationFrame, setTimeout, window */
// MED-0017 — o id é citado por duas áreas com valores distintos, medidos os dois:
//  (a) ENT-L05b-0044 (focus.ts:253): o elemento ativo do documento passado a `carryOut`;
//  (b) ENT-L07-0052, 0053 (frame.tsx:229, 241): a rolagem da página do quadro (`scrollY`); ENT-L07-0079
//      (screenshot.ts:12-13): a largura e a altura da página na captura.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

// canonical.json: a página é mais alta do que a vista do quadro, então a página rola (o grid-page cabe inteiro).
const PROJETO = fs.readFileSync('manifest/features/fixtures/canonical.json', 'utf8');
const COMANDOS = [];

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
  const valor = await page.evaluate(async () => {
    const f = document.querySelector('.frame__page');
    const doc = f.contentDocument;
    const before = f.contentWindow.scrollY;
    f.contentWindow.scrollTo(0, 120);
    await new Promise((r) => requestAnimationFrame(r));
    const after = f.contentWindow.scrollY;
    const active = document.activeElement;
    return {
      scrollYBefore: before,
      scrollYAfter: after,
      scrollXPagina: f.contentWindow.scrollX,
      captura: {
        frameClientWidth: f.clientWidth, frameClientHeight: f.clientHeight,
        pageScrollWidth: doc.documentElement.scrollWidth, pageScrollHeight: doc.documentElement.scrollHeight,
        width: Math.ceil(Math.max(f.clientWidth, doc.documentElement.scrollWidth)),
        height: Math.ceil(Math.max(f.clientHeight, doc.documentElement.scrollHeight)),
      },
      ativo: { tag: active.tagName, isBody: active === document.body },
    };
  });
  console.log(JSON.stringify({ config: nome, valor }));
  await browser.close();
}
