// Mutantes plantados no histórico, na store do núcleo, na store do editor e no registro de rascunhos.
// Cada um troca um trecho único de um arquivo, no carregamento do módulo (plugin do Vite da prova de conceito),
// sem tocar o arquivo em disco. O trecho `de` precisa aparecer exatamente uma vez no arquivo.
export interface Mutante {
  readonly id: string;
  readonly arquivo: string;
  readonly de: string;
  readonly para: string;
  // a regra que o mutante quebra, em palavras
  readonly quebra: string;
}

export const MUTANTES: readonly Mutante[] = [
  { id: 'M01', arquivo: 'src/core/history/history.ts', de: '    selection: tx.selectionBefore,', para: '    selection: tx.selectionAfter,', quebra: 'desfazer restaura a seleção de depois do comando' },
  { id: 'M02', arquivo: 'src/core/history/history.ts', de: '    selection: tx.selectionAfter,', para: '    selection: tx.selectionBefore,', quebra: 'refazer restaura a seleção de antes do comando' },
  { id: 'M03', arquivo: 'src/core/history/history.ts', de: 'inverses: [...tx.inverses, ...last.inverses],', para: 'inverses: [...last.inverses, ...tx.inverses],', quebra: 'a fusão de entradas inverte a ordem dos inversos' },
  { id: 'M04', arquivo: 'src/core/history/history.ts', de: 'return { past: [...history.past, tx], future: [] };', para: 'return { past: [...history.past, tx], future: history.future };', quebra: 'uma entrada nova não esvazia a pilha de refazer' },
  { id: 'M05', arquivo: 'src/core/history/history.ts', de: 'tx.at - last.at <= within', para: 'true', quebra: 'a fusão ignora a janela de tempo' },
  { id: 'M06', arquivo: 'src/core/history/transaction.ts', de: "inverse = exists ? { op: 'replace', path, value: old } : { op: 'remove', path };", para: "inverse = exists ? { op: 'replace', path, value: patch.value } : { op: 'remove', path };", quebra: 'o inverso de uma troca de chave guarda o valor novo' },
  { id: 'M07', arquivo: 'src/core/history/transaction.ts', de: 'inverses.unshift(result.inverse);', para: 'inverses.push(result.inverse);', quebra: 'os inversos de uma transação ficam na ordem errada' },
  { id: 'M08', arquivo: 'src/core/store/store.ts', de: 'JSON.stringify(a.property ?? null)', para: 'JSON.stringify(null)', quebra: 'a chave de fusão esquece a propriedade' },
  { id: 'M09', arquivo: 'src/core/store/store.ts', de: '    const previousMergeable = lastMergeable;\n    lastMergeable = null;\n', para: '    const previousMergeable = lastMergeable;\n', quebra: 'um comando no meio não interrompe a fusão' },
  { id: 'M10', arquivo: 'src/core/store/store.ts', de: "outcome.kind === 'undo' ? tx.inverses : tx.patches);", para: "outcome.kind === 'undo' ? tx.patches : tx.inverses);", quebra: 'o desenho incremental recebe os patches errados no desfazer' },
  { id: 'M11', arquivo: 'src/core/store/store.ts', de: "document: before.document, selection: before.selection, history: before.history }, 'a cancelled gesture')", para: "document: before.document, selection: state.selection, history: before.history }, 'a cancelled gesture')", quebra: 'cancelar um gesto não devolve a seleção' },
  { id: 'M12', arquivo: 'src/core/store/store.ts', de: 'if (documentChanged && gesture === null && ownedGroup === null) {', para: 'if (documentChanged && ownedGroup === null) {', quebra: 'cada passo de um gesto vira uma entrada própria' },
  { id: 'M13', arquivo: 'src/core/store/store.ts', de: 'selectionBefore: before.selection, selectionAfter: selection,', para: 'selectionBefore: selection, selectionAfter: selection,', quebra: 'a transação guarda como seleção de antes a de depois' },
  { id: 'M14', arquivo: 'src/core/store/store.ts', de: 'if (documentChanged && gesture === null && ownedGroup === null) {', para: 'if (gesture === null && ownedGroup === null) {', quebra: 'uma mudança só de seleção entra no histórico' },
  { id: 'M15', arquivo: 'src/core/store/store.ts', de: 'selection: [], history: EMPTY_HISTORY, message: outcome.message', para: 'selection: [], history: state.history, message: outcome.message', quebra: 'abrir outro projeto mantém o histórico do anterior' },
  { id: 'M16', arquivo: 'src/editor/store.ts', de: 'const at = context ?? beforeCommand(id, args, changesDocument);', para: 'const at = context;', quebra: 'um comando roda sem gravar antes a digitação pendente' },
  { id: 'M17', arquivo: 'src/editor/input/pending.ts', de: '  if (held !== null && held.field !== typing.field) keepTyping();', para: '', quebra: 'um campo novo descarta a digitação pendente do anterior' },
  { id: 'M18', arquivo: 'src/editor/store.ts', de: '      waiting.push(() => void store.dispatch(id, args, asked));', para: '', quebra: 'um comando que chega durante um gesto se perde' },
];
