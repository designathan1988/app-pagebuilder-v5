# EST-L05a-034 × GRE-EST-L05a-034-06 → GRL-EST-L05a-034-03
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-06 (offer): ENT-L05a-0054
- **Leitor:** GRL-EST-L05a-034-03 (o callback): ENT-L05a-0051, ENT-L05a-0052
## Estados deixados por A
- **V-sem-oferta.** `src/editor/input/pointer/drag.ts:95` `ps.dragging.side = null;` — sem alvo nem porta, larga a oferta lateral.
- **V-oferta-desarmada.** `src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };` — a oferta nova entra desarmada, com a recusa que o envolvimento encontraria guardada.
- **V-da-permanência.** `src/editor/input/pointer/drag.ts:105` `ps.dwell = setTimeout(() => {` arma a permanência da oferta; `src/editor/input/pointer/drag.ts:92` `if (ps.dwell !== null) clearTimeout(ps.dwell);` desarma o temporizador anterior.
- **V-oferta-armada.** `src/editor/input/pointer/drag.ts:108` `ps.dragging.side = { ...ps.dragging.side, armed: true, pill: { x: ps.pointerAt.x + PILL_OFFSET[0], y: ps.pointerAt.y + PILL_OFFSET[1] } };` — a oferta confirmada fica armada, com a pílula desenhada no ponteiro.
- **Sem recusa.** A recusa entra como dado da oferta (`src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };`); nenhuma linha do grupo deixa de escrever por causa dela.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };`).
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
