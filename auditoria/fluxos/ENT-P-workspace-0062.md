# ENT-P-workspace-0062 — workspace.movePanel pela porta workspace.movePanel#panel-header-dock

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:1769` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:1768` `"id": "panel-header-dock",`
- **Tratador:** `src/app/commands.ts:486` `'workspace.movePanel': movePanel,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:286` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:93` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:144` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:486` `'workspace.movePanel': movePanel,` — a tabela liga o id ao tratador; o trecho TRC-workspace.movePanel começa aqui

## Ramos
- R1 `src/editor/workspace/layout.ts:236` `if (args.to === FLOAT) {` — `float`: a janela flutuante é posta em `at` (ou `{ x: 0, y: 0 }` sem ele) (passos 8 e 9).
- R2 `src/editor/workspace/layout.ts:241` `if (args.to === 'dock-left') {` — `dock-left`: a volta ao lugar da esquerda (`src/editor/workspace/layout.ts:212` `function dockedLeft(ui: EditorUi, panel: Panel): EditorUi {`).
- R3 `src/editor/workspace/layout.ts:244` `if (args.to === 'dock-right') {` — `dock-right`: entra na doca direita (`src/editor/workspace/layout.ts:246`).
- R4 `src/editor/workspace/layout.ts:248` `if (args.to === 'workbench') {` — `workbench`: entra nas abas do dock e esta abre (`src/editor/workspace/layout.ts:252`).
- R5 `src/editor/workspace/layout.ts:255` `if (host === null) throw new Error(` — `tabs`/`stack` sem `host` lança (defeito da porta); com `host`, segue para R6.
- R6 `src/editor/workspace/layout.ts:256` `const mode: CombinedPanel['mode'] = args.to === STACK ? 'stack' : 'tabs';` — `stack`: empilha sob o hospedeiro; `tabs`: vira uma aba da área dele (`src/editor/workspace/layout.ts:258`).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/workspace/layout.ts:230` `export const movePanel = registerHandler<'workspace.movePanel', EditorUi>(`); o arraste que o chama entrega o ponto `at` a cada solta, mas cada solta roda inteira dentro do trecho.

## Estado
- lê: EST-L01-037 (`ui.layout`, `ui.panels`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.layout.floating`, `ui.layout.right`, `ui.layout.combined`, `ui.layout.tabActive`, `ui.panels`).

## Resultado
- **Estado final:** EST-L01-037 com o painel fora de todo lugar antigo e no lugar pedido por `to` (`src/editor/workspace/layout.ts:239`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o painel aparece como janela, na doca, nas abas ou combinado (`src/editor/workspace/layout.ts:258`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/layout.ts:234`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/layout.ts:230` `export const movePanel = registerHandler<'workspace.movePanel', EditorUi>(` — as portas de arraste (header para o canvas, para a borda esquerda, para a direita, para a parte de cima ou de baixo de outro painel) e o botão Dock chegam ao mesmo tratador com só `to`, `at` e `host`.
- G4: n/a — o comando muda estado; a janela flutuante cobre parte do canvas e esse cobrimento é medido na Fase 6 (`src/editor/workspace/layout.ts:239`).
- G5: n/a — o encaixe da janela flutuante e das áreas combinadas é medido na Fase 6 (`src/editor/workspace/layout.ts:238`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:234`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/workspace/layout.ts:234`).

## Medições
- a medir na Fase 6: o ponto `at` da janela flutuante e a sua dimensão são valores que só o navegador calcula (posição e dimensão de painel); medir o encaixe da janela e das áreas combinadas nas duas telas (famílias `off-window`, `covered`, `sideways`).

## Ramos do trecho
- **Trecho:** TRC-workspace.movePanel
- **Argumentos enviados:** o manifesto declara `to` `dock-left`; o botão não acrescenta nada
- R1 `src/editor/workspace/layout.ts:236` `if (args.to === FLOAT) {` — esta porta não envia `to` `float`; não entra por este lado.
- R2 `src/editor/workspace/layout.ts:241` `if (args.to === 'dock-left') {` — esta porta envia `to` `dock-left`: o caminho entra por este lado.
- R3 `src/editor/workspace/layout.ts:244` `if (args.to === 'dock-right') {` — esta porta não envia `to` `dock-right`; não entra por este lado.
- R4 `src/editor/workspace/layout.ts:248` `if (args.to === 'workbench') {` — esta porta não envia `to` `workbench`; não entra por este lado.
- R5 `src/editor/workspace/layout.ts:255` `if (host === null) throw new Error(`workspace.movePanel: ${args.to} names the panel it combines with`);` — esta porta não envia `to` `tabs` nem `stack`; não passa por este ramo.
- R6 `src/editor/workspace/layout.ts:256` `const mode: CombinedPanel['mode'] = args.to === STACK ? 'stack' : 'tabs';` — esta porta não envia `to` `tabs` nem `stack`; não passa por este ramo.
