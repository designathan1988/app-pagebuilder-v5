# EST-L05a-001 × GRE-EST-L05a-001-02 → GRL-EST-L05a-001-06
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-02 (holdTyping): ENT-L09a-0133
- **Leitor:** GRL-EST-L05a-001-06 (onDown): ENT-L05a-0040
## Estados deixados por A
- **V-segurada.** `src/editor/shell/field.tsx:1782` `      else if (heldTyping()?.field !== element) holdTyping({ field: element, region: regionOf(element), context: editContextOf(store.getState()), owns, keep });` — o campo passa a ser a digitação pendente.
- **V-do-primeiro-gravar.** `src/editor/input/pending.ts:31` `  if (held !== null && held.field !== typing.field) keepTyping();` — outra digitação pendente é gravada antes de a nova ser segurada.

## Casos
### C1 final
- O escritor terminou: a digitação pendente, se havia, foi gravada (`src/editor/input/pending.ts:48` `  typing.keep();`).
- O leitor chega no começo da pressão: `src/editor/input/pointer/events.ts:57` `    const aimed = heldTyping() === null ? null : selectionBox();` — lê a digitação antes de medir a caixa.
- ok — a caixa que a pressão mede é a de antes da gravação.
### C2 intermediário
- n/a — a digitação é gravada numa chamada só (`src/editor/input/pending.ts:47` `  held = null;`).
### C3 em curso
- O leitor corre no começo do toque: `src/editor/input/pointer/events.ts:57` `    const aimed = heldTyping() === null ? null : selectionBox();`.
- ok — o leitor lê o registo antes de a pressão agir.
### C4 desmontagem
- n/a — a leitura é do ouvinte de ponteiro, sem assinatura de componente (`src/editor/input/pointer/events.ts:47` `  const onDown = (event: PointerEvent) => {`).

## Resultado
- O leitor decide se mede a caixa da seleção antes de a digitação ser gravada: `src/editor/input/pointer/events.ts:57` `    const aimed = heldTyping() === null ? null : selectionBox();`.
