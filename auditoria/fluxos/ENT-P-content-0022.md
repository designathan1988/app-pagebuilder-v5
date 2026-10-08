# ENT-P-content-0022 — data.preview pela porta data.preview#data-import
- **Comando:** data.preview
- **Porta:** `data-import` `manifest/commands/content.json:1100` `          "id": "data-import",`
- **Início:** `src/editor/doors/door.tsx:124` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });`
- **Tratador:** `src/app/commands.ts:164` `  'data.preview': previewFile,`
- **Trecho:** TRC-data.preview

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do botão desenhado, que lê um arquivo de dados do disco, até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.preview`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:286` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios); o arquivo é lido adiante.
5. `src/editor/doors/door.tsx:108` `    const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — a porta acha o argumento `file` que o comando declara e ainda não recebeu.
6. `src/editor/doors/door.tsx:120` `    if (file !== undefined && entry.door.adapter.fileReading === 'data') {` — o adapter desta porta declara `fileReading` `data`, então o caminho toma o ramo que lê o arquivo de dados.
7. `src/editor/doors/door.tsx:121` `      void chooseFiles().then(async (chosen) => {` — o seletor de arquivos do navegador; escolhido o arquivo, a promessa resolve com ele.
8. `src/editor/doors/door.tsx:122` `        const one = chosen[0];` — o primeiro arquivo escolhido.
9. `src/editor/doors/door.tsx:123` `        if (one === undefined) return;` — sem arquivo escolhido, nada é despachado.
10. `src/editor/doors/door.tsx:124` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });` — a leitura do arquivo (suas planilhas, ou o problema da leitura, como JSON) entra nos argumentos e o comando é despachado; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.preview`.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:120` `    if (file !== undefined && entry.door.adapter.fileReading === 'data') {` — como o adapter desta porta é `data`, o caminho toma o ramo que lê o arquivo antes de despachar; o ramo do despacho direto (linha 144) não é tomado.
- R3 `src/editor/doors/door.tsx:123` `        if (one === undefined) return;` — sem arquivo escolhido nada é despachado; com um arquivo, o caminho segue ao despacho.

## Fronteiras assíncronas
- `src/editor/doors/door.tsx:121` `      void chooseFiles().then(async (chosen) => {` — o seletor de arquivos do navegador e, em seguida, `src/editor/doors/door.tsx:124` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });` — a leitura do arquivo: entre o gesto e o `dispatch` corre a escolha do arquivo no navegador e a leitura. Nesse intervalo a aplicação está sem prévia e sem comando em curso; o seletor de arquivos do próprio navegador pode rodar (fora do documento do app).

## Estado
- lê: nenhum item do inventário de estado no caminho; a porta lê o manifesto e o arquivo escolhido (`src/editor/doors/door.tsx:124` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.preview`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:124` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.preview`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:124` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é o arquivo lido (`src/editor/doors/door.tsx:124` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });`).
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:124` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });`).
- G3: ok `src/editor/doors/door.tsx:124` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:1100` `          "id": "data-import",`).
- G4: n/a — o tratador só grava estado do editor (`src/editor/data/state.ts:145` `  return { kind: 'change', ui: withData(state.ui, { preview }), message: message('status.data.previewed', { name: handed.name, count: { plural: 'data.rows', count: sheet?.rows.length ?? 0 } }) };`).
- G5: n/a — o comando não desenha controle; o botão vive na colocação do painel (`manifest/commands/content.json:1114` `            "region": "data-panel",`).
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:145` `  return { kind: 'change', ui: withData(state.ui, { preview }), message: message('status.data.previewed', { name: handed.name, count: { plural: 'data.rows', count: sheet?.rows.length ?? 0 } }) };`).
- G7: n/a — o resultado não traz patches; o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento (`src/editor/data/state.ts:145` `  return { kind: 'change', ui: withData(state.ui, { preview }), message: message('status.data.previewed', { name: handed.name, count: { plural: 'data.rows', count: sheet?.rows.length ?? 0 } }) };`).

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador; o `then` do seletor não deixa ouvinte (`src/editor/doors/door.tsx:124` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.preview
- **Argumentos enviados:** `{ file }` — o arquivo escolhido, lido como JSON: as planilhas, ou o problema nomeado da leitura.
- R1 `src/editor/data/state.ts:141` `  if (handed === null) return { kind: 'refused', message: message('status.data.fileSheet', { name: '' }) };` — com um arquivo que a leitura entrega como JSON de planilhas o caminho não passa por esta recusa; um texto que não é o JSON da leitura recusaria com `status.data.fileSheet`.
- R2 `src/editor/data/state.ts:142` `  if ('problem' in handed) return { kind: 'refused', message: handed.problem };` — uma leitura que trouxe um problema nomeado recusaria com esse problema; esta porta, guardando um arquivo legível, segue.
- R3 `src/editor/data/state.ts:143` `  const sheet = handed.sheets[0];` — o caminho toma a primeira planilha do `file` desta porta e grava a prévia; a contagem usa essa planilha.
