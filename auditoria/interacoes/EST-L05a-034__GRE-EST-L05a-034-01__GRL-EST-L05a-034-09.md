# EST-L05a-034 × GRE-EST-L05a-034-01 → GRL-EST-L05a-034-09
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-01 (autoscroll): ENT-L05a-0055, ENT-L05a-0056
- **Leitor:** GRL-EST-L05a-034-09 (onMove): ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082
## Estados deixados por A
- **V-ocioso.** `src/editor/input/pointer/drag.ts:119` `if (ps.dragging === null || !frame) return;` — sem arraste aberto ou sem moldura do canvas, o quadro para sem escrever.
- **V-do-quadro.** `src/editor/input/pointer/drag.ts:172` `ps.scrolling = requestAnimationFrame(p.autoscroll);` — deixa o identificador do quadro de autoscroll a caminho; `src/editor/input/pointer/drag.ts:117` `ps.scrolling = 0;` zera-o no início de cada quadro.
- **V-da-árvore.** `src/editor/input/pointer/drag.ts:152` `ps.treeBand = setTimeout(() => {` arma a permanência sobre a árvore de Camadas; `src/editor/input/pointer/drag.ts:153` `ps.treeBand = null;` e `src/editor/input/pointer/drag.ts:154` `ps.treeRested = true;` a desarmam e marcam o descanso quando o temporizador dispara.
- **V-da-proposta-retomada.** `src/editor/input/pointer/drag.ts:169` `ps.dragging.takenAt = null;` — uma rolagem que moveu a página zera o ponto em que a proposta foi tomada.
- **Sem recusa.** O grupo só rola e retoma a proposta: `src/editor/input/pointer/drag.ts:170` `p.over(ps.pointerAt, ps.dragging.inserting === null || nodesUnder(frame, ps.pointerAt).length > 0);`; nenhuma das suas linhas publica recusa de comando.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:117` `ps.scrolling = 0;`); o quadro seguinte corre noutra passagem de requestAnimationFrame.
## Casos
### C1 final
- O leitor lê o gesto do arraste guardado na sessão e despacha o passo do comando pelo gesto (`src/editor/input/pointer/events.ts:343` `ps.guiding.gesture.dispatch(create.command.id as CommandId, { ...create.door.args, axis: ps.guiding.axis, at } as never);`).
- ok — com o gesto guardado, o comando corre no contexto do arraste.

### C2 intermediário
- n/a — o caminho reage ao gesto deixado (`src/editor/input/pointer/events.ts:327` `ps.guiding.gesture = store.gesture();`) e não a um meio.

### C3 em curso
- n/a — o pointermove corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointermove (`src/editor/input/pointer.ts:236` `target.removeEventListener('pointermove', p.onMove, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor despacha o comando do arraste pelo gesto guardado na sessão: `src/editor/input/pointer/events.ts:343` `ps.guiding.gesture.dispatch(create.command.id as CommandId, { ...create.door.args, axis: ps.guiding.axis, at } as never);`.
