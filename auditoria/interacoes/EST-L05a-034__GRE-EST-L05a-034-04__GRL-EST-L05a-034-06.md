# EST-L05a-034 × GRE-EST-L05a-034-04 → GRL-EST-L05a-034-06
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-04 (o callback): ENT-L05a-0052
- **Leitor:** GRL-EST-L05a-034-06 (onDown): ENT-L05a-0040
## Estados deixados por A
- **V-com-o-intervalo.** `src/editor/input/pointer/events.ts:92` `hold.timer = window.setInterval(() => repeat(held), REPEAT_INTERVAL);` — a repetição passa a guardar o intervalo que a repete.
- **V-para.** `src/editor/input/pointer/events.ts:90` `if (ps.repeating !== hold) return;` — se a repetição já não é a mesma, o callback para sem escrever.
- **Sem recusa.** O callback só corre o passo do controlo (`src/editor/input/pointer/events.ts:91` `repeat(held);`).
- **Sem intermediário.** Uma só instrução escreve o temporizador (`src/editor/input/pointer/events.ts:92` `hold.timer = window.setInterval(() => repeat(held), REPEAT_INTERVAL);`).
## Casos
### C1 final
- Lê a máquina em `src/editor/input/pointer/events.ts:51` `const lost = ps.machine.phase !== 'idle' && step(ps.machine, { type: 'down', pointer: event.pointerId, at: { x: event.clientX, y: event.clientY }, press: { on: 'stage' } }).effect === 'restart';`: com a fase em `idle`, o `&&` para antes do `step` e `lost` fica falso; a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` decide só pelos outros termos, e as leituras de `ps.machine.phase === 'idle'` (`src/editor/input/pointer/events.ts:64` `ps.machine.phase === 'idle' && shared.open === null`) seguem verdadeiras.
- O toque que arma a repetição devolve antes do `step` do fim do `onDown` (`src/editor/input/pointer/events.ts:94` `return;`), e a máquina fica ociosa. Com o intervalo em curso (`src/editor/input/pointer/events.ts:92` `hold.timer = window.setInterval(() => repeat(held), REPEAT_INTERVAL);`) o botão ainda está pressionado, e `pointerPressing()` na condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` chama `p.onCancel()`, que para a repetição (`src/editor/input/pointer/events.ts:547` `p.stopRepeating();`).
- ok — o toque novo para a repetição antes de seguir.

### C2 intermediário
- Antes da primeira repetição o temporizador é o de espera (`src/editor/input/pointer/events.ts:89` `hold.timer = window.setTimeout(() => {`); o toque novo cai na mesma condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();`, e `stopRepeating` limpa o temporizador e o intervalo (`src/editor/input/pointer/panels.ts:31` `window.clearTimeout(ps.repeating.timer);`; `src/editor/input/pointer/panels.ts:32` `window.clearInterval(ps.repeating.timer);`), então o callback nem chega a correr.
- ok — a espera não sobrevive ao toque novo.

### C3 em curso
- n/a — o callback corre como temporizador (`src/editor/input/pointer/events.ts:91` `repeat(held);`) e o pointerdown corre como evento seu; um não começa dentro do outro.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointerdown (`src/editor/input/pointer.ts:234` `target.removeEventListener('pointerdown', p.onDown, true);`) depois de `src/editor/input/pointer.ts:220` `p.onCancel();` ter parado a repetição.
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor para a repetição pela condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` antes de o toque novo ler a máquina.
