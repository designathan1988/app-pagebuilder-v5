# TRC-layers.expandOrFocusChild
- **Chamada:** `src/app/commands.ts:497` `'layers.expandOrFocusChild': expandOrFocusChild,`
- **Argumentos:** `{ target? }` — o id do nó da linha focada (opcional; sem ele, usa a seleção primária).
- **Ramos que dependem dos argumentos:** R1 (o nó sem ramo), R2 (o ramo já aberto).

## Passos
1. `src/app/commands.ts:497` `'layers.expandOrFocusChild': expandOrFocusChild,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/layers/tree.ts:85` `const id = target ?? state.selection[0];` — o nó vem do argumento ou da seleção [lê: EST-L01-031 via handlerContext].
7. `src/editor/layers/tree.ts:86` `const found = id === undefined ? null : locate(state.document, id);` — o nó é achado no documento [lê: EST-L01-030 via locate].
8. `src/editor/layers/tree.ts:88` `const { collapsed } = state.ui.layers;` — os ramos fechados são lidos [lê: EST-L01-037 via handlerContext].
9. `src/editor/layers/tree.ts:89` `if (collapsed.includes(found.node.id)) return { kind: 'change', ui: withCollapsed(state.ui, collapsed.filter((x) => x !== found.node.id)), message: message('status.layers.unfolded', { name: found.node.name }) };` — o ramo fechado abre [escreve: EST-L01-037 via withCollapsed].
10. `src/editor/layers/tree.ts:90` `return { kind: 'change', ui: asking(state.ui, 'next') };` — o ramo aberto pede o foco ao filho seguinte [escreve: EST-L01-037 via asking].
11. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
12. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
13. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
14. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados [lê: EST-L01-002 via publish].

## Ramos
- R1 `src/editor/layers/tree.ts:87` `if (!found || found.node.children.length === 0) return { kind: 'change' };` — um nó sem ramo (ou sem filhos) devolve mudança vazia; um nó com filhos segue.
- R2 `src/editor/layers/tree.ts:89` `if (collapsed.includes(found.node.id)) return { kind: 'change', ui: withCollapsed(state.ui, collapsed.filter((x) => x !== found.node.id)), message: message('status.layers.unfolded', { name: found.node.name }) };` — ramo fechado: abre (passo 9), sem mover o foco; ramo aberto: o foco vai ao primeiro filho (passo 10, `asking(state.ui, 'next')`).

## Fronteiras assíncronas
- o pedido de foco gravado em `ui.focus` (passo 10) é atendido pelo instalador do foco quando o estado muda, num quadro: `src/editor/focus/focus.ts:187` `requestAnimationFrame(() =>` — só então o item seguinte toma o foco.

## Estado
- lê: EST-L01-030 (documento: `locate`), EST-L01-031 (seleção), EST-L01-037 (`ui.layers.collapsed`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.layers.collapsed`, `ui.focus`).

## Resultado
- **Estado final:** EST-L01-037 com o ramo do nó aberto (`src/editor/layers/tree.ts:89`) ou com os ramos intactos e um pedido de foco em `ui.focus` (`src/editor/layers/tree.ts:90`); o documento e a seleção não mudam.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a árvore.
- **DOM do editor:** o ramo abre, ou o foco passa ao primeiro filho da linha (`src/editor/layers/tree.ts:90`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/layers/tree.ts:89`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/layers/tree.ts:84` `export const expandOrFocusChild = registerHandler<'layers.expandOrFocusChild', EditorUi>('layers.expandOrFocusChild', ({ state }, { target }) => {` — a única porta (a seta direita na árvore) chega ao mesmo tratador com o `target` da linha focada.
- G4: n/a — o comando muda estado; a árvore de Camadas ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/layers/tree.ts:90`).
- G5: n/a — o encaixe da árvore é medido na Fase 6 (`src/editor/layers/tree.ts:90`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/layers/tree.ts:89`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/layers/tree.ts:86`).

## Medições
- a medir na Fase 6: a ordem de foco da árvore de Camadas (o item seguinte da linha focada é um valor que só o navegador calcula), nas duas telas.
