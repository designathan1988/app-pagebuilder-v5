# TRC-data.previewSheet
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ sheet: string }`; a porta `data-preview-sheet` manda o nome da planilha escolhida.
- **Ramos que dependem dos argumentos:** R1 (sem prévia ou planilha desconhecida).

## Passos
1. `src/app/commands.ts:165` `  'data.previewSheet': choosePreviewSheet,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/data/state.ts:149` `export const choosePreviewSheet = registerHandler<'data.previewSheet', EditorUi>(` — o tratador é registrado com o predicado `current` das linhas 158-161. [nada muda]
3. `src/editor/data/state.ts:151` `  ({ state }, { sheet }) => {` — lê o estado e o nome da planilha. [lê: EST-L01-037 via handlerContext]
4. `src/editor/data/state.ts:152` `    const preview = dataOf(state.ui).preview;` — lê a prévia atual. [lê: EST-L01-037 via dataOf]
5. `src/editor/data/state.ts:153` `    const index = preview?.sheets.findIndex((one) => one.name === sheet) ?? -1;` — procura a planilha pelo nome. [lê: EST-L01-037 via handlerContext]
6. `src/editor/data/state.ts:154` `    if (preview === undefined || index < 0) return { kind: 'refused', message: argumentRefused('sheet') };` — sem prévia ou planilha desconhecida recusa (R1). [lê: EST-L01-037 via argumentRefused]
7. `src/core/store/args.ts:100` `export function argumentRefused(argument: string): Message {` — a recusa do argumento. [nada muda]
8. `src/editor/data/state.ts:155` `    const shown = preview.sheets[index];` — a planilha escolhida. [lê: EST-L01-037 via handlerContext]
9. `src/editor/data/state.ts:156` `    return { kind: 'change', ui: withData(state.ui, { preview: { ...preview, sheet: index, types: guessed(shown) } }), message: message('status.data.sheetShown', { name: sheet, count: { plural: 'data.rows', count: shown?.rows.length ?? 0 } }) };` — grava a planilha mostrada e os tipos adivinhados. [escreve: EST-L01-037 via run] [escreve: EST-L01-033 via run]
10. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store guarda a ui nova. [escreve: EST-L01-037 via run]
11. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a troca da prévia conta como mudança. [lê: EST-L01-031 via run] [lê: EST-L01-037 via run] [lê: EST-L01-033 via run]
12. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
13. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/editor/data/state.ts:154` `    if (preview === undefined || index < 0) return { kind: 'refused', message: argumentRefused('sheet') };` — sem prévia ou com planilha que a prévia não tem a resposta é `refused` com o argumento nomeado; com planilha conhecida segue para o passo 8.

## Fronteiras assíncronas
- nenhuma — o tratador (linhas 149-162) é síncrono; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-037 (`state.ui.data.preview`).
- Escreve: EST-L01-037 (`ui.data.preview.sheet`, `ui.data.preview.types`).

## Resultado
- **Estado final:** `ui.data.preview.sheet` passa a ser o índice da planilha escolhida, com os tipos adivinhados para ela (`src/editor/data/state.ts:156` `    return { kind: 'change', ui: withData(state.ui, { preview: { ...preview, sheet: index, types: guessed(shown) } }), message: message('status.data.sheetShown', { name: sheet, count: { plural: 'data.rows', count: shown?.rows.length ?? 0 } }) };`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Dados redesenha a planilha mostrada.
- **DOM do canvas:** nada muda — o documento não muda (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` com `documentChanged` falso).

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é o nome de uma planilha da prévia.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:1151` `      "id": "data-preview-sheet",`).
- G4: n/a — o tratador só grava estado do editor (`src/editor/data/state.ts:152` `    const preview = dataOf(state.ui).preview;`).
- G5: n/a — o comando não desenha controle: o seletor de planilha vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:156` `kind: 'change', ui: withData(state.ui, { preview: { ...preview, sheet: index, types: guessed(shown) } })`).
- G7: n/a — o resultado não traz patches; o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
