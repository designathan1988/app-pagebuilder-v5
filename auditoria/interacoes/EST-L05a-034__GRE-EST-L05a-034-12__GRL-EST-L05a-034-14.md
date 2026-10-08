# EST-L05a-034 × GRE-EST-L05a-034-12 → GRL-EST-L05a-034-14
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-12 (onUp): ENT-L05a-0043
- **Leitor:** GRL-EST-L05a-034-14 (rest): ENT-L05a-0057
## Estados deixados por A
- **V-sem-captura.** `src/editor/input/pointer/events.ts:434` `if (event.pointerId === ps.captured) ps.captured = null;` — larga o ponteiro capturado quando era o da libertação.
- **V-com-a-tecla.** `src/editor/input/pointer/events.ts:436` `ps.releaseModifier = modifierOf(event);` — guarda a tecla presa na libertação.
- **V-com-a-máquina.** `src/editor/input/pointer/events.ts:540` `ps.machine = next.machine;` — grava a máquina já confirmada.
- **Sem recusa.** O caminho entrega o commit ao gesto; a recusa de um comando não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:540` `ps.machine = next.machine;`).
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
