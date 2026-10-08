# EST-L05a-034 × GRE-EST-L05a-034-12 → GRL-EST-L05a-034-04
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-12 (onUp): ENT-L05a-0043
- **Leitor:** GRL-EST-L05a-034-04 (o ouvinte): ENT-L05a-0032, ENT-L05a-0034, ENT-L05a-0035, ENT-L05a-0036, ENT-L05a-0037
## Estados deixados por A
- **V-sem-captura.** `src/editor/input/pointer/events.ts:434` `if (event.pointerId === ps.captured) ps.captured = null;` — larga o ponteiro capturado quando era o da libertação.
- **V-com-a-tecla.** `src/editor/input/pointer/events.ts:436` `ps.releaseModifier = modifierOf(event);` — guarda a tecla presa na libertação.
- **V-com-a-máquina.** `src/editor/input/pointer/events.ts:540` `ps.machine = next.machine;` — grava a máquina já confirmada.
- **Sem recusa.** O caminho entrega o commit ao gesto; a recusa de um comando não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:540` `ps.machine = next.machine;`).
## Casos
### C1 final
- O escritor terminou; a assinatura da store (`src/editor/input/pointer.ts:149` `const stopListening = store.subscribe(() => {`) lê a sessão a cada mudança.
- Larga as alças canceladas (`src/editor/input/pointer.ts:157` `if (ps.spacing?.gesture != null && store.getState().ui.drag.cancels !== ps.spacing.cancels) {`) e redesenha o gesto aberto (`src/editor/input/pointer.ts:193` `p.redraw(ps.pointerAt, false);`).
- ok — o leitor lê a sessão deixada e larga o que foi cancelado.

### C2 intermediário
- n/a — a assinatura dispara numa publicação da store (`src/editor/input/pointer.ts:149` `const stopListening = store.subscribe(() => {`), quando o escritor já completou a instrução que a provocou.

### C3 em curso
- O ouvinte pode ser chamado no meio do escritor: o escritor despacha comandos pelo gesto, e a store avisa os assinantes dentro desse despacho (`src/editor/input/pointer.ts:152` `if (ps.tooling !== null && store.getState().ui.drag.cancels !== ps.tooling.cancels) {`).
- A leitura é do estado da sessão já escrito até ali; um campo ainda por escrever aparece como estava.
- ok — a leitura em curso vê a sessão a meio do escritor.

### C4 desmontagem
- O desmonte do dono remove a assinatura (`src/editor/input/pointer.ts:216` `stopListening();`).
- ok — depois da desmontagem o ouvinte deixa de correr.

## Resultado
- O leitor larga os gestos cancelados e redesenha o gesto aberto a partir da sessão: `src/editor/input/pointer.ts:193` `p.redraw(ps.pointerAt, false);`.
