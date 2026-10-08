# EST-L05a-019 × GRE-EST-L05a-019-02 → GRL-EST-L05a-019-03
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-02 (finishPickerSession): ENT-L05a-0059
- **Leitor:** GRL-EST-L05a-019-03 (onMove): ENT-P-view-0024, ENT-P-view-0025
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/shared.ts:25` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `pendingPickerEnd` de volta a nulo.** `src/editor/input/pointer/common.ts:377` `  shared.pendingPickerEnd = null;` — `finishPickerSession` retira o fim guardado antes de o correr; a leitura do valor retirado é `src/editor/input/pointer/common.ts:376` `  const finish = shared.pendingPickerEnd;`; é a escrita da ENT-L05a-0059.
- **Sem estado de recusa.** `src/editor/input/pointer/common.ts:378` `  finish?.();` — `finishPickerSession` corre o fim guardado se existir e escreve o item sempre do mesmo modo.

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
