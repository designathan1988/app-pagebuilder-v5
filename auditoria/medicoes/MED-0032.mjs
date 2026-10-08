/* global MutationObserver, console, document, window */
// MED-0032 — os valores calculados pelo navegador que o id cita.
//  - L08 (ENT-L08-0002): a caixa do elemento e a janela, de que o deslocamento do parallax depende
//    (src/editor/motion/runtime/behaviours.ts:57 e :59). O runtime do canvas só liga o comportamento com
//    "Executar interações" ligado depois de o quadro estar montado.
//  - L09a (ENT-L09a-0014): a largura que as abas de breakpoint tomam inteiras e o espaço da linha
//    (src/editor/shell/canvas.tsx:189).
//  - L09a (ENT-L09a-0068): o elemento ativo quando a pergunta de confirmação é feita (src/editor/shell/confirmation.tsx:33).
//  - L09b (ENT-L09b-0009): o elemento ativo do documento lido em src/editor/shell/popover.tsx:30.
//  - L10a (ENT-L10a-0004): o foco do compasso (src/modules/layout-composer/ui/overlay.tsx:109).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/responsive-title.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false, filtro: 'em branco' },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true, filtro: 'blank' },
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
  // L08 — o parallax do título: a caixa do elemento e a janela
  const a = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }, { command: 'motion.setBehaviour', args: { behaviour: 'parallax', amount: 0.3 } }]);
  for (const b of await a.page.locator('.menu-button').all()) { if (/Exibir|View/.test((await b.textContent()) ?? '')) { await b.click(); break; } }
  await a.page.waitForTimeout(200);
  await a.page.click('[data-door="motion.toggleRun#menu-view-run-interactions"]').catch(() => {});
  await a.page.waitForTimeout(700);
  const parallax = await a.page.evaluate(() => {
    const w = document.querySelector('.frame__page').contentWindow;
    const el = w.document.querySelector('h1');
    const translate = w.getComputedStyle(el).translate;
    // o código lê a caixa depois de tirar o translate posto (behaviours.ts:56), então a caixa é a do leiaute
    el.style.removeProperty('translate');
    const box = el.getBoundingClientRect();
    el.style.setProperty('translate', translate);
    return { box: { top: box.top, left: box.left, width: box.width, height: box.height }, innerWidth: w.innerWidth, innerHeight: w.innerHeight, translate };
  });
  await a.browser.close();

  // L09a — as abas e a confirmação
  const b = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  const tabs = await b.page.evaluate(() => {
    const el = document.querySelector('.frame-tabs');
    return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, room: el.style.width ? parseFloat(el.style.width) : null, compact: el.classList.contains('is-compact') };
  });
  await b.page.click('[data-door="commandBar.open#toolbar-top-bar-search"]');
  await b.page.waitForTimeout(200);
  await b.page.keyboard.type(c.filtro);
  await b.page.waitForTimeout(300);
  await b.page.evaluate(() => {
    window.__atAsk = null;
    const obs = new MutationObserver(() => {
      if (window.__atAsk === null && document.querySelector('[data-confirmation-dialog]')) { window.__atAsk = document.activeElement; obs.disconnect(); }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  });
  await b.page.click('[data-door="project.newBlankPage#command-bar"]');
  await b.page.waitForTimeout(300);
  const confirmation = await b.page.evaluate(() => ({ open: !!document.querySelector('[data-confirmation-dialog]'), activeWhenAsked: window.__atAsk ? { tag: window.__atAsk.tagName, className: window.__atAsk.className.toString() } : null }));
  await b.browser.close();

  console.log(JSON.stringify({ config: nome, parallax, tabs, confirmation }));
}
