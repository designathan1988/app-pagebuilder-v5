# ENT-P-assistant-0016 — assistant.update pela porta assistant.update#assistant-input

Fluxo de porta do domínio `assistant`. Rastreia o caminho próprio da porta — o campo da conversa que o painel `assistant-panel` desenha por `AssistantField` com gravação a cada digitação — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-assistant.update`, que segue daqui.

O campo Início do bloco da porta (`src/editor/doors/door.tsx:285`) não é a linha que despacha esta porta: o painel substitui o `DoorControl` genérico por `AssistantField`, cuja entrega fica em `src/editor/assistant/panel.tsx:33`.

## Passos
1. `src/editor/assistant/surface.tsx:15` `    <footer>{door('assistant-input', { value: draft, disabled: busy })}{door('assistant-reference', { disabled: busy })}{busy ? door('assistant-cancel', {}) : door('assistant-send', { disabled: !configured || !draft.trim() })}</footer>` — o painel pede o controle "assistant-input" no rodapé da conversa.
2. `src/editor/assistant/panel.tsx:58` `    if (name === 'assistant-input') return <AssistantField entry={entry} value={state.draft} multiline live />;` — o desenhador devolve o campo `AssistantField` com `multiline` e `live` verdadeiros.
3. `src/editor/assistant/panel.tsx:31` `  const keep = () => {` — o campo grava o que ele mostra.
4. `src/editor/assistant/panel.tsx:32` `    if (!field.current || busy) return;` — sem elemento de campo ou com o assistente ocupado, nada é despachado.
5. `src/editor/assistant/panel.tsx:33` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, { value: field.current.value });` — a porta entrega a intenção: o id do comando e o texto do campo como `value`.
6. `src/editor/assistant/panel.tsx:35` `const props = { className: 'input', 'aria-label': label, disabled: busy || !door.available, defaultValue: value, onBlur: keep, onInput: live ? keep : undefined, 'data-key-context': multiline ? 'assistant-input' : 'command-field' };` — com `live` verdadeiro o `onInput` é o `keep`, então o campo despacha a cada digitação, sem rascunho pendente.
7. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
8. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — `assistant.update` não é desfazível (`manifest/commands/assistant.json:782` `"undoable": false`).
9. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via o dispatch da store do editor]
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
12. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
13. `src/app/commands.ts:191` `'assistant.update': reportAssistant,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-assistant.update`).

## Ramos
- R1 `src/editor/assistant/panel.tsx:32` `    if (!field.current || busy) return;` — com o assistente ocupado (`busy` verdadeiro) a digitação não é despachada; livre, segue.
- R2 `src/editor/assistant/panel.tsx:35` `const props = { className: 'input', 'aria-label': label, disabled: busy || !door.available, defaultValue: value, onBlur: keep, onInput: live ? keep : undefined, 'data-key-context': multiline ? 'assistant-input' : 'command-field' };` — o campo da conversa tem `live` verdadeiro, então cada digitação grava; um campo sem `live` gravaria só ao perder o foco ou submeter.
- R3 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele iria por `src/editor/store.ts:241` `result = inGesture(id, () => gesture.dispatch(id, args));`.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id `assistant.update` tem tratador na tabela.

## Fronteiras assíncronas
- nenhuma — o caminho de `src/editor/assistant/panel.tsx:33` a `src/app/commands.ts:191` é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-038 (via o dispatch da store do editor)
- escreve: nenhum no caminho da porta; a escrita de EST-L06-050 entra no trecho `TRC-assistant.update`

## Resultado
- **Estado final:** EST-L06-050 com os campos do relatório gravados (o rascunho publicado como `draft`), pelo trecho `TRC-assistant.update` (`src/editor/assistant/state.ts:75`).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** o campo da conversa com o rascunho e a lista de mensagens no painel `assistant-panel`, pelo trecho.
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:782` `"undoable": false`
- G2: ok `src/editor/assistant/panel.tsx:35` `const props = { className: 'input', 'aria-label': label, disabled: busy || !door.available, defaultValue: value, onBlur: keep, onInput: live ? keep : undefined, 'data-key-context': multiline ? 'assistant-input' : 'command-field' };` — o campo despacha a cada digitação (`onInput` verdadeiro no campo `live`), sem deixar rascunho pendente.
- G3: ok `src/editor/assistant/panel.tsx:33` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, { value: field.current.value });` — a única porta do comando (`manifest/commands/assistant.json:786` `"id": "assistant-input",`) entrega só a intenção e o tratador único decide.
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:791` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/assistant/panel.tsx:33`.
- G6: n/a — o caminho da porta não escreve a seleção: `src/editor/assistant/panel.tsx:33`.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:782` `"undoable": false`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/assistant/panel.tsx:33` e `src/app/commands.ts:191`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-assistant.update
- **Argumentos enviados:** `{ value }` — o texto que o campo da conversa mostra (`src/editor/assistant/panel.tsx:33`), uma string; o relatório do turno chega por outra chamada do mesmo comando.
- R1 `src/editor/assistant/state.ts:72` `const parsed = reportSchema.safeParse(typeof value === 'string' ? { draft: value } : value);` — o `value` que esta porta envia é uma string, então o caminho passa pelo lado do rascunho (`{ draft: value }`).
- R2 `src/editor/assistant/state.ts:73` `if (!parsed.success) return { kind: 'refused', message: message('assistant.failed') };` — o texto do campo é sempre uma string e o esquema a aceita como `draft`, então o caminho não toma o lado da recusa; grava os campos.
