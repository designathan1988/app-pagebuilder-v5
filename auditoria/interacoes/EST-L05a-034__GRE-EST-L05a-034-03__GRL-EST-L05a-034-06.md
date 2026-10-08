# EST-L05a-034 × GRE-EST-L05a-034-03 → GRL-EST-L05a-034-06
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-03 (endCancelled): ENT-L05a-0038
- **Leitor:** GRL-EST-L05a-034-06 (onDown): ENT-L05a-0040
## Estados deixados por A
- **V-ocioso.** `src/editor/input/pointer/effects.ts:294` `ps.machine = IDLE;` — a máquina volta a ociosa.
- **V-sem-arraste.** `src/editor/input/pointer/effects.ts:292` `ps.dragging = null;` — larga o arraste em curso.
- **V-sem-pressão.** `src/editor/input/pointer/effects.ts:293` `ps.pressed = null;` — larga a pressão guardada.
- **V-do-fim.** `src/editor/input/pointer/effects.ts:295` `p.run(effect);` — corre o efeito (cancelar ou confirmar) por último, quando a máquina já está ociosa.
- **Sem recusa.** O caminho entrega o fim ao gesto; nenhuma linha do grupo lê a recusa de um comando.
- **Sem intermediário.** As três escritas são instruções isoladas (`src/editor/input/pointer/effects.ts:292` `ps.dragging = null;`).
## Casos
### C1 final
- Lê a máquina em `src/editor/input/pointer/events.ts:51` `const lost = ps.machine.phase !== 'idle' && step(ps.machine, { type: 'down', pointer: event.pointerId, at: { x: event.clientX, y: event.clientY }, press: { on: 'stage' } }).effect === 'restart';`: com a fase em `idle`, o `&&` para antes do `step` e `lost` fica falso; a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` decide só pelos outros termos, e as leituras de `ps.machine.phase === 'idle'` (`src/editor/input/pointer/events.ts:64` `ps.machine.phase === 'idle' && shared.open === null`) seguem verdadeiras.
- O escritor grava a máquina em `idle` (`src/editor/input/pointer/effects.ts:294` `ps.machine = IDLE;`) antes de correr o efeito (`src/editor/input/pointer/effects.ts:295` `p.run(effect);`).
- ok — com a máquina ociosa o toque novo segue sem cancelamento.

### C2 intermediário
- n/a — as três escritas e o efeito correm em sequência síncrona (`src/editor/input/pointer/effects.ts:292` `ps.dragging = null;`; `src/editor/input/pointer/effects.ts:294` `ps.machine = IDLE;`); o pointerdown não começa no meio delas.

### C3 em curso
- n/a — o escritor corre numa microtarefa (`src/editor/input/pointer.ts:198` `if (shared.open === cancelled) p.endCancelled();`) e o pointerdown corre como evento seu, depois dela.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointerdown (`src/editor/input/pointer.ts:234` `target.removeEventListener('pointerdown', p.onDown, true);`) depois de `src/editor/input/pointer.ts:220` `p.onCancel();` ter deixado a máquina em `idle`.
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor encontra a máquina ociosa e segue sem cancelar: `src/editor/input/pointer/events.ts:51` `const lost = ps.machine.phase !== 'idle' && step(ps.machine, { type: 'down', pointer: event.pointerId, at: { x: event.clientX, y: event.clientY }, press: { on: 'stage' } }).effect === 'restart';`.
