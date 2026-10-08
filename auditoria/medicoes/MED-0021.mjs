/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0021 — as caixas das trilhas da grade, lidas em src/editor/canvas/grid-editor.tsx:38
// `const found = frame && origin !== null ? trackBoxes(frame, editing as NodeId) : null;` (ENT-L07-0056, passo 5).
// Estado: o projeto grid-page.json aberto, a grade em edição (grid.enterEdit). As caixas são lidas do desenho do
// editor de grade (chrome__grid-line-number e chrome__grid-track-grip) e refeitas por trackBoxes
// (src/editor/canvas/coordinates.ts:393) sobre os mesmos valores que o navegador calcula.
// Roda: cat auditoria/medicoes/MED-0021.mjs | node --input-type=module -
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const PROJECT = fs.readFileSync('manifest/features/fixtures/grid-page.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};
const BOOT = {
  project: PROJECT,
  commands: [
    { command: 'selection.select', args: { target: { $node: '/Page/Grid' } } },
    { command: 'grid.enterEdit', args: { target: { $node: '/Page/Grid' } } },
  ],
  drawn: [],
};

const MEASURE = () => {
  const iframe = document.querySelector('.frame__page');
  const geometryOf = (f) => {
    const win = f.contentWindow;
    const zoom = f.currentCSSZoom;
    const box = f.getBoundingClientRect();
    if (!win || !f.contentDocument || !(zoom > 0) || box.width === 0) return null;
    const st = getComputedStyle(f);
    return { left: box.left + (parseFloat(st.borderLeftWidth) + parseFloat(st.paddingLeft)) * zoom, top: box.top + (parseFloat(st.borderTopWidth) + parseFloat(st.paddingTop)) * zoom, zoom };
  };
  const trackBoxes = (f, id) => {
    const element = f.contentDocument.querySelector(`[data-node="${id}"]`);
    const view = element?.ownerDocument.defaultView;
    const g = geometryOf(f);
    if (!element || !view || !g) return [];
    const style = view.getComputedStyle(element);
    if (!style.display.includes('grid')) return [];
    const cssPx = (v) => parseFloat(v) || 0;
    const tracks = style.gridTemplateColumns.split(' ').map(cssPx).filter((s) => s > 0);
    const gap = cssPx(style.columnGap);
    const r = element.getBoundingClientRect();
    const origin = { x: g.left + (r.left + cssPx(style.borderLeftWidth) + cssPx(style.paddingLeft)) * g.zoom, y: g.top + (r.top + cssPx(style.borderTopWidth) + cssPx(style.paddingTop)) * g.zoom };
    const height = (r.height - cssPx(style.borderTopWidth) - cssPx(style.borderBottomWidth) - cssPx(style.paddingTop) - cssPx(style.paddingBottom)) * g.zoom;
    const boxes = [];
    let left = 0;
    for (const size of tracks) {
      boxes.push({ x: origin.x + left * g.zoom, y: origin.y, width: size * g.zoom, height });
      left += size + gap;
    }
    return boxes;
  };
  const layer = document.querySelector('.chrome__grid-edit');
  const originRect = layer?.parentElement?.getBoundingClientRect() ?? null;
  const editing = 'n-grid';
  const screen = trackBoxes(iframe, editing);
  const relative = originRect === null ? [] : screen.map((b) => ({ x: b.x - originRect.x, y: b.y - originRect.y, width: b.width, height: b.height }));
  // o desenho do editor de grade (a saída do próprio aplicativo), para conferir a leitura acima
  const numbers = [...document.querySelectorAll('[data-chrome="grid-line-number"]')].map((el) => ({ text: el.textContent, left: el.style.left, top: el.style.top }));
  const grips = [...document.querySelectorAll('[data-chrome="grid-track-grip"]')].map((el) => ({ left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height, start: el.dataset.start }));
  const grid = iframe.contentDocument.querySelector('[data-node="n-grid"]');
  const style = grid === null ? null : grid.ownerDocument.defaultView.getComputedStyle(grid);
  return {
    zoom: iframe?.currentCSSZoom ?? null,
    gridTemplateColumns: style?.gridTemplateColumns ?? null,
    columnGap: style?.columnGap ?? null,
    originRect: originRect === null ? null : { x: originRect.x, y: originRect.y, width: originRect.width, height: originRect.height },
    trackBoxesScreen: screen,
    trackBoxesRelative: relative,
    drawnNumbers: numbers,
    drawnGrips: grips,
  };
};

for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: BOOT }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.evaluate(async (n) => {
    const until = performance.now() + 10000;
    const ready = () => document.querySelector('.workbench') !== null && window.__builderTestPort !== undefined && window.__builderTestPort.boot().length >= n;
    while (!ready() && performance.now() < until) await new Promise((r) => setTimeout(r, 10));
    await new Promise((r) => setTimeout(r, 500));
  }, BOOT.commands.length + 1);
  const boot = await page.evaluate(() => window.__builderTestPort.boot().map((b) => `${b.command}:${b.status}`));
  const valor = await page.evaluate(MEASURE);
  console.log(JSON.stringify({ config: nome, boot, valor }));
  await browser.close();
}
