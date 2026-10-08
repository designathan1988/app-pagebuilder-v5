/* global console, document, getComputedStyle, performance, setTimeout, window */
// MED-0013 — o id é citado por duas áreas com valores distintos, medidos os dois:
//  (a) ENT-L05b-0031 (menu.tsx:240): o elemento ativo do documento (`document.activeElement`) no momento em que a
//      camada fecha, de que a decisão de devolver o foco ao gatilho depende;
//  (b) ENT-L07-0002, 0003, 0011, 0021, 0067, 0068 (canvas/chip-fit): os tokens calculados `--space-1`, `--space-2` e
//      `--space-4`, a lista de colunas calculada dos grupos do painel rápido (chip-fit.ts:57) e o tamanho desenhado.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJETO = fs.readFileSync('manifest/features/fixtures/grid-page.json', 'utf8');
const COMANDOS = [{ command: 'selection.select', args: { target: { $node: '/Page/Grid' } } }];

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

const DESCREVE = () => {
  const el = document.activeElement;
  if (el === null) return null;
  return { tag: el.tagName, cls: typeof el.className === 'string' ? el.className : '', door: el.getAttribute?.('data-door') ?? null, menu: el.getAttribute?.('data-menu') ?? null, role: el.getAttribute?.('role') ?? null, isBody: el === document.body };
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
  const tokens = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const stage = document.querySelector('[data-canvas-stage]');
    const st = getComputedStyle(stage);
    const chip = document.querySelector('.quick-panel-chip');
    const label = document.querySelector('[data-chrome="label"]');
    const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { width: r.width, height: r.height }; };
    return {
      root: { space1: root.getPropertyValue('--space-1').trim(), space2: root.getPropertyValue('--space-2').trim(), space4: root.getPropertyValue('--space-4').trim() },
      onStage: { space1: st.getPropertyValue('--space-1').trim(), space2: st.getPropertyValue('--space-2').trim(), space4: st.getPropertyValue('--space-4').trim() },
      chipSize: box(chip), labelBox: box(label),
    };
  });
  await page.evaluate(() => document.querySelector('.quick-panel-chip')?.click());
  await page.waitForTimeout(300);
  const panel = await page.evaluate(() => {
    const p = document.querySelector('.quick-panel');
    if (p === null) return null;
    const groups = [...p.querySelectorAll('.quick-panel__group-fields')];
    const cols = groups.map((g) => getComputedStyle(g).gridTemplateColumns);
    const fields = [...p.querySelectorAll('.quick-panel__group-fields > .field-row')];
    return { offsetWidth: p.offsetWidth, offsetHeight: p.offsetHeight, columns: cols, fieldWidths: fields.map((el) => el.getBoundingClientRect().width) };
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(120);
  await page.locator('.menu-button[data-menu="file"]').first().click();
  await page.waitForTimeout(150);
  const activeInMenu = await page.evaluate(DESCREVE);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  const activeAfterEscape = await page.evaluate(DESCREVE);
  console.log(JSON.stringify({ config: nome, valor: { tokens, panel, activeInMenu, activeAfterEscape } }));
  await browser.close();
}
