# EST-L05a-023 × GRE-EST-L05a-023-01 → GRL-EST-L05a-023-02
- **Estado:** EST-L05a-023
- **Escritor:** GRE-EST-L05a-023-01 (pointerViews): ENT-L05a-0020
- **Leitor:** GRL-EST-L05a-023-02 (pointerViews): ENT-L05a-0020
## Estados deixados por A
- **V1 store sem entrada.** `src/editor/input/pointer/views.ts:223` `let views = VIEWS.get(store);` — a primeira leitura de `pointerViews` não encontra as visões.
- **V2 o store com as visões criadas na primeira leitura.** `src/editor/input/pointer/views.ts:225` `views = createPointerViews();` cria-as e `src/editor/input/pointer/views.ts:226` `VIEWS.set(store, views);` guarda-as; é a escrita da ENT-L05a-0020, do grupo.
- **Sem estado de recusa.** `src/editor/input/pointer/views.ts:224` `if (views === undefined) {` — só cria quando não há entrada para a store; com entrada devolve a existente.
- **Sem remoção.** `src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();` — a entrada não tem remoção explícita; cai quando a store deixa de ser referenciada.
## Casos
### C1 final
- O escritor já terminou e deixou as visões guardadas: `src/editor/input/pointer/views.ts:226` `VIEWS.set(store, views);`.
- O leitor é a mesma função `pointerViews`, que volta a correr e lê o item em `src/editor/input/pointer/views.ts:223` `let views = VIEWS.get(store);`: com a entrada presente a condição de `src/editor/input/pointer/views.ts:224` `if (views === undefined) {` é falsa e devolve as mesmas visões da primeira leitura.
- ok — o leitor recebe as visões que o escritor guardou, sem as recriar.
### C2 intermediário
- n/a — a criação escreve o item numa só atribuição (`src/editor/input/pointer/views.ts:226` `VIEWS.set(store, views);`); entre `src/editor/input/pointer/views.ts:225` `views = createPointerViews();` e a escrita nenhum leitor corre.
### C3 em curso
- O leitor lê em `src/editor/input/pointer/views.ts:223` `let views = VIEWS.get(store);` e o escritor escreve em `src/editor/input/pointer/views.ts:226` `VIEWS.set(store, views);` na mesma passagem de `pointerViews`; a leitura devolve sempre o objecto inteiro.
- ok — a leitura em curso devolve as visões inteiras.
### C4 desmontagem
- n/a — o item é uma `WeakMap` sem remoção explícita (`src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();`); o leitor não depende de o item ser apagado.
## Resultado
- O leitor lê as visões guardadas por store e recebe o mesmo objecto em todas as leituras: `src/editor/input/pointer/views.ts:223` `let views = VIEWS.get(store);`.
