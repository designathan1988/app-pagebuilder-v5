# EST-L05a-049 × GRE-EST-L05a-049-03 → GRL-EST-L05a-049-02
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-03 (startDrafts): ENT-L05a-0010
- **Leitor:** GRL-EST-L05a-049-02 (flushDraftCaret): ENT-L05a-0103
## Estados deixados por A
- **Final — nulo, no começo da ligação:** `src/editor/persistence/drafts.ts:156` `  held = null;`
- **Final — o rascunho restaurado, aceito só com a revisão e a seleção conferindo:** `src/editor/persistence/drafts.ts:160` `  if (parsed.success && canWrite() && parsed.data.revision === revision() && JSON.stringify(parsed.data.selection) === JSON.stringify(owner.getState().selection)) held = parsed.data;`
- **Final — nulo de novo, quando o rascunho de canvas é recusado:** `src/editor/persistence/drafts.ts:181` `        persist(null);`
- **Intermediário — nulo antes de o rascunho restaurado ser aceito:** `src/editor/persistence/drafts.ts:156` `  held = null;`
- **Desmontagem — nenhum descarte:** a limpeza de `startDrafts` não toca `held` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `flushDraftCaret` chega com o escritor terminado e lê o item em duas leituras: o rascunho de canvas em `src/editor/persistence/drafts.ts:57` `  if (held?.kind === 'canvas') canvasCapture?.();` e o de campo em `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
### C2 intermediário
- O leitor distingue os tipos e o estado de restauração: com o rascunho de campo à espera de aplicar não grava, e com o de canvas captura o caret, nas leituras de `src/editor/persistence/drafts.ts:57` `  if (held?.kind === 'canvas') canvasCapture?.();` e `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
### C3 em curso
- O leitor corre no `selectionchange` (`src/editor/persistence/drafts.ts:194` `  document.addEventListener('selectionchange', flushDraftCaret);`), síncrono, e chama o escritor na mesma chamada; a leitura precede a chamada de `saveFieldDraft`.
- Fecho: n/a — a leitura precede a chamada do escritor (`src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`)
### C4 desmontagem
- Depois de o editor desmontar, o ouvinte é removido em `src/editor/persistence/drafts.ts:197` `    document.removeEventListener('selectionchange', flushDraftCaret);` e o leitor deixa de correr; `held` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:197` `    document.removeEventListener('selectionchange', flushDraftCaret);`
## Resultado
- O leitor grava o rascunho de campo do campo ativo ou captura o caret do rascunho de canvas a partir do que leu: `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
