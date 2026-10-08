# EST-L05a-019 × GRE-EST-L05a-019-03 → GRL-EST-L05a-019-02
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-03 (followPicker): ENT-L05a-0031, ENT-L05a-0059
- **Leitor:** GRL-EST-L05a-019-02 (o ouvinte): ENT-L05a-0032, ENT-L05a-0038
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/shared.ts:25` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 a sessão do seletor aberta.** `src/editor/input/pointer/tools.ts:21` `      shared.session = store.gesture();` e `src/editor/input/pointer/tools.ts:22` `      shared.open = shared.session;` — a sessão abre quando o seletor de cor abre (ENT-L05a-0031).
- **V3 a sessão e o gesto largados, com o fim guardado.** `src/editor/input/pointer/tools.ts:33` `    shared.session = null;`, `src/editor/input/pointer/tools.ts:34` `    shared.open = null;` e `src/editor/input/pointer/tools.ts:36` `    shared.pendingPickerEnd = () => {` — o fim do seletor guarda o commit ou o cancel para a microtarefa (ENT-L05a-0059).
- **Sem estado de recusa.** `src/editor/input/pointer/tools.ts:30` `    if (!ended && !escaped) return;` — sem o seletor fechado nem o Escape, a sessão continua e nada é largado.

## Casos
### C1 final
- O leitor é o ouvinte da store inscrito em `src/editor/input/pointer.ts:149` `  const stopListening = store.subscribe(() => {`.
- Chega depois de o escritor ter escrito o item e lê-o em `src/editor/input/pointer.ts:150` `    if (shared.session !== null) return;` e em `src/editor/input/pointer.ts:191` `    if (shared.open === null) return;`: sem sessão e com um gesto aberto o caminho segue para `src/editor/input/pointer.ts:196` `    const cancelled = shared.open;`.
- ok — o leitor lê o gesto aberto e larga-o quando o Escape o cancela.
### C2 intermediário
- A meio de um gesto o item guarda o gesto aberto: `src/editor/input/pointer/events.ts:245` `        shared.open = gesture;`.
- O leitor lê `src/editor/input/pointer.ts:191` `    if (shared.open === null) return;`: a condição é falsa e ele segue até `src/editor/input/pointer.ts:196` `    const cancelled = shared.open;`.
- ok — o leitor lê o gesto de meio de gesto.
### C3 em curso
- A leitura em `src/editor/input/pointer.ts:191` `    if (shared.open === null) return;` corre no ouvinte da store enquanto o escritor larga o gesto em `src/editor/input/pointer.ts:161` `      shared.open = null;`; a leitura vê o valor inteiro.
- ok — a leitura em curso vê o valor inteiro.
### C4 desmontagem
- A desmontagem do dono do ponteiro remove a inscrição em `src/editor/input/pointer.ts:216` `    stopListening();`, e o item partilhado é largado (`src/editor/input/pointer.ts:224` `    shared.panning = null;`).
- O leitor deixa de correr com a inscrição removida.
- ok — depois de desmontado o dono, o leitor não corre.

## Resultado
- O leitor lê o gesto aberto e larga-o quando o Escape o cancela: `src/editor/input/pointer.ts:196` `    const cancelled = shared.open;`.
