/* global console, document, performance, setTimeout, window */
// MED-0025 — o tamanho do rótulo (e da barra), lido em src/editor/canvas/chrome.tsx:454 e :719
// `const size = label.current ? { width: label.current.offsetWidth, height: label.current.offsetHeight } : null;`
// (ENT-L07-0011, passo 8; ENT-L07-0021, passo 9).
// Estado: o rótulo da seleção ([data-chrome="label"]) de dois elementos de larguras diferentes, cada um num contexto
// novo (um editor por página).
// Roda: cat auditoria/medicoes/MED-0025.mjs | node --input-type=module -
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const AURORA = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};
const TARGETS = ['/Page/Hero/Title', '/Page/Plans/Grid/CardA'];

const READ = () => {
  const label = document.querySelector('[data-chrome="label"]');
  const size = document.querySelector('[data-chrome="label-size"]');
  return label === null ? null : {
    offsetWidth: label.offsetWidth,
    offsetHeight: label.offsetHeight,
    width: label.getBoundingClientRect().width,
    height: label.getBoundingClientRect().height,
    text: label.textContent,
    sizeChip: size === null ? null : size.textContent,
  };
};

for (const [nome, c] of Object.entries(CONFIGS)) {
  const valor = {};
  for (const target of TARGETS) {
    const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
    const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
    const page = await context.newPage();
    const boot = { project: AURORA, commands: [{ command: 'selection.select', args: { target: { $node: target } } }], drawn: [] };
    await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: boot }));
    await page.goto('http://localhost:5399/?test-boot');
    await page.evaluate(async (n) => {
      const until = performance.now() + 10000;
      const ready = () => document.querySelector('.workbench') !== null && window.__builderTestPort !== undefined && window.__builderTestPort.boot().length >= n;
      while (!ready() && performance.now() < until) await new Promise((r) => setTimeout(r, 10));
      await new Promise((r) => setTimeout(r, 500));
    }, 2);
    valor[target] = await page.evaluate(READ);
    await browser.close();
  }
  console.log(JSON.stringify({ config: nome, valor }));
}
