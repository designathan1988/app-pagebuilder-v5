# EST-L05a-034 × GRE-EST-L05a-034-12 → GRL-EST-L05a-034-06
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-12 (onUp): ENT-L05a-0043
- **Leitor:** GRL-EST-L05a-034-06 (onDown): ENT-L05a-0040
## Estados deixados por A
- **V-sem-captura.** `src/editor/input/pointer/events.ts:434` `if (event.pointerId === ps.captured) ps.captured = null;` — larga o ponteiro capturado quando era o da libertação.
- **V-com-a-tecla.** `src/editor/input/pointer/events.ts:436` `ps.releaseModifier = modifierOf(event);` — guarda a tecla presa na libertação.
- **V-com-a-máquina.** `src/editor/input/pointer/events.ts:540` `ps.machine = next.machine;` — grava a máquina já confirmada.
- **Sem recusa.** O caminho entrega o commit ao gesto; a recusa de um comando não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:540` `ps.machine = next.machine;`).
## Casos
### C1 final
- Lê a máquina em `src/editor/input/pointer/events.ts:51` `const lost = ps.machine.phase !== 'idle' && step(ps.machine, { type: 'down', pointer: event.pointerId, at: { x: event.clientX, y: event.clientY }, press: { on: 'stage' } }).effect === 'restart';`: com a fase em `idle`, o `&&` para antes do `step` e `lost` fica falso; a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` decide só pelos outros termos, e as leituras de `ps.machine.phase === 'idle'` (`src/editor/input/pointer/events.ts:64` `ps.machine.phase === 'idle' && shared.open === null`) seguem verdadeiras.
- O escritor grava a máquina em `idle` (`src/editor/input/pointer/events.ts:540` `ps.machine = next.machine;`; `src/editor/input/pointer/machine.ts:91` `if (event.type === 'up') return { machine: IDLE, effect: 'commit' };`) e desliga o botão (`src/editor/input/pointer/events.ts:433` `setPressing(false);`): `pointerPressing()` fica falso na condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();`.
- ok — depois da liberação o toque novo segue sem cancelar.

### C2 intermediário
- O `up` de outro ponteiro com o gesto de P aberto desliga o botão (`src/editor/input/pointer/events.ts:433` `setPressing(false);`) e a máquina fica como estava (`src/editor/input/pointer/machine.ts:90` `if (event.type === 'down' || event.pointer !== machine.pointer) return { machine, effect: null };`), em `pressed` ou `dragging`. Com a máquina em `pressed` ou `dragging` do mesmo ponteiro, o `step` devolve `restart` (`src/editor/input/pointer/machine.ts:88` `if (event.type === 'down' && event.pointer === machine.pointer) return { machine: { phase: 'pressed', pointer: event.pointer, start: event.at, press: event.press }, effect: 'restart' };`), `lost` fica verdadeiro e a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` chama `p.onCancel()`, que grava a máquina em `idle` (`src/editor/input/pointer/events.ts:549` `const next = step(ps.machine, { type: 'cancel' });`; `src/editor/input/pointer/machine.ts:80` `if (event.type === 'cancel') return machine.phase === 'idle' ? { machine, effect: null } : { machine: IDLE, effect: 'cancel' };`; `src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`) antes das leituras de `idle` das alças e do pan (`src/editor/input/pointer/events.ts:105` `ps.machine.phase === 'idle' ? (chromeControl(`).
- ok — o `down` seguinte de P é reconhecido como `restart` mesmo com o botão desligado (DEF-0510).

### C3 em curso
- n/a — o pointerup corre como evento seu (`src/editor/input/pointer/events.ts:432` `const onUp = (event: PointerEvent) => {`), e o pointerdown corre como outro; um não começa dentro do outro.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointerdown (`src/editor/input/pointer.ts:234` `target.removeEventListener('pointerdown', p.onDown, true);`) depois de `src/editor/input/pointer.ts:220` `p.onCancel();` ter cancelado o gesto.
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor lê a máquina ociosa deixada pela liberação e segue, ou reconhece o `restart` quando o `up` foi de outro ponteiro: `src/editor/input/pointer/events.ts:51` `const lost = ps.machine.phase !== 'idle' && step(ps.machine, { type: 'down', pointer: event.pointerId, at: { x: event.clientX, y: event.clientY }, press: { on: 'stage' } }).effect === 'restart';`.
