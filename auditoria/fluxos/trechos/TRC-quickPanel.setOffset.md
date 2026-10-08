# TRC-quickPanel.setOffset
- **Chamada:** `src/app/commands.ts:487` `'quickPanel.setOffset': setOffset,`
- **Argumentos:** `{ target, offset, distance? }` — `target` um id de nó, `offset` um ponto (o deslocamento do canto do painel em relação ao elemento), `distance` um número opcional.
- **Ramos que dependem dos argumentos:** R1 (um `offset` igual ao guardado).

## Passos
1. `src/app/commands.ts:487` `'quickPanel.setOffset': setOffset,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/quick-panel/quick-panel.ts:58` `const x = Math.round(offset.x);` — a coordenada é arredondada a px inteiro.
7. `src/editor/quick-panel/quick-panel.ts:60` `const held = quickPanelOffsets(state.ui)[target];` — o deslocamento guardado do elemento é lido [lê: EST-L01-037 via quickPanelOffsets].
8. `src/editor/quick-panel/quick-panel.ts:62` `return { kind: 'change', ui: { ...state.ui, preferences: { ...state.ui.preferences, quickPanelOffsets: { ...quickPanelOffsets(state.ui), [target]: { x, y } } } } };` — o deslocamento novo é guardado na preferência, por elemento [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish].
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/quick-panel/quick-panel.ts:61` `if (held !== undefined && held.x === x && held.y === y) return { kind: 'change' };` — um deslocamento igual ao guardado devolve mudança vazia; diferente segue para o passo 8.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/quick-panel/quick-panel.ts:57` `export const setOffset = registerHandler<'quickPanel.setOffset', EditorUi>('quickPanel.setOffset', ({ state }, { target, offset }) => {`); o arraste que o chama repete o despacho, mas cada passo roda inteiro dentro do trecho.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal), EST-L01-037 (o estado do editor, `ui.preferences.quickPanelOffsets`, via quickPanelOffsets, run, publish), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.quickPanelOffsets`, via run, publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.quickPanelOffsets[target]` no ponto arredondado (`src/editor/quick-panel/quick-panel.ts:62`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o painel rápido passa a ser desenhado no deslocamento guardado (`src/editor/quick-panel/quick-panel.ts:62`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/quick-panel/quick-panel.ts:62`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/quick-panel/quick-panel.ts:57` `export const setOffset = registerHandler<'quickPanel.setOffset', EditorUi>('quickPanel.setOffset', ({ state }, { target, offset }) => {` — a única porta (o arraste da alça do painel) chega ao mesmo tratador com o `target` e o `offset` que o gesto leu.
- G4: n/a — o comando muda estado; o painel que ele posiciona fica ao lado do rótulo e nada cobre o canvas no ponto da ação (`src/editor/quick-panel/quick-panel.ts:62`); a colocação é medida na Fase 6.
- G5: n/a — a colocação do painel rápido é medida na Fase 6 (`src/editor/quick-panel/quick-panel.ts:62`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/quick-panel/quick-panel.ts:62`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/quick-panel/quick-panel.ts:58`).

## Medições
- a medir na Fase 6: o deslocamento do painel rápido é um valor que só o navegador calcula (posição do elemento e do painel no palco); medir a colocação com o painel arrastado, nas duas telas (famílias `off-window`, `covered`).
