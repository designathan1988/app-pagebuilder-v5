// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The modes of interaction against their table (the investigation's C6, option A; src/editor/input/modes.ts): with a
// pointer gesture open, every shortcut of the manifest goes through the real keymap (installKeymap) and no mode the
// table refuses during a gesture opens (a menu that opens during a drag is the acceptance failure); and in random
// sequences of shortcuts, with gestures opened and closed between them, the same holds at every key.
import fc from 'fast-check';
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import { installKeymap } from '../../../src/editor/input/keymap.ts';
import { modeBreaches, modesOf } from '../../../src/editor/input/modes.ts';
import { sharedOf } from '../../../src/editor/input/pointer/common.ts';
import { createEditorStore, type EditorStore } from '../../../src/editor/store.ts';
import type { Gesture } from '../../../src/core/store/store.ts';
import { manifest } from '../../../src/manifest/runtime.ts';
import { walk, type DocNode } from '../../../src/core/document/model.ts';
import { storedValue } from '../../../src/core/style/stored.ts';
import { MODEL_RULES } from '../../../src/editor/store.ts';
import { fixture } from './harness.ts';

const walkTree = (tree: DocNode | undefined): Iterable<DocNode> => (tree === undefined ? [] : walk(tree));

const memory = (): { read(): string | null; write(text: string): void } => {
  let held: string | null = null;
  return { read: () => held, write: (text) => void (held = text) };
};

// every chord the manifest binds, once
const CHORDS = [...new Set(manifest.doors.flatMap((d) => (d.door.kind === 'shortcut' ? [d.door.chord] : [])))].sort();

// the keydown a chord is pressed as (input/keymap.ts, chordOf reads it back)
function keyEvent(chord: string, type: 'keydown' | 'keyup'): KeyboardEvent {
  const parts = chord.split('+');
  const key = chord.endsWith('++') ? '+' : (parts.at(-1) ?? '');
  const mods = new Set(parts.slice(0, -1));
  const letter = /^[A-Z]$/.test(key);
  const digit = /^[0-9]$/.test(key);
  const code = letter ? `Key${key}` : digit ? `Digit${key}` : key === 'Space' ? 'Space' : '';
  const typed = key === 'Space' ? ' ' : letter ? (mods.has('Shift') ? key : key.toLowerCase()) : key;
  return new KeyboardEvent(type, { key: typed, code, ctrlKey: mods.has('Ctrl'), altKey: mods.has('Alt'), shiftKey: mods.has('Shift'), metaKey: mods.has('Meta'), bubbles: true, cancelable: true });
}

interface Editor {
  readonly store: EditorStore;
  readonly stop: () => void;
  gesture: Gesture | null;
}
function editor(): Editor {
  const store = createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(1_000_000), ids: sequentialIds('m'), restored: { document: fixture('aurora'), selection: [] }, ports: { readOnly: () => false, downloads: { deliver: () => undefined }, clipboard: { write: () => undefined } as never }, freeze: true });
  const first = store.getState().document.pages[0]?.tree.children[0]?.id;
  if (first !== undefined) store.dispatch('selection.select' as never, { target: first } as never);
  return { store, stop: installKeymap(store, window), gesture: null };
}
// a pointer gesture opened as the pointer owner opens one (input/pointer/drag.ts)
function openGesture(e: Editor): void {
  if (e.gesture !== null || e.store.gestureOpen()) return;
  e.gesture = e.store.gesture();
  sharedOf(e.store).open = e.gesture;
}
function closeGesture(e: Editor): void {
  const shared = sharedOf(e.store);
  if (shared.open === e.gesture) shared.open = null;
  if (e.gesture !== null && e.store.gestureOpen()) e.gesture.cancel();
  e.gesture = null;
}
// a chord pressed: the breaches of the table it caused while a gesture was open, and the errors it threw
function press(e: Editor, chord: string): string[] {
  const errors: string[] = [];
  const caught = (event: ErrorEvent) => errors.push(`${chord}: ${String(event.error ?? event.message)}`);
  window.addEventListener('error', caught);
  const before = modesOf(e.store);
  // happy-dom hands a listener's error back to dispatchEvent: a key that throws during a gesture is a finding too
  try {
    window.dispatchEvent(keyEvent(chord, 'keydown'));
    window.dispatchEvent(keyEvent(chord, 'keyup'));
  } catch (error) {
    errors.push(`${chord}: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    window.removeEventListener('error', caught);
  }
  return [...modeBreaches(before, modesOf(e.store)).map((b) => `${chord}: ${b}`), ...errors];
}

describe('os modos de interação contra a tabela', () => {
  it('com um gesto do ponteiro aberto, nenhum atalho do manifesto abre um modo que a tabela recusa', () => {
    const found: string[] = [];
    for (const chord of CHORDS) {
      const e = editor();
      openGesture(e);
      found.push(...press(e, chord));
      closeGesture(e);
      e.stop();
    }
    fs.mkdirSync('.cache/model', { recursive: true });
    fs.writeFileSync('.cache/model/modes.json', JSON.stringify({ chords: CHORDS.length, found }, null, 2));
    expect(CHORDS.length).toBeGreaterThan(50);
    expect(found, 'modos recusados abertos durante um gesto').toEqual([]);
  });

  it('em sequências de atalhos, com gestos abertos e fechados entre eles, a tabela vale a cada tecla', () => {
    const action = fc.oneof(fc.constantFrom(...CHORDS).map((chord) => ({ kind: 'key' as const, chord })), fc.constant({ kind: 'open' as const }), fc.constant({ kind: 'close' as const }));
    fc.assert(
      fc.property(fc.array(action, { minLength: 1, maxLength: 25 }), (actions) => {
        const e = editor();
        try {
          for (const a of actions) {
            if (a.kind === 'open') openGesture(e);
            else if (a.kind === 'close') closeGesture(e);
            else expect(press(e, a.chord)).toEqual([]);
          }
        } finally {
          closeGesture(e);
          e.stop();
        }
      }),
      { numRuns: 40 },
    );
  }, 300_000);
});

// The arrows of a positioned selection (spec absolute-nudge) hand a direction, and the one conversion of the keymap
// (stepped) makes it the gesture's step of the manifest, Shift's the larger: every key door of the gesture moves by
// the same step, never by one of its own (DCS-023, rule G3).
describe('o passo das setas de empurrar', () => {
  const constant = (id: string): number => {
    const value = manifest.interactions.constants.find((c) => c.id === id)?.value;
    if (typeof value !== 'number') throw new Error(`interactions.json não tem o número ${id}`);
    return value;
  };
  it('cada seta move o elemento posicionado pelo passo do manifesto, e com Shift pelo passo maior', () => {
    const found: string[] = [];
    for (const [key, axis, sign] of [['ArrowRight', 'left', 1], ['ArrowLeft', 'left', -1], ['ArrowDown', 'top', 1], ['ArrowUp', 'top', -1]] as const) {
      for (const [shift, step] of [[false, constant('nudge.step')], [true, constant('nudge.shiftStep')]] as const) {
        const e = editor();
        try {
          const dispatch = e.store.dispatch as (id: string, args: unknown) => unknown;
          dispatch('style.set', { property: 'position', value: 'absolute' });
          dispatch('style.set', { property: 'left', value: '100px' });
          dispatch('style.set', { property: 'top', value: '100px' });
          document.body.dispatchEvent(new KeyboardEvent('keydown', { key, code: key, shiftKey: shift, bubbles: true, cancelable: true }));
          const id = e.store.getState().selection[0];
          const node = id === undefined ? undefined : [...walkTree(e.store.getState().document.pages[0]?.tree)].find((n) => n.id === id);
          const held = node === undefined ? undefined : storedValue(node, axis, MODEL_RULES);
          const expected = `${100 + sign * step}px`;
          if (held !== expected) found.push(`${shift ? 'Shift+' : ''}${key}: ${axis} ${String(held)} (esperado ${expected})`);
        } finally {
          e.stop();
        }
      }
    }
    expect(found, 'setas que não movem pelo passo do manifesto').toEqual([]);
  });
});

// A command from outside an open gesture (a file read that resolved, the assistant, a timer) that would open a mode the
// table refuses waits for the gesture's end and runs then, in order (DEF-0555: it ran through the gesture, the layer
// opened over it, and the table only said so afterwards).
describe('um comando de fora durante o gesto', () => {
  it('não abre um modo que o gesto recusa: espera o fim do gesto e abre depois', () => {
    const e = editor();
    try {
      openGesture(e);
      let thrown: string | null = null;
      try {
        (e.store.dispatch as (id: string, args: unknown) => unknown)('commandBar.open', {});
      } catch (error) {
        thrown = String(error);
      }
      const during = e.store.getState().ui.commandBar === true;
      closeGesture(e);
      const after = e.store.getState().ui.commandBar === true;
      expect({ thrown, during, after }, 'a barra de comandos pedida de fora durante o gesto').toEqual({ thrown: null, during: false, after: true });
    } finally {
      e.stop();
    }
  });
});
