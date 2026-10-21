// Proof of concept C3/C6: the transition table of the gesture machine (step of src/editor/input/pointer/machine.ts),
// extracted by running the function itself on every combination of phase and event, and written as a Mermaid diagram.
// The map comes from the code, not from hand-written text; a change in step changes the table, and the table's diff
// says what changed. It also lists the combinations step silently ignores (same machine, null effect): that is where
// an illegal transition would pass unreported.
import fs from 'node:fs';
import { it } from 'vitest';
import { DRAG_THRESHOLD, IDLE, step, type Machine, type MachineEvent, type Press } from '../../../../src/editor/input/pointer/machine.ts';

it('the transition table comes from the code', () => {
  const press: Press = { on: 'stage' };
  const phases: Record<string, Machine> = {
    idle: IDLE,
    pressed: { phase: 'pressed', pointer: 1, start: { x: 0, y: 0 }, press },
    dragging: { phase: 'dragging', pointer: 1, start: { x: 0, y: 0 }, press },
  };
  const events: Record<string, MachineEvent> = {
    'down(p1)': { type: 'down', pointer: 1, at: { x: 0, y: 0 }, press },
    'down(p2)': { type: 'down', pointer: 2, at: { x: 0, y: 0 }, press },
    'move(p1, below the threshold)': { type: 'move', pointer: 1, at: { x: DRAG_THRESHOLD - 1, y: 0 } },
    'move(p1, at the threshold)': { type: 'move', pointer: 1, at: { x: DRAG_THRESHOLD, y: 0 } },
    'move(p2)': { type: 'move', pointer: 2, at: { x: 50, y: 0 } },
    'up(p1)': { type: 'up', pointer: 1 },
    'up(p2)': { type: 'up', pointer: 2 },
    cancel: { type: 'cancel' },
  };
  const lines: string[] = ['phase | event | next phase | effect'];
  const ignored: string[] = [];
  const mermaid = ['stateDiagram-v2', '  [*] --> idle'];
  for (const [phase, m] of Object.entries(phases)) {
    for (const [name, e] of Object.entries(events)) {
      const r = step(m, e);
      lines.push(`${phase} | ${name} | ${r.machine.phase} | ${r.effect ?? '-'}`);
      if (r.machine === m && r.effect === null) ignored.push(`${phase} + ${name}`);
      else mermaid.push(`  ${phase} --> ${r.machine.phase} : ${name} / ${r.effect ?? '-'}`);
    }
  }
  const text = [`drag threshold read from the manifest: ${DRAG_THRESHOLD}px`, '', ...lines, '', `combinations silently ignored (${ignored.length}):`, ...ignored.map((i) => `  ${i}`), '', ...mermaid].join('\n');
  fs.writeFileSync('auditoria/investigacao/poc/c3-mapa/resultados.txt', `${text}\n`);
});
