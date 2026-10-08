/* global console, document, getComputedStyle */
// MED-0102 — a largura interna e a rolagem das linhas do painel, lidas em `src/editor/shell/row-fit.ts:60`
// `  const inner = row.clientWidth - px(style.paddingLeft) - px(style.paddingRight);` e `src/editor/shell/row-fit.ts:71`
// `    const overflow = choice.scrollWidth - choice.clientWidth;`, de que a decisão de empilhar depende
// (`src/editor/shell/row-fit.ts:108` `    const stacked = rows.map((row) => (typing !== null && row.contains(typing) ? 'stacked' in row.dataset : !fitsBeside(row, context)));`).
//
// Estado: um documento profundo (doze contêineres aninhados, cada um com um nome longo), cujo nível mais fundo é
// um formulário com um rótulo e um seletor de nome longo. O rótulo é escolhido e aponta para o seletor
// (element.setLabelTarget), de modo que o campo "Controle rotulado" da aba Configurações do inspetor — um campo
// de valores oferecidos, com lista — leve o nome do controle. O inspetor é medido com todas as seções e linhas
// abertas: na aba Estilo, a largura interna de cada linha (linha 60); na aba Configurações, a largura interna e a
// rolagem do campo de valores oferecidos (linha 71), e se a linha empilha.
//
// Rodar da raiz: cat auditoria/medicoes/MED-0102.mjs | node --input-type=module -
import { chromium } from '@playwright/test';

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
};

// o documento profundo: doze contêineres com nomes longos em volta de um formulário com rótulo e seletor
function deepProject() {
  const node = (id, type, name, tag, attributes = {}, children = [], text = null) => ({ id, type, name, tag, attributes, classes: [], styles: {}, text, children });
  const form = node('d-form', 'form', 'Formulário de inscrição na newsletter semanal', 'form', {}, [
    node('d-label', 'label', 'Rótulo do campo de inscrição na newsletter semanal', 'label', {}, [node('d-input', 'input', 'Campo de texto para o nome completo', 'input', {}, [], null)]),
    node('d-select', 'select', 'Seletor de plano de assinatura anual premium', 'select', { name: 'plano-de-assinatura-anual-premium-com-desconto' }, [node('d-opt', 'option', 'Opção básica anual', 'option', {}, [], 'A')]),
  ]);
  let inner = [form];
  for (let level = 12; level >= 1; level -= 1) inner = [node(`d-${level}`, 'div', `Contêiner de destaques nível ${level} da página inicial`, 'div', {}, inner)];
  const tree = node('d-page', 'page', 'Página', 'body', {}, [node('d-section', 'section', 'Seção de apresentação principal do restaurante', 'section', {}, inner)]);
  return JSON.stringify({ version: 4, pages: [{ id: 'p-home', name: 'Início', file: 'index.html', tree }] });
}

const COMMANDS = [
  { command: 'workspace.setPanelOpen', args: { panel: 'inspector', open: 'open' } },
  { command: 'workspace.setActiveTab', args: { group: 'inspector', panel: 'style' } },
  { command: 'inspector.setMode', args: { mode: 'all' } },
  { command: 'selection.select', args: { target: 'd-label' } },
  { command: 'element.setLabelTarget', args: { control: 'd-select' } },
];

// a largura interna de uma linha, como a linha 60 a lê
const innerOf = (row) => {
  const s = getComputedStyle(row);
  return +(row.clientWidth - (parseFloat(s.paddingLeft) || 0) - (parseFloat(s.paddingRight) || 0)).toFixed(2);
};

for (const [nome, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: deepProject(), commands: COMMANDS, drawn: [] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForSelector('.workbench');

  // todas as seções e as linhas do inspetor abertas
  for (let i = 0; i < 40; i += 1) {
    const closed = page.locator('.inspector-section [data-door="inspector.toggleSection#inspector-section-header"][aria-expanded="false"]');
    if ((await closed.count()) === 0) break;
    await closed.first().click();
  }
  for (let i = 0; i < 400; i += 1) {
    const closed = page.locator('.inspector [data-door="inspector.toggleRow#inspector-row-disclosure"][aria-expanded="false"]');
    if ((await closed.count()) === 0) break;
    await closed.first().click();
  }
  await page.waitForTimeout(500);

  const estilo = await page.evaluate((innerSrc) => {
    const innerOf = new Function('row', `return (${innerSrc})(row)`);
    const rows = [...new Set([...document.querySelectorAll('[data-region="inspector-style"] .field-row')])];
    const inner = rows.map((r) => innerOf(r));
    return { linhas: rows.length, larguras_internas: [...new Set(inner)].sort((a, b) => a - b), empilhadas: rows.filter((r) => 'stacked' in r.dataset).length };
  }, innerOf.toString());

  await page.locator('[data-door="workspace.setActiveTab#inspector-tab-settings"]').click();
  await page.waitForTimeout(400);
  for (let i = 0; i < 400; i += 1) {
    const closed = page.locator('.inspector [data-door="inspector.toggleRow#inspector-row-disclosure"][aria-expanded="false"]');
    if ((await closed.count()) === 0) break;
    await closed.first().click();
  }
  await page.waitForTimeout(400);

  const config = await page.evaluate((innerSrc) => {
    const innerOf = new Function('row', `return (${innerSrc})(row)`);
    const rows = [...new Set([...document.querySelectorAll('[data-region="inspector-settings"] .field-row')])];
    const escolha = rows
      .filter((r) => r.querySelector(':scope > input[list]'))
      .map((r) => {
        const campo = r.querySelector(':scope > input[list]');
        return { rotulo: (r.querySelector(':scope > .field-row__label')?.textContent || ''), largura_interna: innerOf(r), valor: campo.value, campo_cw: campo.clientWidth, campo_sw: campo.scrollWidth, rolagem: campo.scrollWidth - campo.clientWidth, empilhada: 'stacked' in r.dataset };
      });
    return { linhas: rows.length, empilhadas: rows.filter((r) => 'stacked' in r.dataset).length, escolha };
  }, innerOf.toString());

  console.log(JSON.stringify({ config: nome, estilo, configuracoes: config }));
  await browser.close();
}
