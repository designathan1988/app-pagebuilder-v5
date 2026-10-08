# EST-L05a-034 × GRE-EST-L05a-034-02 → GRL-EST-L05a-034-09
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-02 (dropTool): ENT-L05a-0033
- **Leitor:** GRL-EST-L05a-034-09 (onMove): ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082
## Estados deixados por A
- **V-sem-ferramenta.** `src/editor/input/pointer/tools.ts:11` `if (ps.tooling === null) return;` — sem ferramenta o campo fica como estava.
- **V-larga-a-ferramenta.** `src/editor/input/pointer/tools.ts:13` `ps.tooling = null;` — larga a ferramenta; a sessão e o gesto dela são cancelados logo depois (`src/editor/input/pointer/tools.ts:15` `session.cancel();`).
- **Sem recusa.** O caminho não despacha comando: cancela a sessão e o gesto da ferramenta (`src/editor/input/pointer/tools.ts:16` `gesture.cancel();`).
- **Sem intermediário.** `src/editor/input/pointer/tools.ts:13` `ps.tooling = null;` é uma só instrução.
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
