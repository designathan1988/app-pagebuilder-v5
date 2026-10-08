# TRC-data.setCell
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ collection: string, item: string, field: string, value: string }`; a porta entrega o texto no contexto em que a digitação começou (G1/G2).
- **Ramos que dependem dos argumentos:** R1 (o valor não é do tipo do campo), R2 (a linha ou o campo não existem mais).

## Passos
1. `src/app/commands.ts:161` `  'data.setCell': setCellCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:260` `export const setCellCommand = registerHandler('data.setCell', (context, { collection, item, field, value }) =>` — o tratador recebe a coleção, a linha, o campo e o valor. [nada muda]
3. `src/core/data/commands.ts:261` `  contentChange(context, (document) => {` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/core/data/commands.ts:262` `    const held = named(document, collection);` — procura a coleção. [lê: EST-L01-030 via named]
6. `src/core/data/commands.ts:263` `    const next = setCell(held, item, field, value);` — grava o valor na célula. [escreve: EST-L01-030 via run]
7. `src/core/data/collections.ts:238` `export function setCell(collection: Collection, itemId: string, fieldKey: string, typed: unknown): Collection {` — o valor entra na forma canônica do tipo do campo. [nada muda]
8. `src/core/data/collections.ts:243` `  if (field === undefined || item === undefined) refuse('status.stale');` — linha ou campo ausentes recusam por `status.stale` (R2). [nada muda]
9. `src/core/data/collections.ts:244` `  const read = readCell(field.type, typed);` — o texto digitado é lido como o tipo do campo. [nada muda]
10. `src/core/data/collections.ts:245` `  if (read === null) refuse('status.data.badValue', { collection: collection.name, row: index + 1, column: field.label, value: shownValue(typed), type: { key:` — valor que o tipo não aceita recusa nomeando linha e coluna (R1). [nada muda]
11. `src/core/data/commands.ts:264` `    const row = held.items.findIndex((one) => one.id === item) + 1;` — a linha da mensagem. [lê: EST-L01-030 via handlerContext]
12. `src/core/data/commands.ts:265` `    const label = held.fields.find((f) => f.key === field)?.label ?? field;` — o rótulo da coluna da mensagem. [lê: EST-L01-030 via handlerContext]
13. `src/core/data/commands.ts:266` `    return { document: withCollection(document, held.name, next), message: message('status.data.cellSet', { collection: held.name, row, column: label }) };` — o documento novo troca a coleção. [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]
14. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue: o cartão do item mostra o valor. [lê: EST-L01-030 via derivedDocument]
15. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
16. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
17. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
18. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
19. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-003 via publish]
20. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/core/data/collections.ts:245` `  if (read === null) refuse('status.data.badValue', { collection: collection.name, row: index + 1, column: field.label, value: shownValue(typed), type: { key:` — valor fora do tipo recusa nomeando linha e coluna, sem gravar; valor aceito segue.
- R2: `src/core/data/collections.ts:243` `  if (field === undefined || item === undefined) refuse('status.stale');` — campo ou linha que a coleção não tem recusa por `status.stale`.
- R3: `src/core/data/collections.ts:248` `  const values = read === undefined ? others : { ...others, [field.key]: read };` — valor vazio apaga a chave; valor preenchido grava a forma canônica.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `setCell` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`document.collections`, `document.pages`, `document.components`), EST-L01-032 (`history`).

## Resultado
- **Estado final:** a célula passa a ter a forma canônica do valor digitado e o cartão do item a mostra (`src/core/data/commands.ts:266` `    return { document: withCollection(document, held.name, next), message: message('status.data.cellSet', { collection: held.name, row, column: label }) };`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha a célula da grade.
- **DOM do canvas:** o canvas redesenha o cartão do item (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: ok `src/core/data/commands.ts:260` `export const setCellCommand = registerHandler('data.setCell', (context, { collection, item, field, value }) =>` — a linha, o campo e o valor digitado são gravados no contexto capturado na primeira digitação.
- G2: ok `src/core/data/commands.ts:263` `    const next = setCell(held, item, field, value);` — o tratador lê o texto entregue pela porta, que é o do contexto da digitação.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:867` `      "id": "data-cell",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:266` `    return { document: withCollection(document, held.name, next), message: message('status.data.cellSet', { collection: held.name, row, column: label }) };`).
- G5: n/a — o comando não desenha controle: a célula da grade vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
