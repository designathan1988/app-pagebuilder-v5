/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0031 — quatro grandezas distintas citadas sob este mesmo id nos fluxos:
//  (1) o valor de (prefers-reduced-motion: reduce) (ENT-L08-0001/0002/0006/0008/0009/0010/0022), lido em
//      src/editor/motion/runtime/start.ts:55 `const reduced = typeof win.matchMedia === 'function' ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;`;
//  (2) a distância do pivô ao topo do quadro (ENT-L07-0052, passo 6), lida em
//      src/editor/canvas/frame.tsx:224 `const at = pivot !== null ? pivot.y - frame.getBoundingClientRect().top : height / 2;`;
//  (3) o elemento ativo do documento (ENT-L09a-0011, ENT-L09b-0005), lido em
//      src/editor/shell/breakpoints-dialog.tsx:180 `    if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;`
//      e src/editor/shell/outside-layer.ts:41 `    const before = returnFocus?.current ?? anchor?.current ?? document.activeElement;`;
//  (4) a caixa da camada na tela, o zoom da moldura e as caixas dos nós (ENT-L10a-0003, passo 3), lidos em
//      src/modules/layout-composer/ui/overlay.tsx:83 `      const origin = layer.current?.parentElement?.getBoundingClientRect();`.
// Roda: cat auditoria/medicoes/MED-0031.mjs | node --input-type=module -
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const AURORA = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

async function open(c, boot, waitFor) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: boot }));
  await page.goto('http://localhost:5399/?test-boot');
  const handed = (boot.project === undefined ? 0 : 1) + (boot.commands?.length ?? 0) + (boot.drawn?.length ?? 0);
  await page.evaluate(async ({ n, waitFor }) => {
    const until = performance.now() + 10000;
    const ready = () => document.querySelector('.workbench') !== null && window.__builderTestPort !== undefined && window.__builderTestPort.boot().length >= n && (waitFor === null || document.querySelector(waitFor) !== null);
    while (!ready() && performance.now() < until) await new Promise((r) => setTimeout(r, 10));
    await new Promise((r) => setTimeout(r, 500));
  }, { n: handed, waitFor });
  return { browser, page };
}

for (const [nome, c] of Object.entries(CONFIGS)) {
  const valor = {};
  // (1) menos movimento
  {
    const { browser, page } = await open(c, { commands: [], drawn: [] }, null);
    valor.reducedMotion = await page.evaluate(() => ({ reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches }));
    await browser.close();
  }
  // (2) distância do pivô ao topo do quadro: view.zoomAt com um ponto conhecido põe pivot = ponto
  {
    const POINT = { x: 640, y: 300 };
    const { browser, page } = await open(c, { project: AURORA, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Hero' } } }], drawn: [{ command: 'view.zoomAt', args: { factor: 1.25, point: POINT } }] }, null);
    valor.pivot = await page.evaluate((point) => {
      const frame = document.querySelector('.frame__page');
      const top = frame.getBoundingClientRect().top;
      return { point, frameTop: top, at: point.y - top, zoom: frame.currentCSSZoom };
    }, POINT);
    await browser.close();
  }
  // (3) o elemento ativo do documento: em repouso e com o diálogo de breakpoints aberto
  {
    const { browser, page } = await open(c, { project: AURORA, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Hero' } } }], drawn: [] }, null);
    const idle = await page.evaluate(() => { const a = document.activeElement; return a === null ? null : { tag: a.tagName, className: a.className }; });
    await browser.close();
    const { browser: b2, page: p2 } = await open(c, { project: AURORA, commands: [{ command: 'workspace.openDialog', args: { dialog: 'breakpoints' } }], drawn: [] }, '[data-region="breakpoints-dialog"]');
    const dialog = await p2.evaluate(() => { const a = document.activeElement; return { tag: a?.tagName ?? null, className: a?.className ?? null, inDialog: a?.closest('[data-region="breakpoints-dialog"]') !== null && a !== null }; });
    await b2.close();
    valor.activeElement = { idle, dialogOpen: dialog };
  }
  // (4) a caixa da camada, o zoom da moldura e a caixa de um nó, no compositor de leiaute
  {
    const { browser, page } = await open(c, { project: AURORA, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Hero' } } }], drawn: [{ command: 'layout.enter', args: { target: { $node: '/Page/Hero' } } }] }, '[data-region="layout-composer-canvas"]:not([hidden])');
    valor.layoutComposer = await page.evaluate(() => {
      const iframe = document.querySelector('.frame__page');
      const layer = document.querySelector('.layout-composer');
      const parent = layer?.parentElement;
      const origin = parent === undefined || parent === null ? null : (() => { const r = parent.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; })();
      const geometryOf = (f) => { const win = f.contentWindow; const zoom = f.currentCSSZoom; const box = f.getBoundingClientRect(); if (!win || !f.contentDocument || !(zoom > 0) || box.width === 0) return null; const st = getComputedStyle(f); return { left: box.left + (parseFloat(st.borderLeftWidth) + parseFloat(st.paddingLeft)) * zoom, top: box.top + (parseFloat(st.borderTopWidth) + parseFloat(st.paddingTop)) * zoom, zoom }; };
      const g = geometryOf(iframe);
      const element = iframe.contentDocument.querySelector('[data-node="n-hero"]');
      const r = element?.getBoundingClientRect();
      const nodeBox = element === undefined || g === null || r === undefined ? null : { x: g.left + r.left * g.zoom, y: g.top + r.top * g.zoom, width: r.width * g.zoom, height: r.height * g.zoom };
      return { origin, zoom: iframe.currentCSSZoom, composerShown: layer !== null && layer.getAttribute('hidden') === null, nodeBox };
    });
    await browser.close();
  }
  console.log(JSON.stringify({ config: nome, valor }));
}
