# EST-L05a-034 × GRE-EST-L05a-034-09 → GRL-EST-L05a-034-03
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-09 (onLostCapture): ENT-L05a-0045
- **Leitor:** GRL-EST-L05a-034-03 (o callback): ENT-L05a-0051, ENT-L05a-0052
## Estados deixados por A
- **V-sem-captura.** `src/editor/input/pointer/events.ts:557` `ps.captured = null;` — larga o ponteiro capturado.
- **V-intacto.** `src/editor/input/pointer/events.ts:556` `if (event.pointerId !== ps.captured) return;` — a captura perdida de outro ponteiro não escreve.
- **V-adicional.** `src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();` — com o botão ainda pressionado, cancela o gesto (a máquina é escrita pelo grupo de onCancel).
- **Sem recusa.** O caminho não despacha comando.
- **Sem intermediário.** `src/editor/input/pointer/events.ts:557` `ps.captured = null;` é uma só instrução.
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
