# EST-L05a-051 × GRE-EST-L05a-051-02 → GRL-EST-L05a-051-02
- **Estado:** EST-L05a-051
- **Escritor:** GRE-EST-L05a-051-02 (startDrafts): ENT-L05a-0010
- **Leitor:** GRL-EST-L05a-051-02 (restoreFieldDraft): ENT-L05a-0101
## Estados deixados por A
- **Final — falso, no começo da ligação:** `src/editor/persistence/drafts.ts:157` `  pending = false;`
- **Final — verdadeiro, com rascunho restaurado:** `src/editor/persistence/drafts.ts:163` `    pending = true;`
- **Final — falso de novo, quando o rascunho de canvas é recusado:** `src/editor/persistence/drafts.ts:180` `        pending = false;`
- **Intermediário — falso antes de o rascunho restaurado ser aceito:** `src/editor/persistence/drafts.ts:157` `  pending = false;`
- **Desmontagem — não é reposto:** a limpeza de `startDrafts` não toca `pending` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `restoreFieldDraft` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`; com a restauração à espera (verdadeira) e o rascunho de campo do campo, pede o quadro em `src/editor/persistence/drafts.ts:131` `  frame = requestAnimationFrame(apply);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
### C2 intermediário
- O leitor chega com a restauração à espera (verdadeira), o estado entre o rascunho restaurado e a sua aplicação; a condição em `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {` é falsa e ele segue para o quadro.
- Fecho: ok — `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
### C3 em curso
- O leitor corre no efeito de montagem do campo; `startDrafts` é uma ligação síncrona e não corre sobre a leitura.
- Fecho: n/a — nenhum escritor de `pending` corre no meio do efeito (`src/editor/persistence/drafts.ts:100` `export function restoreFieldDraft(field: Field, restored: () => void): () => void {`)
### C4 desmontagem
- Depois de o campo desmontar, a limpeza cancela o quadro em `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`; `pending` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`
## Resultado
- O leitor só põe o rascunho no campo quando há uma restauração à espera: `src/editor/persistence/drafts.ts:102` `  if (!pending || held?.kind !== 'field' || held.key !== key) {`
