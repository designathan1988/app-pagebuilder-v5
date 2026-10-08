# TRC-assistant.clearConversation
- **Chamada:** `src/app/commands.ts:190` `'assistant.clearConversation': clearAssistantConversation,`
- **Argumentos:** nenhum — a porta "Nova conversa" (`assistant-clear-conversation`) não envia valor.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:190` `'assistant.clearConversation': clearAssistantConversation,` — a tabela de comandos liga o id ao tratador `clearAssistantConversation` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:66` `export const clearAssistantConversation = registerHandler<'assistant.clearConversation', EditorUi>('assistant.clearConversation', ({ state }) => {` — o tratador recebe o estado.
5. `src/editor/assistant/state.ts:67` `if (assistantOf(state.ui).busy) return { kind: 'refused', message: message('assistant.busy') };` — recusa durante um turno. [lê: EST-L06-050 via assistantOf]
6. `src/editor/assistant/state.ts:68` `return { kind: 'change', ui: request(nextUi(state.ui, { entries: [], draft: '', reference: null }), 'clear-conversation') };` — limpa as mensagens, o rascunho e a referência, e grava o pedido. [escreve: EST-L06-050 via request]
7. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run]
8. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
9. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes da store são avisados.
10. `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` — a assinatura que reage ao pedido.
11. `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — só segue para um pedido novo. [lê: EST-L06-050 via assistantOf]
12. `src/editor/assistant/controller.ts:221` `lastRequest = current.request.serial;` [escreve: EST-L06-005 via a assinatura da store]
13. `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — dispara a reação sem bloquear a store.
14. `src/editor/assistant/controller.ts:115` `async function execute(kind: string): Promise<void> {` — a função que trata o pedido.
15. `src/editor/assistant/controller.ts:148` `if (kind === 'clear-conversation') {` — o ramo de começar conversa nova.
16. `src/editor/assistant/controller.ts:149` `session?.clear();` — limpa o histórico da sessão. [escreve: EST-L06-013 via clear]
17. `src/editor/assistant/session.ts:22` `messages = [];` — a conversa da sessão fica vazia. [escreve: EST-L06-013 via clear]

## Ramos
- R1 `src/editor/assistant/state.ts:67` `if (assistantOf(state.ui).busy) return { kind: 'refused', message: message('assistant.busy') };` — EST-L06-050 em V4 (turno em curso): recusa `assistant.busy`; livre: limpa e grava o pedido.
- R2 `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — sem pedido novo: nada; pedido novo: segue para `execute`.
- R3 `src/editor/assistant/controller.ts:149` `session?.clear();` — com uma sessão viva o histórico é limpo; sem sessão nada é limpo.

## Fronteiras assíncronas
- F1 `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — o despacho não espera; entradas que podem rodar no intervalo: qualquer outra entrada do editor (teclado, ponteiro, outra porta, `ENT-L06-0017`); estado: EST-L06-050 em V4.

## Estado
- lê: EST-L06-050
- escreve: EST-L06-050, EST-L06-005, EST-L06-013

## Resultado
- **Estado final:** EST-L06-050 com as mensagens, o rascunho e a referência limpos e o pedido `clear-conversation` `src/editor/assistant/state.ts:68` `return { kind: 'change', ui: request(nextUi(state.ui, { entries: [], draft: '', reference: null }), 'clear-conversation') };`; EST-L06-013 com a conversa vazia `src/editor/assistant/session.ts:22` `messages = [];`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** a lista de mensagens vazia e o campo da conversa limpo no painel `assistant-panel` `src/editor/assistant/surface.tsx:15` `{busy ? door('assistant-cancel', {}) : door('assistant-send', { disabled: !configured || !draft.trim() })}`
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:724` `"undoable": false`
- G2: n/a — o comando não altera o documento: `manifest/commands/assistant.json:724` `"undoable": false`
- G3: ok — a única porta do comando é `assistant-clear-conversation` `manifest/commands/assistant.json:728` `"id": "assistant-clear-conversation",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:733` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a conferência de corte e alcance depende de medição (fase 6): `manifest/commands/assistant.json:733` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:724` `"undoable": false`

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer ou observador; a assinatura da store `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` é removida pelo desinstalador `src/editor/assistant/controller.ts:230` `unwatch();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
