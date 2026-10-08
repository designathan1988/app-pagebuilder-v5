# TRC-palette.toggleGroup
- **Chamada:** `src/app/commands.ts:492` `'palette.toggleGroup': toggleGroup,`
- **Argumentos:** `{ group }` — o id do grupo do painel Insert que se abre ou fecha.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:492` `'palette.toggleGroup': toggleGroup,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/palette/palette.ts:23` `const collapsed = state.ui.preferences.collapsedGroups ?? [];` — os grupos fechados são lidos [lê: EST-L01-037 via handlerContext].
7. `src/editor/palette/palette.ts:24` `const next = collapsed.includes(group) ? collapsed.filter((g) => g !== group) : [...collapsed, group];` — o grupo é tirado da lista quando já fechado e acrescentado quando aberto.
8. `src/editor/palette/palette.ts:27` `return { kind: 'change', ui: { ...state.ui, preferences: next.length > 0 ? { ...kept, collapsedGroups: next } : kept } };` — a lista nova é gravada (ausente quando nenhum grupo fica fechado) [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish].
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha o painel [lê: EST-L01-037 via publish].

## Ramos
- nenhum — o tratador alterna o grupo na lista, sem outra decisão `src/editor/palette/palette.ts:24` `const next = collapsed.includes(group) ? collapsed.filter((g) => g !== group) : [...collapsed, group];`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/palette/palette.ts:20` `export const toggleGroup = registerHandler<'palette.toggleGroup', EditorUi>(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal), EST-L01-037 (o estado do editor, `ui.preferences.collapsedGroups`, via handlerContext, run, publish), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.collapsedGroups`, via run, publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.collapsedGroups` com o grupo alternado (`src/editor/palette/palette.ts:27`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o grupo do painel Insert fecha ou abre (`src/editor/palette/palette.ts:27`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/palette/palette.ts:27`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/palette/palette.ts:20` `export const toggleGroup = registerHandler<'palette.toggleGroup', EditorUi>(` — a única porta (o cabeçalho do grupo) chega ao mesmo tratador com só `group`.
- G4: n/a — o comando muda estado; o painel Insert ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/palette/palette.ts:27`).
- G5: n/a — o encaixe do painel Insert com os grupos abertos ou fechados é medido na Fase 6 (`src/editor/palette/palette.ts:27`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/palette/palette.ts:27`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/palette/palette.ts:23`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
