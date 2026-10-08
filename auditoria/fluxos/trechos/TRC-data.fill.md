# TRC-data.fill
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ node: string, collection: string, query: json }`; a porta `data-fill` manda o elemento, a coleção e a consulta.
- **Ramos que dependem dos argumentos:** R1 (consulta recusada), R2 (nó ausente), R3 (elemento é a raiz), R5 (elemento não pode virar componente), R6 (sem ligações), R7 (campo desconhecido), R8 (o pai já é outra lista).

## Passos
1. `src/app/commands.ts:171` `  'data.fill': fillCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:341` `export const fillCommand = registerHandler('data.fill', (context, { node, collection, query }): Outcome<never> =>` — o tratador recebe o nó, a coleção e a consulta. [nada muda]
3. `src/core/data/commands.ts:342` `  contentChange(context, (document, data) => {` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/core/data/commands.ts:343` `    const held = named(document, collection);` — procura a coleção. [lê: EST-L01-030 via named]
6. `src/core/data/commands.ts:344` `    const asked = queryOf(query);` — lê a consulta. [lê: EST-L01-030 via handlerContext]
7. `src/core/data/commands.ts:345` `    const refusedQuery = queryRefusal(held, asked);` — confere a consulta contra a coleção (R1). [lê: EST-L01-030 via queryRefusal]
8. `src/core/data/commands.ts:346` `    if (refusedQuery !== null) throw new DataRefusal(refusedQuery);` — consulta inválida recusa (R1). [nada muda]
9. `src/core/data/commands.ts:347` `    const found = locate(document, node);` — localiza o elemento. [lê: EST-L01-030 via locate]
10. `src/core/data/commands.ts:348` `    if (found === null) throw new Error(` — nó ausente é defeito da porta (R2). [nada muda]
11. `src/core/data/commands.ts:349` `    if (found.parent === null) refuse('status.data.fillRoot', { name: found.node.name });` — elemento raiz recusa (R3). [nada muda]
12. `src/core/data/commands.ts:353` `      if (locked !== null) throw new DataRefusal(locked);` — elemento ou pai travado recusa (R4). [nada muda]
13. `src/core/data/commands.ts:357` `    if (found.node.component === undefined) {` — elemento que ainda não é instância vira componente (R5). [nada muda]
14. `src/core/data/commands.ts:358` `      const refused = createRefusal(document, found.node.id as NodeId);` — o que `components.create` recusaria é recusado aqui. [nada muda]
15. `src/core/data/commands.ts:365` `      const name = componentName(document, found.node.name);` — o componente nasce com o nome do elemento. [nada muda]
16. `src/core/data/commands.ts:371` `      working = replaceAt(working, found.path, marked(found.node, [], name));` — o elemento passa a ser a instância do componente novo. [escreve: EST-L01-030 via run]
17. `src/core/data/commands.ts:373` `    const bound = boundIn(definition.tree).flatMap((n) => n.bind ?? []);` — as ligações da definição. [lê: EST-L01-030 via boundIn]
18. `src/core/data/commands.ts:374` `    if (bound.length === 0) refuse('status.data.noBindings', { name: found.node.name });` — sem nenhuma ligação recusa (R6). [nada muda]
19. `src/core/data/commands.ts:376` `    if (unknown !== undefined) refuse('status.data.unknownField', { collection: held.name, field: unknown.field });` — ligação a campo que a coleção não tem recusa (R7). [nada muda]
20. `src/core/data/commands.ts:378` `    if (other !== undefined && other.component !== definition.name) refuse('status.data.otherList', { name: parent.name, collection: other.collection });` — pai que já é outra lista recusa (R8). [nada muda]
21. `src/core/data/commands.ts:382` `    working = replaceAt(working, parentAt.path, { ...parentAt.node, dataList: list });` — o pai vira a lista ligada. [escreve: EST-L01-030 via run]
22. `src/core/data/commands.ts:384` `    return { document: working, message: message('status.data.listFilled', { name: definition.name, collection: held.name, count: { plural: 'data.items', count } }), selection: [found.node.id as NodeId] };` — a resposta traz a seleção do elemento. [escreve: EST-L01-030 via run] [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]
23. `src/core/data/commands.ts:65` `    const chosen = result.selection ?? context.state.selection;` — a seleção da resposta. [lê: EST-L01-031 via contentChange]
24. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
25. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
26. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
27. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
28. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-003 via publish]
29. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/core/data/commands.ts:346` `    if (refusedQuery !== null) throw new DataRefusal(refusedQuery);` — consulta que nomeia campo ausente ou contagem inválida lança `DataRefusal`, convertida em `refused` (`src/core/data/commands.ts:70` `    if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };`).
- R2: `src/core/data/commands.ts:348` `    if (found === null) throw new Error(` — nó ausente é defeito da porta.
- R3: `src/core/data/commands.ts:349` `    if (found.parent === null) refuse('status.data.fillRoot', { name: found.node.name });` — elemento raiz recusa; com pai segue.
- R4: `src/core/data/commands.ts:352` `      const locked = lockRefusal(document, id as NodeId, 'status.locked.edit');` — elemento ou pai travado recusa.
- R5: `src/core/data/commands.ts:358` `      const refused = createRefusal(document, found.node.id as NodeId);` — elemento que não pode virar componente (dentro de instância, pai de instância, travado) recusa.
- R6: `src/core/data/commands.ts:374` `    if (bound.length === 0) refuse('status.data.noBindings', { name: found.node.name });` — definição sem ligação recusa.
- R7: `src/core/data/commands.ts:376` `    if (unknown !== undefined) refuse('status.data.unknownField', { collection: held.name, field: unknown.field });` — ligação a campo desconhecido recusa.
- R8: `src/core/data/commands.ts:378` `    if (other !== undefined && other.component !== definition.name) refuse('status.data.otherList', { name: parent.name, collection: other.collection });` — pai que já segue outra lista recusa.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `derivedDocument` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`).
- Escreve: EST-L01-030 (`document.components`, `document.pages`), EST-L01-031 (`selection`), EST-L01-032 (`history`).

## Resultado
- **Estado final:** o elemento repete os itens da coleção dentro do pai ligado, e a seleção vai para o elemento (`src/core/data/commands.ts:384` `    return { document: working, message: message('status.data.listFilled', { name: definition.name, collection: held.name, count: { plural: 'data.items', count } }), selection: [found.node.id as NodeId] };`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha e as Camadas mostram o pai como lista.
- **DOM do canvas:** o canvas redesenha os cartões repetidos novos (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são o elemento, a coleção e a consulta.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:1672` `      "id": "data-fill",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:382` `    working = replaceAt(working, parentAt.path, { ...parentAt.node, dataList: list });`).
- G5: n/a — o comando não desenha controle: o botão vive na colocação do painel.
- G6: ok `src/core/data/commands.ts:65` `    const chosen = result.selection ?? context.state.selection;` — a seleção vem da store (a resposta) e é a única fonte para canvas e Camadas.
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção resultantes são validados antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
