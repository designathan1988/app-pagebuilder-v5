# ENT-P-workspace-0089 — layers.search pela porta layers.search#layers-search-field

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2744` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:2743` `"id": "layers-search-field",`
- **Tratador:** `src/app/commands.ts:500` `'layers.search': search,`
- **Início:** `src/editor/shell/sidebar/layers.tsx:417` `const field = useDoor(LAYERS_SEARCH);`

## Passos
1. `src/editor/shell/sidebar/layers.tsx:417` `const field = useDoor(LAYERS_SEARCH);` — o campo de busca das Camadas lê a sua porta
2. `src/editor/shell/sidebar/layers.tsx:422` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(LAYERS_SEARCH.command.id as CommandId, { ...LAYERS_SEARCH.door.args, query: text });` — cada mudança do campo despacha `layers.search` com o texto
3. `src/app/commands.ts:500` `'layers.search': search,` — a tabela liga o id ao tratador; o trecho TRC-layers.search começa aqui

## Ramos
- R1 `src/editor/layers/tree.ts:30` `if (text === '') return state.ui.layers.query.trim() === '' ? { kind: 'change', ui } : { kind: 'change', ui, message: message('status.layers.searchCleared') };` — sem texto, limpa a busca (com a mensagem só se havia uma); com texto, segue para R2.
- R2 `src/editor/layers/tree.ts:32` `return { kind: 'change', ui, message: count === 0 ? message('status.layers.searchNoMatch', { query: text }) : message('status.layers.searchMatches', { count, query: text }) };` — nenhuma linha casa: a barra diz que nada casou; alguma casa: a barra diz quantas.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/layers/tree.ts:27` `export const search = registerHandler<'layers.search', EditorUi>('layers.search', ({ state }, { query }) => {`); o campo chama o despacho a cada digitação, mas cada chamada roda inteira dentro do trecho.

## Estado
- lê: EST-L01-030 (documento: páginas e árvore), EST-L01-037 (`ui.layers.query`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.layers.query`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.layers.query` no texto digitado (`src/editor/layers/tree.ts:29`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a árvore.
- **DOM do editor:** a árvore mostra só as linhas que casam e as de cima delas, com as que casam marcadas (`src/editor/layers/tree.ts:32`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/layers/tree.ts:29`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/layers/tree.ts:27` `export const search = registerHandler<'layers.search', EditorUi>('layers.search', ({ state }, { query }) => {` — a única porta (o campo de busca das Camadas) chega ao mesmo tratador com só `query`.
- G4: n/a — o comando muda estado; a árvore de Camadas ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/layers/tree.ts:31`).
- G5: n/a — a rolagem da árvore filtrada é medida na Fase 6 (`src/editor/layers/tree.ts:31`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/layers/tree.ts:29`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/layers/tree.ts:29`).

## Medições
- a medir na Fase 6: a rolagem da árvore de Camadas durante a busca, com documento profundo, nas duas telas (família `sideways`).

## Ramos do trecho
- **Trecho:** TRC-layers.search
- **Argumentos enviados:** a porta declara `{}`; o campo acrescenta `query` (o texto digitado)
- R1 `src/editor/layers/tree.ts:30` `if (text === '') return state.ui.layers.query.trim() === '' ? { kind: 'change', ui } : { kind: 'change', ui, message: message('status.layers.searchCleared') };` — o campo envia a `query` digitada: vazia (só espaços) o caminho passa pelo lado que limpa a busca; com texto, segue para R2.
- R2 `src/editor/layers/tree.ts:32` `return { kind: 'change', ui, message: count === 0 ? message('status.layers.searchNoMatch', { query: text }) : message('status.layers.searchMatches', { count, query: text }) };` — nenhuma linha casa: a barra diz que nada casou; alguma casa: diz quantas.
