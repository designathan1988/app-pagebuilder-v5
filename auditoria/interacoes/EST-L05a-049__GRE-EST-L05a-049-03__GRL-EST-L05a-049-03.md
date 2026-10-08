# EST-L05a-049 × GRE-EST-L05a-049-03 → GRL-EST-L05a-049-03
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-03 (startDrafts): ENT-L05a-0010
- **Leitor:** GRL-EST-L05a-049-03 (hasPendingDraft): ENT-L05a-0096
## Estados deixados por A
- **Final — nulo, no começo da ligação:** `src/editor/persistence/drafts.ts:156` `  held = null;`
- **Final — o rascunho restaurado, aceito só com a revisão e a seleção conferindo:** `src/editor/persistence/drafts.ts:160` `  if (parsed.success && canWrite() && parsed.data.revision === revision() && JSON.stringify(parsed.data.selection) === JSON.stringify(owner.getState().selection)) held = parsed.data;`
- **Final — nulo de novo, quando o rascunho de canvas é recusado:** `src/editor/persistence/drafts.ts:181` `        persist(null);`
- **Intermediário — nulo antes de o rascunho restaurado ser aceito:** `src/editor/persistence/drafts.ts:156` `  held = null;`
- **Desmontagem — nenhum descarte:** a limpeza de `startDrafts` não toca `held` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `hasPendingDraft` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:62` `export const hasPendingDraft = (): boolean => held !== null && mayWrite();`, devolvendo verdadeiro com o rascunho restaurado em memória.
- Fecho: ok — `src/editor/persistence/drafts.ts:62` `export const hasPendingDraft = (): boolean => held !== null && mayWrite();`
### C2 intermediário
- Com o rascunho restaurado à espera de o campo o aplicar, o leitor devolve verdadeiro e o ouvinte da saída pede confirmação: `src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`.
- Fecho: ok — `src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`
### C3 em curso
- O leitor corre no ouvinte de `beforeunload` (`src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`); nenhum escritor de `held` corre no meio dessa chamada.
- Fecho: n/a — o ouvinte da saída é síncrono (`src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`)
### C4 desmontagem
- Depois de o autosave desmontar, o ouvinte `beforeunload` é removido em `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` e o leitor deixa de correr.
- Fecho: ok — `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);`
## Resultado
- O leitor devolve se há rascunho por gravar, e o ouvinte da saída pede confirmação por isso: `src/editor/persistence/drafts.ts:62` `export const hasPendingDraft = (): boolean => held !== null && mayWrite();`
