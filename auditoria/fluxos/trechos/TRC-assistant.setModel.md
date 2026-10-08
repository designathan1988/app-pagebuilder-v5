# TRC-assistant.setModel
- **Chamada:** `src/app/commands.ts:178` `'assistant.setModel': setAssistantModel,`
- **Argumentos:** `{ value: string }` — o identificador do modelo digitado no campo "Modelo" (`assistant-model`), enviado tal como está; o tratador apara e valida.
- **Ramos que dependem dos argumentos:** R2

## Passos
1. `src/app/commands.ts:178` `'assistant.setModel': setAssistantModel,` — a tabela de comandos liga o id ao tratador `setAssistantModel` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor, que captura o contexto da digitação antes do comando.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador com o estado corrente e os argumentos.
4. `src/editor/assistant/state.ts:27` `export const setAssistantModel = registerHandler<'assistant.setModel', EditorUi>('assistant.setModel', ({ state }, { value }) => {` — o tratador recebe `{ value }`.
5. `src/editor/assistant/state.ts:28` `if (assistantOf(state.ui).busy) return { kind: 'refused', message: message('assistant.busy') };` — lê o turno do assistente. [lê: EST-L06-050 via assistantOf]
6. `src/editor/assistant/state.ts:29` `const model = value.trim();` — apara o argumento.
7. `src/editor/assistant/state.ts:30` `if (!/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/.test(model)) return { kind: 'refused', message: message('assistant.invalidModel') };` — valida o identificador.
8. `src/editor/assistant/state.ts:31` `return { kind: 'change', ui: { ...nextUi(state.ui, { entries: [] }), preferences: { ...state.ui.preferences, assistantModel: model } }, message: message('assistant.modelChanged') };` — limpa as mensagens e grava o modelo nas preferências. [lê: EST-L06-050 via assistantOf] [escreve: EST-L06-050 via nextUi] [escreve: EST-L06-051 via setAssistantModel]
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run] [escreve: EST-L06-051 via run]
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
11. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados; o React redesenha e a assinatura do assistente vê o modelo novo. [lê: EST-L06-051 via a assinatura da store]
12. `src/editor/assistant/controller.ts:216` `if (nextModel !== model && !current.busy) {` — a assinatura compara o modelo novo com o em uso e o turno. [lê: EST-L06-050 via assistantOf]
13. `src/editor/assistant/controller.ts:218` `session?.clear();` — limpa a conversa da sessão; com a troca, as mensagens anteriores começam de novo. [escreve: EST-L06-013 via clear]

## Ramos
- R1 `src/editor/assistant/state.ts:28` `if (assistantOf(state.ui).busy) return { kind: 'refused', message: message('assistant.busy') };` — com EST-L06-050 em V4 (turno em curso): recusa `assistant.busy`, nada muda; com o assistente livre: segue para a validação.
- R2 `src/editor/assistant/state.ts:30` `if (!/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/.test(model)) return { kind: 'refused', message: message('assistant.invalidModel') };` — depende do argumento `value`: um identificador fora do formato recusa `assistant.invalidModel`; um identificador no formato grava o modelo e limpa as mensagens.
- R3 `src/editor/assistant/controller.ts:216` `if (nextModel !== model && !current.busy) {` — modelo novo com o assistente livre: limpa a sessão; modelo igual ou o assistente ocupado: a assinatura não faz nada.

## Fronteiras assíncronas
- nenhuma — o tratador e a assinatura da store que reage em `src/editor/assistant/controller.ts:216` `if (nextModel !== model && !current.busy) {` rodam de forma síncrona dentro de `publish`; `src/editor/assistant/session.ts:20` `clear() {` não espera promessa e o comando não grava o pedido `request`.

## Estado
- lê: EST-L06-050, EST-L06-051
- escreve: EST-L06-050, EST-L06-051, EST-L06-013

## Resultado
- **Estado final:** EST-L06-050 com as mensagens limpas (V2) e EST-L06-051 no identificador escolhido `src/editor/assistant/state.ts:31` `return { kind: 'change', ui: { ...nextUi(state.ui, { entries: [] }), preferences: { ...state.ui.preferences, assistantModel: model } }, message: message('assistant.modelChanged') };`; EST-L06-013 com a conversa limpa `src/editor/assistant/session.ts:22` `messages = [];`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** o campo "Modelo" e a lista de mensagens do painel `assistant-panel` `src/editor/assistant/surface.tsx:7` `door('assistant-model', { value: model, disabled: busy })`
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:31` `"undoable": false`
- G2: n/a — o comando não altera o documento; nada há a gravar antes de rodar `manifest/commands/assistant.json:31` `"undoable": false`
- G3: ok — a única porta do comando é `assistant-model` `manifest/commands/assistant.json:35` `"id": "assistant-model",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:40` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel: `manifest/commands/assistant.json:40` `"panel": "assistant",`; a conferência de corte e alcance depende de medição (fase 6).
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:31` `"undoable": false`

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer ou observador; a assinatura da store que reage ao modelo `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` é removida pelo desinstalador do assistente `src/editor/assistant/controller.ts:230` `unwatch();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
