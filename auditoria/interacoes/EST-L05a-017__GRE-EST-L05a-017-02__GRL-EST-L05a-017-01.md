# EST-L05a-017 × GRE-EST-L05a-017-02 → GRL-EST-L05a-017-01
- **Estado:** EST-L05a-017
- **Escritor:** GRE-EST-L05a-017-02 (onFocus): ENT-L05a-0067
- **Leitor:** GRL-EST-L05a-017-01 (onClick): ENT-L05a-0068
## Estados deixados por A
- **V1 null.** `src/editor/input/select-on-focus.ts:11` `let focused: { readonly field: HTMLInputElement; readonly at: number } | null = null;` — a instalação começa sem campo guardado.
- **V2 o campo focado e o instante.** `src/editor/input/select-on-focus.ts:14` `focused = field instanceof HTMLInputElement && field.matches(FIELDS) && isText(field) ? { field, at: event.timeStamp } : null;` — `onFocus` guarda o campo de valor de texto e o carimbo do foco, ao receber `focusin`; é a escrita da ENT-L05a-0067, do grupo.
- **V1 de novo, pelo clique.** `src/editor/input/select-on-focus.ts:18` `focused = null;` — `onClick` zera o campo lido (fluxo ENT-L05a-0068).
- **Sem estado de recusa.** `src/editor/input/select-on-focus.ts:14` `focused = field instanceof HTMLInputElement && field.matches(FIELDS) && isText(field) ? { field, at: event.timeStamp } : null;` — um alvo que não é campo de valor de texto faz o ternário deixar nulo; o item nunca fica com um campo inválido.
## Casos
### C1 final
- O escritor já terminou o foco e deixou o campo guardado: `src/editor/input/select-on-focus.ts:14` `focused = field instanceof HTMLInputElement && field.matches(FIELDS) && isText(field) ? { field, at: event.timeStamp } : null;`.
- O leitor chega no clique seguinte (ENT-L05a-0068) e lê o item em `src/editor/input/select-on-focus.ts:17` `const was = focused;`; o caminho passa em `src/editor/input/select-on-focus.ts:19` `if (was === null || event.target !== was.field || event.timeStamp - was.at > SAME_PRESS_MS) return;` quando o alvo é o mesmo campo e o clique é do mesmo gesto, e então `src/editor/input/select-on-focus.ts:21` `if (was.field.selectionStart === was.field.selectionEnd) was.field.select();` seleciona todo o valor.
- ok — o leitor lê o campo deixado pelo foco e seleciona o valor.
### C2 intermediário
- n/a — este grupo de escritores escreve o item numa só atribuição: `src/editor/input/select-on-focus.ts:14` `focused = field instanceof HTMLInputElement && field.matches(FIELDS) && isText(field) ? { field, at: event.timeStamp } : null;`; não há estado a meio que um leitor alcance.
### C3 em curso
- O escritor escreve numa só atribuição (`src/editor/input/select-on-focus.ts:14` `focused = field instanceof HTMLInputElement && field.matches(FIELDS) && isText(field) ? { field, at: event.timeStamp } : null;`) e o leitor lê noutro evento (`src/editor/input/select-on-focus.ts:17` `const was = focused;`); não há escrita a meio que a leitura possa apanhar.
- ok — a leitura vê sempre o item inteiro.
### C4 desmontagem
- A limpeza de `installSelectOnFocus` remove os ouvintes em `src/editor/input/select-on-focus.ts:26` `root.removeEventListener('focusin', onFocus);` e `src/editor/input/select-on-focus.ts:27` `root.removeEventListener('click', onClick, true);`.
- O item vive no fecho da instalação; sem os ouvintes nenhum leitor o alcança.
- ok — depois de desmontada a instalação, o leitor não corre.
## Resultado
- O leitor lê o campo que o foco guardou e o instante dele e seleciona o valor do campo: `src/editor/input/select-on-focus.ts:21` `if (was.field.selectionStart === was.field.selectionEnd) was.field.select();`.
