# ENT-P-content-0031 — data.bindElement pela porta data.bindElement#panel-drag-data-column
- **Comando:** data.bindElement
- **Porta:** `panel-drag-data-column` `manifest/commands/content.json:1594` `          "id": "panel-drag-data-column",`
- **Gatilho:** `manifest/commands/content.json:1599` `          "gesture": "data-column-drag",`
- **Início:** `src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);`
- **Tratador:** `src/app/commands.ts:170` `  'data.bindElement': bindElementCommand,`
- **Trecho:** TRC-data.bindElement

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do arraste de uma coluna do painel Dados até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.bindElement`; o trecho não é repetido.

## Passos
1. `src/editor/input/pointer/common.ts:493` `  if (control instanceof HTMLElement && entry && COLUMN_DRAGS.includes(entry) && isFeatureBuilt(entry.door.feature as FeatureId)) {` — o toque numa coluna do painel Dados reconhece a porta de arraste de coluna.
2. `src/editor/input/pointer/common.ts:496` `    if (typeof stands.field === 'string' && stands.field !== '') return { on: 'column', entry, args: stands, field: stands.field };` — o toque vira um toque de coluna com o campo que a coluna representa.
3. `src/editor/input/pointer/effects.ts:87` `      if (press.on === 'column') ps.columning = { press, over: null };` — no início do gesto, o toque guarda a coluna e marca que nada está sob o ponteiro ainda.
4. `src/editor/input/pointer/events.ts:416` `    if (ps.columning !== null && ps.machine.phase !== 'idle' && event.pointerId === ps.machine.pointer) p.moveColumn(at);` — cada movimento do ponteiro marca a parte do elemento sob ele.
5. `src/editor/input/pointer/panels.ts:66` `    ps.columning = { ...ps.columning, over };` — o destino sob o ponteiro (o nó e a parte) é guardado.
6. `src/editor/input/pointer/effects.ts:153` `    } else if (effect === 'commit' || effect === 'cancel') {` — a soltura do ponteiro (commit) ou o cancelamento do gesto.
7. `src/editor/input/pointer/effects.ts:154` `      const closing = shared.open;` — o gesto aberto que recebe o despacho.
8. `src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);` — a coluna solta sobre uma parte do elemento despacha o comando com o campo, o nó e o destino; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.bindElement`.

## Ramos
- R1 `src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);` — solta sobre uma parte (`over` não nulo): despacha; solta fora de qualquer parte, ou com o gesto cancelado: nada é despachado.
- R2 `src/editor/input/pointer/events.ts:416` `    if (ps.columning !== null && ps.machine.phase !== 'idle' && event.pointerId === ps.machine.pointer) p.moveColumn(at);` — com um toque de coluna em curso e o ponteiro do gesto, cada movimento marca o destino; sem toque de coluna, nada é marcado.

## Fronteiras assíncronas
- `src/editor/input/pointer/events.ts:416` `    if (ps.columning !== null && ps.machine.phase !== 'idle' && event.pointerId === ps.machine.pointer) p.moveColumn(at);` — entre a pressão e a soltura correm os quadros do arraste, em que o destino sob o ponteiro é marcado; o despacho em `src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);` é síncrono na soltura.

## Estado
- lê: nenhum item do inventário de estado no caminho citado; a porta lê o toque, o gesto aberto e o destino marcado sob o ponteiro (`src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.bindElement`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.bindElement`.
- **DOM do editor:** nada muda por esta porta `src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são o nó, o campo e o destino (`src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);`).
- G3: ok `src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);` — este arraste e o menu do campo mandam a mesma intenção (o nó, o campo e o destino) ao mesmo tratador.
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:318` `      working = replaceAt(working, holder.path, value);`).
- G5: n/a — o comando não desenha controle; o arraste vive no canvas e na colocação do painel (`manifest/commands/content.json:1595` `          "kind": "panel-drag",`).
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o gesto é fechado pelo dono do ponteiro (`src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);`); o caminho da porta não cria ouvinte, timer nem observador.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.bindElement
- **Argumentos enviados:** `{ field, node, to }` — o campo da coluna arrastada, o nó sob a soltura e a parte dele (`to`); o manifesto da porta declara `entry.door.args` vazio.
- R2 `src/core/data/commands.ts:308` `  if (!targetsOf(found.node, context.rules).includes(target)) return { kind: 'refused', message: message('status.data.cannotShow', { name: found.node.name, target: { key: `data.target.${target}` as MessageId } }) };` — o `to` desta porta é a parte sob a soltura (uma das `data-data-target`), então o caminho segue quando o elemento a mostra; fora delas, recusa.
- R3 `src/core/data/commands.ts:309` `  if (field === ITEM_PAGE && target !== 'link') return { kind: 'refused', message: message('status.data.cannotShow', { name: found.node.name, target: { key: `data.target.${target}` as MessageId } }) };` — o `field` desta porta só cai nesta recusa quando é o endereço de página de item e o `to` não é ligação.
- R4 `src/core/data/commands.ts:310` `  const bound = (held: readonly Bound[] | undefined): readonly Bound[] => [...(held ?? []).filter((b) => b.to !== target), ...(field === '' ? [] : [{ field, to: target }])];` — como o `field` desta porta vem de uma coluna com campo, o caminho entra no lado que acrescenta a ligação nova do destino.
