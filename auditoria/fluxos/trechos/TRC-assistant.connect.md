# TRC-assistant.connect
- **Chamada:** `src/app/commands.ts:185` `'assistant.connect': connectAssistant,`
- **Argumentos:** nenhum — a porta "Conectar ao Companion" (`assistant-bridge-connect`) não envia valor; o par (endereço e token) já veio do arquivo de conexão pelo `stageConnection`.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:185` `'assistant.connect': connectAssistant,` — a tabela de comandos liga o id ao tratador `connectAssistant` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:61` `export const connectAssistant = registerHandler<'assistant.connect', EditorUi>('assistant.connect', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'connect') }));` — grava o pedido `connect`. [lê: EST-L06-050 via assistantOf] [escreve: EST-L06-050 via request]
5. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run]
6. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
7. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes da store são avisados.
8. `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` — a assinatura que reage ao pedido.
9. `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — só segue para um pedido novo. [lê: EST-L06-050 via assistantOf]
10. `src/editor/assistant/controller.ts:221` `lastRequest = current.request.serial;` [escreve: EST-L06-005 via a assinatura da store]
11. `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — dispara a conexão sem bloquear a store.
12. `src/editor/assistant/controller.ts:115` `async function execute(kind: string): Promise<void> {` — a função que trata o pedido.
13. `src/editor/assistant/controller.ts:127` `await ready;` — espera o cofre de credenciais ficar pronto. [lê: EST-L06-004 via execute]
14. `src/editor/assistant/controller.ts:152` `if (kind === 'connect') {` — o ramo da conexão.
15. `src/editor/assistant/controller.ts:153` `if (!pairing) throw new Error('assistant.invalidConnection');` — exige o par guardado. [lê: EST-L06-004 via execute]
16. `src/editor/assistant/controller.ts:154` `disconnect?.();` — fecha uma conexão anterior, se houver.
17. `src/editor/assistant/controller.ts:156` `close = connectEditor(pairing.url, pairing.token, {` — abre o socket do bridge. [escreve: EST-L06-001 via connectEditor]
18. `src/editor/assistant/client.ts:6` `const socket = makeSocket(url), running = new Map<string, AbortController>();` — cria o socket e o mapa de pedidos. [escreve: EST-L06-001 via connectEditor]
19. `src/editor/assistant/controller.ts:167` `disconnect = close;` — guarda a função que fecha o socket. [escreve: EST-L06-004 via execute]
20. `src/editor/assistant/controller.ts:161` `report({ connection, session: id ?? '' });` — o `onState` do bridge leva a conexão ao estado. [escreve: EST-L06-050 via report]

## Ramos
- R1 `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — sem pedido novo: nada; pedido novo: segue para `execute`.
- R2 `src/editor/assistant/controller.ts:153` `if (!pairing) throw new Error('assistant.invalidConnection');` — sem par guardado: a execução falha e o `catch` de `src/editor/assistant/controller.ts:222` avisa com `assistant.failed`; com par: segue.
- R3 `src/editor/assistant/controller.ts:160` `const lost = connection === 'disconnected' && assistantOf(store.getState().ui).connection === 'connected' && disconnect === close;` — uma queda não pedida avisa `assistant.disconnected`; a desconexão pedida, não. [lê: EST-L06-050 via assistantOf]

## Fronteiras assíncronas
- F1 `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — o despacho não espera; entradas que podem rodar no intervalo: qualquer outra entrada do editor (teclado, ponteiro, outra porta, `ENT-L06-0017`); estado: EST-L06-050 em V4.
- F2 `src/editor/assistant/controller.ts:127` `await ready;` — a espera pelo cofre; entradas `ENT-L06-0009`, `ENT-L06-0010`, `ENT-L06-0011`; estado: EST-L06-004 em V2.
- F3 `src/editor/assistant/client.ts:9` `socket.addEventListener('open', () => socket.send(JSON.stringify({ kind: 'hello', token })));` e `src/editor/assistant/client.ts:10` `socket.addEventListener('message', event => {` — os ouvintes do socket criados por `connectEditor` (`ENT-L06-0003`, `ENT-L06-0004`, `ENT-L06-0007`, `ENT-L06-0008`); estado: EST-L06-001 em V1 (socket aberto).

## Estado
- lê: EST-L06-050, EST-L06-004
- escreve: EST-L06-050, EST-L06-004, EST-L06-005, EST-L06-001

## Resultado
- **Estado final:** EST-L06-050 com a conexão vinda do bridge `src/editor/assistant/controller.ts:161` `report({ connection, session: id ?? '' });`; EST-L06-004 com a função de fechar guardada `src/editor/assistant/controller.ts:167` `disconnect = close;`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel a cada relatório de conexão.
- **DOM do editor:** o estado da conexão no painel `assistant-panel` `src/editor/assistant/panel.tsx:88` `assistant-connection__state`
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:464` `"undoable": false`
- G2: n/a — o comando não altera o documento: `manifest/commands/assistant.json:464` `"undoable": false`
- G3: ok — a única porta do comando é `assistant-bridge-connect` `manifest/commands/assistant.json:468` `"id": "assistant-bridge-connect",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:473` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a conferência de corte e alcance depende de medição (fase 6): `manifest/commands/assistant.json:473` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:464` `"undoable": false`

## Limpeza
- os ouvintes do socket criados por `connectEditor` `src/editor/assistant/client.ts:9` `socket.addEventListener('open', () => socket.send(JSON.stringify({ kind: 'hello', token })));` são removidos ao fechar o socket `src/editor/assistant/client.ts:55` `socket.close();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
