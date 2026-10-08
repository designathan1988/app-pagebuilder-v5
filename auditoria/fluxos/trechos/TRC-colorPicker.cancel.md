# TRC-colorPicker.cancel
- **Chamada:** `src/app/commands.ts:405` `'colorPicker.cancel': cancelColorPicker,`
- **Argumentos:** nenhum.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:405` `'colorPicker.cancel': cancelColorPicker,` — a tabela liga o id ao tratador.
2. `src/editor/shell/color.tsx:51` `dispatchInSession(store, entry.command.id as CommandId, { ...entry.door.args, ...args });` — o botão Cancelar entrega a intenção à sessão.
3. `src/editor/input/pointer/common.ts:389` `const result = shared.sessionDispatch === null ? null : shared.sessionDispatch(id, args);` — o despacho vai pela sessão do ponteiro.
4. `src/editor/input/pointer.ts:146` `return through !== null ? through.dispatch(id as never, args as never) : (store.dispatch as (i: CommandId, a: unknown) => DispatchResult)(id, args);` — a intenção entra no gesto aberto.
5. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto executa o tratador [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-037 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
7. `src/editor/inspector/color-picker.ts:101` `state.ui.colorPicker === null ? { kind: 'change' } : { kind: 'change', ui: closed(state.ui, false), message: message('status.colorPicker.cancelled') },` — o seletor fecha e a sessão é marcada como não aplicada [escreve: EST-L01-037 via closed].
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
10. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados; entre eles o dono do ponteiro vê o seletor fechado [lê: EST-L01-037 via publish].
11. `src/editor/input/pointer/tools.ts:40` `else closing.cancel();` — o gesto da sessão é cancelado.
12. `src/core/store/store.ts:750` `if (state !== before) publish(commit({ ...state, document: before.document, selection: before.selection, history: before.history }, 'a cancelled gesture'), current.inverses);` — o documento volta ao de antes da sessão, sem entrada de undo [escreve: EST-L01-030 via publish] [escreve: EST-L01-031 via publish] [escreve: EST-L01-032 via publish].
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados de novo; a cor viva é desfeita [lê: EST-L01-030 via publish].

## Ramos
- R1 `src/editor/inspector/color-picker.ts:101` `state.ui.colorPicker === null ? { kind: 'change' } : { kind: 'change', ui: closed(state.ui, false), message: message('status.colorPicker.cancelled') },` — seletor já fechado: mudança vazia; aberto: fecha e a sessão é cancelada (passos 7 a 12).

## Fronteiras assíncronas
- o dono do ponteiro termina a sessão num microtarefa depois de o estado publicar: `src/editor/input/pointer/tools.ts:42` `queueMicrotask(() => finishPickerSession(shared));` — no intervalo, a sessão já não aceita escritas e o seletor está fechado.

## Estado
- lê: EST-L01-030 (o documento, via run, publish), EST-L01-031 (a seleção, via run), EST-L01-037 (o estado do editor, via run, publish).
- escreve: EST-L01-037 (o estado do editor, via closed, run, publish), EST-L01-030 (o documento, via publish), EST-L01-031 (a seleção, via publish), EST-L01-032 (o histórico, via publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.colorPicker` nulo, `ui.colorPickerClosed.applied` falso e o documento de volta ao de antes da sessão (`src/core/store/store.ts:721`); a seleção também volta.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o seletor fechado e o elemento com a cor antiga.
- **DOM do editor:** o seletor some (`src/editor/inspector/color-picker.ts:101`).
- **DOM do canvas:** o elemento volta a ser desenhado com o valor com que o seletor abriu (`src/core/store/store.ts:721`).

## Regras
- G1: ok `src/core/store/store.ts:750` `if (state !== before) publish(commit({ ...state, document: before.document, selection: before.selection, history: before.history }, 'a cancelled gesture'), current.inverses);` — o cancelamento devolve o documento e a seleção guardados no começo do gesto, sem gravar passo.
- G2: n/a — o comando roda dentro da sessão do seletor, aberta com o seletor; a digitação pendente foi gravada quando essa sessão abriu (`src/editor/store.ts:205` `keepTyping();`).
- G3: ok `src/editor/inspector/color-picker.ts:100` `export const cancelColorPicker = registerHandler<'colorPicker.cancel', EditorUi>('colorPicker.cancel', ({ state }) =>` — a única porta (o botão Cancelar, também o Esc do seletor) chega ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; o seletor abre sobre o painel e o cobrimento no ponto da ação é medido na Fase 6 (`src/editor/inspector/color-picker.ts:101`).
- G5: n/a — o encaixe do seletor é medido na Fase 6 (`src/editor/inspector/color-picker.ts:101`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: ok `src/core/store/store.ts:750` `if (state !== before) publish(commit({ ...state, document: before.document, selection: before.selection, history: before.history }, 'a cancelled gesture'), current.inverses);` — a mudança do documento é levada aos ouvintes de documento, que redesenham o elemento com a cor antiga.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento restaurado é validado antes de publicar.

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/color-picker.ts:101`); o microtarefa do dono do ponteiro fecha a sessão (`src/editor/input/pointer/tools.ts:42` `queueMicrotask(() => finishPickerSession(shared));`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
