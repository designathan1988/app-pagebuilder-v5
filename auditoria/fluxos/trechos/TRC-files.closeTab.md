# TRC-files.closeTab

- **Chamada:** `src/app/commands.ts:308` `'files.closeTab': closeFileTab,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ path }`, com o campo `path` (args.path, tipo `path`); a porta file-tab-close envia o caminho do arquivo que fecha.
- **Ramos que dependem dos argumentos:** R1 (`path` não texto ou vazio lança), R2 (`path` de arquivo não aberto nada muda), R3 (o último arquivo fecha o painel e a vista volta).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/editor/explorer/file-tabs.ts:45` `export const closeFileTab = registerHandler<'files.closeTab', EditorUi>(` — o tratador.
5. `src/editor/explorer/file-tabs.ts:47` `({ state }, { path }) => {`
6. `src/editor/explorer/file-tabs.ts:48` `if (typeof path !== 'string' || path === '') throw new Error('files.closeTab: a door hands the path of the file it closes');` — R1.
7. `src/editor/explorer/file-tabs.ts:49` `if (!isFileOpen(state.ui, path)) return { kind: 'change' };` — R2 [lê: EST-L01-037 via isFileOpen]
8. `src/editor/explorer/file-tabs.ts:17` `const isFileOpen = (ui: EditorUi, path: string): boolean => codeTabs(ui)?.open.includes(path) === true;`
9. `src/editor/explorer/file-tabs.ts:50` `const ui = closedFile(state.ui, path);` — [lê: EST-L01-037 via closedFile]
10. `src/editor/explorer/file-tabs.ts:33` `function closedFile(ui: EditorUi, path: string): EditorUi {`
11. `src/editor/explorer/file-tabs.ts:39` `if (open.length === 0) return { ...ui, code: undefined };` — R3a, fecha o painel.
12. `src/editor/explorer/file-tabs.ts:40` `const active = tabs.active === path ? (open[Math.min(at, open.length - 1)] ?? open[0] ?? '') : tabs.active;` — R3b.
13. `src/editor/explorer/file-tabs.ts:52` `return { kind: 'change', ui: ui.code === undefined && editorView(ui) === 'code' ? { ...ui, editorView: undefined } : ui, message: message('status.files.closed', { path }) };` — R3c.
14. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run]
15. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
16. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-037 via publish]
17. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-037 via publish]
18. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/editor/explorer/file-tabs.ts:48` `if (typeof path !== 'string' || path === '')` — argumento não texto ou vazio: lança; texto com valor: segue.
- R2 `src/editor/explorer/file-tabs.ts:49` `if (!isFileOpen(state.ui, path))` — arquivo não aberto: devolve `change` sem mudança; aberto: segue.
- R3a `src/editor/explorer/file-tabs.ts:39` `if (open.length === 0)` — era o último arquivo: `ui.code` fica indefinido e o painel fecha; restam outros: segue.
- R3b `src/editor/explorer/file-tabs.ts:40` `const active = tabs.active === path ? (open[Math.min(at, open.length - 1)] ?? open[0] ?? '') : tabs.active;` — fechou o ativo: o ativo passa ao vizinho; outro: o ativo fica.
- R3c `src/editor/explorer/file-tabs.ts:52` `ui.code === undefined && editorView(ui) === 'code' ? { ...ui, editorView: undefined } : ui` — o último arquivo fechou e a vista era `code`: o centro volta ao canvas; senão: `ui` como está.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/editor/explorer/file-tabs.ts:47` `({ state }, { path }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via run, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via handlerContext, isFileOpen, closedFile), EST-L01-002 (os ouvintes, via publish)
- escreve: EST-L01-037 (os campos `ui.code` e `ui.editorView`, via run, publish)

## Resultado

- **Estado final:** EST-L01-037 — `ui.code.open` sem o caminho; o ativo cai no vizinho ou `ui.code` fica indefinido; `ui.editorView` fica indefinido ao fechar o último (`src/editor/explorer/file-tabs.ts:52`). O documento não muda (o comando não é undoable: `manifest/commands/files.json:867` `"undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a faixa de abas desenha os arquivos que restam (`src/editor/shell/canvas.tsx:44` `const code = useEditorState((s) => codeTabs(s.ui)?.open ?? NO_CODE);`).
- **DOM do canvas:** o quadro do canvas volta quando o último arquivo fecha a vista de código (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — o comando escreve `ui.code` e `ui.editorView`, fora de qualquer camada de estilo (`src/editor/explorer/file-tabs.ts:52`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/explorer/file-tabs.ts:45` `export const closeFileTab = registerHandler<'files.closeTab', EditorUi>(` — o único tratador; a porta envia só a intenção.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/editor/explorer/file-tabs.ts:52`).
- G5: n/a — o comando não desenha painel nem controle (`src/editor/explorer/file-tabs.ts:52`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda `ui.code`/`ui.editorView`; o documento não muda e a igualdade de render é do renderizador (`src/core/store/store.ts:321` `if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento não muda e o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/editor/explorer/file-tabs.ts:47`).

## Medições

- nenhuma
