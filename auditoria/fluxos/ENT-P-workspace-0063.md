# ENT-P-workspace-0063 — quickPanel.setOffset pela porta quickPanel.setOffset#panel-drag-quick-panel-grip-canvas

- **Tipo:** comando-porta panel-drag `manifest/commands/workspace.json:1831` `"kind": "panel-drag",`
- **Porta:** `manifest/commands/workspace.json:1830` `"id": "panel-drag-quick-panel-grip-canvas",`
- **Gatilho:** `manifest/commands/workspace.json:1833` `"source": "quick-panel-grip",` `manifest/commands/workspace.json:1834` `"zone": "canvas",` `manifest/commands/workspace.json:1835` `"gesture": "quick-panel-grip",`
- **Tratador:** `src/app/commands.ts:487` `'quickPanel.setOffset': setOffset,`
- **Início:** `src/editor/input/pointer/panels.ts:54` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, offset: { x: press.base.x + at.x - start.x, y: press.base.y + at.y - start.y }, distance: at.x - start.x } as never);`

## Passos
1. `src/editor/input/pointer/panels.ts:49` `const moveGrip = (at: Point) => {` — a alça do painel rápido arrasta a partir do toque
2. `src/editor/input/pointer/panels.ts:53` `shared.open = store.gesture();` — cada passo do arraste reabre o gesto [escreve: EST-L05a-019 via store.gesture]
3. `src/editor/input/pointer/panels.ts:54` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, offset: { x: press.base.x + at.x - start.x, y: press.base.y + at.y - start.y }, distance: at.x - start.x } as never);` — a alça despacha o deslocamento novo no gesto
4. `src/editor/store.ts:221` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto do editor leva a intenção ao gesto do núcleo
5. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto executa o tratador
6. `src/app/commands.ts:487` `'quickPanel.setOffset': setOffset,` — a tabela liga o id ao tratador; o trecho TRC-quickPanel.setOffset começa aqui

## Ramos
- R1 `src/editor/quick-panel/quick-panel.ts:61` `if (held !== undefined && held.x === x && held.y === y) return { kind: 'change' };` — um deslocamento igual ao guardado devolve mudança vazia; diferente segue para o passo 8.

## Fronteiras assíncronas
- cada passo é um movimento do ponteiro, um ouvinte do dono do ponteiro `src/editor/input/pointer.ts:206` `target.addEventListener('pointermove', p.onMove, true);`; a cada passo o gesto é cancelado e reaberto, e o deslocamento do passo entra nele.

## Estado
- lê: EST-L01-037 (`ui.preferences.quickPanelOffsets`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.quickPanelOffsets`).
- o dono do ponteiro: EST-L05a-019 (`open`, o gesto aberto da store) — escrito ao abrir o gesto `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();`.

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.quickPanelOffsets[target]` no ponto arredondado (`src/editor/quick-panel/quick-panel.ts:62`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o painel rápido passa a ser desenhado no deslocamento guardado (`src/editor/quick-panel/quick-panel.ts:62`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/quick-panel/quick-panel.ts:62`).
- G2: ok `src/editor/store.ts:216` `keepTyping();` — a digitação pendente é gravada quando o gesto do editor abre.
- G3: ok `src/editor/quick-panel/quick-panel.ts:57` `export const setOffset = registerHandler<'quickPanel.setOffset', EditorUi>('quickPanel.setOffset', ({ state }, { target, offset }) => {` — a única porta (o arraste da alça do painel) chega ao mesmo tratador com o `target` e o `offset` que o gesto leu.
- G4: n/a — o comando muda estado; o painel que ele posiciona fica ao lado do rótulo e nada cobre o canvas no ponto da ação (`src/editor/quick-panel/quick-panel.ts:62`); a colocação é medida na Fase 6.
- G5: n/a — a colocação do painel rápido é medida na Fase 6 (`src/editor/quick-panel/quick-panel.ts:62`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/quick-panel/quick-panel.ts:62`).

## Limpeza
- o ouvinte do dono do ponteiro é removido em `src/editor/input/pointer.ts:237` `target.removeEventListener('pointerup', p.onUp, true);`; o trecho não cria outro ouvinte, temporizador nem observador.

## Medições
- a medir na Fase 6: o deslocamento do painel rápido é um valor que só o navegador calcula (posição do elemento e do painel no palco); medir a colocação com o painel arrastado, nas duas telas (famílias `off-window`, `covered`).

## Ramos do trecho
- **Trecho:** TRC-quickPanel.setOffset
- **Argumentos enviados:** a porta declara `{}`; o gesto acrescenta `target` (o nó do painel rápido), `offset` (o canto novo) e `distance`
- R1 `src/editor/quick-panel/quick-panel.ts:61` `if (held !== undefined && held.x === x && held.y === y) return { kind: 'change' };` — a alça calcula o deslocamento a cada passo do arraste: quando ele iguala o guardado o caminho passa pelo lado da mudança vazia; diferente, pelo lado que grava.
