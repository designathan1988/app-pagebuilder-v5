# TRC-files.createFile

- **Chamada:** `src/app/commands.ts:302` `'files.createFile': createFileCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ path }`, com o campo `path` (args.path, tipo `path`); a porta explorer-new-file envia o caminho digitado (`src/editor/shell/sidebar/explorer.tsx:200`).
- **Ramos que dependem dos argumentos:** R1 (`path` vazio lança), R2 (o `path` decide a recusa: nome inválido, caminho gerado, nome tomado ou pasta-mãe ausente), R3 (a extensão do `path` decide o tipo do arquivo).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/files/files.ts:452` `export const createFileCommand = registerHandler('files.createFile', ({ state }, { path }) => {` — o tratador.
5. `src/core/files/files.ts:453` `const wanted = String(path ?? '').trim().replace(/^\/+|\/+$/g, '');`
6. `src/core/files/files.ts:454` `if (wanted === '') throw new Error('files.createFile: a door hands the path of the file it makes');` — R1.
7. `src/core/files/files.ts:455` `const refusal = makingRefusal(state.document, wanted);` — [lê: EST-L01-030 via makingRefusal]
8. `src/core/files/files.ts:428` `function makingRefusal(document: DocumentJson, path: string): Message | null {`
9. `src/core/files/files.ts:429` `if (projectPathProblem(path) !== null) return message('status.files.badName', { name: path });`
10. `src/core/files/path-rule.ts:5` `export function projectPathProblem(path: string): string | null {`
11. `src/core/files/files.ts:430` `if (pathGenerated(path)) return message('status.files.generatedPath', { path });`
12. `src/core/files/files.ts:431` `if (pathTaken(document, path)) return message('status.files.nameTaken', { path, name: nameOfPath(path) });`
13. `src/core/files/files.ts:309` `export function pathTaken(document: DocumentJson, path: string): boolean {`
14. `src/core/files/files.ts:433` `if (above !== '' && !folderPaths(document).includes(above)) return message('status.files.nameTaken', { path, name: nameOfPath(path) });`
15. `src/core/files/files.ts:456` `if (refusal !== null) return { kind: 'refused' as const, message: refusal };` — R2.
16. `src/core/files/files.ts:457` `const record: ProjectFile = { path: wanted, type: typeOfName(wanted), bytes: '' };` — R3.
17. `src/core/files/files.ts:438` `function typeOfName(path: string): string {`; `src/core/files/files.ts:439` `return typeOfFile(path, 'text/plain');`
18. `src/core/files/files.ts:196` `export function typeOfFile(name: string, fallback = 'application/octet-stream'): string {`
19. `src/core/files/files.ts:458` `return { kind: 'change' as const, patches: [{ op: 'add', path: ['files'], value: [...filesOf(state.document), record] }], message: message('status.files.fileCreated', { name: nameOfPath(wanted) }) };`
20. `src/core/document/model.ts:215` `export function filesOf(document: DocumentJson): readonly ProjectFile[] {`
21. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`
22. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
23. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
24. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos

- R1 `src/core/files/files.ts:454` `if (wanted === '')` — caminho vazio: lança; com caminho: segue.
- R2 `src/core/files/files.ts:456` `if (refusal !== null)` — uma das recusas de `makingRefusal`: devolve `refused`; nenhuma (`src/core/files/files.ts:434` `return null;`): segue.
- R3 `src/core/files/files.ts:439` `return typeOfFile(path, 'text/plain');` — extensão conhecida: o tipo da tabela; desconhecida: `text/plain` (`src/core/files/files.ts:198` `return FILE_TYPES.find((row) => row.extensions.includes(extension))?.type ?? fallback;`).
- R4 `src/core/files/files.ts:149` `if (document.files === undefined) return [{ op: 'add', path: ['files'], value: [...records] }];` — ver `addRecords`; aqui `createFile` acrescenta direto pelo `filesOf`.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/files/files.ts:452` `export const createFileCommand = registerHandler('files.createFile', ({ state }, { path }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via run, handlerContext, makingRefusal, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-030 — `document.files` ganha o arquivo vazio do caminho e do tipo pedidos (`src/core/files/files.ts:458`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a árvore de arquivos deriva de `document.files` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** nada muda — o comando escreve `files`, que o canvas só desenha por um elemento que o use (`src/core/files/files.ts:458` `patches: [{ op: 'add', path: ['files'], value: [...filesOf(state.document), record] }]`).

## Regras

- G1: n/a — o patch escreve `files`, fora de qualquer camada de estilo (`src/core/files/files.ts:458`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/files/files.ts:452` `export const createFileCommand = registerHandler('files.createFile', ({ state }, { path }) => {` — o único tratador; a porta envia só a intenção.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/files/files.ts:458`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/files/files.ts:458`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite um patch aplicado pela store (`src/core/files/files.ts:458`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/files/files.ts:452`).

## Medições

- nenhuma
