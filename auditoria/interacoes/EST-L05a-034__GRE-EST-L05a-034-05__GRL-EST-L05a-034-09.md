# EST-L05a-034 × GRE-EST-L05a-034-05 → GRL-EST-L05a-034-09
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-05 (o ouvinte): ENT-L05a-0034, ENT-L05a-0035, ENT-L05a-0036, ENT-L05a-0037
- **Leitor:** GRL-EST-L05a-034-09 (onMove): ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082
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
- O leitor lê o gesto do arraste guardado na sessão e despacha o passo do comando pelo gesto (`src/editor/input/pointer/events.ts:343` `ps.guiding.gesture.dispatch(create.command.id as CommandId, { ...create.door.args, axis: ps.guiding.axis, at } as never);`).
- ok — com o gesto guardado, o comando corre no contexto do arraste.

### C2 intermediário
- n/a — o caminho reage ao gesto deixado (`src/editor/input/pointer/events.ts:327` `ps.guiding.gesture = store.gesture();`) e não a um meio.

### C3 em curso
- n/a — o pointermove corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointermove (`src/editor/input/pointer.ts:236` `target.removeEventListener('pointermove', p.onMove, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor despacha o comando do arraste pelo gesto guardado na sessão: `src/editor/input/pointer/events.ts:343` `ps.guiding.gesture.dispatch(create.command.id as CommandId, { ...create.door.args, axis: ps.guiding.axis, at } as never);`.
