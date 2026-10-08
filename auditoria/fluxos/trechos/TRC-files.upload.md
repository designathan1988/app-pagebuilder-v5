# TRC-files.upload

- **Chamada:** `src/app/commands.ts:309` `'files.upload': uploadCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ files, folder }`, com `files` (args.files, tipo `file`) e `folder` (args.folder, tipo `path`, opcional); a porta explorer-upload envia os arquivos lidos do seletor e a panel-drag-os-file-explorer-folder envia os arquivos soltos (`src/editor/input/file-drop.ts:74`).
- **Ramos que dependem dos argumentos:** R1 (lista de arquivos vazia lança), R2 (um arquivo de tipo não aceito recusa), R3 (`folder` nomeado usa essa pasta; ausente usa a pasta do tipo).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/files/files.ts:207` `export const uploadCommand = registerHandler('files.upload', ({ state }, { files, folder }) => {` — o tratador.
5. `src/core/files/files.ts:208` `const list = fileList(files).filter((f) => f !== null && typeof f === 'object');`
6. `src/core/files/files.ts:154` `export const fileList = (files: unknown): readonly UploadedFile[] => (Array.isArray(files) ? (files as readonly UploadedFile[]) : [files as UploadedFile]);`
7. `src/core/files/files.ts:209` `if (list.length === 0) throw new Error('files.upload: no file');` — R1.
8. `src/core/files/files.ts:211` `const wrong = list.find((f) => !supportedType(f.type) && !isDataUpload(f));`
9. `src/core/files/files.ts:50` `function supportedType(type: string): boolean {`; `src/core/files/files.ts:205` `const isDataUpload = (file: Pick<UploadedFile, 'name' | 'type'>): boolean => DATA_UPLOAD.test(file.name) || DATA_TYPES.includes(file.type.toLowerCase());`
10. `src/core/files/files.ts:212` `if (wrong !== undefined) return { kind: 'refused' as const, message: message('status.files.unsupportedType', { name: wrong.name }) };` — R2.
11. `src/core/files/files.ts:213` `const records = recordsFor(state.document, list, folder as string | undefined);` — R3 [lê: EST-L01-030 via recordsFor]
12. `src/core/files/files.ts:128` `export function recordsFor(document: DocumentJson, files: readonly UploadedFile[], folder: string | undefined): ProjectFile[] {`
13. `src/core/files/files.ts:132` `const path = uploadPath(held, folder === undefined || folder === '' ? folderFor(file.type) : folder, file.name);` — R3.
14. `src/core/files/files.ts:62` `export function uploadPath(document: DocumentJson, folder: string, name: string): string {` — nome limpo e numerado quando tomado.
15. `src/core/files/files.ts:216` `patches: addRecords(state.document, records),` — os patches que criam o campo `files` ou um registro por arquivo.
16. `src/core/files/files.ts:147` `export function addRecords(document: DocumentJson, records: readonly ProjectFile[]): { op: 'add'; path: (string | number)[]; value: unknown }[] {`
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
20. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos

- R1 `src/core/files/files.ts:209` `if (list.length === 0)` — nenhum arquivo: lança; com arquivos: segue.
- R2 `src/core/files/files.ts:212` `if (wrong !== undefined)` — um arquivo nem suportado nem dado (CSV, TSV, JSON, XLSX): `refused` com `status.files.unsupportedType`; todos aceitos: segue.
- R3 `src/core/files/files.ts:132` `folder === undefined || folder === '' ? folderFor(file.type) : folder` — pasta nomeada pela porta: o caminho entra nela; sem pasta: `folderFor` dá `img/`, `fonts/` ou `files/` (`src/core/files/files.ts:57`).
- R4 `src/core/files/files.ts:66` `for (let n = 2; taken.has(path) || pathGenerated(path); n++) {` — nome tomado ou caminho gerado: `uploadPath` acrescenta `-2`, `-3`…; livre: o nome fica.
- R5 `src/core/files/files.ts:149` `if (document.files === undefined) return [{ op: 'add', path: ['files'], value: [...records] }];` — sem campo `files`: um patch cria o campo; com campo: um patch por registro (`src/core/files/files.ts:151`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/files/files.ts:207` `export const uploadCommand = registerHandler('files.upload', ({ state }, { files, folder }) => {`, sem `await`); os bytes já foram lidos pela porta (`src/core/files/files.ts:160` `export async function readUploadFile(file: File): Promise<UploadedFile> {`).

## Estado

- lê: EST-L01-030 (o documento, via run, handlerContext, recordsFor, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-030 — `document.files` ganha um registro por arquivo, cada um no seu caminho (`src/core/files/files.ts:214`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a árvore de arquivos deriva de `document.files` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** nada muda — o comando escreve `files`, que o canvas só desenha por um elemento que o use (`src/core/files/files.ts:216` `patches: addRecords(state.document, records),`).

## Regras

- G1: n/a — os patches escrevem `files`, fora de qualquer camada de estilo (`src/core/files/files.ts:214`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/files/files.ts:207` `export const uploadCommand = registerHandler('files.upload', ({ state }, { files, folder }) => {` — as duas portas chegam ao mesmo tratador.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/files/files.ts:214`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/files/files.ts:214`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/files.ts:214`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar; `uploadPath` não sobrepõe nome (`src/core/files/files.ts:62`).

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/files/files.ts:207`).

## Medições

- nenhuma
