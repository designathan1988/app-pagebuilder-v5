# TRC-text.editLink
- **Chamada:** `src/app/commands.ts:436` `'text.editLink': editLink,`
- **Argumentos:** o tratador recebe `{ href }` (`src/generated/commands.ts:340` `"text.editLink": { readonly href?: string };`), com `href` opcional (tipo `string`): ausente abre o prompt do endereço; presente é o endereço digitado nele.
- **Ramos que dependem dos argumentos:** R2 (`href` ausente) e R3 (`href` não permitido).

## Passos
1. `src/app/commands.ts:436` `'text.editLink': editLink,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é gravada ou respondida antes de o comando rodar.
3. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — [lê: EST-L01-030 via argumentRefusal] os argumentos são lidos contra o manifesto (`href` é opcional, então ausente passa).
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador.
5. `src/editor/canvas/text-edit.ts:152` `export const editLink = registerHandler<'text.editLink', EditorUi>('text.editLink', ({ state }, { href }) => {` — o tratador.
6. `src/editor/canvas/text-edit.ts:153` `const edit = state.ui.textEdit;` — [lê: EST-L01-037 via handlerContext] o estado da edição.
7. `src/editor/canvas/text-edit.ts:154` `if (edit.node === null) return { kind: 'change' };` — R1.
8. `src/editor/canvas/text-edit.ts:155` `if (href === undefined) {` — R2.
9. `src/editor/canvas/text-edit.ts:156` `const linkPrompt = { count: (edit.linkPrompt?.count ?? 0) + 1, dismissals: state.ui.overlays.dismissals };` — [lê: EST-L01-037 via handlerContext] a abertura do prompt leva a contagem de descartes das camadas sobrepostas.
10. `src/editor/canvas/text-edit.ts:157` `return { kind: 'change', ui: withEdit(state.ui, { ...edit, linkPrompt }), message: message('status.link.asking') };` — [escreve: EST-L01-037 via run] o prompt abre.
11. `src/editor/canvas/text-edit.ts:159` `const address = href.trim();` — o endereço aparado.
12. `src/editor/canvas/text-edit.ts:160` `if (address !== '' && !isSafeHref(address)) return { kind: 'refused', message: message('status.link.unsafe') };` — R3.
13. `src/editor/canvas/text-edit.ts:162` `return { kind: 'change', ui: changed(state.ui, { kind: 'link', href: address === '' ? null : keptHref(address) }, null), message: message('status.textEdit.editing') };` — [escreve: EST-L01-037 via changed] a mudança de link é pedida, o prompt fecha (`linkPrompt` nulo).
14. `src/editor/canvas/text-edit.ts:135` `withEdit(ui, { ...ui.textEdit, changes: ui.textEdit.changes + 1, change, linkPrompt });` — [escreve: EST-L01-037 via changed] a contagem `changes` sobe.
15. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run] o estado do editor novo entra na mudança.
16. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o estado novo conta como mudança (em R1 nada muda).
17. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish] publica.
18. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
19. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-037 via publish] os assinantes são chamados.

## Ramos
- R1 `src/editor/canvas/text-edit.ts:154` `if (edit.node === null) return { kind: 'change' };` — nenhum texto editado: `change` sem estado nem mensagem (nada muda); um texto editado: segue para R2.
- R2 `src/editor/canvas/text-edit.ts:155` `if (href === undefined) {` — `href` ausente: o prompt do endereço abre (passos 9 e 10); presente: segue para R3.
- R3 `src/editor/canvas/text-edit.ts:160` `if (address !== '' && !isSafeHref(address)) return { kind: 'refused', message: message('status.link.unsafe') };` — endereço não vazio e não permitido: `refused` com `status.link.unsafe` e o prompt fica aberto; permitido (ou vazio): a mudança de link é pedida (passo 13).

## Fronteiras assíncronas
- nenhuma — o tratador de `src/editor/canvas/text-edit.ts:152` é síncrono e devolve o resultado na chamada; o prompt do endereço roda o comando de novo (`href` presente) fora deste trecho.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, publish)

## Resultado
- **Estado final:** no ramo R2, EST-L01-037 com `ui.textEdit.linkPrompt` igual a `{ count, dismissals }` por `src/editor/canvas/text-edit.ts:157` `return { kind: 'change', ui: withEdit(state.ui, { ...edit, linkPrompt }), message: message('status.link.asking') };`; no ramo do endereço, `ui.textEdit.changes` uma unidade maior e `ui.textEdit.change` igual a `{ kind: 'link', href }` com `linkPrompt` nulo por `src/editor/canvas/text-edit.ts:162`; em R1 e R3 o estado do editor fica como estava.
- **Re-renderizado:** todo assinante da store (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** em R2 a barra de status mostra `status.link.asking` (`src/core/store/store.ts:540` `message: outcome.message ?? (before.refused === true ? null : before.message),`) e o prompt do endereço é desenhado sobre o canvas; no ramo do endereço o prompt fecha e a barra de status mostra `status.textEdit.editing`.
- **DOM do canvas:** no ramo do endereço, o renderizador aplica o endereço ao texto selecionado e o redesenha (`src/editor/canvas/frame.tsx:154` `const after = applyInlineChange(content.runs, (prompting ? kept : null) ?? content.range ?? { start: end, end }, edit.change);` e `src/editor/canvas/frame.tsx:155` `renderer.showEdited(after.runs, after.range);`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:162` `return { kind: 'change', ui: changed(state.ui, { kind: 'link', href: address === '' ? null : keptHref(address) }, null), message: message('status.textEdit.editing') };`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada ou respondida antes (`src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/canvas/text-edit.ts:152` `export const editLink = registerHandler<'text.editLink', EditorUi>('text.editLink', ({ state }, { href }) => {` — o único tratador; as duas portas do manifesto (Ctrl+K no texto editando, botão Link da barra de texto) e o próprio prompt do endereço chamam a mesma linha `src/app/commands.ts:436` `'text.editLink': editLink,`.
- G4: n/a — o tratador muda o estado do editor e não desenha nada sobre o canvas `src/editor/canvas/text-edit.ts:162`.
- G5: n/a — o trecho não desenha painel nem barra `src/editor/canvas/text-edit.ts:162`; as famílias de defeito de painel são medidas na Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador `src/editor/canvas/text-edit.ts:152`.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco.
