# TRC-data.addItem
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ collection: string }`; a porta `data-item-add` manda a coleção mostrada.
- **Ramos que dependem dos argumentos:** R1 (a coleção não existe).

## Passos
1. `src/app/commands.ts:160` `  'data.addItem': addItemCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:252` `export const addItemCommand = registerHandler('data.addItem', (context, { collection }) =>` — o tratador recebe a coleção. [nada muda]
3. `src/core/data/commands.ts:253` `  contentChange(context, (document) => {` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/core/data/commands.ts:254` `    const held = named(document, collection);` — procura a coleção (R1). [lê: EST-L01-030 via named]
6. `src/core/data/commands.ts:255` `    const next = addItem(held, context.ids.next());` — acrescenta um item com id novo do gerador. [escreve: EST-L01-030 via run]
7. `src/core/data/collections.ts:252` `export function addItem(collection: Collection, id: string): Collection {` — o item nasce com valores vazios. [nada muda]
8. `src/core/data/commands.ts:256` `    return { document: withCollection(document, held.name, next), message: message('status.data.itemAdded', { collection: held.name, row: next.items.length }) };` — o documento novo troca a coleção. [escreve: EST-L01-030 via run]
9. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue: a lista ligada ganha o cartão do item. [lê: EST-L01-030 via contentChange]
10. `src/core/data/derive.ts:196` `export function derivedDocument(before: DocumentJson, changed: DocumentJson, context: DataContext): DocumentJson {` — listas, páginas de item e regiões seguem. [nada muda]
11. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
12. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
13. `src/core/store/store.ts:504` `      derived = own.applied.length > 0 && options.derive !== undefined ? options.derive(before.document, own.document, handlerContext(confirmed)) : null;` — a derivação do editor roda sobre o documento aplicado. [lê: EST-L01-030 via run] [lê: EST-L01-037 via run]
14. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
15. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
16. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-030 via publish]
17. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-037 via publish]

## Ramos
- R1: `src/core/data/commands.ts:78` `  if (found === undefined) throw new Error(` — uma coleção que o projeto não tem é defeito da porta (o `run` responde `status.change.failed`); havendo coleção segue.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `derivedDocument` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (`state.document`, via contentChange, named, run, publish), EST-L01-037 (`state.ui`, via run, publish).
- Escreve: EST-L01-030 (`document.collections`, `document.pages`, `document.components`, via run, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (`history`, via run).

## Resultado
- **Estado final:** a coleção ganha uma linha e a lista ligada ganha o cartão dela (`src/core/data/commands.ts:256` `    return { document: withCollection(document, held.name, next), message: message('status.data.itemAdded', { collection: held.name, row: next.items.length }) };`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha a grade com a linha nova.
- **DOM do canvas:** o canvas redesenha o cartão repetido novo (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é o nome de uma coleção existente.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:788` `      "id": "data-item-add",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:256` `    return { document: withCollection(document, held.name, next), message: message('status.data.itemAdded', { collection: held.name, row: next.items.length }) };`).
- G5: n/a — o comando não desenha controle: o botão vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos, iguais aos do render do zero.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
