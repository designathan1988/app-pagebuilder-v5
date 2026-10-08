/* global console, document, window */
// MED-0045 — L09b (ENT-L09b-0065): a posição de rolagem e a altura visível do rolador da árvore de Camadas
// (`el.scrollTop`, `el.clientHeight`), de que a decisão de rolar até a linha focada depende, lidos em
// src/editor/shell/sidebar/layers.tsx:498.
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
