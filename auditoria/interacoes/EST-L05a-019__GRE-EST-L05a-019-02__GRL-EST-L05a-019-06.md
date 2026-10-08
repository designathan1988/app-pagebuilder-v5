# EST-L05a-019 × GRE-EST-L05a-019-02 → GRL-EST-L05a-019-06
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-02 (finishPickerSession): ENT-L05a-0059
- **Leitor:** GRL-EST-L05a-019-06 (sharedOf): ENT-L05a-0060, ENT-P-project-0023
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/shared.ts:25` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `pendingPickerEnd` de volta a nulo.** `src/editor/input/pointer/common.ts:377` `  shared.pendingPickerEnd = null;` — `finishPickerSession` retira o fim guardado antes de o correr; a leitura do valor retirado é `src/editor/input/pointer/common.ts:376` `  const finish = shared.pendingPickerEnd;`; é a escrita da ENT-L05a-0059.
- **Sem estado de recusa.** `src/editor/input/pointer/common.ts:378` `  finish?.();` — `finishPickerSession` corre o fim guardado se existir e escreve o item sempre do mesmo modo.

## Casos
### C1 final
- Chega depois de o escritor ter criado o item e lê-o em `src/editor/input/pointer/shared.ts:23` `  let shared = SHARED.get(store);`: encontra o objecto guardado em `src/editor/input/pointer/shared.ts:26` `    SHARED.set(store, shared);`.
- ok — o leitor devolve o mesmo estado partilhado da store.
### C2 intermediário
- A meio de um gesto o objecto guarda os campos do gesto aberto; o leitor lê-o em `src/editor/input/pointer/shared.ts:23` `  let shared = SHARED.get(store);` e devolve o objecto com os campos a meio do gesto.
- ok — o leitor devolve o estado a meio do gesto.
### C3 em curso
- A leitura em `src/editor/input/pointer/shared.ts:23` `  let shared = SHARED.get(store);` devolve sempre o objecto inteiro; o escritor troca campos dele, nunca o objecto — `src/editor/input/pointer/shared.ts:26` `    SHARED.set(store, shared);` só corre na criação.
- ok — a leitura em curso devolve o objecto inteiro.
### C4 desmontagem
- n/a — o item é uma `WeakMap` sem remoção explícita (`src/editor/input/pointer/shared.ts:21` `const SHARED = new WeakMap<EditorStore, PointerShared>();`); a entrada cai quando a store deixa de ser referenciada.

## Resultado
- O leitor devolve o estado partilhado da store: `src/editor/input/pointer/shared.ts:23` `  let shared = SHARED.get(store);`.
