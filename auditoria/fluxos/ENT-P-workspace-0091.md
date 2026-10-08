# ENT-P-workspace-0091 — inspector.toggleRow pela porta inspector.toggleRow#inspector-row-disclosure

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:2846` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:2845` `"id": "inspector-row-disclosure",`
- **Tratador:** `src/app/commands.ts:502` `'inspector.toggleRow': toggleRow,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle desenhado roda a porta (quando os toques da porta são do dono do ponteiro, é ele que a roda, só com `detail` 0)
2. `src/editor/doors/door.tsx:92` `const run = () => {` — a porta abre o seu `run`
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos declarados no manifesto e os que o controle acrescenta são unidos em `given`
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo nem de área de transferência: segue direto ao despacho
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a intenção (o id e `given`) entra na store do editor
6. `src/app/commands.ts:502` `'inspector.toggleRow': toggleRow,` — a tabela liga o id ao tratador; o trecho TRC-inspector.toggleRow começa aqui

## Ramos
- R1 `src/editor/inspector/concept-rows.ts:91` `if (found === undefined) throw new Error(` — um `row` fora de `CONCEPT_ROWS` lança (defeito da porta); uma linha válida segue.
- R2 `src/editor/inspector/concept-rows.ts:93` `const closed = rowClosed(state.ui, found, authoredProperties(state));` — desenhada fechada: o clique abre e a põe em `expandedRows`; desenhada aberta: fecha e a põe em `collapsedRows` (`src/editor/inspector/concept-rows.ts:99`).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/concept-rows.ts:88` `export const toggleRow = registerHandler<'inspector.toggleRow', EditorUi>('inspector.toggleRow', ({ state }, { row }) => {`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (documento: `authoredProperties`), EST-L01-037 (`ui.preferences`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.collapsedRows`, `ui.preferences.expandedRows`).

## Resultado
- **Estado final:** EST-L01-037 com a linha em `collapsedRows` ou `expandedRows` conforme o clique (`src/editor/inspector/concept-rows.ts:103`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o inspector.
- **DOM do editor:** os detalhes da linha abrem ou fecham sob o seu cabeçalho (`src/editor/inspector/concept-rows.ts:103`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/inspector/concept-rows.ts:103`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/inspector/concept-rows.ts:88` `export const toggleRow = registerHandler<'inspector.toggleRow', EditorUi>('inspector.toggleRow', ({ state }, { row }) => {` — a única porta (o triângulo da linha) chega ao mesmo tratador com só `row`.
- G4: n/a — o comando muda estado; a coluna do inspector ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/inspector/concept-rows.ts:103`).
- G5: n/a — o encaixe dos detalhes da linha abertos é medido na Fase 6 (`src/editor/inspector/concept-rows.ts:103`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/inspector/concept-rows.ts:103`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/concept-rows.ts:90`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.

## Ramos do trecho
- **Trecho:** TRC-inspector.toggleRow
- **Argumentos enviados:** a porta declara `{}`; o triângulo da linha acrescenta `row` (o id da linha)
- R1 `src/editor/inspector/concept-rows.ts:91` `if (found === undefined) throw new Error(`inspector.toggleRow: the Style tab has no concept row ${row}`);` — esta porta envia `row` (a linha do triângulo): uma linha fora do catálogo lança; uma válida segue.
- R2 `src/editor/inspector/concept-rows.ts:93` `const closed = rowClosed(state.ui, found, authoredProperties(state));` — desenhada fechada: o caminho abre a linha; desenhada aberta: fecha.
