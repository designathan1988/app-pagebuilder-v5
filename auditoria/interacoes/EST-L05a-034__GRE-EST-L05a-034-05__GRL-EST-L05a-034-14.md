# EST-L05a-034 × GRE-EST-L05a-034-05 → GRL-EST-L05a-034-14
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-05 (o ouvinte): ENT-L05a-0034, ENT-L05a-0035, ENT-L05a-0036, ENT-L05a-0037
- **Leitor:** GRL-EST-L05a-034-14 (rest): ENT-L05a-0057
## Estados deixados por A
- **V-sem-faixa.** `src/editor/input/pointer.ts:159` `ps.spacing = null;` — Escape durante a faixa de espaçamento larga-a.
- **V-sem-guia.** `src/editor/input/pointer.ts:168` `ps.guiding = null;` — Escape durante o arraste de guia larga-a.
- **V-sem-rotação.** `src/editor/input/pointer.ts:177` `ps.rotating = null;` — Escape durante a rotação larga-a.
- **V-sem-redimensionamento.** `src/editor/input/pointer.ts:185` `ps.resizing = null;` — Escape durante o redimensionamento larga-o.
- **V-do-redesenho.** `src/editor/input/pointer.ts:193` `p.redraw(ps.pointerAt, false);` — sem cancelamento novo, o gesto aberto é redesenhado sem publicar.
- **Sem recusa.** Cada largada depende da contagem de cancelamentos da store (`src/editor/input/pointer.ts:157` `if (ps.spacing?.gesture != null && store.getState().ui.drag.cancels !== ps.spacing.cancels) {`); a recusa de um comando não muda a sessão.
- **Sem intermediário.** Cada largada é uma só instrução (`src/editor/input/pointer.ts:159` `ps.spacing = null;`).
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
