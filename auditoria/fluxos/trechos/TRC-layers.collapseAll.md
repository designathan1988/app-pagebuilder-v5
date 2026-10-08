# TRC-layers.collapseAll
- **Chamada:** `src/app/commands.ts:495` `'layers.collapseAll': collapseAll,`
- **Argumentos:** nenhum.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:495` `'layers.collapseAll': collapseAll,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/layers/tree.ts:108` `for (const page of state.document.pages) {` — cada página é percorrida [lê: EST-L01-030 via handlerContext].
7. `src/editor/layers/tree.ts:110` `if (node.children.length > 0) branches.push(node.id);` — cada nó com filhos entra na lista de ramos a fechar.
8. `src/editor/layers/tree.ts:115` `return { kind: 'change', ui: withCollapsed(state.ui, branches), message: message('status.layers.collapsedAll') };` — a lista de fechados passa a ser a dos ramos [escreve: EST-L01-037 via withCollapsed].
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a árvore redesenha [lê: EST-L01-002 via publish].

## Ramos
- nenhum — o tratador fecha todo ramo com filhos e sempre devolve a mudança `src/editor/layers/tree.ts:115` `return { kind: 'change', ui: withCollapsed(state.ui, branches), message: message('status.layers.collapsedAll') };`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/layers/tree.ts:106` `export const collapseAll = registerHandler<'layers.collapseAll', EditorUi>('layers.collapseAll', ({ state }) => {`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (documento: páginas e árvore), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.layers.collapsed`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.layers.collapsed` igual à lista de todos os nós com filhos (`src/editor/layers/tree.ts:115`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a árvore.
- **DOM do editor:** só a linha da página e o primeiro nível ficam à vista (`src/editor/layers/tree.ts:110`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/layers/tree.ts:115`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/layers/tree.ts:106` `export const collapseAll = registerHandler<'layers.collapseAll', EditorUi>('layers.collapseAll', ({ state }) => {` — a única porta (o botão do cabeçalho das Camadas) chega ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; a árvore de Camadas ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/layers/tree.ts:115`).
- G5: n/a — a rolagem da árvore depois de fechar todos os ramos é medida na Fase 6 (`src/editor/layers/tree.ts:115`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/layers/tree.ts:115`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/layers/tree.ts:108`).

## Medições
- a medir na Fase 6: a rolagem da árvore de Camadas depois de fechar todos os ramos, com documento profundo, nas duas telas (família `sideways`).
