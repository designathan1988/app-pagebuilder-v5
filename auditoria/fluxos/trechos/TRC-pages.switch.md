# TRC-pages.switch

- **Chamada:** `src/app/commands.ts:300` `'pages.switch': SWITCH_PAGE,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ page }`, com o campo `page` (args.page, tipo `path`, `refers: page`); as quatro portas (explorer-page-row, file-tab, toolbar-top-bar-page-switcher, command-bar-go-to-page) enviam o id da página.
- **Ramos que dependem dos argumentos:** R1 (`page` sem página lança); R2 (`page` da página já aberta não muda a interface); os demais ramos dependem do argumento pela página que ele nomeia.

## Passos

1. `src/app/commands.ts:148` `const SWITCH_PAGE = switchPageCommand<EditorUi>();` — o tratador ligado à store do editor.
2. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
3. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run] [lê: EST-L01-037 via run]
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
5. `src/core/project/pages.ts:218` `return registerHandler<'pages.switch', Ui>(` — o tratador.
6. `src/core/project/pages.ts:220` `({ state }, { page }) => {`
7. `src/core/project/pages.ts:221` `const at = pageIndex(state.document.pages, page);` — [lê: EST-L01-030 via pageIndex]
8. `src/core/project/pages.ts:223` `if (held === undefined) throw new Error(`pages.switch: the document has no page ${String(page)}`);` — R1.
9. `src/core/project/pages.ts:224` `const said = message('status.pages.opened', { name: held.name });`
10. `src/core/project/pages.ts:225` `if (openedPage(state) === at) return { kind: 'change' as const, message: said };` — R2.
11. `src/core/project/pages.ts:64` `export function openedPage(state: { readonly document: { readonly pages: readonly Page[] }; readonly ui?: unknown }): number {` — a página que o editor mostra.
12. `src/core/project/pages.ts:228` `return { kind: 'change' as const, ui: { ...state.ui, page: held.id }, selection: [], message: said };` — R3, o Outcome.
13. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run]
14. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
15. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
16. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
17. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/project/pages.ts:223` `if (held === undefined)` — sem página para o argumento: lança; com página: segue.
- R2 `src/core/project/pages.ts:225` `if (openedPage(state) === at)` — a página já é a aberta: devolve `change` só com a mensagem, sem mudar `ui.page`; não é a aberta: segue para `src/core/project/pages.ts:228`.
- R3 `src/core/project/pages.ts:228` `return { kind: 'change' as const, ui: { ...state.ui, page: held.id }, selection: [], message: said };` — `ui.page` passa a nomear a página e a seleção fica vazia (o painel e as alças deixam o nó da página que sai).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/project/pages.ts:220` `({ state }, { page }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento: a página, via pageIndex, handlerContext), EST-L01-037 (a página aberta em `ui.page`, via openedPage, handlerContext)
- escreve: EST-L01-031 (a seleção vazia, via run, publish), EST-L01-033 (a mensagem, via run, publish), EST-L01-037 (a página aberta em `ui.page`, via run, publish)

## Resultado

- **Estado final:** EST-L01-037 — `ui.page` nomeia a página escolhida e EST-L01-031 com a seleção vazia (`src/core/project/pages.ts:228`); o documento não muda (o comando não é undoable: `manifest/commands/files.json:260` `"undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a linha da página aberta é realçada (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** o quadro mostra a página escolhida (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — o comando escreve `ui.page` e a seleção, fora de qualquer camada de estilo (`src/core/project/pages.ts:228`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/project/pages.ts:218` `return registerHandler<'pages.switch', Ui>(` — as quatro portas chegam ao mesmo tratador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/project/pages.ts:228`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/project/pages.ts:228`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda `ui.page`; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento não muda e o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/project/pages.ts:220`).

## Medições

- nenhuma
