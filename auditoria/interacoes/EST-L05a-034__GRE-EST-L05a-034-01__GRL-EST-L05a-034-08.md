# EST-L05a-034 × GRE-EST-L05a-034-01 → GRL-EST-L05a-034-08
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-01 (autoscroll): ENT-L05a-0055, ENT-L05a-0056
- **Leitor:** GRL-EST-L05a-034-08 (onMouseDown): ENT-L05a-0047
## Estados deixados por A
- **V-ocioso.** `src/editor/input/pointer/drag.ts:119` `if (ps.dragging === null || !frame) return;` — sem arraste aberto ou sem moldura do canvas, o quadro para sem escrever.
- **V-do-quadro.** `src/editor/input/pointer/drag.ts:172` `ps.scrolling = requestAnimationFrame(p.autoscroll);` — deixa o identificador do quadro de autoscroll a caminho; `src/editor/input/pointer/drag.ts:117` `ps.scrolling = 0;` zera-o no início de cada quadro.
- **V-da-árvore.** `src/editor/input/pointer/drag.ts:152` `ps.treeBand = setTimeout(() => {` arma a permanência sobre a árvore de Camadas; `src/editor/input/pointer/drag.ts:153` `ps.treeBand = null;` e `src/editor/input/pointer/drag.ts:154` `ps.treeRested = true;` a desarmam e marcam o descanso quando o temporizador dispara.
- **V-da-proposta-retomada.** `src/editor/input/pointer/drag.ts:169` `ps.dragging.takenAt = null;` — uma rolagem que moveu a página zera o ponto em que a proposta foi tomada.
- **Sem recusa.** O grupo só rola e retoma a proposta: `src/editor/input/pointer/drag.ts:170` `p.over(ps.pointerAt, ps.dragging.inserting === null || nodesUnder(frame, ps.pointerAt).length > 0);`; nenhuma das suas linhas publica recusa de comando.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:117` `ps.scrolling = 0;`); o quadro seguinte corre noutra passagem de requestAnimationFrame.
## Casos
### C1 final
- Lê o pedido de manter o foco em `src/editor/input/pointer/events.ts:574` `const keep = ps.keepFocus;` e consome-o (`src/editor/input/pointer/events.ts:575` `ps.keepFocus = false;`).
- Com o pedido, impede a ação por omissão do navegador (`src/editor/input/pointer/events.ts:577` `if (keep || toolbar || onOwnOption(event.target) || (event.button === 2 && event.target instanceof Element && event.target.closest(EDITOR_MENU_AREA))) event.preventDefault();`).
- ok — o leitor lê e consome o pedido.

### C2 intermediário
- n/a — `src/editor/input/pointer/events.ts:575` `ps.keepFocus = false;` é uma só instrução.

### C3 em curso
- n/a — o mousedown corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de mousedown (`src/editor/input/pointer.ts:241` `target.removeEventListener('mousedown', p.onMouseDown, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor impede o navegador de tirar o foco quando o pedido guardado existe: `src/editor/input/pointer/events.ts:577` `if (keep || toolbar || onOwnOption(event.target) || (event.button === 2 && event.target instanceof Element && event.target.closest(EDITOR_MENU_AREA))) event.preventDefault();`.
