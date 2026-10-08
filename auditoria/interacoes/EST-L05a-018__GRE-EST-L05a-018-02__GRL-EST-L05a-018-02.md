# EST-L05a-018 × GRE-EST-L05a-018-02 → GRL-EST-L05a-018-02
- **Estado:** EST-L05a-018
- **Escritor:** GRE-EST-L05a-018-02 (recordFieldInput): ENT-L10a-0011
- **Leitor:** GRL-EST-L05a-018-02 (recordFieldInput): ENT-L10a-0011
## Estados deixados por A
- **V1 sem atributos.** O campo recém-desenhado não tem `data-draft`: o primeiro marcador é escrito em `src/editor/input/drafts.ts:13` `field.dataset.draft = DRAFT_KEPT;`.
- **V2 `kept` com o valor gravado.** `src/editor/input/drafts.ts:12` `field.dataset.shown = value;` e `src/editor/input/drafts.ts:13` `field.dataset.draft = DRAFT_KEPT;` — `markFieldKept` (fluxos ENT-L10a-0008, ENT-L10a-0009 e ENT-L10a-0010).
- **V3 `typed` com digitação não gravada.** `src/editor/input/drafts.ts:26` `field.dataset.draft = typed ? DRAFT_TYPED : DRAFT_KEPT;` — `recordFieldInput` marca a digitação não gravada; é a escrita da ENT-L10a-0011, do grupo.
- **V4 `data-draftRedo` com desfazer nativo pendente.** `src/editor/input/drafts.ts:24` `field.dataset.draftRedo = String(inputType === 'historyUndo' ? redo + 1 : inputType === 'historyRedo' ? Math.max(0, redo - 1) : 0);` — `recordFieldInput` conta os desfazeres nativos.
- **V5 de volta a `kept` e `0`.** `src/editor/input/drafts.ts:14` `field.dataset.draftRedo = '0';` — `markFieldKept` zera o contador e repõe o campo como gravado.
## Casos
### C1 final
- O escritor já terminou a digitação e deixou o campo marcado: `src/editor/input/drafts.ts:26` `field.dataset.draft = typed ? DRAFT_TYPED : DRAFT_KEPT;`.
- O leitor é a mesma `recordFieldInput`, que volta a correr na digitação seguinte; lê o item em `src/editor/input/drafts.ts:25` `const typed = !inputType.startsWith('history') || field.value !== field.dataset.shown;`: com o valor diferente do mostrado, `typed` é verdadeiro e o campo segue `typed`.
- ok — o leitor lê a marca deixada e reconhece a digitação seguinte como pendente.
### C2 intermediário
- No meio da digitação o campo fica `typed`: `src/editor/input/drafts.ts:26` `field.dataset.draft = typed ? DRAFT_TYPED : DRAFT_KEPT;`.
- O leitor lê `src/editor/input/drafts.ts:25` `const typed = !inputType.startsWith('history') || field.value !== field.dataset.shown;` e mantém a marca.
- ok — o leitor lê o campo a meio da digitação e mantém a marca.
### C3 em curso
- O leitor lê em `src/editor/input/drafts.ts:25` `const typed = !inputType.startsWith('history') || field.value !== field.dataset.shown;` dentro da mesma passagem de `recordFieldInput`, depois de a linha `src/editor/input/drafts.ts:24` `field.dataset.draftRedo = String(inputType === 'historyUndo' ? redo + 1 : inputType === 'historyRedo' ? Math.max(0, redo - 1) : 0);` escrever o contador.
- Nenhum ouvinte corre entre a leitura e as escritas; a leitura vê o valor inteiro.
- ok — a leitura em curso vê os atributos inteiros.
### C4 desmontagem
- O elemento do campo é desfeito na desmontagem do painel; o `onInput` deixa de disparar e o item vai com o elemento.
- O leitor rodava no `onInput` do campo (`src/modules/layout-composer/ui/panel.tsx:107` `onBlur={keep} onInput={(event) => recordFieldInput(event.currentTarget, event.nativeEvent)}`); sem o elemento, o ouvinte não dispara.
- ok — depois de desmontado o campo, o leitor não corre.
## Resultado
- O leitor lê o valor mostrado e o valor do campo e decide se a digitação é pendente: `src/editor/input/drafts.ts:25` `const typed = !inputType.startsWith('history') || field.value !== field.dataset.shown;`.
