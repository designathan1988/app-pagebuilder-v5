# EST-L05a-044 × GRE-EST-L05a-044-01 → GRL-EST-L05a-044-01
- **Estado:** EST-L05a-044
- **Escritor:** GRE-EST-L05a-044-01 (subscribe): ENT-L09b-0075
- **Leitor:** GRL-EST-L05a-044-01 (setRole): ENT-L05a-0006, ENT-L05a-0105
## Estados deixados por A
- **V1 vazio.** `src/editor/persistence/tab-guard.ts:10` `const listeners = new Set<() => void>();` — nenhum ouvinte; é o estado da criação.
- **V2 com ouvintes.** `src/editor/persistence/tab-guard.ts:15` `listeners.add(listener);` — a inscrição do aviso da aba (`src/editor/shell/tab-guard.tsx:16` `const role = useSyncExternalStore(tabRole.subscribe, tabRole.get);`) acrescenta o ouvinte do React ao conjunto.
- **V1 de novo, pela remoção.** `src/editor/persistence/tab-guard.ts:16` `return () => listeners.delete(listener);` — a desmontagem do aviso tira o ouvinte que a inscrição acrescentou.
- **Sem intermediário.** o acréscimo (`src/editor/persistence/tab-guard.ts:15` `listeners.add(listener);`) e a remoção (`src/editor/persistence/tab-guard.ts:16` `return () => listeners.delete(listener);`) são uma só instrução síncrona cada.
- **Sem recusa.** Nenhuma linha do grupo depende da recusa de um comando.

## Casos
### C1 final
- O leitor percorre uma cópia do conjunto quando o papel muda: `src/editor/persistence/tab-guard.ts:22` `for (const listener of [...listeners]) listener();`; com V2, chama o ouvinte do React, que lê o papel novo e redesenha o aviso; com V1, não chama ninguém.
- ok — o leitor chama exatamente os ouvintes que as inscrições deixaram.

### C2 intermediário
- n/a — o acréscimo e a remoção são uma só instrução cada (`src/editor/persistence/tab-guard.ts:15` `listeners.add(listener);`).

### C3 em curso
- A passagem corre sobre a cópia feita uma vez (`src/editor/persistence/tab-guard.ts:22` `for (const listener of [...listeners]) listener();`): uma inscrição ou remoção feita durante a passagem não altera a passagem em curso.
- ok — a passagem lê o conjunto tal como estava quando a cópia foi feita.

### C4 desmontagem
- A desmontagem do aviso tira o ouvinte (`src/editor/persistence/tab-guard.ts:16` `return () => listeners.delete(listener);`); a passagem seguinte não o chama.
- ok — depois da desmontagem o ouvinte do aviso deixa de ser chamado.

## Resultado
- O leitor chama cada ouvinte inscrito, e o aviso da aba redesenha com o papel novo: `src/editor/persistence/tab-guard.ts:22` `for (const listener of [...listeners]) listener();`.
