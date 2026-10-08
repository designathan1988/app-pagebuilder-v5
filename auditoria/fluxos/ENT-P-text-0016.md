# ENT-P-text-0016 — text.editLink pela porta text.editLink#key-ctrl-k-in-text-editing

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:531` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.editLink`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — o teclado despacha a porta do manifesto. O `dispatch` é ligado em `src/editor/input/keymap.ts:525` `    const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;`; durante a edição do texto não há gesto nem rajada, então é `store.dispatch`, a store do editor.
2. `src/editor/input/keymap.ts:412` `    const focused = contextOf(event.target);` — o contexto do foco: o texto editado no quadro nomeia o próprio contexto, então é `text-editing`.
3. `src/editor/input/keymap.ts:476` `    const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a porta `key-ctrl-k-in-text-editing` é achada pelo acorde Ctrl+K no contexto `text-editing` (`manifest/commands/text.json:481` `      "chord": "Ctrl+K",`).
4. `src/editor/input/keymap.ts:505` `    if (!shortcutRunsNow(binding)) return;` — a porta roda.
5. `src/editor/input/keymap.ts:513` `          ? editArgs(store.getState(), binding.command)` — os argumentos da porta vêm da edição. [lê: EST-L01-030 via editArgs] [lê: EST-L01-037 via editArgs]
6. `src/editor/canvas/text-edit.ts:220` `  const names = Object.keys(command.args);` — `text.editLink` toma só `href` (`manifest/commands/text.json:459` `        "href": {`), e a edição só dá `target` e `content`, então `editArgs` devolve `{}` e o campo `href` fica ausente.
7. `src/editor/input/keymap.ts:526` `    const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos da edição e da porta da tecla são juntados; a porta declara `{}` (`manifest/commands/text.json:495` `          "args": {}`).
8. `src/editor/input/keymap.ts:530` `    const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `text.editLink` não toma a área de transferência, então `clipboard` é `undefined` e o despacho é o da linha 531.
9. `src/editor/store.ts:221` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
10. `src/editor/store.ts:222` `      const changesDocument = UNDOABLE.get(id) === true;` — `text.editLink` não é desfazível (`manifest/commands/text.json:474` `      "undoable": false`), então `changesDocument` é `false`.
11. `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é respondida antes de o comando rodar.
12. `src/editor/store.ts:224` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState].
13. `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
14. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
15. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca o comando na tabela (`wiring().commands`).
16. `src/app/commands.ts:436` `  'text.editLink': editLink,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.editLink`).

## Ramos
- R1 `src/editor/input/keymap.ts:487` `    if (!binding) return;` — nenhum acorde do contexto casa: nada roda; Ctrl+K no contexto `text-editing` casa a porta desta entrada.
- R2 `src/editor/input/keymap.ts:505` `    if (!shortcutRunsNow(binding)) return;` — com o comando construído, a porta roda; sem isso o teclado para aqui.
- R3 `src/editor/input/keymap.ts:515` `    if (own === null) return;` — `own` nulo quando o texto editado não guarda leitura; o texto presente deixa o caminho seguir com `{}`.
- R4 `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, o despacho vai pelo gesto (`src/editor/store.ts:227` `      else if (!changesDocument) result = open.dispatch(id, args);`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/keymap.ts:531` a `src/app/commands.ts:436`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (via editArgs e argumentRefusal do trecho), EST-L01-031 (via getState), EST-L01-037 (via editArgs e getState), EST-L05a-001 (via beforeCommand)
- escreve: nenhum — a gravação entra no trecho `TRC-text.editLink`

## Resultado
- **Estado final:** no ramo do prompt, EST-L01-037 com `ui.textEdit.linkPrompt` igual a `{ count, dismissals }`, pelo trecho `TRC-text.editLink` (`src/editor/canvas/text-edit.ts:157` `  return { kind: 'change', ui: withEdit(state.ui, { ...edit, linkPrompt }), message: message('status.link.asking') };`).
- **Re-renderizado:** todo assinante da store, pelo trecho (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra `status.link.asking` e o prompt do endereço é desenhado sobre o canvas, pelo trecho.
- **DOM do canvas:** no ramo do endereço (que o prompt roda fora desta porta), o renderizador aplica o endereço ao texto selecionado, pelo trecho (`src/editor/canvas/frame.tsx:155` `  renderer.showEdited(after.runs, after.range);`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:162` `  return { kind: 'change', ui: changed(state.ui, { kind: 'link', href: address === '' ? null : keptHref(address) }, null), message: message('status.textEdit.editing') };`.
- G2: ok `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é respondida antes (o registro é `src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta envia só a intenção (o id do comando, sem o endereço) e o tratador único decide; as portas do manifesto e o próprio prompt chamam a mesma linha `src/app/commands.ts:436` `  'text.editLink': editLink,`.
- G4: n/a — a porta é uma tecla no contexto do texto editado, não um ponto do canvas `manifest/commands/text.json:479` `      "kind": "shortcut",`.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/editor/input/keymap.ts:531`; as famílias de defeito de painel são medidas na Fase 6.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/input/keymap.ts:531`.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar (no trecho).

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/input/keymap.ts:531` e `src/app/commands.ts:436`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-text.editLink
- **Argumentos enviados:** `{}` — `href` não é enviado: `editArgs` só dá `target` e `content` (`src/editor/canvas/text-edit.ts:220` `  const names = Object.keys(command.args);`), e a porta da tecla declara `{}` (`manifest/commands/text.json:495` `          "args": {}`).
- R2 `src/editor/canvas/text-edit.ts:155` `  if (href === undefined) {` — `href` ausente é o lado desta porta: o prompt do endereço abre (o comando roda de novo com `href`, fora desta porta).
- R3 `src/editor/canvas/text-edit.ts:160` `  if (address !== '' && !isSafeHref(address)) return { kind: 'refused', message: message('status.link.unsafe') };` — o endereço digitado no prompt é quem faz este caminho passar; não permitido para na recusa e o prompt fica aberto; permitido segue. Esta porta em si não envia endereço, então não toma nem um lado nem o outro.
