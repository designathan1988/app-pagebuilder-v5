# ENT-P-workspace-0059 — workspace.movePanel pela porta workspace.movePanel#panel-drag-floating-header-anywhere

- **Tipo:** comando-porta panel-drag `manifest/commands/workspace.json:1703` `"kind": "panel-drag",`
- **Porta:** `manifest/commands/workspace.json:1702` `"id": "panel-drag-floating-header-anywhere",`
- **Gatilho:** `manifest/commands/workspace.json:1705` `"source": "floating-header",` `manifest/commands/workspace.json:1706` `"zone": "anywhere",` `manifest/commands/workspace.json:1707` `"gesture": "panel-drag",`
- **Tratador:** `src/app/commands.ts:486` `'workspace.movePanel': movePanel,`
- **Início:** `src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);`

## Passos
1. `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();` — o toque no cabeçalho de um painel abre um gesto da store do editor [escreve: EST-L05a-019 via store.gesture]
2. `src/editor/input/pointer/effects.ts:94` `if (press.on === 'panel') ps.panelling = { press };` — o arraste do painel começa no toque do cabeçalho
3. `src/editor/input/pointer/effects.ts:185` `const place = panelDrop(panelHintAt(ps.pointerAt.x, ps.pointerAt.y, dragging.press.panel));` — a solta lê o lugar onde o ponteiro está
4. `src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);` — a solta roda a porta do lugar, com o painel e o lugar como argumentos
5. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto do editor leva a intenção ao gesto do núcleo
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto executa o tratador
7. `src/app/commands.ts:486` `'workspace.movePanel': movePanel,` — a tabela liga o id ao tratador; o trecho TRC-workspace.movePanel começa aqui

## Ramos
- R1 `src/editor/workspace/layout.ts:236` `if (args.to === FLOAT) {` — `float`: a janela flutuante é posta em `at` (ou `{ x: 0, y: 0 }` sem ele) (passos 8 e 9).
- R2 `src/editor/workspace/layout.ts:241` `if (args.to === 'dock-left') {` — `dock-left`: a volta ao lugar da esquerda (`src/editor/workspace/layout.ts:212` `function dockedLeft(ui: EditorUi, panel: Panel): EditorUi {`).
- R3 `src/editor/workspace/layout.ts:244` `if (args.to === 'dock-right') {` — `dock-right`: entra na doca direita (`src/editor/workspace/layout.ts:246`).
- R4 `src/editor/workspace/layout.ts:248` `if (args.to === 'workbench') {` — `workbench`: entra nas abas do dock e esta abre (`src/editor/workspace/layout.ts:252`).
- R5 `src/editor/workspace/layout.ts:255` `if (host === null) throw new Error(` — `tabs`/`stack` sem `host` lança (defeito da porta); com `host`, segue para R6.
- R6 `src/editor/workspace/layout.ts:256` `const mode: CombinedPanel['mode'] = args.to === STACK ? 'stack' : 'tabs';` — `stack`: empilha sob o hospedeiro; `tabs`: vira uma aba da área dele (`src/editor/workspace/layout.ts:258`).

## Fronteiras assíncronas
- o efeito roda na solta do ponteiro, um ouvinte do dono do ponteiro `src/editor/input/pointer.ts:207` `target.addEventListener('pointerup', p.onUp, true);`; no intervalo entre o toque e a solta o gesto fica aberto (`shared.open`, EST-L05a-019) e outros toques podem rodar.

## Estado
- lê: EST-L01-037 (`ui.layout`, `ui.panels`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.layout.floating`, `ui.layout.right`, `ui.layout.combined`, `ui.layout.tabActive`, `ui.panels`).
- o dono do ponteiro: EST-L05a-019 (`open`, o gesto aberto da store) — escrito ao abrir o gesto `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();`.

## Resultado
- **Estado final:** EST-L01-037 com o painel fora de todo lugar antigo e no lugar pedido por `to` (`src/editor/workspace/layout.ts:239`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o painel aparece como janela, na doca, nas abas ou combinado (`src/editor/workspace/layout.ts:258`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/layout.ts:234`).
- G2: ok `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é gravada quando o gesto do editor abre.
- G3: ok `src/editor/workspace/layout.ts:230` `export const movePanel = registerHandler<'workspace.movePanel', EditorUi>(` — as portas de arraste (header para o canvas, para a borda esquerda, para a direita, para a parte de cima ou de baixo de outro painel) e o botão Dock chegam ao mesmo tratador com só `to`, `at` e `host`.
- G4: n/a — o comando muda estado; a janela flutuante cobre parte do canvas e esse cobrimento é medido na Fase 6 (`src/editor/workspace/layout.ts:239`).
- G5: n/a — o encaixe da janela flutuante e das áreas combinadas é medido na Fase 6 (`src/editor/workspace/layout.ts:238`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:234`).

## Limpeza
- o ouvinte do dono do ponteiro é removido em `src/editor/input/pointer.ts:237` `target.removeEventListener('pointerup', p.onUp, true);`; o trecho não cria outro ouvinte, temporizador nem observador.

## Medições
- a medir na Fase 6: o ponto `at` da janela flutuante e a sua dimensão são valores que só o navegador calcula (posição e dimensão de painel); medir o encaixe da janela e das áreas combinadas nas duas telas (famílias `off-window`, `covered`, `sideways`).

## Ramos do trecho
- **Trecho:** TRC-workspace.movePanel
- **Argumentos enviados:** o manifesto declara `to` `float`; ao despachar, o lugar acrescenta `panel` (o painel arrastado) e `at`
- R1 `src/editor/workspace/layout.ts:236` `if (args.to === FLOAT) {` — esta porta envia `to` `float`: o caminho entra por este lado (janela flutuante no ponto `at`).
- R2 `src/editor/workspace/layout.ts:241` `if (args.to === 'dock-left') {` — esta porta não envia `to` `dock-left`; não entra por este lado.
- R3 `src/editor/workspace/layout.ts:244` `if (args.to === 'dock-right') {` — esta porta não envia `to` `dock-right`; não entra por este lado.
- R4 `src/editor/workspace/layout.ts:248` `if (args.to === 'workbench') {` — esta porta não envia `to` `workbench`; não entra por este lado.
- R5 `src/editor/workspace/layout.ts:255` `if (host === null) throw new Error(`workspace.movePanel: ${args.to} names the panel it combines with`);` — esta porta não envia `to` `tabs` nem `stack`; não passa por este ramo.
- R6 `src/editor/workspace/layout.ts:256` `const mode: CombinedPanel['mode'] = args.to === STACK ? 'stack' : 'tabs';` — esta porta não envia `to` `tabs` nem `stack`; não passa por este ramo.
