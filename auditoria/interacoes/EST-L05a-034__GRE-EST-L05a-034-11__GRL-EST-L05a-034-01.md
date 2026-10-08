# EST-L05a-034 × GRE-EST-L05a-034-11 → GRL-EST-L05a-034-01
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-11 (onMove): ENT-L05a-0042, ENT-L05a-0053, ENT-P-motion-0045, ENT-P-motion-0046, ENT-P-motion-0047, ENT-P-motion-0052, ENT-P-motion-0057, ENT-P-motion-0066, ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082, ENT-P-view-0087
- **Leitor:** GRL-EST-L05a-034-01 (autoscroll): ENT-L05a-0056
## Estados deixados por A
- **V-com-a-máquina.** `src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;` — grava a máquina (a passagem a dragging).
- **V-do-menu.** `src/editor/input/pointer/events.ts:265` `ps.menuResting = menuUnder;` grava o botão de menu sob o ponteiro; `src/editor/input/pointer/events.ts:267` `if (ps.menuDwell !== null) clearTimeout(ps.menuDwell);` desarma o temporizador anterior e `src/editor/input/pointer/events.ts:270` `else ps.menuDwell = setTimeout(() => setMenuOver(menuUnder), MENU_HOVER_SWITCH);` arma o novo.
- **V-do-gesto-da-guia.** `src/editor/input/pointer/events.ts:327` `ps.guiding.gesture = store.gesture();` — o gesto do arraste de guia aberto ao passar o limiar.
- **Sem recusa.** O caminho só regista o movimento; a recusa de um comando despachado não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;`).
## Casos
### C1 final
- O escritor já terminou e deixou a sessão com o arraste aberto; o quadro lê o arraste e a moldura em `src/editor/input/pointer/drag.ts:119` `if (ps.dragging === null || !frame) return;`.
- Com arraste aberto, calcula o passo (`src/editor/input/pointer/drag.ts:127` `if (ps.insideOnce && across && fromTop >= 0 && fromTop < AUTOSCROLL_ZONE) step = -AUTOSCROLL_MAX * (1 - fromTop / AUTOSCROLL_ZONE);`) e rola a página (`src/editor/input/pointer/drag.ts:129` `if (step !== 0 && scrollPage(frame, step)) scrolled = true;`).
- ok — o leitor lê o estado final e rola a página dentro das faixas.

### C2 intermediário
- n/a — o quadro não vê um meio: lê o ponteiro e o armado já fixados (`src/editor/input/pointer/drag.ts:127` `if (ps.insideOnce && across && fromTop >= 0 && fromTop < AUTOSCROLL_ZONE) step = -AUTOSCROLL_MAX * (1 - fromTop / AUTOSCROLL_ZONE);`) e reage ao estado deixado pelo último escritor.

### C3 em curso
- n/a — o quadro corre numa passagem de requestAnimationFrame (`src/editor/input/pointer/drag.ts:172` `ps.scrolling = requestAnimationFrame(p.autoscroll);`), fora da execução do escritor; entre dois quadros o escritor termina a sua instrução.

### C4 desmontagem
- O desmonte do dono do ponteiro cancela o quadro em stopDragTimers (`src/editor/input/pointer/drag.ts:197` `if (ps.scrolling !== 0) cancelAnimationFrame(ps.scrolling);`), corrido pelo cancelamento da limpeza (`src/editor/input/pointer.ts:220` `p.onCancel();`).
- ok — depois da desmontagem o quadro seguinte não é pedido.

## Resultado
- O leitor rola a página e a árvore de Camadas pelo passo calculado e retoma a proposta: `src/editor/input/pointer/drag.ts:172` `ps.scrolling = requestAnimationFrame(p.autoscroll);`.
