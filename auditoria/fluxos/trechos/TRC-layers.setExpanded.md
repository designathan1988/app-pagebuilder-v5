# TRC-layers.setExpanded
- **Chamada:** `src/app/commands.ts:494` `'layers.setExpanded': setExpanded,`
- **Argumentos:** `{ target, expanded }` — `target` um id de nó, `expanded` um enum `expand`/`collapse`/`toggle`.
- **Ramos que dependem dos argumentos:** R1 (`target` sem ramo), R2 (`expanded` que não muda o estado).

## Passos
1. `src/app/commands.ts:494` `'layers.setExpanded': setExpanded,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/layers/tree.ts:70` `const found = locate(state.document, target);` — o nó é achado no documento [lê: EST-L01-030 via locate].
7. `src/editor/layers/tree.ts:72` `const { collapsed } = state.ui.layers;` — os ramos fechados são lidos [lê: EST-L01-037 via handlerContext].
8. `src/editor/layers/tree.ts:74` `const fold = expanded === 'toggle' ? !folded : expanded === 'collapse';` — o pedido vira o estado querido.
9. `src/editor/layers/tree.ts:76` `return { kind: 'change', ui: withCollapsed(state.ui, fold ? [...collapsed, target] : collapsed.filter((id) => id !== target)) };` — o nó entra ou sai da lista de fechados [escreve: EST-L01-037 via withCollapsed].
10. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
11. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
12. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a árvore redesenha [lê: EST-L01-002 via publish].

## Ramos
- R1 `src/editor/layers/tree.ts:71` `if (!found || found.node.children.length === 0) return { kind: 'change' };` — um `target` que não é nó, ou um nó sem filhos, devolve mudança vazia; um nó com filhos segue.
- R2 `src/editor/layers/tree.ts:75` `if (fold === folded) return { kind: 'change' };` — o pedido já é o estado do ramo: mudança vazia; diferente segue para o passo 9.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/layers/tree.ts:69` `export const setExpanded = registerHandler<'layers.setExpanded', EditorUi>('layers.setExpanded', ({ state }, { target, expanded }) => {`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (documento: `locate`), EST-L01-037 (`ui.layers.collapsed`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.layers.collapsed`).

## Resultado
- **Estado final:** EST-L01-037 com o ramo do nó em `ui.layers.collapsed` fechado ou não conforme `expanded` (`src/editor/layers/tree.ts:76`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a árvore.
- **DOM do editor:** a linha do nó mostra os filhos ou os esconde (`src/editor/layers/tree.ts:76`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/layers/tree.ts:76`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/layers/tree.ts:69` `export const setExpanded = registerHandler<'layers.setExpanded', EditorUi>('layers.setExpanded', ({ state }, { target, expanded }) => {` — as duas portas (o caret da linha e o repouso de um arraste sobre uma linha fechada) chegam ao mesmo tratador com só `target` e `expanded`.
- G4: n/a — o comando muda estado; a árvore de Camadas ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/layers/tree.ts:76`).
- G5: n/a — o encaixe da árvore com ramos abertos é medido na Fase 6 (`src/editor/layers/tree.ts:76`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/layers/tree.ts:76`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/layers/tree.ts:70`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
