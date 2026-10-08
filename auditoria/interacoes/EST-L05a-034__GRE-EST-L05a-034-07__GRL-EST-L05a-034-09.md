# EST-L05a-034 × GRE-EST-L05a-034-07 → GRL-EST-L05a-034-09
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-07 (onCancel): ENT-L05a-0044, ENT-L05a-0048
- **Leitor:** GRL-EST-L05a-034-09 (onMove): ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082
## Estados deixados por A
- **V-cancelado.** `src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;` — grava a máquina já cancelada.
- **V-sem-captura.** `src/editor/input/pointer/events.ts:545` `ps.captured = null;` — larga o ponteiro capturado.
- **V-sem-deslizador.** `src/editor/input/pointer/events.ts:546` `ps.sliding = null;` — larga o deslizador de campo.
- **V-sem-gestos-de-alça.** `src/editor/input/pointer/events.ts:548` `p.dropHandleGestures();` — larga os gestos das alças abertos (a ferramenta incluída).
- **Sem recusa.** O caminho entrega o cancelamento ao gesto (`src/editor/input/pointer/events.ts:551` `p.run(next.effect);`); a recusa de um comando não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:545` `ps.captured = null;`).
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
