# TRC-preferences.setLanguage
- **Chamada:** `src/app/commands.ts:489` `'preferences.setLanguage': setLanguage,`
- **Argumentos:** `{ locale }` — um enum `pt-BR`/`en`.
- **Ramos que dependem dos argumentos:** R1 (o idioma já é o escolhido).

## Passos
1. `src/app/commands.ts:489` `'preferences.setLanguage': setLanguage,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/preferences/preferences.ts:29` `if (state.ui.preferences.locale === args.locale) return { kind: 'change' };` — o idioma já é o escolhido: mudança vazia.
7. `src/editor/preferences/preferences.ts:30` `return { kind: 'change', ui: { ...state.ui, preferences: { ...state.ui.preferences, locale: args.locale } }, message: chosen(setLanguage.command, args) };` — o idioma novo é gravado e a barra de estado o diz [escreve: EST-L01-037 via run] [escreve: EST-L01-033 via run].
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
11. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a interface é redesenhada na língua nova [lê: EST-L01-037 via publish] [lê: EST-L01-033 via publish].

## Ramos
- R1 `src/editor/preferences/preferences.ts:29` `if (state.ui.preferences.locale === args.locale) return { kind: 'change' };` — o idioma já é o pedido: mudança vazia, sem tocar `ui`; diferente segue para o passo 7.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/preferences/preferences.ts:26` `export const setLanguage: RegisteredHandler<'preferences.setLanguage', EditorUi> = registerHandler(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal), EST-L01-037 (o estado do editor, `ui.preferences.locale`, via run, publish), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-033 (a mensagem, via run, publish), EST-L01-037 (`ui.preferences.locale`, via run, publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.locale` no idioma escolhido (`src/editor/preferences/preferences.ts:30`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a interface; cada palavra passa a ser traduzida pelo idioma novo.
- **DOM do editor:** os rótulos e títulos aparecem na língua escolhida (`src/editor/preferences/preferences.ts:30`).
- **DOM do canvas:** nada muda (o texto da página é do documento, não da interface).

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/preferences/preferences.ts:30`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/preferences/preferences.ts:26` `export const setLanguage: RegisteredHandler<'preferences.setLanguage', EditorUi> = registerHandler(` — as duas portas (menu Idioma, item pt-BR e item en) chegam ao mesmo tratador com só `locale`.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/preferences/preferences.ts:30`).
- G5: n/a — o encaixe dos painéis na língua nova (a família `english`) é medido na Fase 6 (`src/editor/preferences/preferences.ts:30`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/preferences/preferences.ts:30`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/preferences/preferences.ts:29`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
