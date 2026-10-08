# TRC-regions.share
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ pages: json }`; a porta `data-share` manda a lista de arquivos das páginas escolhidas (com `new` para as futuras). O elemento é a seleção da store.
- **Ramos que dependem dos argumentos:** R3 (nenhuma página e sem `new`). Os demais dependem do estado (R1 seleção não única, R2 elemento fora do nível de página, R4 elemento que não pode virar componente, R5 elemento travado).

## Passos
1. `src/app/commands.ts:175` `  'regions.share': shareRegionCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/store/store.ts:415` `    const predicate = predicates[command.availability.predicate as keyof PredicateTable<Ui>];` — o predicado `singleSelection` roda antes do tratador. [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:416` `    if (predicate && !predicate.test(state, layeredNow(at), args)) {` — seleção não única recusa pela recusa declarada `status.needsSingleSelection` (R1). [lê: EST-L01-031 via run]
4. `src/core/data/commands.ts:469` `export const shareRegionCommand = registerHandler('regions.share', (context, { pages }): Outcome<never> =>` — o tratador recebe as páginas. [nada muda]
5. `src/core/data/commands.ts:470` `  contentChange(context, (document, data) => {` — o documento novo é calculado por `contentChange`. [nada muda]
6. `src/core/data/commands.ts:471` `    const node = context.state.selection[0];` — o elemento é o primeiro da seleção. [lê: EST-L01-031 via handlerContext]
7. `src/core/data/commands.ts:472` `    if (node === undefined || context.state.selection.length !== 1) refuse('status.needsSingleSelection');` — seleção não única recusa também aqui (R1). [lê: EST-L01-031 via handlerContext]
8. `src/core/data/commands.ts:465` `const pagesList = (value: unknown): readonly string[] => (Array.isArray(value) ? value.filter((one): one is string => typeof one === 'string') : []);` — lê a lista de páginas. [lê: EST-L01-030 via pagesList]
9. `src/core/data/commands.ts:473` `    const shared = shareRegion(document, node, pagesList(pages), data);` — o documento com a região compartilhada. [escreve: EST-L01-030 via run]
10. `src/core/data/regions.ts:93` `export function shareRegion(document: DocumentJson, id: NodeId, pages: readonly string[], context: DataContext): { readonly document: DocumentJson; readonly name: string; readonly count: number } {` — a região é compartilhada com as páginas. [nada muda]
11. `src/core/data/regions.ts:94` `  const found = locate(document, id);` — localiza o elemento. [lê: EST-L01-030 via shareRegion]
12. `src/core/data/regions.ts:97` `  if (found.parent === null || grand === null || grand.parent !== null) refuse('status.regions.notTopLevel', { name: found.node.name });` — elemento que não está direto dentro da página recusa (R2). [nada muda]
13. `src/core/data/regions.ts:99` `  if (locked !== null) throw new DataRefusal(locked);` — elemento travado recusa (R5). [nada muda]
14. `src/core/data/regions.ts:102` `  if (chosen.length === 0 && !newPages) refuse('status.regions.noPages', { name: found.node.name });` — nenhuma página escolhida e sem `new` recusa (R3). [nada muda]
15. `src/core/data/regions.ts:110` `    const refused = createRefusal(document, id);` — o que `components.create` recusaria recusa (R4). [nada muda]
16. `src/core/data/regions.ts:130` `    working = received(working, index, definition, region, make, context);` — cada página escolhida recebe a instância da região. [escreve: EST-L01-030 via shareRegion]
17. `src/core/data/commands.ts:474` `    return { document: shared.document, message: message('status.regions.shared', { name: shared.name, count: { plural: 'data.pages', count: shared.count } }) };` — a resposta leva o documento com a região. [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]
18. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
19. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
20. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
21. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
22. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-030 via publish]
23. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/store/store.ts:416` `    if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a seleção não sendo única, a recusa declarada `status.needsSingleSelection` é dita antes do tratador; a checagem do tratador (`src/core/data/commands.ts:472` `    if (node === undefined || context.state.selection.length !== 1) refuse('status.needsSingleSelection');`) repete a mesma recusa.
- R2: `src/core/data/regions.ts:97` `  if (found.parent === null || grand === null || grand.parent !== null) refuse('status.regions.notTopLevel', { name: found.node.name });` — elemento que não está direto dentro da raiz da página recusa.
- R3: `src/core/data/regions.ts:102` `  if (chosen.length === 0 && !newPages) refuse('status.regions.noPages', { name: found.node.name });` — sem página escolhida e sem `new` recusa; com página ou `new` segue.
- R4: `src/core/data/regions.ts:110` `    const refused = createRefusal(document, id);` — elemento que não pode virar componente recusa.
- R5: `src/core/data/regions.ts:99` `  if (locked !== null) throw new DataRefusal(locked);` — elemento travado recusa (a `DataRefusal` vira `refused` em `src/core/data/commands.ts:70` `    if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };`).

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `shareRegion` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (o documento: `state.document`, via contentChange, shareRegion, pagesList), EST-L01-031 (a seleção: `state.selection`, via run, handlerContext).
- Escreve: EST-L01-030 (o documento: `document.components` e `document.pages`, via run, shareRegion, commit, publish), EST-L01-032 (o histórico, via run), EST-L01-033 (a mensagem, via run, publish).

## Resultado
- **Estado final:** o elemento vira componente compartilhado e cada página escolhida recebe uma instância, e as páginas feitas depois recebem a região quando `new` está na lista (`src/core/data/commands.ts:474` `    return { document: shared.document, message: message('status.regions.shared', { name: shared.name, count: { plural: 'data.pages', count: shared.count } }) };`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha o formulário de regiões.
- **DOM do canvas:** o canvas redesenha as páginas com a região (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é a lista de páginas.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:1934` `          "id": "data-share",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:474` `    return { document: shared.document, message: message('status.regions.shared', { name: shared.name, count: { plural: 'data.pages', count: shared.count } }) };`).
- G5: n/a — o comando não desenha controle: o formulário vive na colocação do painel.
- G6: ok `src/core/data/commands.ts:65` `    const chosen = result.selection ?? context.state.selection;` — a seleção vem da store e é a única fonte para canvas e Camadas.
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
