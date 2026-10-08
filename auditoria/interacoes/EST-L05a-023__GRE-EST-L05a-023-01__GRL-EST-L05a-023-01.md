# EST-L05a-023 × GRE-EST-L05a-023-01 → GRL-EST-L05a-023-01
- **Estado:** EST-L05a-023
- **Escritor:** GRE-EST-L05a-023-01 (pointerViews): ENT-L05a-0020
- **Leitor:** GRL-EST-L05a-023-01 (duplicating): ENT-L05a-0021
## Estados deixados por A
- **V1 store sem entrada.** `src/editor/input/pointer/views.ts:223` `let views = VIEWS.get(store);` — a primeira leitura de `pointerViews` não encontra as visões.
- **V2 o store com as visões criadas na primeira leitura.** `src/editor/input/pointer/views.ts:225` `views = createPointerViews();` cria-as e `src/editor/input/pointer/views.ts:226` `VIEWS.set(store, views);` guarda-as; é a escrita da ENT-L05a-0020, do grupo.
- **Sem estado de recusa.** `src/editor/input/pointer/views.ts:224` `if (views === undefined) {` — só cria quando não há entrada para a store; com entrada devolve a existente.
- **Sem remoção.** `src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();` — a entrada não tem remoção explícita; cai quando a store deixa de ser referenciada.
## Casos
### C1 final
- O escritor já terminou e deixou as visões guardadas: `src/editor/input/pointer/views.ts:226` `VIEWS.set(store, views);`.
- O leitor é a vista `duplicating`, que lê o item em `src/editor/input/pointer/common.ts:65` `const { altHeld, measuring } = pointerViews(store);`: `pointerViews` encontra a entrada para a store em `src/editor/input/pointer/views.ts:223` `let views = VIEWS.get(store);` e devolve as mesmas visões, de que o leitor toma a célula `measuring`.
- ok — o leitor recebe as visões que o escritor guardou.
### C2 intermediário
- n/a — a criação escreve o item numa só atribuição (`src/editor/input/pointer/views.ts:226` `VIEWS.set(store, views);`); entre `src/editor/input/pointer/views.ts:225` `views = createPointerViews();` e a escrita nenhum leitor corre.
### C3 em curso
- O leitor chama `pointerViews` em `src/editor/input/pointer/common.ts:65` `const { altHeld, measuring } = pointerViews(store);`, que lê em `src/editor/input/pointer/views.ts:223` `let views = VIEWS.get(store);` e escreve em `src/editor/input/pointer/views.ts:226` `VIEWS.set(store, views);` na mesma passagem; a leitura devolve sempre o objecto inteiro das visões.
- ok — a leitura em curso devolve as visões inteiras.
### C4 desmontagem
- n/a — o item é uma `WeakMap` sem remoção explícita (`src/editor/input/pointer/views.ts:221` `const VIEWS = new WeakMap<object, PointerViews>();`); o leitor não depende de o item ser apagado para parar.
## Resultado
- O leitor toma a célula `measuring` das visões da store: `src/editor/input/pointer/common.ts:65` `const { altHeld, measuring } = pointerViews(store);`.
