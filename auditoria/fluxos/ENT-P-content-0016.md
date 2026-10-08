# ENT-P-content-0016 — data.removeField pela porta data.removeField#data-field-remove
- **Comando:** data.removeField
- **Porta:** `data-field-remove` `manifest/commands/content.json:724` `          "id": "data-field-remove",`
- **Início:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:159` `  'data.removeField': removeFieldCommand,`
- **Trecho:** TRC-data.removeField

Fluxo de porta do domínio `content`. Rastreia o caminho próprio da lixeira desenhada até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.removeField`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:286` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique na lixeira desenhada pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (a coleção e a chave do campo da linha).
5. `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.removeField`.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.removeField`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.removeField`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são a coleção e a chave de um campo existente (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:724` `          "id": "data-field-remove",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:246` `    return { document: withCollection(document, held.name, removeField(held, field)), message: message('status.data.fieldRemoved', { collection: held.name, label }) };`).
- G5: n/a — o comando não desenha controle; a lixeira vive na colocação do painel (`manifest/commands/content.json:738` `            "region": "data-collection",`).
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.removeField
- **Argumentos enviados:** `{ collection, field }` — a coleção mostrada e a chave do campo da linha cuja lixeira foi acionada.
- R1 `src/core/data/commands.ts:245` `    if (uses > 0) refuse('status.data.fieldInUse', { collection: held.name, label, count: { plural: 'data.places', count: uses } });` — o `field` desta porta em uso por ligações, filtros ou ordens recusa sem gravar; sem uso, o caminho segue para a retirada.
- R2 `src/core/data/collections.ts:152` `  if (fields.length === 0) return message('status.data.noFields', { collection });` — sendo o `field` desta porta o único da coleção, a retirada lança `DataRefusal` (vira `refused`); sobrando campos, segue para a troca da coleção.
