// The machines of the editor against their map (the investigation's C3 and C6; tools/map/): the gesture machine's
// table, run from the code, is the one manifest/generated/behavior.json holds (run its generator,
// tools/map/generate.ts, when the code changed it); every combination the machine ignores is declared with why; and
// the rules the owner decided hold: a pointer pressed with a gesture open, the same one (its release lost) or another,
// cancels the open gesture and opens the new one (decisoes.md, DCS-013; DEF-0556); another pointer's moves and
// release do not join it.
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { IDLE, step, type Press } from '../../../src/editor/input/pointer/machine.ts';
import { behaviorFiles } from '../../map/behavior.ts';
import { gestureTable, IGNORED_ON_PURPOSE, ignoredOf } from '../../map/gesture-table.ts';

const press: Press = { on: 'stage' };

describe("the editor's machines and the generated map", () => {
  it('the table saved in manifest/generated/behavior.json is the one the code gives', () => {
    const { json, markdown } = behaviorFiles();
    const held = fs.existsSync('manifest/generated/behavior.json') ? fs.readFileSync('manifest/generated/behavior.json', 'utf8') : '';
    expect(held, 'the saved map is behind the code: run node tools/map/generate.ts').toBe(json);
    expect(fs.existsSync('manifest/generated/behavior.md') ? fs.readFileSync('manifest/generated/behavior.md', 'utf8') : '').toBe(markdown);
  });

  it('every combination the gesture machine ignores has its reason declared', () => {
    const ignored = ignoredOf(gestureTable().transitions);
    expect(ignored.filter((c) => IGNORED_ON_PURPOSE[c] === undefined), 'ignored silently, with no reason').toEqual([]);
    expect(Object.keys(IGNORED_ON_PURPOSE).filter((c) => !ignored.includes(c)), 'declared as ignored and the machine does something').toEqual([]);
  });

  it('a pointer pressed with the gesture open, the same one or another, cancels the gesture and opens the new one (DCS-013)', () => {
    for (const phase of ['pressed', 'dragging'] as const) {
      const open = { phase, pointer: 1, start: { x: 0, y: 0 }, press } as const;
      for (const pointer of [1, 2]) {
        const again = step(open, { type: 'down', pointer, at: { x: 9, y: 9 }, press });
        expect(again.effect, `${phase} + down of pointer ${pointer}`).toBe('restart');
        expect(again.machine).toEqual({ phase: 'pressed', pointer, start: { x: 9, y: 9 }, press });
      }
      // the moves and the release of another pointer do not join the open gesture
      expect(step(open, { type: 'move', pointer: 2, at: { x: 90, y: 90 } })).toEqual({ machine: open, effect: null });
      expect(step(open, { type: 'up', pointer: 2 })).toEqual({ machine: open, effect: null });
    }
    expect(step(IDLE, { type: 'down', pointer: 1, at: { x: 0, y: 0 }, press }).effect).toBe('press');
  });
});
