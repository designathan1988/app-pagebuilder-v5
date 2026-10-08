# EST-L05a-034 × GRE-EST-L05a-034-15 → GRL-EST-L05a-034-13
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-15 (run): ENT-P-events-0008, ENT-P-motion-0041
- **Leitor:** GRL-EST-L05a-034-13 (resize): ENT-P-view-0103
## Estados deixados por A
- **V-com-a-escolha.** `src/editor/input/pointer/effects.ts:60` `if (pickingDoor !== null) ps.pickAfter = { entry: pickingDoor, args: argsFor(pickingDoor, press, picking) };` — guarda a porta e os argumentos da escolha para o fim do gesto.
- **V-sem-arraste.** `src/editor/input/pointer/effects.ts:169` `ps.dragging = null;` — o fim do gesto larga o arraste.
- **V-sem-a-escolha.** `src/editor/input/pointer/effects.ts:253` `ps.pickAfter = null;` — no fim a escolha é retirada e despachada (`src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`).
- **Sem recusa.** A recusa do comando escolhido não muda a sessão: a escolha é retirada e despachada à mesma.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`).
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
