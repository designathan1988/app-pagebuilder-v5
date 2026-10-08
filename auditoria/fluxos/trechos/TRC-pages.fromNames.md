# TRC-pages.fromNames
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ names: string }`; a porta `data-pages-from-names` manda o texto digitado (um nome por linha).
- **Ramos que dependem dos argumentos:** R1 (nenhum nome). Os demais ramos dependem do estado (R2 a página aberta).

## Passos
1. `src/app/commands.ts:173` `  'pages.fromNames': pagesFromNamesCommand<EditorUi>(),` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:409` `export function pagesFromNamesCommand<Ui extends WithPage>() {` — a fábrica do tratador. [nada muda]
3. `src/core/data/commands.ts:410` `  return registerHandler<'pages.fromNames', Ui>('pages.fromNames', (context, { names }) =>` — o tratador recebe `names`. [nada muda]
4. `src/core/data/commands.ts:411` `    contentChange(context, (document, data) => {` — o documento novo é calculado por `contentChange`. [nada muda]
5. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
6. `src/core/data/commands.ts:412` `      const at = openedPage(context.state);` — acha a página aberta. [lê: EST-L01-030 via openedPage] [lê: EST-L01-037 via openedPage]
7. `src/core/project/pages.ts:64` `export function openedPage(state: { readonly document: { readonly pages: readonly Page[] }; readonly ui?: unknown }): number {` — a página que a ui mostra. [lê: EST-L01-030 via openedPage] [lê: EST-L01-037 via openedPage]
8. `src/core/data/commands.ts:413` `      const source = document.pages[at] as Page;` — a página aberta é o molde. [lê: EST-L01-030 via handlerContext]
9. `src/core/data/commands.ts:414` `      const wanted = names.split(/\r?\n/).map((name) => name.trim()).filter((name) => name !== '');` — lê os nomes digitados, um por linha (R1). [lê: EST-L01-030 via handlerContext]
10. `src/core/data/commands.ts:415` `      if (wanted.length === 0) refuse('status.pages.noNames', { name: source.name });` — sem nenhum nome recusa (R1). [nada muda]
11. `src/core/data/commands.ts:417` `      for (const name of wanted) made.push(copyPage(withPageAfter(document, at, made), source, name, () => data.ids.next() as NodeId));` — copia a página aberta para cada nome. [escreve: EST-L01-030 via run]
12. `src/core/data/commands.ts:405` `const withPageAfter = (document: DocumentJson, after: number, made: readonly Page[]): DocumentJson => ({ ...document, pages: [...document.pages.slice(0, after + 1), ...made, ...document.pages.slice(after + 1)] });` — as páginas novas entram logo após a aberta. [escreve: EST-L01-030 via withPageAfter]
13. `src/core/project/pages.ts:132` `export function copyPage(document: DocumentJson, source: Page, base: string, next: () => NodeId): Page {` — a cópia nomeada e arquivada. [nada muda]
14. `src/core/data/commands.ts:421` `      const withPages = withPageAfter(document, at, made);` — o documento com as páginas novas. [escreve: EST-L01-030 via withPageAfter]
15. `src/core/data/commands.ts:425` `        ui: { ...context.state.ui, page: first.id },` — a primeira página nova abre. [escreve: EST-L01-037 via run]
16. `src/core/data/commands.ts:426` `        selection: [],` — a seleção fica vazia. [escreve: EST-L01-031 via run]
17. `src/core/data/commands.ts:65` `    const chosen = result.selection ?? context.state.selection;` — a seleção da resposta. [lê: EST-L01-031 via contentChange]
18. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
19. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
20. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
21. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
22. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-030 via publish]
23. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham a interface. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/data/commands.ts:415` `      if (wanted.length === 0) refuse('status.pages.noNames', { name: source.name });` — nenhum nome (todas as linhas vazias) recusa; havendo nomes segue.
- R2: `src/core/project/pages.ts:64` `export function openedPage(state: { readonly document: { readonly pages: readonly Page[] }; readonly ui?: unknown }): number {` — a página aberta é o molde; sem ui a página é a primeira.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `copyPage` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (o documento, via contentChange, openedPage, handlerContext), EST-L01-031 (a seleção, via contentChange), EST-L01-037 (o estado do editor, via openedPage).
- Escreve: EST-L01-030 (o documento: as páginas novas, via run, withPageAfter), EST-L01-031 (a seleção vazia, via run), EST-L01-032 (o histórico, via run), EST-L01-033 (a mensagem, via run), EST-L01-037 (a página nova em `ui.page`, via run).

## Resultado
- **Estado final:** cada nome vira uma página nova, cópia da aberta, e a primeira delas abre (`src/core/data/commands.ts:425` `        ui: { ...context.state.ui, page: first.id },`), com a seleção vazia (`src/core/data/commands.ts:426` `        selection: [],`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** a lista de páginas redesenha com as páginas novas.
- **DOM do canvas:** o canvas redesenha a página aberta nova (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: ok `src/core/data/commands.ts:410` `  return registerHandler<'pages.fromNames', Ui>('pages.fromNames', (context, { names }) =>` — o texto digitado é gravado no contexto capturado na primeira digitação.
- G2: ok `src/core/data/commands.ts:414` `      const wanted = names.split(/\r?\n/).map((name) => name.trim()).filter((name) => name !== '');` — o tratador lê o texto entregue pela porta, que é o do contexto da digitação.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:1794` `      "id": "data-pages-from-names",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:425` `        ui: { ...context.state.ui, page: first.id },`).
- G5: n/a — o comando não desenha controle: o campo vive na colocação do painel.
- G6: ok `src/core/data/commands.ts:66` `    const selection = chosen.filter((id) => locate(after, id) !== null);` — a seleção vem da store (a resposta vazia) e é a única fonte para canvas e Camadas.
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção resultantes são validados antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
