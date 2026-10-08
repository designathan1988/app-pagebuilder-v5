/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0024 — a espessura da linha do quadro, lida em src/editor/canvas/chrome.tsx:604
// `const edge = frame.current ? parseFloat(getComputedStyle(frame.current).outlineWidth) || 0 : 0;` (ENT-L07-0015,
// passo 5) e em src/editor/canvas/chrome.tsx:724 `const edge = frameLine ? parseFloat(getComputedStyle(frameLine).outlineWidth) || 0 : 0;` (ENT-L07-0021, passo 10).
// Estado: o quadro da seleção ([data-chrome="selection"]) e o quadro do elemento capturado
// ([data-chrome="captured-selection"]), cada um num contexto novo (um editor por página).
// Roda: cat auditoria/medicoes/MED-0024.mjs | node --input-type=module -
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const AURORA = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');
const CAPTURED = fs.readFileSync('manifest/features/fixtures/captured-mixed.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};
const STATES = {
  selectionFrame: { boot: { project: AURORA, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Hero' } } }], drawn: [] }, selector: '[data-chrome="selection"]' },
  capturedFrame: { boot: { project: CAPTURED, commands: [{ command: 'capture.select', args: { target: 'captured-story' } }], drawn: [] }, selector: '[data-chrome="captured-selection"]' },
};

const EDGE = (selector) => {
  const el = document.querySelector(selector);
  if (el === null) return null;
  const style = getComputedStyle(el);
  return { outlineWidth: style.outlineWidth, outlineStyle: style.outlineStyle, value: parseFloat(style.outlineWidth) || 0 };
};

for (const [nome, c] of Object.entries(CONFIGS)) {
  const valor = {};
  for (const [estado, { boot, selector }] of Object.entries(STATES)) {
    const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
    const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
    const page = await context.newPage();
    await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: boot }));
    await page.goto('http://localhost:5399/?test-boot');
    await page.evaluate(async (n) => {
      const until = performance.now() + 10000;
      const ready = () => document.querySelector('.workbench') !== null && window.__builderTestPort !== undefined && window.__builderTestPort.boot().length >= n;
      while (!ready() && performance.now() < until) await new Promise((r) => setTimeout(r, 10));
      await new Promise((r) => setTimeout(r, 500));
    }, boot.commands.length + 1);
    valor[estado] = await page.evaluate(EDGE, selector);
    await browser.close();
  }
  console.log(JSON.stringify({ config: nome, valor }));
}
