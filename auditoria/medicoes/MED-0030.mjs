/* global console, document, performance, setTimeout, window */
// MED-0030 — a ordem de foco e a seleção do campo digitado, postas em src/editor/canvas/edit-handles.tsx:232
// `input.current?.focus();` e :233 `input.current?.select();` (ENT-L07-0030, passos 4 e 5).
// Estado: o projeto aurora.json aberto, o Hero selecionado; uma faixa de espaçamento é pressionada sem arraste, o que
// abre o campo digitado (src/editor/input/pointer/events.ts:471 `if (opposite !== '') typedBand.open(entry.ref);`).
// O valor é o elemento ativo do documento depois da montagem do campo e o intervalo de seleção do próprio campo.
// Roda: cat auditoria/medicoes/MED-0030.mjs | node --input-type=module -
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const AURORA = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};
const BAND = '[data-canvas-overlay] [data-door="style.setSpacing#handle-padding-top-band"]';

for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  const boot = { project: AURORA, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Hero' } } }], drawn: [] };
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: boot }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.evaluate(async (n) => {
    const until = performance.now() + 10000;
    const ready = () => document.querySelector('.workbench') !== null && window.__builderTestPort !== undefined && window.__builderTestPort.boot().length >= n;
    while (!ready() && performance.now() < until) await new Promise((r) => setTimeout(r, 10));
    await new Promise((r) => setTimeout(r, 500));
  }, 2);
  const box = await page.locator(BAND).boundingBox();
  // o ponto longe do rótulo da seleção (que fica no topo do quadro), na faixa de preenchimento de cima
  const at = { x: box.x + box.width / 2, y: box.y + box.height - 6 };
  await page.mouse.move(at.x, at.y);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(300);
  const valor = await page.evaluate(() => {
    const form = document.querySelector('[data-band-field]');
    const input = form?.querySelector('input') ?? null;
    const active = document.activeElement;
    return {
      fieldMounted: form !== null,
      active: active === null ? null : { tag: active.tagName, className: active.className, isField: active === input },
      field: input === null ? null : { value: input.value, selectionStart: input.selectionStart, selectionEnd: input.selectionEnd, ariaLabel: input.getAttribute('aria-label') },
    };
  });
  console.log(JSON.stringify({ config: nome, valor }));
  await browser.close();
}
