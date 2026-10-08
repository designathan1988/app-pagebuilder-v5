# TRC-pages.delete

- **Chamada:** `src/app/commands.ts:299` `'pages.delete': deletePageCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` (com `confirmed`) e os argumentos `{ page }`, com o campo `page` (args.page, tipo `path`, `refers: page`); a porta explorer-page-delete envia o id da página.
- **Ramos que dependem dos argumentos:** R1 (`page` sem página lança); R2 (página inicial recusa); os demais ramos dependem de `confirmed`, não do argumento.

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/project/pages.ts:171` `export const deletePageCommand = registerHandler('pages.delete', ({ state, rules, confirmed }, { page }) => {` — o tratador.
5. `src/core/project/pages.ts:172` `const document = state.document;` — [lê: EST-L01-030 via handlerContext]
6. `src/core/project/pages.ts:173` `const at = pageIndex(document.pages, page);`
7. `src/core/project/pages.ts:175` `if (held === undefined) throw new Error(`pages.delete: the document has no page ${String(page)}`);` — R1.
8. `src/core/project/pages.ts:176` `if (held.file === HOME) return { kind: 'refused' as const, message: message('status.pages.homeUndeletable') };` — R2.
9. `src/core/project/pages.ts:178` `if (confirmed !== true) return { kind: 'confirm' as const, params: { name: held.name } };` — R3, pede confirmação.
10. `src/core/store/store.ts:455` `if (outcome.kind === 'confirm') {`
11. `src/core/store/store.ts:467` `publish(commit({ ...state, confirmation }, id));` — [escreve: EST-L01-034 via publish]
12. `src/core/store/store.ts:690` `answer: (confirmed) => {` — a resposta do diálogo.
13. `src/core/store/store.ts:698` `return run(waiting.command, waiting.args as CommandArgs[typeof waiting.command], null, true);` — [lê: EST-L01-030 via run]
14. `src/core/project/pages.ts:181` `const leaving = new Set([...walk(held.tree)].map((node) => node.id as NodeId));` [lê: EST-L01-030 via walk]
15. `src/core/project/pages.ts:182` `const released = releaseReferencesPatch(document, leaving);` [lê: EST-L01-030 via releaseReferencesPatch]
16. `src/core/document/tree.ts:56` `export function releaseReferencesPatch(document: DocumentJson, leaving: ReadonlySet<NodeId>, names: ReadonlySet<string> = leavingNames(document, leaving)): Patch[] {`
17. `src/core/project/pages.ts:185` `const unlinked = pageLinksReleased(document, held.file, rules);` [lê: EST-L01-030 via pageLinksReleased]
18. `src/core/project/pages.ts:193` `function pageLinksReleased(document: DocumentJson, file: string, rules: ModelRules): Patch[] {`
19. `src/core/project/pages.ts:188` `return { kind: 'change' as const, patches: [...released, ...unlinked, { op: 'remove', path: ['pages', at] }], selection: [], message: message('status.pages.deleted', { name: held.name }) };`
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
23. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos

- R1 `src/core/project/pages.ts:175` `if (held === undefined)` — sem página para o argumento: lança; com página: segue.
- R2 `src/core/project/pages.ts:176` `if (held.file === HOME)` — a página inicial: `refused` com `status.pages.homeUndeletable`, sem passo de undo; outra página: segue.
- R3 `src/core/project/pages.ts:178` `if (confirmed !== true)` — não confirmado: devolve `confirm` e a store publica a confirmação (`src/core/store/store.ts:446`); confirmado: segue para os patches.
- R4 `src/core/project/pages.ts:201` `document.pages.forEach((page, i) => {` — cada outra página e cada componente têm os endereços que levam ao arquivo removidos (`src/core/project/pages.ts:198`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/project/pages.ts:171` `export const deletePageCommand = registerHandler('pages.delete', ({ state, rules, confirmed }, { page }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento: a página, as referências que a ela levam, via walk, releaseReferencesPatch, pageLinksReleased, handlerContext)
- escreve: EST-L01-030 (o documento sem a página removida, via run, applyPatches, publish, commit), EST-L01-031 (a seleção vazia, via run), EST-L01-033 (a mensagem, via run), EST-L01-034 (a confirmação pendente, via publish)

## Resultado

- **Estado final:** EST-L01-030 — a página sai de `document.pages` e as referências a ela são removidas (`src/core/project/pages.ts:188`); sem confirmação, EST-L01-034 com `confirmation` guardando o pedido (`src/core/store/store.ts:446`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a linha sai da lista de páginas (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** o quadro mostra a página aberta; a página aberta cai na primeira quando a sua sai (`src/core/project/pages.ts:64` `export function openedPage(state: { readonly document: { readonly pages: readonly Page[] }; readonly ui?: unknown }): number {`).

## Regras

- G1: n/a — os patches escrevem `pages` e atributos de endereço, fora de qualquer camada de estilo (`src/core/project/pages.ts:188` `patches: [...released, ...unlinked, { op: 'remove', path: ['pages', at] }]`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/project/pages.ts:171` `export const deletePageCommand = registerHandler('pages.delete', ({ state, rules, confirmed }, { page }) => {` — o único tratador; a porta envia só a intenção.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/project/pages.ts:188`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/project/pages.ts:188`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/project/pages.ts:188`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar; as referências à página saem com ela (`src/core/project/pages.ts:182`).

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/project/pages.ts:171`).

## Medições

- nenhuma
