# TRC-data.renameCollection
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ collection: string, name: string }`; a porta entrega no contexto em que a digitação começou (G1/G2).
- **Ramos que dependem dos argumentos:** R1 (nome igual ao atual), R2 (nome vazio ou repetido), R4 (a coleção mostrada é a renomeada).

## Passos
1. `src/app/commands.ts:155` `  'data.renameCollection': renameCollectionCommand<EditorUi>(),` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:124` `export function renameCollectionCommand<Ui extends WithCollection>() {` — a fábrica do tratador. [nada muda]
3. `src/core/data/commands.ts:125` `  return registerHandler<'data.renameCollection', Ui>('data.renameCollection', (context, { collection, name }) =>` — o tratador recebe `collection` e `name`. [nada muda]
4. `src/core/data/commands.ts:126` `    contentChange(context, (document) => {` — o documento novo é calculado por `contentChange`. [nada muda]
5. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
6. `src/core/data/commands.ts:127` `      const held = named(document, collection);` — procura a coleção. [lê: EST-L01-030 via named]
7. `src/core/data/commands.ts:77` `  const found = typeof name === 'string' ? collectionNamed(document, name) : undefined;` — a busca pelo nome. [lê: EST-L01-030 via named]
8. `src/core/data/commands.ts:128` `      const typed = name.trim();` — lê o nome novo digitado. [lê: EST-L01-030 via handlerContext]
9. `src/core/data/commands.ts:129` `      if (typed === held.name) return { document, message: message('status.data.renamed', { name: typed }) };` — nome igual ao atual devolve o documento sem mudança (R1). [lê: EST-L01-030 via handlerContext]
10. `src/core/data/commands.ts:130` `      const refused = nameRefusal(collectionsOf(document), typed, held.name);` — confere o nome novo contra as outras coleções. [lê: EST-L01-030 via collectionsOf]
11. `src/core/data/commands.ts:131` `      if (refused !== null) throw new DataRefusal(refused);` — nome vazio ou repetido recusa (R2). [nada muda]
12. `src/core/data/commands.ts:134` `        if (node.dataList?.collection === held.name) next = { ...next, dataList: { ...node.dataList, collection: typed } };` — as listas ligadas seguem o nome novo. [escreve: EST-L01-030 via run]
13. `src/core/data/commands.ts:135` `        if (node.dataItem?.collection === held.name) next = { ...next, dataItem: { ...node.dataItem, collection: typed } };` — as páginas de item seguem o nome novo. [escreve: EST-L01-030 via run]
14. `src/core/data/commands.ts:139` `      const renamed = withCollection(document, held.name, { ...held, name: typed });` — a coleção é trocada pela renomeada. [escreve: EST-L01-030 via run]
15. `src/core/data/commands.ts:143` `          pages: renamed.pages.map((page) => ({ ...page, tree: follow(page.tree) })),` — as árvores das páginas recebem o seguimento. [escreve: EST-L01-030 via run]
16. `src/core/data/commands.ts:147` `        ui: context.state.ui?.data?.collection === held.name ? { ...context.state.ui, data: { ...context.state.ui.data, collection: typed } } : context.state.ui,` — a coleção mostrada segue o nome novo quando era a renomeada (R4). [escreve: EST-L01-037 via run]
17. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue. [lê: EST-L01-030 via derivedDocument]
18. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
19. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
20. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
21. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
22. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-003 via publish]
23. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/core/data/commands.ts:129` `      if (typed === held.name) return { document, message: message('status.data.renamed', { name: typed }) };` — nome igual ao atual devolve o documento como estava (sem patches); nome diferente segue.
- R2: `src/core/data/collections.ts:170` `  if (trimmed === '') return message('status.data.nameEmpty');` e `src/core/data/collections.ts:171` `  if (collections.some((c) => c.name !== except && fold(c.name) === fold(trimmed))) return message('status.data.nameTaken', { name: trimmed });` — nome vazio ou repetido lança `DataRefusal` (`src/core/data/commands.ts:131` `      if (refused !== null) throw new DataRefusal(refused);`), que `contentChange` converte em `refused` (`src/core/data/commands.ts:70` `    if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };`) sem gravar; um nome livre segue.
- R3: `src/core/data/commands.ts:78` `  if (found === undefined) throw new Error(` — uma coleção ausente é defeito da porta, não recusa.
- R4: `src/core/data/commands.ts:147` `        ui: context.state.ui?.data?.collection === held.name ? { ...context.state.ui, data: { ...context.state.ui.data, collection: typed } } : context.state.ui,` — quando a coleção mostrada é a renomeada, a ui passa a apontar para o nome novo; caso contrário a ui fica como estava.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `derivedDocument` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-037 (`state.ui`).
- Escreve: EST-L01-030 (`document.collections`, `document.pages`, `document.components`), EST-L01-037 (`ui.data.collection`), EST-L01-032 (`history`).

## Resultado
- **Estado final:** a coleção passa a ter o nome novo e as listas e páginas de item ligadas seguem (`src/core/data/commands.ts:139` `      const renamed = withCollection(document, held.name, { ...held, name: typed });`); o histórico guarda a etapa.
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha o nome da coleção.
- **DOM do canvas:** o canvas redesenha por causa da mudança do documento (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: ok `src/core/data/commands.ts:125` `  return registerHandler<'data.renameCollection', Ui>('data.renameCollection', (context, { collection, name }) =>` — o nome digitado é gravado no contexto capturado na primeira digitação (a porta entrega `collection` junto com `name`).
- G2: ok `src/core/data/commands.ts:128` `      const typed = name.trim();` — o tratador lê o texto entregue pela porta, que é o do contexto da digitação.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:416` `      "id": "data-collection-name",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:147` `        ui: context.state.ui?.data?.collection === held.name ? { ...context.state.ui, data: { ...context.state.ui.data, collection: typed } } : context.state.ui,`).
- G5: n/a — o comando não desenha controle: o campo vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso, então a resposta não traz `selection`).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
