# TRC-pages.rename

- **Chamada:** `src/app/commands.ts:297` `'pages.rename': renamePageCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ page, name }`, com `page` (args.page, tipo `path`, `refers: page`) e `name` (args.name, tipo `string`); a porta explorer-page-name-field envia `{ page: page.tree.id, name }` (`src/editor/shell/sidebar/explorer.tsx:84`).
- **Ramos que dependem dos argumentos:** R1 (`name` vazio recusa), R2 (`name` igual ao atual não muda nada), R3 (`name` já tomado recusa).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/project/pages.ts:101` `export const renamePageCommand = registerHandler('pages.rename', ({ state, rules }, { page, name }) => {` — o tratador.
5. `src/core/project/pages.ts:102` `const document = state.document;` — [lê: EST-L01-030 via handlerContext]
6. `src/core/project/pages.ts:103` `const at = pageIndex(document.pages, page);` — a página indicada pelo argumento `page`.
7. `src/core/project/pages.ts:105` `const typed = typeof name === 'string' ? name.trim() : '';`
8. `src/core/project/pages.ts:107` `if (typed === '') return { kind: 'refused' as const, message: argumentRefused('name') };` — R1.
9. `src/core/project/pages.ts:108` `if (held.name === typed) return { kind: 'change' as const, message: message('status.pages.renamed', { name: typed }) };` — R2, nada muda no documento.
10. `src/core/project/pages.ts:109` `if (document.pages.some((p, i) => i !== at && p.name === typed)) return { kind: 'refused' as const, message: message('status.pages.nameTaken', { name: typed }) };` — R3.
11. `src/core/project/pages.ts:112` `const folder = held.file.includes('/') ? held.file.slice(0, held.file.lastIndexOf('/') + 1) : '';`
12. `src/core/project/pages.ts:113` `const wanted = `${folder}${pageFile(typed)}`;`
13. `src/core/project/pages.ts:116` `const free = held.file !== HOME && !held.file.endsWith(`/${HOME}`) && wanted !== HOME && !pathTaken(document, wanted);` — [lê: EST-L01-030 via pathTaken]
14. `src/core/project/pages.ts:117` `const patches: Patch[] = [{ op: 'replace', path: ['pages', at, 'name'], value: typed }];`
15. `src/core/project/pages.ts:120` `const root = rootName(document.pages.filter((_, i) => i !== at), typed);`
16. `src/core/project/pages.ts:121` `if (held.tree.name !== root) patches.push({ op: 'replace', path: ['pages', at, 'tree', 'name'], value: root });`
17. `src/core/project/pages.ts:124` `if (free && held.file !== wanted) patches.push(...pathMovePatches(document, rules, held.file, wanted));` — [lê: EST-L01-030 via pathMovePatches]
18. `src/core/files/files.ts:411` `export function pathMovePatches(document: DocumentJson, rules: ModelRules, from: string, to: string): Patch[] {` — os patches que levam página, arquivos e usuários juntos.
19. `src/core/project/pages.ts:125` `return { kind: 'change' as const, patches, message: message('status.pages.renamed', { name: typed }) };`
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
23. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos

- R1 `src/core/project/pages.ts:107` `if (typed === '')` — nome vazio: `refused` com `argumentRefused('name')`; nome preenchido: segue.
- R2 `src/core/project/pages.ts:108` `if (held.name === typed)` — nome igual ao da página: devolve `change` sem patches (`src/core/project/pages.ts:108`); nome diferente: segue para o resto.
- R3 `src/core/project/pages.ts:109` `if (document.pages.some((p, i) => i !== at && p.name === typed))` — outra página com o nome: `refused` com `status.pages.nameTaken`; livre: segue.
- R4 `src/core/project/pages.ts:116` `const free = held.file !== HOME && !held.file.endsWith(`/${HOME}`) && wanted !== HOME && !pathTaken(document, wanted);` — arquivo da página inicial ou destino tomado: `free` falso, o arquivo não se move (`src/core/project/pages.ts:124`); livre: o arquivo e seus usuários seguem o nome.
- R5 `src/core/project/pages.ts:121` `if (held.tree.name !== root)` — a raiz precisa de outro nome: acrescenta o patch do nome da raiz; senão não.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/project/pages.ts:101` `export const renamePageCommand = registerHandler('pages.rename', ({ state, rules }, { page, name }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento: a página, os caminhos tomados, via pathTaken, pathMovePatches, handlerContext)
- escreve: EST-L01-030 (o documento: `pages[at].name` e os caminhos dos usuários, via run, applyPatches, publish, commit), EST-L01-031 (a seleção, via run, commit), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-030 — `pages[at].name` e, quando muda, `pages[at].tree.name` e os caminhos dos usuários (`src/core/project/pages.ts:117`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a linha da página mostra o nome novo (`src/editor/shell/sidebar/explorer.tsx:70` `if (input.current !== null && document.activeElement !== input.current) input.current.value = page.name;`).
- **DOM do canvas:** o quadro mostra a página aberta (nada muda quando a página aberta não é a renomeada) (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — os patches escrevem `pages[].name` e `pages[].tree.name`, fora de qualquer camada de estilo (`src/core/project/pages.ts:117` `const patches: Patch[] = [{ op: 'replace', path: ['pages', at, 'name'], value: typed }];`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes de o comando mudar o documento (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/project/pages.ts:101` `export const renamePageCommand = registerHandler('pages.rename', ({ state, rules }, { page, name }) => {` — o único tratador; a porta envia só a intenção.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/project/pages.ts:117`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/project/pages.ts:117`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/project/pages.ts:125`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/project/pages.ts:101`).

## Medições

- nenhuma
