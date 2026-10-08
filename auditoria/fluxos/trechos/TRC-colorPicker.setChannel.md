# TRC-colorPicker.setChannel
- **Chamada:** `src/app/commands.ts:403` `'colorPicker.setChannel': setColorChannel,`
- **Argumentos:** `{ property, channel, text, base? }` — `property` a propriedade, `channel` um enum de canal, `text` o valor digitado, `base` a cor de partida (opcional).
- **Ramos que dependem dos argumentos:** R1 (a seleção sem um elemento), R2 (a cor resultante inválida), R3 (o `text` que não é cor).

## Passos
1. `src/app/commands.ts:403` `'colorPicker.setChannel': setColorChannel,` — a tabela liga o id ao tratador.
2. `src/editor/shell/color.tsx:51` `dispatchInSession(store, entry.command.id as CommandId, { ...entry.door.args, ...args });` — a porta do canal entrega a intenção à sessão.
3. `src/editor/input/pointer/common.ts:389` `const result = shared.sessionDispatch === null ? null : shared.sessionDispatch(id, args);` — o despacho vai pela sessão do ponteiro.
4. `src/editor/input/pointer.ts:146` `return through !== null ? through.dispatch(id as never, args as never) : (store.dispatch as (i: CommandId, a: unknown) => DispatchResult)(id, args);` — a intenção entra no gesto aberto.
5. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto executa o tratador [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-037 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
7. `src/editor/inspector/color-picker.ts:77` `const primary = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);` — o elemento primário é achado [lê: EST-L01-030 via locate] [lê: EST-L01-031 via locate].
8. `src/editor/inspector/color-picker.ts:79` `const colour = editedColour(storedValue(primary.node, property, rules) ?? base ?? '', channel, text, state.ui.colorPicker?.format ?? '');` — o canal é aplicado à cor do elemento [lê: EST-L01-030 via storedValue] [lê: EST-L01-037 via storedValue].
9. `src/editor/inspector/color-picker.ts:81` `return writePropertyText(context, property, colour);` — a cor nova é escrita pelo mesmo escritor do style.set.
10. `src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;` — a cor entra na camada que o editor mostra [escreve: EST-L01-030 via writeStyle].
11. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — os patches são aplicados ao documento [escreve: EST-L01-030 via applyPatches].
12. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado e o canvas desenha a cor viva [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados [lê: EST-L01-030 via publish].

## Ramos
- R1 `src/editor/inspector/color-picker.ts:78` `if (primary === null) return { kind: 'change' };` — sem um elemento: mudança vazia; com um: segue.
- R2 `src/editor/inspector/color-picker.ts:80` `if (colour === null) return { kind: 'refused', message: message('status.colorPicker.invalid', { channel: { key: CHANNEL_LABELS[channel] }, value: text }) };` — canal fora do intervalo: recusa nomeando o canal e o texto; válido: segue para o passo 9.
- R3 `src/editor/inspector/color-picker.ts:81` `return writePropertyText(context, property, colour);` — um texto que a propriedade não aceita é recusado por `writePropertyText` (`src/core/style/set.ts:383` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, context.rules), value }) };`); aceito: vira os patches da escrita.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/color-picker.ts:75` `export const setColorChannel = registerHandler<'colorPicker.setChannel', EditorUi>('colorPicker.setChannel', (context, { property, channel, text, base }) => {`); a escrita entra no gesto já aberto e o desenho do canvas segue `publish`.

## Estado
- lê: EST-L01-030 (o documento, via run, locate, storedValue, publish), EST-L01-031 (a seleção, via run, locate), EST-L01-037 (o estado do editor, via run, storedValue).
- escreve: EST-L01-030 (as declarações do elemento, na camada que o editor mostra, via writeStyle, applyPatches, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** EST-L01-030 com a propriedade escrita na camada ativa do elemento primário (`src/core/style/set.ts:334`); a seleção não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o canvas e o seletor.
- **DOM do editor:** o seletor mostra a cor nova nos seus canais (`src/editor/inspector/color-picker.ts:79`).
- **DOM do canvas:** o elemento é desenhado na cor viva, ainda dentro da sessão (o passo e o Cancelar desfazem) (`src/core/store/store.ts:542`).

## Regras
- G1: ok `src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;` — a escrita entra na camada que o editor mostra (o ponto de quebra e o estado ativos).
- G2: n/a — o comando roda dentro da sessão do seletor, aberta com o seletor; a digitação pendente foi gravada quando essa sessão abriu (`src/editor/store.ts:205` `keepTyping();`).
- G3: ok `src/editor/inspector/color-picker.ts:75` `export const setColorChannel = registerHandler<'colorPicker.setChannel', EditorUi>('colorPicker.setChannel', (context, { property, channel, text, base }) => {` — a única porta (um canal do seletor) chega ao mesmo tratador com só `property`, `channel`, `text` e `base`.
- G4: n/a — o comando muda o documento; o seletor abre sobre o painel e o cobrimento no ponto da ação é medido na Fase 6 (`src/editor/inspector/color-picker.ts:81`).
- G5: n/a — o encaixe do seletor é medido na Fase 6 (`src/editor/inspector/color-picker.ts:81`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a mudança do documento é levada aos ouvintes de documento, que redesenham o elemento.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento novo é validado antes de publicar.

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/color-picker.ts:77`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
