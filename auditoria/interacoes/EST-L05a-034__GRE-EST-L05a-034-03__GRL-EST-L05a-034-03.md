# EST-L05a-034 × GRE-EST-L05a-034-03 → GRL-EST-L05a-034-03
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-03 (endCancelled): ENT-L05a-0038
- **Leitor:** GRL-EST-L05a-034-03 (o callback): ENT-L05a-0051, ENT-L05a-0052
## Estados deixados por A
- **V-ocioso.** `src/editor/input/pointer/effects.ts:294` `ps.machine = IDLE;` — a máquina volta a ociosa.
- **V-sem-arraste.** `src/editor/input/pointer/effects.ts:292` `ps.dragging = null;` — larga o arraste em curso.
- **V-sem-pressão.** `src/editor/input/pointer/effects.ts:293` `ps.pressed = null;` — larga a pressão guardada.
- **V-do-fim.** `src/editor/input/pointer/effects.ts:295` `p.run(effect);` — corre o efeito (cancelar ou confirmar) por último, quando a máquina já está ociosa.
- **Sem recusa.** O caminho entrega o fim ao gesto; nenhuma linha do grupo lê a recusa de um comando.
- **Sem intermediário.** As três escritas são instruções isoladas (`src/editor/input/pointer/effects.ts:292` `ps.dragging = null;`).
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
