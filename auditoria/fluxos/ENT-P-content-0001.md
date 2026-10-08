# ENT-P-content-0001 — data.select pela porta data.select#data-collection-tab
- **Comando:** data.select
- **Porta:** `data-collection-tab` `manifest/commands/content.json:28` `          "id": "data-collection-tab",`
- **Início:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:152` `  'data.select': selectCollection,`
- **Trecho:** TRC-data.select

Fluxo de porta do domínio `content`. Rastreia o caminho próprio da aba desenhada até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.select`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:286` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique na aba desenhada pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o painel acrescenta (a coleção da aba).
5. `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.select`.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — esta porta não manda arquivo (`file`, `files` e `clipboard` indefinidos), então o caminho toma o despacho direto; um comando que lê arquivo seguiria pelos ramos das linhas 99 a 142.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o painel acrescenta (`src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.select`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.select`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; o único argumento é um nome de coleção vindo da porta (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:28` `          "id": "data-collection-tab",`).
- G4: n/a — o tratador só grava estado do editor e nada é colocado sobre o canvas (`src/editor/data/state.ts:48` `kind: 'change', ui: withData(state.ui, { collection, query: undefined })`).
- G5: n/a — o comando não desenha controle; a aba vive na colocação do painel (`manifest/commands/content.json:42` `          "region": "data-panel",`).
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:48` `kind: 'change', ui: withData(state.ui, { collection, query: undefined })`).
- G7: n/a — o resultado não traz patches; o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento (`src/editor/data/state.ts:48` `kind: 'change', ui: withData(state.ui, { collection, query: undefined })`).

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.select
- **Argumentos enviados:** `{ collection }` — a porta declara `entry.door.args` vazio e o painel acrescenta `collection`, o nome da coleção da aba.
- R1 `src/editor/data/state.ts:47` `if (held === undefined) throw new Error(` — a coleção desta aba existe no projeto (`collectionNamed` a encontra), então o caminho passa pelo lado que segue para a gravação do passo 6 do trecho; uma coleção ausente lançaria defeito da porta.
