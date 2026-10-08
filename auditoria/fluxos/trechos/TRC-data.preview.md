# TRC-data.preview
- **Chamada:** `src/editor/doors/door.tsx:123` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });`
- **Argumentos:** `{ file: file }`; a porta `data-import` entrega o arquivo lido como JSON (as planilhas, ou o problema da leitura).
- **Ramos que dependem dos argumentos:** R1 (o arquivo não pôde ser lido), R2 (a leitura trouxe um problema nomeado), R3 (o arquivo tem planilhas).

## Passos
1. `src/editor/doors/door.tsx:119` `    if (file !== undefined && entry.door.adapter.fileReading === 'data') {` — a porta lê o arquivo de dados do disco antes de rodar o comando. [nada muda]
2. `src/editor/doors/door.tsx:123` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });` — o arquivo lido entra nos argumentos e o comando é despachado. [lê: EST-L01-037 via dispatch]
3. `src/app/commands.ts:164` `  'data.preview': previewFile,` — a tabela liga o comando ao tratador. [nada muda]
4. `src/editor/data/state.ts:139` `export const previewFile = registerHandler<'data.preview', EditorUi>('data.preview', ({ state }, { file }) => {` — o tratador recebe `file`. [nada muda]
5. `src/editor/data/state.ts:140` `  const handed = handedFile(file);` — lê o texto entregue como JSON. [lê: EST-L01-037 via handedFile]
6. `src/editor/data/state.ts:121` `function handedFile(text: string): DataFile | { readonly name: string; readonly problem: Message } | null {` — a leitura da mão (planilhas ou problema). [nada muda]
7. `src/editor/data/state.ts:141` `  if (handed === null) return { kind: 'refused', message: message('status.data.fileSheet', { name: '' }) };` — arquivo ilegível recusa (R1). [nada muda]
8. `src/editor/data/state.ts:142` `  if ('problem' in handed) return { kind: 'refused', message: handed.problem };` — problema nomeado na leitura recusa com o problema (R2). [nada muda]
9. `src/editor/data/state.ts:143` `  const sheet = handed.sheets[0];` — a primeira planilha. [lê: EST-L01-037 via handlerContext]
10. `src/editor/data/state.ts:35` `const guessed = (sheet: Sheet | undefined): Record<string, FieldType> => Object.fromEntries((sheet?.columns ?? []).map((column) => [column, guessType(sheet?.rows.map((row) => row[column]) ?? [])]));` — o tipo de cada coluna é adivinhado. [nada muda]
11. `src/editor/data/state.ts:144` `  const preview: DataPreview = { file: handed.name, sheets: handed.sheets, sheet: 0, types: guessed(sheet) };` — monta a prévia. [escreve: EST-L01-037 via run]
12. `src/editor/data/state.ts:145` `  return { kind: 'change', ui: withData(state.ui, { preview }), message: message('status.data.previewed', { name: handed.name, count: { plural: 'data.rows', count: sheet?.rows.length ?? 0 } }) };` — grava a prévia no estado do editor. [escreve: EST-L01-037 via run] [escreve: EST-L01-033 via run]
13. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store guarda a ui nova. [escreve: EST-L01-037 via run]
14. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a prévia conta como mudança. [lê: EST-L01-031 via run] [lê: EST-L01-037 via run] [lê: EST-L01-033 via run]
15. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
16. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/editor/data/state.ts:141` `  if (handed === null) return { kind: 'refused', message: message('status.data.fileSheet', { name: '' }) };` — texto que não é o JSON da leitura recusa com `status.data.fileSheet`; com planilhas segue.
- R2: `src/editor/data/state.ts:142` `  if ('problem' in handed) return { kind: 'refused', message: handed.problem };` — a leitura que trouxe um problema nomeado recusa com esse problema; sem problema segue.
- R3: `src/editor/data/state.ts:143` `  const sheet = handed.sheets[0];` — a primeira planilha é mostrada; a contagem de linhas usa a planilha (zero quando não há).

## Fronteiras assíncronas
- a leitura do arquivo é assíncrona, no próprio despacho (`src/editor/doors/door.tsx:123` `        dispatch(entry.command.id, { ...given, [file]: await readPickedDataFile(one) });`): entre o gesto e o `dispatch` correm o seletor de arquivos e a leitura. Nesse intervalo a aplicação está sem prévia e sem comando em curso; entradas do seletor de arquivos do próprio navegador podem rodar (fora do documento do app). O tratador em si (linhas 139-146) é síncrono.

## Estado
- Lê: EST-L01-037 (`state.ui`).
- Escreve: EST-L01-037 (`ui.data.preview`).

## Resultado
- **Estado final:** `ui.data.preview` passa a ter a planilha mostrada e o tipo de cada coluna (`src/editor/data/state.ts:145` `  return { kind: 'change', ui: withData(state.ui, { preview }), message: message('status.data.previewed', { name: handed.name, count: { plural: 'data.rows', count: sheet?.rows.length ?? 0 } }) };`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Dados redesenha a prévia do arquivo.
- **DOM do canvas:** nada muda — o documento não muda (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` com `documentChanged` falso).

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é o arquivo lido.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:1100` `      "id": "data-import",`).
- G4: n/a — o tratador só grava estado do editor (`src/editor/data/state.ts:145` `kind: 'change', ui: withData(state.ui, { preview })`).
- G5: n/a — o comando não desenha controle: o botão de importar vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:145` `kind: 'change', ui: withData(state.ui, { preview })`).
- G7: n/a — o resultado não traz patches; o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
