# ENT-P-content-0011 — data.renameCollection pela porta data.renameCollection#data-collection-name
- **Comando:** data.renameCollection
- **Porta:** `data-collection-name` `manifest/commands/content.json:416` `          "id": "data-collection-name",`
- **Início:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:155` `  'data.renameCollection': renameCollectionCommand<EditorUi>(),`
- **Trecho:** TRC-data.renameCollection

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do campo desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.renameCollection`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:286` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o envio do campo desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (a coleção mostrada e o nome digitado).
5. `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.renameCollection`.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.renameCollection`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.renameCollection`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/core/data/commands.ts:125` `  return registerHandler<'data.renameCollection', Ui>('data.renameCollection', (context, { collection, name }) =>` — o nome digitado é gravado no contexto capturado na primeira digitação (a porta entrega `collection` junto com `name`).
- G2: ok `src/core/data/commands.ts:128` `      const typed = name.trim();` — o tratador lê o texto entregue pela porta, que é o do contexto da digitação.
- G3: ok `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:416` `          "id": "data-collection-name",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:147` `        ui: context.state.ui?.data?.collection === held.name ? { ...context.state.ui, data: { ...context.state.ui.data, collection: typed } } : context.state.ui,`).
- G5: n/a — o comando não desenha controle; o campo vive na colocação do painel (`manifest/commands/content.json:430` `            "region": "data-collection",`).
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.renameCollection
- **Argumentos enviados:** `{ collection, name }` — `collection` é a coleção mostrada e `name` é o texto digitado no campo.
- R1 `src/core/data/commands.ts:129` `      if (typed === held.name) return { document, message: message('status.data.renamed', { name: typed }) };` — com um `name` igual ao nome atual o caminho para no documento sem mudança; com texto diferente segue para a troca.
- R2 `src/core/data/commands.ts:130` `      const refused = nameRefusal(collectionsOf(document), typed, held.name);` — o `name` desta porta é conferido contra as outras coleções: vazio ou repetido recusa (`src/core/data/collections.ts:170` `  if (trimmed === '') return message('status.data.nameEmpty');` e `src/core/data/collections.ts:171` `  if (collections.some((c) => c.name !== except && fold(c.name) === fold(trimmed))) return message('status.data.nameTaken', { name: trimmed });`); livre, segue.
- R4 `src/core/data/commands.ts:147` `        ui: context.state.ui?.data?.collection === held.name ? { ...context.state.ui, data: { ...context.state.ui.data, collection: typed } } : context.state.ui,` — como a porta entrega a coleção mostrada como `collection`, a `ui` passa a apontar para o nome novo quando era a renomeada; caso contrário fica como estava.
