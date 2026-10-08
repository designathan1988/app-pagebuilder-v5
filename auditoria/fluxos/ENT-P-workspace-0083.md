# ENT-P-workspace-0083 — layers.expandOrFocusChild pela porta layers.expandOrFocusChild#key-arrow-right-in-layers-tree

- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:2526` `"kind": "shortcut",`
- **Porta:** `manifest/commands/workspace.json:2525` `"id": "key-arrow-right-in-layers-tree",`
- **Gatilho:** `manifest/commands/workspace.json:2528` `"chord": "ArrowRight",`
- **Tratador:** `src/app/commands.ts:497` `'layers.expandOrFocusChild': expandOrFocusChild,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`

## Passos
1. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — de onde a intenção sai: o gesto aberto, a rajada de letras ou a store do editor
2. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do contexto e os da porta são unidos em `given`
3. `src/editor/input/keymap.ts:527` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — um atalho com gesto escala o valor; sem gesto, os argumentos ficam como estão
4. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — sem argumento de área de transferência: a intenção é despachada
5. `src/app/commands.ts:497` `'layers.expandOrFocusChild': expandOrFocusChild,` — a tabela liga o id ao tratador; o trecho TRC-layers.expandOrFocusChild começa aqui

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
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
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

## Ramos do trecho
- **Trecho:** TRC-layers.expandOrFocusChild
- **Argumentos enviados:** a porta não declara argumento; o contexto acrescenta `target` (o nó da linha focada; sem ele, a seleção primária)
- R1 `src/editor/layers/tree.ts:87` `if (!found || found.node.children.length === 0) return { kind: 'change' };` — esta porta envia um `target` (a linha focada; sem ela vale a seleção primária): um `target` sem ramo passa pelo lado da mudança vazia; um nó com filhos segue.
- R2 `src/editor/layers/tree.ts:89` `if (collapsed.includes(found.node.id)) return { kind: 'change', ui: withCollapsed(state.ui, collapsed.filter((x) => x !== found.node.id)), message: message('status.layers.unfolded', { name: found.node.name }) };` — ramo fechado: o caminho abre o ramo; ramo aberto: pede o foco ao primeiro filho.
