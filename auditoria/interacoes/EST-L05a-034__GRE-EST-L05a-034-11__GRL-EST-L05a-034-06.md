# EST-L05a-034 × GRE-EST-L05a-034-11 → GRL-EST-L05a-034-06
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-11 (onMove): ENT-L05a-0042, ENT-L05a-0053, ENT-P-motion-0045, ENT-P-motion-0046, ENT-P-motion-0047, ENT-P-motion-0052, ENT-P-motion-0057, ENT-P-motion-0066, ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082, ENT-P-view-0087
- **Leitor:** GRL-EST-L05a-034-06 (onDown): ENT-L05a-0040
## Estados deixados por A
- **V-com-a-máquina.** `src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;` — grava a máquina (a passagem a dragging).
- **V-do-menu.** `src/editor/input/pointer/events.ts:265` `ps.menuResting = menuUnder;` grava o botão de menu sob o ponteiro; `src/editor/input/pointer/events.ts:267` `if (ps.menuDwell !== null) clearTimeout(ps.menuDwell);` desarma o temporizador anterior e `src/editor/input/pointer/events.ts:270` `else ps.menuDwell = setTimeout(() => setMenuOver(menuUnder), MENU_HOVER_SWITCH);` arma o novo.
- **V-do-gesto-da-guia.** `src/editor/input/pointer/events.ts:327` `ps.guiding.gesture = store.gesture();` — o gesto do arraste de guia aberto ao passar o limiar.
- **Sem recusa.** O caminho só regista o movimento; a recusa de um comando despachado não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;`).
## Casos
### C1 final
- Estado deixado: a máquina em `dragging` (`src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;`; `src/editor/input/pointer/machine.ts:93` `return { machine: { ...machine, phase: 'dragging' }, effect: 'drag' };`) ou o gesto de guia aberto (`src/editor/input/pointer/events.ts:327` `ps.guiding.gesture = store.gesture();`). Com a máquina em `pressed` ou `dragging` do mesmo ponteiro, o `step` devolve `restart` (`src/editor/input/pointer/machine.ts:88` `if (event.type === 'down' && event.pointer === machine.pointer) return { machine: { phase: 'pressed', pointer: event.pointer, start: event.at, press: event.press }, effect: 'restart' };`), `lost` fica verdadeiro e a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` chama `p.onCancel()`, que grava a máquina em `idle` (`src/editor/input/pointer/events.ts:549` `const next = step(ps.machine, { type: 'cancel' });`; `src/editor/input/pointer/machine.ts:80` `if (event.type === 'cancel') return machine.phase === 'idle' ? { machine, effect: null } : { machine: IDLE, effect: 'cancel' };`; `src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`) antes das leituras de `idle` das alças e do pan (`src/editor/input/pointer/events.ts:105` `ps.machine.phase === 'idle' ? (chromeControl(`).
- Com a guia aberta, o termo `ps.guiding !== null` da condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` chama `p.onCancel()` e as alças são largadas (`src/editor/input/pointer/events.ts:548` `p.dropHandleGestures();`).
- ok — o toque novo cancela o arraste ou a guia que o movimento deixou aberto.

### C2 intermediário
- Abaixo do limiar o movimento deixa a máquina em `pressed` (`src/editor/input/pointer/machine.ts:95` `return { machine, effect: null };`). Com a máquina em `pressed` ou `dragging` do mesmo ponteiro, o `step` devolve `restart` (`src/editor/input/pointer/machine.ts:88` `if (event.type === 'down' && event.pointer === machine.pointer) return { machine: { phase: 'pressed', pointer: event.pointer, start: event.at, press: event.press }, effect: 'restart' };`), `lost` fica verdadeiro e a condição de `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();` chama `p.onCancel()`, que grava a máquina em `idle` (`src/editor/input/pointer/events.ts:549` `const next = step(ps.machine, { type: 'cancel' });`; `src/editor/input/pointer/machine.ts:80` `if (event.type === 'cancel') return machine.phase === 'idle' ? { machine, effect: null } : { machine: IDLE, effect: 'cancel' };`; `src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`) antes das leituras de `idle` das alças e do pan (`src/editor/input/pointer/events.ts:105` `ps.machine.phase === 'idle' ? (chromeControl(`).
- ok — o toque novo do mesmo ponteiro cancela o clique ainda não decidido.

### C3 em curso
- n/a — o pointermove corre como evento seu (`src/editor/input/pointer/events.ts:235` `const onMove = (event: PointerEvent) => {`), e o pointerdown corre como outro; um não começa dentro do outro.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointerdown (`src/editor/input/pointer.ts:234` `target.removeEventListener('pointerdown', p.onDown, true);`) depois de `src/editor/input/pointer.ts:220` `p.onCancel();` ter cancelado o gesto do movimento.
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor cancela o arraste, a guia ou o clique em curso que o movimento deixou: `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || ps.guiding !== null || ps.rotating !== null || ps.resizing !== null || shared.panning !== null || ps.pickingColor !== null || ps.sliding !== null || ps.tooling !== null) p.onCancel();`.
