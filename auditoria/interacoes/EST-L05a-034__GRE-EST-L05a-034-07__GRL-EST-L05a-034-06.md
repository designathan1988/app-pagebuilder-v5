# EST-L05a-034 × GRE-EST-L05a-034-07 → GRL-EST-L05a-034-06
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-07 (onCancel): ENT-L05a-0044, ENT-L05a-0048
- **Leitor:** GRL-EST-L05a-034-06 (onDown): ENT-L05a-0040
## Estados deixados por A
- **V-cancelado.** `src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;` — grava a máquina já cancelada.
- **V-sem-captura.** `src/editor/input/pointer/events.ts:545` `ps.captured = null;` — larga o ponteiro capturado.
- **V-sem-deslizador.** `src/editor/input/pointer/events.ts:546` `ps.sliding = null;` — larga o deslizador de campo.
- **V-sem-gestos-de-alça.** `src/editor/input/pointer/events.ts:548` `p.dropHandleGestures();` — larga os gestos das alças abertos (a ferramenta incluída).
- **Sem recusa.** O caminho entrega o cancelamento ao gesto (`src/editor/input/pointer/events.ts:551` `p.run(next.effect);`); a recusa de um comando não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:545` `ps.captured = null;`).
## Casos
### C1 final
- Lê a máquina em `src/editor/input/pointer/events.ts:51` `const lost = ps.machine.phase !== 'idle' && step(ps.machine, { type: 'down', pointer: event.pointerId, at: { x: event.clientX, y: event.clientY }, press: { on: 'stage' } }).effect === 'restart';`: com a fase em `idle`, o `&&` para antes do `step` e `lost` fica falso; a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` decide só pelos outros termos, e as leituras de `ps.machine.phase === 'idle'` (`src/editor/input/pointer/events.ts:64` `ps.machine.phase === 'idle' && shared.open === null`) seguem verdadeiras.
- O escritor deixa a máquina em `idle` (`src/editor/input/pointer/events.ts:549` `const next = step(ps.machine, { type: 'cancel' });`; `src/editor/input/pointer/machine.ts:80` `if (event.type === 'cancel') return machine.phase === 'idle' ? { machine, effect: null } : { machine: IDLE, effect: 'cancel' };`; `src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`), `ps.sliding` nulo (`src/editor/input/pointer/events.ts:546` `ps.sliding = null;`) e as alças largadas (`src/editor/input/pointer/events.ts:548` `p.dropHandleGestures();`): todos os termos da condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` ficam falsos.
- ok — depois de um cancelamento o toque novo segue sem cancelar de novo.

### C2 intermediário
- n/a — as escritas do cancelamento correm em sequência síncrona (`src/editor/input/pointer/events.ts:545` `ps.captured = null;`; `src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`); o pointerdown não começa no meio delas.

### C3 em curso
- O leitor chama o escritor dentro do próprio toque: a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` chama `p.onCancel()`; o escritor grava a máquina em `idle` (`src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`) e corre o efeito (`src/editor/input/pointer/events.ts:551` `p.run(next.effect);`); o toque continua depois do retorno e as leituras de `ps.machine.phase === 'idle'` das alças (`src/editor/input/pointer/events.ts:105` `ps.machine.phase === 'idle' ? (chromeControl(`) e do toque de ferramenta (`src/editor/input/pointer/events.ts:64` `ps.machine.phase === 'idle' && shared.open === null`) veem `idle`.
- ok — o toque novo lê a máquina já cancelada.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointerdown (`src/editor/input/pointer.ts:234` `target.removeEventListener('pointerdown', p.onDown, true);`) depois de `src/editor/input/pointer.ts:220` `p.onCancel();` ter cancelado o gesto aberto.
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor chama o cancelamento e segue desde `idle`: `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();`.
