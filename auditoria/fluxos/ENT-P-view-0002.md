# ENT-P-view-0002

- **Porta:** ENT-P-view-0002 — view.zoomIn pela porta key-ctrl-plus-in-global
- **Comando:** view.zoomIn
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Trecho:** `TRC-view.zoomIn`

## Passos

1. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta do atalho despacha o comando com o id da ligação e os seus argumentos.
2. `src/editor/input/keymap.ts:476` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a ligação da tecla na cadeia de contextos.
3. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — fora de um gesto e de uma rajada, o despacho usado é o da store do editor.
4. `src/editor/input/keymap.ts:527` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — os argumentos da ligação; sem gesto no atalho, são os do objeto vazio.
5. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho da porta.
6. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — o comando não é reversível no manifesto, então `changesDocument` é falso.
7. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, salvo com o foco dentro do próprio campo. [lê: EST-L05a-001 via beforeCommand] [escreve: EST-L05a-001 via keepTyping]
8. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — o estado do editor que a digitação edita, quando há digitação pendente. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
9. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o comando vai à store do núcleo.
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
12. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — a função que roda um comando.
13. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
14. `src/app/commands.ts:439` `'view.zoomIn': zoomIn,` — a entrada da tabela é o tratador; o trecho segue daqui.

## Ramos

- R1 `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — o comando não tem argumento do tipo `clipboard`, então `clipboard` é `undefined` e o caminho segue para `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`; o lado que espera a área de transferência (o `else`) não é tomado.
- R2 `src/editor/input/keymap.ts:476` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a tecla resolve a porta do atalho pela cadeia de contextos; há uma ligação para a porta desta entrada.
- R3 `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto aberto e sem rajada de letras, `dispatch` é `store.dispatch`; com um gesto aberto, seria a do gesto.
- R4 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o caminho vai à store do núcleo; com um gesto aberto e `changesDocument` falso `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;`, iria pela do gesto.
- R5 `src/core/store/store.ts:400` `const entry = table[id];` — o id é um comando do manifesto, então a tabela sempre devolve a entrada `src/app/commands.ts:439` `'view.zoomIn': zoomIn,`.

## Fronteiras assíncronas

- `src/editor/input/keymap.ts:586` `target.addEventListener('keydown', onKeyDown);` — o ouvinte de teclado (entrada ENT-L05a-0028) entrega a tecla que roda a porta; entre a tecla e o despacho não há await, timer nem quadro, e o despacho é síncrono `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.

## Estado

- lê: EST-L01-031 (a seleção, via editedKey), EST-L01-037 (o estado do editor, via editedKey), EST-L05a-001
- escreve: EST-L05a-001

## Resultado

- **Estado final:** inalterado por esta porta; o comando foi entregue ao tratador `src/app/commands.ts:439` `'view.zoomIn': zoomIn,`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho.
- **DOM do editor:** nada muda por esta porta `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras

- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` e o tratador só move o zoom.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`.
- G3: ok — a porta chega à tabela `src/app/commands.ts:439` `'view.zoomIn': zoomIn,` e envia só a intenção, os argumentos da porta.
- G4: n/a — a porta não desenha elemento algum sobre o canvas `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- G5: n/a — a porta não desenha nem mede painel, barra ou rótulo `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- G6: n/a — o comando não escreve a seleção.
- G7: n/a — o comando não muda o documento.
- INT: n/a — a porta não toca o documento; a integridade é a do trecho `src/app/commands.ts:439` `'view.zoomIn': zoomIn,`.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado nesta porta; o despacho não cria nenhum `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);`. O ouvinte que entrega o evento é de outra entrada e não é criado nem removido aqui.

## Medições

- MED-0001 — a largura e a borda esquerda do palco, de que o passo do zoom depende; valor medido no trecho, na Fase 6.

## Ramos do trecho

- **Trecho:** `TRC-view.zoomIn`
- **Argumentos enviados:** nenhum campo: a porta envia o objeto vazio `manifest/commands/view.json:9` `"args": {},`.
- Nenhum ramo do trecho depende dos argumentos: o trecho declara que nenhum ramo muda com um valor de argumento, e o tratador `src/editor/view/camera.ts:95` `export const zoomIn = registerHandler<'view.zoomIn', EditorUi>('view.zoomIn', ({ state }) => step(state, STEP));` não decide pelo valor.
