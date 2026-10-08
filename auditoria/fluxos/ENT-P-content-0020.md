# ENT-P-content-0020 — data.moveItem pela porta data.moveItem#data-item-up
- **Comando:** data.moveItem
- **Porta:** `data-item-up` `manifest/commands/content.json:1010` `          "id": "data-item-up",`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:163` `  'data.moveItem': moveItemCommand,`
- **Trecho:** TRC-data.moveItem

Fluxo de porta do domínio `content`. Rastreia o caminho próprio da seta desenhada até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.moveItem`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:285` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique na seta desenhada pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (a coleção, o item e o destino acima).
5. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.moveItem`.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.moveItem`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.moveItem`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são o item e o destino (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — as duas portas do comando (a seta para cima e a para baixo) mandam a mesma intenção (o item e o destino) ao mesmo tratador (`manifest/commands/content.json:1010` `          "id": "data-item-up",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:283` `    return { document: withCollection(document, held.name, next), message: message('status.data.itemMoved', { collection: held.name, row: next.items.findIndex((one) => one.id === item) + 1 }) };`).
- G5: n/a — o comando não desenha controle; as setas vivem na colocação do painel (`manifest/commands/content.json:1024` `            "region": "data-grid",`).
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.moveItem
- **Argumentos enviados:** `{ collection, item, to }` — a coleção, o item da seta e o destino uma posição acima.
- R1 `src/core/data/collections.ts:268` `  const place = Math.max(0, Math.min(rest.length, Math.trunc(to)));` — o `to` desta porta é a posição acima, presa aos extremos quando fora do intervalo; é o lado que reordena o item.
- R2 `src/core/data/collections.ts:266` `  if (moved === undefined) refuse('status.stale');` — a `item` desta porta que a coleção já não tem recusa por `status.stale`; existindo, segue.
