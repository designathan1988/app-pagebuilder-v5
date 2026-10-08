# EST-L05a-019 × GRE-EST-L05a-019-03 → GRL-EST-L05a-019-05
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-03 (followPicker): ENT-L05a-0031, ENT-L05a-0059
- **Leitor:** GRL-EST-L05a-019-05 (shared.open): ENT-P-text-0001
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 a sessão do seletor aberta.** `src/editor/input/pointer/tools.ts:21` `      shared.session = store.gesture();` e `src/editor/input/pointer/tools.ts:22` `      shared.open = shared.session;` — a sessão abre quando o seletor de cor abre (ENT-L05a-0031).
- **V3 a sessão e o gesto largados, com o fim guardado.** `src/editor/input/pointer/tools.ts:33` `    shared.session = null;`, `src/editor/input/pointer/tools.ts:34` `    shared.open = null;` e `src/editor/input/pointer/tools.ts:36` `    shared.pendingPickerEnd = () => {` — o fim do seletor guarda o commit ou o cancel para a microtarefa (ENT-L05a-0059).
- **Sem estado de recusa.** `src/editor/input/pointer/tools.ts:30` `    if (!ended && !escaped) return;` — sem o seletor fechado nem o Escape, a sessão continua e nada é largado.

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
