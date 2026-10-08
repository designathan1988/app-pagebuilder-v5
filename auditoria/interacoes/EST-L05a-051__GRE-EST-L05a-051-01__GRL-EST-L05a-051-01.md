# EST-L05a-051 × GRE-EST-L05a-051-01 → GRL-EST-L05a-051-01
- **Estado:** EST-L05a-051
- **Escritor:** GRE-EST-L05a-051-01 (o ouvinte): ENT-L05a-0102
- **Leitor:** GRL-EST-L05a-051-01 (flushDraftCaret): ENT-L05a-0103
## Estados deixados por A
- **Final — a restauração à espera desfeita (falso), quando o documento, a seleção, o texto editado ou o painel rápido mudam:** `src/editor/persistence/drafts.ts:189` `      pending = false;`
- **Inalterada, quando o alvo não muda:** a escrita é guardada pela condição de `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`
- **Desmontagem — a assinatura removida; o item fica como estava:** `src/editor/persistence/drafts.ts:196` `    stop();`
## Casos
### C1 final
- O leitor `flushDraftCaret` chega com o escritor terminado e lê o item na guarda `!pending` em `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`; com `pending` falso grava o rascunho do campo ativo.
- Fecho: ok — `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
### C2 intermediário
- O leitor chega com a restauração à espera (verdadeira), que é o estado entre o rascunho e a sua aplicação; a guarda `!pending` em `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);` é falsa e ele não grava.
- Fecho: ok — `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
### C3 em curso
- O leitor corre no `selectionchange` (`src/editor/persistence/drafts.ts:194` `  document.addEventListener('selectionchange', flushDraftCaret);`) e é síncrono; o escritor `o ouvinte` corre na assinatura da store, sem se cruzar com a leitura da guarda.
- Fecho: n/a — nenhum escritor de `pending` corre no meio da leitura (`src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`)
### C4 desmontagem
- Depois de o editor desmontar, o ouvinte é removido em `src/editor/persistence/drafts.ts:197` `    document.removeEventListener('selectionchange', flushDraftCaret);` e o leitor deixa de correr.
- Fecho: ok — `src/editor/persistence/drafts.ts:197` `    document.removeEventListener('selectionchange', flushDraftCaret);`
## Resultado
- O leitor grava o rascunho do campo ativo só quando não há restauração à espera: `src/editor/persistence/drafts.ts:59` `  if (held?.kind === 'field' && !pending && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && fieldKey(field) === held.key) saveFieldDraft(field);`
