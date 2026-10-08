# TRC-inspector.toggleRow
- **Chamada:** `src/app/commands.ts:502` `'inspector.toggleRow': toggleRow,`
- **Argumentos:** `{ row }` — o id de uma linha conceito da aba Estilo (`refers: concept-row`).
- **Ramos que dependem dos argumentos:** R1 (`row` que a aba não tem), R2 (a linha desenhada fechada).

## Passos
1. `src/app/commands.ts:502` `'inspector.toggleRow': toggleRow,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/inspector/concept-rows.ts:90` `const found = CONCEPT_ROWS.find((r) => r.id === row);` — a linha é achada no catálogo do manifesto.
7. `src/editor/inspector/concept-rows.ts:93` `const closed = rowClosed(state.ui, found, authoredProperties(state));` — o que a linha está desenhando decide o clique [lê: EST-L01-030 via authoredProperties] [lê: EST-L01-037 via rowClosed].
8. `src/editor/inspector/concept-rows.ts:99` `const collapsed = closed ? drop(collapsedRows(state.ui)) : add(collapsedRows(state.ui));` — a lista de linhas fechadas é ajustada [lê: EST-L01-037 via handlerContext].
9. `src/editor/inspector/concept-rows.ts:100` `const expanded = closed ? add(openedRows(state.ui)) : drop(openedRows(state.ui));` — a lista de linhas abertas à mão é ajustada [lê: EST-L01-037 via handlerContext].
10. `src/editor/inspector/concept-rows.ts:103` `ui: { ...state.ui, preferences: { ...rest, collapsedRows: collapsed.length > 0 ? collapsed : undefined, expandedRows: expanded.length > 0 ? expanded : undefined } },` — as preferências da linha são gravadas (ausentes quando vazias) [escreve: EST-L01-037 via run].
11. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
12. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
13. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
14. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e o inspector redesenha [lê: EST-L01-002 via publish].

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
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
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
