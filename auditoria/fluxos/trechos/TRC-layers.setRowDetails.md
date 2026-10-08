# TRC-layers.setRowDetails
- **Chamada:** `src/app/commands.ts:499` `'layers.setRowDetails': setRowDetails,`
- **Argumentos:** `{ detail, shown? }` — `detail` um enum `tag`/`id`/`classes`/`attributes`, `shown` um booleano opcional.
- **Ramos que dependem dos argumentos:** R1 (`shown` ausente), R2 (a lista de detalhes não muda).

## Passos
1. `src/app/commands.ts:499` `'layers.setRowDetails': setRowDetails,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/layers/tree.ts:126` `const now = rowDetailsOf(state.ui);` — os detalhes mostrados agora são lidos [lê: EST-L01-037 via rowDetailsOf].
7. `src/editor/layers/tree.ts:127` `const on = shown ?? !now.includes(detail);` — o pedido vira o estado querido do detalhe.
8. `src/editor/layers/tree.ts:128` `const next = ROW_DETAILS.filter((d) => (d === detail ? on : now.includes(d)));` — a lista nova de detalhes, na ordem do manifesto.
9. `src/editor/layers/tree.ts:134` `return { kind: 'change', ui: { ...state.ui, preferences: same ? rest : { ...rest, rowDetails: next } }, message: said };` — a preferência é gravada (ausente quando é o predefinido) [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
11. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
12. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a árvore redesenha [lê: EST-L01-002 via publish].

## Ramos
- R1 `src/editor/layers/tree.ts:127` `const on = shown ?? !now.includes(detail);` — com `shown` (o item de menu manda o estado), o detalhe toma o valor dado; sem ele, alterna.
- R2 `src/editor/layers/tree.ts:129` `if (next.join() === now.join()) return { kind: 'change' };` — a lista não muda: mudança vazia; diferente segue para o passo 9.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/layers/tree.ts:123` `export const setRowDetails: RegisteredHandler<'layers.setRowDetails', EditorUi> = registerHandler(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.preferences.rowDetails`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.rowDetails`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.rowDetails` com o detalhe ligado ou desligado (`src/editor/layers/tree.ts:134`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a árvore.
- **DOM do editor:** cada linha das Camadas mostra ou esconde o detalhe escolhido (`src/editor/layers/tree.ts:128`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/layers/tree.ts:134`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/layers/tree.ts:123` `export const setRowDetails: RegisteredHandler<'layers.setRowDetails', EditorUi> = registerHandler(` — as portas de menu (Tag, ID, Classes, Atributos) chegam ao mesmo tratador com só `detail`; a lista as manda sem `shown`.
- G4: n/a — o comando muda estado; a árvore de Camadas ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/layers/tree.ts:134`).
- G5: n/a — o encaixe da linha com o detalhe a mais, com nomes longos, é medido na Fase 6 (`src/editor/layers/tree.ts:134`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/layers/tree.ts:134`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/layers/tree.ts:126`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
