# ENT-P-nodes-0005 — layers.startRename pela porta layers.startRename#key-f2-in-layers-tree

Fluxo de porta do domínio `nodes`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-layers.startRename`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta do atalho F2 despacha o comando com o id da ligação e os argumentos (o Início da porta).
2. `src/editor/input/keymap.ts:526` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto aberto e sem rajada de letras, o despacho é `store.dispatch`, o da store do editor.
3. `src/editor/input/keymap.ts:477` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a ligação de F2 na cadeia do contexto `layers-tree`.
4. `src/editor/input/keymap.ts:180` `if (!(sameCommand || keyOfField)) {` — o foco está numa linha de Camadas, cujo controle é a porta de outro comando; os argumentos que a linha carrega são lidos aqui.
5. `src/editor/input/keymap.ts:191` `return typeof stands[HANDLE_ARG] === 'string' && HANDLE_ARG in entry.command.args ? { ...handed, [HANDLE_ARG]: stands[HANDLE_ARG] } : handed;` — o comando não toma um nó nem uma alça, então `handed` é o objeto vazio e a porta não acrescenta argumento.
6. `src/editor/input/keymap.ts:527` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos da ligação; sem nenhum do lugar, `given` leva só os do manifesto.
7. `src/editor/input/keymap.ts:528` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — o atalho não tem gesto `src/editor/input/keymap.ts:476` `const held = bindingIn(chain, chordOf(event)) === null ? heldKeyBindingIn(chain, event) : null;`, então `args` são os de `given`.
8. `src/editor/input/keymap.ts:531` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — o comando não tem argumento do tipo `clipboard`, então `clipboard` é `undefined`.
9. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
10. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — `layers.startRename` não é undoable (`manifest/commands/nodes.json:21` `"undoable": false`), então `changesDocument` é falso.
11. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente de outro campo é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
12. `src/editor/store.ts:236` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
13. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
14. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
15. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
16. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
17. `src/app/commands.ts:334` `'layers.startRename': startRename,` — a linha da Chamada do trecho: o tratador único do comando.

## Ramos
- R1 `src/editor/input/keymap.ts:138` `if (named && (manifest.interactions.keyContexts as readonly { id: string }[]).some((k) => k.id === named)) return named as KeyContextId;` — a árvore de Camadas nomeia o contexto `layers-tree` (`src/editor/shell/sidebar/layers.tsx:570` `<div role="tree" aria-label={t(panelName('layers'))} data-region="layers-tree" data-key-context="layers-tree" className="layers-tree" ref={scroller} onFocusCapture={onFocusIn}>`); fora dela o contexto seria outro.
- R2 `src/editor/input/keymap.ts:477` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — há uma ligação para F2 na cadeia do contexto `layers-tree`; sem ligação, `binding` seria `null` e o caminho pararia.
- R3 `src/editor/input/keymap.ts:506` `if (!shortcutRunsNow(binding)) return;` — o comando construído e a feature `layers-keyboard-navigation` registrada: a tecla roda; caso contrário, não passa daqui.
- R4 `src/editor/input/keymap.ts:188` `if (entry.door.kind === 'shortcut' && control.getAttribute('data-key-context') === entry.door.context) return Object.fromEntries(Object.entries(stands).filter(([name]) => name in entry.command.args));` — a linha não nomeia o contexto da tecla, então o caminho não passa por aqui; passaria se o controle fosse ele mesmo o contexto da tecla.
- R5 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, entraria na fila `waiting` (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- `src/editor/input/keymap.ts:587` `target.addEventListener('keydown', onKeyDown);` — o ouvinte de teclado (entrada ENT-L05a-0028) entrega a tecla; entre a tecla e o despacho não há await, timer nem quadro, e o despacho é síncrono `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-layers.startRename`

## Resultado
- **Estado final:** EST-L01-037 — `ui.rename.node` passa a nomear o nó pelo trecho `TRC-layers.startRename` (`src/editor/layers/rename.ts:51` `return { kind: 'change', ui: { ...shown, rename: { node: only } } };`).
- **Re-renderizado:** todo assinante da store é chamado pelo trecho (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha do nó passa a desenhar o campo de nome (`src/editor/shell/sidebar/layers.tsx:307` `{renaming ? (`).
- **DOM do canvas:** nada muda — o rótulo segue com o mesmo nome (`src/editor/canvas/chrome.tsx:1014` `<span className="chrome__name">{node.name}</span>`).

## Regras
- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` e o trecho só move `ui.rename`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta chega à tabela `src/app/commands.ts:334` `'layers.startRename': startRename,` e envia só a intenção.
- G4: n/a — a porta não desenha elemento algum sobre o canvas (`src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G5: n/a — a porta não desenha nem mede painel, barra ou rótulo (`src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G6: n/a — o comando não escreve a seleção (`src/app/commands.ts:334` `'layers.startRename': startRename,`).
- G7: n/a — o comando não muda o documento (`src/app/commands.ts:334` `'layers.startRename': startRename,`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- Nenhum ouvinte, timer ou observador é criado nesta porta; o despacho não cria nenhum `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);`. O ouvinte que entrega o evento é de outra entrada e não é criado nem removido aqui.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-layers.startRename
- **Argumentos enviados:** nenhum — a porta entrega o objeto vazio (`manifest/commands/nodes.json:131` `"args": {}`), o mesmo que o comando declara (`manifest/commands/nodes.json:9` `"args": {},`). A linha de Camadas carrega `{ target: node.id }` (`src/editor/shell/sidebar/layers.tsx:313` `data-args={JSON.stringify({ target: node.id })}`), mas o comando não toma esse argumento (`src/editor/input/keymap.ts:190` `const handed = typeof node === 'string' && entry.command.args.target?.type === 'node' ? { target: node } : {};`).
- Nenhum ramo do trecho depende dos argumentos: o trecho declara que os ramos (R1 a R5) dependem do estado — a seleção, o nó que ela nomeia e o bloqueio —, e `layers.startRename` não tem argumento.
