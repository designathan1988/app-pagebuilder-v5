# ENT-P-workspace-0084 — layers.collapseOrFocusParent pela porta layers.collapseOrFocusParent#key-arrow-left-in-layers-tree

- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:2570` `"kind": "shortcut",`
- **Porta:** `manifest/commands/workspace.json:2569` `"id": "key-arrow-left-in-layers-tree",`
- **Gatilho:** `manifest/commands/workspace.json:2572` `"chord": "ArrowLeft",`
- **Tratador:** `src/app/commands.ts:498` `'layers.collapseOrFocusParent': collapseOrFocusParent,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`

## Passos
1. `src/editor/input/keymap.ts:526` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — de onde a intenção sai: o gesto aberto, a rajada de letras ou a store do editor
2. `src/editor/input/keymap.ts:527` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do contexto e os da porta são unidos em `given`
3. `src/editor/input/keymap.ts:528` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — um atalho com gesto escala o valor; sem gesto, os argumentos ficam como estão
4. `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — sem argumento de área de transferência: a intenção é despachada
5. `src/app/commands.ts:498` `'layers.collapseOrFocusParent': collapseOrFocusParent,` — a tabela liga o id ao tratador; o trecho TRC-layers.collapseOrFocusParent começa aqui

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
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
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

## Ramos do trecho
- **Trecho:** TRC-layers.collapseOrFocusParent
- **Argumentos enviados:** a porta não declara argumento; o contexto acrescenta `target` (o nó da linha focada; sem ele, a seleção primária)
- R1 `src/editor/layers/tree.ts:96` `if (!found) return { kind: 'change' };` — esta porta envia um `target` (a linha focada; sem ela vale a seleção primária): um `target` que não é nó passa pelo lado da mudança vazia; um nó válido segue.
- R2 `src/editor/layers/tree.ts:98` `if (found.node.children.length > 0 && !collapsed.includes(found.node.id)) return { kind: 'change', ui: withCollapsed(state.ui, [...collapsed, found.node.id]), message: message('status.layers.folded', { name: found.node.name }) };` — ramo aberto com filhos: o caminho fecha o ramo; já fechado ou sem filhos: segue para R3.
- R3 `src/editor/layers/tree.ts:99` `return found.parent === null ? { kind: 'change' } : { kind: 'change', ui: asking(state.ui, 'parent') };` — a raiz (sem pai) passa pelo lado da mudança vazia; um nó com pai pede o foco à linha do pai.
