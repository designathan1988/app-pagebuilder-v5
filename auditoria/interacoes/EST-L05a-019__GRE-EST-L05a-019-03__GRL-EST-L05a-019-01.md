# EST-L05a-019 × GRE-EST-L05a-019-03 → GRL-EST-L05a-019-01
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-03 (followPicker): ENT-L05a-0031, ENT-L05a-0059
- **Leitor:** GRL-EST-L05a-019-01 (followPicker): ENT-L05a-0059
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/shared.ts:25` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 a sessão do seletor aberta.** `src/editor/input/pointer/tools.ts:21` `      shared.session = store.gesture();` e `src/editor/input/pointer/tools.ts:22` `      shared.open = shared.session;` — a sessão abre quando o seletor de cor abre (ENT-L05a-0031).
- **V3 a sessão e o gesto largados, com o fim guardado.** `src/editor/input/pointer/tools.ts:33` `    shared.session = null;`, `src/editor/input/pointer/tools.ts:34` `    shared.open = null;` e `src/editor/input/pointer/tools.ts:36` `    shared.pendingPickerEnd = () => {` — o fim do seletor guarda o commit ou o cancel para a microtarefa (ENT-L05a-0059).
- **Sem estado de recusa.** `src/editor/input/pointer/tools.ts:30` `    if (!ended && !escaped) return;` — sem o seletor fechado nem o Escape, a sessão continua e nada é largado.

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
