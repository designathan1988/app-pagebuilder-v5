/* global MutationObserver, console, document, requestAnimationFrame, setTimeout, window */
// MED-0035 — os valores calculados pelo navegador que o id cita.
//  - L08 (ENT-L08-0011, ENT-L08-0020): a posição do ponteiro (src/editor/motion/runtime/behaviours.ts:153 e
//    src/editor/motion/runtime/triggers.ts:158), a posição que o navegador calcula para eventos de ponteiro reais.
//  - L09a (ENT-L09a-0039): a posição de rolagem do corpo do painel de código (src/editor/shell/code-pane.tsx:101).
//  - L09a (ENT-L09a-0102): o elemento ativo sobre o controle deslizante (src/editor/shell/field.tsx:819).
//  - L09b (ENT-L09b-0035): o elemento ativo antes de o preview abrir (src/editor/shell/shell.tsx:99).
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
  // L08 — a posição do ponteiro que o navegador calcula para eventos reais sobre o quadro (com Executar interações
  // ligado, o canvas deixa os eventos do ponteiro passarem ao quadro)
  const a = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }, { command: 'motion.setBehaviour', args: { behaviour: 'cursor-follow', amount: 0.2 } }]);
  for (const b of await a.page.locator('.menu-button').all()) { if (/Exibir|View/.test((await b.textContent()) ?? '')) { await b.click(); break; } }
  await a.page.waitForTimeout(200);
  await a.page.click('[data-door="motion.toggleRun#menu-view-run-interactions"]').catch(() => {});
  await a.page.waitForTimeout(600);
  const pointer = await a.page.evaluate(async ({ x, y }) => {
    const w = document.querySelector('.frame__page').contentWindow;
    const clientX = Math.round(x);
    const clientY = Math.round(y);
    const el = w.document.querySelector('h1');
    const send = (type) => el.dispatchEvent(new w.PointerEvent(type, { clientX, clientY, bubbles: true }));
    send('pointermove');
    await new Promise((r) => setTimeout(r, 400));
    const afterMove = w.getComputedStyle(el).translate;
    send('pointerdown');
    await new Promise((r) => setTimeout(r, 100));
    return { pointerMove: { clientX, clientY }, followerAfterMove: afterMove };
  }, { x: 800, y: 400 });
  await a.browser.close();

  // L09a e L09b — o painel de código, o controle deslizante e o preview
  const b = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  await b.page.click('[data-door="workspace.setPanelOpen#toolbar-activity-bar-styles"]');
  await b.page.waitForTimeout(400);
  await b.page.evaluate(() => {
    window.__atPreview = null;
    const obs = new MutationObserver(() => {
      if (window.__atPreview === null && document.querySelector('[data-preview], .preview')) { window.__atPreview = document.activeElement; obs.disconnect(); }
    });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true });
  });
  await b.page.click('[data-door="view.enterPreview#toolbar-top-bar-preview"]').catch(() => {});
  await b.page.waitForTimeout(400);
  const preview = await b.page.evaluate(() => ({ open: !!document.querySelector('[data-preview], .preview'), wasFocused: window.__atPreview ? { tag: window.__atPreview.tagName, className: window.__atPreview.className.toString() } : null }));
  await b.page.keyboard.press('Escape');
  await b.page.waitForTimeout(300);
  const slider = await b.page.evaluate(async () => {
    const el = document.querySelector('.inspector input[type="range"]');
    if (el === null) return { error: 'sem controle deslizante' };
    el.focus();
    await new Promise((r) => requestAnimationFrame(r));
    return { activeIsSlider: document.activeElement === el };
  });
  await b.page.click('[data-door="view.setEditorView#toolbar-canvas-toolbar-code"]').catch(() => {});
  await b.page.waitForTimeout(600);
  const code = await b.page.evaluate(() => {
    const body = document.querySelector('.code-pane__body');
    if (body === null) return { error: 'sem painel de código' };
    return { lines: body.querySelectorAll('.code-line').length, scrollTop: body.scrollTop, clientHeight: body.clientHeight, scrollHeight: body.scrollHeight };
  });
  await b.browser.close();

  console.log(JSON.stringify({ config: nome, pointer, preview, slider, code }));
}
