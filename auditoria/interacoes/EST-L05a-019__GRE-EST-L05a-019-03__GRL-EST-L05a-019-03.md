# EST-L05a-019 × GRE-EST-L05a-019-03 → GRL-EST-L05a-019-03
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-03 (followPicker): ENT-L05a-0031, ENT-L05a-0059
- **Leitor:** GRL-EST-L05a-019-03 (onMove): ENT-P-view-0024, ENT-P-view-0025
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 a sessão do seletor aberta.** `src/editor/input/pointer/tools.ts:21` `      shared.session = store.gesture();` e `src/editor/input/pointer/tools.ts:22` `      shared.open = shared.session;` — a sessão abre quando o seletor de cor abre (ENT-L05a-0031).
- **V3 a sessão e o gesto largados, com o fim guardado.** `src/editor/input/pointer/tools.ts:33` `    shared.session = null;`, `src/editor/input/pointer/tools.ts:34` `    shared.open = null;` e `src/editor/input/pointer/tools.ts:36` `    shared.pendingPickerEnd = () => {` — o fim do seletor guarda o commit ou o cancel para a microtarefa (ENT-L05a-0059).
- **Sem estado de recusa.** `src/editor/input/pointer/tools.ts:30` `    if (!ended && !escaped) return;` — sem o seletor fechado nem o Escape, a sessão continua e nada é largado.

## Casos
### C1 final
- Chega depois de o escritor ter escrito o item e lê-o em `src/editor/input/pointer/events.ts:391` `      p.dispatchPan(shared.panning.entry, { dx, dy });`: o pan em curso guardado em `src/editor/input/pointer/events.ts:210` `      shared.panning = { pointer: event.pointerId, last: { x: event.clientX, y: event.clientY }, moved: { x: 0, y: 0 }, entry: panEntry };`.
- ok — o leitor lê o pan em curso e despacha a pan.
### C2 intermediário
- A meio do arraste o item guarda o pan em curso: `src/editor/input/pointer/events.ts:210` `      shared.panning = { pointer: event.pointerId, last: { x: event.clientX, y: event.clientY }, moved: { x: 0, y: 0 }, entry: panEntry };`.
- O leitor lê `src/editor/input/pointer/events.ts:391` `      p.dispatchPan(shared.panning.entry, { dx, dy });` e despacha o deslocamento a cada movimento.
- ok — o leitor lê o pan de meio de arraste.
### C3 em curso
- A leitura em `src/editor/input/pointer/events.ts:391` `      p.dispatchPan(shared.panning.entry, { dx, dy });` corre em `onMove` enquanto o escritor escreve o item; a leitura é de um objecto inteiro.
- ok — a leitura em curso vê o objecto inteiro.
### C4 desmontagem
- A desmontagem do dono do ponteiro larga o pan em `src/editor/input/pointer.ts:224` `    shared.panning = null;` e remove o ouvinte de `pointermove`; sem pan o leitor para em `src/editor/input/pointer/events.ts:383` `    if (shared.panning !== null) {`.
- ok — depois de desmontado o dono, o leitor não despacha a pan.

## Resultado
- O leitor lê o pan em curso e despacha a pan a cada movimento: `src/editor/input/pointer/events.ts:391` `      p.dispatchPan(shared.panning.entry, { dx, dy });`.
