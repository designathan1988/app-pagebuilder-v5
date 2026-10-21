// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The model of the pages and of opening a project (tools/runner/model/harness.ts): pages added, renamed, duplicated,
// deleted and switched to, and another project opened (project.open with a project file's text, project.newBlankPage):
// the history starts empty there.
import fc from 'fast-check';
import { expect, it } from 'vitest';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import { createEditorStore, type EditorState, type EditorStore } from '../../../src/editor/store.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { command, fixture, LOAD_STEPS, pick, PROPERTIES, runModel, VALUES } from './harness.ts';

const pathOf = (s: EditorState, i: number): string | undefined => pick(s.document.pages.map((p) => p.file), i);

const STEPS = [
  ...LOAD_STEPS,
  fc.constantFrom('Sobre', 'Contato', 'Blog', 'Sobre').map((name) => command('pages.add', () => ({ name }), `NewPage(${name})`)),
  fc.tuple(fc.nat(5), fc.constantFrom('Início', 'Equipe', 'x')).map(([i, name]) => command('pages.rename', (s) => ({ page: pathOf(s, i), name }), `Rename(${i},${name})`)),
  fc.nat(5).map((i) => command('pages.duplicate', (s) => ({ page: pathOf(s, i) }), `DuplicatePage(${i})`)),
  fc.nat(5).map((i) => command('pages.delete', (s) => ({ page: pathOf(s, i) }), `DeletePage(${i})`)),
  fc.nat(5).map((i) => command('pages.switch', (s) => ({ page: pathOf(s, i) }), `GoToPage(${i})`)),
  fc.tuple(fc.nat(PROPERTIES.length - 1), fc.nat(VALUES.length - 1)).map(([p, v]) => command('style.set', () => ({ property: PROPERTIES[p], value: VALUES[v] }), `Estilo(${PROPERTIES[p] ?? ''}=${VALUES[v] ?? ''})`)),
];

it('the pages and the project opening follow the manifest model', () => {
  const summary = runModel('pages', STEPS);
  expect(summary.failure).toBeNull();
});

// The selection of a captured page's element (ui.capturedNode) follows the store's one selection (rule G6): another
// selection takes it away, and so does opening another project, even with the selection empty (DEF-0542).
it('the selection of a captured element does not stay beside another selection nor after opening another project', () => {
  const memory = () => ({ read: () => null, write: () => undefined });
  const make = (): EditorStore => createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(1_000_000), ids: sequentialIds('c'), restored: { document: fixture('captured-mixed'), selection: [] }, ports: { readOnly: () => false }, freeze: true });
  const run = (store: EditorStore, id: string, args: unknown) => (store.dispatch as (i: CommandId, a: unknown) => { status: string })(id as CommandId, args);
  const one = make();
  expect(run(one, 'capture.select', { target: 'captured-story' }).status).toBe('done');
  expect(one.getState().ui.capturedNode, 'the captured element is selected').toBe('captured-story');
  const root = one.getState().document.pages[0]?.tree.id;
  run(one, 'selection.select', { target: root });
  expect(one.getState().ui.capturedNode, 'a document selection removes the captured element one').toBeUndefined();
  const two = make();
  run(two, 'capture.select', { target: 'captured-story' });
  expect(two.getState().selection, 'the document selection is empty').toEqual([]);
  // opening another project asks first (the work not saved): the person confirms
  if (run(two, 'project.open', { file: JSON.stringify(fixture('aurora')) }).status === 'confirm') two.answer(true);
  expect(two.getState().document.pages[0]?.tree.children.some((n) => n.id === 'n-hero'), 'the other project was opened').toBe(true);
  expect(two.getState().ui.capturedNode, "another project opened does not keep the previous one's captured selection").toBeUndefined();
});
