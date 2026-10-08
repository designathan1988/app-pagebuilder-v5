# EST-L05a-049 × GRE-EST-L05a-049-01 → GRL-EST-L05a-049-02
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-01 (o ouvinte): ENT-L05a-0102
- **Leitor:** GRL-EST-L05a-049-02 (flushDraftCaret): ENT-L05a-0103
## Estados deixados por A
- **Final — o rascunho descartado (nulo), quando o documento, a seleção, o texto editado ou o painel rápido mudam:** `src/editor/persistence/drafts.ts:190` `      persist(null);`
- **Intermediário — a restauração à espera desfeita antes do descarte:** `src/editor/persistence/drafts.ts:189` `      pending = false;`
- **Desmontagem — a assinatura removida; o rascunho em memória fica como estava:** `src/editor/persistence/drafts.ts:196` `    stop();`
## Casos
### C1 final
- O leitor `flushDraftCaret` chega com o escritor terminado e lê o item em duas leituras: o rascunho de canvas em `src/editor/persistence/drafts.ts:57` `  if (held?.kind === 'canvas') canvasCapture?.();` e o de campo em `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
### C2 intermediário
- O leitor distingue os tipos e o estado de restauração: com o rascunho de campo à espera de aplicar não grava, e com o de canvas captura o caret, nas leituras de `src/editor/persistence/drafts.ts:57` `  if (held?.kind === 'canvas') canvasCapture?.();` e `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
### C3 em curso
- O leitor corre no `selectionchange` (`src/editor/persistence/drafts.ts:194` `  document.addEventListener('selectionchange', flushDraftCaret);`), síncrono, e é ele que chama o escritor depois de ler; nenhum escritor de `held` corre antes da leitura.
- Fecho: n/a — a leitura precede a chamada do escritor (`src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`)
### C4 desmontagem
- Depois de o editor desmontar, o ouvinte é removido em `src/editor/persistence/drafts.ts:197` `    document.removeEventListener('selectionchange', flushDraftCaret);` e o leitor deixa de correr; `held` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:197` `    document.removeEventListener('selectionchange', flushDraftCaret);`
## Resultado
- O leitor grava o rascunho de campo do campo ativo ou captura o caret do rascunho de canvas a partir do que leu: `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
