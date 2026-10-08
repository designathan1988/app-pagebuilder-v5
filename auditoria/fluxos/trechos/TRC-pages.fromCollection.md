# TRC-pages.fromCollection
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ collection: string, nameField: string }`; a porta `data-pages-from-collection` manda a coleção e o campo que nomeia cada página.
- **Ramos que dependem dos argumentos:** R2 (o campo não existe). Os demais ramos dependem do estado (R1 a página aberta é página de item, R3 itens já com página, R4 item sem nome).

## Passos
1. `src/app/commands.ts:174` `  'pages.fromCollection': pagesFromCollectionCommand<EditorUi>(),` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:435` `export function pagesFromCollectionCommand<Ui extends WithPage>() {` — a fábrica do tratador. [nada muda]
3. `src/core/data/commands.ts:436` `  return registerHandler<'pages.fromCollection', Ui>('pages.fromCollection', (context, { collection, nameField }) =>` — o tratador recebe a coleção e o campo. [nada muda]
4. `src/core/data/commands.ts:437` `    contentChange(context, (document, data) => {` — o documento novo é calculado por `contentChange`. [nada muda]
5. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
6. `src/core/data/commands.ts:438` `      const at = openedPage(context.state);` — acha a página aberta. [lê: EST-L01-030 via openedPage] [lê: EST-L01-037 via openedPage]
7. `src/core/data/commands.ts:439` `      const source = document.pages[at] as Page;` — a página aberta é o molde. [lê: EST-L01-030 via handlerContext]
8. `src/core/data/commands.ts:440` `      const held = named(document, collection);` — procura a coleção. [lê: EST-L01-030 via named]
9. `src/core/data/commands.ts:441` `      if (source.tree.dataItem !== undefined) refuse('status.data.templateIsItemPage', { name: source.name });` — a página aberta sendo página de item recusa (R1). [nada muda]
10. `src/core/data/commands.ts:442` `      const field = held.fields.find((f) => f.key === nameField);` — procura o campo que nomeia. [lê: EST-L01-030 via handlerContext]
11. `src/core/data/commands.ts:443` `      if (field === undefined) refuse('status.stale');` — campo ausente recusa por `status.stale` (R2). [nada muda]
12. `src/core/data/commands.ts:444` `      const existing = new Set(document.pages.flatMap((p) => (p.tree.dataItem?.collection === held.name ? [p.tree.dataItem.item] : [])));` — os itens que já têm página (R3). [lê: EST-L01-030 via handlerContext]
13. `src/core/data/commands.ts:446` `      held.items.forEach((item, index) => {` — uma página por item. [lê: EST-L01-030 via handlerContext]
14. `src/core/data/commands.ts:448` `        const name = cellText(item.values[field.key], { yes: context.words('data.yes'), no: context.words('data.no') }).trim();` — o nome vem do valor do campo. [lê: EST-L01-030 via cellText]
15. `src/core/data/commands.ts:449` `        if (name === '') refuse('status.data.emptyName', { collection: held.name, row: index + 1, column: field.label });` — item sem valor no campo recusa (R4). [nada muda]
16. `src/core/data/commands.ts:451` `        made.push({ ...copy, tree: { ...copy.tree, dataItem: { collection: held.name, item: item.id } } });` — a página nova marca o item. [escreve: EST-L01-030 via run]
17. `src/core/data/commands.ts:457` `        ...(first === undefined ? {} : { ui: { ...context.state.ui, page: first.id }, selection: [] }),` — a primeira página nova abre e a seleção esvazia quando algo foi criado (R5). [escreve: EST-L01-031 via run] [escreve: EST-L01-037 via run]
18. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
19. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
20. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
21. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
22. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-030 via publish]
23. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham a interface. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/data/commands.ts:441` `      if (source.tree.dataItem !== undefined) refuse('status.data.templateIsItemPage', { name: source.name });` — a página aberta sendo página de um item recusa; caso contrário segue.
- R2: `src/core/data/commands.ts:443` `      if (field === undefined) refuse('status.stale');` — campo que a coleção não tem recusa por `status.stale`.
- R3: `src/core/data/commands.ts:447` `        if (existing.has(item.id)) return;` — item que já tem página não gera outra (o seu arquivo fica); os demais geram.
- R4: `src/core/data/commands.ts:449` `        if (name === '') refuse('status.data.emptyName', { collection: held.name, row: index + 1, column: field.label });` — item sem valor no campo do nome recusa sem criar nada.
- R5: `src/core/data/commands.ts:457` `        ...(first === undefined ? {} : { ui: { ...context.state.ui, page: first.id }, selection: [] }),` — sem página nova a resposta não muda a ui; com páginas novas a primeira abre e a seleção esvazia.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `copyPage` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (o documento, via contentChange, openedPage, named, cellText, handlerContext), EST-L01-031 (a seleção, via handlerContext), EST-L01-037 (o estado do editor, via openedPage, handlerContext).
- Escreve: EST-L01-030 (o documento: as páginas novas, via run, applyPatches, publish, commit), EST-L01-031 (a seleção vazia, via run), EST-L01-032 (o histórico, via run), EST-L01-033 (a mensagem, via run), EST-L01-037 (a página nova em `ui.page`, via run).

## Resultado
- **Estado final:** cada item sem página ganha uma página nova que o mostra, e a primeira delas abre (`src/core/data/commands.ts:456` `        message: made.length === 0 ? message('status.pages.itemPagesCurrent', { collection: held.name }) : message('status.pages.madeFromCollection', { collection: held.name, count: { plural: 'data.pages', count: made.length } }),`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** a lista de páginas redesenha com as páginas novas.
- **DOM do canvas:** o canvas redesenha a página aberta nova (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são a coleção e a chave do campo.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:1865` `      "id": "data-pages-from-collection",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:457` `        ...(first === undefined ? {} : { ui: { ...context.state.ui, page: first.id }, selection: [] }),`).
- G5: n/a — o comando não desenha controle: o botão vive na colocação do painel.
- G6: ok `src/core/data/commands.ts:66` `    const selection = chosen.filter((id) => locate(after, id) !== null);` — a seleção vem da store (a resposta vazia) e é a única fonte para canvas e Camadas.
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção resultantes são validados antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
