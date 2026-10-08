# TRC-assistant.selectSession
- **Chamada:** `src/app/commands.ts:189` `'assistant.selectSession': selectAssistantSession,`
- **Argumentos:** nenhum — a porta "Usar este editor nas ferramentas externas" (`assistant-select-session`) não envia valor; a sessão vem do estado.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:189` `'assistant.selectSession': selectAssistantSession,` — a tabela de comandos liga o id ao tratador `selectAssistantSession` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:65` `export const selectAssistantSession = registerHandler<'assistant.selectSession', EditorUi>('assistant.selectSession', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'select-session') }));` — grava o pedido `select-session`. [lê: EST-L06-050 via assistantOf] [escreve: EST-L06-050 via request]
5. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run]
6. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
7. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes da store são avisados.
8. `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` — a assinatura que reage ao pedido.
9. `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — só segue para um pedido novo. [lê: EST-L06-050 via assistantOf]
10. `src/editor/assistant/controller.ts:221` `lastRequest = current.request.serial;` [escreve: EST-L06-005 via a assinatura da store]
11. `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — dispara a reação sem bloquear a store.
12. `src/editor/assistant/controller.ts:115` `async function execute(kind: string): Promise<void> {` — a função que trata o pedido.
13. `src/editor/assistant/controller.ts:127` `await ready;` — espera o cofre de credenciais ficar pronto. [lê: EST-L06-004 via execute]
14. `src/editor/assistant/controller.ts:170` `if (kind === 'select-session') {` — o ramo de apontar as ferramentas a este editor.
15. `src/editor/assistant/controller.ts:171` `if (!pairing) throw new Error('assistant.connectionRequired');` — exige o par guardado. [lê: EST-L06-004 via execute]
16. `src/editor/assistant/controller.ts:172` `const response = await fetch(new URL('/session/select', httpBase()), { method: 'POST', headers: { 'content-type': 'application/json', authorization:` — pede ao Companion que use esta sessão. [lê: EST-L06-050 via assistantOf]
17. `src/editor/assistant/controller.ts:173` `if (!response.ok) throw new Error('assistant.connectionFailed');` — recusa quando o Companion não responde bem.
18. `src/editor/assistant/controller.ts:174` `notice('assistant.sessionSelected');` — avisa "As ferramentas externas agora usam este editor.".

## Ramos
- R1 `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — sem pedido novo: nada; pedido novo: segue para `execute`.
- R2 `src/editor/assistant/controller.ts:171` `if (!pairing) throw new Error('assistant.connectionRequired');` — sem par guardado: falha e o `catch` avisa `assistant.failed`; com par: segue.
- R3 `src/editor/assistant/controller.ts:173` `if (!response.ok) throw new Error('assistant.connectionFailed');` — resposta ruim do Companion: falha; resposta boa: avisa `assistant.sessionSelected`.

## Fronteiras assíncronas
- F1 `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — o despacho não espera; entradas que podem rodar no intervalo: qualquer outra entrada do editor (teclado, ponteiro, outra porta, `ENT-L06-0017`); estado: EST-L06-050 em V4.
- F2 `src/editor/assistant/controller.ts:127` `await ready;` — a espera pelo cofre; entradas `ENT-L06-0009`, `ENT-L06-0010`, `ENT-L06-0011`; estado: EST-L06-004 em V2.
- F3 `src/editor/assistant/controller.ts:172` `const response = await fetch(new URL('/session/select', httpBase()), { method: 'POST', headers: { 'content-type': 'application/json', authorization:` — a espera pela resposta do Companion; entrada `ENT-L06-0015`; estado: EST-L06-004 em V5 (conectado).

## Estado
- lê: EST-L06-050, EST-L06-004
- escreve: EST-L06-050, EST-L06-005

## Resultado
- **Estado final:** EST-L06-050 com o pedido `select-session` `src/editor/assistant/state.ts:65` `export const selectAssistantSession = registerHandler<'assistant.selectSession', EditorUi>('assistant.selectSession', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'select-session') }));`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** o botão "Usar este editor nas ferramentas externas" no painel `assistant-panel` `src/editor/assistant/panel.tsx:89` `{state.connection === 'connected' && <DoorControl entry={entryOf('assistant-select-session')} ready={!state.busy} />}`
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:672` `"undoable": false`
- G2: n/a — o comando não altera o documento: `manifest/commands/assistant.json:672` `"undoable": false`
- G3: ok — a única porta do comando é `assistant-select-session` `manifest/commands/assistant.json:676` `"id": "assistant-select-session",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:681` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a conferência de corte e alcance depende de medição (fase 6): `manifest/commands/assistant.json:681` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:672` `"undoable": false`

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer ou observador; a assinatura da store `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` é removida pelo desinstalador `src/editor/assistant/controller.ts:230` `unwatch();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
