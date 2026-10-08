# EST-L05a-034 × GRE-EST-L05a-034-11 → GRL-EST-L05a-034-15
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-11 (onMove): ENT-L05a-0042, ENT-L05a-0053, ENT-P-motion-0045, ENT-P-motion-0046, ENT-P-motion-0047, ENT-P-motion-0052, ENT-P-motion-0057, ENT-P-motion-0066, ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082, ENT-P-view-0087
- **Leitor:** GRL-EST-L05a-034-15 (run): ENT-P-events-0008, ENT-P-motion-0041
## Estados deixados por A
- **V-com-a-máquina.** `src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;` — grava a máquina (a passagem a dragging).
- **V-do-menu.** `src/editor/input/pointer/events.ts:265` `ps.menuResting = menuUnder;` grava o botão de menu sob o ponteiro; `src/editor/input/pointer/events.ts:267` `if (ps.menuDwell !== null) clearTimeout(ps.menuDwell);` desarma o temporizador anterior e `src/editor/input/pointer/events.ts:270` `else ps.menuDwell = setTimeout(() => setMenuOver(menuUnder), MENU_HOVER_SWITCH);` arma o novo.
- **V-do-gesto-da-guia.** `src/editor/input/pointer/events.ts:327` `ps.guiding.gesture = store.gesture();` — o gesto do arraste de guia aberto ao passar o limiar.
- **Sem recusa.** O caminho só regista o movimento; a recusa de um comando despachado não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;`).
## Casos
### C1 final
- Lê a escolha guardada em `src/editor/input/pointer/effects.ts:253` `ps.pickAfter = null;` e despacha-a (`src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`).
- ok — o leitor lê a escolha deixada e corre o comando dela.

### C2 intermediário
- n/a — o run reage ao efeito da máquina, quando o escritor já completou a instrução (`src/editor/input/pointer/effects.ts:60` `if (pickingDoor !== null) ps.pickAfter = { entry: pickingDoor, args: argsFor(pickingDoor, press, picking) };`).

### C3 em curso
- O run do fim do gesto despacha pelo gesto (`src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`); a store avisa os assinantes dentro desse despacho, e a máquina já foi largada antes (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`).
- ok — a leitura em curso vê a sessão com a máquina já largada.

### C4 desmontagem
- O cancelamento do dono leva a máquina a ociosa (`src/editor/input/pointer/effects.ts:294` `ps.machine = IDLE;`) e retira a escolha (`src/editor/input/pointer/effects.ts:253` `ps.pickAfter = null;`).
- ok — depois da desmontagem não fica escolha por despachar.

## Resultado
- O leitor retira a escolha guardada e corre o comando dela: `src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`.
