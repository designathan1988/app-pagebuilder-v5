# TRC-files.rename

- **Chamada:** `src/app/commands.ts:304` `'files.rename': renameFileCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ path, name }`, com `path` (args.path, tipo `path`) e `name` (args.name, tipo `string`); a porta explorer-file-name-field envia `{ path: row.path, name: wanted }` (`src/editor/shell/sidebar/explorer.tsx:243`).
- **Ramos que dependem dos argumentos:** R1 (`path` ou `name` vazio recusa), R2 (o par `path`/`name` decide a recusa: nome inválido, caminho gerado, tomado, arquivo de página fora do .html, página inicial).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/files/files.ts:462` `export const renameFileCommand = registerHandler('files.rename', ({ state, rules }, { path, name }) => {` — o tratador.
5. `src/core/files/files.ts:463` `const from = String(path ?? '');`
6. `src/core/files/files.ts:464` `const typed = String(name ?? '').trim();`
7. `src/core/files/files.ts:465` `if (from === '' || typed === '') return { kind: 'refused' as const, message: argumentRefused(from === '' ? 'path' : 'name') };` — R1.
8. `src/core/files/files.ts:466` `const to = pathIn(folderOf(from), typed);`
9. `src/core/files/files.ts:289` `const pathIn = (folder: string, name: string): string => (folder === '' ? name : `${folder}/${name}`);`
10. `src/core/files/files.ts:467` `const refusal = renameRefusal(state.document, from, to);` — [lê: EST-L01-030 via renameRefusal]
11. `src/core/files/files.ts:374` `function renameRefusal(document: DocumentJson, from: string, to: string): Message | null {`
12. `src/core/files/files.ts:376` `if (projectPathProblem(to) !== null) return message('status.files.badName', { name: nameOfPath(to) });`
13. `src/core/files/files.ts:378` `if (fixed(from) || fixed(to)) return message('status.files.generatedPath', { path: pathGenerated(from) || holdsGenerated(from) ? from : to });`
14. `src/core/files/files.ts:381` `if (!to.startsWith(`${from}/`) && pathTaken(document, to)) return message('status.files.nameTaken', { path: to, name: nameOfPath(to) });`
15. `src/core/files/files.ts:382` `const moves = movedPaths(document, from, to);`
16. `src/core/files/files.ts:385` `for (const folder of moves.folders) if (folder !== to && clashes(folder)) return message('status.files.nameTaken', { path: folder, name: nameOfPath(folder) });`
17. `src/core/files/files.ts:389` `for (const page of moves.pages) if (!/\.html?$/i.test(page.file)) return message('status.files.pageNeedsHtml', { name: nameOfPath(page.file) });`
18. `src/core/files/files.ts:391` `if (home >= 0 && moves.pages.some((one) => one.index === home && one.file !== 'index.html')) return message('status.pages.homeUndeletable');`
19. `src/core/files/files.ts:468` `if (refusal !== null) return { kind: 'refused' as const, message: refusal };` — R2.
20. `src/core/files/files.ts:469` `return { kind: 'change' as const, patches: pathMovePatches(state.document, rules, from, to), message: message('status.files.renamed', { name: typed }) };`
21. `src/core/files/files.ts:411` `export function pathMovePatches(document: DocumentJson, rules: ModelRules, from: string, to: string): Patch[] {`
22. `src/core/files/files.ts:412` `return [...patchesForMoves(document, movedPaths(document, from, to)), ...followMove(document, rules, from, to)];`
23. `src/core/files/files.ts:397` `function followMove(document: DocumentJson, rules: ModelRules, from: string, to: string): Patch[] {`
24. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`
25. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
26. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
27. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos

- R1 `src/core/files/files.ts:465` `if (from === '' || typed === '')` — caminho ou nome vazio: `refused` com o argumento que faltou; preenchidos: segue.
- R2 `src/core/files/files.ts:468` `if (refusal !== null)` — uma das recusas de `renameRefusal` (R3 a R7): devolve `refused`; nenhuma (`src/core/files/files.ts:392` `return null;`): segue.
- R3 `src/core/files/files.ts:376` — destino com parte vazia, "." ou ".." ou caractere proibido: `status.files.badName`.
- R4 `src/core/files/files.ts:378` — origem ou destino gerado (ou pasta sobre gerado): `status.files.generatedPath`.
- R5 `src/core/files/files.ts:381` — destino já tomado por outro: `status.files.nameTaken`.
- R6 `src/core/files/files.ts:385` `for (const folder of moves.folders)` — pasta, arquivo ou página movidos para um caminho tomado: `status.files.nameTaken`.
- R7 `src/core/files/files.ts:389` — arquivo de página que deixa de ser `.html`/`.htm`: `status.files.pageNeedsHtml`; `src/core/files/files.ts:391` — a página inicial deixando `index.html`: `status.pages.homeUndeletable`.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/files/files.ts:462` `export const renameFileCommand = registerHandler('files.rename', ({ state, rules }, { path, name }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via run, handlerContext, renameRefusal, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-030 — `document.files`, `document.folders` e `document.pages[].file` tomam os caminhos novos em `pathMovePatches` (`src/core/files/files.ts:412`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a árvore de arquivos deriva de `document` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** o quadro mostra a página aberta; nada muda quando o arquivo renomeado não é o de uma página aberta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — os patches escrevem `files`, `folders` e `pages[].file`, fora de qualquer camada de estilo (`src/core/files/files.ts:469`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/files/files.ts:462` `export const renameFileCommand = registerHandler('files.rename', ({ state, rules }, { path, name }) => {` — o único tratador; a porta envia só a intenção.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/files/files.ts:469`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/files/files.ts:469`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/files.ts:412`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar; os usuários do caminho seguem com ele (`src/core/files/files.ts:412`).

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/files/files.ts:462`).

## Medições

- nenhuma
