# ENT-P-workspace-0079 — layers.setExpanded pela porta layers.setExpanded#layers-caret

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2372` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:2371` `"id": "layers-caret",`
- **Tratador:** `src/app/commands.ts:494` `'layers.setExpanded': setExpanded,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:494` `'layers.setExpanded': setExpanded,` — a tabela liga o id ao tratador; o trecho TRC-layers.setExpanded começa aqui

## Ramos
- R1 `src/editor/layers/tree.ts:71` `if (!found || found.node.children.length === 0) return { kind: 'change' };` — um `target` que não é nó, ou um nó sem filhos, devolve mudança vazia; um nó com filhos segue.
- R2 `src/editor/layers/tree.ts:75` `if (fold === folded) return { kind: 'change' };` — o pedido já é o estado do ramo: mudança vazia; diferente segue para o passo 9.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/layers/tree.ts:69` `export const setExpanded = registerHandler<'layers.setExpanded', EditorUi>('layers.setExpanded', ({ state }, { target, expanded }) => {`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (documento: `locate`) e EST-L01-037 (`ui.layers.collapsed`), EST-L05a-001 (digitação pendente).
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

## Ramos do trecho
- **Trecho:** TRC-layers.setExpanded
- **Argumentos enviados:** a porta declara `expanded` `toggle`; o caret acrescenta `target` (o nó da linha)
- R1 `src/editor/layers/tree.ts:71` `if (!found || found.node.children.length === 0) return { kind: 'change' };` — esta porta envia um `target`: um `target` que não é nó, ou um nó sem filhos, passa pelo lado da mudança vazia; um nó com filhos segue para R2.
- R2 `src/editor/layers/tree.ts:75` `if (fold === folded) return { kind: 'change' };` — esta porta envia `expanded` `toggle`: inverte o ramo; quando o pedido já é o estado do ramo o caminho passa pelo lado da mudança vazia; diferente, pelo lado que grava.
