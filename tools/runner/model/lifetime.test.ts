// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// What a routine leaves scheduled once it is stopped (the investigation's C6, options B and C): each routine that
// schedules frames or timers, stopped part way, leaves nothing scheduled and never runs what it was still waiting to
// run. The window is a counting stand-in, so the frames and timers are seen as the routine asks for them.
import { describe, expect, it } from 'vitest';
import { runDrawnTestBoot, type TestBootResult } from '../../../src/editor/test-boot.ts';
import { createEditorStore } from '../../../src/editor/store.ts';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';

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
});
