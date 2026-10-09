// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The model of the structure commands (tools/runner/model/harness.ts): insert, delete, duplicate, move, wrap, unwrap,
// rename and hide, mixed with typing and gestures; and the integrity the store leans on after every write (CLAUDE.md,
// "Integridade do documento"): the model refuses a document with an id used twice, and a patch never adds past the end
// of a list.
import fc from 'fast-check';
import { expect, it } from 'vitest';
import { walk, type DocumentJson } from '../../../src/core/document/model.ts';
import { validateDocument } from '../../../src/core/document/validate.ts';
import { applyPatches, PatchError, type Path } from '../../../src/core/history/transaction.ts';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import { createEditorStore, MODEL_RULES } from '../../../src/editor/store.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { command, FIXTURES, fixture, nodesOf, PALETTE, pick, runModel } from './harness.ts';

const STEPS = [
  fc.nat(30).map((e) => command('element.insert', () => ({ entry: pick(PALETTE, e) }), `Inserir(${pick(PALETTE, e) ?? ''})`)),
  fc.nat(30).map((e) => command('element.insert', () => ({ entry: pick(PALETTE, e) }), `Inserir(${pick(PALETTE, e) ?? ''})`)),
  fc.constant(null).map(() => command('element.delete', () => ({}), 'Apagar')),
  fc.constant(null).map(() => command('element.duplicate', () => ({}), 'Duplicar')),
  fc.constant(null).map(() => command('element.moveUp', () => ({}), 'Subir')),
  fc.constant(null).map(() => command('element.moveDown', () => ({}), 'Descer')),
  fc.constant(null).map(() => command('element.wrapRow', () => ({}), 'EnvolverEmLinha')),
  fc.constant(null).map(() => command('element.unwrap', () => ({}), 'Desembrulhar')),
  fc.tuple(fc.integer({ min: -3, max: 3 }), fc.integer({ min: -3, max: 3 })).map(([dx, dy]) => command('position.move', () => ({ dx, dy }), `Mover(${dx},${dy})`)),
  fc.tuple(fc.nat(40), fc.constantFrom('Cartão', 'Hero', '')).map(([i, name]) => command('element.rename', (s) => ({ target: pick(nodesOf(s), i), name }), `RenomearElemento(${i},${name})`)),
  fc.constant(null).map(() => command('element.toggleHidden', () => ({}), 'Ocultar')),
];

it('os comandos de estrutura seguem o modelo do manifesto', () => {
  const summary = runModel('structure', STEPS);
  expect(summary.failure).toBeNull();
});

// every list of children in the document, by its path
function childLists(document: DocumentJson): { path: Path; length: number }[] {
  const out: { path: Path; length: number }[] = [];
  document.pages.forEach((page, p) => {
    const visit = (node: DocumentJson['pages'][number]['tree'], path: Path) => {
      out.push({ path: [...path, 'children'], length: node.children.length });
      node.children.forEach((child, i) => visit(child, [...path, 'children', i]));
    };
    visit(page.tree, ['pages', p, 'tree']);
  });
  return out;
}

it('a integridade do documento: um id usado duas vezes é recusado, e nenhum patch acrescenta além do fim de uma lista', () => {
  fc.assert(
    fc.property(fc.constantFrom(...FIXTURES), fc.nat(500), fc.nat(500), fc.nat(3), (name, a, b, past) => {
      const document = fixture(name);
      expect(validateDocument(document, [], MODEL_RULES)).toEqual([]);
      // a node takes the id of another
      const nodes = document.pages.flatMap((p, pi) => [...walk(p.tree)].map((n) => ({ id: n.id, page: pi })));
      const from = nodes[a % nodes.length];
      const to = nodes[(b % (nodes.length - 1)) + 1 > a % nodes.length ? (b % (nodes.length - 1)) + 1 : b % (nodes.length - 1)];
      if (from !== undefined && to !== undefined && from.id !== to.id) {
        const twice = JSON.parse(JSON.stringify(document).split(`"id":"${to.id}"`).join(`"id":"${from.id}"`)) as DocumentJson;
        expect(validateDocument(twice, [], MODEL_RULES).some((problem) => problem.message.includes(from.id))).toBe(true);
      }
      // an add at the end of a list is taken; one past it is refused
      const list = pick(childLists(document), a);
      if (list !== undefined) {
        const value = { ...document.pages[0]?.tree, id: 'model-added', children: [] };
        expect(() => applyPatches(document, [{ op: 'add', path: [...list.path, list.length], value }])).not.toThrow();
        expect(() => applyPatches(document, [{ op: 'add', path: [...list.path, list.length + 1 + past], value }])).toThrow(PatchError);
      }
    }),
    { seed: 20261008, numRuns: 200 },
  );
});

// Which element stands in which, by the HTML content model, after every write and on a file opened (CLAUDE.md,
// "consistência pai/filho e regras de aninhamento"; DEF-0540): the validator refuses the nestings the commands that
// place elements refuse, and a change of an attribute that makes an element interactive inside a link is refused.
const element = (id: string, type: string, tag: string, children: unknown[] = [], attributes: Record<string, unknown> = {}) => ({ id, type, name: id, tag, attributes, classes: [], styles: {}, text: null, children });
const onePage = (children: unknown[]): DocumentJson => ({ version: 4, pages: [{ id: 'p', name: 'Home', file: 'index.html', tree: element('root', 'page', 'body', children) }] }) as unknown as DocumentJson;
it('o aninhamento das tags: o validador recusa o que os comandos de colocação recusam', () => {
  const nested: readonly (readonly [string, DocumentJson])[] = [
    ['<li> dentro de <div>', onePage([element('d', 'div', 'div', [element('l', 'listItem', 'li')])])],
    ['<a> dentro de <a>', onePage([element('a1', 'linkBlock', 'a', [element('a2', 'linkBlock', 'a', [], { href: 'https://example.invalid/x' })], { href: 'https://example.invalid/y' })])],
    ['<form> dentro de <form>', onePage([element('f1', 'form', 'form', [element('f2', 'form', 'form')])])],
    ['<tr> dentro de <section>', onePage([element('s', 'section', 'section', [element('t', 'tableRow', 'tr')])])],
    ['<video controls> dentro de <a>', onePage([element('a1', 'linkBlock', 'a', [element('v', 'video', 'video', [], { controls: true })], { href: 'https://example.invalid/y' })])],
  ];
  const accepted = nested.filter(([, doc]) => !validateDocument(doc, [], MODEL_RULES).some((problem) => problem.path.endsWith('/children/0') && /inside|only accepts|holds one/.test(problem.message))).map(([name]) => name);
  expect(accepted, 'aninhamentos que o validador aceita').toEqual([]);
  expect(validateDocument(onePage([element('u', 'list', 'ul', [element('l', 'listItem', 'li')])]), [], MODEL_RULES), 'um <li> dentro de <ul> é aceito (controle)').toEqual([]);
  // the store: an attribute that makes the video interactive inside the link is refused, the document as it was
  const memory = () => ({ read: () => null, write: () => undefined });
  const store = createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(1_000_000), ids: sequentialIds('n'), restored: { document: onePage([element('a1', 'linkBlock', 'a', [element('v', 'video', 'video')], { href: 'https://example.invalid/y' })]), selection: [] }, ports: { readOnly: () => false }, freeze: true });
  const before = store.getState().document;
  const outcome = (store.dispatch as (id: CommandId, args: unknown) => { status: string })('element.setAttribute' as CommandId, { target: 'v', attribute: 'controls', value: true });
  expect(outcome.status, 'controls num vídeo dentro de um link é recusado').toBe('refused');
  expect(store.getState().document, 'o documento ficou como estava').toBe(before);
});
