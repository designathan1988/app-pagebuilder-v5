# EST-L05a-051 × GRE-EST-L05a-051-01 → GRL-EST-L05a-051-02
- **Estado:** EST-L05a-051
- **Escritor:** GRE-EST-L05a-051-01 (o ouvinte): ENT-L05a-0102
- **Leitor:** GRL-EST-L05a-051-02 (restoreFieldDraft): ENT-L05a-0101
## Estados deixados por A
- **Final — a restauração à espera desfeita (falso), quando o documento, a seleção, o texto editado ou o painel rápido mudam:** `src/editor/persistence/drafts.ts:189` `      pending = false;`
- **Inalterada, quando o alvo não muda:** a escrita é guardada pela condição de `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`
- **Desmontagem — a assinatura removida; o item fica como estava:** `src/editor/persistence/drafts.ts:196` `    stop();`
## Casos
### C1 final
- O leitor `restoreFieldDraft` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`; com a restauração à espera desfeita, `!pending` é verdadeiro e ele devolve uma limpeza vazia.
- Fecho: ok — `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
### C2 intermediário
- O leitor chega quando o alvo do rascunho mudou e o ouvinte da store pôs `pending` a falso; a condição em `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {` é verdadeira e nada é posto no campo.
- Fecho: ok — `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
### C3 em curso
- O leitor corre no efeito de montagem do campo; nenhum escritor de `pending` corre no meio dele.
- Fecho: n/a — nenhum escritor de `pending` corre no meio do efeito (`src/editor/persistence/drafts.ts:100` `export function restoreFieldDraft(field: Field, restored: () => void): () => void {`)
### C4 desmontagem
- Depois de o campo desmontar, a limpeza cancela o quadro em `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`; `pending` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`
## Resultado
- O leitor só põe o rascunho no campo quando há uma restauração à espera: `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
