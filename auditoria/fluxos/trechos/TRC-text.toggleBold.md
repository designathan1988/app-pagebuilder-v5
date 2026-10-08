# TRC-text.toggleBold
- **Chamada:** `src/app/commands.ts:434` `'text.toggleBold': toggleBold,`
- **Argumentos:** o comando não declara argumentos (`manifest/commands/text.json:338` `"args": {},`); o tratador recebe só o contexto (`HandlerContext`), com o estado.
- **Ramos que dependem dos argumentos:** nenhum — o comando não tem argumentos.

## Passos
1. `src/app/commands.ts:434` `'text.toggleBold': toggleBold,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é gravada ou respondida antes de o comando rodar.
3. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — [lê: EST-L01-030 via argumentRefusal] os argumentos são lidos contra o manifesto.
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador.
5. `src/editor/canvas/text-edit.ts:139` `export const toggleBold = registerHandler<'text.toggleBold', EditorUi>('text.toggleBold', ({ state }) =>` — o tratador.
6. `src/editor/canvas/text-edit.ts:140` `state.ui.textEdit.node === null ? { kind: 'change' } : { kind: 'change', ui: changed(state.ui, { kind: 'mark', mark: 'strong' }) },` — [lê: EST-L01-037 via handlerContext] R1: sem texto editado, `change` sem estado; com texto editado, [escreve: EST-L01-037 via changed] a marca `strong` é pedida.
7. `src/editor/canvas/text-edit.ts:134` `const changed = (ui: EditorUi, change: InlineChange, linkPrompt = ui.textEdit.linkPrompt): EditorUi =>` — abre o pedido de mudança das marcas.
8. `src/editor/canvas/text-edit.ts:135` `withEdit(ui, { ...ui.textEdit, changes: ui.textEdit.changes + 1, change, linkPrompt });` — [escreve: EST-L01-037 via changed] a contagem `changes` sobe e a mudança entra.
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run] o estado do editor novo entra na mudança.
10. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a contagem nova conta como mudança (em R1 nada muda).
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish] publica.
12. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-037 via publish] os assinantes são chamados.

## Ramos
- R1 `src/editor/canvas/text-edit.ts:140` `state.ui.textEdit.node === null ? { kind: 'change' } : { kind: 'change', ui: changed(state.ui, { kind: 'mark', mark: 'strong' }) },` — nenhum texto editado: `change` sem estado nem mensagem (nada muda); um texto editado: a mudança `{ kind: 'mark', mark: 'strong' }` é pedida (passo 6).

## Fronteiras assíncronas
- nenhuma — o tratador de `src/editor/canvas/text-edit.ts:139` é síncrono e devolve o resultado na chamada.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, publish)

## Resultado
- **Estado final:** EST-L01-037 com `ui.textEdit.changes` uma unidade maior e `ui.textEdit.change` igual a `{ kind: 'mark', mark: 'strong' }` por `src/editor/canvas/text-edit.ts:135` `withEdit(ui, { ...ui.textEdit, changes: ui.textEdit.changes + 1, change, linkPrompt });`; em R1 o estado fica como estava.
- **Re-renderizado:** todo assinante da store (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** nada muda — o trecho não escreve mensagem nem prompt.
- **DOM do canvas:** o renderizador aplica a marca ao texto selecionado e o redesenha (`src/editor/canvas/frame.tsx:154` `const after = applyInlineChange(content.runs, (prompting ? kept : null) ?? content.range ?? { start: end, end }, edit.change);` e `src/editor/canvas/frame.tsx:155` `renderer.showEdited(after.runs, after.range);`), no ramo do `changes` novo (`src/editor/canvas/frame.tsx:149` `if (edit.changes !== changes) {`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:135` `withEdit(ui, { ...ui.textEdit, changes: ui.textEdit.changes + 1, change, linkPrompt });`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada ou respondida antes (`src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/canvas/text-edit.ts:139` `export const toggleBold = registerHandler<'text.toggleBold', EditorUi>('text.toggleBold', ({ state }) =>` — o único tratador; as duas portas do manifesto (Ctrl+B no texto editando, botão Bold da barra de texto) chamam a mesma linha `src/app/commands.ts:434` `'text.toggleBold': toggleBold,`.
- G4: n/a — o tratador muda o estado do editor e não desenha nada sobre o canvas `src/editor/canvas/text-edit.ts:135`.
- G5: n/a — o trecho não desenha painel nem barra `src/editor/canvas/text-edit.ts:135`; as famílias de defeito de painel são medidas na Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador `src/editor/canvas/text-edit.ts:139`.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco.
