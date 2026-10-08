# EST-L05a-045 × GRE-EST-L05a-045-01 → GRL-EST-L05a-045-01
- **Estado:** EST-L05a-045
- **Escritor:** GRE-EST-L05a-045-01 (ask): ENT-L05a-0006, ENT-L05a-0104
- **Leitor:** GRL-EST-L05a-045-01 (ask): ENT-L05a-0104
## Estados deixados por A
- **V1 0.** `src/editor/persistence/tab-guard.ts:36` `let tries = 0;` — nenhuma tentativa; é o valor da criação.
- **V2 incrementado.** `src/editor/persistence/tab-guard.ts:42` `tries += 1;` — cada tentativa com a trava com outra aba acrescenta um.
- **V3 igual a RETRIES.** `src/editor/persistence/tab-guard.ts:47` `setRole('readOnly');` — esgotadas as tentativas, a aba fica somente leitura.
- **V4 interrompido.** `src/editor/persistence/tab-guard.ts:51` `setRole('editing');` — a trava tomada interrompe a contagem.
- **Sem intermediário.** `src/editor/persistence/tab-guard.ts:42` `tries += 1;` é uma só instrução síncrona.
- **Sem recusa.** As linhas do grupo dependem do resultado da trava, não da recusa de um comando.

## Casos
### C1 final
- O escritor terminou uma tentativa; o leitor lê a contagem em `src/editor/persistence/tab-guard.ts:43` `if (tries < RETRIES) {`.
- ok — o leitor lê o número de tentativas que o escritor deixou.

### C2 intermediário
- n/a — `src/editor/persistence/tab-guard.ts:42` `tries += 1;` é uma só instrução.

### C3 em curso
- n/a — a tentativa corre na devolução assíncrona da trava; a leitura segue-a, sem meio.

### C4 desmontagem
- A contagem vive na promessa de claimEditing (`src/editor/persistence/tab-guard.ts:37` `return new Promise((resolve) => {`); o caminho para quando a trava é tomada (`src/editor/persistence/tab-guard.ts:51` `setRole('editing');`).
- ok — terminado o pedido, a contagem deixa de ser lida.

## Resultado
- O leitor decide entre tentar de novo e ficar somente leitura a partir da contagem que o escritor deixou: `src/editor/persistence/tab-guard.ts:43` `if (tries < RETRIES) {`.
