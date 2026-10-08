// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The races of the ports that read something that arrives later (the investigation's C6, option D): the system
// clipboard's read is held by fast-check's scheduler (fc.scheduler, fast-check 4.10.2), and what the person does
// meanwhile (another element selected, another breakpoint) runs in an order the scheduler chooses. An element copied
// and pasted with Ctrl+V through the real keymap lands where it lands without the race, or, when the context changed
// before the read arrived, is not pasted and the status bar says so (decisoes.md, DCS-019; rule G1).
import fc from 'fast-check';
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { breakpointsOf } from '../../../src/core/document/breakpoints.ts';
import { walk, type DocumentJson } from '../../../src/core/document/model.ts';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import { installKeymap } from '../../../src/editor/input/keymap.ts';
import { createEditorStore, type EditorStore } from '../../../src/editor/store.ts';
import { activeLayer } from '../../../src/editor/view/style-state.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { fixture } from './harness.ts';

const memory = (): { read(): string | null; write(text: string): void } => ({ read: () => null, write: () => undefined });
const chord = (letter: string) => new KeyboardEvent('keydown', { key: letter.toLowerCase(), code: `Key${letter}`, ctrlKey: true, bubbles: true, cancelable: true });

// where a node stands: its parent and its place among the parent's children
function placeOf(document: DocumentJson, id: string): string | null {
  for (const page of document.pages) for (const node of walk(page.tree)) {
    const index = node.children.findIndex((child) => child.id === id);
    if (index >= 0) return `${node.id}#${index}`;
  }
  return null;
}
const idsOf = (document: DocumentJson): string[] => document.pages.flatMap((page) => [...walk(page.tree)].map((node) => node.id));

type Meanwhile = 'nothing' | 'select' | 'breakpoint';
interface Pasted {
  readonly place: string | null;
  readonly message: string | null;
}

// Ctrl+C on the first element of the page, then Ctrl+V with the clipboard's read held by the scheduler, and what the
// person does meanwhile run through the scheduler too: where the copy stands, and what the status bar says
async function paste(s: fc.Scheduler, meanwhile: Meanwhile): Promise<Pasted> {
  const store: EditorStore = createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(1_000_000), ids: sequentialIds('r'), restored: { document: fixture('aurora'), selection: [] }, ports: { readOnly: () => false } });
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { read: () => s.schedule(Promise.resolve([] as ClipboardItem[]), 'clipboard read'), write: () => Promise.resolve(), writeText: () => Promise.resolve() } });
  const stop = installKeymap(store, window);
  try {
    const dispatch = store.dispatch as (id: CommandId, args: unknown) => unknown;
    const tree = store.getState().document.pages[0]?.tree;
    const elements = tree === undefined ? [] : [...walk(tree)].map((node) => node.id).filter((id) => id !== tree.id);
    const first = elements[0];
    const last = elements.at(-1);
    expect(first !== undefined && last !== undefined && first !== last, 'dois elementos na página de exemplo').toBe(true);
    dispatch('selection.select' as CommandId, { target: first });
    window.dispatchEvent(chord('C'));
    const before = new Set(idsOf(store.getState().document));
    window.dispatchEvent(chord('V'));
    const other = breakpointsOf(store.getState().document).find((b) => b.id !== activeLayer(store.getState()).breakpoint);
    expect(other, 'outro breakpoint na página de exemplo').toBeDefined();
    const act = s.scheduleFunction(async () => {
      if (meanwhile === 'select') dispatch('selection.select' as CommandId, { target: last });
      if (meanwhile === 'breakpoint' && other !== undefined) dispatch('view.setBreakpoint' as CommandId, { breakpoint: other.id });
    });
    void act();
    await s.waitIdle();
    // the read's own awaits (input/clipboard.ts readClipboard) finish after the scheduler lets it go
    for (let i = 0; i < 10; i += 1) await Promise.resolve();
    const made = idsOf(store.getState().document).filter((id) => !before.has(id));
    const said = store.getState().message;
    return { place: made[0] === undefined ? null : placeOf(store.getState().document, made[0]), message: said === null || said === undefined ? null : said.key };
  } finally {
    stop();
  }
}

describe('as corridas das portas que leem algo que chega tarde', () => {
  it('a colagem cai onde cairia sem a corrida, ou não cai e a barra de status avisa', async () => {
    const [one] = fc.sample(fc.scheduler(), { numRuns: 1, seed: 1 });
    if (one === undefined) throw new Error('fc.sample gave no scheduler');
    const reference = await paste(one, 'nothing');
    expect(reference.place, 'sem nada no meio, a cópia é colada').not.toBeNull();
    const found: string[] = [];
    const outcomes = { kept: 0, refused: 0 };
    await fc.assert(
      fc.asyncProperty(fc.scheduler(), fc.constantFrom<Meanwhile>('nothing', 'select', 'breakpoint'), async (s, meanwhile) => {
        const pasted = await paste(s, meanwhile);
        const kept = pasted.place === reference.place;
        const refused = pasted.place === null && pasted.message === 'status.stale';
        if (kept) outcomes.kept += 1;
        if (refused) outcomes.refused += 1;
        if (!kept && !refused) found.push(`${meanwhile}: colada em ${pasted.place ?? 'lugar nenhum'} (${pasted.message ?? 'sem aviso'}), sem a corrida em ${reference.place ?? '?'}`);
      }),
      { numRuns: 60, seed: 20261008 },
    );
    fs.mkdirSync('.cache/model', { recursive: true });
    fs.writeFileSync('.cache/model/races.json', JSON.stringify({ reference, outcomes, found: [...new Set(found)] }, null, 2));
    expect([...new Set(found)], 'colagens fora do contexto da tecla').toEqual([]);
    // the runs went both ways: a context changed before the read arrived, and one changed after it or not at all
    expect(outcomes.refused > 0 && outcomes.kept > 0, `as rodadas passaram pelos dois desfechos (${JSON.stringify(outcomes)})`).toBe(true);
  }, 300_000);
});
