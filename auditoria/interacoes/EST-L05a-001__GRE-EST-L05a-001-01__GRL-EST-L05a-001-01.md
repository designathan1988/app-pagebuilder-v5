# EST-L05a-001 × GRE-EST-L05a-001-01 → GRL-EST-L05a-001-01
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-01 (gesture): ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082, ENT-P-view-0087, ENT-P-view-0103
- **Leitor:** GRL-EST-L05a-001-01 (answer): ENT-L09a-0071, ENT-L09a-0072
## Estados deixados por A
- **V-gravada-ao-abrir-gesto.** `src/editor/store.ts:205` `      keepTyping();` — a abertura do gesto grava a digitação pendente antes de o gesto servir.
- **V-antes-da-medida.** `src/editor/input/pointer/events.ts:58` `    keepTypingBefore(event.target);` — a pressão grava a digitação antes de medir a caixa da seleção.
- **V-sem-digitacao.** `src/editor/input/pending.ts:46` `  if (typing === null) return;` — sem digitação pendente nada é gravado.

## Casos
### C1 final
- O escritor terminou: a resposta é entregue; o estado é o do comando confirmado (`src/core/store/store.ts:697` `        publish(commit({ ...state, confirmation: null }, waiting.command));`).
- O leitor chega ao responder à confirmação: `src/editor/store.ts:201` `      keepTyping();` — a digitação pendente é posta em dia antes de responder.
- ok — a resposta grava a digitação antes de correr o comando.
### C2 intermediário
- n/a — a digitação é gravada numa chamada só (`src/editor/input/pending.ts:47` `  held = null;`).
### C3 em curso
- O leitor corre antes de a store responder: `src/editor/store.ts:201` `      keepTyping();`.
- ok — no meio do caminho o leitor lê e grava a digitação pendente.
### C4 desmontagem
- n/a — a leitura é de uma função do store do editor, sem assinatura de componente (`src/editor/store.ts:200` `    answer: (confirmed) => {`).

## Resultado
- O leitor grava a digitação pendente antes de responder à confirmação: `src/editor/store.ts:201` `      keepTyping();`.
