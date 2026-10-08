# EST-L05a-049 × GRE-EST-L05a-049-02 → GRL-EST-L05a-049-03
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-02 (persist): ENT-L10a-0011
- **Leitor:** GRL-EST-L05a-049-03 (hasPendingDraft): ENT-L05a-0096
## Estados deixados por A
- **Final — o rascunho de campo:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o rascunho montado por `src/editor/persistence/drafts.ts:96` `  persist({ ...context(), kind: 'field', key, shown: field.dataset.shown, value: field.value, range: fieldRange(field) });`
- **Final — o rascunho de canvas:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o rascunho montado por `src/editor/persistence/drafts.ts:144` `  persist({ ...context(), kind: 'canvas', node, runs: [...runs], range });`
- **Final — nulo, quando o rascunho se resolve:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o valor nulo de `src/editor/persistence/drafts.ts:92` `    if (held?.kind === 'field' && held.key === key) persist(null);`
- **Intermediário — a restauração à espera desfeita antes de gravar:** `src/editor/persistence/drafts.ts:95` `  pending = false;`
- **Desmontagem — nenhum descarte:** a limpeza de `startDrafts` não toca `held` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `hasPendingDraft` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:62` `export const hasPendingDraft = (): boolean => held !== null && mayWrite();`, devolvendo verdadeiro com um rascunho em memória.
- Fecho: ok — `src/editor/persistence/drafts.ts:62` `export const hasPendingDraft = (): boolean => held !== null && mayWrite();`
### C2 intermediário
- Com o rascunho de campo escrito e ainda não resolvido, o leitor devolve verdadeiro e o ouvinte da saída pede confirmação: `src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`.
- Fecho: ok — `src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`
### C3 em curso
- O leitor corre no ouvinte de `beforeunload` (`src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`); nenhum escritor de `held` corre no meio dessa chamada.
- Fecho: n/a — o ouvinte da saída é síncrono (`src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`)
### C4 desmontagem
- Depois de o autosave desmontar, o ouvinte `beforeunload` é removido em `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` e o leitor deixa de correr.
- Fecho: ok — `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);`
## Resultado
- O leitor devolve se há rascunho por gravar, e o ouvinte da saída pede confirmação por isso: `src/editor/persistence/drafts.ts:62` `export const hasPendingDraft = (): boolean => held !== null && mayWrite();`
