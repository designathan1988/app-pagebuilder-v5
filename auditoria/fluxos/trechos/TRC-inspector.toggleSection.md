# TRC-inspector.toggleSection
- **Chamada:** `src/app/commands.ts:501` `'inspector.toggleSection': toggleSection,`
- **Argumentos:** `{ section }` — o id de uma secção do inspector (`refers: inspector-section`).
- **Ramos que dependem dos argumentos:** R1 (`section` que o inspector não tem), R2 (a secção desenhada fechada).

## Passos
1. `src/app/commands.ts:501` `'inspector.toggleSection': toggleSection,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/inspector/sections.ts:123` `const closed = sectionClosed(state.ui, section, authoredProperties(state));` — o que a secção está desenhando decide o clique [lê: EST-L01-030 via authoredProperties] [lê: EST-L01-037 via sectionClosed].
7. `src/editor/inspector/sections.ts:131` `const collapsed = closed ? drop(collapsedSections(state.ui)) : add(collapsedSections(state.ui));` — a lista de secções fechadas é ajustada [lê: EST-L01-037 via handlerContext].
8. `src/editor/inspector/sections.ts:132` `const expanded = closed ? add(openedSections(state.ui)) : drop(openedSections(state.ui));` — a lista de secções abertas à mão é ajustada [lê: EST-L01-037 via handlerContext].
9. `src/editor/inspector/sections.ts:135` `ui: { ...state.ui, preferences: { ...rest, collapsedSections: collapsed.length > 0 ? collapsed : undefined, expandedSections: expanded.length > 0 ? expanded : undefined } },` — as preferências de secção são gravadas (ausentes quando vazias) [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
11. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
12. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e o inspector redesenha [lê: EST-L01-002 via publish].

## Ramos
- R1 `src/editor/inspector/sections.ts:120` `if (!isSectionId(section)) throw new Error(` — um `section` fora de `SECTION_IDS` lança (defeito da porta); uma secção válida segue.
- R2 `src/editor/inspector/sections.ts:123` `const closed = sectionClosed(state.ui, section, authoredProperties(state));` — desenhada fechada: o clique abre a secção e a põe em `expandedSections`; desenhada aberta: fecha e a põe em `collapsedSections` (`src/editor/inspector/sections.ts:131`).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/sections.ts:118` `export const toggleSection = registerHandler<'inspector.toggleSection', EditorUi>('inspector.toggleSection', ({ state }, { section }) => {`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (documento: `authoredProperties`), EST-L01-037 (`ui.preferences`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.collapsedSections`, `ui.preferences.expandedSections`).

## Resultado
- **Estado final:** EST-L01-037 com a secção em `collapsedSections` ou `expandedSections` conforme o clique (`src/editor/inspector/sections.ts:135`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o inspector.
- **DOM do editor:** a secção fecha ou abre e o cabeçalho mostra ou deixa de mostrar o resumo (`src/editor/inspector/sections.ts:135`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/inspector/sections.ts:135`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/inspector/sections.ts:118` `export const toggleSection = registerHandler<'inspector.toggleSection', EditorUi>('inspector.toggleSection', ({ state }, { section }) => {` — a única porta (o cabeçalho da secção) chega ao mesmo tratador com só `section`.
- G4: n/a — o comando muda estado; a coluna do inspector ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/inspector/sections.ts:135`).
- G5: n/a — o encaixe da secção aberta ou recolhida é medido na Fase 6 (`src/editor/inspector/sections.ts:135`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/inspector/sections.ts:135`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/sections.ts:123`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
