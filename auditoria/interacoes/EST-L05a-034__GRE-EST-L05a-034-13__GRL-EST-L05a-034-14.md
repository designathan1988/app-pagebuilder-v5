# EST-L05a-034 × GRE-EST-L05a-034-13 → GRL-EST-L05a-034-14
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-13 (over): ENT-L05a-0058
- **Leitor:** GRL-EST-L05a-034-14 (rest): ENT-L05a-0057
## Estados deixados por A
- **V-intacto.** `src/editor/input/pointer/drag.ts:206` `if (ps.dragging === null) return;` — sem arraste aberto nada é escrito.
- **V-da-linha.** `src/editor/input/pointer/drag.ts:212` `ps.dragging.fromRow = row !== null;` — marca se a proposta veio de uma linha de Camadas.
- **V-da-proposta-tomada.** `src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;` e `src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;` — guardam a proposta e o ponto em que foi tomada.
- **V-do-quadro.** `src/editor/input/pointer/drag.ts:224` `if (ps.scrolling === 0) ps.scrolling = requestAnimationFrame(p.autoscroll);` — sem quadro armado, pede o próximo do autoscroll.
- **Sem recusa.** A recusa entra como dado da proposta (`src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;`); o caminho não deixa de escrever por causa dela.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;`).
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
