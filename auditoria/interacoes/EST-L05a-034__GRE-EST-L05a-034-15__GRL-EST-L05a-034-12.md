# EST-L05a-034 × GRE-EST-L05a-034-15 → GRL-EST-L05a-034-12
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-15 (run): ENT-P-events-0008, ENT-P-motion-0041
- **Leitor:** GRL-EST-L05a-034-12 (over): ENT-L05a-0058
## Estados deixados por A
- **V-com-a-escolha.** `src/editor/input/pointer/effects.ts:60` `if (pickingDoor !== null) ps.pickAfter = { entry: pickingDoor, args: argsFor(pickingDoor, press, picking) };` — guarda a porta e os argumentos da escolha para o fim do gesto.
- **V-sem-arraste.** `src/editor/input/pointer/effects.ts:169` `ps.dragging = null;` — o fim do gesto larga o arraste.
- **V-sem-a-escolha.** `src/editor/input/pointer/effects.ts:253` `ps.pickAfter = null;` — no fim a escolha é retirada e despachada (`src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`).
- **Sem recusa.** A recusa do comando escolhido não muda a sessão: a escolha é retirada e despachada à mesma.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/effects.ts:169` `ps.dragging = null;`).
## Casos
### C1 final
- Lê o arraste em `src/editor/input/pointer/drag.ts:206` `if (ps.dragging === null) return;`: sem arraste aberto nada corre.
- Com arraste, publica a proposta (`src/editor/input/pointer/drag.ts:223` `p.redraw(at, creation || ps.dragging.dragged.length > 0 || offered !== ps.dragging.side);`).
- ok — o leitor lê o arraste deixado e publica a proposta.

### C2 intermediário
- n/a — o over reage à proposta deixada (`src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;`).

### C3 em curso
- n/a — o over corre a partir do pointermove ou do quadro de autoscroll, fora da execução do escritor.

### C4 desmontagem
- O fim do gesto larga o arraste (`src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`) e o desmonte do dono cancela o gesto (`src/editor/input/pointer.ts:220` `p.onCancel();`).
- ok — sem arraste aberto o leitor para na primeira condição.

## Resultado
- O leitor publica a proposta desenhada e retoma o quadro do autoscroll a partir do arraste: `src/editor/input/pointer/drag.ts:224` `if (ps.scrolling === 0) ps.scrolling = requestAnimationFrame(p.autoscroll);`.
