# TRC-layers.collapseOrFocusParent
- **Chamada:** `src/app/commands.ts:498` `'layers.collapseOrFocusParent': collapseOrFocusParent,`
- **Argumentos:** `{ target? }` — o id do nó da linha focada (opcional; sem ele, usa a seleção primária).
- **Ramos que dependem dos argumentos:** R1 (o nó inexistente), R2 (o ramo já fechado ou o nó sem filhos), R3 (a raiz sem pai).

## Passos
1. `src/app/commands.ts:498` `'layers.collapseOrFocusParent': collapseOrFocusParent,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/layers/tree.ts:94` `const id = target ?? state.selection[0];` — o nó vem do argumento ou da seleção [lê: EST-L01-031 via handlerContext].
7. `src/editor/layers/tree.ts:95` `const found = id === undefined ? null : locate(state.document, id);` — o nó é achado no documento [lê: EST-L01-030 via locate].
8. `src/editor/layers/tree.ts:97` `const { collapsed } = state.ui.layers;` — os ramos fechados são lidos [lê: EST-L01-037 via handlerContext].
9. `src/editor/layers/tree.ts:98` `if (found.node.children.length > 0 && !collapsed.includes(found.node.id)) return { kind: 'change', ui: withCollapsed(state.ui, [...collapsed, found.node.id]), message: message('status.layers.folded', { name: found.node.name }) };` — um ramo aberto com filhos fecha [escreve: EST-L01-037 via withCollapsed].
10. `src/editor/layers/tree.ts:99` `return found.parent === null ? { kind: 'change' } : { kind: 'change', ui: asking(state.ui, 'parent') };` — sem pai devolve mudança vazia; com pai, pede o foco à linha do pai [escreve: EST-L01-037 via asking].
11. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
12. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
13. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
14. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados [lê: EST-L01-002 via publish].

## Ramos
- R1 `src/editor/layers/tree.ts:96` `if (!found) return { kind: 'change' };` — um `target` que não é nó devolve mudança vazia; um nó válido segue.
- R2 `src/editor/layers/tree.ts:98` `if (found.node.children.length > 0 && !collapsed.includes(found.node.id)) return { kind: 'change', ui: withCollapsed(state.ui, [...collapsed, found.node.id]), message: message('status.layers.folded', { name: found.node.name }) };` — ramo aberto com filhos: fecha (passo 9); já fechado ou sem filhos: segue para R3.
- R3 `src/editor/layers/tree.ts:99` `return found.parent === null ? { kind: 'change' } : { kind: 'change', ui: asking(state.ui, 'parent') };` — a raiz (sem pai) devolve mudança vazia; um nó com pai pede o foco à linha do pai.

## Fronteiras assíncronas
- o pedido de foco gravado em `ui.focus` (passo 10) é atendido pelo instalador do foco quando o estado muda, num quadro: `src/editor/focus/focus.ts:187` `requestAnimationFrame(() =>` — só então a linha do pai toma o foco.

## Estado
- lê: EST-L01-030 (documento: `locate`), EST-L01-031 (seleção), EST-L01-037 (`ui.layers.collapsed`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.layers.collapsed`, `ui.focus`).

## Resultado
- **Estado final:** EST-L01-037 com o ramo do nó fechado (`src/editor/layers/tree.ts:98`) ou com os ramos intactos e um pedido de foco em `ui.focus` (`src/editor/layers/tree.ts:99`); o documento e a seleção não mudam.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a árvore.
- **DOM do editor:** o ramo fecha, ou o foco passa à linha do pai (`src/editor/layers/tree.ts:99`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/layers/tree.ts:98`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/layers/tree.ts:93` `export const collapseOrFocusParent = registerHandler<'layers.collapseOrFocusParent', EditorUi>('layers.collapseOrFocusParent', ({ state }, { target }) => {` — a única porta (a seta esquerda na árvore) chega ao mesmo tratador com o `target` da linha focada.
- G4: n/a — o comando muda estado; a árvore de Camadas ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/layers/tree.ts:99`).
- G5: n/a — o encaixe da árvore é medido na Fase 6 (`src/editor/layers/tree.ts:99`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/layers/tree.ts:98`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/layers/tree.ts:95`).

## Medições
- a medir na Fase 6: a ordem de foco da árvore de Camadas (a linha do pai é um valor que só o navegador calcula), nas duas telas.
