# EST-L05a-019 × GRE-EST-L05a-019-08 → GRL-EST-L05a-019-03
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-08 (store.gesture): ENT-P-capture-0005, ENT-P-selection-0001, ENT-P-selection-0009, ENT-P-selection-0012, ENT-P-selection-0014, ENT-P-selection-0024, ENT-P-selection-0025, ENT-P-selection-0026, ENT-P-workspace-0059, ENT-P-workspace-0060, ENT-P-workspace-0061, ENT-P-workspace-0063, ENT-P-workspace-0096
- **Leitor:** GRL-EST-L05a-019-03 (onMove): ENT-P-view-0024, ENT-P-view-0025
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/shared.ts:25` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` com o gesto aberto pela pressão.** `src/editor/input/pointer/effects.ts:41` `      shared.open = store.gesture();` — o efeito de pressão do ponteiro (ENT-P-capture-0005, ENT-P-selection-0001 e os demais membros); `src/editor/input/pointer/drag.ts:34` `    shared.open = store.gesture();` — cada desenho da faixa (ENT-P-selection-0024, ENT-P-selection-0025); `src/editor/input/pointer/panels.ts:53` `    shared.open = store.gesture();` — cada passo do arraste de um painel (ENT-P-workspace-0063).
- **Sem estado de recusa.** `src/editor/input/pointer/drag.ts:29` `    if (ps.marquee === null || ps.pressedAt === null || ps.pressedAt.page === null) return;` — sem a faixa em curso, o caminho não abre gesto.

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
