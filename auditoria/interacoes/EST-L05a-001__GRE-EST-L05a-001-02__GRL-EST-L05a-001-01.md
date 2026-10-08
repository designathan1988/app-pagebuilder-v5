# EST-L05a-001 × GRE-EST-L05a-001-02 → GRL-EST-L05a-001-01
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-02 (holdTyping): ENT-L09a-0133
- **Leitor:** GRL-EST-L05a-001-01 (answer): ENT-L09a-0071, ENT-L09a-0072
## Estados deixados por A
- **V-segurada.** `src/editor/shell/field.tsx:1782` `      else if (heldTyping()?.field !== element) holdTyping({ field: element, region: regionOf(element), context: editContextOf(store.getState()), owns, keep });` — o campo passa a ser a digitação pendente.
- **V-do-primeiro-gravar.** `src/editor/input/pending.ts:31` `  if (held !== null && held.field !== typing.field) keepTyping();` — outra digitação pendente é gravada antes de a nova ser segurada.

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
