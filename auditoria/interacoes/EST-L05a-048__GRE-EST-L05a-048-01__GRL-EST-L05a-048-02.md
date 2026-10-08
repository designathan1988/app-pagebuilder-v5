# EST-L05a-048 × GRE-EST-L05a-048-01 → GRL-EST-L05a-048-02
- **Estado:** EST-L05a-048
- **Escritor:** GRE-EST-L05a-048-01 (startDrafts): ENT-L05a-0010
- **Leitor:** GRL-EST-L05a-048-02 (saveFieldDraft): ENT-L10a-0011
## Estados deixados por A
- **Final — a função de escrita desta aba (a trava de edição):** `src/editor/persistence/drafts.ts:155` `  mayWrite = canWrite;`
- **Repouso — a função que devolve falso, antes da ligação:** `src/editor/persistence/drafts.ts:38` `let mayWrite = () => false;`
- **Intermediário — nenhum:** a ligação é escrita uma vez; o valor que a função devolve só muda com o papel da aba, por outro caminho (`src/editor/persistence/drafts.ts:152` `export function startDrafts(owner: EditorStore, currentRevision: () => number, canWrite: () => boolean): () => void {`)
- **Desmontagem — não é reposta:** a limpeza de `startDrafts` não toca `mayWrite` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `saveFieldDraft` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;`. Com a função de escrita a permitir, segue e grava o rascunho em `src/editor/persistence/drafts.ts:96` `  persist({ ...context(), kind: 'field', key, shown: field.dataset.shown, value: field.value, range: fieldRange(field) });`.
- Fecho: ok — `src/editor/persistence/drafts.ts:96` `  persist({ ...context(), kind: 'field', key, shown: field.dataset.shown, value: field.value, range: fieldRange(field) });`
### C2 intermediário
- O item é escrito uma vez, na ligação; não há estado intermediário que o escritor deixe, e o leitor só vê o valor corrente na guarda de `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;`.
- Fecho: n/a — o item não tem estado intermediário (`src/editor/persistence/drafts.ts:155` `  mayWrite = canWrite;`)
### C3 em curso
- O leitor corre na digitação do campo (`src/editor/input/drafts.ts:27` `  saveFieldDraft(field);`) e na mudança de seleção; cada chamada é síncrona e nenhum escritor de `mayWrite` corre em paralelo com ela.
- Fecho: n/a — o escritor é a ligação do arranque, síncrona (`src/editor/persistence/drafts.ts:155` `  mayWrite = canWrite;`)
### C4 desmontagem
- Depois de o editor desmontar, a limpeza de `startDrafts` não repõe `mayWrite` (`src/editor/persistence/drafts.ts:195` `  return () => {`); o leitor continua a ler o último valor ligado, mas sai antes de gravar por `store` nulo, em `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;`.
- Fecho: ok — `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;`
## Resultado
- O leitor grava o rascunho quando a função de escrita desta aba permite e sai sem gravar quando não: `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;`
