# EST-L09a-049 × GRE-EST-L09a-049-01 → GRL-EST-L09a-049-01
- **Estado:** EST-L09a-049
- **Escritor:** GRE-EST-L09a-049-01 (typed.current): ENT-L09a-0042, ENT-L09a-0043, ENT-L09a-0044, ENT-L09a-0045
- **Leitor:** GRL-EST-L09a-049-01 (typed.current): ENT-L09a-0043, ENT-L09a-0044, ENT-L09a-0045
## Estados deixados por A

O escritor é a referência `typed` de um campo de texto do seletor de cor, declarada em `src/editor/shell/color.tsx:87` `const typed = useRef(false);`. Os membros do grupo cobrem quatro fluxos e escrevem em três linhas:

- **V1 `false`** — `src/editor/shell/color.tsx:87` `const typed = useRef(false);`; é o valor da declaração, antes de qualquer digitação.
- **V2 `true`** — `src/editor/shell/color.tsx:110` `typed.current = true;`; o `onInput` do campo marca a digitação não guardada (fluxo ENT-L09a-0043).
- **V3 `false` de novo** — `src/editor/shell/color.tsx:97` `typed.current = false;`; o `submit` do campo repõe a marca depois de guardar (fluxos ENT-L09a-0044 e ENT-L09a-0045), e o efeito repõe-na sempre que o valor mostrado ou a mensagem mudam, em `src/editor/shell/color.tsx:91` `typed.current = false;` (fluxo ENT-L09a-0042).
- **Recusa: nenhuma** — as três linhas 91, 97 e 110 gravam sem ramo que recuse.
- **Intermediário: nenhum** — cada uma das linhas 91, 97 e 110 é uma só atribuição; o leitor só corre na renderização ou no `submit` seguintes, já terminada a atribuição.

## Casos
### C1 final
O leitor chega no `submit` do campo (ENT-L09a-0044 e ENT-L09a-0045) depois de escrita a marca. Ele lê o item em `src/editor/shell/color.tsx:96` `if (element === null || !typed.current) return;`: com V2 (verdadeira) não retorna e guarda o valor em `src/editor/shell/color.tsx:98` `keep(element.value);`; com V1 ou V3 (falsa) retorna sem guardar. ok

### C2 intermediário
n/a — a escrita é uma só atribuição de `src/editor/shell/color.tsx:110` `typed.current = true;` ou de `src/editor/shell/color.tsx:97` `typed.current = false;`; não há gesto nem sequência que deixe a marca num valor parcial.

### C3 em curso
n/a — o leitor é a guarda do próprio `submit`, `src/editor/shell/color.tsx:96` `if (element === null || !typed.current) return;`; a marca é uma referência (`src/editor/shell/color.tsx:87` `const typed = useRef(false);`), os membros do grupo não têm assinatura de store sobre este item e as atribuições das linhas 91, 97 e 110 terminam antes da leitura.

### C4 desmontagem
n/a — o escritor e o leitor vivem no mesmo campo `PickerText` (`src/editor/shell/color.tsx:87` `const typed = useRef(false);`); desmontar o campo termina o `submit` que o lê, e não há leitura do item depois disso.

## Resultado
O leitor lê EST-L09a-049 em `src/editor/shell/color.tsx:96` `if (element === null || !typed.current) return;` e decide se o valor digitado é guardado: com a marca verdadeira chama `src/editor/shell/color.tsx:98` `keep(element.value);`, e com ela falsa o campo volta ao valor mostrado sem guardar.
