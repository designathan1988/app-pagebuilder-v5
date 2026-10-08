# EST-L05a-034 × GRE-EST-L05a-034-08 → GRL-EST-L05a-034-14
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-08 (onDown): ENT-L05a-0040, ENT-L05a-0051
- **Leitor:** GRL-EST-L05a-034-14 (rest): ENT-L05a-0057
## Estados deixados por A
- **V-pressionado.** `src/editor/input/pointer/events.ts:232` `ps.machine = next.machine;` — grava a máquina (em pressed quando a pressão abre um gesto).
- **V-com-repetição.** `src/editor/input/pointer/events.ts:88` `ps.repeating = hold;` guarda a repetição e `src/editor/input/pointer/events.ts:89` `hold.timer = window.setTimeout(() => {` arma o temporizador da primeira repetição.
- **V-intacto.** `src/editor/input/pointer/events.ts:218` `if (press === null || press === 'elsewhere') return;` — pressão fora de algo relevante deixa a sessão como estava.
- **V-do-botão.** `src/editor/input/pointer/events.ts:219` `if (event.button !== 0 && event.button !== 2) return;` — um botão fora do primário e do secundário para sem escrever.
- **Sem recusa.** A pressão abre um gesto (`src/editor/input/pointer/events.ts:233` `p.run(next.effect);`); a recusa do comando não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:232` `ps.machine = next.machine;`).
- **E-reinício — o mesmo ponteiro apertado de novo com o gesto aberto (o `up` dele se perdeu, DEF-0510): a sessão passa pelo cancelamento antes do toque novo.** `src/editor/input/pointer/events.ts:51` `const lost = ps.machine.phase !== 'idle' && step(ps.machine, { type: 'down', pointer: event.pointerId, at: { x: event.clientX, y: event.clientY }, press: { on: 'stage' } }).effect === 'restart';` — a máquina devolve `restart` (`src/editor/input/pointer/machine.ts:88` `if (event.type === 'down' && event.pointer === machine.pointer) return { machine: { phase: 'pressed', pointer: event.pointer, start: event.at, press: event.press }, effect: 'restart' };`, DCS-013); o `onDown` chama `p.onCancel()` (`src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();`), que leva a máquina a `idle` e roda o cancelamento; o toque novo segue desde `idle`.
## Casos
### C1 final
- Lê a linha em repouso em `src/editor/input/pointer/drag.ts:179` `if (folded === ps.dragging.resting) return;`: se é a mesma de antes, nada rearma.

Com E-reinício, o leitor encontra a sessão como depois de um cancelamento seguido de um toque novo: o cancelamento esvaziou o arraste, a banda e os estados de gesto (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`) e a máquina está em `pressed` com o toque novo — os mesmos valores que o cancelamento e o toque novo já deixam neste par. ok
- Com linha dobrada nova, guarda-a (`src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;`) e arma a abertura (`src/editor/input/pointer/drag.ts:186` `ps.unfold = setTimeout(() => {`).
- ok — o leitor lê o repouso deixado e arma a abertura da linha.

### C2 intermediário
- n/a — `src/editor/input/pointer/drag.ts:179` `if (folded === ps.dragging.resting) return;` só compara a linha guardada.

### C3 em curso
- n/a — o rest corre a partir do over, fora da execução do escritor.

### C4 desmontagem
- O fim do gesto larga o arraste (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`) e para os temporizadores (`src/editor/input/pointer/effects.ts:166` `p.stopDragTimers();`).
- ok — sem arraste aberto o leitor para na primeira condição (`src/editor/input/pointer/drag.ts:177` `if (ps.dragging === null) return;`).

## Resultado
- O leitor desdobra a linha de Camadas em que o ponteiro repousa, correndo a porta no gesto aberto: `src/editor/input/pointer/drag.ts:189` `shared.open?.dispatch(dwell.command.id as CommandId, { ...dwell.door.args, target: folded } as never);`.
