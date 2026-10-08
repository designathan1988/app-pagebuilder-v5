# EST-L05a-049 × GRE-EST-L05a-049-01 → GRL-EST-L05a-049-05
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-01 (o ouvinte): ENT-L05a-0102
- **Leitor:** GRL-EST-L05a-049-05 (restoreFieldDraft): ENT-L05a-0101
## Estados deixados por A
- **Final — o rascunho descartado (nulo), quando o documento, a seleção, o texto editado ou o painel rápido mudam:** `src/editor/persistence/drafts.ts:190` `      persist(null);`
- **Intermediário — a restauração à espera desfeita antes do descarte:** `src/editor/persistence/drafts.ts:189` `      pending = false;`
- **Desmontagem — a assinatura removida; o rascunho em memória fica como estava:** `src/editor/persistence/drafts.ts:196` `    stop();`
## Casos
### C1 final
- O leitor `restoreFieldDraft` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`; com o rascunho de campo do campo, pede o quadro em `src/editor/persistence/drafts.ts:131` `  frame = requestAnimationFrame(apply);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
### C2 intermediário
- O leitor chega quando o rascunho foi descartado ou trocado; a condição `held?.kind !== 'field' || held.key !== key` em `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {` é verdadeira e ele devolve uma limpeza vazia.
- Fecho: ok — `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
### C3 em curso
- O leitor corre no efeito de montagem do campo e é síncrono; nenhum escritor de `held` corre no meio dele.
- Fecho: n/a — nenhum escritor do item corre em paralelo com o efeito (`src/editor/persistence/drafts.ts:100` `export function restoreFieldDraft(field: Field, restored: () => void): () => void {`)
### C4 desmontagem
- Depois de o campo desmontar, a limpeza cancela o quadro em `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`; `held` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`
## Resultado
- O leitor põe o rascunho de campo no campo, no quadro seguinte, quando o rascunho é dele: `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
