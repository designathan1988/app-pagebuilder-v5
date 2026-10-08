/* global HTMLInputElement, HTMLTextAreaElement, console, document */
// MED-0051 — o elemento ativo do documento (document.activeElement), de que a decisão do passo 4 de
// auditoria/fluxos/ENT-L05a-0027.md depende (`src/editor/input/keymap.ts:576`
// `if (event.target instanceof Node && event.target !== event.target.ownerDocument?.activeElement) {`).
//
// Estado: o editor aberto com um projeto real (manifest/features/fixtures/aurora.json), o cartão n-card-a
// escolhido e a aba Estilo do inspetor à mostra. Mede-se o documento ativo em dois momentos do foco: (a) sem
// foco em campo nenhum, como o editor abre; (b) com o foco no campo de família de fonte, o estado em que um
// `beforeinput` de desfazer/refazer traria `event.target` igual ao elemento ativo.
//
// Rodar da raiz: cat auditoria/medicoes/MED-0051.mjs | node --input-type=module -
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
];

const describeActive = () => {
  const el = document.activeElement;
  return {
    tag: el.tagName,
    class: String(el.className).slice(0, 60),
    ariaLabel: el.getAttribute === undefined ? null : el.getAttribute('aria-label'),
    isInput: el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement,
  };
};

for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: COMMANDS, drawn: [] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForSelector('.workbench');
  await page.waitForTimeout(600);

  const semFoco = await page.evaluate(describeActive);

  const campo = page.locator('[data-door="style.set#inspector-font-family"] input').first();
  await campo.click();
  await page.waitForTimeout(200);
  const comFoco = await page.evaluate(describeActive);

  console.log(JSON.stringify({ config: nome, sem_foco: semFoco, com_foco_no_campo: comFoco }));
  await browser.close();
}
