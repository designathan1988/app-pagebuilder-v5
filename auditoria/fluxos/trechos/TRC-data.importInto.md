# TRC-data.importInto
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ collection: string, mode: 'append'|'replace'|'update' }`; as três portas mandam só a coleção e o modo.
- **Ramos que dependem dos argumentos:** R3 (coluna que casa nenhum campo), R4 (modo `update` com chave), R5 (chave vazia ou repetida).

## Passos
1. `src/app/commands.ts:169` `  'data.importInto': importInto,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/data/state.ts:228` `export const importInto = registerHandler<'data.importInto', EditorUi>('data.importInto', (context, { collection, mode }) =>` — o tratador recebe a coleção e o modo. [nada muda]
3. `src/editor/data/state.ts:229` `  contentChange(context, (document, data) => {` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/editor/data/state.ts:230` `    const { sheet } = importedSheet(context.state.ui);` — pega a planilha da prévia (R1). [lê: EST-L01-037 via importedSheet]
6. `src/editor/data/state.ts:231` `    const held = collectionNamed(document, collection);` — procura a coleção (R2). [lê: EST-L01-030 via collectionNamed]
7. `src/editor/data/state.ts:232` `    if (held === undefined) throw new Error(` — coleção ausente é defeito da porta (R2). [nada muda]
8. `src/editor/data/state.ts:233` `    const matched = columnFields(sheet.columns, held.fields);` — casa cada coluna com um campo da coleção. [lê: EST-L01-037 via columnFields] [lê: EST-L01-030 via columnFields]
9. `src/editor/data/state.ts:217` `export function columnFields(columns: readonly string[], fields: readonly Field[]): ReadonlyMap<string, Field> {` — o campo é o de mesmo rótulo (acentos e caixa à parte) ou o de mesma chave. [nada muda]
10. `src/editor/data/state.ts:234` `    if (matched.size === 0) refuse('status.data.noColumnMatches', { collection: held.name });` — nenhuma coluna casando, recusa (R3). [nada muda]
11. `src/editor/data/state.ts:236` `    const key = mode === 'update' ? (first === undefined ? undefined : matched.get(first)?.key) : null;` — no modo `update` a chave é a primeira coluna casada (R4). [lê: EST-L01-030 via handlerContext]
12. `src/editor/data/state.ts:237` `    if (key === undefined) refuse('status.data.keyNeeded', { collection: held.name });` — sem chave para atualizar, recusa (R4). [nada muda]
13. `src/editor/data/state.ts:239` `    const next = importRows(held, rows, mode as ImportMode, key, () => data.ids.next());` — as linhas entram na coleção no modo pedido (R5). [escreve: EST-L01-030 via run]
14. `src/core/data/collections.ts:207` `  if (mode === 'update' && (keyField === undefined || keyField.type === 'richtext')) refuse('status.data.keyNeeded', { collection: collection.name });` — atualizar exige chave que não seja texto rico. [nada muda]
15. `src/core/data/collections.ts:225` `    if (keyValue === undefined) refuse('status.data.keyEmpty', { collection: collection.name, row: rowNumber, column: keyField.label });` — chave vazia recusa sem importar (R5). [nada muda]
16. `src/core/data/collections.ts:227` `    if (seen.has(identity)) refuse('status.data.keyRepeated', { collection: collection.name, row: rowNumber, column: keyField.label, value: cellText(keyValue, { yes: 'true', no: 'false' }) });` — chave repetida recusa (R5). [nada muda]
17. `src/editor/data/state.ts:241` `      document: { ...document, collections: collectionsOf(document).map((c) => (c.name === held.name ? next : c)) },` — o documento novo troca a coleção. [escreve: EST-L01-030 via run]
18. `src/editor/data/state.ts:243` `      ui: withData(context.state.ui, { collection: held.name, preview: undefined }),` — o painel mostra a coleção e a prévia fecha. [escreve: EST-L01-037 via run]
19. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
20. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
21. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
22. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
23. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-003 via publish]
24. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/editor/data/state.ts:183` `  if (preview === undefined || sheet === undefined) refuse('status.data.noPreview');` e `src/editor/data/state.ts:185` `  if (sheet.rows.length === 0) refuse('status.data.fileEmpty', { name: preview.file });` — sem prévia ou vazia, `importedSheet` lança `DataRefusal`, convertida em `refused` (`src/core/data/commands.ts:70` `    if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };`).
- R2: `src/editor/data/state.ts:232` `    if (held === undefined) throw new Error(` — coleção ausente é defeito da porta.
- R3: `src/editor/data/state.ts:234` `    if (matched.size === 0) refuse('status.data.noColumnMatches', { collection: held.name });` — nenhuma coluna do arquivo casando um campo recusa; havendo casa segue.
- R4: `src/editor/data/state.ts:236` `    const key = mode === 'update' ? (first === undefined ? undefined : matched.get(first)?.key) : null;` — no modo `update` a chave é a primeira coluna casada e, sem ela, `src/editor/data/state.ts:237` `    if (key === undefined) refuse('status.data.keyNeeded', { collection: held.name });` recusa; nos modos `append` e `replace` a chave é `null` e não há recusa por chave.
- R5: `src/core/data/collections.ts:225` `    if (keyValue === undefined) refuse('status.data.keyEmpty', { collection: collection.name, row: rowNumber, column: keyField.label });` e `src/core/data/collections.ts:227` `    if (seen.has(identity)) refuse('status.data.keyRepeated', { collection: collection.name, row: rowNumber, column: keyField.label, value: cellText(keyValue, { yes: 'true', no: 'false' }) });` — chave vazia ou repetida recusam no modo `update` sem importar; um valor fora do tipo recusa por `status.data.badValue` (`src/core/data/collections.ts:185`).

## Fronteiras assíncronas
- nenhuma no trecho — o tratador, `contentChange` e `importRows` são síncronos; a leitura do arquivo já ocorreu no despacho, registrada em `TRC-data.preview`.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-037 (`state.ui.data.preview`).
- Escreve: EST-L01-030 (`document.collections`, `document.pages`, `document.components`), EST-L01-037 (`ui.data.collection`, `ui.data.preview`), EST-L01-032 (`history`).

## Resultado
- **Estado final:** a coleção recebe as linhas no modo pedido e o painel a mostra sem a prévia (`src/editor/data/state.ts:243` `      ui: withData(context.state.ui, { collection: held.name, preview: undefined }),`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha a grade da coleção.
- **DOM do canvas:** o canvas redesenha por causa da mudança do documento (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são a coleção e o modo.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: ok `src/editor/data/state.ts:228` `export const importInto = registerHandler<'data.importInto', EditorUi>('data.importInto', (context, { collection, mode }) =>` — as três portas mandam a mesma intenção (a coleção e o modo) ao mesmo tratador.
- G4: n/a — o tratador só grava estado (`src/editor/data/state.ts:243` `      ui: withData(context.state.ui, { collection: held.name, preview: undefined }),`).
- G5: n/a — o comando não desenha controle: os três botões vivem na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
