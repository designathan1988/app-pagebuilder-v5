// The balance of the two scenario runners. The fast runner (headless.test.ts) proves a scenario's logic through the
// editor's own store — the document, the selection, the undo steps, the feedback, the refusals, undo and redo, what a
// reload restores and what an exported archive holds — in seconds. The browser runner (scenarios.ts) proves what only a
// browser can: that a door's gesture runs its command, what the page draws (computed values, geometry, the editor's
// regions, a hover), that a file it hands out arrives as a download, and that the browser's own storage keeps the work.
// So a browser run of a scenario the fast runner passed on this very tree checks only what the browser adds:
//   - it is left out when it expects nothing only a browser reads and its door's gesture runs in another browser run:
//     as the action of a run of its own, or as a step of a run kept (a run presses every door of its steps with its
//     real gesture);
//   - it does not undo and redo through the toolbar (the fast runner did, on the same commands);
//   - it reloads only when it is the first run of the suite to expect that kind of persistence (the document, the
//     preferences, the workspace, the selection): the browser's storage is proven once per kind, the fast runner
//     proves after every scenario that a reload restores what the run left.
// A run the fast runner could not prove (a gesture, a field that shapes typed text, a command a browser hands its
// arguments to) runs whole. The fast runner writes what it passed, with the fingerprint of the run's inputs
// (run-inputs.ts), to .cache/runner/headless.json; with no record for these inputs every browser run runs whole, and
// the status reporter says why (never silently).
import fs from 'node:fs';
import path from 'node:path';
import { inputsFingerprint } from './run-inputs.ts';

const HEADLESS_RESULTS = path.join('.cache', 'runner', 'headless.json');
// the annotation a browser run left out carries
export const PROVEN_HEADLESS = 'proven-headless';

interface Results {
  readonly fingerprint: string;
  readonly passed: readonly string[];
}

// The fast runner's record of the runs it passed (each named as the browser runner names its test).
export function writeHeadlessResults(passed: readonly string[], fingerprint: string = inputsFingerprint(), file: string = HEADLESS_RESULTS): void {
  const results: Results = { fingerprint, passed: [...passed].sort() };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(results, null, 2)}\n`);
}

// The fast runner's record as it stands for these inputs: the runs it passed, or why there are none to trust.
export type HeadlessRecord = { readonly proven: ReadonlySet<string> } | { readonly proven: null; readonly why: string };
export function headlessRecord(fingerprint: string = inputsFingerprint(), file: string = HEADLESS_RESULTS): HeadlessRecord {
  let results: Results;
  try {
    results = JSON.parse(fs.readFileSync(file, 'utf8')) as Results;
  } catch {
    return { proven: null, why: `no record of the fast runner (${file}): run npm run unit first` };
  }
  return results.fingerprint === fingerprint ? { proven: new Set(results.passed) } : { proven: null, why: 'the fast runner last ran on other contents of the run inputs (tools/runner/run-inputs.ts): run npm run unit first' };
}

// The runs the fast runner passed on these inputs, or null when it has no record of them.
export function headlessProven(fingerprint: string = inputsFingerprint(), file: string = HEADLESS_RESULTS): ReadonlySet<string> | null {
  return headlessRecord(fingerprint, file).proven;
}

// A browser run reads the record once. Its first process (the one that loads playwright.config.ts before it starts any
// worker) checks the record against the inputs as they stand, keeps what it found in a file of its own and names it in
// the environment its workers inherit: every worker plans from that copy, so a file edited or a record written while
// the suite runs cannot give a worker another plan than the one the run listed, and no worker hashes the inputs again.
const PINNED = 'E2E_HEADLESS_PINNED';
type Pinned = { readonly proven: readonly string[] } | { readonly why: string };
export function pinHeadlessRecord(): void {
  if (process.env[PINNED] !== undefined) return;
  const dir = path.dirname(HEADLESS_RESULTS);
  fs.mkdirSync(dir, { recursive: true });
  // the copies of runs whose process is gone
  for (const name of fs.readdirSync(dir)) {
    const pid = /^pinned-(\d+)\.json$/.exec(name)?.[1];
    if (pid === undefined) continue;
    try {
      process.kill(Number(pid), 0);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ESRCH') fs.rmSync(path.join(dir, name), { force: true });
    }
  }
  const record = headlessRecord();
  const pinned: Pinned = record.proven === null ? { why: record.why } : { proven: [...record.proven] };
  const file = path.join(dir, `pinned-${process.pid}.json`);
  fs.writeFileSync(file, JSON.stringify(pinned));
  process.env[PINNED] = file;
}

// The record this browser run plans from: the copy its first process pinned, else the record as it stands.
export function runRecord(): HeadlessRecord {
  const file = process.env[PINNED];
  if (file === undefined) return headlessRecord();
  const pinned = JSON.parse(fs.readFileSync(file, 'utf8')) as Pinned;
  return 'why' in pinned ? { proven: null, why: pinned.why } : { proven: new Set(pinned.proven) };
}

type Kept = 'same' | null | undefined;
interface ScenarioShape {
  readonly id: string;
  readonly doors: readonly string[];
  readonly steps?: readonly { readonly door: string; readonly action: boolean }[];
  readonly expect: {
    readonly render: { readonly computed: readonly unknown[]; readonly geometry: readonly unknown[] } | null;
    readonly editor: unknown;
    readonly persistence: { readonly document?: Kept; readonly preferences?: Kept; readonly workspace?: Kept; readonly selection?: Kept } | null;
    readonly export: unknown;
    readonly hover?: unknown;
  };
}
interface FeatureShape {
  readonly id: string;
  readonly scenarios: readonly ScenarioShape[];
}

// whether a scenario expects something only a browser draws (its persistence and its archive aside)
export function drawsInTheBrowser(s: ScenarioShape): boolean {
  const e = s.expect;
  return (e.render?.computed.length ?? 0) > 0 || (e.render?.geometry.length ?? 0) > 0 || (e.editor !== null && e.editor !== undefined) || e.hover !== undefined;
}

// a browser run's name: the feature, the scenario and the door
export const runName = (feature: string, scenario: string, door: string): string => `${feature} › ${scenario} › ${door}`;

const KINDS = ['document', 'preferences', 'workspace', 'selection'] as const;
const kept = (s: ScenarioShape): readonly (typeof KINDS)[number][] => KINDS.filter((kind) => s.expect.persistence?.[kind] === 'same');

export interface RunPlan {
  // not run in the browser: the fast runner proved it and another run presses its door
  readonly left: boolean;
  // undo and redo through the toolbar's doors after the steps
  readonly undoRedo: boolean;
  // a reload, and what it must restore
  readonly reload: boolean;
}

// What the browser runner does of each run, by its name. `proven`: the runs the fast runner passed on these inputs, or
// null when it has no record of them (then every run runs whole).
export function browserPlan(features: readonly FeatureShape[], proven: ReadonlySet<string> | null): ReadonlyMap<string, RunPlan> {
  const plan = new Map<string, RunPlan>();
  const runs = features.flatMap((feature) => feature.scenarios.flatMap((s) => s.doors.map((door) => ({ name: runName(feature.id, s.id, door), s, door }))));
  if (proven === null) {
    for (const run of runs) plan.set(run.name, { left: false, undoRedo: true, reload: run.s.expect.persistence !== null });
    return plan;
  }
  // the first run of the suite to expect each kind of persistence: the browser's own storage proven once per kind
  const representative = new Set<string>();
  for (const kind of KINDS) {
    const first = runs.find((run) => kept(run.s).includes(kind));
    if (first !== undefined) representative.add(first.name);
  }
  const needs = (run: (typeof runs)[number]): boolean => !proven.has(run.name) || drawsInTheBrowser(run.s) || representative.has(run.name);
  // the doors a kept run presses with their real gestures: its action's, and those of its other steps
  const pressedBy = (run: (typeof runs)[number]): readonly string[] => [run.door, ...(run.s.steps ?? []).filter((step) => !step.action).map((step) => step.door)];
  // every door keeps one browser run at least: the first, in the manifest's order, when no run kept presses it
  const pressed = new Set(runs.filter(needs).flatMap(pressedBy));
  for (const run of runs) {
    const isProven = proven.has(run.name);
    let left = !needs(run);
    if (left && !pressed.has(run.door)) {
      for (const door of pressedBy(run)) pressed.add(door);
      left = false;
    }
    // a run the fast runner could not prove reloads for what it keeps of the editor's own state (the preferences, the
    // workspace, the selection), which only its browser path changed
    const ownState = kept(run.s).some((kind) => kind !== 'document');
    plan.set(run.name, { left, undoRedo: !isProven, reload: representative.has(run.name) || (!isProven && ownState) });
  }
  return plan;
}
