/* global console, document, getComputedStyle */
// MED-0102 — the inner width and the scroll of the panel's rows, read in `src/editor/shell/row-fit.ts:60`
// `  const inner = row.clientWidth - px(style.paddingLeft) - px(style.paddingRight);` and `src/editor/shell/row-fit.ts:71`
// `    const overflow = choice.scrollWidth - choice.clientWidth;`, on which the decision to stack depends
// (`src/editor/shell/row-fit.ts:108` `    const stacked = rows.map((row) => (typing !== null && row.contains(typing) ? 'stacked' in row.dataset : !fitsBeside(row, context)));`).
//
// State: a deep document (twelve nested containers, each with a long name), whose deepest level is
// a form with a label and a select with a long name. The label is chosen and points to the select
// (element.setLabelTarget), so that the "Labelled control" field of the inspector's Settings tab — an
// offered-values field, with a list — carries the control's name. The inspector is measured with every section and row
// open: on the Style tab, the inner width of each row (line 60); on the Settings tab, the inner width and the
// scroll of the offered-values field (line 71), and whether the row stacks.
//
// Run from the root: cat auditoria/medicoes/MED-0102.mjs | node --input-type=module -
import { chromium } from '@playwright/test';

const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

// the deep document: twelve containers with long names around a form with a label and a select
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

// a row's inner width, as line 60 reads it
const innerOf = (row) => {
  const s = getComputedStyle(row);
  return +(row.clientWidth - (parseFloat(s.paddingLeft) || 0) - (parseFloat(s.paddingRight) || 0)).toFixed(2);
};

for (const [configName, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: deepProject(), commands: COMMANDS, drawn: [] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForSelector('.workbench');

  // every inspector section and row open
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

  const style = await page.evaluate((innerSrc) => {
    const innerOf = new Function('row', `return (${innerSrc})(row)`);
    const rows = [...new Set([...document.querySelectorAll('[data-region="inspector-style"] .field-row')])];
    const inner = rows.map((r) => innerOf(r));
    return { rows: rows.length, inner_widths: [...new Set(inner)].sort((a, b) => a - b), stacked: rows.filter((r) => 'stacked' in r.dataset).length };
  }, innerOf.toString());

  await page.locator('[data-door="workspace.setActiveTab#inspector-tab-settings"]').click();
  await page.waitForTimeout(400);
  for (let i = 0; i < 400; i += 1) {
    const closed = page.locator('.inspector [data-door="inspector.toggleRow#inspector-row-disclosure"][aria-expanded="false"]');
    if ((await closed.count()) === 0) break;
    await closed.first().click();
  }
  await page.waitForTimeout(400);

  const settings = await page.evaluate((innerSrc) => {
    const innerOf = new Function('row', `return (${innerSrc})(row)`);
    const rows = [...new Set([...document.querySelectorAll('[data-region="inspector-settings"] .field-row')])];
    const choice = rows
      .filter((r) => r.querySelector(':scope > input[list]'))
      .map((r) => {
        const field = r.querySelector(':scope > input[list]');
        return { label: (r.querySelector(':scope > .field-row__label')?.textContent || ''), inner_width: innerOf(r), value: field.value, field_cw: field.clientWidth, field_sw: field.scrollWidth, scroll: field.scrollWidth - field.clientWidth, stacked: 'stacked' in r.dataset };
      });
    return { rows: rows.length, stacked: rows.filter((r) => 'stacked' in r.dataset).length, choice };
  }, innerOf.toString());

  console.log(JSON.stringify({ config: configName, style, settings }));
  await browser.close();
}
