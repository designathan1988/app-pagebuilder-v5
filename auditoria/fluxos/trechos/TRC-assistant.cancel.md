# TRC-assistant.cancel
- **Chamada:** `src/app/commands.ts:184` `'assistant.cancel': cancelAssistant,`
- **Argumentos:** nenhum — a porta "Parar" (`assistant-cancel`) não envia valor.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:184` `'assistant.cancel': cancelAssistant,` — a tabela de comandos liga o id ao tratador `cancelAssistant` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:60` `export const cancelAssistant = registerHandler<'assistant.cancel', EditorUi>('assistant.cancel', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'cancel') }));` — grava o pedido `cancel`. [lê: EST-L06-050 via assistantOf] [escreve: EST-L06-050 via request]
5. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run]
6. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
7. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes da store são avisados.
8. `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` — a assinatura que reage ao pedido.
9. `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — só segue para um pedido novo. [lê: EST-L06-050 via assistantOf]
10. `src/editor/assistant/controller.ts:221` `lastRequest = current.request.serial;` [escreve: EST-L06-005 via a assinatura da store]
11. `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — dispara a reação sem bloquear a store.
12. `src/editor/assistant/controller.ts:115` `async function execute(kind: string): Promise<void> {` — a função que trata o pedido.
13. `src/editor/assistant/controller.ts:116` `if (kind === 'cancel') {` — o ramo do cancelamento, antes de qualquer espera.
14. `src/editor/assistant/controller.ts:117` `session?.cancel();` — aborta o turno da sessão viva. [escreve: EST-L06-013 via cancel]
15. `src/editor/assistant/session.ts:25` `cancel() { active?.abort(new Error('Assistant cancelled')); },` — aborta o controlador do turno. [escreve: EST-L06-013 via cancel]

## Ramos
- R1 `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — sem pedido novo: nada; pedido novo: segue para `execute`.
- R2 `src/editor/assistant/controller.ts:117` `session?.cancel();` — com uma sessão viva o turno é abortado; sem sessão nada é abortado.

## Fronteiras assíncronas
- F1 `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — o despacho não espera; entradas que podem rodar no intervalo: qualquer outra entrada do editor (teclado, ponteiro, outra porta, `ENT-L06-0017`); estado: EST-L06-050 em V4 (turno em curso).

## Estado
- lê: EST-L06-050
- escreve: EST-L06-050, EST-L06-005, EST-L06-013

## Resultado
- **Estado final:** EST-L06-050 com o pedido `cancel` `src/editor/assistant/state.ts:60` `export const cancelAssistant = registerHandler<'assistant.cancel', EditorUi>('assistant.cancel', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'cancel') }));`; EST-L06-013 com o turno abortado `src/editor/assistant/session.ts:25` `cancel() { active?.abort(new Error('Assistant cancelled')); },`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** o rodapé volta ao botão Enviar quando o turno termina `src/editor/assistant/surface.tsx:15` `{busy ? door('assistant-cancel', {}) : door('assistant-send', { disabled: !configured || !draft.trim() })}`
- **DOM do canvas:** as alterações do turno cancelado são desfeitas pelo grupo próprio `src/editor/assistant/chat.ts:38` `transaction?.cancel();`

## Regras
- G1: ok — o turno cancelado desfaz as alterações do grupo de desfazer próprio `src/editor/assistant/chat.ts:38` `transaction?.cancel();`
- G2: n/a — o comando não altera o documento: `manifest/commands/assistant.json:412` `"undoable": false`
- G3: ok — a única porta do comando é `assistant-cancel` `manifest/commands/assistant.json:416` `"id": "assistant-cancel",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:421` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a conferência de corte e alcance depende de medição (fase 6): `manifest/commands/assistant.json:421` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o comando não muda o documento na própria entrada: `src/core/store/store.ts:321` `if (next.document !== before.document) {` só avisa os ouvintes quando o documento muda.
- INT: n/a — a própria entrada não toca o documento; o cancelamento restaura o grupo do turno `src/editor/assistant/chat.ts:38` `transaction?.cancel();`

## Limpeza
- nenhuma criação no trecho — o trecho não cria ouvinte, timer ou observador; a assinatura da store que dispara a reação `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` é removida pelo desinstalador do assistente `src/editor/assistant/controller.ts:230` `unwatch();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
