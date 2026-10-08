# TRC-files.delete

- **Chamada:** `src/app/commands.ts:306` `'files.delete': deleteFileCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` (com `confirmed`) e os argumentos `{ path }`, com o campo `path` (args.path, tipo `path`); a porta explorer-delete envia o caminho da linha.
- **Ramos que dependem dos argumentos:** R1 (`path` vazio lança), R2 (o `path` decide a recusa: gerado, ausente, pasta que guarda página, arquivo ligado por página), R3 (pasta que guarda arquivos pede confirmação).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/files/files.ts:491` `export const deleteFileCommand = registerHandler('files.delete', ({ state, confirmed }, { path }) => {` — o tratador.
5. `src/core/files/files.ts:492` `const wanted = String(path ?? '');`
6. `src/core/files/files.ts:493` `if (wanted === '') throw new Error('files.delete: a door hands the path it deletes');` — R1.
7. `src/core/files/files.ts:494` `if (pathGenerated(wanted) || holdsGenerated(wanted)) return { kind: 'refused' as const, message: message('status.files.generatedPath', { path: wanted }) };` — R2a.
8. `src/core/files/files.ts:495` `const isFolder = folderPaths(state.document).includes(wanted);` [lê: EST-L01-030 via folderPaths]
9. `src/core/files/files.ts:496` `if (!isFolder && fileAt(state.document, wanted) === null) return { kind: 'refused' as const, message: message('status.files.missing', { path: wanted }) };` — R2b.
10. `src/core/files/files.ts:498` `const inside = (one: string): boolean => one === wanted || (isFolder && one.startsWith(`${wanted}/`));`
11. `src/core/files/files.ts:499` `if (isFolder && state.document.pages.some((page) => inside(page.file))) return { kind: 'refused' as const, message: message('status.files.holdsPage') };` — R2c.
12. `src/core/files/files.ts:500` `const linked = linkedBy(state.document, wanted);` — R2d [lê: EST-L01-030 via linkedBy]
13. `src/core/files/files.ts:322` `function linkedBy(document: DocumentJson, path: string): readonly Page[] {`
14. `src/core/files/files.ts:501` `if (linked.length > 0) return { kind: 'refused' as const, message: message('status.files.linkedBy', { path: wanted, pages: linked.map((page) => page.name).join(', ') }) };`
15. `src/core/files/files.ts:503` `const holds = isFolder && filesOf(state.document).some((file) => inside(file.path));`
16. `src/core/files/files.ts:504` `if (holds && confirmed !== true) return { kind: 'confirm' as const };` — R3.
17. `src/core/store/store.ts:455` `if (outcome.kind === 'confirm') {`
18. `src/core/store/store.ts:467` `publish(commit({ ...state, confirmation }, id));` — [escreve: EST-L01-034 via publish]
19. `src/core/store/store.ts:690` `answer: (confirmed) => {`; `src/core/store/store.ts:698` `return run(waiting.command, waiting.args as CommandArgs[typeof waiting.command], null, true);` — [lê: EST-L01-034 via answer] [lê: EST-L01-030 via run]
20. `src/core/files/files.ts:505` `const files = filesOf(state.document).filter((file) => !inside(file.path));`
21. `src/core/files/files.ts:506` `const folders = (state.document.folders ?? []).filter((folder) => !inside(folder));`
22. `src/core/files/files.ts:509` `return { kind: 'change' as const, patches, message: message('status.files.deleted', { name: nameOfPath(wanted) }) };`
23. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`
24. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
25. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
26. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos

- R1 `src/core/files/files.ts:493` `if (wanted === '')` — caminho vazio: lança; com caminho: segue.
- R2a `src/core/files/files.ts:494` `if (pathGenerated(wanted) || holdsGenerated(wanted))` — arquivo gerado ou pasta sobre gerado: `status.files.generatedPath`; livre: segue.
- R2b `src/core/files/files.ts:496` `if (!isFolder && fileAt(state.document, wanted) === null)` — não é pasta nem arquivo: `status.files.missing`; existe: segue.
- R2c `src/core/files/files.ts:499` `if (isFolder && state.document.pages.some((page) => inside(page.file)))` — a pasta guarda o arquivo de uma página: `status.files.holdsPage`; não: segue.
- R2d `src/core/files/files.ts:501` `if (linked.length > 0)` — uma página liga o arquivo entre seus scripts: `status.files.linkedBy`; não: segue.
- R3 `src/core/files/files.ts:504` `if (holds && confirmed !== true)` — pasta que guarda arquivos sem confirmação: devolve `confirm` e a store publica a confirmação (`src/core/store/store.ts:446`); confirmado: segue; arquivo solto: segue direto.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/files/files.ts:491` `export const deleteFileCommand = registerHandler('files.delete', ({ state, confirmed }, { path }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via run, handlerContext, folderPaths, linkedBy, commit), EST-L01-031 (a seleção, via commit), EST-L01-034 (a confirmação, via answer), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via publish), EST-L01-033 (a mensagem, via publish), EST-L01-034 (a confirmação, via publish)

## Resultado

- **Estado final:** EST-L01-030 — `document.files` e `document.folders` sem o caminho e o que ele guarda (`src/core/files/files.ts:509`); sem confirmação, `confirmation` fica com o pedido (`src/core/store/store.ts:446`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a árvore de arquivos deriva de `document` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** nada muda — o comando escreve `files`/`folders`, sem nós novos no documento (`src/core/files/files.ts:509`).

## Regras

- G1: n/a — os patches escrevem `files` e `folders`, fora de qualquer camada de estilo (`src/core/files/files.ts:507` `const patches: Patch[] = [{ op: 'replace', path: ['files'], value: files }];`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/files/files.ts:491` `export const deleteFileCommand = registerHandler('files.delete', ({ state, confirmed }, { path }) => {` — o único tratador; a porta envia só a intenção.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/files/files.ts:509`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/files/files.ts:509`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/files.ts:509`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/files/files.ts:491`).

## Medições

- nenhuma
