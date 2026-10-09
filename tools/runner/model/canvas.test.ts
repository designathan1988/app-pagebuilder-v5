// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The canvas is the document (CLAUDE.md, rule G7): for each kind of change, the page the renderer patches in place
// (PageRenderer.apply, src/editor/canvas/render/render.ts) is the page a render from scratch of the document after
// the change draws, element by element and attribute by attribute, the <html> included. Besides the changes a node's
// own patch reaches, the ones an element reads from beyond its node (DEF-0539): the project's language on <html>, a
// button gone into a form (its type), the id attribute a link's reference names.
import { describe, expect, it } from 'vitest';
import { applyPatches, type Patch } from '../../../src/core/history/transaction.ts';
import { canvasValue } from '../../../src/core/files/values.ts';
import type { DocumentJson } from '../../../src/core/document/model.ts';
import { PageRenderer, renderModelFromManifest } from '../../../src/editor/canvas/render/render.ts';
import { manifest } from '../../../src/manifest/runtime.ts';

const model = renderModelFromManifest(manifest.elements, manifest.properties, manifest.interactions);
const node = (id: string, type: string, tag: string, fields: Record<string, unknown> = {}) => ({ id, type, name: id, tag, attributes: {}, classes: [], styles: {}, text: null, children: [], ...fields });
const page = (children: unknown[], extra: Record<string, unknown> = {}): DocumentJson =>
  ({ version: 4, ...extra, pages: [{ id: 'p1', name: 'Home', file: 'index.html', tree: node('root', 'page', 'body', { children }) }] }) as unknown as DocumentJson;
// the page as markup: every element with its attributes in name order, its text, the <html> first
const serial = (target: Document): string => {
  const write = (element: Element, deep: boolean): string =>
    `<${element.localName} ${[...element.attributes].map((a) => `${a.name}=${a.value}`).sort().join(' ')}>${deep ? [...element.childNodes].map((child) => (child.nodeType === 3 ? (child.nodeValue ?? '') : write(child as Element, true))).join('') : ''}</${element.localName}>`;
  return write(target.documentElement, false) + write(target.body, true);
};
// the page patched in place against the page drawn from scratch after the change
function compare(before: DocumentJson, patches: readonly Patch[]): { readonly incremental: string; readonly scratch: string } {
  let current = before;
  const target = document.implementation.createHTMLDocument('page');
  const renderer = new PageRenderer(target, model, 0, null, (name, value) => canvasValue(current, name, value));
  renderer.mount(before);
  const after = applyPatches(before, patches).document;
  current = after;
  renderer.apply(before, after, patches);
  const fresh = document.implementation.createHTMLDocument('page');
  new PageRenderer(fresh, model, 0, null, (name, value) => canvasValue(after, name, value)).mount(after);
  return { incremental: serial(target), scratch: serial(fresh) };
}
const at = (...path: (string | number)[]) => ['pages', 0, 'tree', ...path];

describe('o canvas é o documento: o render incremental é o render do zero', () => {
  const button = node('b', 'button', 'button', { text: 'Enviar' });
  const cases: readonly { readonly name: string; readonly before: DocumentJson; readonly patches: readonly Patch[] }[] = [
    // what reaches beyond a node's own patch (DEF-0539)
    { name: 'o idioma do projeto', before: page([node('t', 'paragraph', 'p', { text: 'Olá' })], { language: 'en' }), patches: [{ op: 'replace', path: ['language'], value: 'pt-BR' }] },
    { name: 'um botão movido para dentro de um formulário', before: page([node('f', 'form', 'form'), button]), patches: [{ op: 'remove', path: at('children', 1) }, { op: 'add', path: at('children', 0, 'children', 0), value: button }] },
    { name: 'um botão tirado de um formulário', before: page([node('f', 'form', 'form', { children: [button] })]), patches: [{ op: 'remove', path: at('children', 0, 'children', 0) }, { op: 'add', path: at('children', 1), value: button }] },
    { name: 'o id do alvo de um link', before: page([node('hero', 'section', 'section', { attributes: { id: 'topo' } }), node('l', 'link', 'a', { text: 'Ir', attributes: { href: '#hero' } })]), patches: [{ op: 'replace', path: at('children', 0, 'attributes', 'id'), value: 'inicio' }] },
    // the controls: a node's own patch
    { name: 'o estilo de um nó', before: page([node('t', 'paragraph', 'p', { text: 'a' })]), patches: [{ op: 'replace', path: at('children', 0, 'styles'), value: { desktop: { base: { color: 'red' } } } }] },
    { name: 'o texto de um nó', before: page([node('t', 'paragraph', 'p', { text: 'a' })]), patches: [{ op: 'replace', path: at('children', 0, 'text'), value: 'b' }] },
    { name: 'um nó inserido', before: page([node('t', 'paragraph', 'p', { text: 'a' })]), patches: [{ op: 'add', path: at('children', 1), value: node('u', 'paragraph', 'p', { text: 'c' }) }] },
    { name: 'um nó removido', before: page([node('t', 'paragraph', 'p', { text: 'a' }), node('u', 'paragraph', 'p', { text: 'c' })]), patches: [{ op: 'remove', path: at('children', 0) }] },
    { name: 'a tag de um nó', before: page([node('t', 'heading', 'h1', { text: 'a' })]), patches: [{ op: 'replace', path: at('children', 0, 'tag'), value: 'h2' }] },
  ];
  for (const one of cases)
    it(one.name, () => {
      const { incremental, scratch } = compare(one.before, one.patches);
      expect(incremental, `${one.name}: o canvas difere do render do zero`).toBe(scratch);
    });
});
