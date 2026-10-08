# EST-L05a-034 × GRE-EST-L05a-034-09 → GRL-EST-L05a-034-01
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-09 (onLostCapture): ENT-L05a-0045
- **Leitor:** GRL-EST-L05a-034-01 (autoscroll): ENT-L05a-0056
## Estados deixados por A
- **V-sem-captura.** `src/editor/input/pointer/events.ts:557` `ps.captured = null;` — larga o ponteiro capturado.
- **V-intacto.** `src/editor/input/pointer/events.ts:556` `if (event.pointerId !== ps.captured) return;` — a captura perdida de outro ponteiro não escreve.
- **V-adicional.** `src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();` — com o botão ainda pressionado, cancela o gesto (a máquina é escrita pelo grupo de onCancel).
- **Sem recusa.** O caminho não despacha comando.
- **Sem intermediário.** `src/editor/input/pointer/events.ts:557` `ps.captured = null;` é uma só instrução.
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
