# TRC-colorPicker.setFormat
- **Chamada:** `src/app/commands.ts:402` `'colorPicker.setFormat': setColorFormat,`
- **Argumentos:** `{ format }` — um enum `hsb`/`rgb`/`hex`/`oklch`/`oklab`.
- **Ramos que dependem dos argumentos:** R1 (o seletor fechado).

## Passos
1. `src/app/commands.ts:402` `'colorPicker.setFormat': setColorFormat,` — a tabela liga o id ao tratador.
2. `src/editor/shell/color.tsx:51` `dispatchInSession(store, entry.command.id as CommandId, { ...entry.door.args, ...args });` — a porta do seletor entrega a intenção à sessão.
3. `src/editor/input/pointer/common.ts:371` `const result = shared.sessionDispatch === null ? null : shared.sessionDispatch(id, args);` — o despacho vai pela sessão do ponteiro.
4. `src/editor/input/pointer.ts:146` `return through !== null ? through.dispatch(id as never, args as never) : (store.dispatch as (i: CommandId, a: unknown) => DispatchResult)(id, args);` — a intenção entra no gesto aberto.
5. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto executa o tratador [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-037 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
7. `src/editor/inspector/color-picker.ts:46` `({ state }, { format }) => (state.ui.colorPicker === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, colorPicker: { ...state.ui.colorPicker, format } } }),` — o formato novo é gravado no seletor aberto [escreve: EST-L01-037 via run].
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish].
11. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e o seletor redesenha [lê: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/inspector/color-picker.ts:46` `({ state }, { format }) => (state.ui.colorPicker === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, colorPicker: { ...state.ui.colorPicker, format } } }),` — seletor fechado: mudança vazia; aberto: grava o formato (passo 7).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/color-picker.ts:44` `export const setColorFormat = registerHandler<'colorPicker.setFormat', EditorUi>(`); a sessão do ponteiro é um gesto já aberto, e a mudança de estado publica na hora.

## Estado
- lê: EST-L01-030 (o documento, via run, commit), EST-L01-031 (a seleção, via run, commit), EST-L01-037 (o estado do editor, via run, publish).
- escreve: EST-L01-037 (o estado do editor, via run, publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.colorPicker.format` no formato escolhido (`src/editor/inspector/color-picker.ts:46`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o seletor.
- **DOM do editor:** os canais do seletor passam a ser os do formato escolhido (`src/editor/inspector/color-picker.ts:46`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/inspector/color-picker.ts:46`).
- G2: n/a — o comando roda dentro da sessão do seletor, aberta com o seletor; a digitação pendente foi gravada quando essa sessão abriu (`src/editor/store.ts:217` `keepTyping();`).
- G3: ok `src/editor/inspector/color-picker.ts:44` `export const setColorFormat = registerHandler<'colorPicker.setFormat', EditorUi>(` — as portas (os segmentos HSB, RGB, Hex, OKLCH, OKLab) chegam ao mesmo tratador com só `format`.
- G4: n/a — o comando muda estado; o seletor abre sobre o painel e o cobrimento no ponto da ação é medido na Fase 6 (`src/editor/inspector/color-picker.ts:46`).
- G5: n/a — o encaixe do seletor num formato mais alto é medido na Fase 6 (`src/editor/inspector/color-picker.ts:46`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/inspector/color-picker.ts:46`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/color-picker.ts:46`).

## Medições
- a medir na Fase 6: o encaixe do seletor em cada formato (o OKLab é o mais alto), nas duas telas (famílias `cut`, `off-window`, `covered`, `english`).
