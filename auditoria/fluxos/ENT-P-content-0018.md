# ENT-P-content-0018 — data.setCell pela porta data.setCell#data-cell
- **Comando:** data.setCell
- **Porta:** `data-cell` `manifest/commands/content.json:867` `          "id": "data-cell",`
- **Início:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:161` `  'data.setCell': setCellCommand,`
- **Trecho:** TRC-data.setCell

Fluxo de porta do domínio `content`. Rastreia o caminho próprio da célula desenhada até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.setCell`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:286` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o envio da célula desenhada pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (a coleção, a linha, o campo e o valor digitado).
5. `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.setCell`.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.setCell`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.setCell`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/core/data/commands.ts:260` `export const setCellCommand = registerHandler('data.setCell', (context, { collection, item, field, value }) =>` — a linha, o campo e o valor digitado são gravados no contexto capturado na primeira digitação.
- G2: ok `src/core/data/commands.ts:263` `    const next = setCell(held, item, field, value);` — o tratador lê o texto entregue pela porta, que é o do contexto da digitação.
- G3: ok `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:867` `          "id": "data-cell",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:266` `    return { document: withCollection(document, held.name, next), message: message('status.data.cellSet', { collection: held.name, row, column: label }) };`).
- G5: n/a — o comando não desenha controle; a célula vive na colocação do painel (`manifest/commands/content.json:881` `            "region": "data-grid",`).
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.setCell
- **Argumentos enviados:** `{ collection, item, field, value }` — a linha e o campo da célula editada e o texto digitado.
- R1 `src/core/data/collections.ts:245` `  if (read === null) refuse('status.data.badValue', { collection: collection.name, row: index + 1, column: field.label, value: shownValue(typed), type: { key:` — o `value` desta porta fora do tipo do campo recusa nomeando linha e coluna; aceito, o caminho grava a forma canônica.
- R2 `src/core/data/collections.ts:243` `  if (field === undefined || item === undefined) refuse('status.stale');` — a `item` e o `field` desta porta que já não existem recusam por `status.stale`; existindo, segue.
