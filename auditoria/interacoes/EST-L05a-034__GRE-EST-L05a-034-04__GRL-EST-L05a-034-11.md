# EST-L05a-034 × GRE-EST-L05a-034-04 → GRL-EST-L05a-034-11
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-04 (o callback): ENT-L05a-0052
- **Leitor:** GRL-EST-L05a-034-11 (onUp): ENT-L05a-0043, ENT-P-view-0087
## Estados deixados por A
- **V-com-o-intervalo.** `src/editor/input/pointer/events.ts:92` `hold.timer = window.setInterval(() => repeat(held), REPEAT_INTERVAL);` — a repetição passa a guardar o intervalo que a repete.
- **V-para.** `src/editor/input/pointer/events.ts:90` `if (ps.repeating !== hold) return;` — se a repetição já não é a mesma, o callback para sem escrever.
- **Sem recusa.** O callback só corre o passo do controlo (`src/editor/input/pointer/events.ts:91` `repeat(held);`).
- **Sem intermediário.** Uma só instrução escreve o temporizador (`src/editor/input/pointer/events.ts:92` `hold.timer = window.setInterval(() => repeat(held), REPEAT_INTERVAL);`).
## Casos
### C1 final
- Lê a repetição em `src/editor/input/pointer/events.ts:437` `if (ps.repeating !== null && event.pointerId === ps.repeating.pointer) {`: a libertação de um controlo que repete para a repetição.
- ok — o leitor lê a repetição deixada e para-a quando é a do ponteiro.

### C2 intermediário
- n/a — o caminho decide pelo estado deixado (`src/editor/input/pointer/events.ts:437` `if (ps.repeating !== null && event.pointerId === ps.repeating.pointer) {`).

### C3 em curso
- n/a — o pointerup corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointerup e cancela os gestos abertos (`src/editor/input/pointer.ts:220` `p.onCancel();`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor confirma o gesto e, no caminho da guia, corre a porta de exclusão guardada no gesto: `src/editor/input/pointer/events.ts:491` `if (dropped && guide !== null && GUIDE_DELETE !== null) gesture.dispatch(GUIDE_DELETE.command.id as CommandId, { ...GUIDE_DELETE.door.args, guide } as never);`.
