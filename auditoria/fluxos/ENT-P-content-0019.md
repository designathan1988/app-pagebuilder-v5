# ENT-P-content-0019 — data.deleteItems pela porta data.deleteItems#data-item-delete
- **Comando:** data.deleteItems
- **Porta:** `data-item-delete` `manifest/commands/content.json:936` `          "id": "data-item-delete",`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:162` `  'data.deleteItems': deleteItemsCommand,`
- **Trecho:** TRC-data.deleteItems

Fluxo de porta do domínio `content`. Rastreia o caminho próprio da lixeira desenhada até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.deleteItems`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:285` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique na lixeira desenhada pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (a coleção e os ids dos cartões escolhidos).
5. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.deleteItems`.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.deleteItems`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.deleteItems`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; a entrada é a lista de ids de cartões existentes (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:936` `          "id": "data-item-delete",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:275` `    return { document: withCollection(document, held.name, deleteItems(held, ids)), message: message('status.data.itemsDeleted', { collection: held.name, count: { plural: 'data.items', count: ids.length } }) };`).
- G5: n/a — o comando não desenha controle; a lixeira vive na colocação do painel (`manifest/commands/content.json:950` `            "region": "data-grid",`).
- G6: ok `src/core/data/commands.ts:66` `    const selection = chosen.filter((id) => locate(after, id) !== null);` — a seleção derivada tira só o que a derivação retirou, e a store publica a mesma seleção para todas as vistas.
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção resultantes são validados antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.deleteItems
- **Argumentos enviados:** `{ collection, items }` — a coleção mostrada e a lista de ids dos cartões escolhidos no painel.
- R1 `src/core/data/commands.ts:274` `    if (ids.length === 0) throw new Error('data.deleteItems: no item');` — a porta só é acionada com cartões escolhidos, então o `items` desta porta tem ids e o caminho segue; uma lista vazia lançaria defeito da porta.
- R2 `src/core/data/collections.ts:258` `  for (const id of gone) if (!collection.items.some((item) => item.id === id)) refuse('status.stale');` — um id do `items` desta porta que a coleção já não tem recusa por `status.stale` antes de qualquer mudança; existindo todos, segue para a retirada.
