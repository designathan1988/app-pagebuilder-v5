// The pointer state of one editor that outlives a gesture (the plan's T7: one per editor, by its store, never shared):
// the pan (Space held, the pointer over the stage, the pan going on and the door it runs), the gesture open now, and
// the colour picker's session with what ends it. A module of its own, with no import that runs, so the modes of
// interaction (input/modes.ts), which the editor's store reads, reach it without loading the pointer owner's parts.
import type { DispatchResult, Gesture } from '../../../core/store/store.ts';
import type { CommandId } from '../../../generated/ids.ts';
import type { DoorEntry } from '../../../manifest/runtime.ts';
import type { Point } from '../../canvas/coordinates.ts';
import type { EditorStore } from '../../store.ts';

export interface PointerShared {
  spaceDown: boolean;
  overStage: boolean;
  panning: { pointer: number; last: Point; moved: Point; entry: DoorEntry } | null;
  panDispatch: ((entry: DoorEntry, args: Readonly<Record<string, unknown>>) => void) | null;
  open: Gesture | null;
  session: Gesture | null;
  sessionDispatch: ((id: CommandId, args: unknown) => DispatchResult) | null;
  pendingPickerEnd: (() => void) | null;
}
const SHARED = new WeakMap<EditorStore, PointerShared>();
export function sharedOf(store: EditorStore): PointerShared {
  let shared = SHARED.get(store);
  if (shared === undefined) {
    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };
    SHARED.set(store, shared);
  }
  return shared;
}
