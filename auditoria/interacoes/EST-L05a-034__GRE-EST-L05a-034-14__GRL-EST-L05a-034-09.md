# EST-L05a-034 × GRE-EST-L05a-034-14 → GRL-EST-L05a-034-09
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-14 (rest): ENT-L05a-0057
- **Leitor:** GRL-EST-L05a-034-09 (onMove): ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082
## Estados deixados por A
- **V-intacto.** `src/editor/input/pointer/drag.ts:177` `if (ps.dragging === null) return;` — sem arraste aberto nada é escrito.
- **V-com-a-linha.** `src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;` — guarda a linha dobrada em que o ponteiro repousa.
- **V-do-temporizador.** `src/editor/input/pointer/drag.ts:186` `ps.unfold = setTimeout(() => {` — arma a abertura da linha com a permanência lida.
- **Sem recusa.** O caminho não despacha comando por si: a abertura corre no gesto aberto (`src/editor/input/pointer/drag.ts:189` `shared.open?.dispatch(dwell.command.id as CommandId, { ...dwell.door.args, target: folded } as never);`).
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:180` `ps.dragging.resting = folded;`).
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
