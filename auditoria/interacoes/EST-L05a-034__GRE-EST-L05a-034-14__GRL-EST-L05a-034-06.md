# EST-L05a-034 × GRE-EST-L05a-034-14 → GRL-EST-L05a-034-06
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-14 (rest): ENT-L05a-0057
- **Leitor:** GRL-EST-L05a-034-06 (onDown): ENT-L05a-0040
## Estados deixados por A
- **V-intacto.** `src/editor/input/pointer/drag.ts:177` `if (ps.dragging === null) return;` — sem arraste aberto nada é escrito.
- **V-com-a-linha.** `src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;` — guarda a linha dobrada em que o ponteiro repousa.
- **V-do-temporizador.** `src/editor/input/pointer/drag.ts:186` `ps.unfold = setTimeout(() => {` — arma a abertura da linha com a permanência lida.
- **Sem recusa.** O caminho não despacha comando por si: a abertura corre no gesto aberto (`src/editor/input/pointer/drag.ts:189` `shared.open?.dispatch(dwell.command.id as CommandId, { ...dwell.door.args, target: folded } as never);`).
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;`).
## Casos
### C1 final
- Estado deixado: a linha dobrada em repouso (`src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;`) com a máquina em `dragging` e o temporizador de abertura armado (`src/editor/input/pointer/drag.ts:186` `ps.unfold = setTimeout(() => {`). Com a máquina em `pressed` ou `dragging` do mesmo ponteiro, o `step` devolve `restart` (`src/editor/input/pointer/machine.ts:88` `if (event.type === 'down' && event.pointer === machine.pointer) return { machine: { phase: 'pressed', pointer: event.pointer, start: event.at, press: event.press }, effect: 'restart' };`), `lost` fica verdadeiro e a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` chama `p.onCancel()`, que grava a máquina em `idle` (`src/editor/input/pointer/events.ts:549` `const next = step(ps.machine, { type: 'cancel' });`; `src/editor/input/pointer/machine.ts:80` `if (event.type === 'cancel') return machine.phase === 'idle' ? { machine, effect: null } : { machine: IDLE, effect: 'cancel' };`; `src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`) antes das leituras de `idle` das alças e do pan (`src/editor/input/pointer/events.ts:105` `ps.machine.phase === 'idle' ? (chromeControl(`).
- O fim do gesto para o temporizador (`src/editor/input/pointer/effects.ts:166` `p.stopDragTimers();`; `src/editor/input/pointer/drag.ts:193` `if (ps.unfold !== null) clearTimeout(ps.unfold);`) e fecha o gesto aberto, de modo que a abertura (`src/editor/input/pointer/drag.ts:189` `shared.open?.dispatch(dwell.command.id as CommandId,`) deixa de correr.
- ok — a abertura pendente não sobrevive ao toque novo.

### C2 intermediário
- n/a — cada escrita do escritor é uma só instrução (`src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;`) dentro do pointermove; o pointerdown não começa no meio delas.

### C3 em curso
- n/a — o escritor corre dentro do pointermove, e o pointerdown corre como evento seu; um não começa dentro do outro (`src/editor/input/pointer/events.ts:235` `const onMove = (event: PointerEvent) => {`).

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointerdown (`src/editor/input/pointer.ts:234` `target.removeEventListener('pointerdown', p.onDown, true);`) depois de `src/editor/input/pointer.ts:220` `p.onCancel();` ter parado o temporizador de abertura.
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor cancela o arraste e o temporizador de abertura do escritor antes do toque novo: `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();`.
