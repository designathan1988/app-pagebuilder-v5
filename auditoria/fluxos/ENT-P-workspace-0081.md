# ENT-P-workspace-0081 — layers.collapseAll pela porta layers.collapseAll#toolbar-layers-header-collapse-all

- **Tipo:** comando-porta toolbar `manifest/commands/workspace.json:2440` `"kind": "toolbar",`
- **Porta:** `manifest/commands/workspace.json:2439` `"id": "toolbar-layers-header-collapse-all",`
- **Tratador:** `src/app/commands.ts:495` `'layers.collapseAll': collapseAll,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:495` `'layers.collapseAll': collapseAll,` — a tabela liga o id ao tratador; o trecho TRC-layers.collapseAll começa aqui

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
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
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

## Ramos do trecho
- **Trecho:** TRC-layers.collapseAll
- **Argumentos enviados:** a porta não envia argumento
- nenhum — o trecho TRC-layers.collapseAll não lista ramo que dependa dos argumentos; o tratador fecha todo ramo com filhos `src/editor/layers/tree.ts:115` `return { kind: 'change', ui: withCollapsed(state.ui, branches), message: message('status.layers.collapsedAll') };`.
