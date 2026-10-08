// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The Layout Composer's layer on the canvas, mounted for real (React in happy-dom), reopened (the investigation's C6,
// options B and C; auditoria/defeitos.md, DEF-0512): the layer stays mounted while the composer is closed, and the box
// it measured in one session must not be the one its first drawing uses in the next. The frames of
// requestAnimationFrame run only when the test asks (happy-dom's own loop would run the measuring loop without end),
// and the canvas is an iframe the test registers as the editor's (canvas/coordinates.ts registerFrame), whose node
// box is the one the test draws.
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import { noLayout, type Layout } from '../../../src/core/ports/layout.ts';
import { registerFrame } from '../../../src/editor/canvas/coordinates.ts';
import { NODE_ATTRIBUTE } from '../../../src/editor/canvas/render/render.ts';
import { createEditorStore, StoreContext } from '../../../src/editor/store.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { composerOf } from '../../../src/modules/layout-composer/host/state.ts';
import { LayoutOverlay } from '../../../src/modules/layout-composer/ui/overlay.tsx';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// frames that run only when the test asks
const frames = new Map<number, FrameRequestCallback>();
let nextFrame = 1;
vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
  frames.set(nextFrame, callback);
  return nextFrame++;
});
vi.stubGlobal('cancelAnimationFrame', (id: number) => void frames.delete(id));
const runFrame = () => {
  const due = [...frames.values()];
  frames.clear();
  for (const callback of due) callback(0);
};
afterAll(() => vi.unstubAllGlobals());

const memory = (): { read(): string | null; write(text: string): void } => ({ read: () => null, write: () => undefined });
const rect = (x: number, y: number, width: number, height: number): DOMRect => ({ x, y, left: x, top: y, width, height, right: x + width, bottom: y + height, toJSON: () => ({}) }) as DOMRect;

// the canvas: an iframe at the screen's origin, zoom 1, whose node `id` lies at the box the test sets
function canvas(id: string): { readonly place: (x: number) => void; readonly stop: () => void } {
  const iframe = document.createElement('iframe');
  // geometryOf adds the frame's computed border and padding: declared, so they compute to 0px
  iframe.style.border = '0px solid';
  iframe.style.padding = '0px';
  document.body.append(iframe);
  Object.defineProperty(iframe, 'currentCSSZoom', { value: 1 });
  iframe.getBoundingClientRect = () => rect(0, 0, 1440, 900);
  const page = iframe.contentDocument;
  if (page === null) throw new Error('the iframe has no document');
  const node = page.createElement('div');
  node.setAttribute(NODE_ATTRIBUTE, id);
  page.body.append(node);
  let left = 0;
  node.getBoundingClientRect = () => rect(left, 20, 400, 300);
  const unregister = registerFrame(iframe);
  return {
    place: (x) => void (left = x),
    stop: () => {
      unregister();
      iframe.remove();
    },
  };
}

describe('a camada do Layout Composer reaberta', () => {
  it('o primeiro desenho depois de reabrir não usa a caixa medida na sessão anterior (DEF-0512)', async () => {
    let rootId = '';
    const layout: Layout = { ...noLayout, box: (id) => (id === rootId ? rect(0, 0, 1440, 900) : null) };
    const store = createEditorStore({ storage: memory(), workspace: memory(), ids: sequentialIds('c'), clock: manualClock(0), ports: { layout, readOnly: () => false }, freeze: true });
    rootId = store.getState().document.pages[0]?.tree.id ?? '';
    const dispatch = store.dispatch as (id: CommandId, args: unknown) => unknown;
    const host = document.createElement('div');
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => root.render(createElement(StoreContext.Provider, { value: store }, createElement('div', null, createElement(LayoutOverlay)))));
    const stageLeft = () => host.querySelector<HTMLElement>('.layout-composer__stage')?.style.left ?? null;
    // a first session: the container the composer opens on, measured at the first box
    await act(async () => void dispatch('layout.enter' as CommandId, {}));
    const target = composerOf(store.getState().ui)?.target ?? '';
    expect(target, 'o compositor abriu').not.toBe('');
    const page = canvas(target);
    page.place(10);
    await act(async () => runFrame());
    expect(stageLeft(), 'aberto e medido, o palco fica na caixa medida').toBe('10px');
    // closed, the container moves on the canvas, and the composer opens again
    await act(async () => void dispatch('layout.leave' as CommandId, {}));
    page.place(200);
    await act(async () => void dispatch('layout.enter' as CommandId, {}));
    const first = stageLeft();
    expect(first === null || first === '200px', `o primeiro desenho depois de reabrir põe o palco em ${first ?? 'lugar nenhum'}; a caixa da sessão anterior era 10px`).toBe(true);
    await act(async () => runFrame());
    expect(stageLeft(), 'depois de medir, o palco fica na caixa nova').toBe('200px');
    await act(async () => root.unmount());
    host.remove();
    page.stop();
  });
});
