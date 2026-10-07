// @vitest-environment happy-dom
// Rules G1 and G2 (CLAUDE.md): the typing a field holds and has not kept is kept before a command that changes the
// document or comes from outside the field, in the context it began in; the field's own commands run in that context;
// a command asked from inside the field that changes no document leaves it as it is, unless it moves what the field
// edits, which keeps it at once (input/pending.ts, the editor store's gestureSafe).
import { afterEach, describe, expect, it } from 'vitest';
import { createEditorStore, editContextOf, type EditorStore } from '../store.ts';
import type { EditContext } from '../../core/store/store.ts';
import { manualClock } from '../../core/ports/clock.ts';
import { sequentialIds } from '../../core/ports/ids.ts';
import { anyCss } from '../../core/ports/css.ts';
import { documentOf, node } from '../../core/testing/handlers.ts';
import type { DocNode } from '../../core/document/model.ts';
import { heldTyping, holdTyping, keepTypingBefore, releaseTyping } from './pending.ts';

const memory = (): { read(): string | null; write(text: string): void } => {
  let held: string | null = null;
  return { read: () => held, write: (text) => void (held = text) };
};
const make = (): EditorStore => {
  const tree = node('Page', 'page', 'body', { children: [node('Box', 'div', 'div'), node('Other', 'div', 'div')] });
  const document = documentOf({ pages: [{ id: 'home', name: 'Home', file: 'index.html', tree }] });
  return createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(1_000_000), ids: sequentialIds('v'), restored: { document, selection: ['Box' as never] }, ports: { css: anyCss, readOnly: () => false, downloads: { deliver: () => undefined }, clipboard: { write: () => undefined } as never }, freeze: true });
};
type Layers = Readonly<Record<string, Readonly<Record<string, Readonly<Record<string, string>>>>>>;
const styleOf = (store: EditorStore, id: string, property: string, breakpoint = 'desktop'): string | undefined =>
  ((store.getState().document.pages[0]?.tree.children ?? []).find((n: DocNode) => n.id === id)?.styles as Layers | undefined)?.[breakpoint]?.base?.[property];

// A font size field of the Inspector with a value typed and not kept, for the element selected: its row holds the
// input and a button whose values menu floats on the body (the layer the button controls, aria-controls).
function typedFontSize(store: EditorStore, typed: string, context: EditContext = editContextOf(store.getState())) {
  const row = document.createElement('div');
  row.setAttribute('data-door', 'style.set#inspector-font-size');
  const input = document.createElement('input');
  const button = document.createElement('button');
  button.setAttribute('aria-controls', 'font-size-values');
  row.append(input, button);
  const menu = document.createElement('div');
  menu.id = 'font-size-values';
  const item = document.createElement('button');
  menu.append(item);
  const elsewhere = document.createElement('button');
  document.body.append(row, menu, elsewhere);
  const targets = store.getState().selection;
  let kept = 0;
  holdTyping({
    field: input,
    region: row,
    context,
    owns: (id, args) => id === 'style.set' && args.property === 'font-size',
    keep: () => {
      kept += 1;
      store.dispatch('style.set', { property: 'font-size', value: typed, targets: [...targets] } as never, context);
    },
  });
  return { input, button, item, elsewhere, kept: () => kept };
}

afterEach(() => {
  const typing = heldTyping();
  if (typing !== null) releaseTyping(typing.field);
  document.body.replaceChildren();
});

describe('the typing a field holds and has not kept (rules G1 and G2)', () => {
  it('is kept before a command that changes the document: its undo step comes first', () => {
    const store = make();
    const field = typedFontSize(store, '48px');
    field.input.focus();
    store.dispatch('style.set', { property: 'width', value: '120px' });
    expect(field.kept()).toBe(1);
    expect(heldTyping()).toBeNull();
    expect(styleOf(store, 'Box', 'font-size')).toBe('48px');
    expect(styleOf(store, 'Box', 'width')).toBe('120px');
    // the command's step is the last: undoing it leaves the value typed before it
    store.dispatch('history.undo', {});
    expect(styleOf(store, 'Box', 'width')).toBeUndefined();
    expect(styleOf(store, 'Box', 'font-size')).toBe('48px');
  });

  it("runs the field's own command in the context the typing began in, whatever the editor shows now", () => {
    const store = make();
    store.dispatch('view.setBreakpoint', { breakpoint: 'tablet' });
    const field = typedFontSize(store, '48px', { ...editContextOf(store.getState()), layer: { breakpoint: 'desktop', state: 'base' } });
    field.input.focus();
    store.dispatch('style.set', { property: 'font-size', value: '50px' });
    expect(styleOf(store, 'Box', 'font-size', 'desktop')).toBe('50px');
    expect(styleOf(store, 'Box', 'font-size', 'tablet')).toBeUndefined();
  });

  it('is left as it is by a command asked from inside the field that changes no document, its values menu too', () => {
    const store = make();
    const field = typedFontSize(store, '48px');
    field.input.focus();
    expect(store.dispatch('view.zoomIn', {}).status).toBe('done');
    field.item.focus();
    expect(store.dispatch('view.zoomIn', {}).status).toBe('done');
    expect(field.kept()).toBe(0);
    expect(heldTyping()?.field).toBe(field.input);
    expect(styleOf(store, 'Box', 'font-size')).toBeUndefined();
  });

  it('is kept before the same command asked from outside the field', () => {
    const store = make();
    const field = typedFontSize(store, '48px');
    field.elsewhere.focus();
    store.dispatch('view.zoomIn', {});
    expect(field.kept()).toBe(1);
    expect(styleOf(store, 'Box', 'font-size')).toBe('48px');
  });

  it('is kept at once, where it was typed, by a command that moves what the field edits', () => {
    const store = make();
    const atTablet = typedFontSize(store, '48px');
    atTablet.input.focus();
    store.dispatch('view.setBreakpoint', { breakpoint: 'tablet' });
    expect(atTablet.kept()).toBe(1);
    expect(styleOf(store, 'Box', 'font-size', 'desktop')).toBe('48px');
    expect(styleOf(store, 'Box', 'font-size', 'tablet')).toBeUndefined();
    document.body.replaceChildren();
    // another element selected: the value goes to the element it was typed for
    const another = typedFontSize(store, '20px');
    another.input.focus();
    store.dispatch('selection.select', { target: 'Other' as never });
    expect(another.kept()).toBe(1);
    expect(styleOf(store, 'Box', 'font-size', 'tablet')).toBe('20px');
    expect(styleOf(store, 'Other', 'font-size', 'tablet')).toBeUndefined();
  });

  it("is kept before a press, unless the press is on the field's row or a layer the row controls", () => {
    const store = make();
    const field = typedFontSize(store, '48px');
    keepTypingBefore(field.button);
    keepTypingBefore(field.item);
    expect(field.kept()).toBe(0);
    keepTypingBefore(field.elsewhere);
    expect(field.kept()).toBe(1);
    expect(styleOf(store, 'Box', 'font-size')).toBe('48px');
  });
});
