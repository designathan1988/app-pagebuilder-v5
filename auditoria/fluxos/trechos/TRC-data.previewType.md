# TRC-data.previewType
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ column: string, type: enum }`; a porta `data-preview-type` manda a coluna e o tipo escolhido.
- **Ramos que dependem dos argumentos:** R1 (sem prévia ou coluna desconhecida), R2 (tipo fora da lista).

## Passos
1. `src/app/commands.ts:166` `  'data.previewType': setPreviewType,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/data/state.ts:165` `export const setPreviewType = registerHandler<'data.previewType', EditorUi>('data.previewType', ({ state }, { column, type }) => {` — o tratador recebe `column` e `type`. [lê: EST-L01-037 via handlerContext]
3. `src/editor/data/state.ts:166` `  const preview = dataOf(state.ui).preview;` — lê a prévia atual. [lê: EST-L01-037 via dataOf]
4. `src/editor/data/state.ts:167` `  if (preview === undefined || !(previewSheet(preview)?.columns ?? []).includes(column)) return { kind: 'refused', message: argumentRefused('column') };` — sem prévia ou coluna desconhecida recusa (R1). [lê: EST-L01-037 via previewSheet]
5. `src/core/store/args.ts:100` `export function argumentRefused(argument: string): Message {` — a recusa do argumento. [nada muda]
6. `src/editor/data/state.ts:168` `  if (!(FIELD_TYPES as readonly string[]).includes(type)) throw new Error(` — tipo fora da lista é defeito da porta (R2). [nada muda]
7. `src/editor/data/state.ts:169` `  return { kind: 'change', ui: withData(state.ui, { preview: { ...preview, types: { ...preview.types, [column]: type as FieldType } } }), message: message('status.data.columnTyped', { column, type: { key:` — grava o tipo escolhido para a coluna. [escreve: EST-L01-037 via run] [escreve: EST-L01-033 via run]
8. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store guarda a ui nova. [escreve: EST-L01-037 via run]
9. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a troca da prévia conta como mudança. [lê: EST-L01-031 via run] [lê: EST-L01-037 via run] [lê: EST-L01-033 via run]
10. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
11. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/editor/data/state.ts:167` `  if (preview === undefined || !(previewSheet(preview)?.columns ?? []).includes(column)) return { kind: 'refused', message: argumentRefused('column') };` — sem prévia ou coluna que a planilha não tem a resposta é `refused` com o argumento nomeado; com coluna conhecida segue.
- R2: `src/editor/data/state.ts:168` `  if (!(FIELD_TYPES as readonly string[]).includes(type)) throw new Error(` — tipo fora dos tipos conhecidos é defeito da porta (o `run` responde `status.change.failed`).

## Fronteiras assíncronas
- nenhuma — o tratador (linhas 165-170) é síncrono; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-037 (`state.ui.data.preview`).
- Escreve: EST-L01-037 (`ui.data.preview.types`).

## Resultado
- **Estado final:** `ui.data.preview.types[column]` passa a ser o tipo escolhido (`src/editor/data/state.ts:169` `  return { kind: 'change', ui: withData(state.ui, { preview: { ...preview, types: { ...preview.types, [column]: type as FieldType } } }), message: message('status.data.columnTyped', { column, type: { key:`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Dados redesenha a coluna com o tipo novo.
- **DOM do canvas:** nada muda — o documento não muda (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` com `documentChanged` falso).

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são a coluna e o tipo.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:1214` `      "id": "data-preview-type",`).
- G4: n/a — o tratador só grava estado do editor (`src/editor/data/state.ts:169` `kind: 'change', ui: withData(state.ui, { preview: { ...preview, types: { ...preview.types, [column]: type as FieldType } } })`).
- G5: n/a — o comando não desenha controle: o seletor de tipo da coluna vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:169` `kind: 'change', ui: withData(state.ui, { preview: { ...preview, types: { ...preview.types, [column]: type as FieldType } } })`).
- G7: n/a — o resultado não traz patches; o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
