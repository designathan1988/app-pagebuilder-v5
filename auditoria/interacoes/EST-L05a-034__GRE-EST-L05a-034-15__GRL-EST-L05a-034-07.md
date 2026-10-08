# EST-L05a-034 × GRE-EST-L05a-034-15 → GRL-EST-L05a-034-07
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-15 (run): ENT-P-events-0008, ENT-P-motion-0041
- **Leitor:** GRL-EST-L05a-034-07 (onLostCapture): ENT-L05a-0045
## Estados deixados por A
- **V-com-a-escolha.** `src/editor/input/pointer/effects.ts:60` `if (pickingDoor !== null) ps.pickAfter = { entry: pickingDoor, args: argsFor(pickingDoor, press, picking) };` — guarda a porta e os argumentos da escolha para o fim do gesto.
- **V-sem-arraste.** `src/editor/input/pointer/effects.ts:169` `ps.dragging = null;` — o fim do gesto larga o arraste.
- **V-sem-a-escolha.** `src/editor/input/pointer/effects.ts:253` `ps.pickAfter = null;` — no fim a escolha é retirada e despachada (`src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`).
- **Sem recusa.** A recusa do comando escolhido não muda a sessão: a escolha é retirada e despachada à mesma.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`).
## Casos
### C1 final
- Lê o ponteiro capturado em `src/editor/input/pointer/events.ts:556` `if (event.pointerId !== ps.captured) return;`: só o ponteiro capturado conta.
- Larga a captura (`src/editor/input/pointer/events.ts:557` `ps.captured = null;`) e, com o botão ainda pressionado, cancela o gesto (`src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();`).
- ok — o leitor lê a captura deixada e cancela o gesto correspondente.

### C2 intermediário
- n/a — `src/editor/input/pointer/events.ts:556` `if (event.pointerId !== ps.captured) return;` só compara o identificador do ponteiro.

### C3 em curso
- n/a — o evento da captura perdida corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de lostpointercapture (`src/editor/input/pointer.ts:239` `target.removeEventListener('lostpointercapture', p.onLostCapture, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor larga a captura e, com o botão ainda pressionado, cancela o gesto: `src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();`.
