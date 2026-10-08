# EST-L05a-034 × GRE-EST-L05a-034-01 → GRL-EST-L05a-034-12
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-01 (autoscroll): ENT-L05a-0055, ENT-L05a-0056
- **Leitor:** GRL-EST-L05a-034-12 (over): ENT-L05a-0058
## Estados deixados por A
- **V-ocioso.** `src/editor/input/pointer/drag.ts:119` `if (ps.dragging === null || !frame) return;` — sem arraste aberto ou sem moldura do canvas, o quadro para sem escrever.
- **V-do-quadro.** `src/editor/input/pointer/drag.ts:172` `ps.scrolling = requestAnimationFrame(p.autoscroll);` — deixa o identificador do quadro de autoscroll a caminho; `src/editor/input/pointer/drag.ts:117` `ps.scrolling = 0;` zera-o no início de cada quadro.
- **V-da-árvore.** `src/editor/input/pointer/drag.ts:152` `ps.treeBand = setTimeout(() => {` arma a permanência sobre a árvore de Camadas; `src/editor/input/pointer/drag.ts:153` `ps.treeBand = null;` e `src/editor/input/pointer/drag.ts:154` `ps.treeRested = true;` a desarmam e marcam o descanso quando o temporizador dispara.
- **V-da-proposta-retomada.** `src/editor/input/pointer/drag.ts:169` `ps.dragging.takenAt = null;` — uma rolagem que moveu a página zera o ponto em que a proposta foi tomada.
- **Sem recusa.** O grupo só rola e retoma a proposta: `src/editor/input/pointer/drag.ts:170` `p.over(ps.pointerAt, ps.dragging.inserting === null || nodesUnder(frame, ps.pointerAt).length > 0);`; nenhuma das suas linhas publica recusa de comando.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:117` `ps.scrolling = 0;`); o quadro seguinte corre noutra passagem de requestAnimationFrame.
## Casos
### C1 final
- Lê o arraste em `src/editor/input/pointer/drag.ts:206` `if (ps.dragging === null) return;`: sem arraste aberto nada corre.
- Com arraste, publica a proposta (`src/editor/input/pointer/drag.ts:223` `p.redraw(at, creation || ps.dragging.dragged.length > 0 || offered !== ps.dragging.side);`).
- ok — o leitor lê o arraste deixado e publica a proposta.

### C2 intermediário
- n/a — o over reage à proposta deixada (`src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;`).

### C3 em curso
- n/a — o over corre a partir do pointermove ou do quadro de autoscroll, fora da execução do escritor.

### C4 desmontagem
- O fim do gesto larga o arraste (`src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`) e o desmonte do dono cancela o gesto (`src/editor/input/pointer.ts:220` `p.onCancel();`).
- ok — sem arraste aberto o leitor para na primeira condição.

## Resultado
- O leitor publica a proposta desenhada e retoma o quadro do autoscroll a partir do arraste: `src/editor/input/pointer/drag.ts:224` `if (ps.scrolling === 0) ps.scrolling = requestAnimationFrame(p.autoscroll);`.
