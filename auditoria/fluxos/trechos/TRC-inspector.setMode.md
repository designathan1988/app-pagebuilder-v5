# TRC-inspector.setMode
- **Chamada:** `src/app/commands.ts:503` `'inspector.setMode': setMode,`
- **Argumentos:** `{ mode }` — um enum `all`/`essentials`.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:503` `'inspector.setMode': setMode,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/inspector/sections.ts:149` `const { inspectorMode: _dropped, ...rest } = state.ui.preferences;` — o modo antigo é deixado de fora [lê: EST-L01-037 via handlerContext].
7. `src/editor/inspector/sections.ts:151` `return { kind: 'change', ui: { ...state.ui, preferences: mode === 'essentials' ? { ...rest, inspectorMode: mode } : rest }, message: chosen(setMode.command, { mode }) };` — o modo novo é gravado (ausente quando é `all`, o predefinido) [escreve: EST-L01-037 via run].
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
11. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e o inspector redesenha [lê: EST-L01-002 via publish].

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
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
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
