# ENT-P-workspace-0111 — colorPicker.apply pela porta colorPicker.apply#color-picker-apply

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3677` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:3692` `"id": "color-picker-apply",`
- **Tratador:** `src/app/commands.ts:404` `'colorPicker.apply': applyColorPicker,`
- **Início:** `src/editor/shell/color.tsx:65` `onClick={() => (door.available ? run(store, entry, {}) : undefined)}`

## Passos
1. `src/editor/shell/color.tsx:65` `onClick={() => (door.available ? run(store, entry, {}) : undefined)}` — o clique do controle do seletor roda a porta pela sessão
2. `src/editor/shell/color.tsx:51` `dispatchInSession(store, entry.command.id as CommandId, { ...entry.door.args, ...args });` — a corrida do seletor entrega a intenção à sessão, com os argumentos da porta
3. `src/app/commands.ts:404` `'colorPicker.apply': applyColorPicker,` — a tabela liga o id ao tratador; o trecho TRC-colorPicker.apply começa aqui

## Ramos
- R1 `src/editor/inspector/color-picker.ts:91` `if (picker === null) return { kind: 'change' };` — seletor já fechado: mudança vazia; aberto: segue.
- R2 `src/editor/inspector/color-picker.ts:95` `if (applied === undefined) return { kind: 'change', ui };` — sem um elemento (ou sem valor lido): fecha o seletor sem mexer nas cores recentes; com valor: segue para os passos 9 e 10.

## Fronteiras assíncronas
- o dono do ponteiro termina a sessão num microtarefa depois de o estado publicar: `src/editor/input/pointer/tools.ts:42` `queueMicrotask(() => finishPickerSession(shared));` — no intervalo, a sessão já não aceita escritas e o seletor está fechado.

## Estado
- lê: EST-L01-037 (`ui.colorPicker`, `ui.colorPickerClosed`, `ui.preferences.recentColors`), EST-L01-031 (seleção), EST-L01-030 (documento).
- escreve: EST-L01-037 (`ui.colorPicker`, `ui.colorPickerClosed`, `ui.preferences.recentColors`), EST-L01-032 (o histórico do gesto).

## Resultado
- **Estado final:** EST-L01-037 com `ui.colorPicker` nulo, `ui.colorPickerClosed.applied` verdadeiro e a cor à frente das recentes (`src/editor/inspector/color-picker.ts:97`); EST-L01-030 mantém a cor que a sessão escreveu, agora numa entrada de undo.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o seletor fechado e a lista de recentes.
- **DOM do editor:** o seletor some e a cor aparece nas recentes (`src/editor/inspector/color-picker.ts:97`).
- **DOM do canvas:** o elemento fica com a cor gravada (`src/core/store/store.ts:716`).

## Regras
- G1: ok `src/core/store/store.ts:745` `publish(commit({ ...state, history: record(before.history, tx, null) }, current.command));` — a escrita da sessão vira uma entrada de undo no ponto do gesto, com a seleção e as inversas do gesto.
- G2: n/a — o comando roda dentro da sessão do seletor, aberta com o seletor; a digitação pendente foi gravada quando essa sessão abriu (`src/editor/store.ts:205` `keepTyping();`).
- G3: ok `src/editor/inspector/color-picker.ts:89` `export const applyColorPicker = registerHandler<'colorPicker.apply', EditorUi>('colorPicker.apply', ({ state, rules }) => {` — a única porta (o botão Aplicar) chega ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; o seletor abre sobre o painel e o cobrimento no ponto da ação é medido na Fase 6 (`src/editor/inspector/color-picker.ts:97`).
- G5: n/a — o encaixe do seletor é medido na Fase 6 (`src/editor/inspector/color-picker.ts:97`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a mudança do documento da sessão é levada aos ouvintes de documento.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento novo é validado antes de publicar.

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/color-picker.ts:90`); o microtarefa do dono do ponteiro fecha a sessão (`src/editor/input/pointer/tools.ts:42` `queueMicrotask(() => finishPickerSession(shared));`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.

## Ramos do trecho
- **Trecho:** TRC-colorPicker.apply
- **Argumentos enviados:** a porta não envia argumento
- R1 `src/editor/inspector/color-picker.ts:91` `if (picker === null) return { kind: 'change' };` — seletor já fechado: o caminho passa pelo lado da mudança vazia; aberto: segue.
- R2 `src/editor/inspector/color-picker.ts:95` `if (applied === undefined) return { kind: 'change', ui };` — sem um elemento (ou sem valor lido) fecha o seletor sem mexer nas recentes; com valor, acrescenta a cor às recentes.
