# EST-L05a-034 × GRE-EST-L05a-034-08 → GRL-EST-L05a-034-08
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-08 (onDown): ENT-L05a-0040, ENT-L05a-0051
- **Leitor:** GRL-EST-L05a-034-08 (onMouseDown): ENT-L05a-0047
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
- Lê o pedido de manter o foco em `src/editor/input/pointer/events.ts:574` `const keep = ps.keepFocus;` e consome-o (`src/editor/input/pointer/events.ts:575` `ps.keepFocus = false;`).

Com E-reinício, o leitor encontra a sessão como depois de um cancelamento seguido de um toque novo: o cancelamento esvaziou o arraste, a banda e os estados de gesto (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`) e a máquina está em `pressed` com o toque novo — os mesmos valores que o cancelamento e o toque novo já deixam neste par. ok
- Com o pedido, impede a ação por omissão do navegador (`src/editor/input/pointer/events.ts:577` `if (keep || toolbar || onOwnOption(event.target) || (event.button === 2 && event.target instanceof Element && event.target.closest(EDITOR_MENU_AREA))) event.preventDefault();`).
- ok — o leitor lê e consome o pedido.

### C2 intermediário
- n/a — `src/editor/input/pointer/events.ts:575` `ps.keepFocus = false;` é uma só instrução.

### C3 em curso
- n/a — o mousedown corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de mousedown (`src/editor/input/pointer.ts:241` `target.removeEventListener('mousedown', p.onMouseDown, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor impede o navegador de tirar o foco quando o pedido guardado existe: `src/editor/input/pointer/events.ts:577` `if (keep || toolbar || onOwnOption(event.target) || (event.button === 2 && event.target instanceof Element && event.target.closest(EDITOR_MENU_AREA))) event.preventDefault();`.
