# EST-L05a-049 × GRE-EST-L05a-049-02 → GRL-EST-L05a-049-02
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-02 (persist): ENT-L10a-0011
- **Leitor:** GRL-EST-L05a-049-02 (flushDraftCaret): ENT-L05a-0103
## Estados deixados por A
- **Final — o rascunho de campo:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o rascunho montado por `src/editor/persistence/drafts.ts:96` `  persist({ ...context(), kind: 'field', key, shown: field.dataset.shown, value: field.value, range: fieldRange(field) });`
- **Final — o rascunho de canvas:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o rascunho montado por `src/editor/persistence/drafts.ts:144` `  persist({ ...context(), kind: 'canvas', node, runs: [...runs], range });`
- **Final — nulo, quando o rascunho se resolve:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o valor nulo de `src/editor/persistence/drafts.ts:92` `    if (held?.kind === 'field' && held.key === key) persist(null);`
- **Intermediário — a restauração à espera desfeita antes de gravar:** `src/editor/persistence/drafts.ts:95` `  pending = false;`
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
