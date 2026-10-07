import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { browserPlan, drawsInTheBrowser, headlessProven, headlessRecord, pinHeadlessRecord, runName, runRecord, writeHeadlessResults } from './balance.ts';

const plain = { render: { computed: [], geometry: [] }, editor: null, persistence: null, export: null };
const scenario = (id: string, doors: string[], expect: object = plain) => ({ id, doors, expect: { ...plain, ...expect } });
const leftOf = (plan: ReturnType<typeof browserPlan>) => [...plan].filter(([, one]) => one.left).map(([name]) => name);

describe('the balance of the two scenario runners', () => {
  it('leaves out a proven run whose door keeps a browser run of its own', () => {
    const features = [{ id: 'f', scenarios: [scenario('a', ['door#1']), scenario('b', ['door#1'])] }];
    const proven = new Set([runName('f', 'a', 'door#1')]);
    expect(leftOf(browserPlan(features, proven))).toEqual([runName('f', 'a', 'door#1')]);
  });

  it("keeps the first run of a door whose every run is proven, so the door's gesture runs in the browser", () => {
    const features = [{ id: 'f', scenarios: [scenario('a', ['door#1']), scenario('b', ['door#1']), scenario('c', ['door#2'])] }];
    const proven = new Set([runName('f', 'a', 'door#1'), runName('f', 'b', 'door#1'), runName('f', 'c', 'door#2')]);
    expect(leftOf(browserPlan(features, proven))).toEqual([runName('f', 'b', 'door#1')]);
  });

  it('leaves out a proven run whose door a kept run presses in one of its steps', () => {
    const withStep = (id: string, door: string, step: string) => ({ ...scenario(id, [door]), steps: [{ door: step, action: false }, { door, action: true }] });
    const features = [{ id: 'f', scenarios: [withStep('a', 'door#1', 'door#2'), scenario('b', ['door#2']), withStep('c', 'door#3', 'door#4'), scenario('d', ['door#4'])] }];
    // a is kept (unproven) and presses door#2 in a step: b goes; c is proven and kept for door#3, pressing door#4:
    // d goes
    const proven = new Set([runName('f', 'b', 'door#2'), runName('f', 'c', 'door#3'), runName('f', 'd', 'door#4')]);
    expect(leftOf(browserPlan(features, proven))).toEqual([runName('f', 'b', 'door#2'), runName('f', 'd', 'door#4')]);
  });

  it('never leaves out a run whose scenario expects what only a browser draws', () => {
    for (const expect_ of [{ render: { computed: [{}], geometry: [] } }, { render: { computed: [], geometry: [{}] } }, { editor: {} }, { hover: {} }]) {
      const reading = scenario('a', ['door#1'], expect_);
      expect(drawsInTheBrowser(reading)).toBe(true);
      const features = [{ id: 'f', scenarios: [reading, scenario('b', ['door#1'])] }];
      expect(leftOf(browserPlan(features, new Set([runName('f', 'a', 'door#1')])))).toEqual([]);
    }
  });

  it('leaves out a proven run whose only browser read was its archive, when its door keeps a browser run', () => {
    const features = [{ id: 'f', scenarios: [scenario('a', ['export#1'], { export: { files: [] } }), scenario('b', ['export#1'], { export: { files: [] } })] }];
    const proven = new Set([runName('f', 'a', 'export#1'), runName('f', 'b', 'export#1')]);
    expect(leftOf(browserPlan(features, proven))).toEqual([runName('f', 'b', 'export#1')]);
  });

  it('undoes and redoes through the toolbar only the runs the fast runner could not prove', () => {
    const features = [{ id: 'f', scenarios: [scenario('a', ['door#1']), scenario('b', ['door#2'])] }];
    const plan = browserPlan(features, new Set([runName('f', 'a', 'door#1')]));
    expect(plan.get(runName('f', 'a', 'door#1'))?.undoRedo).toBe(false);
    expect(plan.get(runName('f', 'b', 'door#2'))?.undoRedo).toBe(true);
  });

  it("reloads the first run of each kind of persistence, and an unproven run for the editor's own state, never a proven run beyond them", () => {
    const doc = { persistence: { document: 'same', preferences: null } };
    const prefs = { persistence: { document: null, preferences: 'same' } };
    const features = [{ id: 'f', scenarios: [scenario('a', ['d#1'], doc), scenario('b', ['d#2'], doc), scenario('c', ['d#3'], prefs), scenario('d', ['d#4'], prefs), scenario('e', ['d#5'], doc)] }];
    const proven = new Set(['a', 'b', 'c', 'd'].map((id, i) => runName('f', id, `d#${i + 1}`)));
    const plan = browserPlan(features, proven);
    const reloads = [...plan].filter(([, one]) => one.reload).map(([name]) => name);
    // a: the first document run; c: the first preferences run; d: proven, so the fast runner's reload holds it; e: an
    // unproven run that keeps only the document, which autosave keeps whatever command changed it
    expect(reloads).toEqual([runName('f', 'a', 'd#1'), runName('f', 'c', 'd#3')]);
    const unprovenPrefs = browserPlan([{ id: 'f', scenarios: [scenario('a', ['d#1'], prefs), scenario('b', ['d#2'], prefs)] }], new Set([runName('f', 'a', 'd#1')]));
    expect(unprovenPrefs.get(runName('f', 'b', 'd#2'))?.reload).toBe(true);
  });

  it('runs every run whole when the fast runner has no record of these inputs', () => {
    const features = [{ id: 'f', scenarios: [scenario('a', ['door#1']), scenario('b', ['door#1'], { persistence: { document: 'same' } })] }];
    const plan = browserPlan(features, null);
    expect([...plan.values()]).toEqual([
      { left: false, undoRedo: true, reload: false },
      { left: false, undoRedo: true, reload: true },
    ]);
  });

  it('plans every process of a browser run from the copy its first process pinned', () => {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'balance-'));
    const file = path.join(folder, 'pinned.json');
    const before = process.env.E2E_HEADLESS_PINNED;
    try {
      fs.writeFileSync(file, JSON.stringify({ proven: ['f › a › door#1'] }));
      process.env.E2E_HEADLESS_PINNED = file;
      // a worker: the copy is there, nothing is pinned again
      pinHeadlessRecord();
      expect(process.env.E2E_HEADLESS_PINNED).toBe(file);
      expect([...(runRecord().proven ?? [])]).toEqual(['f › a › door#1']);
      fs.writeFileSync(file, JSON.stringify({ why: 'no record' }));
      expect(runRecord()).toEqual({ proven: null, why: 'no record' });
    } finally {
      if (before === undefined) delete process.env.E2E_HEADLESS_PINNED;
      else process.env.E2E_HEADLESS_PINNED = before;
      fs.rmSync(folder, { recursive: true, force: true });
    }
  });

  it('trusts the fast runner only on the inputs it ran on, and says why it trusts none', () => {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'balance-'));
    const file = path.join(folder, 'headless.json');
    try {
      writeHeadlessResults(['f › a › door#1'], 'another tree', file);
      expect(headlessProven('this tree', file)).toBeNull();
      expect([...(headlessProven('another tree', file) ?? [])]).toEqual(['f › a › door#1']);
      expect(headlessProven('another tree', path.join(folder, 'missing.json'))).toBeNull();
      expect(headlessRecord('this tree', file)).toMatchObject({ proven: null, why: expect.stringContaining('other contents') });
      expect(headlessRecord('this tree', path.join(folder, 'missing.json'))).toMatchObject({ proven: null, why: expect.stringContaining('no record') });
    } finally {
      fs.rmSync(folder, { recursive: true, force: true });
    }
  });
});
