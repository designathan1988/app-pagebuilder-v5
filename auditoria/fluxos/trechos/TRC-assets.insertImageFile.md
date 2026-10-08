# TRC-assets.insertImageFile

- **Chamada:** `src/app/commands.ts:311` `'assets.insertImageFile': insertImageFileCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ file, parent, index, replace }`, com `file` (args.file, tipo `file`), `parent` (args.parent, tipo `node`, opcional), `index` (args.index, tipo `integer`, opcional) e `replace` (args.replace, tipo `node`, opcional); a porta canvas-drag-os-image-file-drop-proposal envia o arquivo, o pai e o índice da soltura ou o nó a substituir (`src/editor/input/file-drop.ts:172`).
- **Ramos que dependem dos argumentos:** R1 (sem arquivo lança), R2 (arquivo de tipo não aceito recusa), R3 (`replace` dado segue a troca da fonte), R4 (`parent`/`index` dados seguem a inserção na posição).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext]
4. `src/core/files/assets.ts:18` `export const insertImageFileCommand = registerHandler('assets.insertImageFile', ({ state, ids, rules, words }, { file, parent, index, replace }) => {` — o tratador.
5. `src/core/files/assets.ts:19` `const list = fileList(file).filter((f) => f !== null && typeof f === 'object');`
6. `src/core/files/assets.ts:21` `if (first === undefined) throw new Error('assets.insertImageFile: no file');` — R1.
7. `src/core/files/assets.ts:22` `const wrong = unsupported(list);` — `unsupported` só lê os tipos dos arquivos recebidos, não a store.
8. `src/core/files/files.ts:124` `export function unsupported(files: readonly UploadedFile[]): UploadedFile | undefined {`
9. `src/core/files/assets.ts:23` `if (wrong !== undefined) return { kind: 'refused' as const, message: message('status.files.unsupportedType', { name: wrong.name }) };` — R2.
10. `src/core/files/assets.ts:24` `const records = recordsFor(state.document, list, undefined);` [lê: EST-L01-030 via recordsFor]
11. `src/core/files/files.ts:128` `export function recordsFor(document: DocumentJson, files: readonly UploadedFile[], folder: string | undefined): ProjectFile[] {`
12. `src/core/files/assets.ts:27` `const held = addRecords(state.document, records);` — os patches dos arquivos.
13. `src/core/files/files.ts:147` `export function addRecords(document: DocumentJson, records: readonly ProjectFile[]): { op: 'add'; path: (string | number)[]; value: unknown }[] {`
14. `src/core/files/assets.ts:29` `const target = replace === undefined || replace === null ? null : locate(state.document, replace as NodeId);` — R3 [lê: EST-L01-030 via locate]
15. `src/core/document/model.ts:290` `export function locate(doc: DocumentJson, id: NodeId): Location | null {`
16. `src/core/files/assets.ts:31` `if (target.node.type !== IMAGE_TYPE) {` — R4.
17. `src/core/files/assets.ts:32` `return { kind: 'refused' as const, message: message('status.assets.notImage', { name: target.node.name }) };`
18. `src/core/files/assets.ts:35` `const lockedImage = lockRefusal(state.document, target.node.id, 'status.locked.edit');` — R5 [lê: EST-L01-030 via lockRefusal]
19. `src/core/nodes/flags.ts:40` `export function lockRefusal(document: DocumentJson, id: NodeId, key: LockedKey): Message | null {`
20. `src/core/files/assets.ts:37` `return {` — o Outcome da substituição; `src/core/files/assets.ts:39` `patches: [...held, { op: 'add' as const, path: [...target.path, 'attributes', 'src'], value: stored.path }],`
21. `src/core/files/assets.ts:44` `const at = placement(state, state.selection, rules, parent as NodeId | undefined, index === undefined ? undefined : Number(index));` — R4 [lê: EST-L01-030 via placement] [lê: EST-L01-031 via placement]
22. `src/core/structure/insert.ts:136` `export function placement(`
23. `src/core/files/assets.ts:45` `if (at === null) throw new Error(`assets.insertImageFile: the document has no node ${String(parent)}`);`
24. `src/core/files/assets.ts:46` `const receiver = at.parent.node;`
25. `src/core/files/assets.ts:47` `const locked = lockRefusal(state.document, receiver.id, 'status.locked.insert');` — R6 [lê: EST-L01-030 via lockRefusal]
26. `src/core/files/assets.ts:48` `if (locked !== null) return { kind: 'refused' as const, message: locked };`
27. `src/core/files/assets.ts:50` `const made = newElement(nodeMaker(state.document, rules, ids, words), IMAGE_TYPE);` [escreve: EST-L01-029 via ids.next]
28. `src/core/structure/node-maker.ts:34` `export function newElement(make: NodeMaker, type: string, children?: (make: NodeMaker) => DocNode[], nameKey?: MessageId): DocNode {`
29. `src/core/files/assets.ts:51` `const node: DocNode = { ...made, attributes: { ...made.attributes, src: stored.path } };`
30. `src/core/files/assets.ts:52` `const refused = placementRefusal(state.document, rules, receiver.id, [node]);` — R7 [lê: EST-L01-030 via placementRefusal]
31. `src/core/elements/content-model.ts:253` `export function placementRefusal(document: DocumentJson, rules: ModelRules, receiver: NodeId, arriving: readonly DocNode[], staying: ReadonlySet<NodeId> = new Set()): Message | null {`
32. `src/core/files/assets.ts:53` `if (refused !== null) return { kind: 'refused' as const, message: refused };`
33. `src/core/files/assets.ts:56` `patches: [...held, { op: 'add' as const, path: [...at.parent.path, 'children', at.index], value: node }],`
34. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`
35. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit]
36. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish]
37. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish]

## Ramos

- R1 `src/core/files/assets.ts:21` `if (first === undefined)` — sem arquivo na lista: lança; com arquivo: segue.
- R2 `src/core/files/assets.ts:23` `if (wrong !== undefined)` — tipo não aceito: `refused` com `status.files.unsupportedType`; aceito: segue.
- R3 `src/core/files/assets.ts:29` `const target = replace === undefined || replace === null ? null : locate(state.document, replace as NodeId);` — `replace` dado e achado: segue pela troca da fonte (`src/core/files/assets.ts:30`); sem `replace` ou não achado: segue pela inserção (`src/core/files/assets.ts:44`).
- R4 `src/core/files/assets.ts:31` `if (target.node.type !== IMAGE_TYPE)` — o nó a substituir não é Image: `refused` com `status.assets.notImage`; é Image: segue.
- R5 `src/core/files/assets.ts:36` `if (lockedImage !== null) return { kind: 'refused' as const, message: lockedImage };` — a imagem ou um ancestral está travado: `refused` com `status.locked.edit`; senão: devolve `change` trocando `src` (`src/core/files/assets.ts:39`).
- R6 `src/core/files/assets.ts:48` `if (locked !== null)` — o receptor está travado: `refused` com `status.locked.insert`; senão: segue.
- R7 `src/core/files/assets.ts:53` `if (refused !== null)` — o receptor não aceita o Image: `refused` com a mensagem de `placementRefusal`; aceita: devolve `change` inserindo o nó (`src/core/files/assets.ts:56`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/files/assets.ts:18` `export const insertImageFileCommand = registerHandler('assets.insertImageFile', ({ state, ids, rules, words }, { file, parent, index, replace }) => {`, sem `await`).

## Estado

- lê: EST-L01-030, EST-L01-031
- escreve: EST-L01-030, EST-L01-029

## Resultado

- **Estado final:** EST-L01-030 — `document.files` ganha o arquivo e o documento ganha o Image que o usa (na posição, `src/core/files/assets.ts:56`; ou trocando o `src` de uma imagem, `src/core/files/assets.ts:39`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** o canvas e as Camadas derivam do documento (`src/core/project/pages.ts:72` `export const pageShown = (state: { readonly document: { readonly pages: readonly Page[] }; readonly ui?: unknown }): Page | null => state.document.pages[openedPage(state)] ?? null;`).
- **DOM do canvas:** o Image novo é desenhado na página aberta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — os patches escrevem `files` e `children`, fora de qualquer camada de estilo (`src/core/files/assets.ts:56`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/files/assets.ts:18` `export const insertImageFileCommand = registerHandler('assets.insertImageFile', ({ state, ids, rules, words }, { file, parent, index, replace }) => {` — a única porta chega a este tratador.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/files/assets.ts:56`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/files/assets.ts:56`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/assets.ts:56`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar; o Image nasce por `newElement` com id próprio (`src/core/files/assets.ts:50`).

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/files/assets.ts:18`).

## Medições

- nenhuma
