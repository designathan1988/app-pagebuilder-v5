// What a hostile text does to the readers that take one (the investigation's C8: "ReDoS" and "poluição de
// protótipo", both without a browser). Two rules: a text of any length and any shape is refused or read, never
// thrown on and never left running for long (the readers are regexes and recursive descents over what the person
// types in a field or a saved document holds); and a key such as "__proto__" or "constructor" that arrives in a patch
// is an ordinary key, never a write to Object.prototype.
import { describe, expect, it } from 'vitest';
import { applyPatches, PatchError, type Patch } from '../../../src/core/history/transaction.ts';
import { sanitizedSvgMarkup } from '../../../src/core/elements/svg.ts';
import { readValue } from '../../../src/core/style/set.ts';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import { createEditorStore, MODEL_RULES } from '../../../src/editor/store.ts';
import { translate } from '../../../src/i18n/index.ts';
import { lexerCss } from '../css-lexer-port.ts';
import { fixture } from './harness.ts';
import { readProject } from '../../../src/core/project/archive.ts';
import { capturedProblems } from '../../../src/core/document/captured.ts';
import { validateDocument } from '../../../src/core/document/validate.ts';
import { readStylesheet } from '../../../src/core/import/stylesheet.ts';
import { specificityOf } from '../../../src/core/import/selectors.ts';
import { workOut } from '../../../src/core/style/codecs.ts';
import type { CommandId } from '../../../src/generated/ids.ts';

// the room one read of one text may take: a linear reader takes microseconds, an exponential one takes minutes, and a
// recursion that overflows the stack throws instead of taking time at all
const ROOM_MS = 500;

const memory = (): { read(): string | null; write(text: string): void } => ({ read: () => null, write: () => undefined });
const store = () => createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(0), ids: sequentialIds('r'), restored: { document: fixture('aurora'), selection: [] }, ports: { css: lexerCss, readOnly: () => false }, freeze: true });
const contextOf = (on: ReturnType<typeof store>) => ({ state: on.getState(), rules: MODEL_RULES, css: lexerCss, words: (k: string, p?: Record<string, string | number>) => translate('pt-BR', k as never, p ?? {}) }) as unknown as Parameters<typeof readValue>[0];

// the properties a field may hand a text to: a length, a colour, a transform, a track list, an image, a family, a time
const PROPERTIES = ['width', 'padding-top', 'color', 'transform', 'grid-template-columns', 'background-image', 'font-family', 'transition', 'content'];

// A text that makes a regex backtrack or a recursion go deep: nesting, repetition, a long run of one character, a
// number with a huge exponent, an unterminated function, a comment that never closes.
const HOSTILE: readonly string[] = [
  '('.repeat(20_000) + '1' + ')'.repeat(20_000),
  '('.repeat(20_000) + '1px' + ')'.repeat(20_000),
  '('.repeat(20_000),
  ')'.repeat(20_000),
  'calc(' + '('.repeat(5_000) + '1',
  '1' + '+1'.repeat(20_000),
  'calc(' + '1+'.repeat(20_000) + '1)',
  '1'.repeat(100_000),
  '.'.repeat(50_000) + '1px',
  '1.' + '0'.repeat(50_000) + 'e' + '9'.repeat(5_000) + 'px',
  '-'.repeat(10_000) + '1px',
  ' '.repeat(100_000) + '1px',
  '--' + 'a'.repeat(50_000),
  'var(--' + 'a'.repeat(50_000),
  'rgb(' + '1,'.repeat(20_000),
  'translate(' + '1px '.repeat(20_000) + ')',
  '#'.repeat(100_000),
  'a'.repeat(200_000),
  'url(' + 'a'.repeat(100_000),
  'cubic-bezier(' + '1,'.repeat(20_000),
  'cubic-bezier(0.' + '9'.repeat(20_000),
];

describe('um texto hostil contra os leitores que o leem', () => {
  it('nunca é lançado e nunca demora, em nenhuma propriedade', () => {
    const context = contextOf(store());
    const broken: string[] = [];
    for (const property of PROPERTIES) {
      for (const text of HOSTILE) {
        const shown = `${property}: "${text.length > 24 ? `${text.slice(0, 24)}…(${text.length})` : text}"`;
        const started = performance.now();
        try {
          readValue(context, property, text);
        } catch (error) {
          broken.push(`${shown} lançou ${(error as Error).constructor.name}: ${(error as Error).message.slice(0, 60)}`);
          continue;
        }
        const took = performance.now() - started;
        if (took > ROOM_MS) broken.push(`${shown} levou ${Math.round(took)} ms`);
      }
    }
    expect(broken.slice(0, 8), 'textos que derrubaram ou travaram um leitor').toEqual([]);
  });

  it('nunca derruba o sanitizador do markup de SVG', () => {
    const broken: string[] = [];
    for (const text of HOSTILE) {
      const markup = `<svg>${text}</svg>`;
      const started = performance.now();
      try {
        sanitizedSvgMarkup(markup);
      } catch (error) {
        broken.push(`"${markup.slice(0, 24)}…(${markup.length})" lançou ${(error as Error).constructor.name}`);
        continue;
      }
      if (performance.now() - started > ROOM_MS) broken.push(`"${markup.slice(0, 24)}…" demorou`);
    }
    // nesting that never closes, a comment that never closes, an attribute that never closes, a tag that never closes
    for (const markup of ['<svg>' + '<g>'.repeat(50_000), '<svg><!--' + 'a'.repeat(100_000), '<svg><rect x="', '<svg><rect']) {
      try {
        const read = sanitizedSvgMarkup(markup);
        expect('refusal' in read || typeof read.markup === 'string', 'o sanitizador devolve uma recusa ou um markup').toBe(true);
      } catch (error) {
        broken.push(`"${markup.slice(0, 24)}…" lançou ${(error as Error).constructor.name}`);
      }
    }
    expect(broken.slice(0, 8)).toEqual([]);
  });

  it('uma chave __proto__ num patch é uma chave comum, nunca uma escrita no protótipo', () => {
    const document = fixture('aurora');
    const before = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
    const patches: readonly Patch[] = [
      { op: 'add', path: ['__proto__', 'polluted'], value: 'yes' },
      { op: 'add', path: ['pages', 0, 'tree', '__proto__'], value: { polluted: 'yes' } },
    ];
    const applied = applyPatches(document, patches);
    expect((({}) as Record<string, unknown>).polluted, 'Object.prototype não foi poluído').toBeUndefined();
    expect(Object.getOwnPropertyNames(Object.prototype).sort().join(','), 'os nomes do protótipo são os de antes').toBe(before);
    // the key is held as an own property of the object the patch names, where the patch put it
    expect(Object.hasOwn(applied.document as unknown as Record<string, unknown>, '__proto__')).toBe(true);
    expect(Object.hasOwn(applied.document.pages[0]?.tree as unknown as Record<string, unknown>, '__proto__')).toBe(true);
    // a path that would walk into a function is refused, and refuses without writing anything
    expect(() => applyPatches(document, [{ op: 'add', path: ['constructor', 'prototype', 'polluted'], value: 'yes' }])).toThrow(PatchError);
    expect((({}) as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.getOwnPropertyNames(Object.prototype).sort().join(',')).toBe(before);
  });

  it('um documento salvo com chaves __proto__ não polui o protótipo ao ser lido', () => {
    const before = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
    const document = JSON.parse('{"version":4,"pages":[],"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted":"yes"}}}') as unknown;
    const applied = applyPatches(document as never, [{ op: 'add', path: ['note'], value: 'x' }]);
    expect((({}) as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.getOwnPropertyNames(Object.prototype).sort().join(',')).toBe(before);
    expect(applied.document).toBeTruthy();
  });

  // What comes from outside and is deeper or of another shape than any page (DEF-0543, DEF-0544, DEF-0545): refused, or
  // read as far as it goes, never a throw.
  it('uma árvore funda, um componente sem filhos, uma captura antiga malformada, uma colagem malformada e um CSS aninhado fundo são recusados ou lidos, nunca derrubam o leitor', () => {
    const chain = (depth: number): Record<string, unknown> => {
      let node: Record<string, unknown> = { id: 'n0', type: 'div', name: 'n0', tag: 'div', attributes: {}, classes: [], styles: {}, text: null, children: [] };
      for (let i = 1; i < depth; i += 1) node = { id: `n${String(i)}`, type: 'div', name: `n${String(i)}`, tag: 'div', attributes: {}, classes: [], styles: {}, text: null, children: [node] };
      return node;
    };
    const deep = { version: 4, pages: [{ id: 'p', name: 'Home', file: 'index.html', tree: { id: 'root', type: 'page', name: 'Page', tag: 'body', attributes: {}, classes: [], styles: {}, text: null, children: [chain(4000)] } }] };
    const read = readProject(deep, MODEL_RULES);
    expect('refused' in read && read.refused.params?.reason, 'um projeto de 4.000 níveis é recusado pela profundidade').toMatchObject({ key: 'status.open.tooDeep' });
    let captured: unknown = { kind: 'text', id: 't', value: 'x' };
    for (let i = 0; i < 10_000; i += 1) captured = { kind: 'element', id: `c${String(i)}`, namespace: 'http://www.w3.org/1999/xhtml', tag: 'div', attributes: [], children: [captured] };
    expect(capturedProblems({ widths: [1280], root: captured }).length, 'uma captura de 10.000 níveis é recusada').toBeGreaterThan(0);
    const page = fixture('aurora');
    const withComponent = { ...page, components: [{ name: 'Cartão', tree: { id: 'k', type: 'div', name: 'k', tag: 'div', attributes: {}, classes: [], styles: {}, text: null } }] };
    expect(validateDocument(withComponent as never, [], MODEL_RULES).some((problem) => problem.path.startsWith('/components/0/tree')), 'um componente cuja árvore não tem filhos é recusado').toBe(true);
    const oldCapture = { version: 3, pages: [{ id: 'p', name: 'Home', file: 'index.html', tree: { id: 'root', type: 'page', name: 'Page', tag: 'body', attributes: {}, classes: [], styles: {}, text: null, children: [] }, capture: { viewports: [null] } }] };
    expect('refused' in readProject(oldCapture, MODEL_RULES), 'um projeto de versão 3 com uma captura nula é recusado').toBe(true);
    const store = createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(1_000_000), ids: sequentialIds('r'), restored: { document: fixture('aurora'), selection: ['n-title'] }, ports: { readOnly: () => false }, freeze: true });
    const pasted = (store.dispatch as (id: CommandId, args: unknown) => { status: string })('clipboard.paste' as CommandId, { clipboard: { status: 'read', html: null, text: JSON.stringify({ format: 'builder/elements', nodes: [{ id: 'x', name: 'X' }] }) } });
    expect(['done', 'refused'], 'a colagem de elementos malformados no formato do app termina').toContain(pasted.status);
    expect(() => readStylesheet(`${'@media (min-width: 1px) {'.repeat(5000)} a { color: red } ${'}'.repeat(5000)}`), 'um CSS com 5.000 @media aninhados é lido').not.toThrow();
    // the unary signs of a sum are bounded as its parentheses are (DEF-0516: only the parentheses had a mutant)
    expect(workOut(`${'-'.repeat(10_000)}1`), 'uma conta com 10.000 sinais unários é recusada').toBeNull();
    expect(() => specificityOf(`${':is('.repeat(5000)}a${')'.repeat(5000)}`), 'um seletor com 5.000 :is( aninhados é contado').not.toThrow();
  });
});
