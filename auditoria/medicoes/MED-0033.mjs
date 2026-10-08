/* global console, document, getComputedStyle, window */
// MED-0033 — os valores calculados pelo navegador que o id cita.
//  - L08 (ENT-L08-0010): a caixa do seguidor e a janela, de que a posição do translate depende
//    (src/editor/motion/runtime/behaviours.ts:147 e :139).
//  - L09a (ENT-L09a-0015): a caixa e o estilo calculado do palco (src/editor/shell/canvas.tsx:259 e :260).
//  - L09a (ENT-L09a-0082) e L09b (ENT-L09b-0010): a caixa do campo ancorado, o estilo calculado e o tamanho do painel
//    de um menu de valores (src/editor/shell/field.tsx:99, :102, :104) e de um Popover (src/editor/shell/popover.tsx:66,
//    :69, :73) — outros lotes; ver MED-0033.md.
//  - L10a (ENT-L10a-0008): o elemento ativo do documento (src/modules/layout-composer/ui/panel.tsx:89) — outro lote.
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
  // L08 — o seguidor do cursor: a caixa do elemento e a janela
  const a = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }, { command: 'motion.setBehaviour', args: { behaviour: 'cursor-follow', amount: 0.2 } }]);
  for (const b of await a.page.locator('.menu-button').all()) { if (/Exibir|View/.test((await b.textContent()) ?? '')) { await b.click(); break; } }
  await a.page.waitForTimeout(200);
  await a.page.click('[data-door="motion.toggleRun#menu-view-run-interactions"]').catch(() => {});
  await a.page.waitForTimeout(700);
  const follower = await a.page.evaluate(() => {
    const w = document.querySelector('.frame__page').contentWindow;
    const el = w.document.querySelector('h1');
    const translate = w.getComputedStyle(el).translate;
    el.style.removeProperty('translate');
    const box = el.getBoundingClientRect();
    el.style.setProperty('translate', translate);
    return { box: { left: box.left, top: box.top, width: box.width, height: box.height }, innerWidth: w.innerWidth, innerHeight: w.innerHeight, translate };
  });
  await a.browser.close();

  // L09a — o palco
  const b = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  const stage = await b.page.evaluate(() => {
    const el = document.querySelector('[data-canvas-stage]');
    const first = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return { box: { left: first.left, top: first.top, width: first.width, height: first.height }, padding: { left: style.paddingLeft, right: style.paddingRight, top: style.paddingTop, bottom: style.paddingBottom }, border: { left: style.borderLeftWidth, right: style.borderRightWidth, top: style.borderTopWidth, bottom: style.borderBottomWidth } };
  });
  await b.browser.close();

  console.log(JSON.stringify({ config: nome, follower, stage }));
}
