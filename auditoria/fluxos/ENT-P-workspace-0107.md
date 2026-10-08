# ENT-P-workspace-0107 — colorPicker.setFormat pela porta colorPicker.setFormat#color-picker-format-oklch

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3472` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:3489` `"id": "color-picker-format-oklch",`
- **Tratador:** `src/app/commands.ts:402` `'colorPicker.setFormat': setColorFormat,`
- **Início:** `src/editor/shell/color.tsx:65` `onClick={() => (door.available ? run(store, entry, {}) : undefined)}`

## Passos
1. `src/editor/shell/color.tsx:65` `onClick={() => (door.available ? run(store, entry, {}) : undefined)}` — o clique do controle do seletor roda a porta pela sessão
2. `src/editor/shell/color.tsx:51` `dispatchInSession(store, entry.command.id as CommandId, { ...entry.door.args, ...args });` — a corrida do seletor entrega a intenção à sessão, com os argumentos da porta
3. `src/app/commands.ts:402` `'colorPicker.setFormat': setColorFormat,` — a tabela liga o id ao tratador; o trecho TRC-colorPicker.setFormat começa aqui

## Ramos
- R1 `src/editor/inspector/color-picker.ts:46` `({ state }, { format }) => (state.ui.colorPicker === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, colorPicker: { ...state.ui.colorPicker, format } } }),` — seletor fechado: mudança vazia; aberto: grava o formato (passo 7).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/color-picker.ts:44` `export const setColorFormat = registerHandler<'colorPicker.setFormat', EditorUi>(`); a sessão do ponteiro é um gesto já aberto, e a mudança de estado publica na hora.

## Estado
- lê: EST-L01-037 (`ui.colorPicker.format`).
- escreve: EST-L01-037 (`ui.colorPicker.format`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.colorPicker.format` no formato escolhido (`src/editor/inspector/color-picker.ts:46`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o seletor.
- **DOM do editor:** os canais do seletor passam a ser os do formato escolhido (`src/editor/inspector/color-picker.ts:46`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/inspector/color-picker.ts:46`).
- G2: n/a — o comando roda dentro da sessão do seletor, aberta com o seletor; a digitação pendente foi gravada quando essa sessão abriu (`src/editor/store.ts:205` `keepTyping();`).
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

## Ramos do trecho
- **Trecho:** TRC-colorPicker.setFormat
- **Argumentos enviados:** o manifesto declara `format` `oklch`
- R1 `src/editor/inspector/color-picker.ts:46` `({ state }, { format }) => (state.ui.colorPicker === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, colorPicker: { ...state.ui.colorPicker, format } } }),` — esta porta envia `format` `oklch`: com o seletor aberto o caminho grava o formato; fechado, passa pelo lado da mudança vazia.
