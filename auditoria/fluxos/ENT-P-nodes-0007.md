# ENT-P-nodes-0007 — layers.cancelRename pela porta layers.cancelRename#key-escape-in-rename-field

Fluxo de porta do domínio `nodes`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-layers.cancelRename`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta do atalho Escape despacha o comando com o id da ligação e os argumentos (o Início da porta).
2. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto aberto e sem rajada de letras, o despacho é `store.dispatch`, o da store do editor.
3. `src/editor/input/keymap.ts:476` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a ligação de Escape na cadeia do contexto `rename-field`.
4. `src/editor/input/keymap.ts:176` `const keyOfField = entry.door.kind === 'shortcut' && ownContext !== null && entry.door.context === ownContext;` — o foco é o campo de renomear, que nomeia o próprio contexto (`src/editor/shell/sidebar/layers.tsx:99` `data-key-context="rename-field"`), o mesmo da ligação.
5. `src/editor/input/keymap.ts:196` `const own = sameCommand ? args : Object.fromEntries(Object.entries(args).filter(([name]) => name in takes));` — o comando não toma argumento, então `own` é o objeto vazio.
6. `src/editor/input/keymap.ts:199` `return field !== null && into !== undefined ? { ...own, [into]: field.value } : own;` — nenhum argumento de texto, então devolve `own`, o objeto vazio.
7. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos da ligação; sem nenhum do lugar, `given` leva só os do manifesto.
8. `src/editor/input/keymap.ts:527` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — o atalho não tem gesto `src/editor/input/keymap.ts:475` `const held = bindingIn(chain, chordOf(event)) === null ? heldKeyBindingIn(chain, event) : null;`, então `args` são os de `given`.
9. `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — o comando não tem argumento do tipo `clipboard`, então `clipboard` é `undefined`.
10. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
11. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `layers.cancelRename` não é undoable (`manifest/commands/nodes.json:169` `"undoable": false`), então `changesDocument` é falso.
12. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente de outro campo é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
13. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
14. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
15. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
16. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
17. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
18. `src/app/commands.ts:335` `'layers.cancelRename': cancelRename,` — a linha da Chamada do trecho: o tratador único do comando.

## Ramos
- R1 `src/editor/input/keymap.ts:133` `if (own && (manifest.interactions.keyContexts as readonly { id: string }[]).some((k) => k.id === own)) return own as KeyContextId;` — o campo de renomear nomeia o contexto `rename-field`, o da porta; sem esse atributo o contexto seria `field`.
- R2 `src/editor/input/keymap.ts:399` `if (event.key === 'Escape' && store.getState().ui.dialog !== undefined && store.getState().confirmation === null) {` — sem diálogo aberto (`ui.dialog` ausente enquanto o campo de renomear está em curso) o Escape modal não é tomado; com um diálogo, ele seguiria por aqui.
- R3 `src/editor/input/keymap.ts:192` `if (control.getAttribute('aria-disabled') === 'true') return null;` — o campo de renomear não se marca indisponível, então o caminho segue; marcado, nada correria.
- R4 `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — o comando construído e a feature `rename-element` registrada: a tecla roda; caso contrário, não passa daqui.
- R5 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- `src/editor/input/keymap.ts:586` `target.addEventListener('keydown', onKeyDown);` — o ouvinte de teclado (entrada ENT-L05a-0028) entrega a tecla; entre a tecla e o despacho não há await, timer nem quadro, e o despacho é síncrono `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-layers.cancelRename`

## Resultado
- **Estado final:** EST-L01-037 — `ui.rename.node` volta a `null` pelo trecho `TRC-layers.cancelRename` (`src/editor/layers/rename.ts:32` `const ended = (ui: EditorUi): EditorUi => (ui.rename.node === null ? ui : { ...ui, rename: INITIAL_RENAME });`).
- **Re-renderizado:** todo assinante da store é chamado pelo trecho (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha volta a desenhar o nome no lugar do campo (`src/editor/shell/sidebar/layers.tsx:319` `{node.name}`).
- **DOM do canvas:** nada muda — o rótulo segue com o mesmo nome (`src/editor/canvas/chrome.tsx:1014` `<span className="chrome__name">{node.name}</span>`).

## Regras
- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` e o trecho só move `ui.rename`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o Esc do próprio campo é a exceção da especificação e a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta chega à tabela `src/app/commands.ts:335` `'layers.cancelRename': cancelRename,` e envia só a intenção.
- G4: n/a — a porta não desenha elemento algum sobre o canvas (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G5: n/a — a porta não desenha nem mede painel, barra ou rótulo (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G6: n/a — o comando não escreve a seleção (`src/app/commands.ts:335` `'layers.cancelRename': cancelRename,`).
- G7: n/a — o comando não muda o documento (`src/app/commands.ts:335` `'layers.cancelRename': cancelRename,`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- Nenhum ouvinte, timer ou observador é criado nesta porta; o despacho não cria nenhum `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);`. O ouvinte que entrega o evento é de outra entrada e não é criado nem removido aqui.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-layers.cancelRename
- **Argumentos enviados:** nenhum — a porta entrega o objeto vazio (`manifest/commands/nodes.json:189` `"args": {}`), o mesmo que o comando declara (`manifest/commands/nodes.json:161` `"args": {},`).
- Nenhum ramo do trecho depende dos argumentos: o trecho declara que o único ramo (R1) depende do estado `ui.rename`, e `layers.cancelRename` não tem argumento.
