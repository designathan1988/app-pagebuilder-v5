# EST-L05a-034 × GRE-EST-L05a-034-13 → GRL-EST-L05a-034-06
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-13 (over): ENT-L05a-0058
- **Leitor:** GRL-EST-L05a-034-06 (onDown): ENT-L05a-0040
## Estados deixados por A
- **V-intacto.** `src/editor/input/pointer/drag.ts:206` `if (ps.dragging === null) return;` — sem arraste aberto nada é escrito.
- **V-da-linha.** `src/editor/input/pointer/drag.ts:212` `ps.dragging.fromRow = row !== null;` — marca se a proposta veio de uma linha de Camadas.
- **V-da-proposta-tomada.** `src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;` e `src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;` — guardam a proposta e o ponto em que foi tomada.
- **V-do-quadro.** `src/editor/input/pointer/drag.ts:224` `if (ps.scrolling === 0) ps.scrolling = requestAnimationFrame(p.autoscroll);` — sem quadro armado, pede o próximo do autoscroll.
- **Sem recusa.** A recusa entra como dado da proposta (`src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;`); o caminho não deixa de escrever por causa dela.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;`).
## Casos
### C1 final
- Estado deixado: proposta tomada (`src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;`) com a máquina em `dragging`, e o próximo quadro de autoscroll armado (`src/editor/input/pointer/drag.ts:224` `if (ps.scrolling === 0) ps.scrolling = requestAnimationFrame(p.autoscroll);`). Com a máquina em `pressed` ou `dragging` do mesmo ponteiro, o `step` devolve `restart` (`src/editor/input/pointer/machine.ts:88` `if (event.type === 'down' && event.pointer === machine.pointer) return { machine: { phase: 'pressed', pointer: event.pointer, start: event.at, press: event.press }, effect: 'restart' };`), `lost` fica verdadeiro e a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` chama `p.onCancel()`, que grava a máquina em `idle` (`src/editor/input/pointer/events.ts:549` `const next = step(ps.machine, { type: 'cancel' });`; `src/editor/input/pointer/machine.ts:80` `if (event.type === 'cancel') return machine.phase === 'idle' ? { machine, effect: null } : { machine: IDLE, effect: 'cancel' };`; `src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`) antes das leituras de `idle` das alças e do pan (`src/editor/input/pointer/events.ts:105` `ps.machine.phase === 'idle' ? (chromeControl(`).
- O fim do gesto larga o arraste (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`) e cancela o quadro armado (`src/editor/input/pointer/effects.ts:166` `p.stopDragTimers();`; `src/editor/input/pointer/drag.ts:197` `if (ps.scrolling !== 0) cancelAnimationFrame(ps.scrolling);`).
- ok — a proposta tomada e o quadro armado não sobrevivem ao toque novo.

### C2 intermediário
- n/a — cada escrita do escritor é uma só instrução (`src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;`) dentro do pointermove (`src/editor/input/pointer/events.ts:429` `p.over(at,`); o pointerdown não começa no meio delas.

### C3 em curso
- n/a — o escritor corre dentro do pointermove (`src/editor/input/pointer/events.ts:429` `p.over(at,`), e o pointerdown corre como evento seu; um não começa dentro do outro.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointerdown (`src/editor/input/pointer.ts:234` `target.removeEventListener('pointerdown', p.onDown, true);`) depois de `src/editor/input/pointer.ts:220` `p.onCancel();` ter parado os temporizadores do arraste.
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor cancela o arraste cuja proposta o escritor tomou e para o quadro de autoscroll: `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();`.
