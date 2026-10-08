# EST-L05a-034 × GRE-EST-L05a-034-01 → GRL-EST-L05a-034-11
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-01 (autoscroll): ENT-L05a-0055, ENT-L05a-0056
- **Leitor:** GRL-EST-L05a-034-11 (onUp): ENT-L05a-0043, ENT-P-view-0087
## Estados deixados por A
- **V-ocioso.** `src/editor/input/pointer/drag.ts:119` `if (ps.dragging === null || !frame) return;` — sem arraste aberto ou sem moldura do canvas, o quadro para sem escrever.
- **V-do-quadro.** `src/editor/input/pointer/drag.ts:172` `ps.scrolling = requestAnimationFrame(p.autoscroll);` — deixa o identificador do quadro de autoscroll a caminho; `src/editor/input/pointer/drag.ts:117` `ps.scrolling = 0;` zera-o no início de cada quadro.
- **V-da-árvore.** `src/editor/input/pointer/drag.ts:152` `ps.treeBand = setTimeout(() => {` arma a permanência sobre a árvore de Camadas; `src/editor/input/pointer/drag.ts:153` `ps.treeBand = null;` e `src/editor/input/pointer/drag.ts:154` `ps.treeRested = true;` a desarmam e marcam o descanso quando o temporizador dispara.
- **V-da-proposta-retomada.** `src/editor/input/pointer/drag.ts:169` `ps.dragging.takenAt = null;` — uma rolagem que moveu a página zera o ponto em que a proposta foi tomada.
- **Sem recusa.** O grupo só rola e retoma a proposta: `src/editor/input/pointer/drag.ts:170` `p.over(ps.pointerAt, ps.dragging.inserting === null || nodesUnder(frame, ps.pointerAt).length > 0);`; nenhuma das suas linhas publica recusa de comando.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:117` `ps.scrolling = 0;`); o quadro seguinte corre noutra passagem de requestAnimationFrame.
## Casos
### C1 final
- Lê a repetição em `src/editor/input/pointer/events.ts:437` `if (ps.repeating !== null && event.pointerId === ps.repeating.pointer) {`: a libertação de um controlo que repete para a repetição.
- ok — o leitor lê a repetição deixada e para-a quando é a do ponteiro.

### C2 intermediário
- n/a — o caminho decide pelo estado deixado (`src/editor/input/pointer/events.ts:437` `if (ps.repeating !== null && event.pointerId === ps.repeating.pointer) {`).

### C3 em curso
- n/a — o pointerup corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointerup e cancela os gestos abertos (`src/editor/input/pointer.ts:220` `p.onCancel();`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor confirma o gesto e, no caminho da guia, corre a porta de exclusão guardada no gesto: `src/editor/input/pointer/events.ts:491` `if (dropped && guide !== null && GUIDE_DELETE !== null) gesture.dispatch(GUIDE_DELETE.command.id as CommandId, { ...GUIDE_DELETE.door.args, guide } as never);`.
