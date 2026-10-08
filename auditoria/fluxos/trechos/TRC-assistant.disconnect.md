# TRC-assistant.disconnect
- **Chamada:** `src/app/commands.ts:186` `'assistant.disconnect': disconnectAssistant,`
- **Argumentos:** nenhum — a porta "Desconectar" (`assistant-bridge-disconnect`) não envia valor.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:186` `'assistant.disconnect': disconnectAssistant,` — a tabela de comandos liga o id ao tratador `disconnectAssistant` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:62` `export const disconnectAssistant = registerHandler<'assistant.disconnect', EditorUi>('assistant.disconnect', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'disconnect') }));` — grava o pedido `disconnect`. [lê: EST-L06-050 via assistantOf] [escreve: EST-L06-050 via request]
5. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run]
6. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
7. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes da store são avisados.
8. `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` — a assinatura que reage ao pedido.
9. `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — só segue para um pedido novo. [lê: EST-L06-050 via assistantOf]
10. `src/editor/assistant/controller.ts:221` `lastRequest = current.request.serial;` [escreve: EST-L06-005 via a assinatura da store]
11. `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — dispara a reação sem bloquear a store.
12. `src/editor/assistant/controller.ts:115` `async function execute(kind: string): Promise<void> {` — a função que trata o pedido.
13. `src/editor/assistant/controller.ts:120` `if (kind === 'disconnect') {` — o ramo da desconexão, antes de qualquer espera.
14. `src/editor/assistant/controller.ts:121` `session?.cancel();` — cancela o turno da sessão viva. [escreve: EST-L06-013 via cancel]
15. `src/editor/assistant/controller.ts:122` `disconnect?.();` — fecha o socket do bridge. [escreve: EST-L06-004 via execute]
16. `src/editor/assistant/controller.ts:123` `disconnect = null;` [escreve: EST-L06-004 via execute]
17. `src/editor/assistant/controller.ts:124` `pairing = null;` — esquece o par guardado. [escreve: EST-L06-004 via execute]

## Ramos
- R1 `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — sem pedido novo: nada; pedido novo: segue para `execute`.
- R2 `src/editor/assistant/controller.ts:121` `session?.cancel();` — com uma sessão viva o turno é cancelado; sem sessão nada é cancelado.
- R3 `src/editor/assistant/controller.ts:122` `disconnect?.();` — com uma conexão aberta o socket é fechado; sem conexão nada é fechado.

## Fronteiras assíncronas
- F1 `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — o despacho não espera; entradas que podem rodar no intervalo: qualquer outra entrada do editor (teclado, ponteiro, outra porta, `ENT-L06-0017`); estado: EST-L06-050 em V4 (turno em curso).

## Estado
- lê: EST-L06-050, EST-L06-004
- escreve: EST-L06-050, EST-L06-004, EST-L06-005, EST-L06-013

## Resultado
- **Estado final:** EST-L06-050 com o pedido `disconnect` `src/editor/assistant/state.ts:62` `export const disconnectAssistant = registerHandler<'assistant.disconnect', EditorUi>('assistant.disconnect', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'disconnect') }));`; EST-L06-004 com `disconnect` e `pairing` nulos `src/editor/assistant/controller.ts:124` `pairing = null;`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** o estado da conexão no painel `assistant-panel` `src/editor/assistant/panel.tsx:88` `assistant-connection__state`
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:516` `"undoable": false`
- G2: n/a — o comando não altera o documento: `manifest/commands/assistant.json:516` `"undoable": false`
- G3: ok — a única porta do comando é `assistant-bridge-disconnect` `manifest/commands/assistant.json:520` `"id": "assistant-bridge-disconnect",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:525` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a conferência de corte e alcance depende de medição (fase 6): `manifest/commands/assistant.json:525` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:516` `"undoable": false`

## Limpeza
- fechamento do socket do bridge `src/editor/assistant/controller.ts:122` `disconnect?.();` remove os ouvintes criados por `connectEditor` `src/editor/assistant/client.ts:55` `socket.close();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
