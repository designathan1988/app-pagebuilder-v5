# EST-L05a-051 × GRE-EST-L05a-051-02 → GRL-EST-L05a-051-01
- **Estado:** EST-L05a-051
- **Escritor:** GRE-EST-L05a-051-02 (startDrafts): ENT-L05a-0010
- **Leitor:** GRL-EST-L05a-051-01 (flushDraftCaret): ENT-L05a-0103
## Estados deixados por A
- **Final — falso, no começo da ligação:** `src/editor/persistence/drafts.ts:157` `  pending = false;`
- **Final — verdadeiro, com rascunho restaurado:** `src/editor/persistence/drafts.ts:163` `    pending = true;`
- **Final — falso de novo, quando o rascunho de canvas é recusado:** `src/editor/persistence/drafts.ts:180` `        pending = false;`
- **Intermediário — falso antes de o rascunho restaurado ser aceito:** `src/editor/persistence/drafts.ts:157` `  pending = false;`
- **Desmontagem — não é reposto:** a limpeza de `startDrafts` não toca `pending` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `flushDraftCaret` chega com o escritor terminado e lê o item na guarda `!pending` em `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`; com `pending` falso grava o rascunho do campo ativo.
- Fecho: ok — `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
### C2 intermediário
- O leitor chega com a restauração à espera (verdadeira), o estado entre a ligação e a aplicação pelo campo; a guarda `!pending` em `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);` é falsa e ele não grava.
- Fecho: ok — `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
### C3 em curso
- O leitor corre no `selectionchange` (`src/editor/persistence/drafts.ts:194` `  document.addEventListener('selectionchange', flushDraftCaret);`) e é síncrono; `startDrafts` é uma ligação síncrona e não corre sobre a leitura.
- Fecho: n/a — nenhum escritor de `pending` corre no meio da leitura (`src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`)
### C4 desmontagem
- Depois de o editor desmontar, o ouvinte é removido em `src/editor/persistence/drafts.ts:197` `    document.removeEventListener('selectionchange', flushDraftCaret);` e o leitor deixa de correr.
- Fecho: ok — `src/editor/persistence/drafts.ts:197` `    document.removeEventListener('selectionchange', flushDraftCaret);`
## Resultado
- O leitor grava o rascunho do campo ativo só quando não há restauração à espera: `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
