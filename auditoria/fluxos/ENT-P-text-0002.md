# ENT-P-text-0002 — text.startEdit pela porta text.startEdit#key-enter-in-canvas

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:531` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.startEdit`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — o teclado despacha a porta do manifesto. O `dispatch` é ligado em `src/editor/input/keymap.ts:525` `    const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;`; sem gesto de ponteiro aberto nem rajada de letras, é `store.dispatch`, a store do editor.
2. `src/editor/input/keymap.ts:411` `    const gesture = openGesture(store);` — o gesto aberto é lido; é nulo, então o teclado segue pelas portas do manifesto.
3. `src/editor/input/keymap.ts:412` `    const focused = contextOf(event.target);` — o contexto do foco: depois de um press no canvas o foco repousa no corpo da página, então é `canvas` (`src/editor/input/keymap.ts:130` `    if (target === target.ownerDocument.body) return 'canvas';`).
4. `src/editor/input/keymap.ts:476` `    const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a porta `key-enter-in-canvas` é achada pelo acorde Enter no contexto `canvas` (`manifest/commands/text.json:51` `      "context": "canvas",`).
5. `src/editor/input/keymap.ts:505` `    if (!shortcutRunsNow(binding)) return;` — a porta roda (o comando está construído e a funcionalidade presente).
6. `src/editor/input/keymap.ts:514` `          : focusedArgs(event.target, binding);` — os argumentos da porta: o foco (o corpo da página) não é um controle com `data-door`, então `focusedArgs` devolve `{}` (`src/editor/input/keymap.ts:178` `  if (!control || !drawn) return {};`). [lê: EST-L01-037 via focusedArgs]
7. `src/editor/input/keymap.ts:526` `    const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do campo e da porta da tecla são juntados; a porta declara `{}` (`manifest/commands/text.json:64` `          "args": {}`).
8. `src/editor/input/keymap.ts:530` `    const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `text.startEdit` não toma a área de transferência, então `clipboard` é `undefined` e o despacho é o da linha 531.
9. `src/editor/store.ts:232` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
10. `src/editor/store.ts:233` `      const changesDocument = UNDOABLE.get(id) === true;` — lê-se da tabela `UNDOABLE` (do manifesto) se o comando muda o documento; `text.startEdit` não é desfazível, então `changesDocument` é `false`.
11. `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente de um campo é respondida antes de o comando rodar.
12. `src/editor/store.ts:235` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState] a digitação pendente e o estado da store do editor.
13. `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
14. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
15. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca o comando na tabela (`wiring().commands`).
16. `src/app/commands.ts:430` `  'text.startEdit': startEdit,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.startEdit`).

## Ramos
- R1 `src/editor/input/keymap.ts:487` `    if (!binding) return;` — nenhum acorde do contexto casa: nada roda; Enter no contexto `canvas` casa a porta desta entrada, então o caminho segue.
- R2 `src/editor/input/keymap.ts:504` `    if (inBurst && binding.door.kind === 'shortcut' && !FIELDS.includes(focused) && context !== TEXT_EDITING) return;` — uma tecla de letra dentro de uma rajada não roda como atalho; Enter não é letra, então este ramo não apara esta porta.
- R3 `src/editor/input/keymap.ts:505` `    if (!shortcutRunsNow(binding)) return;` — com o comando construído e a funcionalidade presente, a porta roda; sem eles, o teclado para aqui.
- R4 `src/editor/input/keymap.ts:515` `    if (own === null) return;` — `own` nulo para quando o foco está num controle indisponível; para o corpo da página `own` é `{}` e o caminho segue.
- R5 `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:243` `        waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/keymap.ts:531` a `src/app/commands.ts:430`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (via argumentRefusal do trecho), EST-L01-031 (via getState), EST-L01-037 (via focusedArgs e getState), EST-L05a-001 (via beforeCommand)
- escreve: nenhum — a gravação entra no trecho `TRC-text.startEdit`

## Resultado
- **Estado final:** EST-L01-037 com `ui.textEdit.node` igual ao id do texto, pelo trecho `TRC-text.startEdit` (`src/editor/canvas/text-edit.ts:104` `  return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, node: node.id }), message: message('status.textEdit.editing') };`); numa recusa do trecho o estado do editor fica como estava.
- **Re-renderizado:** todo assinante da store, pelo trecho `TRC-text.startEdit` (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a moldura deixa de ser `aria-hidden` enquanto a edição dura, pelo trecho (`src/editor/canvas/frame.tsx:264` `      aria-hidden={editing ? undefined : true}`).
- **DOM do canvas:** o renderizador marca o elemento editado como editável e o foca, pelo trecho (`src/editor/canvas/frame.tsx:126` `  renderer.editText(store.getState().document, edit.node, TEXT_EDITING);`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:104` `  return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, node: node.id }), message: message('status.textEdit.editing') };`.
- G2: ok `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar.
- G3: ok `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta envia só a intenção (o id do comando e os argumentos) e o tratador único decide; as três portas do manifesto chamam a mesma linha `src/app/commands.ts:430` `  'text.startEdit': startEdit,`.
- G4: ok `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — a ação é um Enter no canvas; a barra lateral ocupa a própria coluna (`src/editor/workspace/narrow.ts`), medida na Fase 6.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/editor/input/keymap.ts:531`; as famílias de defeito de painel são medidas na Fase 6.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/input/keymap.ts:531`.
- G7: n/a — o caminho da porta não altera o documento `src/editor/input/keymap.ts:531`.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar (no trecho).

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/input/keymap.ts:531` e `src/app/commands.ts:430`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-text.startEdit
- **Argumentos enviados:** `{}` — `focusedArgs` devolve `{}` para o corpo da página e a porta declara `{}` (`src/editor/input/keymap.ts:178` `  if (!control || !drawn) return {};`).
- nenhum — o trecho não lista ramo que dependa dos argumentos, porque o comando não tem argumentos (`auditoria/fluxos/trechos/TRC-text.startEdit.md`, campo `Ramos que dependem dos argumentos`).
