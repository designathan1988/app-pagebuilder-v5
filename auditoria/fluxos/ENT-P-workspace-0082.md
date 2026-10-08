# ENT-P-workspace-0082 — layers.expandAll pela porta layers.expandAll#toolbar-layers-header-expand-all

- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:2480` `"kind": "toolbar",`
- **Porta:** `manifest/commands/workspace.json:2479` `"id": "toolbar-layers-header-expand-all",`
- **Tratador:** `src/app/commands.ts:496` `'layers.expandAll': expandAll,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:496` `'layers.expandAll': expandAll,` — a tabela liga o id ao tratador; o trecho TRC-layers.expandAll começa aqui

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

## Ramos do trecho
- **Trecho:** TRC-layers.expandAll
- **Argumentos enviados:** a porta não envia argumento
- nenhum — o trecho TRC-layers.expandAll não lista ramo que dependa dos argumentos; o tratador deixa a lista de fechados vazia `src/editor/layers/tree.ts:118` `export const expandAll = registerHandler<'layers.expandAll', EditorUi>('layers.expandAll', ({ state }) => ({ kind: 'change', ui: withCollapsed(state.ui, []), message: message('status.layers.expandedAll') }));`.
