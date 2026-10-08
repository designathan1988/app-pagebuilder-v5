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
import { fixture } from './harness.ts';

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
