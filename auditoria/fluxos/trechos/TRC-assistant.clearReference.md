# TRC-assistant.clearReference
- **Chamada:** `src/app/commands.ts:181` `'assistant.clearReference': clearAssistantReference,`
- **Argumentos:** nenhum — a porta ("Remover referência") não envia valor.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:181` `'assistant.clearReference': clearAssistantReference,` — a tabela de comandos liga o id ao tratador `clearAssistantReference` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:44` `export const clearAssistantReference = registerHandler<'assistant.clearReference', EditorUi>('assistant.clearReference', ({ state }) => ({ kind: 'change', ui: nextUi(state.ui, { reference: null }) }));` — o tratador grava `reference` como nulo. [lê: EST-L06-050 via assistantOf] [escreve: EST-L06-050 via nextUi]
5. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run]
6. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
7. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e o React redesenha o painel.

## Ramos
- nenhum — o tratador não tem condição: `src/editor/assistant/state.ts:44` `export const clearAssistantReference = registerHandler<'assistant.clearReference', EditorUi>('assistant.clearReference', ({ state }) => ({ kind: 'change', ui: nextUi(state.ui, { reference: null }) }));`

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono e não grava o pedido `request`: `src/editor/assistant/state.ts:44` `export const clearAssistantReference = registerHandler<'assistant.clearReference', EditorUi>('assistant.clearReference', ({ state }) => ({ kind: 'change', ui: nextUi(state.ui, { reference: null }) }));`

## Estado
- lê: EST-L06-050
- escreve: EST-L06-050

## Resultado
- **Estado final:** EST-L06-050 com `reference` nulo `src/editor/assistant/state.ts:44` `export const clearAssistantReference = registerHandler<'assistant.clearReference', EditorUi>('assistant.clearReference', ({ state }) => ({ kind: 'change', ui: nextUi(state.ui, { reference: null }) }));`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** a prévia da imagem de referência sai do painel `src/editor/assistant/panel.tsx:91` `{state.reference && <div className="assistant-reference">`
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:230` `"undoable": false`
- G2: n/a — o comando não altera o documento: `manifest/commands/assistant.json:230` `"undoable": false`
- G3: ok — a única porta do comando é `assistant-clear-reference` `manifest/commands/assistant.json:234` `"id": "assistant-clear-reference",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:239` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a conferência de corte e alcance depende de medição (fase 6): `manifest/commands/assistant.json:239` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:230` `"undoable": false`

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer ou observador; a assinatura da store `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` é removida pelo desinstalador `src/editor/assistant/controller.ts:230` `unwatch();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
