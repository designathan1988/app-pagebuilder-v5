# TRC-assistant.attachReference
- **Chamada:** `src/app/commands.ts:180` `'assistant.attachReference': attachAssistantReference,`
- **Argumentos:** `{ file: file }` — o arquivo escolhido no seletor ("Adicionar imagem de referência"), lido pela porta como um registo de upload (uma lista de um `{ name, type, bytes }`) ou como o texto JSON dele.
- **Ramos que dependem dos argumentos:** R1, R2

## Passos
1. `src/app/commands.ts:180` `'assistant.attachReference': attachAssistantReference,` — a tabela de comandos liga o id ao tratador `attachAssistantReference` (`src/editor/assistant/state.ts`).
2. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho passa pela store do editor.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store do núcleo executa o tratador.
4. `src/editor/assistant/state.ts:33` `export const attachAssistantReference = registerHandler<'assistant.attachReference', EditorUi>('assistant.attachReference', ({ state }, { file }) => {` — o tratador recebe `{ file }`.
5. `src/editor/assistant/state.ts:37` `const given: unknown = typeof file === 'string' ? JSON.parse(file) : file;` — aceita o texto JSON ou o registo já lido.
6. `src/editor/assistant/state.ts:38` `const record: unknown = Array.isArray(given) ? given[0] : given;` — toma o primeiro registo da lista.
7. `src/editor/assistant/state.ts:39` `const picked = z.object({ name: z.string(), type: z.enum(['image/png', 'image/jpeg', 'image/webp', 'image/gif']), bytes: z.string() }).parse(record);` — valida o nome, o formato aceito e os bytes.
8. `src/editor/assistant/state.ts:40` `imageBlock(Uint8Array.from(atob(picked.bytes), char => char.charCodeAt(0)), picked.type);` — confere o tamanho da imagem (1 byte a 5 MiB) em `src/editor/assistant/provider.ts:8` `if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw new RangeError('Reference image must be between 1 byte and 5 MiB');`
9. `src/editor/assistant/state.ts:41` `return { kind: 'change', ui: nextUi(state.ui, { reference: { name: picked.name, type: picked.type, bytes: picked.bytes } }), message: message('assistant.referenceAdded') };` — grava a imagem de referência à espera do envio. [lê: EST-L06-050 via assistantOf] [escreve: EST-L06-050 via nextUi]
10. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo. [escreve: EST-L06-050 via run]
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado, sem mudança de documento.
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e o React redesenha o painel.

## Ramos
- R1 `src/editor/assistant/state.ts:37` `const given: unknown = typeof file === 'string' ? JSON.parse(file) : file;` — depende do argumento `file`: um texto é lido como JSON; um registo já lido é usado como está.
- R2 `src/editor/assistant/state.ts:42` `} catch { return { kind: 'refused', message: message('assistant.invalidImage') }; }` — um formato fora dos aceitos, um registo inválido ou um tamanho fora dos limites leva à recusa `assistant.invalidImage`; um registo válido leva à mudança que grava a referência.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono e não grava o pedido `request`: `src/editor/assistant/state.ts:33` `export const attachAssistantReference = registerHandler<'assistant.attachReference', EditorUi>('assistant.attachReference', ({ state }, { file }) => {`

## Estado
- lê: EST-L06-050
- escreve: EST-L06-050

## Resultado
- **Estado final:** EST-L06-050 com a imagem de referência (V7) `src/editor/assistant/state.ts:41` `return { kind: 'change', ui: nextUi(state.ui, { reference: { name: picked.name, type: picked.type, bytes: picked.bytes } }), message: message('assistant.referenceAdded') };`
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** a prévia da imagem de referência no painel `assistant-panel` `src/editor/assistant/panel.tsx:91` `{state.reference && <div className="assistant-reference">`
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:177` `"undoable": false`
- G2: n/a — o comando não altera o documento: `manifest/commands/assistant.json:177` `"undoable": false`
- G3: ok — a única porta do comando é `assistant-reference` `manifest/commands/assistant.json:181` `"id": "assistant-reference",`
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:186` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o comando não altera o traçado do painel; a prévia cresce com a imagem e a conferência depende de medição (fase 6): `manifest/commands/assistant.json:186` `"panel": "assistant",`
- G6: n/a — o comando não escreve a seleção: `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` mantém a seleção anterior.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:177` `"undoable": false`

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer ou observador; o seletor de arquivo é desenhado pelo painel e a assinatura da store `src/editor/assistant/controller.ts:213` `const unwatch = store.subscribe(() => {` é removida pelo desinstalador `src/editor/assistant/controller.ts:230` `unwatch();`

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
