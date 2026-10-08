# ENT-P-content-0026 — data.importNew pela porta data.importNew#data-import-new
- **Comando:** data.importNew
- **Porta:** `data-import-new` `manifest/commands/content.json:1338` `          "id": "data-import-new",`
- **Início:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:168` `  'data.importNew': importNew,`
- **Trecho:** TRC-data.importNew

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do botão desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.importNew`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:286` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (o nome digitado).
5. `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.importNew`.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.importNew`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.importNew`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/editor/data/state.ts:194` `export const importNew = registerHandler<'data.importNew', EditorUi>('data.importNew', (context, { name }) =>` — o nome digitado é gravado no contexto capturado na primeira digitação.
- G2: ok `src/editor/data/state.ts:203` `    const typed = name.trim() === '' ? stem(preview.file) : name.trim();` — o tratador lê o texto entregue pela porta, que é o do contexto da digitação.
- G3: ok `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:1338` `          "id": "data-import-new",`).
- G4: n/a — o tratador só grava estado (`src/editor/data/state.ts:210` `      ui: withData(context.state.ui, { collection: collection.name, preview: undefined, query: undefined }),`).
- G5: n/a — o comando não desenha controle; o botão vive na colocação do painel (`manifest/commands/content.json:1352` `            "region": "data-preview",`).
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.importNew
- **Argumentos enviados:** `{ name }` — o nome digitado para a coleção nova; a prévia vem do estado da store.
- R2 `src/editor/data/state.ts:203` `    const typed = name.trim() === '' ? stem(preview.file) : name.trim();` — o `name` desta porta vazio usa o nome do arquivo sem extensão; com texto, usa o próprio texto.
- R1 `src/editor/data/state.ts:183` `  if (preview === undefined || sheet === undefined) refuse('status.data.noPreview');` — sem prévia (ou planilha), `importedSheet` lança `DataRefusal` (vira `refused`); o caminho depende do estado, não do `name`.
- R3 `src/core/data/collections.ts:171` `  if (collections.some((c) => c.name !== except && fold(c.name) === fold(trimmed))) return message('status.data.nameTaken', { name: trimmed });` — um nome já tomado recusaria; o caminho depende do estado das coleções.
- R4 `src/core/data/collections.ts:185` `    if (read === null) refuse('status.data.badValue', { collection, row: rowNumber, column: field.label, value: shownValue(row[field.key]), type: { key:` — um valor da linha fora do tipo escolhido recusaria; o caminho depende do conteúdo da planilha.
