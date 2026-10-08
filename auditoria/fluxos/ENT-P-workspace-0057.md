# ENT-P-workspace-0057 — workspace.movePanel pela porta workspace.movePanel#panel-drag-panel-header-left-edge
- **Comando:** workspace.movePanel
- **Porta:** `panel-drag-panel-header-left-edge`
- **Trecho:** TRC-workspace.movePanel

## Passos
1. `src/editor/input/pointer/effects.ts:180` `if (ps.panelling !== null) {` — só a solta de um arraste de painel segue.
2. `src/editor/input/pointer/effects.ts:184` `if (effect === 'commit') {` — só a confirmação entrega o painel a um lugar (o cancelamento não).
3. `src/editor/input/pointer/effects.ts:185` `const place = panelDrop(panelHintAt(ps.pointerAt.x, ps.pointerAt.y, dragging.press.panel));` — o lugar sob o ponteiro vira a porta do lugar e os seus argumentos.
4. `src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);` — o despacho do lugar com o painel arrastado (o Início da porta).
5. `src/app/commands.ts:486` `'workspace.movePanel': movePanel,` — a store resolve o id na tabela de comandos, que o liga ao tratador; a Chamada do trecho.

## Ramos
- `src/editor/input/pointer/effects.ts:180` `if (ps.panelling !== null) {` — só a solta de um arraste de painel segue.
- `src/editor/input/pointer/effects.ts:184` `if (effect === 'commit') {` — só a confirmação entrega o painel; o cancelamento não.
- `src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);` — o lugar sob o ponteiro precisa de uma porta (`place.door !== null`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);`), sem await, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.layout`, `ui.panels`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.layout.floating`, `ui.layout.right`, `ui.layout.combined`, `ui.layout.tabActive`, `ui.panels`).

## Resultado
- **Estado final:** EST-L01-037 com o painel fora de todo lugar antigo e no lugar pedido por `to` (`src/editor/workspace/layout.ts:239` `return { kind: 'change', ui: withLayout(ui, { ...layout, floating }), message: panelMessage('status.panel.floating', panel) };`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o painel aparece como janela, na doca, nas abas ou combinado (`src/editor/workspace/layout.ts:258` `return { kind: 'change', ui: withLayout(ui, { ...layout, combined }), message: panelMessage(args.to === 'tabs' ? 'status.panel.tabs' : 'status.panel.stacked', panel, { host: { key: panelName(host) } }) };`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/layout.ts:234` `const ui = detachPanel(state.ui, panel);`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/layout.ts:230` `export const movePanel = registerHandler<'workspace.movePanel', EditorUi>(` — a porta de arraste envia `panel`, `to` e o lugar (`at`/`host`); o tratador é o mesmo de todas as portas do comando workspace.movePanel.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/layout.ts:239` `return { kind: 'change', ui: withLayout(ui, { ...layout, floating }), message: panelMessage('status.panel.floating', panel) };`).
- G5: n/a — o encaixe dos painéis é medido na Fase 6 (`src/editor/workspace/layout.ts:238` `const floating = [...(layout.floating ?? []), { panel, x: Math.round(at.x), y: Math.round(at.y) }];`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:234` `const ui = detachPanel(state.ui, panel);`).

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, temporizador nem observador (`src/editor/input/pointer/effects.ts:186` `if (place.door !== null) closing?.dispatch(place.door.command.id as CommandId, { ...place.door.door.args, panel: dragging.press.panel, ...place.args } as never);`).

## Medições
- nenhuma — a porta não lê valores que só o navegador calcula; o encaixe é medido na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-workspace.movePanel
- **Argumentos enviados:** to: `dock-left`; panel: o painel arrastado
- R1 `src/editor/workspace/layout.ts:236` `if (args.to === FLOAT) {` — esta porta não envia `to` `float`: não toma este ramo.
- R2 `src/editor/workspace/layout.ts:241` `if (args.to === 'dock-left') {` — esta porta envia `to` `dock-left`: o caminho toma este ramo e devolve o painel ao lugar da esquerda.
- R3 `src/editor/workspace/layout.ts:244` `if (args.to === 'dock-right') {` — esta porta não envia `to` `dock-right`: não toma este ramo.
- R4 `src/editor/workspace/layout.ts:248` `if (args.to === 'workbench') {` — esta porta não envia `to` `workbench`: não toma este ramo.
- R5 `src/editor/workspace/layout.ts:255` `if (host === null) throw new Error(` — esta porta não envia `to` `tabs` nem `stack`: o `host` ausente não importa, não toma este ramo.
- R6 `src/editor/workspace/layout.ts:256` `const mode: CombinedPanel['mode'] = args.to === STACK ? 'stack' : 'tabs';` — esta porta não envia `to` `tabs` nem `stack`: não toma este ramo.
