# TRC-files.startRename

- **Chamada:** `src/app/commands.ts:303` `'files.startRename': startRenameFile,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ path }`, com o campo `path` (args.path, tipo `path`); a porta explorer-file-name envia o caminho da linha (`manifest/commands/files.json:505` `"id": "explorer-file-name",`).
- **Ramos que dependem dos argumentos:** R1 (`path` não texto lança), R2 (`path` vazio encerra a renomeação).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/editor/explorer/explorer.ts:159` `export const startRenameFile = registerHandler<'files.startRename', EditorUi>(` — o tratador.
5. `src/editor/explorer/explorer.ts:161` `({ state }, { path }) => {`
6. `src/editor/explorer/explorer.ts:162` `if (typeof path !== 'string') throw new Error('files.startRename: a door hands the path of the row it renames');` — R1.
7. `src/editor/explorer/explorer.ts:164` `return { kind: 'change', ui: { ...state.ui, renamingFile: path === '' ? undefined : path } };` — R2/R3, o Outcome.
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run]
9. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-037 via publish]
11. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-037 via publish]
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/editor/explorer/explorer.ts:162` `if (typeof path !== 'string')` — argumento não texto: lança; texto: segue.
- R2 `src/editor/explorer/explorer.ts:164` `return { kind: 'change', ui: { ...state.ui, renamingFile: path === '' ? undefined : path } };` — `path` vazio: `renamingFile` fica indefinido e a renomeação acaba; `path` com valor: `renamingFile` nomeia a linha.
- R3 `src/editor/explorer/explorer.ts:166` `(state, { path }) => state.ui.renamingFile === path,` — o estado atual da porta (a linha é a que se renomeia).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/editor/explorer/explorer.ts:161` `({ state }, { path }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via run, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L01-002 (os ouvintes, via publish)
- escreve: EST-L01-037 (o campo `ui.renamingFile`, via run, publish)

## Resultado

- **Estado final:** EST-L01-037 — `ui.renamingFile` nomeia a linha em renomeação ou fica indefinido (`src/editor/explorer/explorer.ts:164`); o documento não muda.
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a linha desenha o campo do nome no lugar do rótulo (`src/editor/shell/sidebar/explorer.tsx:234` `const renaming = useEditorState((s) => s.ui.renamingFile === row.path);`).
- **DOM do canvas:** nada muda — o comando escreve `ui.renamingFile`, que o canvas não lê (`src/editor/explorer/explorer.ts:164`).

## Regras

- G1: n/a — o comando escreve `ui.renamingFile`, fora de qualquer camada de estilo (`src/editor/explorer/explorer.ts:164`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/explorer/explorer.ts:159` `export const startRenameFile = registerHandler<'files.startRename', EditorUi>(` — o único tratador; a porta envia só a intenção.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/editor/explorer/explorer.ts:164`).
- G5: n/a — o comando não desenha painel nem controle (`src/editor/explorer/explorer.ts:164`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda `ui.renamingFile`; o documento não muda e a igualdade de render é do renderizador (`src/core/store/store.ts:321` `if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento não muda e o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/editor/explorer/explorer.ts:161`).

## Medições

- nenhuma
