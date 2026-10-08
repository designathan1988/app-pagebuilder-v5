# TRC-text.startEdit
- **Chamada:** `src/app/commands.ts:430` `'text.startEdit': startEdit,`
- **Argumentos:** o comando não declara argumentos (`manifest/commands/text.json:9` `"args": {},`); o tratador recebe só o contexto (`HandlerContext`), com o estado (a seleção e o documento).
- **Ramos que dependem dos argumentos:** nenhum — o comando não tem argumentos.

## Passos
1. `src/app/commands.ts:430` `'text.startEdit': startEdit,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente de um campo é gravada ou respondida antes de o comando rodar.
3. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — [lê: EST-L01-030 via argumentRefusal] os argumentos são lidos contra o manifesto.
4. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — [lê: EST-L01-031 via singleTextSelection] a disponibilidade do comando.
5. `src/core/store/store.ts:418` `const refusal = predicate.refusal?.(state, layeredNow(at), args) ?? declared;` — a recusa do predicado, quando ele falha.
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador.
7. `src/editor/canvas/text-edit.ts:97` `export const startEdit = registerHandler<'text.startEdit', EditorUi>('text.startEdit', ({ state }) => {` — o tratador.
8. `src/editor/canvas/text-edit.ts:98` `const node = singleText(state);` — [lê: EST-L01-031 via singleText] [lê: EST-L01-030 via singleText] o texto sozinho selecionado.
9. `src/editor/canvas/text-edit.ts:79` `function singleText(state: StoreState<EditorUi>): DocNode | null {` — abre a leitura da seleção e do documento.
10. `src/editor/canvas/text-edit.ts:81` `if (only === undefined || others.length > 0 || !isTextElement(state.document, only)) return null;` — [lê: EST-L01-031 via singleText] [lê: EST-L01-030 via singleText] só um nó selecionado, e de conteúdo texto.
11. `src/editor/canvas/text-edit.ts:99` `if (node === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — R1.
12. `src/editor/canvas/text-edit.ts:102` `const locked = lockRefusal(state.document, node.id, 'status.locked.editText');` — [lê: EST-L01-030 via lockRefusal] a trava sobre o nó.
13. `src/editor/canvas/text-edit.ts:103` `if (locked !== null) return { kind: 'refused', message: locked };` — R2.
14. `src/editor/canvas/text-edit.ts:104` `return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, node: node.id }), message: message('status.textEdit.editing') };` — [escreve: EST-L01-037 via run] o nó entra em edição.
15. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run] o estado do editor novo entra na mudança.
16. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o estado do editor novo conta como mudança.
17. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish] publica a mudança.
18. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
19. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-037 via publish] os assinantes são chamados.

## Ramos
- R1 `src/editor/canvas/text-edit.ts:99` `if (node === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — nenhum texto sozinho selecionado: `refused` com `status.needsSingleSelection`; um texto sozinho: segue.
- R2 `src/editor/canvas/text-edit.ts:103` `if (locked !== null) return { kind: 'refused', message: locked };` — o nó ou um ancestral carrega a trava: `refused` com a mensagem da trava; livre: segue.
- R3 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a seleção não é um só texto: a store recusa antes do tratador (`status.needsSingleSelection`, ou `status.textEdit.notText` quando é um só elemento de outro tipo); é um só texto: o tratador roda.

## Fronteiras assíncronas
- nenhuma — o tratador de `src/editor/canvas/text-edit.ts:97` é síncrono e devolve o resultado na chamada; a porta é o despacho de um clique no canvas (`src/app/commands.ts:430`), também síncrono.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, singleText, lockRefusal), EST-L01-031 (a seleção, via singleTextSelection, singleText), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, publish)

## Resultado
- **Estado final:** EST-L01-037 com `ui.textEdit.node` igual a `node.id` por `src/editor/canvas/text-edit.ts:104` `return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, node: node.id }), message: message('status.textEdit.editing') };`; em R1 e R2 o estado mantém o `ui.textEdit` de antes e só a mensagem de recusa muda.
- **Re-renderizado:** todo assinante da store (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a moldura deixa de ser `aria-hidden` enquanto a edição dura (`src/editor/canvas/frame.tsx:264` `aria-hidden={editing ? undefined : true}`), lido por `src/editor/canvas/frame.tsx:46` `const editing = useEditorState((s) => s.ui.textEdit.node !== null);`.
- **DOM do canvas:** o renderizador marca o elemento editado como editável e o foca (`src/editor/canvas/frame.tsx:126` `renderer.editText(store.getState().document, edit.node, TEXT_EDITING);`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:104` `return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, node: node.id }), message: message('status.textEdit.editing') };`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada ou respondida antes (`src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/canvas/text-edit.ts:97` `export const startEdit = registerHandler<'text.startEdit', EditorUi>('text.startEdit', ({ state }) => {` — o único tratador; as três portas do manifesto chamam a mesma linha `src/app/commands.ts:430` `'text.startEdit': startEdit,`.
- G4: n/a — o tratador muda o estado do editor e não desenha nada sobre o canvas `src/editor/canvas/text-edit.ts:104`.
- G5: n/a — o trecho não desenha painel nem barra `src/editor/canvas/text-edit.ts:104`; as famílias de defeito de painel são medidas na Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador `src/editor/canvas/text-edit.ts:97`.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco.
