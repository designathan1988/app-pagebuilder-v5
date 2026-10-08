/* global console, document, window */
// MED-0042 — os valores calculados pelo navegador que o id cita.
//  - L09b (ENT-L09b-0058 a ENT-L09b-0060): a posição de rolagem e a altura visível do rolador da árvore de Camadas
//    (`el.scrollTop`, `el.clientHeight`), lidos em src/editor/shell/sidebar/layers.tsx:472.
//  - L09a (ENT-L09a-0123, ENT-L09a-0124): os valores próprios e do pai de cada selecionado, pela porta
//    `computedValues` (src/editor/shell/field.tsx:1487 e :1489) — ver MED-0042.md.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/layout-wireframe.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: [] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForFunction(() => (window.__builderTestPort?.boot().length ?? -1) >= 1);
  await page.click('[data-door="workspace.setPanelOpen#toolbar-activity-bar-explorer"]');
  await page.waitForTimeout(500);

  const scroller = await page.evaluate(() => {
    const el = document.querySelector('.layers-tree');
    if (el === null) return { error: 'sem rolador de Camadas' };
    return { scrollTop: el.scrollTop, clientHeight: el.clientHeight, scrollHeight: el.scrollHeight, rows: el.querySelectorAll('.row--tree').length };
  });

  console.log(JSON.stringify({ config: nome, scroller }));
  await browser.close();
}
