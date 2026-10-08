# TRC-text.cancelEdit
- **Chamada:** `src/app/commands.ts:432` `'text.cancelEdit': cancelEdit,`
- **Argumentos:** o comando não declara argumentos (`manifest/commands/text.json:262` `"args": {},`); o tratador recebe só o contexto (`HandlerContext`), com o estado.
- **Ramos que dependem dos argumentos:** nenhum — o comando não tem argumentos.

## Passos
1. `src/app/commands.ts:432` `'text.cancelEdit': cancelEdit,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é gravada ou respondida antes de o comando rodar.
3. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — [lê: EST-L01-030 via argumentRefusal] os argumentos são lidos contra o manifesto.
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador.
5. `src/editor/canvas/text-edit.ts:110` `export const cancelEdit = registerHandler<'text.cancelEdit', EditorUi>('text.cancelEdit', ({ state }) => {` — o tratador.
6. `src/editor/canvas/text-edit.ts:111` `const node = state.ui.textEdit.node;` — [lê: EST-L01-037 via handlerContext] o nó em edição, se houver.
7. `src/editor/canvas/text-edit.ts:112` `if (node === null) {` — R1.
8. `src/editor/canvas/text-edit.ts:113` `const field = singleText(state);` — [lê: EST-L01-031 via singleText] [lê: EST-L01-030 via singleText] o texto sozinho selecionado, para o campo do inspector.
9. `src/editor/canvas/text-edit.ts:114` `return field === null ? { kind: 'change' } : { kind: 'change', message: message('status.textEdit.cancelled', { name: field.name }) };` — R1a e R1b.
10. `src/editor/canvas/text-edit.ts:116` `return { kind: 'change', ui: ended(state.ui), message: message('status.textEdit.cancelled', { name: locate(state.document, node)?.node.name ?? '' }) };` — [escreve: EST-L01-037 via run] R2, a edição encerra.
11. `src/editor/canvas/text-edit.ts:69` `const ended = (ui: EditorUi): EditorUi => (ui.textEdit.node === null ? ui : withEdit(ui, { ...ui.textEdit, node: null, linkPrompt: null }));` — [escreve: EST-L01-037 via ended] o nó e o prompt de link saem.
12. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run] o estado do editor novo entra na mudança.
13. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o estado novo conta como mudança (em R1a, sem estado nem mensagem novos, nada muda).
14. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish] publica.
15. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
16. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-037 via publish] os assinantes são chamados.

## Ramos
- R1 `src/editor/canvas/text-edit.ts:112` `if (node === null) {` — nenhum texto editado no canvas: o ramo do campo do inspector (R1a/R1b); um texto editado: segue para R2.
- R1a `src/editor/canvas/text-edit.ts:114` `return field === null ? { kind: 'change' } : { kind: 'change', message: message('status.textEdit.cancelled', { name: field.name }) };` — nenhum texto sozinho selecionado: `change` sem estado nem mensagem (nada muda); um texto sozinho: `change` só com `status.textEdit.cancelled`, e o campo do inspector volta ao texto do documento.
- R1b `src/editor/canvas/text-edit.ts:114` `return field === null ? { kind: 'change' } : { kind: 'change', message: message('status.textEdit.cancelled', { name: field.name }) };` — o mesmo ramo da porta do campo: só a mensagem é devolvida.
- R2 `src/editor/canvas/text-edit.ts:116` `return { kind: 'change', ui: ended(state.ui), message: message('status.textEdit.cancelled', { name: locate(state.document, node)?.node.name ?? '' }) };` — há texto editado: o `ui.textEdit` encerra (R2) e a mensagem nomeia o nó.

## Fronteiras assíncronas
- nenhuma — o tratador de `src/editor/canvas/text-edit.ts:110` é síncrono e devolve o resultado na chamada.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal), EST-L01-031 (a seleção, via singleText), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, ended, publish)

## Resultado
- **Estado final:** em R2, EST-L01-037 com `ui.textEdit.node` nulo e `ui.textEdit.linkPrompt` nulo por `src/editor/canvas/text-edit.ts:69` `const ended = (ui: EditorUi): EditorUi => (ui.textEdit.node === null ? ui : withEdit(ui, { ...ui.textEdit, node: null, linkPrompt: null }));`; em R1a nada muda e em R1b só a mensagem muda.
- **Re-renderizado:** todo assinante da store (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra a mensagem (`src/core/store/store.ts:540` `message: outcome.message ?? (before.refused === true ? null : before.message),`) e a moldura volta a ser `aria-hidden` quando a edição acaba (`src/editor/canvas/frame.tsx:264` `aria-hidden={editing ? undefined : true}`).
- **DOM do canvas:** em R2 o elemento editado deixa de ser editável e volta ao texto do documento (`src/editor/canvas/frame.tsx:126` `renderer.editText(store.getState().document, edit.node, TEXT_EDITING);`); em R1a e R1b nada muda.

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:116` `return { kind: 'change', ui: ended(state.ui), message: message('status.textEdit.cancelled', { name: locate(state.document, node)?.node.name ?? '' }) };`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada ou respondida antes (`src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/canvas/text-edit.ts:110` `export const cancelEdit = registerHandler<'text.cancelEdit', EditorUi>('text.cancelEdit', ({ state }) => {` — o único tratador; a porta do manifesto chama a mesma linha `src/app/commands.ts:432` `'text.cancelEdit': cancelEdit,`.
- G4: n/a — o tratador muda o estado do editor e não desenha nada sobre o canvas `src/editor/canvas/text-edit.ts:116`.
- G5: n/a — o trecho não desenha painel nem barra `src/editor/canvas/text-edit.ts:116`; as famílias de defeito de painel são medidas na Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador `src/editor/canvas/text-edit.ts:110`.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco.
