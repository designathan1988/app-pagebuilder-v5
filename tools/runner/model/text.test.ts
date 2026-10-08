// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The model of the text commands (tools/runner/model/harness.ts): text.set on the text elements of the page, with the
// typing of a field pending around it, its own steps and the presses and gestures that keep it.
import fc from 'fast-check';
import { expect, it } from 'vitest';
import { walk } from '../../../src/core/document/model.ts';
import type { EditorState } from '../../../src/editor/store.ts';
import { MODEL_RULES } from '../../../src/editor/store.ts';
import { command, pick, runModel } from './harness.ts';

const TEXTS = ['', 'Olá', 'Título com acentos ção', 'linha\noutra', 'a'.repeat(200), '12px'];
const textNodes = (s: EditorState): string[] => s.document.pages.flatMap((p) => [...walk(p.tree)].filter((n) => MODEL_RULES.elements.get(n.type)?.content === 'text').map((n) => n.id));

const STEPS = [
  fc.tuple(fc.nat(30), fc.nat(TEXTS.length - 1)).map(([i, t]) =>
    command('text.set', (s) => {
      const target = pick(textNodes(s), i);
      return target === undefined ? { target: s.document.pages[0]?.tree.id, content: TEXTS[t] } : { target, content: TEXTS[t] };
    }, `Texto(${i},${JSON.stringify(TEXTS[t]).slice(0, 12)})`),
  ),
  fc.tuple(fc.nat(30), fc.nat(TEXTS.length - 1)).map(([i, t]) => command('text.set', (s) => ({ target: pick(textNodes(s), i) ?? s.document.pages[0]?.tree.id, content: TEXTS[t] }), `Texto(${i},${JSON.stringify(TEXTS[t]).slice(0, 12)})`)),
  fc.nat(30).map((i) => command('selection.select', (s) => ({ target: pick(textNodes(s), i) ?? s.document.pages[0]?.tree.id }), `SelecionarTexto(${i})`)),
];

it('os comandos de texto seguem o modelo do manifesto com a digitação pendente', () => {
  const summary = runModel('text', STEPS);
  expect(summary.failure).toBeNull();
});
