/* global HTMLInputElement, HTMLTextAreaElement, WheelEvent, console, document, getComputedStyle, requestAnimationFrame, window */
// MED-0034 — os valores calculados pelo navegador que o id cita.
//  - L08 (ENT-L08-0009): o comprimento da trilha da marquise (src/editor/motion/runtime/behaviours.ts:100).
//  - L09a (ENT-L09a-0016): a largura e a altura do palco vistas pelo observador (src/editor/shell/canvas.tsx:265).
//  - L09a (ENT-L09a-0083, ENT-L09a-0084): o elemento ativo sobre o campo numérico quando a roda dispara
//    (src/editor/shell/field.tsx:127).
//  - L09b (ENT-L09b-0023 a ENT-L09b-0028): o elemento ativo e as larguras das linhas do inspector
//    (src/editor/shell/row-fit.ts:107, :47, :60).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/responsive-title.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

async function open(c, commands) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForFunction((n) => (window.__builderTestPort?.boot().length ?? -1) >= n, commands.length + 1).catch(() => {});
  await page.waitForTimeout(400);
  return { browser, page };
}

for (const [nome, c] of Object.entries(CONFIGS)) {
  // L08 — a marquise do título: o comprimento da trilha
  const a = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }, { command: 'motion.setBehaviour', args: { behaviour: 'marquee', amount: 60 } }]);
  for (const b of await a.page.locator('.menu-button').all()) { if (/Exibir|View/.test((await b.textContent()) ?? '')) { await b.click(); break; } }
  await a.page.waitForTimeout(200);
  await a.page.click('[data-door="motion.toggleRun#menu-view-run-interactions"]').catch(() => {});
  await a.page.waitForTimeout(700);
  const marquee = await a.page.evaluate(() => {
    const w = document.querySelector('.frame__page').contentWindow;
    const el = w.document.querySelector('h1');
    const holder = el.querySelector('div');
    const track = holder?.firstElementChild;
    return { overflow: w.getComputedStyle(el).overflow, trackLength: track?.offsetWidth ?? null, holderWidth: holder?.offsetWidth ?? null };
  });
  await a.browser.close();

  // L09a — a caixa de conteúdo do palco, a roda sobre o campo numérico; L09b — as linhas do inspector
  const b = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  await b.page.click('[data-door="workspace.setPanelOpen#toolbar-activity-bar-styles"]');
  await b.page.waitForTimeout(500);
  const measured = await b.page.evaluate(() => {
    const stage = document.querySelector('[data-canvas-stage]');
    const sStyle = getComputedStyle(stage);
    const content = { width: stage.clientWidth - (parseFloat(sStyle.paddingLeft) || 0) - (parseFloat(sStyle.paddingRight) || 0), height: stage.clientHeight - (parseFloat(sStyle.paddingTop) || 0) - (parseFloat(sStyle.paddingBottom) || 0) };
    const row = document.querySelector('.field-row');
    const rowStyle = row ? getComputedStyle(row) : null;
    return {
      stageContent: content,
      row: row ? { clientWidth: row.clientWidth, paddingLeft: rowStyle.paddingLeft, paddingRight: rowStyle.paddingRight, gridTemplateColumns: rowStyle.gridTemplateColumns, stacked: 'stacked' in row.dataset } : null,
      typing: document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement ? document.activeElement.tagName : null,
    };
  });
  const wheel = await b.page.evaluate(async () => {
    const input = document.querySelector('.inspector input.box__input');
    if (input === null) return { error: 'sem campo numérico' };
    input.focus();
    const atFocus = document.activeElement === input;
    input.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true }));
    await new Promise((r) => requestAnimationFrame(r));
    return { fieldFocused: atFocus, activeIsField: document.activeElement === input };
  });
  await b.browser.close();

  console.log(JSON.stringify({ config: nome, marquee, ...measured, wheel }));
}
