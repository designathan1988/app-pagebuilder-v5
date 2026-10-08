# ENT-P-assistant-0012 — assistant.saveKey pela porta assistant.saveKey#assistant-save-key

Fluxo de porta do domínio `assistant`. Rastreia o caminho próprio da porta — o botão "Salvar chave" da aba de preferências, que entrega o texto do campo de senha ao controlador antes de despachar — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-assistant.saveKey`, que segue daqui.

O painel não desenha esta porta pelo `DoorControl`: em `src/editor/assistant/panel.tsx:61` o botão é desenhado à mão e entrega a chave ao controlador antes de despachar o comando, sem argumentos.

## Passos
1. `src/editor/assistant/surface.tsx:23` `    {door('assistant-save-key', {})}{door('assistant-delete-key', { disabled: !hasKey })}` — a aba de preferências pede o controle "Salvar chave".
2. `src/editor/assistant/panel.tsx:61` `    if (name === 'assistant-save-key') return <button type="button" className="door door--button" data-door={entry.ref} disabled={state.busy} onClick={() => {` — o botão é desenhado à mão, com o clique próprio.
3. `src/editor/assistant/panel.tsx:62` `      assistantController(store)?.stageKey(key.current?.value ?? '');` — o texto do campo de senha vai ao controlador (o segredo fica fora do estado).
4. `src/editor/assistant/panel.tsx:63` `      if (key.current) key.current.value = '';` — o campo é esvaziado.
5. `src/editor/assistant/panel.tsx:64` `      invoke(entry);` — a porta entrega a intenção à store do editor.
6. `src/editor/assistant/panel.tsx:54` `  const invoke = (entry: DoorEntry, args: unknown = {}) => (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, args);` — o `invoke` é o `store.dispatch` da store do editor com o id do comando.
7. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
8. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — `assistant.saveKey` não é desfazível (`manifest/commands/assistant.json:568` `"undoable": false`).
9. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via o dispatch da store do editor]
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
12. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
13. `src/app/commands.ts:187` `'assistant.saveKey': saveAssistantKey,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-assistant.saveKey`).

## Ramos
- R1 `src/editor/assistant/panel.tsx:62` `      assistantController(store)?.stageKey(key.current?.value ?? '');` — sem controlador instalado, o `?.` não chama o `stageKey`; com ele, o texto é guardado antes do despacho.
- R2 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele iria por `src/editor/store.ts:241` `result = inGesture(id, () => gesture.dispatch(id, args));`.
- R3 `src/core/store/store.ts:400` `const entry = table[id];` — o id `assistant.saveKey` tem tratador na tabela.

## Fronteiras assíncronas
- nenhuma no caminho da porta — de `src/editor/assistant/panel.tsx:64` a `src/app/commands.ts:187` o caminho é síncrono; a gravação no cofre roda depois, no trecho `TRC-assistant.saveKey`.

## Estado
- lê: EST-L05a-038 (via o dispatch da store do editor)
- escreve: nenhum no caminho da porta; as escritas de EST-L06-050, EST-L06-004, EST-L06-005 e EST-L06-008 entram no trecho `TRC-assistant.saveKey`

## Resultado
- **Estado final:** EST-L06-050 com o pedido `save-key`, pelo trecho `TRC-assistant.saveKey` (`src/editor/assistant/state.ts:63`).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** a nota da chave no painel `assistant-panel`, pelo trecho.
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:568` `"undoable": false`
- G2: n/a — o comando não altera o documento nem o estado antes de rodar: `manifest/commands/assistant.json:568` `"undoable": false`
- G3: ok `src/editor/assistant/panel.tsx:54` `  const invoke = (entry: DoorEntry, args: unknown = {}) => (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, args);` — a única porta do comando (`manifest/commands/assistant.json:572` `"id": "assistant-save-key",`) entrega só a intenção (o id do comando e `{}`) e o tratador único decide; o texto da senha é levado fora do estado pelo `stageKey`.
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:577` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/assistant/panel.tsx:64`.
- G6: n/a — o caminho da porta não escreve a seleção: `src/editor/assistant/panel.tsx:64`.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:568` `"undoable": false`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/assistant/panel.tsx:61` e `src/app/commands.ts:187`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-assistant.saveKey
- **Argumentos enviados:** nenhum — a porta não envia valor (o `invoke` de `src/editor/assistant/panel.tsx:54` usa `{}`); o texto da senha é entregue antes pelo `stageKey`, nunca ao estado.
- nenhum — o trecho não lista ramo que dependa dos argumentos (`auditoria/fluxos/trechos/TRC-assistant.saveKey.md` `**Ramos que dependem dos argumentos:** nenhum`), então o caminho segue direto à gravação do pedido `save-key`.
