# ENT-P-content-0023 — data.previewSheet pela porta data.previewSheet#data-preview-sheet
- **Comando:** data.previewSheet
- **Porta:** `data-preview-sheet` `manifest/commands/content.json:1151` `          "id": "data-preview-sheet",`
- **Início:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:165` `  'data.previewSheet': choosePreviewSheet,`
- **Trecho:** TRC-data.previewSheet

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do seletor desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.previewSheet`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:286` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no segmento desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (o nome da planilha).
5. `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.previewSheet`.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.previewSheet`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.previewSheet`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é o nome de uma planilha da prévia (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:1151` `          "id": "data-preview-sheet",`).
- G4: n/a — o tratador só grava estado do editor (`src/editor/data/state.ts:156` `    return { kind: 'change', ui: withData(state.ui, { preview: { ...preview, sheet: index, types: guessed(shown) } }), message: message('status.data.sheetShown', { name: sheet, count: { plural: 'data.rows', count: shown?.rows.length ?? 0 } }) };`).
- G5: n/a — o comando não desenha controle; o seletor vive na colocação do painel (`manifest/commands/content.json:1165` `            "region": "data-preview",`).
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:156` `    return { kind: 'change', ui: withData(state.ui, { preview: { ...preview, sheet: index, types: guessed(shown) } }), message: message('status.data.sheetShown', { name: sheet, count: { plural: 'data.rows', count: shown?.rows.length ?? 0 } }) };`).
- G7: n/a — o resultado não traz patches; o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento (`src/editor/data/state.ts:156` `    return { kind: 'change', ui: withData(state.ui, { preview: { ...preview, sheet: index, types: guessed(shown) } }), message: message('status.data.sheetShown', { name: sheet, count: { plural: 'data.rows', count: shown?.rows.length ?? 0 } }) };`).

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.previewSheet
- **Argumentos enviados:** `{ sheet }` — o nome da planilha escolhida no painel.
- R1 `src/editor/data/state.ts:154` `    if (preview === undefined || index < 0) return { kind: 'refused', message: argumentRefused('sheet') };` — com uma prévia aberta e a `sheet` desta porta entre as planilhas dela, o caminho segue para a gravação; sem prévia ou com planilha desconhecida, recusa com o argumento nomeado.
