# TRC-data.createCollection
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ name?: string }`; a porta `data-new-collection` manda `{}` (o nome nasce do catálogo).
- **Ramos que dependem dos argumentos:** R1 (nome vazio), R2 (nome repetido).

## Passos
1. `src/app/commands.ts:154` `  'data.createCollection': createCollectionCommand<EditorUi>(),` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:105` `export function createCollectionCommand<Ui extends WithCollection>() {` — a fábrica do tratador. [nada muda]
3. `src/core/data/commands.ts:106` `  return registerHandler<'data.createCollection', Ui>('data.createCollection', (context, { name }) =>` — o tratador é registrado e recebe `name`. [nada muda]
4. `src/core/data/commands.ts:107` `    contentChange(context, (document) => {` — o documento novo é calculado por `contentChange`. [nada muda]
5. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento da store. [lê: EST-L01-030 via contentChange]
6. `src/core/data/commands.ts:108` `      const typed = typeof name === 'string' ? name.trim() : '';` — lê o nome digitado. [lê: EST-L01-030 via handlerContext]
7. `src/core/data/commands.ts:109` `      const base = typed === '' ? context.words('data.defaultCollection') : typed;` — nome vazio cai no nome padrão do catálogo (R1). [nada muda]
8. `src/core/data/commands.ts:111` `      if (typed === '') for (let n = 2; nameRefusal(collectionsOf(document), chosen) !== null; n += 1) chosen =` — nome padrão ganha número enquanto estiver tomado (R1). [lê: EST-L01-030 via collectionsOf]
9. `src/core/data/collections.ts:192` `export function createCollection(collections: readonly Collection[], name: string, fields: readonly Field[]): Collection {` — a coleção nova é criada. [nada muda]
10. `src/core/data/collections.ts:193` `  const named = nameRefusal(collections, name);` — nome vazio ou repetido vira recusa (R2). [nada muda]
11. `src/core/data/collections.ts:195` `  const schema = schemaRefusal(name.trim(), fields);` — o esquema é conferido (um campo de texto). [nada muda]
12. `src/core/data/commands.ts:113` `      const collection = createCollection(collectionsOf(document), chosen, [{ key: keyFor(label, []), label, type: 'text' }]);` — a coleção nasce com um campo de texto. [nada muda]
13. `src/core/data/commands.ts:115` `        document: { ...document, collections: [...collectionsOf(document), collection] },` — o documento novo leva a coleção. [escreve: EST-L01-030 via run]
14. `src/core/data/commands.ts:117` `        ui: { ...context.state.ui, data: { ...context.state.ui?.data, collection: collection.name } },` — o painel Dados passa a mostrar a coleção nova. [escreve: EST-L01-037 via run]
15. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue a mudança. [lê: EST-L01-030 via contentChange]
16. `src/core/data/derive.ts:196` `export function derivedDocument(before: DocumentJson, changed: DocumentJson, context: DataContext): DocumentJson {` — listas, páginas de item e regiões seguem. [nada muda]
17. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
18. `src/core/data/commands.ts:68` `    return { kind: 'change', patches, message: result.message,` — a resposta é uma mudança com patches, mensagem e ui. [nada muda]
19. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
20. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico como uma etapa de desfazer. [escreve: EST-L01-032 via run]
21. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
22. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança do documento. [lê: EST-L01-030 via publish]
23. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os demais assinantes redesenham o painel. [lê: EST-L01-037 via publish]

## Ramos
- R1: `src/core/data/commands.ts:109` `      const base = typed === '' ? context.words('data.defaultCollection') : typed;` — nome vazio usa o nome padrão e, tomado, ganha número (`src/core/data/commands.ts:111` `      if (typed === '') for (let n = 2; nameRefusal(collectionsOf(document), chosen) !== null; n += 1) chosen =`); nome digitado usa o próprio texto.
- R2: `src/core/data/collections.ts:170` `  if (trimmed === '') return message('status.data.nameEmpty');` e `src/core/data/collections.ts:171` `  if (collections.some((c) => c.name !== except && fold(c.name) === fold(trimmed))) return message('status.data.nameTaken', { name: trimmed });` — nome vazio ou repetido lança `DataRefusal`, que `contentChange` converte em `refused` (`src/core/data/commands.ts:70` `    if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };`) sem gravar; um nome livre segue para o passo 12.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `derivedDocument` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (`state.document`, via contentChange, handlerContext, collectionsOf, publish), EST-L01-031 (a seleção, via commit), EST-L01-037 (`state.ui`, via publish).
- Escreve: EST-L01-030 (`document.collections`, via run, publish), EST-L01-031 (a seleção, via commit), EST-L01-037 (`ui.data.collection`, via run), EST-L01-032 (`history`, via run).

## Resultado
- **Estado final:** o documento ganha a coleção nova e o histórico o passo de desfazer (`src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados lê a coleção nova da lista e a mostra.
- **DOM do canvas:** o canvas redesenha por causa da mudança do documento (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o nome vem do campo da porta e é lido uma vez (`src/core/data/commands.ts:108` `      const typed = typeof name === 'string' ? name.trim() : '';`), sem digitação pendente com contexto.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:353` `      "id": "data-new-collection",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:117` `        ui: { ...context.state.ui, data: { ...context.state.ui?.data, collection: collection.name } },`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle: o botão vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso, então a resposta não traz `selection`).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos, os mesmos que o render do zero produziria.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
