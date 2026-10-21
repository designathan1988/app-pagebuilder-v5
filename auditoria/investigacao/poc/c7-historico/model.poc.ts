// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// Proof of concept C7/C2: model-based testing (fast-check fc.commands + fc.modelRun) over the editor's real store,
// without a browser. The model is the stack of { before, after } entries the person expects, built from the manifest's
// rules (history.coalesce, undoRestoresSelection) and from what each step published. After each step:
//  - every publication that changes the document creates a new entry, or merges with the previous one only when the
//    manifest allows it (same command, same target and property, within the constant's window, no command in between);
//  - a publication that does not change the document does not touch the history (nothing outside the document enters it);
//  - undo returns exactly to the document and selection from before the entry; redo, to those from after;
//  - each published DocumentChange takes `before` to `after` through its own patches (incremental rendering);
//  - pending typing (src/editor/input/pending.ts) is saved before any command from outside the field;
//  - a gesture becomes one entry on commit and none while open; cancelled, it returns to the document and selection from before.
// At the end of each sequence: undoing everything returns to the start, and redoing everything returns to the end.
import fs from 'node:fs';
import fc from 'fast-check';
import { it } from 'vitest';
import { walk, type DocumentJson, type Selection } from '../../../../src/core/document/model.ts';
import { applyPatches, deepEqual } from '../../../../src/core/history/transaction.ts';
import { manualClock, type ManualClock } from '../../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../../src/core/ports/ids.ts';
import type { DocumentChange, Gesture } from '../../../../src/core/store/store.ts';
import { createEditorStore, editContextOf, MODEL_RULES, type EditorState, type EditorStore } from '../../../../src/editor/store.ts';
import { heldTyping, holdTyping, keepTyping } from '../../../../src/editor/input/pending.ts';
import type { CommandId } from '../../../../src/generated/ids.ts';
import { manifest } from '../../../../src/manifest/runtime.ts';

const OUTPUT = 'auditoria/investigacao/poc/c7-historico/resultados';
const FIXTURES = ['aurora', 'responsive-sections', 'grid-page'].filter((n) => fs.existsSync(`manifest/features/fixtures/${n}.json`));
const fixture = (name: string): DocumentJson => JSON.parse(fs.readFileSync(`manifest/features/fixtures/${name}.json`, 'utf8')) as DocumentJson;
const memory = (): { read(): string | null; write(text: string): void } => {
  let stored: string | null = null;
  return { read: () => stored, write: (t) => void (stored = t) };
};

// ------------------------------------------------------------ what the manifest declares about the history
const COMMANDS = new Map(manifest.commands.map((c) => [c.id, c]));
const CONSTANTS = new Map(manifest.interactions.constants.map((c) => [c.id, c.value]));
function mergeWindow(id: string): number | null {
  const h = COMMANDS.get(id as CommandId)?.history as { undoable: boolean; coalesce?: 'none' | { same: string; within: string } } | undefined;
  if (h === undefined || !h.undoable || h.coalesce === undefined || h.coalesce === 'none') return null;
  const v = CONSTANTS.get(h.coalesce.within as never);
  return typeof v === 'number' ? v : null;
}
// "same: target-and-property": the target is the node the arguments name, or the selection the command acts on
const mergeKey = (id: string, args: Record<string, unknown>, selection: Selection): string =>
  JSON.stringify([id, args.target ?? args.targets ?? args.nodes ?? selection, args.property ?? null]);

// ------------------------------------------------------------ model and real system
interface Snapshot { readonly document: DocumentJson; readonly selection: Selection }
interface Entry { readonly before: Snapshot; after: Snapshot }
interface Model { past: Entry[]; future: Entry[]; lastKey: string | null; lastInstant: number }
type Phase = 'normal' | 'gesture' | 'gesture-end';
interface Real {
  readonly store: EditorStore;
  readonly clock: ManualClock;
  published: { state: EditorState; phase: Phase }[];
  changes: DocumentChange[];
  phase: Phase;
  typing: { field: HTMLInputElement; saved: boolean } | null;
  last: EditorState;
}
const snapshot = (s: EditorState): Snapshot => ({ document: s.document, selection: s.selection });
const nodes = (s: EditorState): string[] => s.document.pages.flatMap((p) => [...walk(p.tree)].map((n) => n.id));

class Violation extends Error {}
const demand = (cond: boolean, text: string): void => {
  if (!cond) throw new Violation(text);
};

// checks a step's publications against the model; `key` and `window` say whether the step's command merges
function checkPublications(m: Model, r: Real, step: { key: string | null; window: number | null; beforeGesture?: Snapshot }): boolean {
  let previous = r.last;
  let createdOrMerged = false;
  let gestureClosed = false;
  for (const { state, phase } of r.published) {
    const grew = state.history.past.length - previous.history.past.length;
    const docChanged = !deepEqual(previous.document, state.document);
    if (phase === 'gesture') {
      demand(state.history === previous.history || deepEqual(state.history, previous.history), 'the history changed during an open gesture');
    } else if (phase === 'gesture-end' && !gestureClosed && step.beforeGesture !== undefined) {
      gestureClosed = true;
      if (grew === 1) {
        demand(state.history.future.length === 0, 'the gesture commit did not empty the redo stack');
        m.past.push({ before: step.beforeGesture, after: snapshot(state) });
        m.future = [];
      } else if (grew === 0 && docChanged) {
        // cancelling returns to the state from before the gesture
        demand(deepEqual(state.document, step.beforeGesture.document), 'cancelling the gesture did not restore the document from before');
        demand(deepEqual(state.selection, step.beforeGesture.selection), 'cancelling the gesture did not restore the selection from before');
      } else {
        demand(grew === 0, `the end of the gesture changed the history by ${grew} entries`);
      }
    } else if (grew === 1) {
      demand(docChanged, 'a new entry entered the history without a change to the document');
      demand(state.history.future.length === 0, 'a new entry did not empty the redo stack');
      m.past.push({ before: snapshot(previous), after: snapshot(state) });
      m.future = [];
      createdOrMerged = true;
    } else if (grew === 0 && docChanged) {
      const canMerge = step.window !== null && step.key !== null && m.lastKey === step.key && r.clock.now() - m.lastInstant <= step.window;
      demand(canMerge, 'the document changed and no new entry appeared, without a merge the manifest allows');
      demand(state.history.future.length === 0, 'the merge did not empty the redo stack');
      const top = m.past.at(-1);
      demand(top !== undefined, 'merge without a previous entry');
      if (top !== undefined) top.after = snapshot(state);
      tally().merges += 1;
      createdOrMerged = true;
    } else if (grew === 0) {
      demand(deepEqual(state.history, previous.history), 'the history changed without a change to the document');
    } else {
      demand(false, `the history lost ${-grew} entries in a step that does not undo`);
    }
    previous = state;
  }
  return createdOrMerged;
}

type Tally = { steps: number; maxEntries: number; undone: number; merges: number; gestures: number; typings: number };
const tally = (): Tally => (globalThis as Record<string, unknown>).__pocTally as Tally;
function checkAfter(m: Model, r: Real): void {
  const s = r.store.getState();
  tally().steps += 1;
  tally().maxEntries = Math.max(tally().maxEntries, s.history.past.length);
  demand(s.history.past.length === m.past.length, `the history has ${s.history.past.length} entries and the model expects ${m.past.length}`);
  demand(s.history.future.length === m.future.length, `the redo stack has ${s.history.future.length} entries and the model expects ${m.future.length}`);
  for (const c of r.changes) demand(deepEqual(applyPatches(c.before, c.patches).document, c.after), 'a DocumentChange does not take before to after through its own patches');
  r.changes = [];
  r.published = [];
  r.last = s;
}

// a step that dispatches a command from outside the focused field (focus leaves the field first)
function dispatchFromOutside(m: Model, r: Real, id: string, args: Record<string, unknown>): void {
  if (r.typing !== null) r.typing.field.blur();
  const hadTyping = heldTyping() !== null;
  const span = mergeWindow(id);
  const key = span === null ? null : mergeKey(id, args, r.store.getState().selection);
  const result = (r.store.dispatch as (i: CommandId, a: unknown) => { status: string })(id as CommandId, args);
  if (result.status === 'confirm') r.store.answer(true);
  if (hadTyping) {
    demand(heldTyping() === null, `the pending typing stayed pending after ${id} from outside the field`);
    demand(r.typing?.saved === true, `the pending typing was not saved before ${id}`);
  }
  const merged = checkPublications(m, r, { key, window: span });
  m.lastKey = merged && key !== null ? key : null;
  if (merged) m.lastInstant = r.clock.now();
  checkAfter(m, r);
}

// ------------------------------------------------------------ the steps
type Step = fc.Command<Model, Real>;
const PROPERTIES = ['width', 'height', 'opacity', 'margin-top', 'color', 'position', 'display'];
const VALUES = ['10px', '35px', '50%', 'auto', '0.5', 'red', 'absolute', 'flex', '', 'banana'];
const ENTRIES = [...MODEL_RULES.palette.keys()].slice(0, 8);

class Select implements Step {
  constructor(readonly i: number) {}
  check = () => true;
  run(m: Model, r: Real) { const ns = nodes(r.store.getState()); dispatchFromOutside(m, r, 'selection.select', { target: ns[this.i % ns.length] }); }
  toString = () => `Select(${this.i})`;
}
class Add implements Step {
  constructor(readonly i: number) {}
  check = () => true;
  run(m: Model, r: Real) { const ns = nodes(r.store.getState()); dispatchFromOutside(m, r, 'selection.add', { target: ns[this.i % ns.length] }); }
  toString = () => `Add(${this.i})`;
}
// two arrow presses on the same field with a wait between them: merging depends on the constant's window
class Burst implements Step {
  constructor(readonly p: number, readonly ms: number) {}
  check = () => true;
  run(m: Model, r: Real) {
    const property = PROPERTIES[this.p % 3];
    dispatchFromOutside(m, r, 'field.step', { direction: 'up', size: 'step', property, value: '10px' });
    r.clock.advance(this.ms);
    dispatchFromOutside(m, r, 'field.step', { direction: 'up', size: 'step', property, value: '20px' });
  }
  toString = () => `Burst(${PROPERTIES[this.p % 3]},${this.ms})`;
}
class Style implements Step {
  constructor(readonly p: number, readonly v: number) {}
  check = () => true;
  run(m: Model, r: Real) { dispatchFromOutside(m, r, 'style.set', { property: PROPERTIES[this.p], value: VALUES[this.v] }); }
  toString = () => `Style(${PROPERTIES[this.p]}=${VALUES[this.v]})`;
}
class FieldStep implements Step {
  constructor(readonly p: number, readonly v: number, readonly up: boolean) {}
  check = () => true;
  run(m: Model, r: Real) { dispatchFromOutside(m, r, 'field.step', { direction: this.up ? 'up' : 'down', size: 'step', property: PROPERTIES[this.p % 3], value: VALUES[this.v % 3] }); }
  toString = () => `FieldStep(${PROPERTIES[this.p % 3]},${VALUES[this.v % 3]},${this.up ? 'up' : 'down'})`;
}
class Move implements Step {
  constructor(readonly dx: number, readonly dy: number) {}
  check = () => true;
  run(m: Model, r: Real) { dispatchFromOutside(m, r, 'position.move', { dx: this.dx, dy: this.dy }); }
  toString = () => `Move(${this.dx},${this.dy})`;
}
class Insert implements Step {
  constructor(readonly e: number) {}
  check = () => ENTRIES.length > 0;
  run(m: Model, r: Real) { dispatchFromOutside(m, r, 'element.insert', { entry: ENTRIES[this.e % ENTRIES.length] }); }
  toString = () => `Insert(${ENTRIES[this.e % ENTRIES.length]})`;
}
class Simple implements Step {
  constructor(readonly id: 'element.delete' | 'element.duplicate') {}
  check = () => true;
  run(m: Model, r: Real) { dispatchFromOutside(m, r, this.id, {}); }
  toString = () => this.id;
}
class Undo implements Step {
  check = () => true;
  run(m: Model, r: Real) {
    if (r.typing !== null) r.typing.field.blur();
    const before = snapshot(r.store.getState());
    const hadTyping = heldTyping() !== null;
    r.store.dispatch('history.undo' as CommandId, {} as never);
    // the typing saved by the undo itself created an entry: the publications say which
    const published = r.published;
    if (hadTyping) {
      demand(heldTyping() === null, 'the pending typing stayed pending after the undo');
      const save = published.findIndex((p, k) => p.state.history.past.length > (k === 0 ? r.last : (published[k - 1] as { state: EditorState }).state).history.past.length);
      if (save >= 0) {
        const previous = save === 0 ? r.last : (published[save - 1] as { state: EditorState }).state;
        m.past.push({ before: snapshot(previous), after: snapshot((published[save] as { state: EditorState }).state) });
        m.future = [];
      }
    }
    const entry = m.past.pop();
    const s = r.store.getState();
    if (entry === undefined) {
      demand(deepEqual(s.document, before.document) && deepEqual(s.selection, before.selection), 'undo without an entry changed the state');
    } else {
      demand(deepEqual(s.document, entry.before.document), 'undo did not return to the document from before the entry');
      demand(deepEqual(s.selection, entry.before.selection), 'undo did not return to the selection from before the entry');
      m.future.push(entry);
      tally().undone += 1;
    }
    m.lastKey = null;
    checkAfter(m, r);
  }
  toString = () => 'Undo';
}
class Redo implements Step {
  check = () => true;
  run(m: Model, r: Real) {
    if (r.typing !== null) r.typing.field.blur();
    const hadTyping = heldTyping() !== null;
    const before = snapshot(r.store.getState());
    r.store.dispatch('history.redo' as CommandId, {} as never);
    if (hadTyping) {
      demand(heldTyping() === null, 'the pending typing stayed pending after the redo');
      // typing saved before the redo creates an entry and empties the redo stack
      const s = r.store.getState();
      if (s.history.past.length > r.last.history.past.length && s.history.future.length === 0 && deepEqual(s.document, r.published.at(-1)?.state.document)) {
        checkPublications(m, r, { key: null, window: null });
        m.lastKey = null;
        checkAfter(m, r);
        return;
      }
    }
    const entry = m.future.pop();
    const s = r.store.getState();
    if (entry === undefined) {
      demand(deepEqual(s.document, before.document) && deepEqual(s.selection, before.selection), 'redo without an entry changed the state');
    } else {
      demand(deepEqual(s.document, entry.after.document), 'redo did not return to the document from after the entry');
      demand(deepEqual(s.selection, entry.after.selection), 'redo did not return to the selection from after the entry');
      m.past.push(entry);
    }
    m.lastKey = null;
    checkAfter(m, r);
  }
  toString = () => 'Redo';
}
class Wait implements Step {
  constructor(readonly ms: number) {}
  check = () => true;
  run(_m: Model, r: Real) { r.clock.advance(this.ms); }
  toString = () => `Wait(${this.ms})`;
}
// a field receives typing that no command has saved yet (the single drafts registry)
class Type implements Step {
  constructor(readonly v: number) {}
  check = () => true;
  run(m: Model, r: Real) {
    const region = document.createElement('div');
    const field = document.createElement('input');
    region.append(field);
    document.body.append(region);
    const context = editContextOf(r.store.getState());
    const value = VALUES[this.v % 4] as string;
    const previous = r.typing;
    const wasPending = heldTyping() !== null;
    const record = { field, saved: false };
    holdTyping({
      field,
      region,
      context,
      owns: () => false,
      keep: () => {
        record.saved = true;
        r.store.dispatch('style.set' as CommandId, { property: 'opacity', value } as never, context);
      },
    });
    if (previous !== null && previous.saved === false && previous !== record) demand(heldTyping()?.field === field, 'the registry did not keep the new typing');
    if (previous !== null && !previous.saved && previous.field !== field) demand(previous.saved, 'a new field discarded the previous field\'s pending typing');
    r.typing = record;
    tally().typings += 1;
    field.focus();
    checkPublications(m, r, { key: null, window: null });
    // saving the previous typing is a command: it interrupts merging
    if (wasPending) m.lastKey = null;
    checkAfter(m, r);
  }
  toString = () => `Type(${VALUES[this.v % 4]})`;
}
// a pointer gesture with a few style.set; `outside`: a command that changes the document arrives from outside during the gesture
class GestureStep implements Step {
  constructor(readonly n: number, readonly commits: boolean, readonly outside: boolean, readonly sel: number | null = null) {}
  check = () => true;
  run(m: Model, r: Real) {
    if (r.typing !== null) r.typing.field.blur();
    const wasPending = heldTyping() !== null;
    const g: Gesture = r.store.gesture();
    tally().gestures += 1;
    // opening the gesture saves the pending typing: it counts as a normal step
    checkPublications(m, r, { key: null, window: null });
    const beforeGesture = snapshot(r.store.getState());
    const lastBefore = r.store.getState();
    r.published = [];
    r.last = lastBefore;
    r.phase = 'gesture';
    // the outside command runs after the gesture when it would run now (the selection does not change inside the gesture)
    let duplicateRuns = this.outside && r.store.canRun('element.duplicate' as CommandId, {} as never);
    if (this.sel !== null) { const ns = nodes(r.store.getState()); g.dispatch('selection.select' as CommandId, { target: ns[this.sel % ns.length] } as never); }
    for (let k = 0; k < this.n; k++) g.dispatch('style.set' as CommandId, { property: 'width', value: `${10 + k * 7}px` } as never);
    const docBeforeOutside = r.store.getState().document;
    if (this.outside) r.store.dispatch('element.duplicate' as CommandId, {} as never);
    demand(this.outside === false || deepEqual(r.store.getState().document, docBeforeOutside), 'a command that changes the document ran in the middle of the gesture');
    // committed, the outside command runs on the selection the gesture left
    if (this.commits) duplicateRuns = this.outside && r.store.canRun('element.duplicate' as CommandId, {} as never);
    const gestureEntry = this.commits && !deepEqual(r.store.getState().document, beforeGesture.document) ? 1 : 0;
    r.phase = 'gesture-end';
    if (this.commits) g.commit(); else g.cancel();
    r.phase = 'normal';
    checkPublications(m, r, { key: null, window: null, beforeGesture });
    const expected = lastBefore.history.past.length + gestureEntry + (duplicateRuns ? 1 : 0);
    demand(r.store.getState().history.past.length === expected, `after the gesture the history has ${r.store.getState().history.past.length} entries and should have ${expected}`);
    // only a command that ran interrupts merging: a gesture with no command at all (a tap that did nothing) does not
    if (wasPending || this.n > 0 || this.outside || this.sel !== null) m.lastKey = null;
    checkAfter(m, r);
  }
  toString = () => `Gesture(${this.n},${this.commits ? 'commit' : 'cancel'}${this.outside ? ',with outside command' : ''}${this.sel === null ? '' : `,selects ${this.sel}`})`;
}

const STEPS = [
  fc.nat(40).map((i) => new Select(i)),
  fc.tuple(fc.nat(PROPERTIES.length - 1), fc.nat(VALUES.length - 1)).map(([p, v]) => new Style(p, v)),
  fc.tuple(fc.nat(5), fc.nat(5), fc.boolean()).map(([p, v, s]) => new FieldStep(p, v, s)),
  fc.tuple(fc.integer({ min: -3, max: 3 }), fc.integer({ min: -3, max: 3 })).map(([x, y]) => new Move(x, y)),
  fc.nat(20).map((e) => new Insert(e)),
  fc.constantFrom('element.delete' as const, 'element.duplicate' as const).map((id) => new Simple(id)),
  fc.constant(null).map(() => new Undo()),
  fc.constant(null).map(() => new Undo()),
  fc.constant(null).map(() => new Redo()),
  fc.constantFrom(0, 300, 999, 1001, 5000).map((ms) => new Wait(ms)),
  fc.nat(9).map((v) => new Type(v)),
  fc.tuple(fc.integer({ min: 0, max: 3 }), fc.boolean(), fc.boolean(), fc.option(fc.nat(40))).map(([n, c, f, sel]) => new GestureStep(n, c, f, sel)),
  fc.nat(40).map((i) => new Add(i)),
  fc.tuple(fc.nat(5), fc.constantFrom(0, 500, 1000, 1001, 3000)).map(([p, ms]) => new Burst(p, ms)),
];

function createReal(name: string): Real {
  const clock = manualClock(1_000_000);
  const store = createEditorStore({ storage: memory(), workspace: memory(), clock, ids: sequentialIds('p'), restored: { document: fixture(name), selection: [] }, ports: { readOnly: () => false, downloads: { deliver: () => undefined }, clipboard: { write: () => undefined } as never }, freeze: true });
  const real: Real = { store, clock, published: [], changes: [], phase: 'normal', typing: null, last: store.getState() };
  store.subscribe(() => real.published.push({ state: store.getState(), phase: real.phase }));
  store.subscribeDocument((c) => real.changes.push(c));
  return real;
}

it('the history follows the manifest model in random sequences', () => {
  const start = Date.now();
  const mutant = process.env.POC_MUTANT ?? '';
  let failure: string | null = null;
  let runs = 0;
  const tally = { steps: 0, maxEntries: 0, undone: 0, merges: 0, gestures: 0, typings: 0 };
  (globalThis as Record<string, unknown>).__pocTally = tally;
  try {
    fc.assert(
      fc.property(fc.constantFrom(...FIXTURES), fc.commands(STEPS, { maxCommands: 60, size: 'large' }), (name, steps) => {
        runs += 1;
        // no typing from a previous run stays pending
        keepTyping();
        document.body.innerHTML = '';
        const real = createReal(name);
        const initial = snapshot(real.store.getState());
        const model: Model = { past: [], future: [], lastKey: null, lastInstant: 0 };
        fc.modelRun(() => ({ model, real }), steps);
        // undoing everything returns to the start; redoing everything returns to the end
        if (real.typing !== null) real.typing.field.blur();
        if (heldTyping() !== null) new Undo().run(model, real);
        const end = snapshot(real.store.getState());
        const n = real.store.getState().history.past.length;
        for (let k = 0; k < n; k++) real.store.dispatch('history.undo' as CommandId, {} as never);
        demand(deepEqual(real.store.getState().document, initial.document), 'undoing everything did not return to the initial document');
        for (let k = 0; k < n; k++) real.store.dispatch('history.redo' as CommandId, {} as never);
        demand(deepEqual(real.store.getState().document, end.document), 'redoing everything did not return to the final document');
      }),
      { seed: 20261008, numRuns: Number(process.env.POC_RUNS ?? 150) },
    );
  } catch (error) {
    const cause = error instanceof Error && error.cause instanceof Error ? `
Cause: ${error.cause.message}` : '';
    failure = String(error instanceof Error ? error.message : error) + cause;
  }
  fs.mkdirSync(OUTPUT, { recursive: true });
  const applied = (globalThis as Record<string, unknown>).__pocMutantApplied ?? null;
  const summary = { mutant: mutant || 'none', applied, detected: failure !== null, runs, tally, ms: Date.now() - start, failure: failure?.slice(0, 4000) ?? null };
  fs.writeFileSync(`${OUTPUT}/${mutant || 'original'}.txt`, JSON.stringify(summary, null, 2));
  if (failure !== null) throw new Error(failure);
});
