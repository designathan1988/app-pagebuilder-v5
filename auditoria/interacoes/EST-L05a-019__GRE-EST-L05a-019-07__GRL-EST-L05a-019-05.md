# EST-L05a-019 × GRE-EST-L05a-019-07 → GRL-EST-L05a-019-05
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-07 (resize): ENT-P-view-0103
- **Leitor:** GRL-EST-L05a-019-05 (shared.open): ENT-P-text-0001
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` com o gesto novo do splitter.** `src/editor/input/pointer/resize.ts:23` `    shared.open = store.gesture();` — `resize` cancela o gesto anterior em `src/editor/input/pointer/resize.ts:22` `    shared.open?.cancel();` e abre um novo a cada movimento (ENT-P-view-0103).
- **Sem estado de recusa.** `src/editor/input/pointer/resize.ts:18` `    if (ps.splitting === null) return;` — sem um splitter em arraste, `resize` não escreve o item.

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
