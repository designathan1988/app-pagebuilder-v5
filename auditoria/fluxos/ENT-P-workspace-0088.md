# ENT-P-workspace-0088 — layers.setRowDetails pela porta layers.setRowDetails#menu-layers-row-details-attributes

- **Tipo:** comando-porta menu `manifest/commands/workspace.json:2696` `"kind": "menu",`
- **Porta:** `manifest/commands/workspace.json:2695` `"id": "menu-layers-row-details-attributes",`
- **Tratador:** `src/app/commands.ts:499` `'layers.setRowDetails': setRowDetails,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/menu.tsx:54` `onClick={() => {` — o clique do item do menu roda a porta (o menu fecha antes)
2. `src/editor/doors/menu.tsx:59` `door.run();` — a porta é rodada
3. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
4. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:499` `'layers.setRowDetails': setRowDetails,` — a tabela liga o id ao tratador; o trecho TRC-layers.setRowDetails começa aqui

## Ramos
- R1 `src/editor/layers/tree.ts:127` `const on = shown ?? !now.includes(detail);` — com `shown` (o item de menu manda o estado), o detalhe toma o valor dado; sem ele, alterna.
- R2 `src/editor/layers/tree.ts:129` `if (next.join() === now.join()) return { kind: 'change' };` — a lista não muda: mudança vazia; diferente segue para o passo 9.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/layers/tree.ts:123` `export const setRowDetails: RegisteredHandler<'layers.setRowDetails', EditorUi> = registerHandler(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.preferences.rowDetails`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.rowDetails`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.rowDetails` com o detalhe ligado ou desligado (`src/editor/layers/tree.ts:134`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a árvore.
- **DOM do editor:** cada linha das Camadas mostra ou esconde o detalhe escolhido (`src/editor/layers/tree.ts:128`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/layers/tree.ts:134`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/layers/tree.ts:123` `export const setRowDetails: RegisteredHandler<'layers.setRowDetails', EditorUi> = registerHandler(` — as portas de menu (Tag, ID, Classes, Atributos) chegam ao mesmo tratador com só `detail`; a lista as manda sem `shown`.
- G4: n/a — o comando muda estado; a árvore de Camadas ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/layers/tree.ts:134`).
- G5: n/a — o encaixe da linha com o detalhe a mais, com nomes longos, é medido na Fase 6 (`src/editor/layers/tree.ts:134`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/layers/tree.ts:134`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/layers/tree.ts:126`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.

## Ramos do trecho
- **Trecho:** TRC-layers.setRowDetails
- **Argumentos enviados:** o manifesto declara `detail` `attributes`; a lista o envia sem `shown`
- R1 `src/editor/layers/tree.ts:127` `const on = shown ?? !now.includes(detail);` — esta porta (item de menu) não envia `shown`: o detalhe `attributes` alterna.
- R2 `src/editor/layers/tree.ts:129` `if (next.join() === now.join()) return { kind: 'change' };` — quando a lista de detalhes já é a que o clique pede o caminho passa pelo lado da mudança vazia; diferente, pelo lado que grava.
