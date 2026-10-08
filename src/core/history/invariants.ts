// The rules of the history, checked at every publication of the store in development and tests only: the editor store
// hands them to the core store behind import.meta.env.DEV (src/editor/store.ts), so the first write that breaks one is
// loud in any use, a manual one too, and the build a person uses never carries this module (vite.config.ts fails a
// build whose chunks hold HISTORY_RULES_MARK; tools/runner/production-probe.ts shows the mark is there when DEV is
// on). The rules (the investigation's C2, option D; the model of tools/runner/model/ checks the same and more):
//  - a new entry, or an entry merged into the last one, changes the document: its inverses take the document it
//    leaves to another one, and its patches take that one back exactly; and it empties the redo stack. (A gesture or a
//    command group records its entry once its changes were published: the publication that records it may change
//    nothing.)
//  - a redo moves the next redo entry to the end of the past, and an undo the last entry of the past to the redo stack;
//    a load empties both, and a cancelled command sequence goes back to a part of the past it had;
//  - the patches a change publishes take its `before` to its `after` (a loaded project replaces the pages whole).
import type { DocumentJson } from '../document/model.ts';
import type { HistoryState } from './history.ts';
import { applyPatches, deepEqual, type Patch } from './transaction.ts';

export const HISTORY_RULES_MARK = 'builder-history-rules';

interface Published {
  readonly document: DocumentJson;
  readonly history: HistoryState;
}

const same = (a: readonly unknown[], b: readonly unknown[]): boolean => a.length === b.length && a.every((x, i) => x === b[i]);

// What the publication from `before` to `after` with `patches` breaks of the rules, in words; none when it keeps them.
export function historyBreaches(before: Published, after: Published, patches: readonly Patch[]): readonly string[] {
  const out: string[] = [];
  const was = before.history;
  const now = after.history;
  if (now !== was) {
    const redid = now.past.length === was.past.length + 1 && now.future.length === was.future.length - 1 && now.past.at(-1) === was.future.at(-1);
    const undid = now.past.length === was.past.length - 1 && now.future.length === was.future.length + 1 && now.future.at(-1) === was.past.at(-1);
    const emptied = now.past.length === 0 && now.future.length === 0;
    // a cancelled command sequence goes back to the history from before it: a part of the past it had
    const rolledBack = now.past.length < was.past.length && now.past.every((tx, i) => tx === was.past[i]);
    const recorded = !redid && now.past.length === was.past.length + 1 && same(now.past.slice(0, -1), was.past);
    const merged = now.past.length === was.past.length && now.past.length > 0 && now.past.at(-1) !== was.past.at(-1) && same(now.past.slice(0, -1), was.past.slice(0, -1));
    const entry = recorded || merged ? now.past.at(-1) : undefined;
    if (entry !== undefined) {
      const how = merged ? 'merged' : 'recorded';
      const undone = applyPatches(after.document, entry.inverses).document;
      if (deepEqual(undone, after.document)) out.push(`${HISTORY_RULES_MARK}: an entry ${how} that changes nothing`);
      else if (!deepEqual(applyPatches(undone, entry.patches).document, after.document)) out.push(`${HISTORY_RULES_MARK}: an entry ${how} whose patches do not redo what its inverses undo`);
      if (now.future.length > 0) out.push(`${HISTORY_RULES_MARK}: an entry ${how} left ${now.future.length} entries to redo`);
    }
    const kept = same(now.past, was.past) && same(now.future, was.future);
    if (!redid && !undid && !emptied && !rolledBack && !recorded && !merged && !kept) {
      out.push(`${HISTORY_RULES_MARK}: the history went from ${was.past.length} entries and ${was.future.length} to redo to ${now.past.length} and ${now.future.length}, by no undo, redo, entry or merge`);
    }
  }
  if (after.document !== before.document && !deepEqual(after.document, before.document)) {
    const [only] = patches;
    const load = patches.length === 1 && only !== undefined && only.op === 'replace' && only.path.length === 1 && only.path[0] === 'pages';
    const coherent = load ? deepEqual(after.document.pages, only.value) : deepEqual(applyPatches(before.document, patches).document, after.document);
    if (!coherent) out.push(`${HISTORY_RULES_MARK}: the ${patches.length} patches published do not take the document before the change to the one after it`);
  }
  return out;
}
