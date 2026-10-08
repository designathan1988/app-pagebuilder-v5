# EST-L05a-034 × GRE-EST-L05a-034-03 → GRL-EST-L05a-034-13
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-03 (endCancelled): ENT-L05a-0038
- **Leitor:** GRL-EST-L05a-034-13 (resize): ENT-P-view-0103
## Estados deixados por A
- **V-ocioso.** `src/editor/input/pointer/effects.ts:294` `ps.machine = IDLE;` — a máquina volta a ociosa.
- **V-sem-arraste.** `src/editor/input/pointer/effects.ts:292` `ps.dragging = null;` — larga o arraste em curso.
- **V-sem-pressão.** `src/editor/input/pointer/effects.ts:293` `ps.pressed = null;` — larga a pressão guardada.
- **V-do-fim.** `src/editor/input/pointer/effects.ts:295` `p.run(effect);` — corre o efeito (cancelar ou confirmar) por último, quando a máquina já está ociosa.
- **Sem recusa.** O caminho entrega o fim ao gesto; nenhuma linha do grupo lê a recusa de um comando.
- **Sem intermediário.** As três escritas são instruções isoladas (`src/editor/input/pointer/effects.ts:292` `ps.dragging = null;`).
## Casos
### C1 final
- Lê o splitter em `src/editor/input/pointer/resize.ts:18` `if (ps.splitting === null) return;`: sem splitter aberto nada corre.
- Com splitter, despacha o comando com o tamanho do início e a distância (`src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`).
- ok — o leitor lê o splitter deixado e corre o comando.

### C2 intermediário
- n/a — o caminho decide pelo splitter deixado (`src/editor/input/pointer/resize.ts:18` `if (ps.splitting === null) return;`).

### C3 em curso
- n/a — o resize corre a partir do pointermove, fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointermove que chama o resize (`src/editor/input/pointer.ts:236` `target.removeEventListener('pointermove', p.onMove, true);`).
- ok — depois da desmontagem o splitter guardado deixa de ser lido.

## Resultado
- O leitor despacha o comando do splitter com o tamanho do início e a distância do ponteiro: `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`.
