// The transition table of the gesture machine (the investigation's C3, option A; grown from
// auditoria/investigacao/poc/c3-mapa/tabela.poc.ts): `step` of src/editor/input/pointer/machine.ts run on every
// combination of phase and event, the drag threshold read from the manifest, so the map comes out of the code and
// never out of words written by hand. A combination the machine leaves as it is, with no effect, is one it ignores:
// each such combination is declared here with why, so a transition that starts to be ignored, or one that stops being
// ignored, is a difference the detector (tools/runner/model/machine.test.ts) names.
import { DRAG_THRESHOLD, IDLE, step, type Machine, type MachineEvent, type Press } from '../../src/editor/input/pointer/machine.ts';

export interface Transition {
  readonly phase: string;
  readonly event: string;
  readonly next: string;
  readonly effect: string | null;
}

const press: Press = { on: 'stage' };
const PHASES: Readonly<Record<string, Machine>> = {
  idle: IDLE,
  pressed: { phase: 'pressed', pointer: 1, start: { x: 0, y: 0 }, press },
  dragging: { phase: 'dragging', pointer: 1, start: { x: 0, y: 0 }, press },
};
const EVENTS: Readonly<Record<string, MachineEvent>> = {
  'down(p1)': { type: 'down', pointer: 1, at: { x: 0, y: 0 }, press },
  'down(p2)': { type: 'down', pointer: 2, at: { x: 0, y: 0 }, press },
  'move(p1, below the threshold)': { type: 'move', pointer: 1, at: { x: DRAG_THRESHOLD - 1, y: 0 } },
  'move(p1, at the threshold)': { type: 'move', pointer: 1, at: { x: DRAG_THRESHOLD, y: 0 } },
  'move(p2)': { type: 'move', pointer: 2, at: { x: 50, y: 0 } },
  'up(p1)': { type: 'up', pointer: 1 },
  'up(p2)': { type: 'up', pointer: 2 },
  cancel: { type: 'cancel' },
};

// what the machine ignores on purpose, and why (p1 is the pointer of the open gesture)
export const IGNORED_ON_PURPOSE: Readonly<Record<string, string>> = {
  'idle + move(p1, below the threshold)': 'nothing is pressed: a move with no press is the hover, which the pointer owner draws outside the machine',
  'idle + move(p1, at the threshold)': 'nothing is pressed: a move with no press is the hover',
  'idle + move(p2)': 'nothing is pressed: a move with no press is the hover',
  'idle + up(p1)': 'a release with no press (pressed outside the window): nothing to end',
  'idle + up(p2)': 'a release with no press: nothing to end',
  'idle + cancel': 'nothing is open to cancel',
  'pressed + down(p2)': 'another pointer (a second finger, a pen) does not join the gesture',
  'pressed + move(p1, below the threshold)': 'below drag.threshold a press stays a press (a click)',
  'pressed + move(p2)': 'another pointer does not join the gesture',
  'pressed + up(p2)': 'another pointer does not end the gesture',
  'dragging + down(p2)': 'another pointer does not join the gesture',
  'dragging + move(p1, below the threshold)': 'the drag follows the pointer through its owner (events.ts onMove), which draws it; the machine stays dragging',
  'dragging + move(p1, at the threshold)': 'the drag follows the pointer through its owner, which draws it; the machine stays dragging',
  'dragging + move(p2)': 'another pointer does not join the gesture',
  'dragging + up(p2)': 'another pointer does not end the gesture',
};

export function gestureTable(): { readonly threshold: number; readonly transitions: readonly Transition[] } {
  const transitions: Transition[] = [];
  for (const [phase, machine] of Object.entries(PHASES)) {
    for (const [event, happened] of Object.entries(EVENTS)) {
      const next = step(machine, happened);
      transitions.push({ phase, event, next: next.machine === machine && next.effect === null ? phase : next.machine.phase, effect: next.effect });
    }
  }
  return { threshold: DRAG_THRESHOLD, transitions };
}

// the combinations step leaves as they were, with no effect
export const ignoredOf = (transitions: readonly Transition[]): readonly string[] => transitions.filter((t) => t.next === t.phase && t.effect === null).map((t) => `${t.phase} + ${t.event}`);

export function mermaidOf(transitions: readonly Transition[]): string {
  const lines = ['stateDiagram-v2', '  [*] --> idle'];
  for (const t of transitions) if (!(t.next === t.phase && t.effect === null)) lines.push(`  ${t.phase} --> ${t.next} : ${t.event} / ${t.effect ?? '-'}`);
  return lines.join('\n');
}
