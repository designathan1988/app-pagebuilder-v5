# TRC-layers.search
- **Chamada:** `src/app/commands.ts:500` `'layers.search': search,`
- **Argumentos:** `{ query }` — o texto digitado no campo de busca das Camadas.
- **Ramos que dependem dos argumentos:** R1 (`query` vazio), R2 (a contagem de linhas que casam).

## Passos
1. `src/app/commands.ts:500` `'layers.search': search,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/layers/tree.ts:29` `const ui: EditorUi = { ...state.ui, layers: { ...state.ui.layers, query } };` — o texto vai para `ui.layers.query` [escreve: EST-L01-037 via run].
7. `src/editor/layers/tree.ts:31` `const count = state.document.pages.reduce((n, page) => n + [...walk(page.tree)].filter((node) => layerMatches(node, text)).length, 0);` — cada página é percorrida contando as linhas que casam [lê: EST-L01-030 via walk] [lê: EST-L01-030 via layerMatches].
8. `src/editor/layers/tree.ts:32` `return { kind: 'change', ui, message: count === 0 ? message('status.layers.searchNoMatch', { query: text }) : message('status.layers.searchMatches', { count, query: text }) };` — o resultado é a mudança com a mensagem da contagem.
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a árvore redesenha [lê: EST-L01-002 via publish].

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
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
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
