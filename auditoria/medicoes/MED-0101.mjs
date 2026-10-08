/* global console */
// MED-0101 — a caixa da barra do gradiente na tela, lida em `src/editor/shell/gradient.tsx:116`
// `    const box = event.currentTarget.getBoundingClientRect();`, de que a posição da parada depende
// (`src/editor/shell/gradient.tsx:117`
// `    const at = Math.round(Math.min(100, Math.max(0, ((event.clientX - box.left) / box.width) * 100)));`).
//
// Estado: o editor aberto com o projeto manifest/features/fixtures/aurora.json, o cartão n-card-a escolhido, a
// aba Estilo do inspetor aberta com o modo completo, e um gradiente acrescentado ao `background-image` do
// cartão — a barra `[data-gradient-bar]` desenhada. A barra é trazida à vista (scrollIntoViewIfNeeded) e a sua
// caixa é lida como `addHere` a leria ao clique.
//
// Rodar da raiz: cat auditoria/medicoes/MED-0101.mjs | node --input-type=module -
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

const COMMANDS = [
  { command: 'workspace.setPanelOpen', args: { panel: 'inspector', open: 'open' } },
  { command: 'workspace.setActiveTab', args: { group: 'inspector', panel: 'style' } },
  { command: 'inspector.setMode', args: { mode: 'all' } },
  { command: 'selection.select', args: { target: 'n-card-a' } },
  { command: 'style.setBackgroundImage', args: { property: 'background-image', edit: { add: true } } },
];

for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: COMMANDS, drawn: [] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForSelector('.workbench');
  await page.waitForTimeout(700);

  const bar = page.locator('[data-gradient-bar]');
  await bar.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await bar.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { left: +r.left.toFixed(2), top: +r.top.toFixed(2), width: +r.width.toFixed(2), height: +r.height.toFixed(2), right: +r.right.toFixed(2), bottom: +r.bottom.toFixed(2) };
  });
  // a posição que o clique no meio da barra daria, pela fórmula do passo 5
  const at = Math.round(Math.min(100, Math.max(0, ((box.left + box.width / 2 - box.left) / box.width) * 100)));

  console.log(JSON.stringify({ config: nome, caixa: box, at_no_meio: at }));
  await browser.close();
}
