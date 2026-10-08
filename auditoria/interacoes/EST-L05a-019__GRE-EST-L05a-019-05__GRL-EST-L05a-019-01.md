# EST-L05a-019 × GRE-EST-L05a-019-05 → GRL-EST-L05a-019-01
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-05 (o ouvinte): ENT-L05a-0034, ENT-L05a-0035, ENT-L05a-0036, ENT-L05a-0037
- **Leitor:** GRL-EST-L05a-019-01 (followPicker): ENT-L05a-0059
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/shared.ts:25` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` de volta a nulo.** `src/editor/input/pointer.ts:161` `      shared.open = null;` (a banda cancelada, ENT-L05a-0034), `src/editor/input/pointer.ts:170` `      shared.open = null;` (a guia cancelada, ENT-L05a-0035), `src/editor/input/pointer.ts:178` `      shared.open = null;` (a rotação cancelada, ENT-L05a-0036) e `src/editor/input/pointer.ts:187` `      shared.open = null;` (o redimensionamento cancelado, ENT-L05a-0037) — o ouvinte da store larga o gesto aberto quando o Escape o cancela.
- **Sem estado de recusa.** `src/editor/input/pointer.ts:150` `    if (shared.session !== null) return;` — com uma sessão de seletor aberta o ouvinte para e não escreve o item.

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
