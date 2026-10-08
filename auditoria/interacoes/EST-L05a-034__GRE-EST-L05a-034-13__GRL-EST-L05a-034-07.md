# EST-L05a-034 × GRE-EST-L05a-034-13 → GRL-EST-L05a-034-07
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-13 (over): ENT-L05a-0058
- **Leitor:** GRL-EST-L05a-034-07 (onLostCapture): ENT-L05a-0045
## Estados deixados por A
- **V-intacto.** `src/editor/input/pointer/drag.ts:206` `if (ps.dragging === null) return;` — sem arraste aberto nada é escrito.
- **V-da-linha.** `src/editor/input/pointer/drag.ts:212` `ps.dragging.fromRow = row !== null;` — marca se a proposta veio de uma linha de Camadas.
- **V-da-proposta-tomada.** `src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;` e `src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;` — guardam a proposta e o ponto em que foi tomada.
- **V-do-quadro.** `src/editor/input/pointer/drag.ts:224` `if (ps.scrolling === 0) ps.scrolling = requestAnimationFrame(p.autoscroll);` — sem quadro armado, pede o próximo do autoscroll.
- **Sem recusa.** A recusa entra como dado da proposta (`src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;`); o caminho não deixa de escrever por causa dela.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;`).
## Casos
### C1 final
- Lê o ponteiro capturado em `src/editor/input/pointer/events.ts:556` `if (event.pointerId !== ps.captured) return;`: só o ponteiro capturado conta.
- Larga a captura (`src/editor/input/pointer/events.ts:557` `ps.captured = null;`) e, com o botão ainda pressionado, cancela o gesto (`src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();`).
- ok — o leitor lê a captura deixada e cancela o gesto correspondente.

### C2 intermediário
- n/a — `src/editor/input/pointer/events.ts:556` `if (event.pointerId !== ps.captured) return;` só compara o identificador do ponteiro.

### C3 em curso
- n/a — o evento da captura perdida corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de lostpointercapture (`src/editor/input/pointer.ts:239` `target.removeEventListener('lostpointercapture', p.onLostCapture, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor larga a captura e, com o botão ainda pressionado, cancela o gesto: `src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();`.
