// Mutants planted in the history, in the core store, in the editor store and in the drafts registry.
// Each one swaps a unique passage of a file when the module loads (the proof of concept's Vite plugin), without
// touching the file on disk. The `from` passage must appear exactly once in the file.
export interface Mutant {
  readonly id: string;
  readonly file: string;
  readonly from: string;
  readonly to: string;
  // the rule the mutant breaks, in words
  readonly breaks: string;
}

export const MUTANTS: readonly Mutant[] = [
  { id: 'M01', file: 'src/core/history/history.ts', from: '    selection: tx.selectionBefore,', to: '    selection: tx.selectionAfter,', breaks: 'undo restores the selection from after the command' },
  { id: 'M02', file: 'src/core/history/history.ts', from: '    selection: tx.selectionAfter,', to: '    selection: tx.selectionBefore,', breaks: 'redo restores the selection from before the command' },
  { id: 'M03', file: 'src/core/history/history.ts', from: 'inverses: [...tx.inverses, ...last.inverses],', to: 'inverses: [...last.inverses, ...tx.inverses],', breaks: 'merging entries reverses the order of the inverses' },
  { id: 'M04', file: 'src/core/history/history.ts', from: 'return { past: [...history.past, tx], future: [] };', to: 'return { past: [...history.past, tx], future: history.future };', breaks: 'a new entry does not empty the redo stack' },
  { id: 'M05', file: 'src/core/history/history.ts', from: 'tx.at - last.at <= within', to: 'true', breaks: 'merging ignores the time window' },
  { id: 'M06', file: 'src/core/history/transaction.ts', from: "inverse = exists ? { op: 'replace', path, value: old } : { op: 'remove', path };", to: "inverse = exists ? { op: 'replace', path, value: patch.value } : { op: 'remove', path };", breaks: 'the inverse of a key replacement keeps the new value' },
  { id: 'M07', file: 'src/core/history/transaction.ts', from: 'inverses.unshift(result.inverse);', to: 'inverses.push(result.inverse);', breaks: 'the inverses of a transaction are in the wrong order' },
  { id: 'M08', file: 'src/core/store/store.ts', from: 'JSON.stringify(a.property ?? null)', to: 'JSON.stringify(null)', breaks: 'the merge key forgets the property' },
  { id: 'M09', file: 'src/core/store/store.ts', from: '    const previousMergeable = lastMergeable;\n    lastMergeable = null;\n', to: '    const previousMergeable = lastMergeable;\n', breaks: 'a command in between does not interrupt merging' },
  { id: 'M10', file: 'src/core/store/store.ts', from: "outcome.kind === 'undo' ? tx.inverses : tx.patches);", to: "outcome.kind === 'undo' ? tx.patches : tx.inverses);", breaks: 'incremental rendering receives the wrong patches on undo' },
  { id: 'M11', file: 'src/core/store/store.ts', from: "document: before.document, selection: before.selection, history: before.history }, 'a cancelled gesture')", to: "document: before.document, selection: state.selection, history: before.history }, 'a cancelled gesture')", breaks: 'cancelling a gesture does not restore the selection' },
  { id: 'M12', file: 'src/core/store/store.ts', from: 'if (documentChanged && gesture === null && ownedGroup === null) {', to: 'if (documentChanged && ownedGroup === null) {', breaks: 'each step of a gesture becomes its own entry' },
  { id: 'M13', file: 'src/core/store/store.ts', from: 'selectionBefore: before.selection, selectionAfter: selection,', to: 'selectionBefore: selection, selectionAfter: selection,', breaks: 'the transaction stores the after selection as the before selection' },
  { id: 'M14', file: 'src/core/store/store.ts', from: 'if (documentChanged && gesture === null && ownedGroup === null) {', to: 'if (gesture === null && ownedGroup === null) {', breaks: 'a selection-only change enters the history' },
  { id: 'M15', file: 'src/core/store/store.ts', from: 'selection: [], history: EMPTY_HISTORY, message: outcome.message', to: 'selection: [], history: state.history, message: outcome.message', breaks: 'opening another project keeps the previous one\'s history' },
  { id: 'M16', file: 'src/editor/store.ts', from: 'const at = context ?? beforeCommand(id, args, changesDocument);', to: 'const at = context;', breaks: 'a command runs without first saving the pending typing' },
  { id: 'M17', file: 'src/editor/input/pending.ts', from: '  if (held !== null && held.field !== typing.field) keepTyping();', to: '', breaks: 'a new field discards the previous field\'s pending typing' },
  { id: 'M18', file: 'src/editor/store.ts', from: '      waiting.push(() => void store.dispatch(id, args, asked));', to: '', breaks: 'a command that arrives during a gesture is lost' },
];
