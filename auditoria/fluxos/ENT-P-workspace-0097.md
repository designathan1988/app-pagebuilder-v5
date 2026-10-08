# ENT-P-workspace-0097 — inspector.search pela porta inspector.search#inspector-search-field

- **Tipo:** comando-porta panel-control `manifest/commands/workspace.json:3080` `"kind": "panel-control",`
- **Porta:** `manifest/commands/workspace.json:3079` `"id": "inspector-search-field",`
- **Tratador:** `src/app/commands.ts:506` `'inspector.search': searchInspector,`
- **Início:** `src/editor/shell/inspector.tsx:316` `const door = useDoor(PROPERTY_SEARCH);`

## Passos
1. `src/editor/shell/inspector.tsx:316` `const door = useDoor(PROPERTY_SEARCH);` — o campo de busca de propriedades lê a sua porta
2. `src/editor/shell/inspector.tsx:318` `if (door.built) (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(PROPERTY_SEARCH.command.id, { ...PROPERTY_SEARCH.door.args, query: value });` — cada mudança do campo despacha `inspector.search` com o texto
3. `src/app/commands.ts:506` `'inspector.search': searchInspector,` — a tabela liga o id ao tratador; o trecho TRC-inspector.search começa aqui

## Ramos
- R1 `src/editor/inspector/sections.ts:327` `if (typed === '') return { kind: 'change', ui: rest, message: message('status.inspector.searchCleared') };` — só espaços (ou nada): a busca é limpa; com texto, segue para o passo 8.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/sections.ts:323` `export const searchInspector = registerHandler<'inspector.search', EditorUi>('inspector.search', ({ state }, { query }) => {`); o campo chama o despacho a cada digitação, mas cada chamada roda inteira dentro do trecho.

## Estado
- lê: EST-L01-037 (`ui.inspectorSearch`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.inspectorSearch`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.inspectorSearch` no texto digitado, ou sem ele quando só espaços (`src/editor/inspector/sections.ts:328`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a aba Estilo.
- **DOM do editor:** só os campos que casam com a busca ficam desenhados (`src/editor/inspector/sections.ts:328`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/inspector/sections.ts:328`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/inspector/sections.ts:323` `export const searchInspector = registerHandler<'inspector.search', EditorUi>('inspector.search', ({ state }, { query }) => {` — a única porta (o campo de busca da aba Estilo) chega ao mesmo tratador com só `query`.
- G4: n/a — o comando muda estado; a coluna do inspector ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/inspector/sections.ts:328`).
- G5: n/a — o encaixe da aba Estilo filtrada é medido na Fase 6 (`src/editor/inspector/sections.ts:328`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/inspector/sections.ts:328`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/sections.ts:324`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.

## Ramos do trecho
- **Trecho:** TRC-inspector.search
- **Argumentos enviados:** a porta declara `{}`; o campo acrescenta `query` (o texto digitado)
- R1 `src/editor/inspector/sections.ts:327` `if (typed === '') return { kind: 'change', ui: rest, message: message('status.inspector.searchCleared') };` — o campo envia a `query` digitada: só espaços (ou nada) o caminho passa pelo lado que limpa a busca; com texto, pelo lado que grava.
