# ENT-P-workspace-0109 — colorPicker.setChannel pela porta colorPicker.setChannel#color-picker-channel

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3589` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:3604` `"id": "color-picker-channel",`
- **Tratador:** `src/app/commands.ts:403` `'colorPicker.setChannel': setColorChannel,`
- **Início:** `src/editor/shell/color.tsx:93` `const submit = (event?: FormEvent) => {`

## Passos
1. `src/editor/shell/color.tsx:93` `const submit = (event?: FormEvent) => {` — o campo de canal é um formulário: ao confirmar, ele guarda o que tem
2. `src/editor/shell/color.tsx:98` `keep(element.value);` — o campo entrega o texto ao `keep`
3. `src/editor/shell/color.tsx:494` `keep={(text) => run(store, channelPart, { property, channel, text, base: current })}` — o `keep` do canal roda a porta pela sessão
4. `src/editor/shell/color.tsx:51` `dispatchInSession(store, entry.command.id as CommandId, { ...entry.door.args, ...args });` — a corrida do seletor entrega a intenção à sessão
5. `src/app/commands.ts:403` `'colorPicker.setChannel': setColorChannel,` — a tabela liga o id ao tratador; o trecho TRC-colorPicker.setChannel começa aqui

## Ramos
- R1 `src/editor/inspector/color-picker.ts:78` `if (primary === null) return { kind: 'change' };` — sem um elemento: mudança vazia; com um: segue.
- R2 `src/editor/inspector/color-picker.ts:80` `if (colour === null) return { kind: 'refused', message: message('status.colorPicker.invalid', { channel: { key: CHANNEL_LABELS[channel] }, value: text }) };` — canal fora do intervalo: recusa nomeando o canal e o texto; válido: segue para o passo 9.
- R3 `src/editor/inspector/color-picker.ts:81` `return writePropertyText(context, property, colour);` — um texto que a propriedade não aceita é recusado por `writePropertyText` (`src/core/style/set.ts:383` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, context.rules), value }) };`); aceito: vira os patches da escrita.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/color-picker.ts:75` `export const setColorChannel = registerHandler<'colorPicker.setChannel', EditorUi>('colorPicker.setChannel', (context, { property, channel, text, base }) => {`); a escrita entra no gesto já aberto e o desenho do canvas segue `publish`.

## Estado
- lê: EST-L01-031 (seleção), EST-L01-030 (documento), EST-L01-037 (`ui.colorPicker`).
- escreve: EST-L01-030 (as declarações do elemento, na camada que o editor mostra).

## Resultado
- **Estado final:** EST-L01-030 com a propriedade escrita na camada ativa do elemento primário (`src/core/style/set.ts:334`); a seleção não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o canvas e o seletor.
- **DOM do editor:** o seletor mostra a cor nova nos seus canais (`src/editor/inspector/color-picker.ts:79`).
- **DOM do canvas:** o elemento é desenhado na cor viva, ainda dentro da sessão (o passo e o Cancelar desfazem) (`src/core/store/store.ts:542`).

## Regras
- G1: ok `src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;` — a escrita entra na camada que o editor mostra (o ponto de quebra e o estado ativos).
- G2: n/a — o comando roda dentro da sessão do seletor, aberta com o seletor; a digitação pendente foi gravada quando essa sessão abriu (`src/editor/store.ts:216` `keepTyping();`).
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

## Ramos do trecho
- **Trecho:** TRC-colorPicker.setChannel
- **Argumentos enviados:** a porta declara `{}`; o campo do canal acrescenta `property`, `channel`, `text` e `base`
- R1 `src/editor/inspector/color-picker.ts:78` `if (primary === null) return { kind: 'change' };` — esta porta envia `property` e `channel`: sem um elemento primário o caminho passa pelo lado da mudança vazia; com um, segue.
- R2 `src/editor/inspector/color-picker.ts:80` `if (colour === null) return { kind: 'refused', message: message('status.colorPicker.invalid', { channel: { key: CHANNEL_LABELS[channel] }, value: text }) };` — um `channel` ou `text` fora do intervalo passa pelo lado da recusa; válido, segue.
- R3 `src/editor/inspector/color-picker.ts:81` `return writePropertyText(context, property, colour);` — um `text` que a propriedade não aceita é recusado por `writePropertyText` `src/core/style/set.ts:383` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, context.rules), value }) };`; aceito, vira os patches da escrita.
