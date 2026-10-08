# TRC-assistant.saveKey
- **Chamada:** `src/app/commands.ts:187` `'assistant.saveKey': saveAssistantKey,`
- **Argumentos:** nenhum — a porta "Salvar chave" (`assistant-save-key`) não envia valor; o texto do campo de senha é entregue antes pelo `stageKey`, nunca ao estado.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:187` `'assistant.saveKey': saveAssistantKey,` — a tabela de comandos liga o id ao tratador `saveAssistantKey` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:63` `export const saveAssistantKey = registerHandler<'assistant.saveKey', EditorUi>('assistant.saveKey', ({ state }) => ({ kind: 'change', ui: request(state.ui, 'save-key') }));` — grava o pedido `save-key`. [lê: EST-L06-050 via assistantOf] [escreve: EST-L06-050 via request]
5. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run]
6. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
7. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes da store são avisados.
8. `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` — a assinatura que reage ao pedido.
9. `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — só segue para um pedido novo. [lê: EST-L06-050 via assistantOf]
10. `src/editor/assistant/controller.ts:221` `lastRequest = current.request.serial;` [escreve: EST-L06-005 via a assinatura da store]
11. `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — dispara a reação sem bloquear a store.
12. `src/editor/assistant/controller.ts:115` `async function execute(kind: string): Promise<void> {` — a função que trata o pedido.
13. `src/editor/assistant/controller.ts:127` `await ready;` — espera o cofre de credenciais ficar pronto. [lê: EST-L06-004 via execute]
14. `src/editor/assistant/controller.ts:129` `if (kind === 'save-key') {` — o ramo de gravar a chave.
15. `src/editor/assistant/controller.ts:130` `const value = secret;` [lê: EST-L06-004 via execute]
16. `src/editor/assistant/controller.ts:131` `secret = '';` — esvazia o segredo em memória. [escreve: EST-L06-004 via execute]
17. `src/editor/assistant/controller.ts:132` `if (!vault || !value.trim()) {` — exige o cofre e um texto não vazio.
18. `src/editor/assistant/controller.ts:136` `await vault.save(value);` — grava a chave cifrada no cofre. [escreve: EST-L06-008 via save]
19. `src/editor/assistant/controller.ts:137` `report({ hasKey: true });` — leva ao estado que há chave salva. [escreve: EST-L06-050 via report]
20. `src/editor/assistant/controller.ts:138` `notice('assistant.keySaved');` — avisa "Sua chave está salva neste dispositivo, fora do projeto.".

## Ramos
- R1 `src/editor/assistant/controller.ts:220` `if (current.request === null || current.request.serial === lastRequest) return;` — sem pedido novo: nada; pedido novo: segue para `execute`.
- R2 `src/editor/assistant/controller.ts:132` `if (!vault || !value.trim()) {` — sem cofre ou sem texto: avisa `assistant.keyRequired`; com cofre e texto: grava a chave e avisa `assistant.keySaved`.
- R3 `src/editor/assistant/controller.ts:127` `await ready;` — o cofre pode não estar pronto; a execução espera por ele antes de gravar.

## Fronteiras assíncronas
- F1 `src/editor/assistant/controller.ts:222` `void execute(current.request.kind).catch(error => {` — o despacho não espera; entradas que podem rodar no intervalo: qualquer outra entrada do editor (teclado, ponteiro, outra porta, `ENT-L06-0017`); estado: EST-L06-050 em V4.
- F2 `src/editor/assistant/controller.ts:127` `await ready;` — a espera pelo cofre; entradas `ENT-L06-0009`, `ENT-L06-0010`, `ENT-L06-0011`; estado: EST-L06-004 em V2.
- F3 `src/editor/assistant/controller.ts:136` `await vault.save(value);` — a espera pela gravação no cofre; entrada `ENT-L06-0013`; estado: EST-L06-008 em V3.

## Estado
- lê: EST-L06-050, EST-L06-004
- escreve: EST-L06-050, EST-L06-004, EST-L06-005, EST-L06-008

## Resultado
- **Estado final:** EST-L06-050 com `hasKey` verdadeiro `src/editor/assistant/controller.ts:137` `report({ hasKey: true });`; EST-L06-008 com a chave cifrada gravada `src/editor/assistant/credentials.ts:46` `await write([['credential', { iv, encrypted }]]);`; EST-L06-004 com o segredo em memória esvaziado `src/editor/assistant/controller.ts:131` `secret = '';`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** a nota da chave no painel `assistant-panel` `src/editor/assistant/surface.tsx:22` `{t(hasKey ? 'assistant.keySaved' : 'assistant.keyRequired')}`
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:568` `"undoable": false`
- G2: n/a — o comando não altera o documento: `manifest/commands/assistant.json:568` `"undoable": false`
- G3: ok — a única porta do comando é `assistant-save-key` `manifest/commands/assistant.json:572` `"id": "assistant-save-key",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:577` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a conferência de corte e alcance depende de medição (fase 6): `manifest/commands/assistant.json:577` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:568` `"undoable": false`

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer ou observador; a assinatura da store `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` é removida pelo desinstalador `src/editor/assistant/controller.ts:230` `unwatch();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
