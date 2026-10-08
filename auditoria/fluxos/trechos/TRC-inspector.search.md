# TRC-inspector.search
- **Chamada:** `src/app/commands.ts:506` `'inspector.search': searchInspector,`
- **Argumentos:** `{ query }` — o texto digitado no campo de busca de propriedades da aba Estilo.
- **Ramos que dependem dos argumentos:** R1 (`query` só de espaços).

## Passos
1. `src/app/commands.ts:506` `'inspector.search': searchInspector,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/inspector/sections.ts:324` `const typed = query.trim();` — o texto é aparado.
7. `src/editor/inspector/sections.ts:325` `const { inspectorSearch: _was, ...rest } = state.ui;` — a busca anterior é deixada de fora [lê: EST-L01-037 via handlerContext].
8. `src/editor/inspector/sections.ts:328` `return { kind: 'change', ui: { ...rest, inspectorSearch: query }, message: message('status.inspector.searchFor', { query: typed }) };` — a busca nova é gravada como digitada e a barra de estado a diz [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a aba Estilo redesenha [lê: EST-L01-002 via publish].

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
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
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
