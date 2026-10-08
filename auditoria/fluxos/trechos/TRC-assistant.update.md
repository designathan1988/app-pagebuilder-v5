# TRC-assistant.update
- **Chamada:** `src/app/commands.ts:191` `'assistant.update': reportAssistant,`
- **Argumentos:** `{ value: json }` — o texto digitado no campo `assistant-input` (uma string) ou um relatório do turno (um objeto com `busy`, `hasKey`, `connection`, `session`, `entries`, `draft`, `inputTokens` e `outputTokens`).
- **Ramos que dependem dos argumentos:** R1, R2

## Passos
1. `src/app/commands.ts:191` `'assistant.update': reportAssistant,` — a tabela de comandos liga o id ao tratador `reportAssistant` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:71` `export const reportAssistant: RegisteredHandler<'assistant.update', EditorUi> = registerHandler('assistant.update', ({ state }, { value }) => {` — o tratador recebe `{ value }`.
5. `src/editor/assistant/state.ts:72` `const parsed = reportSchema.safeParse(typeof value === 'string' ? { draft: value } : value);` — aceita o texto digitado ou o relatório do turno.
6. `src/editor/assistant/state.ts:73` `if (!parsed.success) return { kind: 'refused', message: message('assistant.failed') };` — recusa um valor fora do formato.
7. `src/editor/assistant/state.ts:74` `const patch = Object.fromEntries(Object.entries(parsed.data).filter(([, value]) => value !== undefined)) as Partial<AssistantState>;` — monta a mudança só com os campos presentes.
8. `src/editor/assistant/state.ts:75` `return { kind: 'change', ui: nextUi(state.ui, patch) };` — grava os campos no assistente. [lê: EST-L06-050 via assistantOf] [escreve: EST-L06-050 via nextUi]
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run]
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
11. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e o React redesenha o painel.

## Ramos
- R1 `src/editor/assistant/state.ts:72` `const parsed = reportSchema.safeParse(typeof value === 'string' ? { draft: value } : value);` — depende do argumento `value`: uma string entra como `draft`; um objeto entra como relatório do turno.
- R2 `src/editor/assistant/state.ts:73` `if (!parsed.success) return { kind: 'refused', message: message('assistant.failed') };` — depende do argumento `value`: um valor fora do formato recusa `assistant.failed`; um valor no formato grava os campos.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono e não grava o pedido `request`: `src/editor/assistant/state.ts:72` `const parsed = reportSchema.safeParse(typeof value === 'string' ? { draft: value } : value);` é a leitura do argumento, sem espera alguma.

## Estado
- lê: EST-L06-050
- escreve: EST-L06-050

## Resultado
- **Estado final:** EST-L06-050 com os campos do relatório gravados `src/editor/assistant/state.ts:75` `return { kind: 'change', ui: nextUi(state.ui, patch) };`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** o campo da conversa com o rascunho e a lista de mensagens no painel `assistant-panel` `src/editor/assistant/panel.tsx:58` `if (name === 'assistant-input') return <AssistantField entry={entry} value={state.draft} multiline live />;`
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:782` `"undoable": false`
- G2: n/a — o campo da conversa despacha a cada digitação, sem rascunho pendente `src/editor/assistant/panel.tsx:35` `onInput: live ? keep : undefined,`
- G3: ok — a única porta do comando é `assistant-input` `manifest/commands/assistant.json:786` `"id": "assistant-input",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:791` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a conferência de corte e alcance depende de medição (fase 6): `manifest/commands/assistant.json:791` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:782` `"undoable": false`

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer ou observador; a assinatura da store `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` é removida pelo desinstalador `src/editor/assistant/controller.ts:230` `unwatch();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
