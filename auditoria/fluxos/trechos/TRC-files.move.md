# TRC-files.move

- **Chamada:** `src/app/commands.ts:305` `'files.move': moveFileCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ path, to }` (o manifesto também declara `distance`, opcional, que o tratador não lê: `manifest/commands/files.json:612` `"distance": {`); `path` e `to` são do tipo `path`. As três portas (panel-drag-explorer-row-folder, explorer-move-to, explorer-move-target) enviam a origem e a pasta.
- **Ramos que dependem dos argumentos:** R1 (`path` vazio lança), R2 (`to` que não é pasta recusa), R3 (o par decide as recusas de `renameRefusal`), R4 (mover para a mesma pasta é um passo que nada muda).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/files/files.ts:473` `export const moveFileCommand = registerHandler('files.move', ({ state, rules }, { path, to }) => {` — o tratador.
5. `src/core/files/files.ts:474` `const from = String(path ?? '');`
6. `src/core/files/files.ts:475` `const folder = String(to ?? '').replace(/^\/+|\/+$/g, '');`
7. `src/core/files/files.ts:476` `if (from === '') throw new Error('files.move: a door hands the path it moves');` — R1.
8. `src/core/files/files.ts:477` `if (folder !== '' && !folderPaths(state.document).includes(folder)) return { kind: 'refused' as const, message: message('status.files.nameTaken', { path: folder, name: nameOfPath(folder) }) };` — R2 [lê: EST-L01-030 via folderPaths]
9. `src/core/files/files.ts:478` `const wanted = pathIn(folder, nameOfPath(from));`
10. `src/core/files/files.ts:479` `const refusal = renameRefusal(state.document, from, wanted);` — [lê: EST-L01-030 via renameRefusal]
11. `src/core/files/files.ts:374` `function renameRefusal(document: DocumentJson, from: string, to: string): Message | null {`
12. `src/core/files/files.ts:376` `if (projectPathProblem(to) !== null) return message('status.files.badName', { name: nameOfPath(to) });`
13. `src/core/files/files.ts:378` `if (fixed(from) || fixed(to)) return message('status.files.generatedPath', { path: pathGenerated(from) || holdsGenerated(from) ? from : to });`
14. `src/core/files/files.ts:389` `for (const page of moves.pages) if (!/\.html?$/i.test(page.file)) return message('status.files.pageNeedsHtml', { name: nameOfPath(page.file) });`
15. `src/core/files/files.ts:480` `if (refusal !== null) return { kind: 'refused' as const, message: refusal };` — R3.
16. `src/core/files/files.ts:481` `const patches = pathMovePatches(state.document, rules, from, wanted);`
17. `src/core/files/files.ts:411` `export function pathMovePatches(document: DocumentJson, rules: ModelRules, from: string, to: string): Patch[] {`
18. `src/core/files/files.ts:484` `if (patches.length === 0) return { kind: 'change' as const };` — R4, nada muda.
19. `src/core/files/files.ts:485` `return { kind: 'change' as const, patches, message: message('status.files.moved', { name: nameOfPath(from), folder: folder === '' ? '/' : folder }) };`
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
23. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos

- R1 `src/core/files/files.ts:476` `if (from === '')` — caminho vazio: lança; com caminho: segue.
- R2 `src/core/files/files.ts:477` `if (folder !== '' && !folderPaths(state.document).includes(folder))` — destino que não é pasta: `refused` com `status.files.nameTaken`; pasta existente ou raiz: segue.
- R3 `src/core/files/files.ts:480` `if (refusal !== null)` — uma das recusas de `renameRefusal`: devolve `refused`; nenhuma (`src/core/files/files.ts:392` `return null;`): segue.
- R4 `src/core/files/files.ts:484` `if (patches.length === 0)` — a linha já está na pasta: devolve `change` sem patches e nada muda; com patches: segue para `src/core/files/files.ts:485`.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/files/files.ts:473` `export const moveFileCommand = registerHandler('files.move', ({ state, rules }, { path, to }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via run, handlerContext, folderPaths, renameRefusal, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-030 — `document.files`, `document.folders` e `document.pages[].file` tomam os caminhos novos (`src/core/files/files.ts:481`); na mesma pasta, nada muda.
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a árvore de arquivos deriva de `document` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** o quadro mostra a página aberta; nada muda quando o arquivo movido não é o de uma página aberta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — os patches escrevem `files`, `folders` e `pages[].file`, fora de qualquer camada de estilo (`src/core/files/files.ts:481`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/files/files.ts:473` `export const moveFileCommand = registerHandler('files.move', ({ state, rules }, { path, to }) => {` — as três portas chegam ao mesmo tratador.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/files/files.ts:485`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/files/files.ts:485`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/files.ts:481`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/files/files.ts:473`).

## Medições

- nenhuma
