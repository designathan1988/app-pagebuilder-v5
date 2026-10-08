# EST-L05a-019 × GRE-EST-L05a-019-04 → GRL-EST-L05a-019-06
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-04 (holdSpace): ENT-L05a-0029, ENT-L05a-0030
- **Leitor:** GRL-EST-L05a-019-06 (sharedOf): ENT-L05a-0060, ENT-P-project-0023
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `spaceDown` verdadeiro, com o pan armado.** `src/editor/input/pointer/common.ts:282` `  shared.spaceDown = true;` — Space segurado sobre o palco (ENT-L05a-0029); a leitura que decide é `src/editor/input/pointer/common.ts:281` `  if (!shared.overStage && shared.panning === null) return false;`.
- **V1 de novo, com o pan desarmado.** `src/editor/input/pointer/common.ts:277` `    shared.spaceDown = false;` — Space largado desarma o pan (ENT-L05a-0030).
- **Sem estado de recusa.** `src/editor/input/pointer/common.ts:281` `  if (!shared.overStage && shared.panning === null) return false;` — fora do palco e sem pan, `holdSpace` não liga o Space.

## Casos
### C1 final
- Chega depois de o escritor ter criado o item e lê-o em `src/editor/input/pointer/common.ts:265` `  let shared = SHARED.get(store);`: encontra o objecto guardado em `src/editor/input/pointer/common.ts:268` `    SHARED.set(store, shared);`.
- ok — o leitor devolve o mesmo estado partilhado da store.
### C2 intermediário
- A meio de um gesto o objecto guarda os campos do gesto aberto; o leitor lê-o em `src/editor/input/pointer/common.ts:265` `  let shared = SHARED.get(store);` e devolve o objecto com os campos a meio do gesto.
- ok — o leitor devolve o estado a meio do gesto.
### C3 em curso
- A leitura em `src/editor/input/pointer/common.ts:265` `  let shared = SHARED.get(store);` devolve sempre o objecto inteiro; o escritor troca campos dele, nunca o objecto — `src/editor/input/pointer/common.ts:268` `    SHARED.set(store, shared);` só corre na criação.
- ok — a leitura em curso devolve o objecto inteiro.
### C4 desmontagem
- n/a — o item é uma `WeakMap` sem remoção explícita (`src/editor/input/pointer/common.ts:263` `const SHARED = new WeakMap<EditorStore, PointerShared>();`); a entrada cai quando a store deixa de ser referenciada.

## Resultado
- O leitor devolve o estado partilhado da store: `src/editor/input/pointer/common.ts:265` `  let shared = SHARED.get(store);`.
