/* global console, document, getComputedStyle, window */
// MED-0037 — os valores calculados pelo navegador que o id cita.
//  - L08 (ENT-L08-0013): o espaço rolável, a posição de rolagem da página e a caixa do elemento
//    (src/editor/motion/runtime/scroll.ts:49, :50 e :52), medidos no documento do elemento (o quadro do canvas).
//  - L09a (ENT-L09a-0121, ENT-L09a-0122): o espaço útil da linha de um campo de valores, o estilo calculado e a
//    largura da cópia das palavras (src/editor/shell/field.tsx:1407, :1408 e :1409).
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
  // L08 — o espaço rolável, a posição de rolagem e a caixa do elemento (o quadro do canvas)
  const a = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  const scroll = await a.page.evaluate(() => {
    const w = document.querySelector('.frame__page').contentWindow;
    const root = w.document.documentElement;
    const source = w.document.querySelector('h1');
    const box = source.getBoundingClientRect();
    const room = root.scrollHeight - w.innerHeight;
    return { scrollableRoom: room, scrollY: w.scrollY, innerHeight: w.innerHeight, scrollHeight: root.scrollHeight, sourceBox: { top: box.top, height: box.height }, pageScrollProgress: room <= 0 ? 1 : w.scrollY / room };
  });
  await a.browser.close();

  // L09a — o espaço útil da linha de um campo de valores
  const b = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  await b.page.click('[data-door="workspace.setPanelOpen#toolbar-activity-bar-styles"]');
  await b.page.waitForTimeout(500);
  const fieldChoice = await b.page.evaluate(() => [...document.querySelectorAll('.field-choice')].map((room) => {
    const style = getComputedStyle(room);
    const available = room.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
    const copy = room.querySelector('.field-choice__measure');
    const needed = copy?.offsetWidth ?? null;
    return { className: room.className.toString(), clientWidth: room.clientWidth, paddingLeft: style.paddingLeft, paddingRight: style.paddingRight, available, needed, fits: needed !== null ? available > 0 && needed > 0 && needed <= available + 0.5 : null };
  }));
  await b.browser.close();

  console.log(JSON.stringify({ config: nome, scroll, fieldChoice }));
}
