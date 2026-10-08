// Corrida de MED-0014: a mesma medição, que mediu as partes citadas por fluxos de áreas diferentes; este registro guarda a parte do menu de contexto, ENT-L05b-0035.
/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0014 — o id é citado por duas áreas com valores distintos, medidos os dois:
//  (a) ENT-L05b-0035 (menu de contexto, menu.tsx:320-322): a folga `--space-4`, a largura medida do menu, a altura
//      natural, o ponto do último aperto e o tamanho da janela, de que a posição depende;
//  (b) ENT-L07-0003, 0067, 0068, 0071, 0072, 0073, 0074 (canvas/reveal-selection/chip-fit): a caixa do palco, a caixa
//      da vista `.frame__view` e o token `--space-8` (reveal-selection.tsx:44-49), e as larguras medidas dos campos e
//      das suas caixas de texto (chip-fit.ts:25-33).
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
  const reveal = await page.evaluate(() => {
    const stage = document.querySelector('[data-canvas-stage]');
    const stageBox = stage.getBoundingClientRect();
    const view = stage.querySelector('.frame__view')?.getBoundingClientRect() ?? stageBox;
    const inset = parseFloat(getComputedStyle(stage).getPropertyValue('--space-8')) || 0;
    return { stageBox: { left: stageBox.left, top: stageBox.top, right: stageBox.right, bottom: stageBox.bottom, width: stageBox.width, height: stageBox.height }, viewBox: { left: view.left, top: view.top, right: view.right, bottom: view.bottom, width: view.width, height: view.height }, space8: inset };
  });
  await page.evaluate(() => document.querySelector('.quick-panel-chip')?.click());
  await page.waitForTimeout(300);
  const fields = await page.evaluate(() => {
    const p = document.querySelector('.quick-panel');
    if (p === null) return null;
    const list = [...p.querySelectorAll('.quick-panel__group-fields > .field-row')];
    return list.map((field) => {
      const clips = [...field.querySelectorAll('.field__rest-value, .field__keyword-value')];
      const inputs = [...field.querySelectorAll('input')];
      return { fieldWidth: field.getBoundingClientRect().width, wide: 'wide' in field.dataset, clips: clips.map((cl) => ({ text: (cl.textContent ?? '').trim(), clientWidth: cl.clientWidth, rects: cl.getClientRects().length })), inputWidths: inputs.map((i) => i.clientWidth) };
    });
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(120);
  const stage = await page.evaluate(() => { const r = document.querySelector('[data-canvas-stage]').getBoundingClientRect(); return { left: r.left, top: r.top }; });
  const px = Math.round(stage.left + 120);
  const py = Math.round(stage.top + 120);
  await page.mouse.click(px, py, { button: 'right' });
  await page.waitForTimeout(250);
  const contextMenu = await page.evaluate(() => {
    const m = document.querySelector('.menu[data-region="context-menu"]');
    if (m === null) return null;
    const cs = getComputedStyle(m);
    return { width: m.getBoundingClientRect().width, space4: cs.getPropertyValue('--space-4').trim(), naturalHeight: m.scrollHeight + (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0), left: m.getBoundingClientRect().left, top: m.getBoundingClientRect().top, winWidth: window.innerWidth, winHeight: window.innerHeight };
  });
  console.log(JSON.stringify({ config: nome, valor: { reveal, fields, pressPoint: { x: px, y: py }, contextMenu } }));
  await browser.close();
}
