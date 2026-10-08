# ENT-P-content-0032 — data.fill pela porta data.fill#data-fill
- **Comando:** data.fill
- **Porta:** `data-fill` `manifest/commands/content.json:1672` `          "id": "data-fill",`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:171` `  'data.fill': fillCommand,`
- **Trecho:** TRC-data.fill

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do botão desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.fill`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:285` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (o elemento, a coleção e a consulta).
5. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.fill`.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.fill`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.fill`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são o elemento, a coleção e a consulta (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:1672` `          "id": "data-fill",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:382` `    working = replaceAt(working, parentAt.path, { ...parentAt.node, dataList: list });`).
- G5: n/a — o comando não desenha controle; o botão vive na colocação do painel (`manifest/commands/content.json:1686` `            "region": "data-mapping",`).
- G6: ok `src/core/data/commands.ts:65` `    const chosen = result.selection ?? context.state.selection;` — a seleção vem da store (a resposta) e é a única fonte para canvas e Camadas.
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção resultantes são validados antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.fill
- **Argumentos enviados:** `{ node, collection, query }` — o elemento escolhido, a coleção e a consulta do painel; a consulta é entregue como JSON.
- R1 `src/core/data/commands.ts:346` `    if (refusedQuery !== null) throw new DataRefusal(refusedQuery);` — o `query` desta porta é conferido contra a `collection`; válido, o caminho segue; nomeando campo ausente ou contagem inválida, recusa.
- R2 `src/core/data/commands.ts:348` `    if (found === null) throw new Error(` — o `node` desta porta existe no projeto, então o caminho segue; um nó ausente lançaria defeito da porta.
- R3 `src/core/data/commands.ts:349` `    if (found.parent === null) refuse('status.data.fillRoot', { name: found.node.name });` — com o `node` desta porta fora da raiz o caminho segue; sendo a raiz, recusa.
- R5 `src/core/data/commands.ts:358` `      const refused = createRefusal(document, found.node.id as NodeId);` — o `node` desta porta que pode virar componente segue; dentro de instância, pai de instância ou travado, recusa.
- R6 `src/core/data/commands.ts:374` `    if (bound.length === 0) refuse('status.data.noBindings', { name: found.node.name });` — o `node` desta porta com alguma ligação na definição segue; sem nenhuma, recusa.
- R7 `src/core/data/commands.ts:376` `    if (unknown !== undefined) refuse('status.data.unknownField', { collection: held.name, field: unknown.field });` — a `collection` desta porta que tem todos os campos ligados segue; uma ligação a campo ausente recusa.
- R8 `src/core/data/commands.ts:378` `    if (other !== undefined && other.component !== definition.name) refuse('status.data.otherList', { name: parent.name, collection: other.collection });` — o pai do `node` desta porta que já não é outra lista segue; sendo outra lista, recusa.
