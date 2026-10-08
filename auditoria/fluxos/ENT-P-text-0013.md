# ENT-P-text-0013 — text.toggleBold pela porta text.toggleBold#toolbar-text-toolbar-bold

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.toggleBold`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — o botão da barra de texto despacha a porta. O `dispatch` é ligado em `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`, e os argumentos são montados em `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`.
2. `src/editor/store.ts:232` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:233` `      const changesDocument = UNDOABLE.get(id) === true;` — `text.toggleBold` não é desfazível (`manifest/commands/text.json:346` `      "undoable": false`), então `changesDocument` é `false`.
4. `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é respondida antes de o comando rodar.
5. `src/editor/store.ts:235` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState].
6. `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca o comando na tabela (`wiring().commands`).
9. `src/app/commands.ts:434` `  'text.toggleBold': toggleBold,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.toggleBold`).

## Ramos
- R1 `src/editor/doors/door.tsx:99` `    if (files !== undefined) {` — o comando não declara um argumento de tipo `files`, então `files` é `undefined` e o ramo do escolhedor de vários arquivos não é tomado.
- R2 `src/editor/doors/door.tsx:110` `    if (clipboard !== undefined) {` — o comando não declara um argumento de tipo `clipboard`, então `clipboard` é `undefined` e o ramo da leitura da área de transferência não é tomado.
- R3 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não declara um argumento de tipo `file`, então `file` é `undefined` e o caminho segue para a linha 144.
- R4 `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, o despacho vai pelo gesto (`src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`).
- R5 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — um botão cujo comando não está construído ou cuja disponibilidade não se sustenta não despacha; com a edição aberta o botão da barra de texto despacha.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:434`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (via argumentRefusal do trecho), EST-L01-031 (via getState), EST-L01-037 (via getState), EST-L05a-001 (via beforeCommand)
- escreve: nenhum — a gravação entra no trecho `TRC-text.toggleBold`

## Resultado
- **Estado final:** EST-L01-037 com `ui.textEdit.changes` uma unidade maior e `ui.textEdit.change` igual a `{ kind: 'mark', mark: 'strong' }`, pelo trecho `TRC-text.toggleBold` (`src/editor/canvas/text-edit.ts:135` `  withEdit(ui, { ...ui.textEdit, changes: ui.textEdit.changes + 1, change, linkPrompt });`); em R1 do trecho o estado fica como estava.
- **Re-renderizado:** todo assinante da store, pelo trecho (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o botão Bold passa a estar `is-current` quando a seleção está a negrito, pelo trecho; nada mais muda.
- **DOM do canvas:** o renderizador aplica a marca ao texto selecionado e o redesenha, pelo trecho (`src/editor/canvas/frame.tsx:155` `  renderer.showEdited(after.runs, after.range);`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:135` `  withEdit(ui, { ...ui.textEdit, changes: ui.textEdit.changes + 1, change, linkPrompt });`.
- G2: ok `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é respondida antes (o registro é `src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando) e o tratador único decide; as duas portas do manifesto chamam a mesma linha `src/app/commands.ts:434` `  'text.toggleBold': toggleBold,`.
- G4: n/a — a porta é um botão da barra de texto, não um ponto do canvas `manifest/commands/text.json:371` `      "kind": "toolbar",`.
- G5: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a barra de texto desenha os próprios botões e nenhum rótulo fica cortado, medido na Fase 6.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/doors/door.tsx:144`.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar (no trecho).

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:434`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-text.toggleBold
- **Argumentos enviados:** `{}` — o comando não declara argumentos (`manifest/commands/text.json:338` `      "args": {}`) e a porta do botão também não (`manifest/commands/text.json:389` `          "args": {}`).
- nenhum — o trecho não lista ramo que dependa dos argumentos, porque o comando não tem argumentos (`auditoria/fluxos/trechos/TRC-text.toggleBold.md`, campo `Ramos que dependem dos argumentos`).
