# EST-L05a-034 × GRE-EST-L05a-034-06 → GRL-EST-L05a-034-14
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-06 (offer): ENT-L05a-0054
- **Leitor:** GRL-EST-L05a-034-14 (rest): ENT-L05a-0057
## Estados deixados por A
- **V-sem-oferta.** `src/editor/input/pointer/drag.ts:95` `ps.dragging.side = null;` — sem alvo nem porta, larga a oferta lateral.
- **V-oferta-desarmada.** `src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };` — a oferta nova entra desarmada, com a recusa que o envolvimento encontraria guardada.
- **V-da-permanência.** `src/editor/input/pointer/drag.ts:105` `ps.dwell = setTimeout(() => {` arma a permanência da oferta; `src/editor/input/pointer/drag.ts:92` `if (ps.dwell !== null) clearTimeout(ps.dwell);` desarma o temporizador anterior.
- **V-oferta-armada.** `src/editor/input/pointer/drag.ts:108` `ps.dragging.side = { ...ps.dragging.side, armed: true, pill: { x: ps.pointerAt.x + PILL_OFFSET[0], y: ps.pointerAt.y + PILL_OFFSET[1] } };` — a oferta confirmada fica armada, com a pílula desenhada no ponteiro.
- **Sem recusa.** A recusa entra como dado da oferta (`src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };`); nenhuma linha do grupo deixa de escrever por causa dela.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };`).
## Casos
### C1 final
- Lê a linha em repouso em `src/editor/input/pointer/drag.ts:179` `if (folded === ps.dragging.resting) return;`: se é a mesma de antes, nada rearma.
- Com linha dobrada nova, guarda-a (`src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;`) e arma a abertura (`src/editor/input/pointer/drag.ts:186` `ps.unfold = setTimeout(() => {`).
- ok — o leitor lê o repouso deixado e arma a abertura da linha.

### C2 intermediário
- n/a — `src/editor/input/pointer/drag.ts:179` `if (folded === ps.dragging.resting) return;` só compara a linha guardada.

### C3 em curso
- n/a — o rest corre a partir do over, fora da execução do escritor.

### C4 desmontagem
- O fim do gesto larga o arraste (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`) e para os temporizadores (`src/editor/input/pointer/effects.ts:166` `p.stopDragTimers();`).
- ok — sem arraste aberto o leitor para na primeira condição (`src/editor/input/pointer/drag.ts:177` `if (ps.dragging === null) return;`).

## Resultado
- O leitor desdobra a linha de Camadas em que o ponteiro repousa, correndo a porta no gesto aberto: `src/editor/input/pointer/drag.ts:189` `shared.open?.dispatch(dwell.command.id as CommandId, { ...dwell.door.args, target: folded } as never);`.
