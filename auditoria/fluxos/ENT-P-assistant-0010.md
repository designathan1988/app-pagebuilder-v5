# ENT-P-assistant-0010 — assistant.connect pela porta assistant.connect#assistant-bridge-connect

Fluxo de porta do domínio `assistant`. Rastreia o caminho próprio da porta — o botão "Conectar ao Companion", que abre o seletor do arquivo de conexão, até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-assistant.connect`, que segue daqui.

O painel não desenha esta porta pelo `DoorControl`: em `src/editor/assistant/panel.tsx:66` `if (name === 'assistant-bridge-connect') return <button type="button" className="door door--button" data-door={entry.ref} disabled={state.busy} onClick={() => connection.current?.click()}>{t(entry.door.labelKey as MessageId)}</button>;` o botão apenas abre o seletor de arquivo escondido; o comando é despachado quando o arquivo é lido.

## Passos
1. `src/editor/assistant/surface.tsx:24` `    {door('assistant-bridge-connect', {})}{door('assistant-bridge-disconnect', { disabled: !connected })}` — a aba de preferências pede o controle "Conectar ao Companion".
2. `src/editor/assistant/panel.tsx:66` `if (name === 'assistant-bridge-connect') return <button type="button" className="door door--button" data-door={entry.ref} disabled={state.busy} onClick={() => connection.current?.click()}>{t(entry.door.labelKey as MessageId)}</button>;` — o clique do botão abre o seletor de arquivo escondido (`src/editor/assistant/panel.tsx:72`).
3. `src/editor/assistant/panel.tsx:76` `      void file.text().then(text => {` — o arquivo de conexão é lido em promessa.
4. `src/editor/assistant/panel.tsx:77` `        assistantController(store)?.stageConnection(text);` — o par (endereço e token) é guardado no controlador.
5. `src/editor/assistant/panel.tsx:78` `        invoke(entryOf('assistant-bridge-connect'));` — a porta entrega a intenção à store do editor.
6. `src/editor/assistant/panel.tsx:54` `  const invoke = (entry: DoorEntry, args: unknown = {}) => (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, args);` — o `invoke` é o `store.dispatch` da store do editor com o id do comando.
7. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
8. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `assistant.connect` não é desfazível (`manifest/commands/assistant.json:464` `"undoable": false`).
9. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via dispatch]
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
12. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
13. `src/app/commands.ts:185` `'assistant.connect': connectAssistant,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-assistant.connect`).

## Ramos
- R1 `src/editor/assistant/panel.tsx:75` `      if (!file) return;` — nada escolhido no seletor: o caminho para; escolhido: segue para a leitura.
- R2 `src/editor/assistant/panel.tsx:79` `      }).catch(() => store.notice(message('assistant.invalidConnection')));` — o arquivo não lido ou um par inválido falha e avisa `assistant.invalidConnection` sem despachar; um par válido segue.
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele iria por `src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id `assistant.connect` tem tratador na tabela.

## Fronteiras assíncronas
- F1 `src/editor/assistant/panel.tsx:76` `      void file.text().then(text => {` — a entrega não espera a leitura do arquivo; entradas que podem rodar no intervalo: outra porta do painel (as demais `ENT-P-assistant-*`) e as entradas de teclado e ponteiro do editor; estado da aplicação: EST-L01-030 sem o pedido `connect` ainda.

## Estado
- lê: EST-L05a-038 (via dispatch)
- escreve: nenhum no caminho da porta; as escritas de EST-L06-050, EST-L06-004, EST-L06-005 e EST-L06-001 entram no trecho `TRC-assistant.connect`

## Resultado
- **Estado final:** EST-L06-050 com o pedido `connect`, pelo trecho `TRC-assistant.connect` (`src/editor/assistant/state.ts:61`).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel a cada relatório de conexão.
- **DOM do editor:** o estado da conexão no painel `assistant-panel`, pelo trecho.
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:464` `"undoable": false`
- G2: n/a — o comando não altera o documento nem o estado antes de rodar: `manifest/commands/assistant.json:464` `"undoable": false`
- G3: ok `src/editor/assistant/panel.tsx:54` `  const invoke = (entry: DoorEntry, args: unknown = {}) => (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, args);` — a única porta do comando (`manifest/commands/assistant.json:468` `"id": "assistant-bridge-connect",`) entrega só a intenção (o id do comando e `{}`) e o tratador único decide.
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:473` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/assistant/panel.tsx:78`.
- G6: n/a — o caminho da porta não escreve a seleção: `src/editor/assistant/panel.tsx:78`.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:464` `"undoable": false`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/assistant/panel.tsx:66` e `src/app/commands.ts:185`; o seletor de arquivo é o `input` do próprio painel (`src/editor/assistant/panel.tsx:72`), que o evento `change` libera ao esvaziar o valor.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-assistant.connect
- **Argumentos enviados:** nenhum — a porta não envia valor (o `invoke` de `src/editor/assistant/panel.tsx:54` usa `{}`); o par (endereço e token) já veio do arquivo pelo `stageConnection`.
- nenhum — o trecho não lista ramo que dependa dos argumentos (`auditoria/fluxos/trechos/TRC-assistant.connect.md` `**Ramos que dependem dos argumentos:** nenhum`), então o caminho segue direto à gravação do pedido `connect`.
