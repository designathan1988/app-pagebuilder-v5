# ENT-P-content-0024 — data.previewType pela porta data.previewType#data-preview-type
- **Comando:** data.previewType
- **Porta:** `data-preview-type` `manifest/commands/content.json:1214` `          "id": "data-preview-type",`
- **Início:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:166` `  'data.previewType': setPreviewType,`
- **Trecho:** TRC-data.previewType

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do seletor desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.previewType`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:286` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o envio do campo desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (a coluna e o tipo escolhido).
5. `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.previewType`.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.previewType`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.previewType`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são a coluna e o tipo (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:1214` `          "id": "data-preview-type",`).
- G4: n/a — o tratador só grava estado do editor (`src/editor/data/state.ts:169` `  return { kind: 'change', ui: withData(state.ui, { preview: { ...preview, types: { ...preview.types, [column]: type as FieldType } } }), message: message('status.data.columnTyped', { column, type: { key:`).
- G5: n/a — o comando não desenha controle; o seletor vive na colocação do painel (`manifest/commands/content.json:1228` `            "region": "data-preview",`).
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:169` `  return { kind: 'change', ui: withData(state.ui, { preview: { ...preview, types: { ...preview.types, [column]: type as FieldType } } }), message: message('status.data.columnTyped', { column, type: { key:`).
- G7: n/a — o resultado não traz patches; o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento (`src/editor/data/state.ts:169` `  return { kind: 'change', ui: withData(state.ui, { preview: { ...preview, types: { ...preview.types, [column]: type as FieldType } } }), message: message('status.data.columnTyped', { column, type: { key:`).

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.previewType
- **Argumentos enviados:** `{ column, type }` — a coluna da planilha e o tipo escolhido para ela.
- R1 `src/editor/data/state.ts:167` `  if (preview === undefined || !(previewSheet(preview)?.columns ?? []).includes(column)) return { kind: 'refused', message: argumentRefused('column') };` — com uma prévia aberta e a `column` desta porta entre as colunas dela, o caminho segue; sem prévia ou com coluna desconhecida, recusa com o argumento nomeado.
- R2 `src/editor/data/state.ts:168` `  if (!(FIELD_TYPES as readonly string[]).includes(type)) throw new Error(` — o `type` desta porta, vindo da lista de tipos do campo, está entre os tipos conhecidos, então o caminho grava; fora da lista lançaria defeito da porta.
