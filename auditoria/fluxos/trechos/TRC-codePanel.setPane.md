# TRC-codePanel.setPane
- **Chamada:** `src/app/commands.ts:507` `'codePanel.setPane': setPane,`
- **Argumentos:** `{ pane }` — um enum `html`/`css`/`js`.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:507` `'codePanel.setPane': setPane,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/code-panel/code-panel.ts:139` `({ state }, { pane }) => ({ kind: 'change', ui: { ...state.ui, codePane: pane === 'html' ? undefined : pane }, message: message(SAID_PANE[pane]) }),` — a parte escolhida vai para `ui.codePane` (ausente quando é html, o predefinido) [escreve: EST-L01-037 via run].
7. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
8. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
9. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
10. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e o painel de código redesenha [lê: EST-L01-037 via publish].

## Ramos
- nenhum — o tratador grava a parte escolhida e devolve sempre a mudança `src/editor/code-panel/code-panel.ts:139` `({ state }, { pane }) => ({ kind: 'change', ui: { ...state.ui, codePane: pane === 'html' ? undefined : pane }, message: message(SAID_PANE[pane]) }),`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/code-panel/code-panel.ts:137` `export const setPane = registerHandler<'codePanel.setPane', EditorUi>(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, run, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via run, publish), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (o estado do editor, via run, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.codePane` na parte escolhida, ausente quando é `html` (`src/editor/code-panel/code-panel.ts:139`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel de código.
- **DOM do editor:** o painel mostra a marcação, a folha de estilo ou o script (`src/editor/code-panel/code-panel.ts:139`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/code-panel/code-panel.ts:139`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/code-panel/code-panel.ts:137` `export const setPane = registerHandler<'codePanel.setPane', EditorUi>(` — as três abas (HTML, CSS, JS) chegam ao mesmo tratador com só `pane`.
- G4: n/a — o comando muda estado; o painel de código ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/code-panel/code-panel.ts:139`).
- G5: n/a — o encaixe do painel de código é medido na Fase 6 (`src/editor/code-panel/code-panel.ts:139`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/code-panel/code-panel.ts:139`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/code-panel/code-panel.ts:139`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
