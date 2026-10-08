# TRC-text.paste
- **Chamada:** `src/app/commands.ts:437` `'text.paste': pasteText,`
- **Argumentos:** o tratador recebe `{ clipboard }` (`src/generated/commands.ts:341` `"text.paste": { readonly clipboard: ClipboardContent };`). `ClipboardContent` é a união `{ status: 'read'; html; text; markup? }` ou `{ status: 'denied' }` (`src/generated/commands.ts:22` `export type ClipboardContent =`). O campo é lido pelo portão antes de despachar (`src/editor/input/keymap.ts:532` `else if (gesture === null) void readClipboard().then((content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`), e pode chegar ausente numa execução que não leu.
- **Ramos que dependem dos argumentos:** R2 (`clipboard` ausente), R3 (leitura negada) e R4 (nada que leia como texto).

## Passos
1. `src/app/commands.ts:437` `'text.paste': pasteText,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é gravada ou respondida antes de o comando rodar.
3. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — [lê: EST-L01-030 via argumentRefusal] os argumentos são lidos contra o manifesto (um argumento de tipo `clipboard` ausente passa: `src/core/store/args.ts:84` `if (arg.optional || arg.type === 'clipboard') continue;`).
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador.
5. `src/editor/canvas/text-edit.ts:168` `export const pasteText = registerHandler<'text.paste', EditorUi>('text.paste', ({ state, rules }, { clipboard }) => {` — o tratador.
6. `src/editor/canvas/text-edit.ts:169` `if (state.ui.textEdit.node === null) return { kind: 'change' };` — [lê: EST-L01-037 via handlerContext] R1.
7. `src/editor/canvas/text-edit.ts:171` `if ((clipboard as typeof clipboard | undefined) === undefined) return { kind: 'change' };` — R2.
8. `src/editor/canvas/text-edit.ts:172` `if (clipboard.status === 'denied') return { kind: 'refused', message: message('status.clipboard.denied') };` — R3.
9. `src/editor/canvas/text-edit.ts:173` `const runs = pastedRuns(clipboard, rules.contentModel);` — o conteúdo lido como texto com marcas.
10. `src/core/text/inline.ts:271` `if (content.status !== 'read') return [];` — [lê: EST-L01-030 via pastedRuns] só a leitura legível rende runs.
11. `src/editor/canvas/text-edit.ts:174` `if (plainText(runs) === '') return { kind: 'refused', message: message('status.paste.empty') };` — R4.
12. `src/editor/canvas/text-edit.ts:175` `return { kind: 'change', ui: changed(state.ui, { kind: 'insert', runs }) };` — [escreve: EST-L01-037 via changed] a inserção das runs é pedida.
13. `src/editor/canvas/text-edit.ts:135` `withEdit(ui, { ...ui.textEdit, changes: ui.textEdit.changes + 1, change, linkPrompt });` — [escreve: EST-L01-037 via changed] a contagem `changes` sobe.
14. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run] o estado do editor novo entra na mudança.
15. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o estado novo conta como mudança (em R1 e R2 nada muda).
16. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish] publica.
17. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
18. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-037 via publish] os assinantes são chamados.

## Ramos
- R1 `src/editor/canvas/text-edit.ts:169` `if (state.ui.textEdit.node === null) return { kind: 'change' };` — nenhum texto editado: `change` sem estado nem mensagem (nada muda); um texto editado: segue.
- R2 `src/editor/canvas/text-edit.ts:171` `if ((clipboard as typeof clipboard | undefined) === undefined) return { kind: 'change' };` — `clipboard` ausente: `change` sem estado nem mensagem (nada muda); presente: segue.
- R3 `src/editor/canvas/text-edit.ts:172` `if (clipboard.status === 'denied') return { kind: 'refused', message: message('status.clipboard.denied') };` — leitura negada pelo navegador: `refused` com `status.clipboard.denied`; legível: segue.
- R4 `src/editor/canvas/text-edit.ts:174` `if (plainText(runs) === '') return { kind: 'refused', message: message('status.paste.empty') };` — nada que leia como texto: `refused` com `status.paste.empty`; com texto: a inserção é pedida (passo 12).

## Fronteiras assíncronas
- a leitura da área de transferência do sistema acontece no portão, antes desta chamada: `src/editor/input/keymap.ts:532` `else if (gesture === null) void readClipboard().then((content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`. No intervalo podem rodar as entradas de teclado do contexto de edição de texto; a aplicação está com a edição aberta (`ui.textEdit.node` não nulo), e o tratador só roda depois que o conteúdo chega (ou com o campo ausente, R2). O tratador de `src/editor/canvas/text-edit.ts:168` é síncrono.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, publish)

## Resultado
- **Estado final:** EST-L01-037 com `ui.textEdit.changes` uma unidade maior e `ui.textEdit.change` igual a `{ kind: 'insert', runs }` por `src/editor/canvas/text-edit.ts:175` `return { kind: 'change', ui: changed(state.ui, { kind: 'insert', runs }) };`; em R1 e R2 o estado fica como estava, e em R3 e R4 só a mensagem muda.
- **Re-renderizado:** todo assinante da store (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** nas recusas, a barra de status mostra a mensagem (`src/core/store/store.ts:540` `message: outcome.message ?? (before.refused === true ? null : before.message),`); no ramo da inserção nada muda no editor além do estado.
- **DOM do canvas:** o renderizador insere as runs no lugar da seleção do texto editado e o redesenha (`src/editor/canvas/frame.tsx:154` `const after = applyInlineChange(content.runs, (prompting ? kept : null) ?? content.range ?? { start: end, end }, edit.change);` e `src/editor/canvas/frame.tsx:155` `renderer.showEdited(after.runs, after.range);`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:135` `withEdit(ui, { ...ui.textEdit, changes: ui.textEdit.changes + 1, change, linkPrompt });`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada ou respondida antes (`src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/canvas/text-edit.ts:168` `export const pasteText = registerHandler<'text.paste', EditorUi>('text.paste', ({ state, rules }, { clipboard }) => {` — o único tratador; a porta do manifesto (Ctrl+V no texto editando) despacha a mesma linha `src/app/commands.ts:437` `'text.paste': pasteText,`.
- G4: n/a — o tratador muda o estado do editor e não desenha nada sobre o canvas `src/editor/canvas/text-edit.ts:175`.
- G5: n/a — o trecho não desenha painel nem barra `src/editor/canvas/text-edit.ts:175`; as famílias de defeito de painel são medidas na Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador `src/editor/canvas/text-edit.ts:168`.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco.
