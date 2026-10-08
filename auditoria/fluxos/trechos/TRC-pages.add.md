# TRC-pages.add

- **Chamada:** `src/app/commands.ts:296` `'pages.add': addPageCommand<EditorUi>(),`
- **Argumentos:** o tratador recebe `HandlerContext<Ui>` e os argumentos `{ name }`, com o campo `name` (`manifest/commands/files.json:10` `"name": {`, tipo `string`); a porta explorer-add-page envia `{ name: "" }` (`manifest/commands/files.json:57` `"name": ""`).
- **Ramos que dependem dos argumentos:** R1 (`name` vazio ou só espaços toma o nome padrão), R2 (`name` preenchido e já tomado é recusado).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/project/pages.ts:88` `return registerHandler<'pages.add', Ui>('pages.add', ({ state, ids, rules, words }, { name }) => {` — o tratador.
5. `src/core/project/pages.ts:89` `const document = state.document;` — [lê: EST-L01-030 via handlerContext]
6. `src/core/project/pages.ts:90` `const given = typeof name === 'string' && name.trim() !== '';` — R1.
7. `src/core/project/pages.ts:91` `const typed = given ? name.trim() : words('pages.defaultName');`
8. `src/core/project/pages.ts:93` `if (given && document.pages.some((p) => p.name === typed)) return { kind: 'refused' as const, message: message('status.pages.nameTaken', { name: typed }) };` — R2, recusa.
9. `src/core/project/pages.ts:94` `const { name: chosen, file } = fresh(document.pages.map((p) => p.name), document.pages.map((p) => p.file), typed);` — [lê: EST-L01-030 via fresh]
10. `src/core/project/pages.ts:41` `function fresh(names: readonly string[], files: readonly string[], base: string): { readonly name: string; readonly file: string } {` — laço do primeiro nome e arquivo livres.
11. `src/core/project/pages.ts:33` `const words = slug(name);` via pageFile; `src/core/text/fold.ts:9` `export const slug = (text: string): string => fold(text).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');`
12. `src/core/project/pages.ts:95` `const root: DocNode = { id: ids.next(), type: rules.root.type, name: rootName(document.pages, chosen), tag: rules.root.tag, attributes: {}, classes: [], styles: {}, text: null, children: [] };` — [escreve: EST-L01-029 via ids.next]
13. `src/core/project/pages.ts:77` `function rootName(pages: readonly Page[], base: string): string {` — o nome único da raiz.
14. `src/core/project/pages.ts:96` `const made: Page = { id: ids.next(), name: chosen, file, tree: root };` — [escreve: EST-L01-029 via ids.next]
15. `src/core/project/pages.ts:97` `return { kind: 'change' as const, patches: [{ op: 'add', path: ['pages', document.pages.length], value: made }], ui: { ...state.ui, page: made.id }, selection: [], message: message('status.pages.added', { name: chosen, file }) };` — o Outcome `change`.
16. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a página entra no documento novo.
17. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run]
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
20. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
21. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos

- R1 `src/core/project/pages.ts:90` `const given = typeof name === 'string' && name.trim() !== '';` — `name` vazio ou só espaços: `given` falso, o nome vem de `words('pages.defaultName')` (`src/core/project/pages.ts:91`); `name` preenchido: `given` verdadeiro e `typed` é o nome digitado.
- R2 `src/core/project/pages.ts:93` `if (given && document.pages.some((p) => p.name === typed))` — outra página com o mesmo nome: devolve `refused` com `status.pages.nameTaken`; sem outra página com o nome: segue para `fresh` (`src/core/project/pages.ts:94`).
- R3 `src/core/project/pages.ts:45` `if (!names.includes(name) && !files.includes(file)) return { name, file };` — nome e arquivo livres: `fresh` devolve o par; tomados: o laço acrescenta o número (`src/core/project/pages.ts:42` `for (let n = 1; ; n += 1) {`).
- R4 `src/core/project/pages.ts:79` `if (!taken.includes(base)) return base;` — base livre entre as raízes: `rootName` devolve `base`; tomada: numera a partir do radical (`src/core/project/pages.ts:83`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/project/pages.ts:88` `return registerHandler<'pages.add', Ui>('pages.add', ({ state, ids, rules, words }, { name }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via fresh, handlerContext)
- escreve: EST-L01-030 (o documento: a página nova em `document.pages`, via run, applyPatches, publish, commit), EST-L01-031 (a seleção vazia, via run), EST-L01-033 (a mensagem, via run), EST-L01-037 (a página nova em `ui.page`, via run), EST-L01-029

## Resultado

- **Estado final:** EST-L01-030 — `document.pages` ganha a página nova no fim (`src/core/project/pages.ts:97`) e EST-L01-037 com `ui.page` nomeando-a.
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a lista de páginas do explorador deriva de `document.pages` e realça a aberta (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** o quadro mostra a página aberta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — os patches escrevem `pages` e `pages[].tree`, fora de qualquer camada de estilo (`src/core/project/pages.ts:97` `patches: [{ op: 'add', path: ['pages', document.pages.length], value: made }]`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — com `changesDocument` verdadeiro a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/project/pages.ts:88` `return registerHandler<'pages.add', Ui>('pages.add', ({ state, ids, rules, words }, { name }) => {` — o único tratador do comando; a porta envia só a intenção.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/project/pages.ts:97` `ui: { ...state.ui, page: made.id }`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/project/pages.ts:97`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/project/pages.ts:97`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/project/pages.ts:88`).

## Medições

- nenhuma
