# TRC-files.open

- **Chamada:** `src/app/commands.ts:307` `'files.open': openFile,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ path }`, com o campo `path` (args.path, tipo `path`); as duas portas (explorer-file-row, file-tab) enviam o caminho do arquivo.
- **Ramos que dependem dos argumentos:** R1 (`path` não texto ou vazio lança), R2 (`path` fora das linhas da árvore recusa), R3 (a vista decide se o centro mostra o código).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/editor/explorer/explorer.ts:145` `export const openFile = registerHandler<'files.open', EditorUi>(` — o tratador.
5. `src/editor/explorer/explorer.ts:147` `({ state, rules }, { path }) => {`
6. `src/editor/explorer/explorer.ts:148` `if (typeof path !== 'string' || path === '') throw new Error('files.open: a door hands the path of the file it opens');` — R1.
7. `src/editor/explorer/explorer.ts:149` `if (fileRows(state.document, rules).every((row) => row.path !== path)) return { kind: 'refused', message: message('status.files.missing', { path }) };` — R2 [lê: EST-L01-030 via fileRows]
8. `src/editor/explorer/explorer.ts:77` `export function fileRows(document: DocumentJson, rules: ModelRules): readonly FileRow[] {`
9. `src/editor/explorer/explorer.ts:150` `const ui = openedFile(state.ui, path);` — [lê: EST-L01-037 via openedFile]
10. `src/editor/explorer/file-tabs.ts:25` `export function openedFile(ui: EditorUi, path: string): EditorUi {`
11. `src/editor/explorer/file-tabs.ts:27` `const open = tabs === null || tabs.open.includes(path) ? tabs?.open ?? [path] : [...tabs.open, path];`
12. `src/editor/explorer/explorer.ts:151` `return { kind: 'change', ui: editorView(state.ui) === 'split' ? ui : { ...ui, editorView: 'code' }, message: message('status.files.opened', { path }) };` — R3.
13. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run]
14. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
15. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-037 via publish]
16. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-037 via publish]
17. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/editor/explorer/explorer.ts:148` `if (typeof path !== 'string' || path === '')` — argumento não texto ou vazio: lança; texto com valor: segue.
- R2 `src/editor/explorer/explorer.ts:149` `if (fileRows(state.document, rules).every((row) => row.path !== path))` — caminho fora da árvore: `refused` com `status.files.missing`; na árvore: segue.
- R3 `src/editor/explorer/explorer.ts:151` `ui: editorView(state.ui) === 'split' ? ui : { ...ui, editorView: 'code' }` — o centro em modo dividido: só os tabs mudam; outra vista: o centro passa a mostrar o código.
- R4 `src/editor/explorer/file-tabs.ts:27` `const open = tabs === null || tabs.open.includes(path) ? tabs?.open ?? [path] : [...tabs.open, path];` — arquivo já aberto: é mostrado, não reaberto; novo: entra na lista `open`.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/editor/explorer/explorer.ts:147` `({ state, rules }, { path }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via run, handlerContext, fileRows, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via handlerContext, openedFile), EST-L01-002 (os ouvintes, via publish)
- escreve: EST-L01-037 (os campos `ui.code` e `ui.editorView`, via run, publish)

## Resultado

- **Estado final:** EST-L01-037 — `ui.code.open` ganha o caminho e `ui.code.active` nomeia-o; `ui.editorView` passa a `code` fora do modo dividido (`src/editor/explorer/explorer.ts:151`). O documento não muda (o comando não é undoable: `manifest/commands/files.json:791` `"undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a faixa de abas desenha os arquivos abertos (`src/editor/shell/canvas.tsx:44` `const code = useEditorState((s) => codeTabs(s.ui)?.open ?? NO_CODE);`).
- **DOM do canvas:** o quadro mostra a página aberta; nada muda quando o centro só troca para o código (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — o comando escreve `ui.code` e `ui.editorView`, fora de qualquer camada de estilo (`src/editor/explorer/explorer.ts:151`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/explorer/explorer.ts:145` `export const openFile = registerHandler<'files.open', EditorUi>(` — as duas portas chegam ao mesmo tratador.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/editor/explorer/explorer.ts:151`).
- G5: n/a — o comando não desenha painel nem controle (`src/editor/explorer/explorer.ts:151`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda `ui.code`/`ui.editorView`; o documento não muda e a igualdade de render é do renderizador (`src/core/store/store.ts:321` `if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento não muda e o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/editor/explorer/explorer.ts:147`).

## Medições

- nenhuma
