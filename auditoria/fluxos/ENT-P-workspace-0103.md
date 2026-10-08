# ENT-P-workspace-0103 — colorPicker.open pela porta colorPicker.open#field-color-swatch

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3332` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:3347` `"id": "field-color-swatch",`
- **Tratador:** `src/app/commands.ts:401` `'colorPicker.open': openColorPicker,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:401` `'colorPicker.open': openColorPicker,` — a tabela liga o id ao tratador; o trecho TRC-colorPicker.open começa aqui

## Ramos
- R1 `src/editor/inspector/color-picker.ts:39` `if (primary === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem um elemento primário: recusa; com um: segue para o passo 8.

## Fronteiras assíncronas
- ao ver `ui.colorPicker` não nulo, o dono do ponteiro abre a sessão (um gesto) num assinante da store: `src/editor/input/pointer/tools.ts:21` `shared.session = store.gesture();` — a sessão dura até o seletor fechar, e cada parte do seletor escreve por ela.

## Estado
- lê: EST-L01-031 (seleção), EST-L01-030 (documento), EST-L01-037 (`ui.colorPicker`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.colorPicker`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.colorPicker` nomeando a propriedade, o valor anterior e o formato (`src/editor/inspector/color-picker.ts:41`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o seletor e abrem a sessão.
- **DOM do editor:** o seletor de cor abre sobre o painel, com os seus canais (`src/editor/inspector/color-picker.ts:41`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/inspector/color-picker.ts:41`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/inspector/color-picker.ts:37` `export const openColorPicker = registerHandler<'colorPicker.open', EditorUi>('colorPicker.open', ({ state, rules }, { property }) => {` — a única porta (a amostra de cor de um campo) chega ao mesmo tratador com só `property`.
- G4: n/a — o comando muda estado; o seletor abre sobre o painel e o cobrimento no ponto da ação é medido na Fase 6 (`src/editor/inspector/color-picker.ts:41`).
- G5: n/a — o encaixe do seletor é medido na Fase 6 (`src/editor/inspector/color-picker.ts:41`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/inspector/color-picker.ts:41`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/color-picker.ts:38`); a sessão do ponteiro que o assinante abre é fechada quando o seletor fecha (`src/editor/input/pointer/tools.ts:39` `if (applied) closing.commit();`).

## Medições
- a medir na Fase 6: o encaixe do seletor aberto sobre o painel, nas duas telas (famílias `cut`, `off-window`, `covered`, `english`).

## Ramos do trecho
- **Trecho:** TRC-colorPicker.open
- **Argumentos enviados:** a porta declara `{}`; a amostra acrescenta `property` (a propriedade da cor)
- R1 `src/editor/inspector/color-picker.ts:39` `if (primary === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — a amostra só é desenhada com um elemento primário; sem ele o caminho passa pelo lado da recusa; com ele, pelo lado que abre o seletor.
