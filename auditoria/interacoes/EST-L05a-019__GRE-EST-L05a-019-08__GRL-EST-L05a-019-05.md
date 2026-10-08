# EST-L05a-019 × GRE-EST-L05a-019-08 → GRL-EST-L05a-019-05
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-08 (store.gesture): ENT-P-capture-0005, ENT-P-selection-0001, ENT-P-selection-0009, ENT-P-selection-0012, ENT-P-selection-0014, ENT-P-selection-0024, ENT-P-selection-0025, ENT-P-selection-0026, ENT-P-workspace-0059, ENT-P-workspace-0060, ENT-P-workspace-0061, ENT-P-workspace-0063, ENT-P-workspace-0096
- **Leitor:** GRL-EST-L05a-019-05 (shared.open): ENT-P-text-0001
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/shared.ts:25` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` com o gesto aberto pela pressão.** `src/editor/input/pointer/effects.ts:41` `      shared.open = store.gesture();` — o efeito de pressão do ponteiro (ENT-P-capture-0005, ENT-P-selection-0001 e os demais membros); `src/editor/input/pointer/drag.ts:34` `    shared.open = store.gesture();` — cada desenho da faixa (ENT-P-selection-0024, ENT-P-selection-0025); `src/editor/input/pointer/panels.ts:53` `    shared.open = store.gesture();` — cada passo do arraste de um painel (ENT-P-workspace-0063).
- **Sem estado de recusa.** `src/editor/input/pointer/drag.ts:29` `    if (ps.marquee === null || ps.pressedAt === null || ps.pressedAt.page === null) return;` — sem a faixa em curso, o caminho não abre gesto.

## Casos
### C1 final
- Chega depois de o escritor ter escrito o item e lê-o em `src/editor/input/pointer/effects.ts:61` `      if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`: o gesto aberto em `src/editor/input/pointer/effects.ts:41` `      shared.open = store.gesture();`.
- ok — o leitor entrega a porta da pressão ao gesto aberto.
### C2 intermediário
- A meio da pressão o item guarda o gesto aberto: `src/editor/input/pointer/effects.ts:41` `      shared.open = store.gesture();`.
- O leitor lê `src/editor/input/pointer/effects.ts:61` `      if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` e despacha a porta da pressão dentro do gesto.
- ok — o leitor lê o gesto de meio de pressão.
### C3 em curso
- A leitura e a escrita correm no mesmo efeito `run`: o item é escrito em `src/editor/input/pointer/effects.ts:41` `      shared.open = store.gesture();` e lido em `src/editor/input/pointer/effects.ts:61` `      if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`; a leitura vê o gesto recém-aberto.
- ok — a leitura em curso vê o gesto recém-aberto.
### C4 desmontagem
- n/a — o leitor só corre dentro do efeito de pressão; sem uma pressão nova não há leitura do item, e o gesto é largado no fim do mesmo efeito em `src/editor/input/pointer/effects.ts:243` `closing?.commit();`.

## Resultado
- O leitor entrega a porta da pressão ao gesto aberto: `src/editor/input/pointer/effects.ts:61` `      if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`.
