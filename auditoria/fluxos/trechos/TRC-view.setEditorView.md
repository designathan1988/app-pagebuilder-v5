# TRC-view.setEditorView

- **Chamada:** `src/app/commands.ts:455` `'view.setEditorView': setEditorView,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ view }` (`manifest/commands/view.json:992` `"args": {`), com o campo `view` (tipo `enum`, valores `canvas`, `split`, `code`, `manifest/commands/view.json:993` `"view": {`); as portas (os três segmentos da barra do canvas e o item do menu Ver) enviam um dos valores `manifest/commands/view.json:1034` `"view": "canvas"`.
- **Ramos que dependem dos argumentos:** nenhum: o valor de `view` não muda o caminho tomado, só o estado e a mensagem `src/editor/view/editor-view.ts:18` `({ state }, { view }) => ({ kind: 'change', ui: { ...state.ui, editorView: view === 'canvas' ? undefined : view }, message: message(SAID[view]) }),`.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.setEditorView'`; o argumento é `{ view }`.
2. `src/editor/view/editor-view.ts:16` `export const setEditorView = registerHandler<'view.setEditorView', EditorUi>(` — o tratador de `view.setEditorView`.
3. `src/editor/view/editor-view.ts:18` `({ state }, { view }) => ({ kind: 'change', ui: { ...state.ui, editorView: view === 'canvas' ? undefined : view }, message: message(SAID[view]) }),` — R4: `canvas` limpa a chave; `split` e `code` a guardam; a mensagem vem de `SAID`. [lê: EST-L01-037 via handlerContext] [escreve: EST-L01-037 via run]
4. `src/editor/view/editor-view.ts:14` `const SAID = { canvas: 'status.view.canvas', split: 'status.view.split', code: 'status.view.code' } as const;` — a mensagem de cada vista.
5. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
6. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
7. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
8. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
9. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/editor-view.ts:16` `export const setEditorView = registerHandler<'view.setEditorView', EditorUi>(`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.setEditorView` é `always` `manifest/commands/view.json:1004` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/editor-view.ts:20` `(state, { view }) => editorView(state.ui) === view,` — o segmento marcado é o da vista em vigor; `editorView` devolve `canvas` enquanto nenhuma foi escolhida `src/editor/view/editor-view.ts:11` `export const editorView = (ui: EditorUi): EditorView => ui.editorView ?? 'canvas';`.
- R4 `src/editor/view/editor-view.ts:18` `({ state }, { view }) => ({ kind: 'change', ui: { ...state.ui, editorView: view === 'canvas' ? undefined : view }, message: message(SAID[view]) }),` — `view` igual a `canvas` grava `editorView: undefined`; `split` ou `code` gravam o próprio valor.
- R5 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque o tratador devolve sempre um objeto de estado do editor novo `src/editor/view/editor-view.ts:18` `ui: { ...state.ui, editorView: view === 'canvas' ? undefined : view }`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, publish)
- escreve: EST-L01-037 (o estado do editor, via run, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.editorView` na vista escolhida, ou sem a chave para `canvas` `src/editor/view/editor-view.ts:18` `ui: { ...state.ui, editorView: view === 'canvas' ? undefined : view }`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a coluna do canvas relê a vista `src/editor/shell/canvas.tsx:286` `const view = useEditorState((s) => editorView(s.ui));`.
- **DOM do editor:** a coluna toma a classe da vista nova `src/editor/shell/canvas.tsx:291` `<main className={`centre centre--${view}`}>` e o quadro só é desenhado fora da vista de código `src/editor/shell/canvas.tsx:253` `const stageShown = useEditorState((s) => editorView(s.ui) !== 'code');`.
- **DOM do canvas:** nada muda: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava a vista do editor `src/editor/view/editor-view.ts:18` `ui: { ...state.ui, editorView: view === 'canvas' ? undefined : view }`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as quatro portas de `view.setEditorView` (os segmentos Canvas, Split e Code da barra e o item do menu Ver) chegam à tabela `src/app/commands.ts:455` `'view.setEditorView': setEditorView,` e enviam só o valor da vista `src/editor/view/editor-view.ts:18` `({ state }, { view }) => ({ kind: 'change', ui: { ...state.ui, editorView: view === 'canvas' ? undefined : view }, message: message(SAID[view]) }),`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/editor-view.ts:18` `ui: { ...state.ui, editorView: view === 'canvas' ? undefined : view }`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a vista `src/editor/view/editor-view.ts:18` `ui: { ...state.ui, editorView: view === 'canvas' ? undefined : view }`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/editor-view.ts:16` `export const setEditorView = registerHandler<'view.setEditorView', EditorUi>(`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; a vista é um campo do estado do editor `src/editor/view/editor-view.ts:11` `export const editorView = (ui: EditorUi): EditorView => ui.editorView ?? 'canvas';`.
