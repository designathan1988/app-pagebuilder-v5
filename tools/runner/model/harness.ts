// The model of the store and its history (the investigation's C2 and C7, auditoria/investigacao/relatorio.md; grown
// from auditoria/investigacao/poc/c7-historico/modelo.poc.ts). Model-based testing with fast-check (fc.commands and
// fc.modelRun) over the editor's own store, without a browser: the model is the stack of entries { before, after } the
// person expects, built from the manifest's history rules (history.coalesce, undoRestoresSelection) and from what each
// step published. It never reuses the history's code. After every step:
//  - a publication that changes the document makes a new entry, or merges into the last one only where the manifest
//    allows it (same command, target and property, within the constant's window, no command in between);
//  - a publication that changes no document leaves the history as it was;
//  - undo goes back exactly to the document and the selection from before the entry; redo to those from after it;
//  - every DocumentChange takes `before` to `after` by its own patches (a loaded project replaces `pages` whole, as
//    src/core/store/store.ts declares of DocumentChange);
//  - the typing a field holds (src/editor/input/pending.ts) is kept before any command from outside the field, before a
//    press outside it, and at once when a command moves what the field edits; it is kept in the context it began in;
//  - a gesture makes one entry at its commit and none while it is open; cancelled, it goes back to the document and the
//    selection from before it;
//  - opening another project empties the history.
// At the end of every sequence: undoing everything goes back to the start, and redoing everything to the end.
// Each group of commands (history.test.ts, style.test.ts, structure.test.ts, text.test.ts, pages.test.ts) runs these
// rules with its own steps. A run writes its summary to .cache/model/<group>.json; tools/runner/mutants.ts plants the
// faults of its catalogue and expects these runs to fail.
import fs from 'node:fs';
import fc from 'fast-check';
import { walk, type DocumentJson, type Selection } from '../../../src/core/document/model.ts';
import { breakpointsOf } from '../../../src/core/document/breakpoints.ts';
import { applyPatches, deepEqual } from '../../../src/core/history/transaction.ts';
import { manualClock, type ManualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import type { DocumentChange, EditContext, Gesture } from '../../../src/core/store/store.ts';
import { heldTyping, holdTyping, keepTyping, keepTypingBefore } from '../../../src/editor/input/pending.ts';
import { createEditorStore, editContextOf, MODEL_RULES, type EditorState, type EditorStore } from '../../../src/editor/store.ts';
import { keyframeTarget } from '../../../src/editor/timeline/playhead.ts';
import { activeLayer, STATES } from '../../../src/editor/view/style-state.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { manifest } from '../../../src/manifest/runtime.ts';

export const FIXTURES = ['aurora', 'responsive-sections', 'grid-page'].filter((name) => fs.existsSync(`manifest/features/fixtures/${name}.json`));
export const fixture = (name: string): DocumentJson => JSON.parse(fs.readFileSync(`manifest/features/fixtures/${name}.json`, 'utf8')) as DocumentJson;
const memory = (): { read(): string | null; write(text: string): void } => {
  let held: string | null = null;
  return { read: () => held, write: (text) => void (held = text) };
};

// ------------------------------------------------------------ what the manifest declares of the history
const COMMANDS = new Map(manifest.commands.map((c) => [c.id as string, c]));
const CONSTANTS = new Map(manifest.interactions.constants.map((c) => [c.id as string, c.value]));
export function coalesceWindow(id: string): number | null {
  const h = COMMANDS.get(id)?.history as { undoable: boolean; coalesce?: 'none' | { same: string; within: string } } | undefined;
  if (h === undefined || !h.undoable || h.coalesce === undefined || h.coalesce === 'none') return null;
  const value = CONSTANTS.get(h.coalesce.within);
  return typeof value === 'number' ? value : null;
}
// "same: target-and-property": the target is the node the arguments name, or the selection the command acts on
const coalesceKey = (id: string, args: Readonly<Record<string, unknown>>, selection: Selection): string => JSON.stringify([id, args.target ?? args.targets ?? args.nodes ?? selection, args.property ?? null]);

// The context an edit begins in, read here from its parts and not through editContextOf (CLAUDE.md, rule G1): the layer
// (breakpoint and state), the class the Style tab targets and the keyframe the playhead sits on.
export const contextOf = (state: EditorState): EditContext => ({ layer: activeLayer(state), styleClass: state.ui.styleTarget ?? null, keyframe: keyframeTarget(state) });
// The context an undo or a redo gives back (DCS-009): the layer and the class always; the keyframe when the change was
// made on one (one made off every keyframe leaves the Timeline as the person has it: DCS-016).
const sameContext = (now: EditContext, made: EditContext): boolean => deepEqual(now.layer, made.layer) && (now.styleClass ?? null) === (made.styleClass ?? null) && ((made.keyframe ?? null) === null || deepEqual(now.keyframe, made.keyframe));

// ------------------------------------------------------------ the model and the real system
export interface Snapshot {
  readonly document: DocumentJson;
  readonly selection: Selection;
  readonly context: EditContext;
}
export interface Entry {
  readonly before: Snapshot;
  after: Snapshot;
}
export interface Model {
  past: Entry[];
  future: Entry[];
  lastKey: string | null;
  lastAt: number;
}
type Phase = 'normal' | 'gesture' | 'gesture-end';
interface Typed {
  readonly field: HTMLInputElement;
  readonly region: HTMLElement;
  readonly context: EditContext;
  readonly value: string;
  kept: boolean;
}
export interface Counts {
  steps: number;
  maxEntries: number;
  undos: number;
  merges: number;
  gestures: number;
  typings: number;
  loads: number;
  contexts: number;
}
export interface Real {
  readonly store: EditorStore;
  readonly clock: ManualClock;
  published: { state: EditorState; phase: Phase; madeIn: EditContext | null }[];
  changes: DocumentChange[];
  phase: Phase;
  typing: Typed | null;
  // the context a write runs in while the typing is kept (the typing's own): its entry is made there
  keepingIn: EditContext | null;
  last: EditorState;
  readonly counts: Counts;
}
export type Step = fc.Command<Model, Real>;

export const snapshot = (s: EditorState): Snapshot => ({ document: s.document, selection: s.selection, context: contextOf(s) });
export const nodesOf = (s: EditorState): string[] => s.document.pages.flatMap((p) => [...walk(p.tree)].map((n) => n.id));

export class Breach extends Error {
  override name = 'Breach';
}
export function demand(condition: boolean, rule: string): asserts condition {
  if (!condition) throw new Breach(rule);
}

// The publications of a step against the model; `key` and `within` say whether the step's command merges.
export function checkPublished(m: Model, r: Real, step: { key: string | null; within: number | null; beforeGesture?: Snapshot }): boolean {
  let previous = r.last;
  let madeOrMerged = false;
  let gestureClosed = false;
  for (const { state, phase, madeIn } of r.published) {
    const grew = state.history.past.length - previous.history.past.length;
    const documentChanged = !deepEqual(previous.document, state.document);
    if (phase === 'gesture') {
      demand(state.history === previous.history || deepEqual(state.history, previous.history), 'o histórico mudou durante um gesto aberto');
    } else if (phase === 'gesture-end' && !gestureClosed && step.beforeGesture !== undefined) {
      gestureClosed = true;
      if (grew === 1) {
        demand(state.history.future.length === 0, 'o commit do gesto não esvaziou a pilha de refazer');
        m.past.push({ before: step.beforeGesture, after: snapshot(state) });
        m.future = [];
      } else if (grew === 0 && documentChanged) {
        demand(deepEqual(state.document, step.beforeGesture.document), 'cancelar o gesto não devolveu o documento de antes');
        demand(deepEqual(state.selection, step.beforeGesture.selection), 'cancelar o gesto não devolveu a seleção de antes');
      } else {
        demand(grew === 0, `o fim do gesto mexeu no histórico em ${grew} entradas`);
      }
    } else if (grew === 1) {
      demand(documentChanged, 'uma entrada nova entrou no histórico sem mudança no documento');
      demand(state.history.future.length === 0, 'uma entrada nova não esvaziou a pilha de refazer');
      m.past.push({ before: { ...snapshot(previous), context: madeIn ?? contextOf(previous) }, after: snapshot(state) });
      m.future = [];
      madeOrMerged = true;
    } else if ((grew === 0 || grew === -1) && documentChanged) {
      const mayMerge = step.within !== null && step.key !== null && m.lastKey === step.key && r.clock.now() - m.lastAt <= step.within;
      demand(mayMerge, grew === 0 ? 'o documento mudou e nenhuma entrada nova apareceu, sem fusão que o manifesto permita' : 'o histórico perdeu uma entrada num passo que não desfaz');
      demand(state.history.future.length === 0, 'a fusão não esvaziou a pilha de refazer');
      const top = m.past.at(-1);
      demand(top !== undefined, 'fusão sem entrada anterior');
      // a burst that comes back to the document from before its entry changes nothing: its entry goes (the history's
      // own rule, src/core/history/history.ts: a command that changes nothing records no entry)
      const nothing = deepEqual(state.document, top.before.document);
      demand(!nothing || grew === -1, 'uma fusão que volta ao documento de antes da entrada deixou uma entrada que não muda nada');
      demand(nothing || grew === 0, 'uma fusão que muda o documento tirou a entrada do histórico');
      if (nothing) m.past.pop();
      else top.after = snapshot(state);
      r.counts.merges += 1;
      // after an entry that went, the next step of the burst begins a new one
      madeOrMerged = !nothing;
    } else if (grew === 0) {
      demand(deepEqual(state.history, previous.history), 'o histórico mudou sem mudança no documento');
    } else {
      demand(false, `o histórico perdeu ${-grew} entradas num passo que não desfaz`);
    }
    previous = state;
  }
  return madeOrMerged;
}

// a DocumentChange takes `before` to `after` by its own patches; a load replaces the pages whole
function coherent(change: DocumentChange): boolean {
  const [only] = change.patches;
  if (change.patches.length === 1 && only !== undefined && only.op === 'replace' && only.path.length === 1 && only.path[0] === 'pages') return deepEqual(change.after.pages, only.value);
  return deepEqual(applyPatches(change.before, change.patches).document, change.after);
}

export function checkAfter(m: Model, r: Real): void {
  const s = r.store.getState();
  r.counts.steps += 1;
  r.counts.maxEntries = Math.max(r.counts.maxEntries, s.history.past.length);
  demand(s.history.past.length === m.past.length, `o histórico tem ${s.history.past.length} entradas e o modelo espera ${m.past.length}`);
  demand(s.history.future.length === m.future.length, `a pilha de refazer tem ${s.history.future.length} entradas e o modelo espera ${m.future.length}`);
  for (const change of r.changes) demand(coherent(change), 'um DocumentChange não leva before a after pelos próprios patches');
  r.changes = [];
  r.published = [];
  r.last = s;
}

// The style layers a change wrote into: for every node of every page, the breakpoint and state whose declarations
// differ between `before` and `after` (src/core/document/model.ts: breakpoint → state → declarations).
type Layers = Readonly<Record<string, Readonly<Record<string, unknown>> | undefined>>;
function layersWritten(change: DocumentChange): { breakpoint: string; state: string }[] {
  const stylesOf = (d: DocumentJson): Map<string, Layers> => new Map(d.pages.flatMap((p) => [...walk(p.tree)].map((n) => [n.id, n.styles as Layers] as const)));
  const before = stylesOf(change.before);
  const out: { breakpoint: string; state: string }[] = [];
  for (const [id, after] of stylesOf(change.after)) {
    const was = before.get(id);
    if (was === undefined || was === after) continue;
    for (const breakpoint of new Set([...Object.keys(was), ...Object.keys(after)])) {
      const a = was[breakpoint] ?? {};
      const b = after[breakpoint] ?? {};
      for (const state of new Set([...Object.keys(a), ...Object.keys(b)])) if (!deepEqual(a[state], b[state])) out.push({ breakpoint, state });
    }
  }
  return out;
}
// a write that keeps typing goes to the layer the typing began in (rule G1), not to the one shown now
export function demandWrittenIn(changes: readonly DocumentChange[], context: EditContext, what: string): void {
  if (context.layer === undefined || (context.styleClass ?? null) !== null || (context.keyframe ?? null) !== null) return;
  for (const layer of changes.flatMap(layersWritten)) {
    demand(layer.breakpoint === context.layer.breakpoint && layer.state === context.layer.state, `${what} gravou em ${layer.breakpoint}/${layer.state} e não no contexto em que a digitação começou, ${context.layer.breakpoint}/${context.layer.state}`);
  }
}

// A step that dispatches a command from outside the field that has the focus (the focus leaves the field first), or,
// `inField`, the field's own command with the focus in it.
export function dispatchStep(m: Model, r: Real, id: string, args: Readonly<Record<string, unknown>>, inField = false): void {
  if (r.typing !== null && !inField) r.typing.field.blur();
  const hadTyping = heldTyping() !== null;
  // a command the field owns (its property's arrow, from its row or from a key: ownsProperty in src/editor/shell/
  // field.tsx) is the field's own wherever it comes from: it keeps or steps the typing itself
  const owned = heldTyping()?.owns(id as CommandId, args) === true;
  const within = coalesceWindow(id);
  const key = within === null ? null : coalesceKey(id, args, r.store.getState().selection);
  const result = (r.store.dispatch as (i: CommandId, a: unknown) => { status: string })(id as CommandId, args);
  if (result.status === 'confirm') r.store.answer(true);
  if (hadTyping && !inField && !owned) {
    demand(heldTyping() === null, `a digitação pendente continuou pendente depois de ${id} vindo de fora do campo`);
    demand(r.typing?.kept === true, `a digitação pendente não foi gravada antes de ${id}`);
  }
  const merged = checkPublished(m, r, { key, within });
  m.lastKey = merged && key !== null ? key : null;
  if (merged) m.lastAt = r.clock.now();
  checkAfter(m, r);
}
export const dispatchOutside = (m: Model, r: Real, id: string, args: Readonly<Record<string, unknown>>): void => dispatchStep(m, r, id, args);

// ------------------------------------------------------------ the steps every group shares
export const PROPERTIES = ['width', 'height', 'opacity', 'margin-top', 'color', 'position', 'display'];
export const VALUES = ['10px', '35px', '50%', 'auto', '0.5', 'red', 'absolute', 'flex', '', 'banana'];
const TYPED = ['0.5', '0.25', '1', '0.75'];
const TYPED_PROPERTY = 'opacity';

class Undo implements Step {
  check = () => true;
  run(m: Model, r: Real) {
    if (r.typing !== null) r.typing.field.blur();
    const before = snapshot(r.store.getState());
    const hadTyping = heldTyping() !== null;
    r.store.dispatch('history.undo' as CommandId, {} as never);
    // the typing kept by the undo itself made an entry: the publications say which
    const published = r.published;
    if (hadTyping) {
      demand(heldTyping() === null, 'a digitação pendente continuou pendente depois do desfazer');
      const keptAt = published.findIndex((p, k) => p.state.history.past.length > (k === 0 ? r.last : (published[k - 1] as { state: EditorState }).state).history.past.length);
      if (keptAt >= 0) {
        const previous = keptAt === 0 ? r.last : (published[keptAt - 1] as { state: EditorState }).state;
        m.past.push({ before: snapshot(previous), after: snapshot((published[keptAt] as { state: EditorState }).state) });
        m.future = [];
      }
    }
    const entry = m.past.pop();
    const s = r.store.getState();
    if (entry === undefined) {
      demand(deepEqual(s.document, before.document) && deepEqual(s.selection, before.selection), 'desfazer sem entrada mudou o estado');
    } else {
      demand(deepEqual(s.document, entry.before.document), 'desfazer não voltou ao documento de antes da entrada');
      demand(deepEqual(s.selection, entry.before.selection), 'desfazer não voltou à seleção de antes da entrada');
      // the breakpoint, the state, the class and the keyframe the change was made in (DCS-009, D-A)
      demand(sameContext(contextOf(s), entry.before.context), `desfazer não devolveu o contexto em que a mudança foi feita: ${JSON.stringify(entry.before.context.layer)} e o editor mostra ${JSON.stringify(contextOf(s).layer)}`);
      m.future.push(entry);
      r.counts.undos += 1;
    }
    m.lastKey = null;
    checkAfter(m, r);
  }
  toString = () => 'Desfazer';
}
class Redo implements Step {
  check = () => true;
  run(m: Model, r: Real) {
    if (r.typing !== null) r.typing.field.blur();
    const hadTyping = heldTyping() !== null;
    const before = snapshot(r.store.getState());
    r.store.dispatch('history.redo' as CommandId, {} as never);
    if (hadTyping) {
      demand(heldTyping() === null, 'a digitação pendente continuou pendente depois do refazer');
      // a typing kept before the redo makes an entry and empties the redo stack
      const s = r.store.getState();
      if (s.history.past.length > r.last.history.past.length && s.history.future.length === 0 && deepEqual(s.document, r.published.at(-1)?.state.document)) {
        checkPublished(m, r, { key: null, within: null });
        m.lastKey = null;
        checkAfter(m, r);
        return;
      }
    }
    const entry = m.future.pop();
    const s = r.store.getState();
    if (entry === undefined) {
      demand(deepEqual(s.document, before.document) && deepEqual(s.selection, before.selection), 'refazer sem entrada mudou o estado');
    } else {
      demand(deepEqual(s.document, entry.after.document), 'refazer não voltou ao documento de depois da entrada');
      demand(deepEqual(s.selection, entry.after.selection), 'refazer não voltou à seleção de depois da entrada');
      demand(sameContext(contextOf(s), entry.before.context), `refazer não devolveu o contexto em que a mudança foi feita: ${JSON.stringify(entry.before.context.layer)} e o editor mostra ${JSON.stringify(contextOf(s).layer)}`);
      m.past.push(entry);
    }
    m.lastKey = null;
    checkAfter(m, r);
  }
  toString = () => 'Refazer';
}
class Wait implements Step {
  constructor(readonly ms: number) {}
  check = () => true;
  run(_m: Model, r: Real) {
    r.clock.advance(this.ms);
  }
  toString = () => `Esperar(${this.ms})`;
}
// A field takes typing no command kept yet (the one registry of drafts): it captures the context the edit begins in, as
// the editor's fields do (editContextOf), and owns its own field.step on its property.
class Type implements Step {
  constructor(readonly v: number) {}
  check = () => true;
  run(m: Model, r: Real) {
    const region = document.createElement('div');
    const field = document.createElement('input');
    const step = document.createElement('button');
    region.append(field, step);
    document.body.append(region);
    const state = r.store.getState();
    const context = editContextOf(state);
    demand(deepEqual(context, contextOf(state)), 'o contexto que o campo captura não traz a camada, a classe e o quadro-chave em que a edição começa');
    const value = TYPED[this.v % TYPED.length] as string;
    const previous = r.typing;
    const pending = heldTyping() !== null;
    const typed: Typed = { field, region, context, value, kept: false };
    holdTyping({
      field,
      region,
      context,
      owns: (id, args) => id === 'field.step' && args.property === TYPED_PROPERTY,
      keep: () => {
        typed.kept = true;
        const from = r.changes.length;
        r.keepingIn = context;
        try {
          r.store.dispatch('style.set' as CommandId, { property: TYPED_PROPERTY, value } as never, context);
        } finally {
          r.keepingIn = null;
        }
        demandWrittenIn(r.changes.slice(from), context, 'a gravação da digitação');
      },
    });
    demand(heldTyping()?.field === field, 'o registro não guardou a digitação nova');
    if (pending && previous !== null) demand(previous.kept, 'um campo novo descartou a digitação pendente do anterior');
    r.typing = typed;
    r.counts.typings += 1;
    field.focus();
    checkPublished(m, r, { key: null, within: null });
    // keeping the previous typing is a command: it breaks the merge
    if (pending) m.lastKey = null;
    checkAfter(m, r);
  }
  toString = () => `Digitar(${TYPED[this.v % TYPED.length]})`;
}
// The field's own command (its arrow) with the focus in it: it runs in the context the typing began in.
class FieldOwn implements Step {
  constructor(readonly up: boolean) {}
  check = () => true;
  run(m: Model, r: Real) {
    const typing = r.typing;
    if (typing === null || heldTyping()?.field !== typing.field) return;
    typing.field.focus();
    const from = r.changes.length;
    const changes = r.changes;
    dispatchStep(m, r, 'field.step', { direction: this.up ? 'up' : 'down', size: 'step', property: TYPED_PROPERTY, value: typing.value }, true);
    demandWrittenIn(changes.slice(from), typing.context, 'o comando do próprio campo');
    demand(heldTyping()?.field === typing.field, 'o comando do próprio campo gravou a digitação como se viesse de fora');
  }
  toString = () => `ComandoDoCampo(${this.up ? 'up' : 'down'})`;
}
// A press begins (the pointer owner's first word, src/editor/input/pointer/events.ts): on the field's own row it leaves
// the typing held; anywhere else the typing is kept first.
class Touch implements Step {
  constructor(readonly own: boolean) {}
  check = () => true;
  run(m: Model, r: Real) {
    const typing = r.typing;
    const held = typing !== null && heldTyping()?.field === typing.field;
    const target = this.own && typing !== null ? (typing.region.lastElementChild ?? typing.region) : document.body;
    keepTypingBefore(target);
    if (held && this.own) demand(heldTyping()?.field === typing.field && !typing.kept, 'um toque na própria linha do campo gravou a digitação');
    else if (held) demand(heldTyping() === null && typing.kept, 'um toque fora do campo não gravou a digitação pendente antes de agir');
    checkPublished(m, r, { key: null, within: null });
    if (held && heldTyping() === null) m.lastKey = null;
    checkAfter(m, r);
  }
  toString = () => `Toque(${this.own ? 'no campo' : 'fora'})`;
}
// The breakpoint or the style state changes, from outside the field or from inside it (a key with the focus in the
// field): what the field edits moves, so the typing is kept at once, where it was typed (rule G1).
class Context implements Step {
  constructor(readonly breakpoint: number, readonly state: number | null, readonly inside: boolean) {}
  check = () => true;
  run(m: Model, r: Real) {
    const s = r.store.getState();
    const breakpoints = breakpointsOf(s.document);
    const breakpoint = breakpoints[this.breakpoint % breakpoints.length];
    const typing = r.typing;
    const held = heldTyping() !== null && typing !== null && heldTyping()?.field === typing.field;
    if (this.inside && typing !== null) typing.field.focus();
    else typing?.field.blur();
    const from = r.changes.length;
    const dispatch = r.store.dispatch as (i: CommandId, a: unknown) => unknown;
    if (breakpoint !== undefined) dispatch('view.setBreakpoint' as CommandId, { breakpoint: breakpoint.id });
    if (this.state !== null) dispatch('view.setStyleState' as CommandId, { state: STATES[this.state % STATES.length]?.id });
    r.counts.contexts += 1;
    if (held && typing !== null) {
      const moved = !deepEqual(contextOf(r.store.getState()), typing.context);
      if (moved || !this.inside) demand(heldTyping() === null && typing.kept, 'a troca do que o campo edita não gravou a digitação pendente na hora');
      if (typing.kept) demandWrittenIn(r.changes.slice(from), typing.context, 'a troca de contexto');
    }
    checkPublished(m, r, { key: null, within: null });
    m.lastKey = null;
    checkAfter(m, r);
  }
  toString = () => `Contexto(${this.breakpoint},${this.state ?? '-'},${this.inside ? 'dentro do campo' : 'fora'})`;
}
// A pointer gesture with some style.set; `outside`: a command that changes the document arrives from outside during it.
class GestureStep implements Step {
  constructor(readonly n: number, readonly commits: boolean, readonly outside: boolean, readonly select: number | null = null) {}
  check = () => true;
  run(m: Model, r: Real) {
    if (r.typing !== null) r.typing.field.blur();
    const pending = heldTyping() !== null;
    const g: Gesture = r.store.gesture();
    r.counts.gestures += 1;
    // opening the gesture keeps the pending typing: a normal step
    checkPublished(m, r, { key: null, within: null });
    const beforeGesture = snapshot(r.store.getState());
    const lastBefore = r.store.getState();
    r.published = [];
    r.last = lastBefore;
    r.phase = 'gesture';
    let duplicateRuns = this.outside && r.store.canRun('element.duplicate' as CommandId, {} as never);
    if (this.select !== null) {
      const ns = nodesOf(r.store.getState());
      g.dispatch('selection.select' as CommandId, { target: ns[this.select % ns.length] } as never);
    }
    for (let k = 0; k < this.n; k++) g.dispatch('style.set' as CommandId, { property: 'width', value: `${10 + k * 7}px` } as never);
    const documentBeforeOutside = r.store.getState().document;
    if (this.outside) r.store.dispatch('element.duplicate' as CommandId, {} as never);
    demand(!this.outside || deepEqual(r.store.getState().document, documentBeforeOutside), 'um comando que muda o documento rodou no meio do gesto');
    // committed, the command from outside runs on the selection the gesture left
    if (this.commits) duplicateRuns = this.outside && r.store.canRun('element.duplicate' as CommandId, {} as never);
    const gestureEntry = this.commits && !deepEqual(r.store.getState().document, beforeGesture.document) ? 1 : 0;
    r.phase = 'gesture-end';
    if (this.commits) g.commit();
    else g.cancel();
    r.phase = 'normal';
    checkPublished(m, r, { key: null, within: null, beforeGesture });
    const expected = lastBefore.history.past.length + gestureEntry + (duplicateRuns ? 1 : 0);
    demand(r.store.getState().history.past.length === expected, `depois do gesto o histórico tem ${r.store.getState().history.past.length} entradas e devia ter ${expected}`);
    // only a command that ran breaks the merge: a gesture with no command at all (a press that did nothing) does not
    if (pending || this.n > 0 || this.outside || this.select !== null) m.lastKey = null;
    checkAfter(m, r);
  }
  toString = () => `Gesto(${this.n},${this.commits ? 'commit' : 'cancel'}${this.outside ? ',com comando de fora' : ''}${this.select === null ? '' : `,seleciona ${this.select}`})`;
}
// Another project opens (project.open with a project file's text, project.newBlankPage): the selection and the history
// start empty, and the document is the one opened.
class Load implements Step {
  constructor(readonly name: string | null) {}
  check = () => true;
  run(m: Model, r: Real) {
    if (r.typing !== null) r.typing.field.blur();
    const hadTyping = heldTyping() !== null;
    const dispatch = r.store.dispatch as (i: CommandId, a: unknown) => { status: string };
    const result = this.name === null ? dispatch('project.newBlankPage' as CommandId, {}) : dispatch('project.open' as CommandId, { file: JSON.stringify(fixture(this.name)) });
    if (result.status === 'confirm') r.store.answer(true);
    if (hadTyping) demand(heldTyping() === null && r.typing?.kept === true, 'a digitação pendente não foi gravada antes de abrir outro projeto');
    const s = r.store.getState();
    demand(s.history.past.length === 0, `abrir outro projeto manteve ${s.history.past.length} entradas do anterior no histórico`);
    demand(s.history.future.length === 0, 'abrir outro projeto manteve a pilha de refazer do anterior');
    demand(s.selection.length === 0, 'abrir outro projeto manteve a seleção do anterior');
    m.past = [];
    m.future = [];
    m.lastKey = null;
    r.counts.loads += 1;
    r.published = [];
    checkAfter(m, r);
  }
  toString = () => `Carregar(${this.name ?? 'página em branco'})`;
}

// a step that dispatches one command from outside the field, its arguments read from the state now
export const command = (id: string, args: (s: EditorState) => Readonly<Record<string, unknown>>, label: string): Step => ({
  check: () => true,
  run: (m, r) => dispatchOutside(m, r, id, args(r.store.getState())),
  toString: () => label,
});
export const select = (i: number): Step => ({ check: () => true, run: (m, r) => dispatchOutside(m, r, 'selection.select', { target: pick(nodesOf(r.store.getState()), i) }), toString: () => `Selecionar(${i})` });
export const addToSelection = (i: number): Step => ({ check: () => true, run: (m, r) => dispatchOutside(m, r, 'selection.add', { target: pick(nodesOf(r.store.getState()), i) }), toString: () => `Adicionar(${i})` });
export const pick = <T>(items: readonly T[], i: number): T | undefined => items[i % Math.max(1, items.length)];

// the steps of the history itself, the typing and the gestures, which every group mixes with its own commands
export const COMMON_STEPS: readonly fc.Arbitrary<Step>[] = [
  fc.nat(40).map(select),
  fc.constant(null).map(() => new Undo()),
  fc.constant(null).map(() => new Undo()),
  fc.constant(null).map(() => new Redo()),
  fc.constantFrom(0, 300, 999, 1001, 5000).map((ms) => new Wait(ms)),
  fc.nat(9).map((v) => new Type(v)),
  fc.boolean().map((up) => new FieldOwn(up)),
  fc.boolean().map((own) => new Touch(own)),
  fc.tuple(fc.nat(4), fc.option(fc.nat(4)), fc.boolean()).map(([b, s, inside]) => new Context(b, s, inside)),
  fc.tuple(fc.integer({ min: 0, max: 3 }), fc.boolean(), fc.boolean(), fc.option(fc.nat(40))).map(([n, c, o, s]) => new GestureStep(n, c, o, s)),
];
export const LOAD_STEPS: readonly fc.Arbitrary<Step>[] = [fc.option(fc.constantFrom(...FIXTURES), { freq: 3 }).map((name) => new Load(name))];

export const PALETTE = [...MODEL_RULES.palette.keys()];

function createReal(name: string): Real {
  const clock = manualClock(1_000_000);
  const store = createEditorStore({ storage: memory(), workspace: memory(), clock, ids: sequentialIds('p'), restored: { document: fixture(name), selection: [] }, ports: { readOnly: () => false, downloads: { deliver: () => undefined }, clipboard: { write: () => undefined } as never }, freeze: true });
  const real: Real = { store, clock, published: [], changes: [], phase: 'normal', typing: null, keepingIn: null, last: store.getState(), counts: { steps: 0, maxEntries: 0, undos: 0, merges: 0, gestures: 0, typings: 0, loads: 0, contexts: 0 } };
  store.subscribe(() => real.published.push({ state: store.getState(), phase: real.phase, madeIn: real.keepingIn }));
  store.subscribeDocument((c) => real.changes.push(c));
  return real;
}

export interface ModelSummary {
  readonly group: string;
  readonly mutant: string | null;
  readonly runs: number;
  readonly counts: Counts;
  readonly ms: number;
  readonly failure: string | null;
}

// Runs one group's model: random sequences of its steps and the common ones, on each fixture, with a fixed seed; a
// breach fails with the shortest sequence fast-check shrank to. The summary goes to .cache/model/<group>.json.
export function runModel(group: string, steps: readonly fc.Arbitrary<Step>[], options: { readonly runs?: number; readonly maxCommands?: number; readonly seed?: number } = {}): ModelSummary {
  const start = Date.now();
  const counts: Counts = { steps: 0, maxEntries: 0, undos: 0, merges: 0, gestures: 0, typings: 0, loads: 0, contexts: 0 };
  let failure: string | null = null;
  let runs = 0;
  try {
    fc.assert(
      fc.property(fc.constantFrom(...FIXTURES), fc.commands([...COMMON_STEPS, ...steps], { maxCommands: options.maxCommands ?? 60, size: 'large' }), (name, sequence) => {
        runs += 1;
        // no typing of a previous run stays pending
        keepTyping();
        document.body.innerHTML = '';
        const real = createReal(name);
        const model: Model = { past: [], future: [], lastKey: null, lastAt: 0 };
        try {
          fc.modelRun(() => ({ model, real }), sequence);
          if (real.typing !== null) real.typing.field.blur();
          if (heldTyping() !== null) new Undo().run(model, real);
          // undoing everything goes back to the start of the history; redoing everything to the end
          const start = model.past[0]?.before.document ?? real.store.getState().document;
          const end = real.store.getState().document;
          const n = real.store.getState().history.past.length;
          for (let k = 0; k < n; k++) real.store.dispatch('history.undo' as CommandId, {} as never);
          demand(deepEqual(real.store.getState().document, start), 'desfazer tudo não voltou ao documento do início do histórico');
          for (let k = 0; k < n; k++) real.store.dispatch('history.redo' as CommandId, {} as never);
          demand(deepEqual(real.store.getState().document, end), 'refazer tudo não voltou ao documento final');
        } finally {
          for (const key of Object.keys(counts) as (keyof Counts)[]) counts[key] = key === 'maxEntries' ? Math.max(counts[key], real.counts[key]) : counts[key] + real.counts[key];
        }
      }),
      { seed: options.seed ?? 20261008, numRuns: Number(process.env.BUILDER_MODEL_RUNS ?? options.runs ?? 150) },
    );
  } catch (error) {
    const cause = error instanceof Error && error.cause instanceof Error ? `\nCausa: ${error.cause.message}` : '';
    failure = String(error instanceof Error ? error.message : error) + cause;
  }
  const mutant = process.env.BUILDER_MUTANT ?? null;
  const summary: ModelSummary = { group, mutant: mutant === '' ? null : mutant, runs, counts, ms: Date.now() - start, failure: failure?.slice(0, 4000) ?? null };
  const folder = `.cache/model${summary.mutant === null ? '' : `/${summary.mutant}`}`;
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(`${folder}/${group}.json`, `${JSON.stringify(summary, null, 2)}\n`);
  return summary;
}
