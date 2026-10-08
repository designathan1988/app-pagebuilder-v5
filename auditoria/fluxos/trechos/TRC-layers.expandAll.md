# TRC-layers.expandAll
- **Chamada:** `src/app/commands.ts:496` `'layers.expandAll': expandAll,`
- **Argumentos:** nenhum.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:496` `'layers.expandAll': expandAll,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/layers/tree.ts:118` `export const expandAll = registerHandler<'layers.expandAll', EditorUi>('layers.expandAll', ({ state }) => ({ kind: 'change', ui: withCollapsed(state.ui, []), message: message('status.layers.expandedAll') }));` — a lista de fechados fica vazia, abrindo todo ramo [escreve: EST-L01-037 via withCollapsed].
7. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
8. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
9. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
10. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a árvore redesenha [lê: EST-L01-002 via publish].

## Ramos
- nenhum — o tratador deixa a lista de fechados vazia e sempre devolve a mudança `src/editor/layers/tree.ts:118` `export const expandAll = registerHandler<'layers.expandAll', EditorUi>('layers.expandAll', ({ state }) => ({ kind: 'change', ui: withCollapsed(state.ui, []), message: message('status.layers.expandedAll') }));`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/layers/tree.ts:118` `export const expandAll = registerHandler<'layers.expandAll', EditorUi>('layers.expandAll', ({ state }) => ({ kind: 'change', ui: withCollapsed(state.ui, []), message: message('status.layers.expandedAll') }));`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.layers.collapsed`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.layers.collapsed`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.layers.collapsed` vazio (`src/editor/layers/tree.ts:118`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a árvore.
- **DOM do editor:** toda linha da árvore volta a ser desenhada (`src/editor/layers/tree.ts:118`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/layers/tree.ts:118`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/layers/tree.ts:118` `export const expandAll = registerHandler<'layers.expandAll', EditorUi>('layers.expandAll', ({ state }) => ({ kind: 'change', ui: withCollapsed(state.ui, []), message: message('status.layers.expandedAll') }));` — a única porta (o botão do cabeçalho das Camadas) chega ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; a árvore de Camadas ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/layers/tree.ts:118`).
- G5: n/a — a rolagem da árvore depois de abrir todos os ramos é medida na Fase 6 (`src/editor/layers/tree.ts:118`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/layers/tree.ts:118`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/layers/tree.ts:118`).

## Medições
- a medir na Fase 6: a rolagem da árvore de Camadas depois de abrir todos os ramos, com documento profundo, nas duas telas (família `sideways`).
