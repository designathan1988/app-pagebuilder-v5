# ENT-P-text-0018 — text.paste pela porta text.paste#key-ctrl-v-in-text-editing

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:532` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.paste`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:531` `    const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — o nome do argumento de tipo `clipboard` é achado: `text.paste` declara `clipboard` (`manifest/commands/text.json:527` `        "clipboard": {`), então `clipboard` é `'clipboard'`.
2. `src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));` — o teclado lê a área de transferência do sistema e só despacha quando o conteúdo chega. O `dispatch` é o ligado em `src/editor/input/keymap.ts:526` `    const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;`; sem gesto nem rajada, é `store.dispatch`, a store do editor.
3. `src/editor/clipboard.ts:63` `export async function readClipboard(): Promise<ClipboardContent> {` — a leitura é assíncrona.
4. `src/editor/clipboard.ts:64` `  const read = await systemClipboard();` — a leitura fala com o navegador (`navigator.clipboard.read`); recusada, devolve `{ status: 'denied' }` (`src/editor/clipboard.ts:43` `    if (error instanceof DOMException && error.name === 'NotAllowedError') return { status: 'denied' };`).
5. `src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));` — no retorno da leitura, o conteúdo entra no argumento `clipboard` e o comando é despachado.
6. `src/editor/store.ts:233` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
7. `src/editor/store.ts:234` `      const changesDocument = UNDOABLE.get(id) === true;` — `text.paste` não é desfazível (`manifest/commands/text.json:543` `      "undoable": false`), então `changesDocument` é `false`.
8. `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é respondida antes de o comando rodar.
9. `src/editor/store.ts:236` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState].
10. `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
11. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
12. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca o comando na tabela (`wiring().commands`).
13. `src/app/commands.ts:437` `  'text.paste': pasteText,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.paste`).

## Ramos
- R1 `src/editor/input/keymap.ts:531` `    const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — com um argumento de tipo `clipboard` o despacho espera a leitura (linha 532); sem ele o despacho seria o da linha 531.
- R2 `src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));` — durante a edição do texto não há gesto de ponteiro aberto, então a leitura acontece; com um gesto aberto um Ctrl+V não esperaria pela leitura.
- R3 `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — o despacho chega com o gesto já fechado, então vai direto à store do núcleo; um gesto aberto no instante da chegada levaria um comando que não muda o documento pelo gesto (`src/editor/store.ts:241` `result = inGesture(id, () => gesture.dispatch(id, args));`).

## Fronteiras assíncronas
- a leitura da área de transferência do sistema: `src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));` e `src/editor/clipboard.ts:64` `  const read = await systemClipboard();`. No intervalo podem rodar as entradas de teclado e de ponteiro do editor (por exemplo outra tecla do contexto do texto editado, ou um press no canvas que termine a edição); a aplicação está com a edição aberta (`ui.textEdit.node` não nulo) quando a leitura começou. O tratador de `src/editor/canvas/text-edit.ts:168` é síncrono e só roda depois que o conteúdo chega (ou sem ele, quando a leitura não devolve nada).

## Estado
- lê: EST-L01-030 (via argumentRefusal do trecho), EST-L01-031 (via getState), EST-L01-037 (via getState), EST-L05a-001 (via beforeCommand)
- escreve: nenhum — a gravação entra no trecho `TRC-text.paste`

## Resultado
- **Estado final:** EST-L01-037 com `ui.textEdit.changes` uma unidade maior e `ui.textEdit.change` igual a `{ kind: 'insert', runs }`, pelo trecho `TRC-text.paste` (`src/editor/canvas/text-edit.ts:175` `  return { kind: 'change', ui: changed(state.ui, { kind: 'insert', runs }) };`); nas recusas do trecho só a mensagem muda, e sem texto nada muda.
- **Re-renderizado:** todo assinante da store, pelo trecho (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** nas recusas, a barra de status mostra a mensagem, pelo trecho (`src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),`).
- **DOM do canvas:** o renderizador insere as runs no lugar da seleção do texto editado e o redesenha, pelo trecho (`src/editor/canvas/frame.tsx:155` `  renderer.showEdited(after.runs, after.range);`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:135` `  withEdit(ui, { ...ui.textEdit, changes: ui.textEdit.changes + 1, change, linkPrompt });`.
- G2: ok `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é respondida antes (o registro é `src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));` — a porta envia só a intenção (o id do comando e o que a área de transferência guarda) e o tratador único decide; a porta do manifesto chama a mesma linha `src/app/commands.ts:437` `  'text.paste': pasteText,`.
- G4: n/a — a porta é uma tecla no contexto do texto editado, não um ponto do canvas `manifest/commands/text.json:548` `      "kind": "shortcut",`.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/editor/input/keymap.ts:532`; as famílias de defeito de painel são medidas na Fase 6.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/input/keymap.ts:532`.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar (no trecho).

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/input/keymap.ts:532` e `src/app/commands.ts:437`; a promessa de `readClipboard` esgota-se sozinha ao resolver. Nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-text.paste
- **Argumentos enviados:** `{ clipboard }` — `clipboard` é o `ClipboardContent` que `readClipboard` devolve (`src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`): `{ status: 'read', html, text, markup }` ou `{ status: 'denied' }`.
- R2 `src/editor/canvas/text-edit.ts:171` `  if ((clipboard as typeof clipboard | undefined) === undefined) return { kind: 'change' };` — esta porta sempre passa `clipboard` (o retorno da leitura), então este ramo não é tomado por ela e o caminho segue.
- R3 `src/editor/canvas/text-edit.ts:172` `  if (clipboard.status === 'denied') return { kind: 'refused', message: message('status.clipboard.denied') };` — com a leitura negada (`src/editor/clipboard.ts:43` `    if (error instanceof DOMException && error.name === 'NotAllowedError') return { status: 'denied' };`) o caminho para aqui; legível, segue.
- R4 `src/editor/canvas/text-edit.ts:174` `  if (plainText(runs) === '') return { kind: 'refused', message: message('status.paste.empty') };` — com nada que leia como texto o caminho para aqui; com texto, segue para a inserção.
