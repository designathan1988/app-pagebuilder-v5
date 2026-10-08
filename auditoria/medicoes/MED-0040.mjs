/* global console, document, window */
// MED-0040 — L09b (ENT-L09b-0045): o elemento ativo do documento comparado com o campo do nome da página
// (`document.activeElement !== input.current`), de que o efeito que repõe o nome depende, lido em
// src/editor/shell/sidebar/explorer.tsx:70.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/responsive-title.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForFunction(() => (window.__builderTestPort?.boot().length ?? -1) >= 2);
  await page.click('[data-door="workspace.setPanelOpen#toolbar-activity-bar-explorer"]');
  await page.waitForTimeout(500);

  const measured = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('.explorer input[data-door], [data-region="explorer-pages"] input')];
    const field = inputs.find((el) => el.value.trim() !== '') ?? inputs[0] ?? null;
    const active = document.activeElement;
    return {
      fieldValue: field?.value ?? null,
      fieldDoor: field?.getAttribute('data-door') ?? null,
      activeTag: active?.tagName ?? null,
      activeClass: (active?.className || '').toString(),
      activeIsBody: active === document.body,
      activeIsField: field !== null && active === field,
      differs: field !== null && active !== field,
    };
  });

  console.log(JSON.stringify({ config: nome, ...measured }));
  await browser.close();
}
