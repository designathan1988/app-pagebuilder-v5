# ENT-P-workspace-0099 — codePanel.setPane pela porta codePanel.setPane#code-panel-tab-css

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3162` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:3161` `"id": "code-panel-tab-css",`
- **Tratador:** `src/app/commands.ts:507` `'codePanel.setPane': setPane,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:507` `'codePanel.setPane': setPane,` — a tabela liga o id ao tratador; o trecho TRC-codePanel.setPane começa aqui

## Ramos
- nenhum — o tratador grava a parte escolhida e devolve sempre a mudança `src/editor/code-panel/code-panel.ts:139` `({ state }, { pane }) => ({ kind: 'change', ui: { ...state.ui, codePane: pane === 'html' ? undefined : pane }, message: message(SAID_PANE[pane]) }),`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/code-panel/code-panel.ts:137` `export const setPane = registerHandler<'codePanel.setPane', EditorUi>(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.codePane`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.codePane`).

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

## Ramos do trecho
- **Trecho:** TRC-codePanel.setPane
- **Argumentos enviados:** o manifesto declara `pane` `css`
- nenhum — o trecho TRC-codePanel.setPane não lista ramo que dependa dos argumentos; o tratador grava a parte escolhida `src/editor/code-panel/code-panel.ts:139` `({ state }, { pane }) => ({ kind: 'change', ui: { ...state.ui, codePane: pane === 'html' ? undefined : pane }, message: message(SAID_PANE[pane]) }),`.
