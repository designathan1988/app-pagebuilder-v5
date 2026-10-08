# TRC-data.unbind
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ node: string }`; a porta `data-unbind` manda o nó (a lista ou um cartão dela).
- **Ramos que dependem dos argumentos:** R1 (o nó não é lista nem cartão de lista), R2 (a lista está travada), R3 (o nó não existe).

## Passos
1. `src/app/commands.ts:172` `  'data.unbind': unbindCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:389` `export const unbindCommand = registerHandler('data.unbind', (context, { node }): Outcome<never> =>` — o tratador recebe o nó. [nada muda]
3. `src/core/data/commands.ts:390` `  contentChange(context, (document) => {` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/core/data/commands.ts:391` `    const found = locate(document, node);` — localiza o nó. [lê: EST-L01-030 via locate]
6. `src/core/data/commands.ts:392` `    if (found === null) throw new Error(` — nó ausente é defeito da porta (R3). [nada muda]
7. `src/core/data/commands.ts:394` `    const listAt = found.node.dataList !== undefined ? found : found.parent?.dataList !== undefined ? locate(document, found.parent.id as NodeId) : null;` — o nó é a lista ou o pai dele a lista (R1). [lê: EST-L01-030 via locate]
8. `src/core/data/commands.ts:395` `    if (listAt === null || listAt.node.dataList === undefined) refuse('status.data.notList', { name: found.node.name });` — fora de lista recusa (R1). [nada muda]
9. `src/core/data/commands.ts:396` `    const locked = lockRefusal(document, listAt.node.id as NodeId, 'status.locked.edit');` — confere se a lista está travada. [lê: EST-L01-030 via lockRefusal]
10. `src/core/data/commands.ts:397` `    if (locked !== null) throw new DataRefusal(locked);` — lista travada recusa (R2). [nada muda]
11. `src/core/data/commands.ts:398` `    const { dataList, ...plain } = listAt.node;` — a marca de lista sai do nó. [escreve: EST-L01-030 via run]
12. `src/core/data/commands.ts:399` `    return { document: replaceAt(document, listAt.path, plain), message: message('status.data.listUnbound', { name: listAt.node.name, collection: dataList.collection }) };` — o documento novo troca o nó pelo sem a lista. [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]
13. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue: os cartões ficam como instâncias comuns. [lê: EST-L01-030 via derivedDocument]
14. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
15. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
16. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
17. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
18. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-003 via publish]
19. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/core/data/commands.ts:395` `    if (listAt === null || listAt.node.dataList === undefined) refuse('status.data.notList', { name: found.node.name });` — nó que não é lista nem cartão de lista recusa; lista segue.
- R2: `src/core/data/commands.ts:397` `    if (locked !== null) throw new DataRefusal(locked);` — lista travada recusa (a `DataRefusal` vira `refused` em `src/core/data/commands.ts:70` `    if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };`); lista livre segue.
- R3: `src/core/data/commands.ts:392` `    if (found === null) throw new Error(` — nó ausente é defeito da porta.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `derivedDocument` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`document.pages`, `document.components`), EST-L01-032 (`history`).

## Resultado
- **Estado final:** a lista deixa de seguir a coleção e os cartões ficam como instâncias comuns, mantendo o que mostram (`src/core/data/commands.ts:399` `    return { document: replaceAt(document, listAt.path, plain), message: message('status.data.listUnbound', { name: listAt.node.name, collection: dataList.collection }) };`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha o elemento sem a lista.
- **DOM do canvas:** o canvas redesenha os cartões como instâncias comuns (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é um nó existente.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:1730` `      "id": "data-unbind",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:399` `    return { document: replaceAt(document, listAt.path, plain), message: message('status.data.listUnbound', { name: listAt.node.name, collection: dataList.collection }) };`).
- G5: n/a — o comando não desenha controle: o botão vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
