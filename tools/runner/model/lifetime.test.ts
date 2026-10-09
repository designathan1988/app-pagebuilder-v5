// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// What a routine leaves scheduled once it is stopped (the investigation's C6, options B and C): each routine that
// schedules frames or timers, stopped part way, leaves nothing scheduled and never runs what it was still waiting to
// run. The test boot's window is a counting stand-in, so the frames are seen as the routine asks for them; the
// autosave runs on Vitest's fake timers, whose count says what is still scheduled.
import { describe, expect, it, vi } from 'vitest';
import { runDrawnTestBoot, type TestBootResult } from '../../../src/editor/test-boot.ts';
import { createEditorStore } from '../../../src/editor/store.ts';
import { startAutosave } from '../../../src/editor/persistence/autosave.ts';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { numberConstant } from '../../../src/manifest/runtime.ts';
import { FIXTURES, fixture } from './harness.ts';

// longer than the idle wait and the retry delay of the autosave (manifest constants autosave.idleWait and retryDelay)
const IDLE_AND_RETRY = numberConstant('autosave.idleWait' as never) + numberConstant('autosave.retryDelay' as never) + 1;

// a window whose frames wait until the test runs them, counting what is still scheduled
function countingWindow(): { target: Window; pending: () => number; runFrames: () => void; fonts: () => Promise<void> } {
  const frames = new Map<number, FrameRequestCallback>();
  let next = 1;
  let ready: () => void = () => undefined;
  const fontsReady = new Promise<void>((resolve) => {
    ready = resolve;
  });
  const target = {
    document: { querySelector: () => null, fonts: { ready: fontsReady } },
    requestAnimationFrame: (callback: FrameRequestCallback) => {
      frames.set(next, callback);
      return next++;
    },
    cancelAnimationFrame: (id: number) => void frames.delete(id),
  } as unknown as Window;
  return {
    target,
    pending: () => frames.size,
    runFrames: () => {
      const due = [...frames];
      frames.clear();
      for (const [, callback] of due) callback(0);
    },
    fonts: async () => {
      ready();
      await fontsReady;
      await Promise.resolve();
    },
  };
}
const memory = (): { read(): string | null; write(text: string): void } => ({ read: () => null, write: () => undefined });

describe('o que fica agendado depois de parar', () => {
  it('o boot de teste desenhado, parado no meio, não deixa quadro agendado nem roda os comandos (DEF-0001)', async () => {
    const store = createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(0), ids: sequentialIds('b') });
    const results: TestBootResult[] = [];
    // stopped while it waits for the fonts
    const early = countingWindow();
    const stopEarly = runDrawnTestBoot(store, { project: null, commands: [], drawn: [{ command: 'view.zoomIn', args: {} }] } as never, results, early.target);
    expect(typeof stopEarly, 'runDrawnTestBoot devolve como parar').toBe('function');
    stopEarly();
    await early.fonts();
    expect(early.pending(), 'parado antes das fontes, nenhum quadro é pedido').toBe(0);
    // stopped between two frames
    const late = countingWindow();
    const stopLate = runDrawnTestBoot(store, { project: null, commands: [], drawn: [{ command: 'view.zoomIn', args: {} }] } as never, results, late.target);
    await late.fonts();
    late.runFrames();
    expect(late.pending()).toBe(1);
    stopLate();
    expect(late.pending(), 'parado entre dois quadros, o quadro pendente é cancelado').toBe(0);
    late.runFrames();
    expect(results, 'parado, os comandos desenhados não rodam').toEqual([]);
  });

  it('o autosave, depois de uma troca de projeto com a gravação pendente, guarda só o projeto novo, e parado não deixa timer', async () => {
    const [first, second] = FIXTURES;
    expect(first !== undefined && second !== undefined, 'duas páginas de exemplo para trocar').toBe(true);
    vi.useFakeTimers();
    try {
      window.localStorage.clear();
      const store = createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(0), ids: sequentialIds('a'), ports: { readOnly: () => false } });
      const stop = startAutosave(store, null, false);
      // a project opened as the person opens one: over unsaved work, the editor asks first, and the person confirms
      const open = (name: string) => {
        const result = (store.dispatch as (id: CommandId, args: unknown) => { readonly status: string })('project.open' as CommandId, { file: JSON.stringify(fixture(name)) });
        if (result.status === 'confirm') store.answer(true);
      };
      // the first project, its write still waiting for the idle moment, and the second opened over it
      open(first ?? '');
      const before = store.getState().document;
      open(second ?? '');
      const opened = store.getState().document;
      expect(JSON.stringify(opened) === JSON.stringify(before), 'o segundo projeto substituiu o primeiro').toBe(false);
      await vi.advanceTimersByTimeAsync(IDLE_AND_RETRY);
      const journal = JSON.parse(window.localStorage.getItem('work-journal') ?? 'null') as { document?: unknown } | null;
      expect(journal?.document, 'o diário guarda o projeto aberto por último').toEqual(opened);
      // with no IndexedDB here the write is refused and a retry waits: stopping leaves nothing scheduled
      expect(vi.getTimerCount(), 'a nova tentativa espera agendada antes de parar').toBeGreaterThan(0);
      stop();
      expect(vi.getTimerCount(), 'parado, o autosave não deixa timer agendado').toBe(0);
      const kept = window.localStorage.getItem('work-journal');
      await vi.advanceTimersByTimeAsync(IDLE_AND_RETRY);
      expect(window.localStorage.getItem('work-journal'), 'parado, nada mais é gravado').toBe(kept);
    } finally {
      vi.useRealTimers();
    }
  });

  // DEF-0585: a selection made just before the tab reloads, its write still waiting for the idle moment (a busy
  // machine), went with the page: the journal written on leaving took only a change of the document.
  it('a seleção feita logo antes de sair da página fica no diário que a recarga lê', () => {
    vi.useFakeTimers();
    try {
      window.localStorage.clear();
      const page = fixture('aurora');
      const store = createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(0), ids: sequentialIds('a'), restored: { document: page, selection: [] }, ports: { readOnly: () => false } });
      const stop = startAutosave(store, { revision: 1, format: page.version, document: page, selection: [] }, true);
      (store.dispatch as (id: CommandId, args: unknown) => unknown)('selection.select' as CommandId, { target: 'n-intro' });
      // the idle write has not run: the tab leaves now
      window.dispatchEvent(new Event('beforeunload', { cancelable: true }));
      const journal = JSON.parse(window.localStorage.getItem('work-journal') ?? 'null') as { selection?: readonly string[] } | null;
      expect(journal?.selection, 'o diário guarda a seleção de agora').toEqual(['n-intro']);
      stop();
    } finally {
      vi.useRealTimers();
    }
  });
});
