# ENT-P-assistant-0008 — assistant.send pela porta assistant.send#send-key

Fluxo de porta do domínio `assistant`. Rastreia o caminho próprio da porta — a tecla Ctrl+Enter despachada pelo mapa de teclas — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-assistant.send`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla Ctrl+Enter (o `chord` da porta, `manifest/commands/assistant.json:386` `"chord": "Ctrl+Enter",`) roda o despacho do comando com os argumentos do `binding`.
2. `src/editor/input/keymap.ts:525` `    const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — fora de gesto e sem rajada de letras, o despacho é o `store.dispatch` da store do editor.
3. `src/editor/input/keymap.ts:526` `    const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos da porta juntam os que o lugar dá (nenhum, fora da edição de texto em lugar) aos do manifesto (nenhum, `manifest/commands/assistant.json:385` `"args": {},`).
4. `src/editor/input/keymap.ts:527` `    const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — a porta é `shortcut` sem gesto (`manifest/commands/assistant.json:373` `"gesture": null,`), então os argumentos são `given`.
5. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
6. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — `assistant.send` não é desfazível (`manifest/commands/assistant.json:340` `"undoable": false`).
7. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via o dispatch da store do editor]
8. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
9. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
10. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
11. `src/app/commands.ts:183` `'assistant.send': sendAssistant,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-assistant.send`).

## Ramos
- R1 `src/editor/input/keymap.ts:530` `    const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — o comando não declara argumento `clipboard`, então `clipboard` é `undefined` e o caminho segue para a linha 531.
- R2 `src/editor/input/keymap.ts:525` `    const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — com um gesto aberto o despacho iria pelo gesto; aqui não há gesto, então o despacho é o `store.dispatch`.
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele iria por `src/editor/store.ts:227` `else if (!changesDocument) result = open.dispatch(id, args);`.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id `assistant.send` tem tratador na tabela.

## Fronteiras assíncronas
- nenhuma — o caminho de `src/editor/input/keymap.ts:531` a `src/app/commands.ts:183` é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-038 (via o dispatch da store do editor)
- escreve: nenhum no caminho da porta; as escritas entram no trecho `TRC-assistant.send`

## Resultado
- **Estado final:** EST-L06-050 em V4 (turno em curso e o pedido `send`), pelo trecho `TRC-assistant.send` (`src/editor/assistant/state.ts:58`).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** o rodapé troca Enviar pelo botão Parar enquanto o turno corre, pelo trecho.
- **DOM do canvas:** as alterações do turno passam pelos comandos reais num grupo de desfazer próprio, pelo trecho.

## Regras
- G1: n/a — o comando não grava no documento nesta entrada: `manifest/commands/assistant.json:340` `"undoable": false`
- G2: n/a — o comando não altera o documento nem o estado antes de rodar: `manifest/commands/assistant.json:340` `"undoable": false`
- G3: ok `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta envia só a intenção (o id do comando e os argumentos do `binding`) e o tratador único decide; as duas portas chegam ao mesmo tratador (`manifest/commands/assistant.json:344` `"id": "assistant-send",` e `manifest/commands/assistant.json:370` `"id": "send-key",`).
- G4: n/a — a porta é uma tecla, não um ponto do canvas: `manifest/commands/assistant.json:371` `"kind": "shortcut",`
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/input/keymap.ts:531`.
- G6: n/a — o caminho da porta não escreve a seleção: `src/editor/input/keymap.ts:531`.
- G7: n/a — o documento não muda na própria entrada: `src/core/store/store.ts:321` `if (next.document !== before.document) {` só avisa os ouvintes quando o documento muda.
- INT: n/a — a própria entrada não toca o documento: `manifest/commands/assistant.json:340` `"undoable": false`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/input/keymap.ts:531` e `src/app/commands.ts:183`; o ouvinte de teclado pertence ao instalador do mapa de teclas, fora deste caminho.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-assistant.send
- **Argumentos enviados:** nenhum — a porta não envia valor; o texto vem do campo `assistant-input` já no estado (`src/editor/input/keymap.ts:531` entrega só o id do comando e os argumentos do `binding`).
- nenhum — o trecho não lista ramo que dependa dos argumentos (`auditoria/fluxos/trechos/TRC-assistant.send.md` `**Ramos que dependem dos argumentos:** nenhum`), então os ramos do trecho dependem do estado, não do que a porta envia.
