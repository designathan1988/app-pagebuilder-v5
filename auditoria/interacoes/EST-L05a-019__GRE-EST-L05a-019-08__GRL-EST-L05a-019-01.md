# EST-L05a-019 × GRE-EST-L05a-019-08 → GRL-EST-L05a-019-01
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-08 (store.gesture): ENT-P-capture-0005, ENT-P-selection-0001, ENT-P-selection-0009, ENT-P-selection-0012, ENT-P-selection-0014, ENT-P-selection-0024, ENT-P-selection-0025, ENT-P-selection-0026, ENT-P-workspace-0059, ENT-P-workspace-0060, ENT-P-workspace-0061, ENT-P-workspace-0063, ENT-P-workspace-0096
- **Leitor:** GRL-EST-L05a-019-01 (followPicker): ENT-L05a-0059
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` com o gesto aberto pela pressão.** `src/editor/input/pointer/effects.ts:41` `      shared.open = store.gesture();` — o efeito de pressão do ponteiro (ENT-P-capture-0005, ENT-P-selection-0001 e os demais membros); `src/editor/input/pointer/drag.ts:34` `    shared.open = store.gesture();` — cada desenho da faixa (ENT-P-selection-0024, ENT-P-selection-0025); `src/editor/input/pointer/panels.ts:53` `    shared.open = store.gesture();` — cada passo do arraste de um painel (ENT-P-workspace-0063).
- **Sem estado de recusa.** `src/editor/input/pointer/drag.ts:29` `    if (ps.marquee === null || ps.pressedAt === null || ps.pressedAt.page === null) return;` — sem a faixa em curso, o caminho não abre gesto.

## Casos
### C1 final
- O leitor é a `followPicker`, inscrita na store em `src/editor/input/pointer.ts:148` `  const stopPicker = store.subscribe(p.followPicker);`.
- Chega depois de o escritor ter escrito o item e lê-o em `src/editor/input/pointer/tools.ts:20` `    if (ui.colorPicker !== null && shared.session === null && shared.open === null) {` e em `src/editor/input/pointer/tools.ts:27` `    if (shared.session === null) return;`: com a sessão nula e um gesto aberto a primeira condição é falsa e o caminho para na segunda.
- ok — o leitor lê o estado deixado e decide se abre ou fecha a sessão do seletor.
### C2 intermediário
- A meio da sessão do seletor o item guarda a sessão aberta: `src/editor/input/pointer/tools.ts:21` `      shared.session = store.gesture();`.
- O leitor lê `src/editor/input/pointer/tools.ts:27` `    if (shared.session === null) return;`: a condição é falsa e o caminho segue para comparar os contadores do seletor.
- ok — o leitor lê a sessão de meio de gesto.
### C3 em curso
- A leitura em `src/editor/input/pointer/tools.ts:27` `    if (shared.session === null) return;` corre no ouvinte da store (`src/editor/input/pointer.ts:148` `  const stopPicker = store.subscribe(p.followPicker);`) enquanto o escritor escreve os campos em `src/editor/input/pointer/tools.ts:21` `      shared.session = store.gesture();`; a leitura é de um valor inteiro.
- ok — a leitura em curso vê o valor inteiro.
### C4 desmontagem
- A desmontagem do dono do ponteiro remove a inscrição em `src/editor/input/pointer.ts:217` `    stopPicker();`, e os campos são largados em `src/editor/input/pointer.ts:224` `    shared.panning = null;`.
- O leitor deixa de correr com a inscrição removida.
- ok — depois de desmontado o dono, o leitor não corre.

## Resultado
- O leitor lê a sessão e o gesto abertos e decide se abre ou fecha a sessão do seletor: `src/editor/input/pointer/tools.ts:27` `    if (shared.session === null) return;`.
