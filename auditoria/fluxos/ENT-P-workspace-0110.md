# ENT-P-workspace-0110 — colorPicker.cancel pela porta colorPicker.cancel#color-picker-cancel

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3633` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:3648` `"id": "color-picker-cancel",`
- **Tratador:** `src/app/commands.ts:405` `'colorPicker.cancel': cancelColorPicker,`
- **Início:** `src/editor/shell/color.tsx:65` `onClick={() => (door.available ? run(store, entry, {}) : undefined)}`

## Passos
1. `src/editor/shell/color.tsx:65` `onClick={() => (door.available ? run(store, entry, {}) : undefined)}` — o clique do controle do seletor roda a porta pela sessão
2. `src/editor/shell/color.tsx:51` `dispatchInSession(store, entry.command.id as CommandId, { ...entry.door.args, ...args });` — a corrida do seletor entrega a intenção à sessão, com os argumentos da porta
3. `src/app/commands.ts:405` `'colorPicker.cancel': cancelColorPicker,` — a tabela liga o id ao tratador; o trecho TRC-colorPicker.cancel começa aqui

## Ramos
- R1 `src/editor/inspector/color-picker.ts:101` `state.ui.colorPicker === null ? { kind: 'change' } : { kind: 'change', ui: closed(state.ui, false), message: message('status.colorPicker.cancelled') },` — seletor já fechado: mudança vazia; aberto: fecha e a sessão é cancelada (passos 7 a 12).

## Fronteiras assíncronas
- o dono do ponteiro termina a sessão num microtarefa depois de o estado publicar: `src/editor/input/pointer/tools.ts:42` `queueMicrotask(() => finishPickerSession(shared));` — no intervalo, a sessão já não aceita escritas e o seletor está fechado.

## Estado
- lê: EST-L01-037 (`ui.colorPicker`, `ui.colorPickerClosed`).
- escreve: EST-L01-037 (`ui.colorPicker`, `ui.colorPickerClosed`), EST-L01-030 (o documento restaurado).

## Resultado
- **Estado final:** EST-L01-037 e EST-L01-030 com `ui.colorPicker` nulo, `ui.colorPickerClosed.applied` falso e o documento de volta ao de antes da sessão (`src/core/store/store.ts:721`); a seleção também volta.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o seletor fechado e o elemento com a cor antiga.
- **DOM do editor:** o seletor some (`src/editor/inspector/color-picker.ts:101`).
- **DOM do canvas:** o elemento volta a ser desenhado com o valor com que o seletor abriu (`src/core/store/store.ts:721`).

## Regras
- G1: ok `src/core/store/store.ts:750` `if (state !== before) publish(commit({ ...state, document: before.document, selection: before.selection, history: before.history }, 'a cancelled gesture'), current.inverses);` — o cancelamento devolve o documento e a seleção guardados no começo do gesto, sem gravar passo.
- G2: n/a — o comando roda dentro da sessão do seletor, aberta com o seletor; a digitação pendente foi gravada quando essa sessão abriu (`src/editor/store.ts:216` `keepTyping();`).
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

## Ramos do trecho
- **Trecho:** TRC-colorPicker.cancel
- **Argumentos enviados:** a porta não envia argumento
- R1 `src/editor/inspector/color-picker.ts:101` `state.ui.colorPicker === null ? { kind: 'change' } : { kind: 'change', ui: closed(state.ui, false), message: message('status.colorPicker.cancelled') },` — seletor já fechado: o caminho passa pelo lado da mudança vazia; aberto: pelo lado que fecha e cancela a sessão.
