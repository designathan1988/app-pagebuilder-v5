# TRC-workspace.openDialog

- **Chamada:** `src/app/commands.ts:476` `'workspace.openDialog': openDialog,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ dialog }` (`manifest/commands/view.json:2976` `"args": {`), com o campo `dialog` (enum `guides-grids`/`snap-settings`/`breakpoints`/`batch-rename`/`capture-url`, `manifest/commands/view.json:2977` `"dialog": {`); cada porta envia o diálogo que abre `manifest/commands/view.json:3020` `"dialog": "guides-grids"`.
- **Ramos que dependem dos argumentos:** R3 depende de `dialog` (se é o de renomear em lote); R4 e R5 dependem da seleção.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'workspace.openDialog'`; o argumento é `{ dialog }`.
2. `src/editor/workspace/dialogs.ts:14` `export const openDialog = registerHandler<'workspace.openDialog', EditorUi>('workspace.openDialog', (context, { dialog }) => {` — o tratador de `workspace.openDialog`. [lê: EST-L01-037 via handlerContext]
3. `src/editor/workspace/dialogs.ts:15` `const { state } = context;` — o estado do editor do contexto do tratador.
4. `src/editor/workspace/dialogs.ts:16` `if (dialog === BATCH_RENAME) {` — R3.
5. `src/editor/workspace/dialogs.ts:17` `if (state.selection.length === 0) return { kind: 'refused', message: message('refusal.nothingSelected') };` — R4.
6. `src/editor/workspace/dialogs.ts:19` `const outcome = renameBatch(context as unknown as HandlerContext<never>, state.selection, '{name}', 1);` — o renomeador testa a seleção como faria ao renomear. [lê: EST-L01-031 via renameBatch]
7. `src/editor/workspace/dialogs.ts:20` `if (outcome.kind === 'refused') return outcome;` — R5.
8. `src/editor/workspace/dialogs.ts:22` `return { kind: 'change', ui: { ...state.ui, dialog } };` — o `Outcome` com o diálogo nomeado no estado do editor. [escreve: EST-L01-037 via run]
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
10. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
11. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
12. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish]
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/workspace/dialogs.ts:14` `export const openDialog = registerHandler<'workspace.openDialog', EditorUi>('workspace.openDialog', (context, { dialog }) => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `workspace.openDialog` é `always` `manifest/commands/view.json:2990` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/workspace/dialogs.ts:16` `if (dialog === BATCH_RENAME) {` — o `dialog` sendo o de renomear em lote: a seleção é testada antes de abrir; qualquer outro `dialog`: o caminho salta direto para `src/editor/workspace/dialogs.ts:22` `return { kind: 'change', ui: { ...state.ui, dialog } };`.
- R4 `src/editor/workspace/dialogs.ts:17` `if (state.selection.length === 0) return { kind: 'refused', message: message('refusal.nothingSelected') };` — sem seleção: o comando é recusado com `refusal.nothingSelected`; com seleção, o caminho segue para `src/editor/workspace/dialogs.ts:19` `const outcome = renameBatch(context as unknown as HandlerContext<never>, state.selection, '{name}', 1);`.
- R5 `src/editor/workspace/dialogs.ts:20` `if (outcome.kind === 'refused') return outcome;` — o renomeador recusando a seleção (a raiz da página ou um elemento travado entre os selecionados): devolve a recusa dele; aceitando, o caminho segue para `src/editor/workspace/dialogs.ts:22` `return { kind: 'change', ui: { ...state.ui, dialog } };`.
- R6 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — no ramo do R5, a store publica a recusa `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));`; no ramo do R3/R4/R5 aberto, `next.ui !== before.ui` é verdadeiro `src/editor/workspace/dialogs.ts:22` `ui: { ...state.ui, dialog }` e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, publish), EST-L01-031 (a seleção, via renameBatch)
- escreve: EST-L01-037 (o estado do editor, via run, publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.dialog` no diálogo pedido `src/editor/workspace/dialogs.ts:22` `return { kind: 'change', ui: { ...state.ui, dialog } };`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; cada diálogo relê o próprio nome `src/editor/shell/guides-grids.tsx:171` `const open = useEditorState((s) => s.ui.dialog === DIALOG);`.
- **DOM do editor:** o diálogo pedido passa a ser desenhado `src/editor/shell/guides-grids.tsx:171` `const open = useEditorState((s) => s.ui.dialog === DIALOG);`, e o de renomear em lote pela leitura `src/editor/shell/batch-rename.tsx:29` `const open = useEditorState((s) => s.ui.dialog === DIALOG);`.
- **DOM do canvas:** nada muda: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava o diálogo aberto `src/editor/workspace/dialogs.ts:22` `return { kind: 'change', ui: { ...state.ui, dialog } };`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as cinco portas de `workspace.openDialog` (os itens dos menus Ver e Arquivo e o item do menu de contexto) chegam à tabela `src/app/commands.ts:476` `'workspace.openDialog': openDialog,` e enviam só o nome do diálogo `src/editor/workspace/dialogs.ts:14` `(context, { dialog }) => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/workspace/dialogs.ts:22` `return { kind: 'change', ui: { ...state.ui, dialog } };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava o diálogo `src/editor/workspace/dialogs.ts:22` `ui: { ...state.ui, dialog }`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/workspace/dialogs.ts:14` `export const openDialog = registerHandler<'workspace.openDialog', EditorUi>('workspace.openDialog', (context, { dialog }) => {`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; o diálogo é um campo do estado do editor `src/editor/workspace/dialogs.ts:22` `return { kind: 'change', ui: { ...state.ui, dialog } };`.
