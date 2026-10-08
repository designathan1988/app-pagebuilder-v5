# ENT-P-workspace-0092 — inspector.setMode pela porta inspector.setMode#inspector-mode-essentials

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2899` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:2898` `"id": "inspector-mode-essentials",`
- **Tratador:** `src/app/commands.ts:503` `'inspector.setMode': setMode,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:503` `'inspector.setMode': setMode,` — a tabela liga o id ao tratador; o trecho TRC-inspector.setMode começa aqui

## Ramos
- nenhum — o tratador grava o modo quando é `essentials` e o apaga quando é `all`, sem outra decisão `src/editor/inspector/sections.ts:151` `return { kind: 'change', ui: { ...state.ui, preferences: mode === 'essentials' ? { ...rest, inspectorMode: mode } : rest }, message: chosen(setMode.command, { mode }) };`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/sections.ts:146` `export const setMode: RegisteredHandler<'inspector.setMode', EditorUi> = registerHandler(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.preferences.inspectorMode`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.inspectorMode`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.inspectorMode` igual a `essentials` ou ausente (`src/editor/inspector/sections.ts:151`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o inspector.
- **DOM do editor:** a aba Estilo mostra todas as propriedades ou só as essenciais (`src/editor/inspector/sections.ts:151`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/inspector/sections.ts:151`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/inspector/sections.ts:146` `export const setMode: RegisteredHandler<'inspector.setMode', EditorUi> = registerHandler(` — as duas portas (Essenciais, Todas) chegam ao mesmo tratador com só `mode`.
- G4: n/a — o comando muda estado; a coluna do inspector ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/inspector/sections.ts:151`).
- G5: n/a — o encaixe da aba Estilo em cada modo é medido na Fase 6 (`src/editor/inspector/sections.ts:151`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/inspector/sections.ts:151`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/sections.ts:149`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.

## Ramos do trecho
- **Trecho:** TRC-inspector.setMode
- **Argumentos enviados:** o manifesto declara `mode` `essentials`
- nenhum — o trecho TRC-inspector.setMode não lista ramo que dependa dos argumentos; o tratador grava o modo quando é `essentials` e o apaga quando é `all` `src/editor/inspector/sections.ts:151` `return { kind: 'change', ui: { ...state.ui, preferences: mode === 'essentials' ? { ...rest, inspectorMode: mode } : rest }, message: chosen(setMode.command, { mode }) };`.
