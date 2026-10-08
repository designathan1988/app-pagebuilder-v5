# ENT-P-clipboard-0009 — clipboard.cut pela porta key-ctrl-x-in-global

Fluxo de porta do domínio `clipboard`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:531` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-clipboard.cut`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta do atalho despacha o comando com o id da ligação e os seus argumentos; é o Início da porta.
2. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto aberto e sem rajada de letras, `dispatch` é o `store.dispatch` da store do editor.
3. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos da ligação; a porta `key-ctrl-x-in-global` declara `"args": {}`, então `given` é o objeto vazio.
4. `src/editor/input/keymap.ts:527` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — sem gesto no atalho, `args` é o `given`.
5. `src/editor/input/keymap.ts:476` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a ligação da tecla na cadeia de contextos.
6. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
7. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `clipboard.cut` é reversível no manifesto, então `changesDocument` é verdadeiro.
8. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — o alvo da digitação pendente. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
10. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-031 via dispatch]
11. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
12. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
13. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — a função que roda um comando.
14. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
15. `src/app/commands.ts:208` `'clipboard.cut': cutCommand,` — a linha que despacha o comando ao tratador (a Chamada do trecho `TRC-clipboard.cut`).

## Ramos
- R1 `src/editor/input/keymap.ts:487` `if (!binding) return;` — a tecla não tem ligação no contexto do foco: nada roda; com ligação, o caminho segue.
- R2 `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — o comando não construído ou a funcionalidade não registrada: a porta não roda; construído e registrado, segue.
- R3 `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `clipboard.cut` não tem argumento do tipo `clipboard`, então `clipboard` é `undefined` e o caminho segue para a linha 531; o lado que espera a área de transferência (`src/editor/input/keymap.ts:532` `else if (gesture === null) void readClipboard().then((content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`) não é tomado.
- R4 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo; com um gesto aberto, `clipboard.cut` é reversível, então entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R5 `src/core/store/store.ts:400` `const entry = table[id];` — o id é um comando do manifesto, então a tabela devolve a entrada `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono, de `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` a `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`; nenhum passo cria ouvinte, timer, quadro ou promessa.

## Estado
- lê: EST-L05a-001, EST-L01-031, EST-L01-037
- escreve: EST-L01-030, EST-L01-031

## Resultado
- **Estado final:** inalterado por esta porta; o comando é entregue ao tratador `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`; o estado que ele escreve está no trecho `fluxos/trechos/TRC-clipboard.cut.md`.
- **Re-renderizado:** nada muda nesta porta; quem avisa os assinantes é o trecho `TRC-clipboard.cut`.
- **DOM do editor:** nada muda neste caminho `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- **DOM do canvas:** nada muda neste caminho.

## Regras
- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando.
- G3: ok — a porta chega à tabela `src/app/commands.ts:208` `'clipboard.cut': cutCommand,` e envia só a intenção, os argumentos vazios.
- G4: n/a — a porta não desenha elemento sobre o canvas `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- G5: n/a — a porta não desenha nem mede painel ou barra `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- G6: n/a — a porta não escreve a seleção; o trecho `TRC-clipboard.cut` escreve a seleção pela store.
- G7: n/a — a porta não muda o documento; só entrega o comando `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`.
- INT: n/a — a porta não escreve no documento; a integridade é do trecho `fluxos/trechos/TRC-clipboard.cut.md`.

## Limpeza
- nenhum ouvinte, timer ou observador é criado neste caminho; `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` não abre nenhum, e não há remoção a citar.

## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-clipboard.cut
- **Argumentos enviados:** nenhum campo — `manifest/commands/clipboard.json:235` `"args": {},`; a porta `key-ctrl-x-in-global` também declara `manifest/commands/clipboard.json:271` `"args": {}`, então o tratador recebe só o contexto.
- nenhum ramo do trecho depende de um valor de argumento: `TRC-clipboard.cut` declara que nenhum ramo muda com um valor de argumento, e o tratador `src/core/clipboard/clipboard.ts:104` `export const cutCommand = registerHandler('clipboard.cut', (context): Outcome<never> => {` não decide por valor de argumento.
