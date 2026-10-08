# TRC-assistant.editKey
- **Chamada:** `src/app/commands.ts:182` `'assistant.editKey': editAssistantKey,`
- **Argumentos:** `{ value: string }` — o texto digitado no campo "Chave do serviço" (`assistant-key`); a chave é segredo e não entra no estado.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:182` `'assistant.editKey': editAssistantKey,` — a tabela de comandos liga o id ao tratador `editAssistantKey` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:46` `export const editAssistantKey = registerHandler('assistant.editKey', () => ({ kind: 'change' }));` — o tratador devolve uma mudança sem interface: não grava em lugar nenhum. `src/editor/assistant/state.ts:45` `// Secret drafts belong to the password control and credential vault, never the state or command history.`
5. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — sem a interface do tratador, o estado da interface fica como estava.
6. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — nada mudou, então nenhum estado novo é publicado.
7. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — se algo mudasse, seria publicado; aqui nada é publicado por este comando.

## Ramos
- nenhum — o tratador não tem condição: `src/editor/assistant/state.ts:46` `export const editAssistantKey = registerHandler('assistant.editKey', () => ({ kind: 'change' }));`

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono e não grava o pedido `request`: `src/editor/assistant/state.ts:46` `export const editAssistantKey = registerHandler('assistant.editKey', () => ({ kind: 'change' }));`

## Estado
- lê: nenhum
- escreve: nenhum

## Resultado
- **Estado final:** nada muda `src/editor/assistant/state.ts:46` `export const editAssistantKey = registerHandler('assistant.editKey', () => ({ kind: 'change' }));` (o tratador não devolve `ui`).
- **Re-renderizado:** nada muda `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;`
- **DOM do editor:** nada muda.
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:288` `"undoable": false`
- G2: n/a — o comando não altera o documento nem o estado: `manifest/commands/assistant.json:288` `"undoable": false`
- G3: ok — a única porta do comando é `assistant-key` `manifest/commands/assistant.json:292` `"id": "assistant-key",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:297` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a conferência de corte e alcance depende de medição (fase 6): `manifest/commands/assistant.json:297` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:288` `"undoable": false`

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer ou observador; a assinatura da store `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` é removida pelo desinstalador `src/editor/assistant/controller.ts:230` `unwatch();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
