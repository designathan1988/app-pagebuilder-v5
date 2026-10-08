# EST-L05a-019 × GRE-EST-L05a-019-08 → GRL-EST-L05a-019-02
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-08 (store.gesture): ENT-P-capture-0005, ENT-P-selection-0001, ENT-P-selection-0009, ENT-P-selection-0012, ENT-P-selection-0014, ENT-P-selection-0024, ENT-P-selection-0025, ENT-P-selection-0026, ENT-P-workspace-0059, ENT-P-workspace-0060, ENT-P-workspace-0061, ENT-P-workspace-0063, ENT-P-workspace-0096
- **Leitor:** GRL-EST-L05a-019-02 (o ouvinte): ENT-L05a-0032, ENT-L05a-0038
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` com o gesto aberto pela pressão.** `src/editor/input/pointer/effects.ts:41` `      shared.open = store.gesture();` — o efeito de pressão do ponteiro (ENT-P-capture-0005, ENT-P-selection-0001 e os demais membros); `src/editor/input/pointer/drag.ts:34` `    shared.open = store.gesture();` — cada desenho da faixa (ENT-P-selection-0024, ENT-P-selection-0025); `src/editor/input/pointer/panels.ts:53` `    shared.open = store.gesture();` — cada passo do arraste de um painel (ENT-P-workspace-0063).
- **Sem estado de recusa.** `src/editor/input/pointer/drag.ts:29` `    if (ps.marquee === null || ps.pressedAt === null || ps.pressedAt.page === null) return;` — sem a faixa em curso, o caminho não abre gesto.

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
