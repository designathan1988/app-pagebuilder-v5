# TRC-files.createFolder

- **Chamada:** `src/app/commands.ts:301` `'files.createFolder': createFolderCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ path }`, com o campo `path` (args.path, tipo `path`); a porta explorer-new-folder envia o caminho digitado (`src/editor/shell/sidebar/explorer.tsx:200`).
- **Ramos que dependem dos argumentos:** R1 (`path` vazio lança), R2 (o `path` decide a recusa: nome inválido, caminho gerado, nome tomado ou pasta-mãe ausente).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/files/files.ts:443` `export const createFolderCommand = registerHandler('files.createFolder', ({ state }, { path }) => {` — o tratador.
5. `src/core/files/files.ts:444` `const wanted = String(path ?? '').trim().replace(/^\/+|\/+$/g, '');`
6. `src/core/files/files.ts:445` `if (wanted === '') throw new Error('files.createFolder: a door hands the path of the folder it makes');` — R1.
7. `src/core/files/files.ts:446` `const refusal = makingRefusal(state.document, wanted);` — [lê: EST-L01-030 via makingRefusal]
8. `src/core/files/files.ts:428` `function makingRefusal(document: DocumentJson, path: string): Message | null {`
9. `src/core/files/files.ts:429` `if (projectPathProblem(path) !== null) return message('status.files.badName', { name: path });`
10. `src/core/files/path-rule.ts:5` `export function projectPathProblem(path: string): string | null {`
11. `src/core/files/files.ts:430` `if (pathGenerated(path)) return message('status.files.generatedPath', { path });`
12. `src/core/files/files.ts:431` `if (pathTaken(document, path)) return message('status.files.nameTaken', { path, name: nameOfPath(path) });`
13. `src/core/files/files.ts:309` `export function pathTaken(document: DocumentJson, path: string): boolean {`
14. `src/core/files/files.ts:433` `if (above !== '' && !folderPaths(document).includes(above)) return message('status.files.nameTaken', { path, name: nameOfPath(path) });`
15. `src/core/files/files.ts:447` `if (refusal !== null) return { kind: 'refused' as const, message: refusal };` — R2.
16. `src/core/files/files.ts:448` `return { kind: 'change' as const, patches: [{ op: 'add', path: ['folders'], value: [...(state.document.folders ?? []), wanted] }], message: message('status.files.folderCreated', { name: nameOfPath(wanted) }) };`
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
20. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos

- R1 `src/core/files/files.ts:445` `if (wanted === '')` — caminho vazio: lança; com caminho: segue.
- R2 `src/core/files/files.ts:429` `if (projectPathProblem(path) !== null)` — parte vazia, "." ou ".." ou caractere proibido: `status.files.badName`; válido: segue.
- R3 `src/core/files/files.ts:430` `if (pathGenerated(path))` — caminho de um arquivo gerado: `status.files.generatedPath`; livre: segue.
- R4 `src/core/files/files.ts:431` `if (pathTaken(document, path))` — arquivo, pasta ou página já ali: `status.files.nameTaken`; livre: segue.
- R5 `src/core/files/files.ts:433` `if (above !== '' && !folderPaths(document).includes(above))` — pasta-mãe ausente: `status.files.nameTaken`; presente ou raiz: `makingRefusal` devolve nulo (`src/core/files/files.ts:434`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/files/files.ts:443` `export const createFolderCommand = registerHandler('files.createFolder', ({ state }, { path }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via run, handlerContext, makingRefusal, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-030 — `document.folders` ganha o caminho novo (`src/core/files/files.ts:448`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a árvore de arquivos deriva de `document.folders` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** nada muda — o comando escreve `folders`, que o canvas não desenha (`src/core/files/files.ts:448` `patches: [{ op: 'add', path: ['folders'], value: [...(state.document.folders ?? []), wanted] }]`).

## Regras

- G1: n/a — o patch escreve `folders`, fora de qualquer camada de estilo (`src/core/files/files.ts:448`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/files/files.ts:443` `export const createFolderCommand = registerHandler('files.createFolder', ({ state }, { path }) => {` — o único tratador; a porta envia só a intenção.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/files/files.ts:448`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/files/files.ts:448`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite um patch aplicado pela store (`src/core/files/files.ts:448`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/files/files.ts:443`).

## Medições

- nenhuma
