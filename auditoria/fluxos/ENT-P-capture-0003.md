# ENT-P-capture-0003 — capture.edit pela porta capture.edit#key-enter-in-captured-value

Fluxo de porta do domínio `capture`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:531` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-capture.edit`, que segue daqui. A tecla é `manifest/commands/capture.json:121` `"chord": "Enter",` no contexto `manifest/commands/capture.json:122` `"context": "captured-value",`, que o campo da captura nomeia `src/editor/shell/captured-inspector.tsx:74` `{['text', 'attribute', 'insert'].includes(operation) && <label>{t('capture.editor.value')}<textarea data-door={VALUE.ref} data-key-context="captured-value" data-args={JSON.stringify({ target: node.id, operation, name, parent, index })} value={value} onChange={(event) => setValue(event.currentTarget.value)} /></label>}`.

## Passos
1. `src/editor/input/keymap.ts:476` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a ligação da tecla Enter no contexto do campo.
2. `src/editor/input/keymap.ts:514` `: focusedArgs(event.target, binding);` — os argumentos que os campos ligados à porta entregam (o `data-args` do campo e o texto que ele mostra).
3. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto nem rajada de letras, `dispatch` é o `store.dispatch` da store do editor.
4. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos da ligação; a porta declara `"args": {}`.
5. `src/editor/input/keymap.ts:527` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — sem gesto no atalho, `args` é o `given`.
6. `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `capture.edit` não tem argumento do tipo `clipboard`, então `clipboard` é `undefined`.
7. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta do atalho despacha o comando com o id da ligação e os seus argumentos; é o Início da porta.
8. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
9. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `capture.edit` é desfazível (`manifest/commands/capture.json:58` `"undoable": true,`), então `changesDocument` é `true`.
10. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar. [lê: EST-L05a-001 via beforeCommand]
11. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
12. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch]
13. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
14. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
15. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id (`src/app/commands.ts:217` `'capture.edit': editCaptureCommand,`).
16. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. [lê: EST-L01-030 via argumentRefusal]
17. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-capture.edit`).

## Ramos
- R1 `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `capture.edit` não tem argumento do tipo `clipboard`, então o caminho segue para a linha 531; o lado que espera a área de transferência (`src/editor/input/keymap.ts:532` `else if (gesture === null) void readClipboard().then((content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`) não é tomado.
- R2 `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto e sem rajada de letras, o despacho é o da store do editor; com um gesto aberto, seria o do gesto.
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo; com um gesto aberto e um comando que muda o documento, entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R4 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — argumentos dentro da declaração do manifesto: o caminho segue ao tratador; fora dela: o despacho para na recusa.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/keymap.ts:531` a `src/core/store/store.ts:413`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L01-030 (via argumentRefusal), EST-L01-031 (via getState e editedKey), EST-L01-037 (via getState e editedKey)
- escreve: EST-L01-030 (a gravação efetiva entra no trecho `TRC-capture.edit`)

## Resultado
- **Estado final:** inalterado por esta porta; o tratador do trecho `TRC-capture.edit` troca a raiz da captura da página.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-capture.edit`.
- **DOM do editor:** nada muda por esta porta `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta envia só a intenção (o id e os argumentos) e o tratador único decide.
- G4: n/a — a porta é uma tecla de um campo do painel de captura, não um ponto do canvas (`manifest/commands/capture.json:119` `"kind": "shortcut",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/input/keymap.ts:531` e `src/core/store/store.ts:413`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-capture.edit
- **Argumentos enviados:** `{ target, operation, name, value, parent, index }` — o teclado lê o `data-args` do campo e acrescenta o texto que ele mostra (`src/editor/input/keymap.ts:514` `: focusedArgs(event.target, binding);`) e a porta declara `manifest/commands/capture.json:135` `"args": {}`. Este campo só existe para as operações `text`, `attribute` e `insert` (`src/editor/shell/captured-inspector.tsx:74` `{['text', 'attribute', 'insert'].includes(operation) && <label>{t('capture.editor.value')}<textarea data-door={VALUE.ref} data-key-context="captured-value" data-args={JSON.stringify({ target: node.id, operation, name, parent, index })} value={value} onChange={(event) => setValue(event.currentTarget.value)} /></label>}`).
- R1 `src/core/capture/edits.ts:76` `if (found === null) return { kind: 'refused', message: message('status.capture.nodeMissing') };` — o lado falso: `target` é o nó escolhido (`node.id`), que a captura da página tem, então `found` existe.
- R3 `src/core/capture/edits.ts:80` `if (operation === 'text') {` — o lado verdadeiro quando a operação do formulário é `text`; falso nas outras.
- R4 `src/core/capture/edits.ts:81` `if (found.node.kind !== 'text' || typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — depende de `value`: nó de texto com `value` textual segue; outra combinação recusa.
- R5 `src/core/capture/edits.ts:87` `} else if (operation === 'attribute') {` — o lado verdadeiro quando a operação é `attribute`; falso nas outras.
- R6 `src/core/capture/edits.ts:88` `if (found.node.kind !== 'element' || typeof name !== 'string' || !NAME.test(name) || typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — depende de `name` e de `value`: nó elemento com `name` na gramática e `value` textual segue; outra combinação recusa.
- R7 `src/core/capture/edits.ts:89` `if (unsafeCapturedAttribute(found.node.tag, { name, value })) return { kind: 'refused', message: message('status.capture.unsafeEdit') };` — depende de `name` e de `value`: atributo executável ou endereço inseguro recusa; seguro escreve o atributo.
- R8 `src/core/capture/edits.ts:96` `} else if (operation === 'remove') {` — o lado falso, porque este campo não existe para a operação `remove`.
- R10 `src/core/capture/edits.ts:99` `} else if (operation === 'insert' || operation === 'move') {` — o lado verdadeiro quando a operação é `insert`; falso em `move` (que este campo não oferece).
- R13 `src/core/capture/edits.ts:104` `if (operation === 'move') {` — o lado falso, porque este campo não oferece a operação `move`.
- R17 `src/core/capture/edits.ts:121` `} else return { kind: 'refused', message: message('status.capture.invalidEdit') };` — o lado falso, porque a operação é sempre um dos valores do enum.
- R11 `src/core/capture/edits.ts:100` `if (typeof parent !== 'string' || typeof index !== 'number' || !Number.isInteger(index) || index < 0) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — depende de `parent` e de `index`, que o formulário envia; fora dos tipos e do intervalo, recusa.
- R15 `src/core/capture/edits.ts:109` `if (typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — depende de `value`: textual analisa em `captureTree`; não textual recusa.
- R16 `src/core/capture/edits.ts:112` `if (body === undefined || body.children.length === 0) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — depende de `value`: sem corpo recusa; com filhos insere-os.
