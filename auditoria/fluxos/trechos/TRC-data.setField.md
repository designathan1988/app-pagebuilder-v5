# TRC-data.setField
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ collection: string, field: string, label?: string, type?: enum }`.
- **Ramos que dependem dos argumentos:** R1 (rótulo dado ou ausente), R2 (tipo dado ou ausente), R3 (a troca de tipo relê os valores).

## Passos
1. `src/app/commands.ts:158` `  'data.setField': setFieldCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:212` `export const setFieldCommand = registerHandler('data.setField', (context, { collection, field, label, type }) =>` — o tratador recebe a coleção, o campo, o rótulo novo e o tipo novo. [nada muda]
3. `src/core/data/commands.ts:213` `  contentChange(context, (document) => {` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/core/data/commands.ts:214` `    const held = named(document, collection);` — procura a coleção. [lê: EST-L01-030 via named]
6. `src/core/data/commands.ts:215` `    const next = setField(held, field, { ...(typeof label === 'string' ? { label } : {}), ...(type === undefined ? {} : { type: fieldType(type) }) });` — monta a troca com o rótulo e o tipo presentes (R1, R2). [lê: EST-L01-030 via setField]
7. `src/core/data/collections.ts:284` `export function setField(collection: Collection, key: string, change: { readonly label?: string; readonly type?: FieldType }): Collection {` — o campo é reescrito. [nada muda]
8. `src/core/data/collections.ts:286` `  if (field === undefined) refuse('status.stale');` — campo inexistente recusa por `status.stale` (R4). [nada muda]
9. `src/core/data/collections.ts:289` `  const refused = schemaRefusal(collection.name, fields);` — rótulo vazio ou repetido recusa. [nada muda]
10. `src/core/data/collections.ts:291` `  if (next.type === field.type) return { ...collection, fields };` — sem troca de tipo, só o rótulo muda. [nada muda]
11. `src/core/data/collections.ts:298` `    const read = readCell(next.type, source);` — trocando o tipo, cada valor é relido como o tipo novo (R3). [nada muda]
12. `src/core/data/collections.ts:299` `    if (read === null) refuse('status.data.badValue', { collection: collection.name, row: index + 1, column: next.label, value: cellText(held, { yes: 'true', no: 'false' }), type: { key:` — um valor que o tipo novo não aceita recusa nomeando a linha e a coluna. [nada muda]
13. `src/core/data/commands.ts:216` `    const shown = next.fields.find((f) => f.key === field)?.label ?? field;` — o rótulo mostrado na mensagem. [lê: EST-L01-030 via handlerContext]
14. `src/core/data/commands.ts:217` `    return { document: withCollection(document, held.name, next), message: message('status.data.fieldChanged', { collection: held.name, label: shown }) };` — o documento novo troca a coleção. [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]
15. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue. [lê: EST-L01-030 via derivedDocument]
16. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
17. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
18. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
19. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
20. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-003 via publish]
21. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/core/data/commands.ts:215` `    const next = setField(held, field, { ...(typeof label === 'string' ? { label } : {}), ...(type === undefined ? {} : { type: fieldType(type) }) });` — com `label` presente o rótulo troca; sem `label` o rótulo fica.
- R2: `src/core/data/commands.ts:215` `    const next = setField(held, field, { ...(typeof label === 'string' ? { label } : {}), ...(type === undefined ? {} : { type: fieldType(type) }) });` — com `type` presente o tipo troca; sem `type` o tipo fica.
- R3: `src/core/data/collections.ts:291` `  if (next.type === field.type) return { ...collection, fields };` — tipo igual só relabela; tipo diferente relê cada valor (linha 298) e recusa no primeiro valor incompatível (`src/core/data/collections.ts:299` `    if (read === null) refuse('status.data.badValue', { collection: collection.name, row: index + 1, column: next.label, value: cellText(held, { yes: 'true', no: 'false' }), type: { key:`).
- R4: `src/core/data/collections.ts:286` `  if (field === undefined) refuse('status.stale');` — campo que a coleção não tem recusa por `status.stale`, dito ao reexecutar o tratador com a chave do campo.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `setField` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`document.collections`), EST-L01-032 (`history`).

## Resultado
- **Estado final:** o campo passa a ter o rótulo e o tipo novos, com os valores relidos quando o tipo muda (`src/core/data/collections.ts:304` `  return { ...collection, fields, items };`); o histórico guarda a etapa.
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha a linha do campo e os valores da grade.
- **DOM do canvas:** o canvas redesenha por causa da mudança do documento (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: ok `src/core/data/commands.ts:212` `export const setFieldCommand = registerHandler('data.setField', (context, { collection, field, label, type }) =>` — o rótulo digitado é gravado no contexto capturado na primeira digitação (a porta entrega `collection` e `field` junto com `label`).
- G2: ok `src/core/data/commands.ts:215` `    const next = setField(held, field, { ...(typeof label === 'string' ? { label } : {}), ...(type === undefined ? {} : { type: fieldType(type) }) });` — o tratador lê o texto entregue pela porta.
- G3: n/a — o comando tem duas portas do mesmo campo (`manifest/commands/content.json:635` `      "id": "data-field-label",` e `manifest/commands/content.json:661` `      "id": "data-field-type",`), e ambas mandam a mesma intenção (o campo e o valor).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:217` `    return { document: withCollection(document, held.name, next), message: message('status.data.fieldChanged', { collection: held.name, label: shown }) };`).
- G5: n/a — o comando não desenha controle: o campo vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
