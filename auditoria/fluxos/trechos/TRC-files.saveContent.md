# TRC-files.saveContent

- **Chamada:** `src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ path, content }`, com `path` (args.path, tipo `path`) e `content` (args.content, tipo `string`); as três portas (code-panel-save, key-ctrl-s-in-code-editor, code-panel-editor) enviam o caminho e o texto digitado.
- **Ramos que dependem dos argumentos:** R1 (caminho gerado sem arquivo recusa), R2 (caminho sem arquivo recusa), R3 (a extensão do `path` decide se o texto é lido como JavaScript), R4 (`content` igual ao guardado nada muda).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/files/files.ts:513` `export const saveFileContentCommand = registerHandler('files.saveContent', ({ state, rules }, { path, content }) => {` — o tratador.
5. `src/core/files/files.ts:514` `const wanted = String(path ?? '');`
6. `src/core/files/files.ts:515` `const file = fileAt(state.document, wanted);` [lê: EST-L01-030 via fileAt]
7. `src/core/files/files.ts:37` `export function fileAt(document: DocumentJson, path: string): ProjectFile | null {`
8. `src/core/files/files.ts:516` `if (pathGenerated(wanted) && file === null) return { kind: 'refused' as const, message: message('status.files.generatedPath', { path: wanted }) };` — R1.
9. `src/core/files/files.ts:517` `if (file === null) return { kind: 'refused' as const, message: message('status.files.missing', { path: wanted }) };` — R2.
10. `src/core/files/files.ts:518` `const text = String(content ?? '');`
11. `src/core/files/files.ts:519` `const bad = wanted.endsWith('.js') || wanted.endsWith('.mjs') ? javascriptProblem(text) : null;` — R3.
12. `src/core/files/files.ts:539` `export function javascriptProblem(text: string): { readonly line: number; readonly key: MessageId } | null {`
13. `src/core/files/files.ts:570` `new Function(text);` via parseError — o parser do navegador lê o texto.
14. `src/core/files/files.ts:520` `if (bad !== null) return { kind: 'refused' as const, message: message('status.js.invalidAt', { line: bad.line, reason: { key: bad.key } }) };`
15. `src/core/files/files.ts:521` `const bytes = base64Of(text);`
16. `src/core/files/files.ts:529` `function base64Of(text: string): string {`
17. `src/core/files/files.ts:522` `if (bytes === file.bytes) return { kind: 'change' as const, message: message('status.files.saved', { path: wanted }) };` — R4.
18. `src/core/files/files.ts:524` `const index = filesOf(state.document).indexOf(file);`
19. `src/core/files/files.ts:525` `return { kind: 'change' as const, patches: [{ op: 'replace', path: ['files', index, 'bytes'], value: bytes }], message: message('status.files.saved', { path: wanted }) };` — R5.
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
23. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos

- R1 `src/core/files/files.ts:516` `if (pathGenerated(wanted) && file === null)` — caminho gerado sem arquivo guardado (js/interactions.js, css/styles.css): `refused` com `status.files.generatedPath`; senão: segue.
- R2 `src/core/files/files.ts:517` `if (file === null)` — caminho sem arquivo: `refused` com `status.files.missing`; com arquivo: segue.
- R3 `src/core/files/files.ts:519` `wanted.endsWith('.js') || wanted.endsWith('.mjs') ? javascriptProblem(text) : null` — `.js`/`.mjs`: o texto é lido por `javascriptProblem`; outra extensão: `bad` nulo.
- R4 `src/core/files/files.ts:520` `if (bad !== null)` — JavaScript com erro: `refused` com `status.js.invalidAt` e a linha; válido: segue.
- R5 `src/core/files/files.ts:522` `if (bytes === file.bytes)` — conteúdo igual: `change` sem patches; diferente: um patch troca os bytes (`src/core/files/files.ts:525`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/files/files.ts:513` `export const saveFileContentCommand = registerHandler('files.saveContent', ({ state, rules }, { path, content }) => {`, sem `await`); o parser do navegador é chamado por `new Function` de forma síncrona (`src/core/files/files.ts:570` `new Function(text);`).

## Estado

- lê: EST-L01-030 (o documento, via run, handlerContext, fileAt, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-030 — `document.files[index].bytes` toma os bytes novos do texto (`src/core/files/files.ts:525`); conteúdo igual, nada muda.
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** o painel Código relê o arquivo pelo caminho (`src/editor/explorer/explorer.ts:77` `export function fileRows(document: DocumentJson, rules: ModelRules): readonly FileRow[] {`).
- **DOM do canvas:** o quadro mostra a página aberta; um arquivo de texto guardado não muda o desenho (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — o patch escreve `files[].bytes`, fora de qualquer camada de estilo (`src/core/files/files.ts:525`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente do editor de código é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/files/files.ts:513` `export const saveFileContentCommand = registerHandler('files.saveContent', ({ state, rules }, { path, content }) => {` — as três portas chegam ao mesmo tratador.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/files/files.ts:525`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/files/files.ts:525`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite um patch aplicado pela store (`src/core/files/files.ts:525`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/files/files.ts:513`).

## Medições

- nenhuma
