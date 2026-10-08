# ENT-P-history-0006 — history.redo pela porta key-ctrl-shift-z-in-global
- **Comando:** history.redo
- **Porta:** `manifest/commands/history.json:150` `          "id": "key-ctrl-shift-z-in-global",`
- **Tratador:** `src/app/commands.ts:333` `'history.redo': redoCommand,`
- **Início:** `src/editor/input/keymap.ts:532` `    if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Trecho:** TRC-history.redo

## Passos
1. `src/editor/input/keymap.ts:532` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta do atalho despacha o comando com o id da ligação e os seus argumentos; é o Início da porta.
2. `src/editor/input/keymap.ts:526` `    const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto aberto e sem rajada de letras, `dispatch` é o `store.dispatch` da store do editor.
3. `src/editor/input/keymap.ts:527` `    const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos da ligação; a porta `key-ctrl-shift-z-in-global` declara `manifest/commands/history.json:167` `          "args": {}`, então `given` é o objeto vazio.
4. `src/editor/input/keymap.ts:528` `    const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — sem gesto no atalho, `args` é o `given`.
5. `src/editor/input/keymap.ts:531` `    const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `history.redo` não tem argumento do tipo `clipboard`, então `clipboard` é `undefined`.
6. `src/editor/input/keymap.ts:477` `    const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a ligação da tecla na cadeia de contextos.
7. `src/editor/store.ts:233` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`. [lê: EST-L05a-038 via gestureSafe]
8. `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:236` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — o alvo da digitação pendente. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
10. `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-031 via dispatch] [escreve: EST-L01-032 via dispatch]
11. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
12. `src/core/store/store.ts:400` `    const entry = table[id];` — a tabela de comandos devolve a entrada do comando. [lê: EST-L01-032 via run]
13. `src/app/commands.ts:333` `'history.redo': redoCommand,` — a linha que despacha o comando ao tratador (a Chamada do trecho `TRC-history.redo`).

## Ramos
- R1 `src/editor/input/keymap.ts:488` `    if (!binding) return;` — a tecla não tem ligação no contexto do foco: nada roda; com ligação, o caminho segue.
- R2 `src/editor/input/keymap.ts:506` `    if (!shortcutRunsNow(binding)) return;` — o comando não construído ou a funcionalidade não registrada: a porta não roda; construído e registrado, segue.
- R3 `src/editor/input/keymap.ts:531` `    const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `history.redo` não tem argumento do tipo `clipboard`, então `clipboard` é `undefined` e o caminho segue para a linha 531; o lado que espera a área de transferência (`src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`) não é tomado.
- R4 `src/editor/input/keymap.ts:467` `    if (gesture === null && ((keyContextChain(focused).includes(FIELD_CONTEXT) && keptField(event.target)) || untouched)) {` — com o foco num campo de texto que guarda o que segurava, o `Ctrl+Shift+Z` vai ao histórico do editor por `src/editor/input/keymap.ts:472` `        (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(history.command.id, withDoorArgs({}, history.door.args));`; se o campo tiver um refazer de rascunho próprio, a tecla fica nativa (`src/editor/input/keymap.ts:470` `        if (history.command.id === redoCommand.command && field !== null && hasDraftRedo(field)) return;`); sem esse foco, o caminho segue ao passo 1.
- R5 `src/editor/input/keymap.ts:526` `    const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto e sem rajada de letras, o despacho é o da store do editor; com um gesto aberto, seria o do gesto.
- R6 `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo; com um gesto aberto e um comando que não muda o documento (`history.redo` não é desfazível), iria pelo gesto (`src/editor/store.ts:241` `result = inGesture(id, () => gesture.dispatch(id, args));`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono, de `src/editor/input/keymap.ts:532` `    if (clipboard === undefined) dispatch(binding.command.id, args);` a `src/app/commands.ts:333` `'history.redo': redoCommand,`; nenhum passo cria ouvinte, timer, quadro ou promessa.

## Estado
- Lê: EST-L05a-001, EST-L05a-038, EST-L01-031, EST-L01-032, EST-L01-037.
- Escreve: EST-L01-030, EST-L01-031, EST-L01-032 (pelo `dispatch` do editor; a gravação própria do refazer entra no trecho TRC-history.redo).

## Resultado
- **Estado final:** inalterado por esta porta; o comando é entregue ao tratador `src/app/commands.ts:333` `'history.redo': redoCommand,`; o estado que ele escreve está no trecho `fluxos/trechos/TRC-history.redo.md`.
- **Re-renderizado:** nada muda nesta porta; quem avisa os assinantes é o trecho `TRC-history.redo`.
- **DOM do editor:** nada muda neste caminho `src/editor/input/keymap.ts:532` `    if (clipboard === undefined) dispatch(binding.command.id, args);`.
- **DOM do canvas:** nada muda neste caminho.

## Regras
- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` e o refazer restaura o documento no trecho.
- G2: ok `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando; a tecla do campo fica nativa (o contexto `field` do manifesto não herda `global`, `manifest/interactions.json:118` `    "id": "field",`).
- G3: ok — a porta chega à tabela `src/app/commands.ts:333` `'history.redo': redoCommand,` e envia só a intenção, os argumentos vazios.
- G4: n/a — a porta é uma tecla, não um ponto do canvas `src/editor/input/keymap.ts:532` `    if (clipboard === undefined) dispatch(binding.command.id, args);`.
- G5: n/a — a porta não desenha nem mede painel ou barra `src/editor/input/keymap.ts:532` `    if (clipboard === undefined) dispatch(binding.command.id, args);`.
- G6: n/a — a porta não escreve a seleção; o trecho `TRC-history.redo` mantém a seleção da store.
- G7: n/a — a porta não muda o documento; só entrega o comando `src/app/commands.ts:333` `'history.redo': redoCommand,`.
- INT: n/a — a porta não escreve no documento; a integridade é do trecho `fluxos/trechos/TRC-history.redo.md`.

## Limpeza
- nenhum ouvinte, timer ou observador é criado neste caminho; `src/editor/input/keymap.ts:532` `    if (clipboard === undefined) dispatch(binding.command.id, args);` não abre nenhum, e não há remoção a citar.

## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-history.redo
- **Argumentos enviados:** nenhum campo — `manifest/commands/history.json:138` `      "args": {},`; a porta `key-ctrl-shift-z-in-global` também declara `manifest/commands/history.json:167` `          "args": {}`, então o tratador recebe só o contexto.
- nenhum ramo do trecho depende de um valor de argumento: `TRC-history.redo` declara que nenhum ramo muda com um valor de argumento, e o tratador `src/core/history/history.ts:80` `export const redoCommand = registerHandler('history.redo', () => ({ kind: 'redo' }));` não decide por valor de argumento.
