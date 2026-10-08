# ENT-P-text-0003 — text.startEdit pela porta text.startEdit#command-bar

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.startEdit`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — o controle desenhado despacha a porta. O `dispatch` é ligado em `src/editor/doors/door.tsx:95` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`, e os argumentos são montados em `src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };`.
2. `src/editor/store.ts:233` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:234` `      const changesDocument = UNDOABLE.get(id) === true;` — `text.startEdit` não é desfazível, então `changesDocument` é `false`.
4. `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente de um campo é respondida antes de o comando rodar.
5. `src/editor/store.ts:236` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState] a digitação pendente e o estado da store do editor.
6. `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca o comando na tabela (`wiring().commands`).
9. `src/app/commands.ts:430` `  'text.startEdit': startEdit,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.startEdit`).

## Ramos
- R1 `src/editor/doors/door.tsx:100` `    if (files !== undefined) {` — o comando não declara um argumento de tipo `files`, então `files` é `undefined` e o ramo do escolhedor de vários arquivos não é tomado.
- R2 `src/editor/doors/door.tsx:111` `    if (clipboard !== undefined) {` — o comando não declara um argumento de tipo `clipboard`, então `clipboard` é `undefined` e o ramo da leitura da área de transferência não é tomado.
- R3 `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — o comando não declara um argumento de tipo `file`, então `file` é `undefined` e o caminho segue para a linha 144; um comando que pedisse arquivo seguiria pelo ramo do arquivo (`src/editor/doors/door.tsx:150` `    void chooseFile().then(async (bytes) => {`).
- R4 `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:244` `        waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:430`; nenhum passo cita `await`, timer, quadro ou ouvinte (os escolhedores de arquivo das linhas 100, 120, 128, 138 e 149 não são tomados por este comando).

## Estado
- lê: EST-L01-030 (via argumentRefusal do trecho), EST-L01-031 (via getState), EST-L01-037 (via getState), EST-L05a-001 (via beforeCommand)
- escreve: nenhum — a gravação entra no trecho `TRC-text.startEdit`

## Resultado
- **Estado final:** EST-L01-037 com `ui.textEdit.node` igual ao id do texto, pelo trecho `TRC-text.startEdit` (`src/editor/canvas/text-edit.ts:104` `  return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, node: node.id }), message: message('status.textEdit.editing') };`); numa recusa do trecho o estado do editor fica como estava.
- **Re-renderizado:** todo assinante da store, pelo trecho `TRC-text.startEdit` (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a moldura deixa de ser `aria-hidden` enquanto a edição dura, pelo trecho (`src/editor/canvas/frame.tsx:264` `      aria-hidden={editing ? undefined : true}`); a barra de comandos fecha pelo despacho do próprio controle.
- **DOM do canvas:** o renderizador marca o elemento editado como editável e o foca, pelo trecho (`src/editor/canvas/frame.tsx:126` `  renderer.editText(store.getState().document, edit.node, TEXT_EDITING);`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:104` `  return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, node: node.id }), message: message('status.textEdit.editing') };`.
- G2: ok `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando e os argumentos) e o tratador único decide; as três portas do manifesto chamam a mesma linha `src/app/commands.ts:430` `  'text.startEdit': startEdit,`.
- G4: n/a — a porta é um item da barra de comandos, não um ponto do canvas `manifest/commands/text.json:68` `      "kind": "command-bar",`.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/editor/doors/door.tsx:144`; as famílias de defeito de painel são medidas na Fase 6.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/doors/door.tsx:144`.
- G7: n/a — o caminho da porta não altera o documento `src/editor/doors/door.tsx:144`.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar (no trecho).

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:430`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-text.startEdit
- **Argumentos enviados:** `{}` — a porta declara `{}` (`manifest/commands/text.json:85` `          "args": {}`) e o item da barra de comandos acrescenta nada (`src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };`).
- nenhum — o trecho não lista ramo que dependa dos argumentos, porque o comando não tem argumentos (`auditoria/fluxos/trechos/TRC-text.startEdit.md`, campo `Ramos que dependem dos argumentos`).
