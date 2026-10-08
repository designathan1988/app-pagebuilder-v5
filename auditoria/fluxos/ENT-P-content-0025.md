# ENT-P-content-0025 — data.closePreview pela porta data.closePreview#data-preview-close
- **Comando:** data.closePreview
- **Porta:** `data-preview-close` `manifest/commands/content.json:1258` `          "id": "data-preview-close",`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:167` `  'data.closePreview': closePreview,`
- **Trecho:** TRC-data.closePreview

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do botão desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.closePreview`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:285` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios), sem campo algum acrescentado.
5. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.closePreview`.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.closePreview`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.closePreview`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem argumentos nem digitação de campo (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:1258` `          "id": "data-preview-close",`).
- G4: n/a — o tratador só grava estado do editor (`src/editor/data/state.ts:174` `  return { kind: 'change', ui: withData(state.ui, { preview: undefined }), ...(preview === undefined ? {} : { message: message('status.data.previewClosed', { name: preview.file }) }) };`).
- G5: n/a — o comando não desenha controle; o botão vive na colocação do painel (`manifest/commands/content.json:1272` `            "region": "data-preview",`).
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:174` `  return { kind: 'change', ui: withData(state.ui, { preview: undefined }), ...(preview === undefined ? {} : { message: message('status.data.previewClosed', { name: preview.file }) }) };`).
- G7: n/a — o resultado não traz patches; o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento (`src/editor/data/state.ts:174` `  return { kind: 'change', ui: withData(state.ui, { preview: undefined }), ...(preview === undefined ? {} : { message: message('status.data.previewClosed', { name: preview.file }) }) };`).

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.closePreview
- **Argumentos enviados:** nenhum — a porta declara `entry.door.args` vazio e o lugar não acrescenta campo algum (`manifest/commands/content.json:1246` `      "args": {},`).
- Nenhum ramo do trecho depende dos argumentos: o comando não tem argumentos, e o único ramo (há prévia ou não) depende do estado (`src/editor/data/state.ts:174` `  return { kind: 'change', ui: withData(state.ui, { preview: undefined }), ...(preview === undefined ? {} : { message: message('status.data.previewClosed', { name: preview.file }) }) };`).
