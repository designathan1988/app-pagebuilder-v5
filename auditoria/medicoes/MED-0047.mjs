/* global console, document, getComputedStyle, window */
// MED-0047 — L09b (ENT-L09b-0070): a folga (`--space-4`) do menu dos níveis dobrados, a largura e a altura medidas do
// menu e o tamanho da janela (`innerWidth`, `innerHeight`), de que a posição depende, lidas em
// src/editor/shell/status-bar.tsx:215, :216 e :217. Exige o menu aberto (o botão "…" da barra de status).
import { chromium } from '@playwright/test';

const node = (id, type, name, tag, children) => ({ id, type, name, tag, attributes: {}, classes: [], styles: {}, text: type === 'heading' ? 'Olá' : null, children });
const deep = node('n-page', 'page', 'Page', 'body', [node('n-1', 'section', 'Seção Principal De Layout Comprida', 'section', [node('n-2', 'div', 'Coluna Central Alongada Do Conteúdo', 'div', [node('n-3', 'div', 'Cartão De Destaque Interno', 'div', [node('n-4', 'div', 'Área De Detalhes Expandida Do Cartão', 'div', [node('n-5', 'div', 'Bloco Aninhado Bem Profundo', 'div', [node('n-6', 'heading', 'Título Final Da Página', 'h1', [])])])])])])]);
const PROJECT = JSON.stringify({ version: 4, pages: [{ id: 'p-home', name: 'Home', file: 'index.html', tree: deep }] });
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Seção Principal De Layout Comprida/Coluna Central Alongada Do Conteúdo/Cartão De Destaque Interno/Área De Detalhes Expandida Do Cartão/Bloco Aninhado Bem Profundo/Título Final Da Página' } } }] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForFunction(() => (window.__builderTestPort?.boot().length ?? -1) >= 2);
  await page.waitForTimeout(400);
  await page.click('.status-bar__breadcrumb > .status-bar__crumb--more').catch(() => {});
  await page.waitForTimeout(300);

  const measured = await page.evaluate(() => {
    const menu = document.querySelector('.status-bar__breadcrumb .menu[role="menu"]');
    if (menu === null) return { error: 'o menu dos níveis dobrados não abriu' };
    const style = getComputedStyle(menu);
    const { width, height } = menu.getBoundingClientRect();
    return { edge: parseFloat(style.getPropertyValue('--space-4')) || 0, menuWidth: width, menuHeight: height, windowWidth: window.innerWidth, windowHeight: window.innerHeight, left: menu.getBoundingClientRect().left, top: menu.getBoundingClientRect().top };
  });

  console.log(JSON.stringify({ config: nome, ...measured }));
  await browser.close();
}
