# EST-L05a-049 × GRE-EST-L05a-049-03 → GRL-EST-L05a-049-05
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-03 (startDrafts): ENT-L05a-0010
- **Leitor:** GRL-EST-L05a-049-05 (restoreFieldDraft): ENT-L05a-0101
## Estados deixados por A
- **Final — nulo, no começo da ligação:** `src/editor/persistence/drafts.ts:156` `  held = null;`
- **Final — o rascunho restaurado, aceito só com a revisão e a seleção conferindo:** `src/editor/persistence/drafts.ts:160` `  if (parsed.success && canWrite() && parsed.data.revision === revision() && JSON.stringify(parsed.data.selection) === JSON.stringify(owner.getState().selection)) held = parsed.data;`
- **Final — nulo de novo, quando o rascunho de canvas é recusado:** `src/editor/persistence/drafts.ts:181` `        persist(null);`
- **Intermediário — nulo antes de o rascunho restaurado ser aceito:** `src/editor/persistence/drafts.ts:156` `  held = null;`
- **Desmontagem — nenhum descarte:** a limpeza de `startDrafts` não toca `held` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `restoreFieldDraft` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`; com o rascunho de campo do campo, pede o quadro em `src/editor/persistence/drafts.ts:131` `  frame = requestAnimationFrame(apply);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
### C2 intermediário
- O leitor chega com o rascunho restaurado de campo e a restauração à espera; a condição em `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {` é falsa e ele segue para o quadro.
- Fecho: ok — `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
### C3 em curso
- O leitor corre no efeito de montagem do campo e é síncrono; nenhum escritor de `held` corre no meio dele.
- Fecho: n/a — nenhum escritor do item corre em paralelo com o efeito (`src/editor/persistence/drafts.ts:100` `export function restoreFieldDraft(field: Field, restored: () => void): () => void {`)
### C4 desmontagem
- Depois de o campo desmontar, a limpeza cancela o quadro em `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`; `held` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`
## Resultado
- O leitor põe o rascunho de campo no campo, no quadro seguinte, quando o rascunho é dele: `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
