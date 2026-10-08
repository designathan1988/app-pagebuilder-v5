# EST-L05a-017 × GRE-EST-L05a-017-01 → GRL-EST-L05a-017-01
- **Estado:** EST-L05a-017
- **Escritor:** GRE-EST-L05a-017-01 (onClick): ENT-L05a-0068
- **Leitor:** GRL-EST-L05a-017-01 (onClick): ENT-L05a-0068
## Estados deixados por A
- **V1 null.** `src/editor/input/select-on-focus.ts:11` `let focused: { readonly field: HTMLInputElement; readonly at: number } | null = null;` — a instalação começa sem campo guardado.
- **V2 o campo focado e o instante.** `src/editor/input/select-on-focus.ts:14` `focused = field instanceof HTMLInputElement && field.matches(FIELDS) && isText(field) ? { field, at: event.timeStamp } : null;` — `onFocus` guarda o campo de valor de texto e o carimbo do foco (fluxo ENT-L05a-0067); é o estado que este grupo consome.
- **V1 de novo, pelo clique.** `src/editor/input/select-on-focus.ts:18` `focused = null;` — `onClick` zera o campo lido; é a escrita da ENT-L05a-0068, do grupo.
- **Sem estado de recusa.** `src/editor/input/select-on-focus.ts:12` `const onFocus = (event: FocusEvent) => {` — um alvo que não é campo de texto é guardado como nulo em `src/editor/input/select-on-focus.ts:14` `focused = field instanceof HTMLInputElement && field.matches(FIELDS) && isText(field) ? { field, at: event.timeStamp } : null;`; o item nunca fica com um campo inválido.
## Casos
### C1 final
- O escritor já terminou e deixou o item nulo: `src/editor/input/select-on-focus.ts:18` `focused = null;`.
- O leitor é a mesma `onClick`, que volta a correr no clique seguinte; lê o item em `src/editor/input/select-on-focus.ts:17` `const was = focused;`: com `was` nulo o caminho para em `src/editor/input/select-on-focus.ts:19` `if (was === null || event.target !== was.field || event.timeStamp - was.at > SAME_PRESS_MS) return;`.
- ok — o leitor lê o item nulo e não seleciona nada.
### C2 intermediário
- n/a — este grupo de escritores escreve o item numa só atribuição: `src/editor/input/select-on-focus.ts:18` `focused = null;`; não há estado a meio que um leitor alcance.
### C3 em curso
- A leitura em `src/editor/input/select-on-focus.ts:17` `const was = focused;` e a escrita em `src/editor/input/select-on-focus.ts:18` `focused = null;` são instruções seguidas do mesmo `onClick`; nenhum ouvinte corre entre elas.
- Numa chamada em curso a leitura vê o item inteiro, nunca uma escrita a meio.
- ok — a leitura em curso vê o item inteiro.
### C4 desmontagem
- A limpeza de `installSelectOnFocus` remove os ouvintes em `src/editor/input/select-on-focus.ts:26` `root.removeEventListener('focusin', onFocus);` e `src/editor/input/select-on-focus.ts:27` `root.removeEventListener('click', onClick, true);`.
- O item vive no fecho da instalação; sem os ouvintes nenhum leitor o alcança.
- ok — depois de desmontada a instalação, o leitor não corre.
## Resultado
- O leitor lê o campo guardado e o instante e seleciona o valor do campo no primeiro clique: `src/editor/input/select-on-focus.ts:21` `if (was.field.selectionStart === was.field.selectionEnd) was.field.select();`.
