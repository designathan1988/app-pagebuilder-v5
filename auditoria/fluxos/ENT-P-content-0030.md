# ENT-P-content-0030 — data.bindElement pela porta data.bindElement#data-bind-field
- **Comando:** data.bindElement
- **Porta:** `data-bind-field` `manifest/commands/content.json:1568` `          "id": "data-bind-field",`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:170` `  'data.bindElement': bindElementCommand,`
- **Trecho:** TRC-data.bindElement

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do menu do campo até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.bindElement`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:285` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — a escolha de um item do menu desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (o nó, o campo e o destino).
5. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.bindElement`.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.bindElement`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.bindElement`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são o nó, o campo e o destino (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — o menu do campo e o arraste de coluna mandam a mesma intenção (o nó, o campo e o destino) ao mesmo tratador (`manifest/commands/content.json:1568` `          "id": "data-bind-field",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:318` `      working = replaceAt(working, holder.path, value);`).
- G5: n/a — o comando não desenha controle; o menu vive na colocação do painel (`manifest/commands/content.json:1582` `            "region": "data-mapping",`).
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.bindElement
- **Argumentos enviados:** `{ node, field, to }` — o nó de destino, o campo escolhido e o destino da ligação.
- R2 `src/core/data/commands.ts:308` `  if (!targetsOf(found.node, context.rules).includes(target)) return { kind: 'refused', message: message('status.data.cannotShow', { name: found.node.name, target: { key: `data.target.${target}` as MessageId } }) };` — o `to` desta porta entre os destinos que o elemento mostra segue; fora deles, recusa.
- R3 `src/core/data/commands.ts:309` `  if (field === ITEM_PAGE && target !== 'link') return { kind: 'refused', message: message('status.data.cannotShow', { name: found.node.name, target: { key: `data.target.${target}` as MessageId } }) };` — o `field` desta porta só cai nesta recusa quando é o endereço de página de item e o `to` não é ligação.
- R4 `src/core/data/commands.ts:310` `  const bound = (held: readonly Bound[] | undefined): readonly Bound[] => [...(held ?? []).filter((b) => b.to !== target), ...(field === '' ? [] : [{ field, to: target }])];` — com o `field` desta porta preenchido entra a ligação nova; com `field` vazio a ligação do destino sai.
