# TRC-assistant.send
- **Chamada:** `src/app/commands.ts:183` `'assistant.send': sendAssistant,`
- **Argumentos:** nenhum — a porta "Enviar" e a tecla Ctrl+Enter (`send-key`) não enviam valor; o texto vem do campo `assistant-input` já no estado.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:183` `'assistant.send': sendAssistant,` — a tabela de comandos liga o id ao tratador `sendAssistant` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:52` `export const sendAssistant = registerHandler<'assistant.send', EditorUi>('assistant.send', ({ state }) => {` — o tratador recebe só o estado.
5. `src/editor/assistant/state.ts:53` `const current = assistantOf(state.ui);` — lê o assistente corrente. [lê: EST-L06-050 via assistantOf]
6. `src/editor/assistant/state.ts:54` `if (current.busy) return { kind: 'refused', message: message('assistant.busy') };` — recusa durante um turno.
7. `src/editor/assistant/state.ts:55` `if (!current.hasKey) return { kind: 'refused', message: message('assistant.keyRequired') };` — recusa sem chave salva.
8. `src/editor/assistant/state.ts:56` `if (current.connection !== 'connected') return { kind: 'refused', message: message('assistant.connectionRequired') };` — recusa sem o Companion conectado.
9. `src/editor/assistant/state.ts:57` `if (!current.draft.trim() && current.reference === null) return { kind: 'refused', message: message('assistant.emptyInput') };` — recusa sem texto e sem imagem de referência.
10. `src/editor/assistant/state.ts:58` `return { kind: 'change', ui: request(nextUi(state.ui, { busy: true }), 'send'), message: message('assistant.started') };` — marca o turno em curso e grava o pedido `send`. [escreve: EST-L06-050 via request]
11. `src/editor/assistant/state.ts:49` `const current = assistantOf(ui), serial = current.serial + 1;` — o serial do pedido cresce. [lê: EST-L06-050 via assistantOf]
12. `src/editor/assistant/state.ts:50` `return nextUi(ui, { serial, request: { serial, kind } });` — grava o pedido e o serial. [escreve: EST-L06-050 via nextUi]
13. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run]
14. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
15. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes da store são avisados, entre eles a assinatura do assistente.
16. `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` — a assinatura que reage ao pedido.
17. `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — só segue para um pedido novo. [lê: EST-L06-050 via assistantOf]
18. `src/editor/assistant/controller.ts:221` `lastRequest = current.request.serial;` [escreve: EST-L06-005 via a assinatura da store]
19. `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — dispara o turno sem bloquear a store.
20. `src/editor/assistant/controller.ts:127` `await ready;` — espera o cofre de credenciais ficar pronto. [lê: EST-L06-004 via execute]
21. `src/editor/assistant/controller.ts:177` `if (kind === 'send') {` — o ramo do envio.
22. `src/editor/assistant/controller.ts:178` `const current = assistantOf(store.getState().ui);` [lê: EST-L06-050 via assistantOf]
23. `src/editor/assistant/controller.ts:184` `const active = session ?? buildSession();` — usa a sessão viva ou constrói uma. [escreve: EST-L06-004 via buildSession]
24. `src/editor/assistant/controller.ts:185` `const result = await active.send(current.draft, reference ? { bytes: Uint8Array.from(atob(reference.bytes), char => char.charCodeAt(0)), mime: reference.type as 'image/png' } : undefined);` — roda o turno com o rascunho e a referência. [escreve: EST-L06-013 via send]
25. `src/editor/assistant/session.ts:34` `release = ports.reserve?.();` — reserva o grupo de desfazer do turno. [escreve: EST-L06-009 via reserve]
26. `src/editor/assistant/session.ts:35` `const apiKey = await ports.vault.read();` — lê a chave do cofre. [lê: EST-L06-008 via read]
27. `src/editor/assistant/session.ts:41` `const result = await runTurn({ ...ports.settings(), apiKey }, [...messages, { role: 'user', content }], ports, controller.signal);` — roda o turno do provedor.
28. `src/editor/assistant/session.ts:43` `messages = result.messages;` — guarda o histórico do turno. [escreve: EST-L06-013 via send]
29. `src/editor/assistant/controller.ts:186` `report({ inputTokens: result.inputTokens, outputTokens: result.outputTokens });` — leva as contagens de tokens ao estado. [escreve: EST-L06-050 via report]
30. `src/editor/assistant/controller.ts:187` `notice('assistant.finished');` — avisa "Turno do assistente concluído. Desfazer restaura a página anterior.".

## Ramos
- R1 `src/editor/assistant/state.ts:54` `if (current.busy) return { kind: 'refused', message: message('assistant.busy') };` — EST-L06-050 em V4 (turno em curso): recusa `assistant.busy`; livre: segue.
- R2 `src/editor/assistant/state.ts:55` `if (!current.hasKey) return { kind: 'refused', message: message('assistant.keyRequired') };` — sem chave salva: recusa `assistant.keyRequired`; com chave: segue.
- R3 `src/editor/assistant/state.ts:56` `if (current.connection !== 'connected') return { kind: 'refused', message: message('assistant.connectionRequired') };` — sem conexão aberta: recusa `assistant.connectionRequired`; conectado: segue.
- R4 `src/editor/assistant/state.ts:57` `if (!current.draft.trim() && current.reference === null) return { kind: 'refused', message: message('assistant.emptyInput') };` — sem texto e sem imagem: recusa `assistant.emptyInput`; com texto ou imagem: grava o pedido.
- R5 `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — sem pedido ou pedido já tratado: nada; pedido novo: dispara o turno.
- R6 `src/editor/assistant/session.ts:27` `if (active) throw new Error('Assistant is busy');` — uma sessão com turno em curso rejeita; sem turno: segue.
- R7 `src/editor/assistant/session.ts:28` `if (!text.trim() && !reference) throw new Error('Assistant input is empty');` — sem texto e sem referência a sessão rejeita; com uma das duas: segue.

## Fronteiras assíncronas
- F1 `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — o despacho não espera o turno; entradas que podem rodar no intervalo: qualquer outra entrada do editor (teclado, ponteiro, outra porta, `ENT-L06-0017`); estado: EST-L06-050 em V4 (turno em curso).
- F2 `src/editor/assistant/controller.ts:127` `await ready;` — a espera pelo cofre; entradas `ENT-L06-0009`, `ENT-L06-0010`, `ENT-L06-0011`; estado: EST-L06-004 em V2.
- F3 `src/editor/assistant/controller.ts:185` `const result = await active.send(current.draft, reference ? { bytes: Uint8Array.from(atob(reference.bytes), char => char.charCodeAt(0)), mime: reference.type as 'image/png' } : undefined);` — a espera pelo turno; entrada `ENT-L06-0016`; estado: EST-L06-013 em V2.
- F4 `src/editor/assistant/session.ts:35` `const apiKey = await ports.vault.read();` — a espera pela chave do cofre; entrada `ENT-L06-0052`; estado: EST-L06-008 em V3.
- F5 `src/editor/assistant/session.ts:41` `const result = await runTurn({ ...ports.settings(), apiKey }, [...messages, { role: 'user', content }], ports, controller.signal);` — a espera pelo provedor; entradas `ENT-L06-0001`, `ENT-L06-0002`, `ENT-L06-0053`; estado: EST-L06-013 em V2.

## Estado
- lê: EST-L06-050, EST-L06-004, EST-L06-005, EST-L06-008, EST-L06-009
- escreve: EST-L06-050, EST-L06-004, EST-L06-005, EST-L06-008, EST-L06-009, EST-L06-013

## Resultado
- **Estado final:** EST-L06-050 em V4 no despacho (turno em curso, `busy` verdadeiro e o pedido `send`) `src/editor/assistant/state.ts:58` `return { kind: 'change', ui: request(nextUi(state.ui, { busy: true }), 'send'), message: message('assistant.started') };`; ao fim do turno as contagens de tokens `src/editor/assistant/controller.ts:186` `report({ inputTokens: result.inputTokens, outputTokens: result.outputTokens });` e EST-L06-013 com o histórico `src/editor/assistant/session.ts:43` `messages = result.messages;`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel a cada relatório do turno.
- **DOM do editor:** o painel `assistant-panel` redesenha as mensagens, o rodapé (Parar no lugar de Enviar) e as contagens `src/editor/assistant/surface.tsx:15` `{busy ? door('assistant-cancel', {}) : door('assistant-send', { disabled: !configured || !draft.trim() })}`
- **DOM do canvas:** as alterações que o turno faz passam pelos comandos reais em um grupo de desfazer próprio `src/editor/assistant/controller.ts:61` `const group = store.commandGroup(message('assistant.busy'));`.

## Regras
- G1: ok — as alterações do turno passam pelos comandos reais do editor em um grupo de desfazer próprio `src/editor/assistant/controller.ts:61` `const group = store.commandGroup(message('assistant.busy'));`
- G2: n/a — o comando não altera o documento: `manifest/commands/assistant.json:340` `"undoable": false`
- G3: ok — as duas portas (`assistant-send` e `send-key`) levam ao mesmo tratador: `manifest/commands/assistant.json:344` `"id": "assistant-send",` e `manifest/commands/assistant.json:370` `"id": "send-key",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:349` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a conferência de corte e alcance depende de medição (fase 6): `manifest/commands/assistant.json:349` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o comando não muda o documento na própria entrada: `src/core/store/store.ts:321` `if (next.document !== before.document) {` só avisa os ouvintes quando o documento muda.
- INT: n/a — a própria entrada não toca o documento; as escritas do turno passam pelos comandos do editor que validam o documento `manifest/commands/assistant.json:340` `"undoable": false`

## Limpeza
- nenhuma criação no trecho — o trecho não cria ouvinte, timer ou observador; a assinatura da store que dispara o turno `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` é removida pelo desinstalador do assistente `src/editor/assistant/controller.ts:230` `unwatch();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
