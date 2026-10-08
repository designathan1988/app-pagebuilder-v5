# ENT-P-text-0017 — text.editLink pela porta text.editLink#toolbar-text-toolbar-link

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.editLink`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — o botão da barra de texto despacha a porta. O `dispatch` é ligado em `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`, e os argumentos são montados em `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`.
2. `src/editor/store.ts:221` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:222` `      const changesDocument = UNDOABLE.get(id) === true;` — `text.editLink` não é desfazível (`manifest/commands/text.json:474` `      "undoable": false`), então `changesDocument` é `false`.
4. `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é respondida antes de o comando rodar.
5. `src/editor/store.ts:224` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState].
6. `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca o comando na tabela (`wiring().commands`).
9. `src/app/commands.ts:436` `  'text.editLink': editLink,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.editLink`).

## Ramos
- R1 `src/editor/doors/door.tsx:99` `    if (files !== undefined) {` — o comando não declara um argumento de tipo `files`, então `files` é `undefined` e o ramo do escolhedor de vários arquivos não é tomado.
- R2 `src/editor/doors/door.tsx:110` `    if (clipboard !== undefined) {` — o comando não declara um argumento de tipo `clipboard`, então `clipboard` é `undefined` e o ramo da leitura da área de transferência não é tomado.
- R3 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não declara um argumento de tipo `file`, então `file` é `undefined` e o caminho segue para a linha 144.
- R4 `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, o despacho vai pelo gesto (`src/editor/store.ts:227` `      else if (!changesDocument) result = open.dispatch(id, args);`).
- R5 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — um botão cujo comando não está construído ou cuja disponibilidade não se sustenta não despacha; com a edição aberta o botão da barra de texto despacha.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:436`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (via argumentRefusal do trecho), EST-L01-031 (via getState), EST-L01-037 (via getState), EST-L05a-001 (via beforeCommand)
- escreve: nenhum — a gravação entra no trecho `TRC-text.editLink`

## Resultado
- **Estado final:** no ramo do prompt, EST-L01-037 com `ui.textEdit.linkPrompt` igual a `{ count, dismissals }`, pelo trecho `TRC-text.editLink` (`src/editor/canvas/text-edit.ts:157` `  return { kind: 'change', ui: withEdit(state.ui, { ...edit, linkPrompt }), message: message('status.link.asking') };`).
- **Re-renderizado:** todo assinante da store, pelo trecho (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra `status.link.asking` e o prompt do endereço é desenhado sobre o canvas, pelo trecho.
- **DOM do canvas:** no ramo do endereço (que o prompt roda fora desta porta), o renderizador aplica o endereço ao texto selecionado, pelo trecho (`src/editor/canvas/frame.tsx:155` `  renderer.showEdited(after.runs, after.range);`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:162` `  return { kind: 'change', ui: changed(state.ui, { kind: 'link', href: address === '' ? null : keptHref(address) }, null), message: message('status.textEdit.editing') };`.
- G2: ok `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é respondida antes (o registro é `src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando, sem o endereço) e o tratador único decide; as portas do manifesto e o próprio prompt chamam a mesma linha `src/app/commands.ts:436` `  'text.editLink': editLink,`.
- G4: n/a — a porta é um botão da barra de texto, não um ponto do canvas `manifest/commands/text.json:499` `      "kind": "toolbar",`.
- G5: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a barra de texto desenha os próprios botões e nenhum rótulo fica cortado, medido na Fase 6.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/doors/door.tsx:144`.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar (no trecho).

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:436`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-text.editLink
- **Argumentos enviados:** `{}` — a porta do botão declara `{}` (`manifest/commands/text.json:517` `          "args": {}`), sem o endereço.
- R2 `src/editor/canvas/text-edit.ts:155` `  if (href === undefined) {` — `href` ausente é o lado desta porta: o prompt do endereço abre (o comando roda de novo com `href`, fora desta porta).
- R3 `src/editor/canvas/text-edit.ts:160` `  if (address !== '' && !isSafeHref(address)) return { kind: 'refused', message: message('status.link.unsafe') };` — o endereço digitado no prompt é quem faz este caminho passar; esta porta não envia endereço, então não toma nem um lado nem o outro.
