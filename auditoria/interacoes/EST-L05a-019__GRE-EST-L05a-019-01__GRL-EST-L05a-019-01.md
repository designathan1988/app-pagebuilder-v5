# EST-L05a-019 × GRE-EST-L05a-019-01 → GRL-EST-L05a-019-01
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-01 (dropTool): ENT-L05a-0033
- **Leitor:** GRL-EST-L05a-019-01 (followPicker): ENT-L05a-0059
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` de volta a nulo.** `src/editor/input/pointer/tools.ts:14` `    if (shared.open === gesture) shared.open = null;` — `dropTool` larga o gesto aberto da ferramenta quando era o dela e cancela a sessão logo a seguir (`src/editor/input/pointer/tools.ts:15` `    session.cancel();`); é a escrita da ENT-L05a-0033.
- **Sem estado de recusa.** `src/editor/input/pointer/tools.ts:11` `    if (ps.tooling === null) return;` — sem ferramenta a segurar a sessão, `dropTool` não escreve o item.

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
