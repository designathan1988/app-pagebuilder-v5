# EST-L05a-019 × GRE-EST-L05a-019-08 → GRL-EST-L05a-019-06
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-08 (store.gesture): ENT-P-capture-0005, ENT-P-selection-0001, ENT-P-selection-0009, ENT-P-selection-0012, ENT-P-selection-0014, ENT-P-selection-0024, ENT-P-selection-0025, ENT-P-selection-0026, ENT-P-workspace-0059, ENT-P-workspace-0060, ENT-P-workspace-0061, ENT-P-workspace-0063, ENT-P-workspace-0096
- **Leitor:** GRL-EST-L05a-019-06 (sharedOf): ENT-L05a-0060, ENT-P-project-0023
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/shared.ts:25` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` com o gesto aberto pela pressão.** `src/editor/input/pointer/effects.ts:41` `      shared.open = store.gesture();` — o efeito de pressão do ponteiro (ENT-P-capture-0005, ENT-P-selection-0001 e os demais membros); `src/editor/input/pointer/drag.ts:34` `    shared.open = store.gesture();` — cada desenho da faixa (ENT-P-selection-0024, ENT-P-selection-0025); `src/editor/input/pointer/panels.ts:53` `    shared.open = store.gesture();` — cada passo do arraste de um painel (ENT-P-workspace-0063).
- **Sem estado de recusa.** `src/editor/input/pointer/drag.ts:29` `    if (ps.marquee === null || ps.pressedAt === null || ps.pressedAt.page === null) return;` — sem a faixa em curso, o caminho não abre gesto.

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
