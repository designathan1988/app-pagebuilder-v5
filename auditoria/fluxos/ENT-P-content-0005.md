# ENT-P-content-0005 — data.setQuery pela porta data.setQuery#data-sort-first
- **Comando:** data.setQuery
- **Porta:** `data-sort-first` `manifest/commands/content.json:182` `          "id": "data-sort-first",`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:153` `  'data.setQuery': setQuery,`
- **Trecho:** TRC-data.setQuery

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do campo desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.setQuery`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:285` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o envio do campo desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (`{ part: "sortFirst" }`) sobre os que o painel acrescenta (o campo e a direção da ordem).
5. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.setQuery`.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o painel acrescenta (`src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.setQuery`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.setQuery`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — os campos do painel entregam só a parte e o valor (`src/editor/data/state.ts:102` `export const setQuery = registerHandler<'data.setQuery', EditorUi>('data.setQuery', ({ state }, { part, value }) => {`); não há digitação de campo guardada com contexto.
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — as oito portas do painel mandam a mesma intenção (a parte e o valor) ao mesmo tratador.
- G4: n/a — o tratador só grava estado do editor (`src/editor/data/state.ts:110` `kind: 'change', ui: withData(state.ui, { query: asked })`).
- G5: n/a — o comando não desenha controle; os campos vivem na colocação do painel (`manifest/commands/content.json:112` `          "region": "data-collection",`).
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:110` `kind: 'change', ui: withData(state.ui, { query: asked })`).
- G7: n/a — o resultado não traz patches; o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento (`src/editor/data/state.ts:110` `kind: 'change', ui: withData(state.ui, { query: asked })`).

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.setQuery
- **Argumentos enviados:** `{ part: "sortFirst", value: <"campo:direção"> }` — o `part` vem do manifesto da porta; o `value` é a primeira chave de ordem.
- R1 `src/editor/data/state.ts:76` `    case 'sortFirst': {` — o `part` desta porta é `sortFirst`, então o caminho passa pelo ramo que troca a primeira chave de ordem.
- R5 `src/editor/data/state.ts:86` `      if (typed === '' && part === 'limit') {` — o `part` desta porta não é `limit`, então o ramo do máximo não é tomado; o `value` (a chave de ordem) segue pelos ramos próprios de `sortFirst`.
