# EST-L05a-034 × GRE-EST-L05a-034-05 → GRL-EST-L05a-034-15
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-05 (o ouvinte): ENT-L05a-0034, ENT-L05a-0035, ENT-L05a-0036, ENT-L05a-0037
- **Leitor:** GRL-EST-L05a-034-15 (run): ENT-P-events-0008, ENT-P-motion-0041
## Estados deixados por A
- **V-sem-faixa.** `src/editor/input/pointer.ts:159` `ps.spacing = null;` — Escape durante a faixa de espaçamento larga-a.
- **V-sem-guia.** `src/editor/input/pointer.ts:168` `ps.guiding = null;` — Escape durante o arraste de guia larga-a.
- **V-sem-rotação.** `src/editor/input/pointer.ts:177` `ps.rotating = null;` — Escape durante a rotação larga-a.
- **V-sem-redimensionamento.** `src/editor/input/pointer.ts:185` `ps.resizing = null;` — Escape durante o redimensionamento larga-o.
- **V-do-redesenho.** `src/editor/input/pointer.ts:193` `p.redraw(ps.pointerAt, false);` — sem cancelamento novo, o gesto aberto é redesenhado sem publicar.
- **Sem recusa.** Cada largada depende da contagem de cancelamentos da store (`src/editor/input/pointer.ts:157` `if (ps.spacing?.gesture != null && store.getState().ui.drag.cancels !== ps.spacing.cancels) {`); a recusa de um comando não muda a sessão.
- **Sem intermediário.** Cada largada é uma só instrução (`src/editor/input/pointer.ts:159` `ps.spacing = null;`).
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
