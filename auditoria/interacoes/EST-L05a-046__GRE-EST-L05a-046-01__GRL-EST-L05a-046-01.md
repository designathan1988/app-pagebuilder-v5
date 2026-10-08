# EST-L05a-046 × GRE-EST-L05a-046-01 → GRL-EST-L05a-046-01
- **Estado:** EST-L05a-046
- **Escritor:** GRE-EST-L05a-046-01 (startDrafts): ENT-L05a-0010
- **Leitor:** GRL-EST-L05a-046-01 (saveFieldDraft): ENT-L10a-0011
## Estados deixados por A
- **Final — a store ligada, com o trabalho de rascunho ativo:** `src/editor/persistence/drafts.ts:153` `  store = owner;`
- **Repouso — nulo, antes da primeira ligação:** `src/editor/persistence/drafts.ts:36` `let store: EditorStore | null = null;`
- **Desmontagem — nulo de novo, na limpeza:** `src/editor/persistence/drafts.ts:198` `    store = null;`
- **Intermediário — nenhum:** a ligação é escrita uma vez, de forma síncrona, e não muda no meio de um gesto nem de uma sequência (`src/editor/persistence/drafts.ts:152` `export function startDrafts(owner: EditorStore, currentRevision: () => number, canWrite: () => boolean): () => void {`)
## Casos
### C1 final
- O leitor `saveFieldDraft` chega com o escritor terminado e lê o item na primeira linha de guarda: `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;`. Com a store ligada, a guarda não dispara, o leitor calcula a porta do campo em `src/editor/persistence/drafts.ts:89` `  const key = fieldKey(field);` e grava o rascunho em `src/editor/persistence/drafts.ts:96` `  persist({ ...context(), kind: 'field', key, shown: field.dataset.shown, value: field.value, range: fieldRange(field) });`.
- Fecho: ok — `src/editor/persistence/drafts.ts:96` `  persist({ ...context(), kind: 'field', key, shown: field.dataset.shown, value: field.value, range: fieldRange(field) });`
### C2 intermediário
- O item muda de nulo para a store e volta a nulo; não há estado intermediário que o escritor deixe, e o leitor só vê o valor corrente na sua guarda de `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;`.
- Fecho: n/a — o item não tem estado intermediário (`src/editor/persistence/drafts.ts:153` `  store = owner;`)
### C3 em curso
- O leitor corre na digitação do campo (`src/editor/input/drafts.ts:27` `  saveFieldDraft(field);`) e na mudança de seleção; cada chamada é síncrona e nenhum escritor de `store` corre em paralelo com ela (`src/editor/persistence/drafts.ts:152` `export function startDrafts(owner: EditorStore, currentRevision: () => number, canWrite: () => boolean): () => void {`).
- Fecho: n/a — `startDrafts` é síncrono e não corre sobre o leitor (`src/editor/persistence/drafts.ts:152` `export function startDrafts(owner: EditorStore, currentRevision: () => number, canWrite: () => boolean): () => void {`)
### C4 desmontagem
- Depois de o editor desmontar, a limpeza de `startDrafts` põe a store a nulo em `src/editor/persistence/drafts.ts:198` `    store = null;`; o leitor volta a passar a guarda e sai sem gravar em `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;`.
- Fecho: ok — `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;`
## Resultado
- O leitor grava o rascunho do campo quando a store está ligada e sai sem gravar quando ela é nula: `src/editor/persistence/drafts.ts:88` `  if (restoring || !store || !mayWrite()) return;`
