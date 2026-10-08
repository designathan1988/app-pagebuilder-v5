# EST-L05a-049 × GRE-EST-L05a-049-02 → GRL-EST-L05a-049-05
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-02 (persist): ENT-L10a-0011
- **Leitor:** GRL-EST-L05a-049-05 (restoreFieldDraft): ENT-L05a-0101
## Estados deixados por A
- **Final — o rascunho de campo:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o rascunho montado por `src/editor/persistence/drafts.ts:96` `  persist({ ...context(), kind: 'field', key, shown: field.dataset.shown, value: field.value, range: fieldRange(field) });`
- **Final — o rascunho de canvas:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o rascunho montado por `src/editor/persistence/drafts.ts:144` `  persist({ ...context(), kind: 'canvas', node, runs: [...runs], range });`
- **Final — nulo, quando o rascunho se resolve:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o valor nulo de `src/editor/persistence/drafts.ts:92` `    if (held?.kind === 'field' && held.key === key) persist(null);`
- **Intermediário — a restauração à espera desfeita antes de gravar:** `src/editor/persistence/drafts.ts:95` `  pending = false;`
- **Desmontagem — nenhum descarte:** a limpeza de `startDrafts` não toca `held` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `restoreFieldDraft` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`; com o rascunho de campo do campo, pede o quadro em `src/editor/persistence/drafts.ts:131` `  frame = requestAnimationFrame(apply);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
### C2 intermediário
- O leitor chega com o rascunho de campo do campo e a restauração à espera; a condição em `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {` é falsa e ele segue para o quadro.
- Fecho: ok — `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
### C3 em curso
- O leitor corre no efeito de montagem do campo e é síncrono; nenhum escritor de `held` corre no meio dele.
- Fecho: n/a — nenhum escritor do item corre em paralelo com o efeito (`src/editor/persistence/drafts.ts:100` `export function restoreFieldDraft(field: Field, restored: () => void): () => void {`)
### C4 desmontagem
- Depois de o campo desmontar, a limpeza cancela o quadro em `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`; `held` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`
## Resultado
- O leitor põe o rascunho de campo no campo, no quadro seguinte, quando o rascunho é dele: `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
