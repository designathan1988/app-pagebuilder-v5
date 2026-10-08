# ENT-P-content-0028 — data.importInto pela porta data.importInto#data-import-replace
- **Comando:** data.importInto
- **Porta:** `data-import-replace` `manifest/commands/content.json:1457` `          "id": "data-import-replace",`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:169` `  'data.importInto': importInto,`
- **Trecho:** TRC-data.importInto

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do botão desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.importInto`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:285` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (`{ mode: "replace" }`) sobre os que o lugar acrescenta (a coleção).
5. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.importInto`.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.importInto`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.importInto`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são a coleção e o modo (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — as três portas do comando (acrescentar, substituir e atualizar) mandam a mesma intenção (a coleção e o modo) ao mesmo tratador (`manifest/commands/content.json:1457` `          "id": "data-import-replace",`).
- G4: n/a — o tratador só grava estado (`src/editor/data/state.ts:243` `      ui: withData(context.state.ui, { collection: held.name, preview: undefined }),`).
- G5: n/a — o comando não desenha controle; os três botões vivem na colocação do painel (`manifest/commands/content.json:1471` `            "region": "data-preview",`).
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.importInto
- **Argumentos enviados:** `{ collection, mode: "replace" }` — a coleção mostrada e o modo fixo desta porta. As linhas vêm da planilha do estado.
- R3 `src/editor/data/state.ts:234` `    if (matched.size === 0) refuse('status.data.noColumnMatches', { collection: held.name });` — havendo coluna do arquivo casando um campo da `collection` desta porta, o caminho segue; nenhuma casando, recusa.
- R4 `src/editor/data/state.ts:236` `    const key = mode === 'update' ? (first === undefined ? undefined : matched.get(first)?.key) : null;` — o `mode` desta porta é `replace`, então a chave é `null` e o caminho segue sem exigir chave.
- R5 `src/core/data/collections.ts:225` `    if (keyValue === undefined) refuse('status.data.keyEmpty', { collection: collection.name, row: rowNumber, column: keyField.label });` — sem chave (`key` `null`), o caminho não passa pelas recusas de chave vazia nem repetida (`src/core/data/collections.ts:227` `    if (seen.has(identity)) refuse('status.data.keyRepeated', { collection: collection.name, row: rowNumber, column: keyField.label, value: cellText(keyValue, { yes: 'true', no: 'false' }) });`).
