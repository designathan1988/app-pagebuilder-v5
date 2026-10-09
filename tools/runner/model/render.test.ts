// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// How many times a view redraws, per action, in happy-dom (the investigation's C8, "re-render desnecessário"): a view
// that reads a slice of the editor state with useEditorState redraws when the slice changes and not when something
// else does — the count of the <Profiler>'s commits and of the component's own reads are the two witnesses, and the
// selection's change is what gives the counter something to see. A view whose selector is not stable (a new object at
// every publish) React refuses outright, with "The result of getSnapshot should be cached"; the views of the app keep
// every answer a text or a number for that reason (for example src/editor/shell/inspector.tsx, heldText).
import { act, createElement, Profiler, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import { createEditorStore, StoreContext, useEditorState, type EditorStore, type EditorState } from '../../../src/editor/store.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { LayersSection } from '../../../src/editor/shell/sidebar/layers.tsx';
import { fixture } from './harness.ts';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let reads = 0;

const memory = (): { read(): string | null; write(text: string): void } => ({ read: () => null, write: () => undefined });
const storeOf = (): EditorStore => createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(0), ids: sequentialIds('e'), restored: { document: fixture('aurora'), selection: [] }, ports: { readOnly: () => false }, freeze: true });
const dispatch = (store: EditorStore, id: string, args: unknown) => (store.dispatch as (i: CommandId, a: unknown) => unknown)(id as CommandId, args);
const firstElement = (store: EditorStore): string => store.getState().document.pages[0]?.tree.children[0]?.id ?? '';

interface Drawn {
  readonly reads: () => number;
  readonly commits: () => number;
  readonly stop: () => void;
}
// The view mounted with the store, both counters started from zero
function mount(store: EditorStore, element: ReactElement): Drawn {
  let commits = 0;
  reads = 0;
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  act(() => root.render(createElement(StoreContext.Provider, { value: store }, createElement(Profiler, { id: 'view', onRender: () => void (commits += 1) }, element))));
  return {
    commits: () => commits,
    reads: () => reads,
    stop: () => {
      act(() => root.unmount());
      host.remove();
    },
  };
}

describe('quantas vezes uma vista redesenha', () => {
  it('uma vista de uma fatia redesenha quando a fatia muda, e não quando outra coisa muda', () => {
    const store = storeOf();
    const View = () => {
      const count = useEditorState((s: EditorState) => s.selection.length);
      reads += 1;
      return createElement('span', null, String(count));
    };
    const drawn = mount(store, createElement(View));
    expect(drawn.reads(), 'a montagem desenha a vista uma vez').toBe(1);
    // the slice changes: one redraw, one commit more than the mount's (DEF-0567: the mount's own commit made the check
    // pass with none)
    const mounted = drawn.commits();
    act(() => void dispatch(store, 'selection.select', { target: firstElement(store) }));
    expect(drawn.reads(), 'a seleção mudou: a vista redesenha').toBe(2);
    expect(drawn.commits(), 'a seleção mudou: um commit').toBe(mounted + 1);
    // another part of the state changes: no redraw
    const readsBefore = drawn.reads();
    const commitsBefore = drawn.commits();
    act(() => void dispatch(store, 'view.zoomIn', {}));
    expect(drawn.reads(), 'o zoom mudou e a vista da seleção não redesenha').toBe(readsBefore);
    expect(drawn.commits(), 'o zoom mudou e a vista da seleção não é comprometida').toBe(commitsBefore);
    drawn.stop();
  });
});

// A view of the app itself (the investigation's C8 asked the readers of the document, not a view written here): the
// Layers panel, which reads the document and the selection, commits when the selection changes and not when only the
// zoom does (DEF-0567).
describe('quantas vezes o painel Camadas redesenha', () => {
  it('a seleção muda e o painel redesenha; o zoom muda e o painel não redesenha', () => {
    const store = storeOf();
    const drawn = mount(store, createElement(LayersSection));
    const mounted = drawn.commits();
    expect(mounted, 'a montagem do painel é comprometida').toBeGreaterThan(0);
    act(() => void dispatch(store, 'selection.select', { target: firstElement(store) }));
    const selected = drawn.commits();
    expect(selected, 'a seleção mudou: o painel redesenha').toBeGreaterThan(mounted);
    act(() => void dispatch(store, 'view.zoomIn', {}));
    act(() => void dispatch(store, 'view.zoomIn', {}));
    expect(drawn.commits(), 'o zoom mudou duas vezes e o painel Camadas não redesenha').toBe(selected);
    drawn.stop();
  });
});
