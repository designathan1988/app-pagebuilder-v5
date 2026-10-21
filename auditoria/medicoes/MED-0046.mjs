/* global console, document, window */
// MED-0046 — L09b (ENT-L09b-0068, ENT-L09b-0069): the widths of the breadcrumb levels (`crumb` in
// getBoundingClientRect().width), that of the "…" button and the nav width (`own.clientWidth`), read in
// src/editor/shell/status-bar.tsx:161, :162 and :163.
import { chromium } from '@playwright/test';

// a deep document, with long names, so the breadcrumb folds
const node = (id, type, name, tag, children) => ({ id, type, name, tag, attributes: {}, classes: [], styles: {}, text: type === 'heading' ? 'Olá' : null, children });
const deep = node('n-page', 'page', 'Page', 'body', [node('n-1', 'section', 'Seção Principal De Layout Comprida', 'section', [node('n-2', 'div', 'Coluna Central Alongada Do Conteúdo', 'div', [node('n-3', 'div', 'Cartão De Destaque Interno', 'div', [node('n-4', 'div', 'Área De Detalhes Expandida Do Cartão', 'div', [node('n-5', 'div', 'Bloco Aninhado Bem Profundo', 'div', [node('n-6', 'heading', 'Título Final Da Página', 'h1', [])])])])])])]);
const PROJECT = JSON.stringify({ version: 4, pages: [{ id: 'p-home', name: 'Home', file: 'index.html', tree: deep }] });
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

for (const [configName, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Seção Principal De Layout Comprida/Coluna Central Alongada Do Conteúdo/Cartão De Destaque Interno/Área De Detalhes Expandida Do Cartão/Bloco Aninhado Bem Profundo/Título Final Da Página' } } }] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForFunction(() => (window.__builderTestPort?.boot().length ?? -1) >= 2);
  await page.waitForTimeout(400);

  const measured = await page.evaluate(() => {
    const nav = document.querySelector('.status-bar__breadcrumb');
    const copy = document.querySelector('.status-bar__crumbs-measure');
    const widths = [...(copy?.querySelectorAll('[data-crumb]') ?? [])].map((crumb) => crumb.getBoundingClientRect().width);
    const more = copy?.querySelector('[data-crumb-more]')?.getBoundingClientRect().width ?? 0;
    return { levels: widths.length, widths, moreButtonWidth: more, navClientWidth: nav?.clientWidth ?? null, folded: !!document.querySelector('.status-bar__crumb--more[aria-expanded]') };
  });

  console.log(JSON.stringify({ config: configName, ...measured }));
  await browser.close();
}
