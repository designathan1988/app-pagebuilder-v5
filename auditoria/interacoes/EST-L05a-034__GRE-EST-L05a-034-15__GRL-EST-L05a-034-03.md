# EST-L05a-034 × GRE-EST-L05a-034-15 → GRL-EST-L05a-034-03
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-15 (run): ENT-P-events-0008, ENT-P-motion-0041
- **Leitor:** GRL-EST-L05a-034-03 (o callback): ENT-L05a-0051, ENT-L05a-0052
## Estados deixados por A
- **V-com-a-escolha.** `src/editor/input/pointer/effects.ts:60` `if (pickingDoor !== null) ps.pickAfter = { entry: pickingDoor, args: argsFor(pickingDoor, press, picking) };` — guarda a porta e os argumentos da escolha para o fim do gesto.
- **V-sem-arraste.** `src/editor/input/pointer/effects.ts:169` `ps.dragging = null;` — o fim do gesto larga o arraste.
- **V-sem-a-escolha.** `src/editor/input/pointer/effects.ts:253` `ps.pickAfter = null;` — no fim a escolha é retirada e despachada (`src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`).
- **Sem recusa.** A recusa do comando escolhido não muda a sessão: a escolha é retirada e despachada à mesma.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`).
## Casos
### C1 final
- O escritor já terminou; o callback lê a repetição em `src/editor/input/pointer/events.ts:90` `if (ps.repeating !== hold) return;` e corre o passo (`src/editor/input/pointer/events.ts:91` `repeat(held);`).
- ok — com a repetição a mesma, o passo do controlo roda.

### C2 intermediário
- n/a — o callback reage à repetição deixada; `src/editor/input/pointer/events.ts:90` `if (ps.repeating !== hold) return;` só compara o objeto guardado.

### C3 em curso
- n/a — o callback corre num temporizador (`src/editor/input/pointer/events.ts:92` `hold.timer = window.setInterval(() => repeat(held), REPEAT_INTERVAL);`), fora da execução do escritor.

### C4 desmontagem
- O cancelamento do dono larga a repetição e desarma os seus temporizadores (`src/editor/input/pointer/panels.ts:33` `ps.repeating = null;`).
- ok — depois da desmontagem o callback não é chamado outra vez.

## Resultado
- O leitor repete o passo do controlo enquanto a repetição guardada é a mesma: `src/editor/input/pointer/events.ts:91` `repeat(held);`.
