# EST-L05a-049 × GRE-EST-L05a-049-01 → GRL-EST-L05a-049-03
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-01 (o ouvinte): ENT-L05a-0102
- **Leitor:** GRL-EST-L05a-049-03 (hasPendingDraft): ENT-L05a-0096
## Estados deixados por A
- **Final — o rascunho descartado (nulo), quando o documento, a seleção, o texto editado ou o painel rápido mudam:** `src/editor/persistence/drafts.ts:190` `      persist(null);`
- **Intermediário — a restauração à espera desfeita antes do descarte:** `src/editor/persistence/drafts.ts:189` `      pending = false;`
- **Desmontagem — a assinatura removida; o rascunho em memória fica como estava:** `src/editor/persistence/drafts.ts:196` `    stop();`
## Casos
### C1 final
- O leitor `hasPendingDraft` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:62` `export const hasPendingDraft = (): boolean => held !== null && mayWrite();`, devolvendo verdadeiro com um rascunho em memória.
- Fecho: ok — `src/editor/persistence/drafts.ts:62` `export const hasPendingDraft = (): boolean => held !== null && mayWrite();`
### C2 intermediário
- Com o rascunho mantido por uma mudança que não o alvo, o leitor devolve verdadeiro e o ouvinte da saída pede confirmação: `src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`.
- Fecho: ok — `src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`
### C3 em curso
- O leitor corre no ouvinte de `beforeunload` (`src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`); nenhum escritor de `held` corre no meio dessa chamada.
- Fecho: n/a — o ouvinte da saída é síncrono (`src/editor/persistence/autosave.ts:341` `    const draft = hasPendingDraft();`)
### C4 desmontagem
- Depois de o autosave desmontar, o ouvinte `beforeunload` é removido em `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` e o leitor deixa de correr.
- Fecho: ok — `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);`
## Resultado
- O leitor devolve se há rascunho por gravar, e o ouvinte da saída pede confirmação por isso: `src/editor/persistence/drafts.ts:62` `export const hasPendingDraft = (): boolean => held !== null && mayWrite();`
