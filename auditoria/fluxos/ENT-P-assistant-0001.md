# ENT-P-assistant-0001 — assistant.setModel pela porta assistant.setModel#assistant-model

Fluxo de porta do domínio `assistant`. Rastreia o caminho próprio da porta — o campo "Modelo" que o painel `assistant-panel` desenha por `AssistantField` — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-assistant.setModel`, que segue daqui.

O campo Início do bloco da porta (`src/editor/doors/door.tsx:285`) não é a linha que despacha esta porta: o painel substitui o `DoorControl` genérico por `AssistantField`, cuja entrega fica em `src/editor/assistant/panel.tsx:33`.

## Passos
1. `src/editor/assistant/surface.tsx:7` `<header>{door('assistant-model', { value: model, disabled: busy })}{door('assistant-preferences', {})}</header>` — o painel pede o controle "Modelo" ao desenhador `door` do cabeçalho da conversa (a aba de preferências o pede de novo em `src/editor/assistant/surface.tsx:20`).
2. `src/editor/assistant/panel.tsx:59` `if (name === 'assistant-model') return <AssistantField entry={entry} value={model} />;` — o desenhador devolve o campo `AssistantField`, não o `DoorControl`.
3. `src/editor/assistant/panel.tsx:22` `function AssistantField({ entry, value, multiline = false, live = false }: { readonly entry: DoorEntry; readonly value: string; readonly multiline?: boolean; readonly live?: boolean }) {` — o componente do campo.
4. `src/editor/assistant/panel.tsx:31` `const keep = () => {` — o campo grava o que ele mostra quando o formulário o submete ou o campo perde o foco.
5. `src/editor/assistant/panel.tsx:32` `if (!field.current || busy) return;` — sem elemento de campo ou com o assistente ocupado, nada é despachado.
6. `src/editor/assistant/panel.tsx:33` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, { value: field.current.value });` — a porta entrega a intenção: o id do comando e o texto do campo como `value`.
7. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
8. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — `assistant.setModel` não é desfazível (`manifest/commands/assistant.json:31` `"undoable": false`), então `changesDocument` é falso.
9. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da edição. [lê: EST-L05a-001 via beforeCommand]
10. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via o dispatch da store do editor]
11. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
12. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
13. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela de comandos.
14. `src/app/commands.ts:178` `'assistant.setModel': setAssistantModel,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-assistant.setModel`).

## Ramos
- R1 `src/editor/assistant/panel.tsx:32` `if (!field.current || busy) return;` — com o assistente ocupado (`busy` verdadeiro) nada é despachado; livre, segue.
- R2 `src/editor/assistant/panel.tsx:35` `const props = { className: 'input', 'aria-label': label, disabled: busy || !door.available, defaultValue: value, onBlur: keep, onInput: live ? keep : undefined, 'data-key-context': multiline ? 'assistant-input' : 'command-field' };` — o campo do modelo tem `live` falso, então `onInput` é `undefined` e a gravação vem do `onBlur` ou da submissão.
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele iria por `src/editor/store.ts:227` `else if (!changesDocument) result = open.dispatch(id, args);`.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id `assistant.setModel` tem tratador na tabela; sem ele o `run` lançaria um erro de comando desconhecido.

## Fronteiras assíncronas
- nenhuma — o caminho de `src/editor/assistant/panel.tsx:33` a `src/app/commands.ts:178` é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand), EST-L05a-038 (via o dispatch da store do editor)
- escreve: nenhum no caminho da porta; a escrita de EST-L06-050 e de EST-L06-051 entra no trecho `TRC-assistant.setModel`

## Resultado
- **Estado final:** EST-L06-050 com as mensagens limpas e EST-L06-051 no identificador escolhido, pelo trecho `TRC-assistant.setModel` (`src/editor/assistant/state.ts:31`).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** o campo "Modelo" do painel `assistant-panel` passa a mostrar o valor gravado, pelo trecho.
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:31` `"undoable": false`
- G2: n/a — o comando não altera o documento nem o estado antes de rodar: `manifest/commands/assistant.json:31` `"undoable": false`
- G3: ok `src/editor/assistant/panel.tsx:33` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, { value: field.current.value });` — a única porta do comando (`manifest/commands/assistant.json:35` `"id": "assistant-model",`) entrega só a intenção e o tratador único decide.
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:40` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/assistant/panel.tsx:33`.
- G6: n/a — o caminho da porta não escreve a seleção: `src/editor/assistant/panel.tsx:33`.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:31` `"undoable": false`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/assistant/panel.tsx:33` e `src/app/commands.ts:178`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-assistant.setModel
- **Argumentos enviados:** `{ value }` — o texto que o campo "Modelo" mostra, enviado tal como está (`src/editor/assistant/panel.tsx:33`); o tratador apara e valida.
- R2 `src/editor/assistant/state.ts:30` `if (!/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/.test(model)) return { kind: 'refused', message: message('assistant.invalidModel') };` — o `value` que o campo envia: um identificador fora do formato leva o caminho à recusa `assistant.invalidModel`; um identificador no formato grava o modelo e limpa as mensagens.
