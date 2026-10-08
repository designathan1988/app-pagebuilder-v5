# TRC-data.deleteCollection
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ collection: string }`; a confirmação reexecuta o tratador com `confirmed === true` (`src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);`).
- **Ramos que dependem dos argumentos:** R1 (ainda não confirmado), R2 (a coleção é a última).

## Passos
1. `src/app/commands.ts:156` `  'data.deleteCollection': deleteCollectionCommand<EditorUi>(),` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:162` `export function deleteCollectionCommand<Ui extends WithCollection>() {` — a fábrica do tratador. [nada muda]
3. `src/core/data/commands.ts:163` `  return registerHandler<'data.deleteCollection', Ui>('data.deleteCollection', (context, { collection }) => {` — o tratador recebe `collection`. [nada muda]
4. `src/core/data/commands.ts:164` `    const held = named(context.state.document, collection);` — procura a coleção no documento. [lê: EST-L01-030 via named]
5. `src/core/data/commands.ts:165` `    if (context.confirmed !== true) return { kind: 'confirm', params: { name: held.name, count: usesOf(context.state.document, held.name) } };` — sem confirmação, pede a confirmação com o nome e a contagem de usos (R1). [lê: EST-L01-030 via usesOf]
6. `src/core/data/commands.ts:154` `function usesOf(document: DocumentJson, name: string): number {` — conta as listas e páginas de item que mostram a coleção. [lê: EST-L01-030 via usesOf]
7. `src/core/store/store.ts:467` `      publish(commit({ ...state, confirmation }, id));` — a store guarda a confirmação pedida e espera a resposta. [escreve: EST-L01-034 via run]
8. `src/core/data/commands.ts:166` `    return contentChange(context, (document) => {` — confirmado, o documento novo é calculado por `contentChange`. [nada muda]
9. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
10. `src/core/data/commands.ts:169` `        if (node.dataList?.collection === held.name) {` — as listas ligadas perdem a marca de lista. [escreve: EST-L01-030 via run]
11. `src/core/data/commands.ts:174` `        if (node.dataItem?.collection === held.name) {` — as páginas de item perdem a marca de item. [escreve: EST-L01-030 via run]
12. `src/core/data/commands.ts:182` `      const rest = collectionsOf(document).filter((c) => c.name !== held.name);` — as demais coleções ficam. [lê: EST-L01-030 via collectionsOf]
13. `src/core/data/commands.ts:185` `      const base: DocumentJson = rest.length === 0 ? without : { ...without, collections: rest };` — sem restantes, a chave `collections` sai (R2). [escreve: EST-L01-030 via run]
14. `src/core/data/commands.ts:186` `      const ui = context.state.ui?.data?.collection === held.name ? { ...context.state.ui, data: { ...context.state.ui.data, collection: rest[0]?.name } } : context.state.ui;` — a coleção mostrada passa à primeira restante quando era a excluída. [escreve: EST-L01-037 via run]
15. `src/core/data/commands.ts:188` `        document: { ...base, pages: base.pages.map((page) => ({ ...page, tree: release(page.tree) })), ...` — as árvores das páginas recebem a liberação. [escreve: EST-L01-030 via run]
16. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue. [lê: EST-L01-030 via derivedDocument]
17. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
18. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
19. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
20. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
21. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-003 via publish]
22. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/core/data/commands.ts:165` `    if (context.confirmed !== true) return { kind: 'confirm', params: { name: held.name, count: usesOf(context.state.document, held.name) } };` — sem confirmação a resposta é `confirm` (a store guarda `state.confirmation` e espera, `src/core/store/store.ts:467` `      publish(commit({ ...state, confirmation }, id));`); confirmado, o tratador segue para o passo 8.
- R2: `src/core/data/commands.ts:185` `      const base: DocumentJson = rest.length === 0 ? without : { ...without, collections: rest };` — restando outras coleções, fica a lista restante; sendo a última, a chave `collections` é removida do documento.
- R3: `src/core/data/commands.ts:164` `    const held = named(context.state.document, collection);` — coleção ausente lança defeito da porta (não recusa).

## Fronteiras assíncronas
- o `confirm` interrompe o despacho: a store publica o estado com `confirmation` e espera a resposta da pessoa antes de reexecutar o tratador (`src/core/store/store.ts:455` `    if (outcome.kind === 'confirm') {`). No intervalo, outras entradas podem rodar (ids de `auditoria/entradas.md` do painel de diálogo), e a aplicação está com uma confirmação pendente, sem mudança no documento.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-037 (`state.ui`), EST-L01-034 (`state.confirmation`).
- Escreve: EST-L01-030 (`document.collections`, `document.pages`, `document.components`), EST-L01-037 (`ui.data.collection`), EST-L01-034 (`confirmation`), EST-L01-032 (`history`).

## Resultado
- **Estado final:** o documento perde a coleção e as listas e páginas de item ligadas ficam como conteúdo comum (`src/core/data/commands.ts:188` `        document: { ...base, pages: base.pages.map((page) => ({ ...page, tree: release(page.tree) })), ...`); o histórico guarda a etapa.
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha a lista de coleções.
- **DOM do canvas:** o canvas redesenha por causa da mudança do documento (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é o nome de uma coleção que existe (`src/core/data/commands.ts:164` `    const held = named(context.state.document, collection);`).
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:475` `      "id": "data-collection-delete",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:186` `      const ui = context.state.ui?.data?.collection === held.name ?`).
- G5: n/a — o comando não desenha controle: o cartão e a lixeira vivem na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
