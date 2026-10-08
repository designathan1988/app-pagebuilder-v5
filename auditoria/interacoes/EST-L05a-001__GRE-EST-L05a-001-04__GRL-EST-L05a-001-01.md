# EST-L05a-001 × GRE-EST-L05a-001-04 → GRL-EST-L05a-001-01
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-04 (releaseTyping): ENT-L09a-0129, ENT-L09a-0131, ENT-L09a-0132, ENT-L09a-0133, ENT-L09a-0134
- **Leitor:** GRL-EST-L05a-001-01 (answer): ENT-L09a-0071, ENT-L09a-0072
## Estados deixados por A
- **V-solta.** `src/editor/input/pending.ts:37` `  if (held?.field === field) held = null;` — a digitação do campo dado volta a `null`.
- **V-ao-voltar-ao-mostrado.** `src/editor/shell/field.tsx:1781` `      if (element.value === typing.shown) releaseTyping(element);` — texto de volta ao mostrado solta a digitação.
- **V-ao-restaurar.** `src/editor/shell/field.tsx:1739` `    releaseTyping(element);` — restaurar o campo solta a digitação pendente.
- **V-de-outro-campo-fica.** `src/editor/input/pending.ts:37` `  if (held?.field === field) held = null;` — campo diferente: a digitação pendente continua.

## Casos
### C1 final
- O escritor terminou: a resposta é entregue; o estado é o do comando confirmado (`src/core/store/store.ts:697` `        publish(commit({ ...state, confirmation: null }, waiting.command));`).
- O leitor chega ao responder à confirmação: `src/editor/store.ts:213` `      keepTyping();` — a digitação pendente é posta em dia antes de responder.
- ok — a resposta grava a digitação antes de correr o comando.
### C2 intermediário
- n/a — a digitação é gravada numa chamada só (`src/editor/input/pending.ts:47` `  held = null;`).
### C3 em curso
- O leitor corre antes de a store responder: `src/editor/store.ts:213` `      keepTyping();`.
- ok — no meio do caminho o leitor lê e grava a digitação pendente.
### C4 desmontagem
- n/a — a leitura é de uma função do store do editor, sem assinatura de componente (`src/editor/store.ts:212` `    answer: (confirmed) => {`).

## Resultado
- O leitor grava a digitação pendente antes de responder à confirmação: `src/editor/store.ts:213` `      keepTyping();`.
