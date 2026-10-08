# ENT-P-content-0036 — regions.share pela porta regions.share#data-share
- **Comando:** regions.share
- **Porta:** `data-share` `manifest/commands/content.json:1934` `          "id": "data-share",`
- **Início:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:175` `  'regions.share': shareRegionCommand,`
- **Trecho:** TRC-regions.share

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do botão desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-regions.share`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:286` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (a lista das páginas escolhidas).
5. `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-regions.share`.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-regions.share`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-regions.share`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é a lista de páginas (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:1934` `          "id": "data-share",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:474` `    return { document: shared.document, message: message('status.regions.shared', { name: shared.name, count: { plural: 'data.pages', count: shared.count } }) };`).
- G5: n/a — o comando não desenha controle; o formulário vive na colocação do painel (`manifest/commands/content.json:1948` `            "region": "data-shared",`).
- G6: ok `src/core/data/commands.ts:65` `    const chosen = result.selection ?? context.state.selection;` — a seleção vem da store e é a única fonte para canvas e Camadas.
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-regions.share
- **Argumentos enviados:** `{ pages }` — a lista de arquivos das páginas escolhidas no painel, com `new` quando as páginas futuras também recebem a região.
- R3 `src/core/data/regions.ts:102` `  if (chosen.length === 0 && !newPages) refuse('status.regions.noPages', { name: found.node.name });` — com o `pages` desta porta trazendo uma página escolhida (ou `new`), o caminho segue; uma lista vazia sem `new` recusaria.
