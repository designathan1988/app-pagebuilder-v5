# EST-L05a-018 × GRE-EST-L05a-018-02 → GRL-EST-L05a-018-01
- **Estado:** EST-L05a-018
- **Escritor:** GRE-EST-L05a-018-02 (recordFieldInput): ENT-L10a-0011
- **Leitor:** GRL-EST-L05a-018-01 (input.dataset.shown): ENT-L10a-0009, ENT-L10a-0010
## Estados deixados por A
- **V1 sem atributos.** O campo recém-desenhado não tem `data-draft`: o primeiro marcador é escrito em `src/editor/input/drafts.ts:13` `field.dataset.draft = DRAFT_KEPT;`.
- **V2 `kept` com o valor gravado.** `src/editor/input/drafts.ts:12` `field.dataset.shown = value;` e `src/editor/input/drafts.ts:13` `field.dataset.draft = DRAFT_KEPT;` — `markFieldKept` (fluxos ENT-L10a-0008, ENT-L10a-0009 e ENT-L10a-0010).
- **V3 `typed` com digitação não gravada.** `src/editor/input/drafts.ts:26` `field.dataset.draft = typed ? DRAFT_TYPED : DRAFT_KEPT;` — `recordFieldInput` marca a digitação não gravada; é a escrita da ENT-L10a-0011, do grupo.
- **V4 `data-draftRedo` com desfazer nativo pendente.** `src/editor/input/drafts.ts:24` `field.dataset.draftRedo = String(inputType === 'historyUndo' ? redo + 1 : inputType === 'historyRedo' ? Math.max(0, redo - 1) : 0);` — `recordFieldInput` conta os desfazeres nativos.
- **V5 de volta a `kept` e `0`.** `src/editor/input/drafts.ts:14` `field.dataset.draftRedo = '0';` — `markFieldKept` zera o contador e repõe o campo como gravado.
## Casos
### C1 final
- O escritor já terminou a digitação e deixou o campo marcado: `src/editor/input/drafts.ts:26` `field.dataset.draft = typed ? DRAFT_TYPED : DRAFT_KEPT;`.
- O leitor chega na saída do campo (ENT-L10a-0010) e lê o item em `src/modules/layout-composer/ui/panel.tsx:96` `if (input === null || !door.available || input.value === (input.dataset.shown ?? value)) return;`: com a digitação ainda não gravada o valor difere do mostrado, a condição é falsa e o caminho segue para despachar o comando da porta.
- ok — o leitor lê a digitação pendente e despacha a intenção.
### C2 intermediário
- No meio da digitação o campo fica `typed`: `src/editor/input/drafts.ts:26` `field.dataset.draft = typed ? DRAFT_TYPED : DRAFT_KEPT;`.
- O leitor lê `src/modules/layout-composer/ui/panel.tsx:96` `if (input === null || !door.available || input.value === (input.dataset.shown ?? value)) return;` e, com o valor diferente do mostrado, segue o caminho.
- ok — o leitor lê o campo a meio da digitação e despacha a intenção.
### C3 em curso
- O escritor escreve contador e marca em instruções seguidas (`src/editor/input/drafts.ts:24` `field.dataset.draftRedo = String(inputType === 'historyUndo' ? redo + 1 : inputType === 'historyRedo' ? Math.max(0, redo - 1) : 0);` e `src/editor/input/drafts.ts:26` `field.dataset.draft = typed ? DRAFT_TYPED : DRAFT_KEPT;`); o leitor lê noutro evento de DOM (`src/modules/layout-composer/ui/panel.tsx:96` `if (input === null || !door.available || input.value === (input.dataset.shown ?? value)) return;`).
- Nenhum ouvinte corre entre as escritas, e a leitura vê os atributos inteiros.
- ok — a leitura vê sempre os atributos inteiros.
### C4 desmontagem
- A desmontagem do campo de porta desfaz o elemento; o leitor fica com `field.current` nulo e lê `src/modules/layout-composer/ui/panel.tsx:96` `if (input === null || !door.available || input.value === (input.dataset.shown ?? value)) return;`, e a condição verdadeira para o caminho.
- ok — sem o elemento do campo o leitor não despacha.
## Resultado
- O leitor lê o valor mostrado do campo e decide se despacha o comando da porta: `src/modules/layout-composer/ui/panel.tsx:96` `if (input === null || !door.available || input.value === (input.dataset.shown ?? value)) return;`.
