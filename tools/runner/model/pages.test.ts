// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The model of the pages and of opening a project (tools/runner/model/harness.ts): pages added, renamed, duplicated,
// deleted and switched to, and another project opened (project.open with a project file's text, project.newBlankPage):
// the history starts empty there.
import fc from 'fast-check';
import { expect, it } from 'vitest';
import type { EditorState } from '../../../src/editor/store.ts';
import { command, LOAD_STEPS, pick, PROPERTIES, runModel, VALUES } from './harness.ts';

const pathOf = (s: EditorState, i: number): string | undefined => pick(s.document.pages.map((p) => p.file), i);

const STEPS = [
  ...LOAD_STEPS,
  fc.constantFrom('Sobre', 'Contato', 'Blog', 'Sobre').map((name) => command('pages.add', () => ({ name }), `NovaPágina(${name})`)),
  fc.tuple(fc.nat(5), fc.constantFrom('Início', 'Equipe', 'x')).map(([i, name]) => command('pages.rename', (s) => ({ page: pathOf(s, i), name }), `Renomear(${i},${name})`)),
  fc.nat(5).map((i) => command('pages.duplicate', (s) => ({ page: pathOf(s, i) }), `DuplicarPágina(${i})`)),
  fc.nat(5).map((i) => command('pages.delete', (s) => ({ page: pathOf(s, i) }), `ApagarPágina(${i})`)),
  fc.nat(5).map((i) => command('pages.switch', (s) => ({ page: pathOf(s, i) }), `IrParaPágina(${i})`)),
  fc.tuple(fc.nat(PROPERTIES.length - 1), fc.nat(VALUES.length - 1)).map(([p, v]) => command('style.set', () => ({ property: PROPERTIES[p], value: VALUES[v] }), `Estilo(${PROPERTIES[p] ?? ''}=${VALUES[v] ?? ''})`)),
];

it('as páginas e a abertura de projeto seguem o modelo do manifesto', () => {
  const summary = runModel('pages', STEPS);
  expect(summary.failure).toBeNull();
});
