# TRC-data.moveItem
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ collection: string, item: string, to: integer }`; as duas portas (seta para cima e para baixo) mandam o item e o destino.
- **Ramos que dependem dos argumentos:** R1 (o destino), R2 (o item não existe mais).

## Passos
1. `src/app/commands.ts:163` `  'data.moveItem': moveItemCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:279` `export const moveItemCommand = registerHandler('data.moveItem', (context, { collection, item, to }) =>` — o tratador recebe a coleção, o item e o destino. [nada muda]
3. `src/core/data/commands.ts:280` `  contentChange(context, (document) => {` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/core/data/commands.ts:281` `    const held = named(document, collection);` — procura a coleção. [lê: EST-L01-030 via named]
6. `src/core/data/commands.ts:282` `    const next = moveItem(held, item, to);` — move o item para o destino. [escreve: EST-L01-030 via run]
7. `src/core/data/collections.ts:263` `export function moveItem(collection: Collection, id: string, to: number): Collection {` — o item sai da posição e entra na nova. [nada muda]
8. `src/core/data/collections.ts:266` `  if (moved === undefined) refuse('status.stale');` — item ausente recusa por `status.stale` (R2). [nada muda]
9. `src/core/data/collections.ts:268` `  const place = Math.max(0, Math.min(rest.length, Math.trunc(to)));` — o destino é limitado ao intervalo dos itens (R1). [nada muda]
10. `src/core/data/commands.ts:283` `    return { document: withCollection(document, held.name, next), message: message('status.data.itemMoved', { collection: held.name, row: next.items.findIndex((one) => one.id === item) + 1 }) };` — o documento novo troca a coleção. [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]
11. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue: o cartão acompanha. [lê: EST-L01-030 via derivedDocument]
12. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
13. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
14. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
15. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
16. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-003 via publish]
17. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/core/data/collections.ts:268` `  const place = Math.max(0, Math.min(rest.length, Math.trunc(to)));` — dois valores de `to` (para cima e para baixo) levam a duas posições; um destino fora do intervalo é preso aos extremos.
- R2: `src/core/data/collections.ts:266` `  if (moved === undefined) refuse('status.stale');` — item que a coleção não tem recusa por `status.stale`; existindo, segue.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `moveItem` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`document.collections`, `document.pages`, `document.components`), EST-L01-032 (`history`).

## Resultado
- **Estado final:** a ordem dos itens muda e a ordem dos cartões na página acompanha (`src/core/data/commands.ts:283` `    return { document: withCollection(document, held.name, next), message: message('status.data.itemMoved', { collection: held.name, row: next.items.findIndex((one) => one.id === item) + 1 }) };`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha a grade na ordem nova.
- **DOM do canvas:** o canvas redesenha os cartões na ordem nova (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são o item e o destino.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: ok `src/core/data/commands.ts:279` `export const moveItemCommand = registerHandler('data.moveItem', (context, { collection, item, to }) =>` — as duas portas (seta para cima e para baixo) mandam a mesma intenção (o item e o destino) ao mesmo tratador.
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:283` `    return { document: withCollection(document, held.name, next), message: message('status.data.itemMoved', { collection: held.name, row: next.items.findIndex((one) => one.id === item) + 1 }) };`).
- G5: n/a — o comando não desenha controle: as setas do cartão vivem na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
