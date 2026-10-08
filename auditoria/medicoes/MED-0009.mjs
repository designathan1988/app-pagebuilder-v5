/* global console, document, performance, setTimeout, window */
// MED-0009 — a borda esquerda da trilha (`data-motion-track`), lida em src/editor/motion/drag-tool.ts:40
// (`track.getBoundingClientRect().left`): de que os tempos do arraste dependem. O id é citado por
// ENT-P-motion-0045, 0046, 0047, 0052, 0057 e 0066.
//
// Estado: abre motion.json, seleciona o Hero, acrescenta uma interação de movimento (motion.add) e abre o painel do
// Motion (workspace.setPanelOpen panel 'motion'), que desenha a trilha.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJETO = fs.readFileSync('manifest/features/fixtures/motion.json', 'utf8');
const COMANDOS = [
  { command: 'selection.select', args: { target: { $node: '/Page/Hero' } } },
  { command: 'motion.add', args: {} },
  { command: 'workspace.setPanelOpen', args: { panel: 'motion', open: 'open' } },
];

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
  const valor = await page.evaluate(async () => {
    const port = () => window.__builderTestPort;
    const until = performance.now() + 10000;
    while ((port()?.boot().length ?? -1) < 4 && performance.now() < until) await new Promise((r) => setTimeout(r, 20));
    await new Promise((r) => setTimeout(r, 400));
    const t = document.querySelector('[data-motion-track]');
    return t === null ? null : { trackLeft: t.getBoundingClientRect().left, trackWidth: t.getBoundingClientRect().width, pixelsPerSecond: t.getAttribute('data-pixels-per-second') };
  });
  console.log(JSON.stringify({ config: nome, valor }));
  await browser.close();
}
