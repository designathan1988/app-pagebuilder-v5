# TRC-pages.duplicate

- **Chamada:** `src/app/commands.ts:298` `'pages.duplicate': duplicatePageCommandFor<EditorUi>(),`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ page }`, com o campo `page` (args.page, tipo `path`, `refers: page`); a porta explorer-page-duplicate envia o id da página (`manifest/commands/files.json:175` `"args": {}`).
- **Ramos que dependem dos argumentos:** R1 (`page` sem página no documento lança); os demais ramos não mudam com o valor do argumento.

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/project/pages.ts:147` `return registerHandler<'pages.duplicate', Ui>('pages.duplicate', ({ state, ids }, { page }) => {` — o tratador.
5. `src/core/project/pages.ts:148` `const document = state.document;` — [lê: EST-L01-030 via handlerContext]
6. `src/core/project/pages.ts:149` `const at = pageIndex(document.pages, page);`
7. `src/core/project/pages.ts:151` `if (source === undefined) throw new Error(`pages.duplicate: the document has no page ${String(page)}`);` — R1.
8. `src/core/project/pages.ts:153` `const base = source.name.replace(/ \d+$/, '');`
9. `src/core/project/pages.ts:154` `const made = copyPage(document, source, base, () => ids.next() as NodeId);` — [lê: EST-L01-030 via copyPage] [escreve: EST-L01-029 via ids.next]
10. `src/core/project/pages.ts:132` `export function copyPage(document: DocumentJson, source: Page, base: string, next: () => NodeId): Page {` — a cópia da página.
11. `src/core/project/pages.ts:135` `const { name, file } = fresh(document.pages.map((p) => p.name), document.pages.map((p) => p.file), base);` — o nome e o arquivo livres.
12. `src/core/project/pages.ts:137` `const tree = refreshCopiedIdentities(document, [{ source: source.tree, copy: plainCopy }])[0];` — cada nó ganha id próprio e as referências são reparadas.
13. `src/core/project/pages.ts:143` `return { id: next(), name, file, tree: { ...root, name: rootName(document.pages, name) }, ...(source.capture === undefined ? {} : { capture: structuredClone(source.capture) }) };`
14. `src/core/project/pages.ts:157` `const copyOfBase = (name: string): boolean => name.startsWith(`${base} `) && /^\d+$/.test(name.slice(base.length + 1));`
15. `src/core/project/pages.ts:159` `while (place < document.pages.length && copyOfBase(document.pages[place]?.name ?? '')) place += 1;`
16. `src/core/project/pages.ts:162` `const sheet = copiedCaptureSheet(document, source, made);` — [lê: EST-L01-030 via copiedCaptureSheet]
17. `src/core/files/files.ts:366` `export function copiedCaptureSheet(document: DocumentJson, source: Page, copy: Page): ProjectFile | null {`
18. `src/core/project/pages.ts:164` `return { kind: 'change' as const, patches: [{ op: 'add', path: ['pages', place], value: made }, ...sheetPatches], ui: { ...state.ui, page: made.id }, selection: [], message: message('status.pages.duplicated', { name: source.name, copy: made.name, file: made.file }) };`
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
22. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos

- R1 `src/core/project/pages.ts:151` `if (source === undefined)` — o argumento `page` não acha página: lança; acha: segue.
- R2 `src/core/project/pages.ts:158` `let place = at + 1;` — a cópia entra logo depois da origem e das cópias dela (`src/core/project/pages.ts:159`); sem cópias seguintes: entra em `at + 1`.
- R3 `src/core/project/pages.ts:163` `const sheetPatches: Patch[] = sheet === null ? [] : [document.files === undefined ? { op: 'add', path: ['files'], value: [sheet] } : { op: 'add', path: ['files', document.files.length], value: sheet }];` — página sem captura (`sheet` nulo): nenhum patch de arquivo; página capturada: o patch acrescenta a folha residual.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/project/pages.ts:147` `return registerHandler<'pages.duplicate', Ui>('pages.duplicate', ({ state, ids }, { page }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento: a página aberta e as páginas, via copyPage, copiedCaptureSheet, handlerContext)
- escreve: EST-L01-030 (o documento com a cópia em `place`, via run, applyPatches, publish, commit), EST-L01-031 (a seleção vazia, via run), EST-L01-033 (a mensagem, via run), EST-L01-037 (a cópia em `ui.page`, via run), EST-L01-029

## Resultado

- **Estado final:** EST-L01-030 — `document.pages` ganha a cópia em `place` e EST-L01-037 com `ui.page` nomeando-a (`src/core/project/pages.ts:164`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a lista de páginas deriva de `document.pages`; a cópia aparece como linha nova (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** o quadro mostra a cópia aberta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — os patches escrevem `pages` e `files`, fora de qualquer camada de estilo (`src/core/project/pages.ts:164` `patches: [{ op: 'add', path: ['pages', place], value: made }, ...sheetPatches]`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/project/pages.ts:147` `return registerHandler<'pages.duplicate', Ui>('pages.duplicate', ({ state, ids }, { page }) => {` — o único tratador; a porta envia só a intenção.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/project/pages.ts:164`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/project/pages.ts:164`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/project/pages.ts:164`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar; a cópia dá id próprio a cada nó (`src/core/project/pages.ts:137`).

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/project/pages.ts:147`).

## Medições

- nenhuma
