# TRC-data.importNew
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ name: string }`; a porta `data-import-new` manda o nome digitado (o da coleção nova).
- **Ramos que dependem dos argumentos:** R2 (nome vazio) e os ramos do estado (R1 sem prévia ou planilha vazia, R3 nome repetido, R4 valor fora do tipo).

## Passos
1. `src/app/commands.ts:168` `  'data.importNew': importNew,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/data/state.ts:194` `export const importNew = registerHandler<'data.importNew', EditorUi>('data.importNew', (context, { name }) =>` — o tratador recebe `name`. [nada muda]
3. `src/editor/data/state.ts:195` `  contentChange(context, (document, data) => {` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/editor/data/state.ts:196` `    const { preview, sheet } = importedSheet(context.state.ui);` — pega a prévia e a planilha (R1). [lê: EST-L01-037 via importedSheet]
6. `src/editor/data/state.ts:180` `function importedSheet(ui: EditorUi): { readonly preview: DataPreview; readonly sheet: Sheet } {` — sem prévia, com problema na planilha ou vazia, recusa. [nada muda]
7. `src/editor/data/state.ts:198` `    const fields: Field[] = sheet.columns.map((column) => {` — um campo por coluna. [lê: EST-L01-037 via handlerContext]
8. `src/editor/data/state.ts:201` `      return { key, label: column, type: preview.types[column] ?? 'text' };` — o tipo de cada campo é o da prévia. [nada muda]
9. `src/editor/data/state.ts:203` `    const typed = name.trim() === '' ? stem(preview.file) : name.trim();` — nome vazio vira o nome do arquivo sem extensão (R2). [lê: EST-L01-037 via stem]
10. `src/editor/data/state.ts:204` `    const empty = createCollection(collectionsOf(document), typed, fields);` — a coleção vazia é criada (R3). [nada muda]
11. `src/core/data/collections.ts:193` `  const named = nameRefusal(collections, name);` — nome vazio ou repetido recusa. [nada muda]
12. `src/editor/data/state.ts:206` `    const collection = importRows(empty, rows, 'append', null, () => data.ids.next());` — as linhas entram na coleção nova (R4). [escreve: EST-L01-030 via run]
13. `src/core/data/collections.ts:185` `    if (read === null) refuse('status.data.badValue', { collection, row: rowNumber, column: field.label, value: shownValue(row[field.key]), type: { key:` — um valor fora do tipo recusa nomeando a linha e a coluna. [nada muda]
14. `src/editor/data/state.ts:208` `      document: { ...document, collections: [...collectionsOf(document), collection] },` — o documento novo leva a coleção. [escreve: EST-L01-030 via run]
15. `src/editor/data/state.ts:210` `      ui: withData(context.state.ui, { collection: collection.name, preview: undefined, query: undefined }),` — o painel mostra a coleção nova e a prévia fecha. [escreve: EST-L01-037 via run]
16. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue. [lê: EST-L01-030 via derivedDocument]
17. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
18. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
19. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
20. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
21. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-003 via publish]
22. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/editor/data/state.ts:183` `  if (preview === undefined || sheet === undefined) refuse('status.data.noPreview');` e `src/editor/data/state.ts:184` `  if (sheet.problem !== undefined) refuse(sheet.problem.key, sheet.problem.params);` e `src/editor/data/state.ts:185` `  if (sheet.rows.length === 0) refuse('status.data.fileEmpty', { name: preview.file });` — sem prévia, com problema ou vazia, `importedSheet` lança `DataRefusal`, que `contentChange` converte em `refused` (`src/core/data/commands.ts:70` `    if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };`); com planilha segue.
- R2: `src/editor/data/state.ts:203` `    const typed = name.trim() === '' ? stem(preview.file) : name.trim();` — nome vazio usa o nome do arquivo sem extensão; nome digitado usa o próprio texto.
- R3: `src/core/data/collections.ts:171` `  if (collections.some((c) => c.name !== except && fold(c.name) === fold(trimmed))) return message('status.data.nameTaken', { name: trimmed });` — nome repetido (ou rótulo de campo repetido) recusa; nome livre segue.
- R4: `src/core/data/collections.ts:185` `    if (read === null) refuse('status.data.badValue', { collection, row: rowNumber, column: field.label, value: shownValue(row[field.key]), type: { key:` — um valor que o tipo escolhido para a coluna não aceita recusa nomeando a linha e a coluna, sem importar nada.

## Fronteiras assíncronas
- nenhuma no trecho — o tratador, `contentChange` e `importRows` são síncronos; a leitura do arquivo já ocorreu no despacho (a porta `data-import`), registrada em `TRC-data.preview`.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-037 (`state.ui.data.preview`).
- Escreve: EST-L01-030 (`document.collections`), EST-L01-037 (`ui.data.collection`, `ui.data.preview`, `ui.data.query`), EST-L01-032 (`history`).

## Resultado
- **Estado final:** o documento ganha a coleção nova com uma linha por linha do arquivo, e o painel mostra a coleção nova (`src/editor/data/state.ts:210` `      ui: withData(context.state.ui, { collection: collection.name, preview: undefined, query: undefined }),`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha a coleção importada.
- **DOM do canvas:** o canvas redesenha por causa da mudança do documento (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: ok `src/editor/data/state.ts:194` `export const importNew = registerHandler<'data.importNew', EditorUi>('data.importNew', (context, { name }) =>` — o nome digitado é gravado no contexto capturado na primeira digitação.
- G2: ok `src/editor/data/state.ts:203` `    const typed = name.trim() === '' ? stem(preview.file) : name.trim();` — o tratador lê o texto entregue pela porta, que é o do contexto da digitação.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:1338` `      "id": "data-import-new",`).
- G4: n/a — o tratador só grava estado (`src/editor/data/state.ts:210` `      ui: withData(context.state.ui, { collection: collection.name, preview: undefined, query: undefined }),`).
- G5: n/a — o comando não desenha controle: o botão vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
