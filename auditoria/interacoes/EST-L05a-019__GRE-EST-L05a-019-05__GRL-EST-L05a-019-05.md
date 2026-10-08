# EST-L05a-019 × GRE-EST-L05a-019-05 → GRL-EST-L05a-019-05
- **Estado:** EST-L05a-019
- **Escritor:** GRE-EST-L05a-019-05 (o ouvinte): ENT-L05a-0034, ENT-L05a-0035, ENT-L05a-0036, ENT-L05a-0037
- **Leitor:** GRL-EST-L05a-019-05 (shared.open): ENT-P-text-0001
## Estados deixados por A
- **V1 o objecto da criação.** `src/editor/input/pointer/common.ts:267` `    shared = { spaceDown: false, overStage: false, panning: null, panDispatch: null, open: null, session: null, sessionDispatch: null, pendingPickerEnd: null };` — a primeira chamada de `sharedOf` cria o estado com todos os campos vazios.
- **V2 `open` de volta a nulo.** `src/editor/input/pointer.ts:161` `      shared.open = null;` (a banda cancelada, ENT-L05a-0034), `src/editor/input/pointer.ts:170` `      shared.open = null;` (a guia cancelada, ENT-L05a-0035), `src/editor/input/pointer.ts:178` `      shared.open = null;` (a rotação cancelada, ENT-L05a-0036) e `src/editor/input/pointer.ts:187` `      shared.open = null;` (o redimensionamento cancelado, ENT-L05a-0037) — o ouvinte da store larga o gesto aberto quando o Escape o cancela.
- **Sem estado de recusa.** `src/editor/input/pointer.ts:150` `    if (shared.session !== null) return;` — com uma sessão de seletor aberta o ouvinte para e não escreve o item.

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
