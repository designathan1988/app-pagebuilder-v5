# EST-L05a-034 × GRE-EST-L05a-034-01 → GRL-EST-L05a-034-04
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-01 (autoscroll): ENT-L05a-0055, ENT-L05a-0056
- **Leitor:** GRL-EST-L05a-034-04 (o ouvinte): ENT-L05a-0032, ENT-L05a-0034, ENT-L05a-0035, ENT-L05a-0036, ENT-L05a-0037
## Estados deixados por A
- **V-ocioso.** `src/editor/input/pointer/drag.ts:119` `if (ps.dragging === null || !frame) return;` — sem arraste aberto ou sem moldura do canvas, o quadro para sem escrever.
- **V-do-quadro.** `src/editor/input/pointer/drag.ts:172` `ps.scrolling = requestAnimationFrame(p.autoscroll);` — deixa o identificador do quadro de autoscroll a caminho; `src/editor/input/pointer/drag.ts:117` `ps.scrolling = 0;` zera-o no início de cada quadro.
- **V-da-árvore.** `src/editor/input/pointer/drag.ts:152` `ps.treeBand = setTimeout(() => {` arma a permanência sobre a árvore de Camadas; `src/editor/input/pointer/drag.ts:153` `ps.treeBand = null;` e `src/editor/input/pointer/drag.ts:154` `ps.treeRested = true;` a desarmam e marcam o descanso quando o temporizador dispara.
- **V-da-proposta-retomada.** `src/editor/input/pointer/drag.ts:169` `ps.dragging.takenAt = null;` — uma rolagem que moveu a página zera o ponto em que a proposta foi tomada.
- **Sem recusa.** O grupo só rola e retoma a proposta: `src/editor/input/pointer/drag.ts:170` `p.over(ps.pointerAt, ps.dragging.inserting === null || nodesUnder(frame, ps.pointerAt).length > 0);`; nenhuma das suas linhas publica recusa de comando.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:117` `ps.scrolling = 0;`); o quadro seguinte corre noutra passagem de requestAnimationFrame.
## Casos
### C1 final
- O escritor terminou; a assinatura da store (`src/editor/input/pointer.ts:149` `const stopListening = store.subscribe(() => {`) lê a sessão a cada mudança.
- Larga as alças canceladas (`src/editor/input/pointer.ts:157` `if (ps.spacing?.gesture != null && store.getState().ui.drag.cancels !== ps.spacing.cancels) {`) e redesenha o gesto aberto (`src/editor/input/pointer.ts:193` `p.redraw(ps.pointerAt, false);`).
- ok — o leitor lê a sessão deixada e larga o que foi cancelado.

### C2 intermediário
- n/a — a assinatura dispara numa publicação da store (`src/editor/input/pointer.ts:149` `const stopListening = store.subscribe(() => {`), quando o escritor já completou a instrução que a provocou.

### C3 em curso
- O ouvinte pode ser chamado no meio do escritor: o escritor despacha comandos pelo gesto, e a store avisa os assinantes dentro desse despacho (`src/editor/input/pointer.ts:152` `if (ps.tooling !== null && store.getState().ui.drag.cancels !== ps.tooling.cancels) {`).
- A leitura é do estado da sessão já escrito até ali; um campo ainda por escrever aparece como estava.
- ok — a leitura em curso vê a sessão a meio do escritor.

### C4 desmontagem
- O desmonte do dono remove a assinatura (`src/editor/input/pointer.ts:216` `stopListening();`).
- ok — depois da desmontagem o ouvinte deixa de correr.

## Resultado
- O leitor larga os gestos cancelados e redesenha o gesto aberto a partir da sessão: `src/editor/input/pointer.ts:193` `p.redraw(ps.pointerAt, false);`.
