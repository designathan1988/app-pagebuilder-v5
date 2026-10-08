# TRC-regions.detach
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ node: string }`; a porta `data-shared-detach` manda o nó (a instância da região na página).
- **Ramos que dependem dos argumentos:** R2 (o nó não é região compartilhada). Os demais dependem do estado (R1 o nó está travado).

## Passos
1. `src/app/commands.ts:176` `  'regions.detach': detachRegionCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:478` `export const detachRegionCommand = registerHandler('regions.detach', (context, { node }): Outcome<never> =>` — o tratador recebe o nó. [nada muda]
3. `src/core/data/commands.ts:479` `  contentChange(context, (document) => {` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/core/data/commands.ts:480` `    const page = document.pages.find((p) => [...walk(p.tree)].some((n) => n.id === node));` — acha a página do nó, para nomeá-la na mensagem. [lê: EST-L01-030 via handlerContext]
6. `src/core/data/commands.ts:481` `    const detached = detachRegion(document, node);` — a instância vira cópia própria. [escreve: EST-L01-030 via run]
7. `src/core/data/regions.ts:137` `export function detachRegion(document: DocumentJson, id: NodeId): { readonly document: DocumentJson; readonly name: string } {` — o desvínculo. [nada muda]
8. `src/core/data/regions.ts:140` `  if (found === null || definition === undefined || sharedOf(definition) === undefined) refuse('status.regions.notShared', { name: found?.node.name ?? '' });` — nó que não é região compartilhada recusa (R2). [nada muda]
9. `src/core/data/regions.ts:141` `  const locked = lockRefusal(document, id, 'status.locked.edit');` — confere se o nó está travado. [lê: EST-L01-030 via detachRegion]
10. `src/core/data/regions.ts:142` `  if (locked !== null) throw new DataRefusal(locked);` — nó travado recusa (R1). [nada muda]
11. `src/core/data/regions.ts:144` `    const tree = replaced(page.tree, id, unmarked(found.node));` — a instância perde a marca de região. [escreve: EST-L01-030 via detachRegion]
12. `src/core/data/commands.ts:482` `    return { document: detached.document, message: message('status.regions.detached', { name: detached.name, page: page?.name ?? '' }) };` — a resposta leva o documento e a mensagem com a página. [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]
13. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
14. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
15. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
16. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
17. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-030 via publish]
18. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/data/regions.ts:142` `  if (locked !== null) throw new DataRefusal(locked);` — nó travado recusa (a `DataRefusal` vira `refused` em `src/core/data/commands.ts:70` `    if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };`); nó livre segue.
- R2: `src/core/data/regions.ts:140` `  if (found === null || definition === undefined || sharedOf(definition) === undefined) refuse('status.regions.notShared', { name: found?.node.name ?? '' });` — nó que não é instância de região compartilhada recusa; sendo, segue.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `detachRegion` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (o documento: `state.document`, via contentChange, handlerContext, detachRegion).
- Escreve: EST-L01-030 (o documento: `document.pages`, via run, detachRegion, commit, publish), EST-L01-032 (o histórico, via run), EST-L01-033 (a mensagem, via run, publish).

## Resultado
- **Estado final:** a página fica com a própria cópia da região, que não segue mais as edições das outras páginas (`src/core/data/regions.ts:147` `  return { document: { ...document, pages }, name: definition.name };`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha o formulário de regiões.
- **DOM do canvas:** o canvas redesenha a página desvinculada (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é um nó existente.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:1992` `          "id": "data-shared-detach",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:482` `    return { document: detached.document, message: message('status.regions.detached', { name: detached.name, page: page?.name ?? '' }) };`).
- G5: n/a — o comando não desenha controle: o botão vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
