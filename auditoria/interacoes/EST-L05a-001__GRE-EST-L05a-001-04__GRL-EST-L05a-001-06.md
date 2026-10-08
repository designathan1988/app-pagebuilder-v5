# EST-L05a-001 × GRE-EST-L05a-001-04 → GRL-EST-L05a-001-06
- **Estado:** EST-L05a-001
- **Escritor:** GRE-EST-L05a-001-04 (releaseTyping): ENT-L09a-0129, ENT-L09a-0131, ENT-L09a-0132, ENT-L09a-0133, ENT-L09a-0134
- **Leitor:** GRL-EST-L05a-001-06 (onDown): ENT-L05a-0040
## Estados deixados por A
- **V-solta.** `src/editor/input/pending.ts:37` `  if (held?.field === field) held = null;` — a digitação do campo dado volta a `null`.
- **V-ao-voltar-ao-mostrado.** `src/editor/shell/field.tsx:1781` `      if (element.value === typing.shown) releaseTyping(element);` — texto de volta ao mostrado solta a digitação.
- **V-ao-restaurar.** `src/editor/shell/field.tsx:1739` `    releaseTyping(element);` — restaurar o campo solta a digitação pendente.
- **V-de-outro-campo-fica.** `src/editor/input/pending.ts:37` `  if (held?.field === field) held = null;` — campo diferente: a digitação pendente continua.

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
