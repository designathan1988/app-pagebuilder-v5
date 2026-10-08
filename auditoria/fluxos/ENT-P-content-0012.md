# ENT-P-content-0012 — data.deleteCollection pela porta data.deleteCollection#data-collection-delete
- **Comando:** data.deleteCollection
- **Porta:** `data-collection-delete` `manifest/commands/content.json:475` `          "id": "data-collection-delete",`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:156` `  'data.deleteCollection': deleteCollectionCommand<EditorUi>(),`
- **Trecho:** TRC-data.deleteCollection

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do botão desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.deleteCollection`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:285` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (a coleção mostrada).
5. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.deleteCollection`.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- o `confirm` pedido pelo tratador interrompe o despacho: a store publica o estado com `confirmation` e espera a resposta da pessoa antes de reexecutar o tratador (`src/core/store/store.ts:455` `    if (outcome.kind === 'confirm') {`). No intervalo a aplicação está com uma confirmação pendente, sem mudança no documento; outras entradas do painel de diálogo podem rodar.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.deleteCollection`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.deleteCollection`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é o nome de uma coleção que existe (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:475` `          "id": "data-collection-delete",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:186` `      const ui = context.state.ui?.data?.collection === held.name ? { ...context.state.ui, data: { ...context.state.ui.data, collection: rest[0]?.name } } : context.state.ui;`).
- G5: n/a — o comando não desenha controle; a lixeira vive na colocação do painel (`manifest/commands/content.json:489` `            "region": "data-collection",`).
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.deleteCollection
- **Argumentos enviados:** `{ collection }` — a porta declara `entry.door.args` vazio e o lugar acrescenta a coleção mostrada.
- R1 `src/core/data/commands.ts:165` `    if (context.confirmed !== true) return { kind: 'confirm', params: { name: held.name, count: usesOf(context.state.document, held.name) } };` — a primeira vez que esta porta despacha, `confirmed` é falso, então o caminho passa pelo lado que pede a confirmação com o nome e a contagem de usos; confirmada, o tratador reexecuta e segue para a remoção.
- R2 `src/core/data/commands.ts:185` `      const base: DocumentJson = rest.length === 0 ? without : { ...without, collections: rest };` — o lado tomado depende de a `collection` desta porta ser a última do projeto: restando outras, fica a lista restante; sendo a última, a chave `collections` sai.
