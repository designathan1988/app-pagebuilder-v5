# TRC-data.deleteItems
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ collection: string, items: json }`; a porta manda a lista de ids dos cartões escolhidos.
- **Ramos que dependem dos argumentos:** R1 (lista vazia), R2 (um item não existe mais).

## Passos
1. `src/app/commands.ts:162` `  'data.deleteItems': deleteItemsCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:270` `export const deleteItemsCommand = registerHandler('data.deleteItems', (context, { collection, items }) =>` — o tratador recebe a coleção e os itens. [nada muda]
3. `src/core/data/commands.ts:271` `  contentChange(context, (document) => {` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/core/data/commands.ts:272` `    const held = named(document, collection);` — procura a coleção. [lê: EST-L01-030 via named]
6. `src/core/data/commands.ts:273` `    const ids = Array.isArray(items) ? items.filter((id): id is string => typeof id === 'string') : [];` — lê os ids (R1). [lê: EST-L01-030 via handlerContext]
7. `src/core/data/commands.ts:274` `    if (ids.length === 0) throw new Error('data.deleteItems: no item');` — sem item, é defeito da porta (R1). [nada muda]
8. `src/core/data/commands.ts:275` `    return { document: withCollection(document, held.name, deleteItems(held, ids)), message: message('status.data.itemsDeleted', { collection: held.name, count: { plural: 'data.items', count: ids.length } }) };` — o documento novo troca a coleção sem os itens. [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]
9. `src/core/data/collections.ts:256` `export function deleteItems(collection: Collection, ids: readonly string[]): Collection {` — os itens são retirados. [nada muda]
10. `src/core/data/collections.ts:258` `  for (const id of gone) if (!collection.items.some((item) => item.id === id)) refuse('status.stale');` — item ausente recusa por `status.stale` (R2). [nada muda]
11. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue: os cartões somem. [lê: EST-L01-030 via derivedDocument]
12. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
13. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
14. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
15. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
16. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-003 via publish]
17. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/core/data/commands.ts:274` `    if (ids.length === 0) throw new Error('data.deleteItems: no item');` — lista vazia é defeito da porta (o `run` responde `status.change.failed`); com ids segue.
- R2: `src/core/data/collections.ts:258` `  for (const id of gone) if (!collection.items.some((item) => item.id === id)) refuse('status.stale');` — id que a coleção não tem recusa por `status.stale` antes de qualquer mudança.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `deleteItems` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`).
- Escreve: EST-L01-030 (`document.collections`, `document.pages`, `document.components`), EST-L01-031 (`selection`), EST-L01-032 (`history`).

## Resultado
- **Estado final:** os itens saem da coleção e os cartões deles saem da página (`src/core/data/commands.ts:275` `    return { document: withCollection(document, held.name, deleteItems(held, ids)), message: message('status.data.itemsDeleted', { collection: held.name, count: { plural: 'data.items', count: ids.length } }) };`); a seleção perde um cartão que foi retirado (`src/core/data/commands.ts:66` `    const selection = chosen.filter((id) => locate(after, id) !== null);`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha a grade sem as linhas.
- **DOM do canvas:** o canvas redesenha sem os cartões (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; a entrada é a lista de ids de cartões existentes.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:936` `      "id": "data-item-delete",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:275` `    return { document: withCollection(document, held.name, deleteItems(held, ids)), message: message('status.data.itemsDeleted', { collection: held.name, count: { plural: 'data.items', count: ids.length } }) };`).
- G5: n/a — o comando não desenha controle: a lixeira do cartão vive na colocação do painel.
- G6: ok `src/core/data/commands.ts:66` `    const selection = chosen.filter((id) => locate(after, id) !== null);` — a seleção derivada tira só o que a derivação retirou, e a store publica a mesma seleção para todas as vistas.
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção resultantes são validados antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
