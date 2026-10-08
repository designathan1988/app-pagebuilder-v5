# EST-L05a-034 × GRE-EST-L05a-034-04 → GRL-EST-L05a-034-02
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-04 (o callback): ENT-L05a-0052
- **Leitor:** GRL-EST-L05a-034-02 (dropTool): ENT-L05a-0033
## Estados deixados por A
- **V-com-o-intervalo.** `src/editor/input/pointer/events.ts:92` `hold.timer = window.setInterval(() => repeat(held), REPEAT_INTERVAL);` — a repetição passa a guardar o intervalo que a repete.
- **V-para.** `src/editor/input/pointer/events.ts:90` `if (ps.repeating !== hold) return;` — se a repetição já não é a mesma, o callback para sem escrever.
- **Sem recusa.** O callback só corre o passo do controlo (`src/editor/input/pointer/events.ts:91` `repeat(held);`).
- **Sem intermediário.** Uma só instrução escreve o temporizador (`src/editor/input/pointer/events.ts:92` `hold.timer = window.setInterval(() => repeat(held), REPEAT_INTERVAL);`).
## Casos
### C1 final
- O escritor já terminou; o dropTool lê a ferramenta em `src/editor/input/pointer/tools.ts:11` `if (ps.tooling === null) return;`.
- Com ferramenta, larga-a (`src/editor/input/pointer/tools.ts:13` `ps.tooling = null;`) e cancela a sessão e o gesto (`src/editor/input/pointer/tools.ts:16` `gesture.cancel();`).
- ok — o leitor larga a ferramenta e desfaz o que ela fez.

### C2 intermediário
- n/a — o caminho reage à ferramenta deixada; a ferramenta é um só campo (`src/editor/input/pointer/tools.ts:11` `if (ps.tooling === null) return;`).

### C3 em curso
- n/a — o dropTool corre numa microtarefa (`src/editor/input/pointer.ts:153` `queueMicrotask(p.dropTool);`), fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono do ponteiro remove as assinaturas da store (`src/editor/input/pointer.ts:216` `stopListening();`) e cancela já a ferramenta (`src/editor/input/pointer.ts:220` `p.onCancel();`).
- ok — depois da desmontagem o dropTool deixa de ser agendado.

## Resultado
- O leitor larga a ferramenta e cancela a sessão e o gesto dela: `src/editor/input/pointer/tools.ts:16` `gesture.cancel();`.
