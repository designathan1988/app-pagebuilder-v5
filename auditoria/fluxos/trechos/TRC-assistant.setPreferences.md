# TRC-assistant.setPreferences
- **Chamada:** `src/app/commands.ts:179` `'assistant.setPreferences': setAssistantPreferences,`
- **Argumentos:** `{ open: boolean }` — o booleano que abre (`true`) ou fecha (`false`) as preferências do assistente; a porta envia só ele.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:179` `'assistant.setPreferences': setAssistantPreferences,` — a tabela de comandos liga o id ao tratador `setAssistantPreferences` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:26` `export const setAssistantPreferences = registerHandler<'assistant.setPreferences', EditorUi>('assistant.setPreferences', ({ state }, { open }) => ({ kind: 'change', ui: nextUi(state.ui, { preferences: open }) }));` — o tratador grava o booleano no campo `preferences`. [lê: EST-L06-050 via assistantOf] [escreve: EST-L06-050 via nextUi]
5. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run]
6. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
7. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e o React redesenha o painel.

## Ramos
- nenhum — o tratador não tem condição; grava o booleano `open` como chega `src/editor/assistant/state.ts:26` `export const setAssistantPreferences = registerHandler<'assistant.setPreferences', EditorUi>('assistant.setPreferences', ({ state }, { open }) => ({ kind: 'change', ui: nextUi(state.ui, { preferences: open }) }));`

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono e não grava o pedido `request`: `src/editor/assistant/state.ts:26` `export const setAssistantPreferences = registerHandler<'assistant.setPreferences', EditorUi>('assistant.setPreferences', ({ state }, { open }) => ({ kind: 'change', ui: nextUi(state.ui, { preferences: open }) }));`

## Estado
- lê: EST-L06-050
- escreve: EST-L06-050

## Resultado
- **Estado final:** EST-L06-050 com `preferences` igual ao argumento (V3 aberto, V2 fechado) `src/editor/assistant/state.ts:26` `export const setAssistantPreferences = registerHandler<'assistant.setPreferences', EditorUi>('assistant.setPreferences', ({ state }, { open }) => ({ kind: 'change', ui: nextUi(state.ui, { preferences: open }) }));`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** o painel `assistant-panel` troca entre as preferências e a conversa `src/editor/assistant/panel.tsx:81` `{state.preferences ? <>`
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:89` `"undoable": false`
- G2: n/a — o comando não altera o documento: `manifest/commands/assistant.json:89` `"undoable": false`
- G3: ok — as duas portas levam ao mesmo tratador com só o booleano `open`: `manifest/commands/assistant.json:117` `"open": true` e `manifest/commands/assistant.json:145` `"open": false`
- G4: n/a — as portas são desenhadas na barra lateral `manifest/commands/assistant.json:98` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a conferência de corte e alcance depende de medição (fase 6): `manifest/commands/assistant.json:98` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:89` `"undoable": false`

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer ou observador; a assinatura da store que reage ao pedido `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` é removida pelo desinstalador do assistente `src/editor/assistant/controller.ts:230` `unwatch();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
