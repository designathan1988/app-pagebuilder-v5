# ENT-P-text-0010 — text.cancelEdit pela porta text.cancelEdit#key-escape-in-element-text-field

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:531` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.cancelEdit`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — o teclado despacha a porta do manifesto. O `dispatch` é ligado em `src/editor/input/keymap.ts:525` `    const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;`; sem gesto nem rajada, é `store.dispatch`, a store do editor.
2. `src/editor/input/keymap.ts:412` `    const focused = contextOf(event.target);` — o contexto do foco: o campo de texto do inspector nomeia o próprio contexto `element-text-field` (`src/editor/input/keymap.ts:132` `    const own = field ? target.getAttribute('data-key-context') : null;`).
3. `src/editor/input/keymap.ts:476` `    const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a porta `key-escape-in-element-text-field` é achada pelo acorde Escape no contexto `element-text-field` (`manifest/commands/text.json:277` `      "chord": "Escape",`).
4. `src/editor/input/keymap.ts:505` `    if (!shortcutRunsNow(binding)) return;` — a porta roda.
5. `src/editor/input/keymap.ts:514` `          : focusedArgs(event.target, binding);` — os argumentos da porta vêm do controle focado. O controle é um campo que nomeia o próprio contexto (o campo de texto do inspector), então `focusedArgs` atende pela chave do campo (`src/editor/input/keymap.ts:176` `  const keyOfField = entry.door.kind === 'shortcut' && ownContext !== null && entry.door.context === ownContext;`). [lê: EST-L01-037 via focusedArgs]
6. `src/editor/input/keymap.ts:196` `  const own = sameCommand ? args : Object.fromEntries(Object.entries(args).filter(([name]) => name in takes));` — os argumentos do controle são reduzidos aos nomes que o comando toma; `text.cancelEdit` não toma argumentos (`manifest/commands/text.json:262` `      "args": {}`), então `own` é `{}`.
7. `src/editor/input/keymap.ts:526` `    const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do campo e da porta da tecla são juntados; a porta declara `{}` (`manifest/commands/text.json:291` `          "args": {}`).
8. `src/editor/input/keymap.ts:530` `    const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `text.cancelEdit` não toma a área de transferência, então `clipboard` é `undefined` e o despacho é o da linha 531.
9. `src/editor/store.ts:232` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
10. `src/editor/store.ts:233` `      const changesDocument = UNDOABLE.get(id) === true;` — `text.cancelEdit` não é desfazível (`manifest/commands/text.json:270` `      "undoable": false`), então `changesDocument` é `false`.
11. `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é respondida antes; como o comando é do próprio campo e não muda o documento, `beforeCommand` devolve o contexto da digitação (`src/editor/input/pending.ts:79` `  if (typing.owns(id, (args ?? {}) as Readonly<Record<string, unknown>>)) return typing.context;`).
12. `src/editor/store.ts:235` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState].
13. `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
14. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
15. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca o comando na tabela (`wiring().commands`).
16. `src/app/commands.ts:432` `  'text.cancelEdit': cancelEdit,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.cancelEdit`).

## Ramos
- R1 `src/editor/input/keymap.ts:476` `    const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — Escape no contexto `element-text-field` casa a porta desta entrada; outro acorde casaria outra.
- R2 `src/editor/input/keymap.ts:468` `      if (history !== null && (history.command.id === undoCommand.command || history.command.id === redoCommand.command) && shortcutRunsNow(history)) {` — o ramo do histórico do campo só toma Ctrl+Z e Ctrl+Shift+Z; o acorde desta porta não casa, então o caminho desce até a linha 476.
- R3 `src/editor/input/keymap.ts:196` `  const own = sameCommand ? args : Object.fromEntries(Object.entries(args).filter(([name]) => name in takes));` — o controle é de outro comando (o campo é da porta `inspector-text`, de `text.set`), então os argumentos são reduzidos aos nomes de `text.cancelEdit`, que não tem nenhum: `own` é `{}`; um controle do próprio comando enviaria o que ele representa.
- R4 `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, o despacho vai pelo gesto (`src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/keymap.ts:531` a `src/app/commands.ts:432`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (via argumentRefusal do trecho), EST-L01-031 (via getState), EST-L01-037 (via focusedArgs e getState), EST-L05a-001 (via beforeCommand)
- escreve: nenhum — a gravação entra no trecho `TRC-text.cancelEdit`

## Resultado
- **Estado final:** em R2 do trecho, EST-L01-037 com `ui.textEdit.node` nulo por `src/editor/canvas/text-edit.ts:69` `const ended = (ui: EditorUi): EditorUi => (ui.textEdit.node === null ? ui : withEdit(ui, { ...ui.textEdit, node: null, linkPrompt: null }));`; em R1a do trecho nada muda e em R1b só a mensagem muda.
- **Re-renderizado:** todo assinante da store, pelo trecho `TRC-text.cancelEdit` (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra a mensagem, pelo trecho (`src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),`).
- **DOM do canvas:** em R2 do trecho o elemento editado deixa de ser editável e volta ao texto do documento (`src/editor/canvas/frame.tsx:126` `  renderer.editText(store.getState().document, edit.node, TEXT_EDITING);`); em R1a e R1b nada muda.

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:116` `  return { kind: 'change', ui: ended(state.ui), message: message('status.textEdit.cancelled', { name: locate(state.document, node)?.node.name ?? '' }) };`.
- G2: ok `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é respondida antes (o registro é `src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta envia só a intenção (o id do comando e os argumentos vazios) e o tratador único decide; a porta do manifesto chama a mesma linha `src/app/commands.ts:432` `  'text.cancelEdit': cancelEdit,`.
- G4: n/a — a porta é uma tecla no campo do inspector, não um ponto do canvas `manifest/commands/text.json:275` `      "kind": "shortcut",`.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/editor/input/keymap.ts:531`; as famílias de defeito de painel são medidas na Fase 6.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/input/keymap.ts:531`.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar (no trecho).

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/input/keymap.ts:531` e `src/app/commands.ts:432`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-text.cancelEdit
- **Argumentos enviados:** `{}` — o comando não declara argumentos (`manifest/commands/text.json:262` `      "args": {}`) e os do controle são reduzidos aos nomes que o comando toma (`src/editor/input/keymap.ts:196` `  const own = sameCommand ? args : Object.fromEntries(Object.entries(args).filter(([name]) => name in takes));`).
- nenhum — o trecho não lista ramo que dependa dos argumentos, porque o comando não tem argumentos (`auditoria/fluxos/trechos/TRC-text.cancelEdit.md`, campo `Ramos que dependem dos argumentos`).
