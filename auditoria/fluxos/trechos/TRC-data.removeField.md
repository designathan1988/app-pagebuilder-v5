# TRC-data.removeField
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ collection: string, field: string }`.
- **Ramos que dependem dos argumentos:** R1 (o campo está em uso), R2 (o campo é o último).

## Passos
1. `src/app/commands.ts:159` `  'data.removeField': removeFieldCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:240` `export const removeFieldCommand = registerHandler('data.removeField', (context, { collection, field }) =>` — o tratador recebe a coleção e o campo. [nada muda]
3. `src/core/data/commands.ts:241` `  contentChange(context, (document) => {` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/core/data/commands.ts:242` `    const held = named(document, collection);` — procura a coleção. [lê: EST-L01-030 via named]
6. `src/core/data/commands.ts:243` `    const label = held.fields.find((f) => f.key === field)?.label ?? field;` — pega o rótulo do campo pela chave. [lê: EST-L01-030 via handlerContext]
7. `src/core/data/commands.ts:244` `    const uses = fieldUses(document, held.name, field);` — conta os usos do campo em ligações, filtros e ordens. [lê: EST-L01-030 via fieldUses]
8. `src/core/data/commands.ts:223` `function fieldUses(document: DocumentJson, collection: string, key: string): number {` — soma as ligações das listas e páginas de item e os filtros e ordens. [lê: EST-L01-030 via fieldUses]
9. `src/core/data/commands.ts:245` `    if (uses > 0) refuse('status.data.fieldInUse', { collection: held.name, label, count: { plural: 'data.places', count: uses } });` — campo usado recusa nomeando os usos (R1). [lê: EST-L01-030 via refuse]
10. `src/core/data/collections.ts:307` `export function removeField(collection: Collection, key: string): Collection {` — o campo é retirado. [nada muda]
11. `src/core/data/collections.ts:309` `  const refused = schemaRefusal(collection.name, fields);` — sem sobrar campo, recusa (R2). [nada muda]
12. `src/core/data/commands.ts:246` `    return { document: withCollection(document, held.name, removeField(held, field)), message: message('status.data.fieldRemoved', { collection: held.name, label }) };` — o documento novo troca a coleção. [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]
13. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue. [lê: EST-L01-030 via derivedDocument]
14. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
15. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
16. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
17. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
18. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-003 via publish]
19. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/core/data/commands.ts:245` `    if (uses > 0) refuse('status.data.fieldInUse', { collection: held.name, label, count: { plural: 'data.places', count: uses } });` — campo usado por ligações, filtros ou ordens recusa sem gravar e sem entrada no histórico; sem uso segue.
- R2: `src/core/data/collections.ts:152` `  if (fields.length === 0) return message('status.data.noFields', { collection });` — ficando sem campo nenhum, `removeField` lança `DataRefusal`, que `contentChange` converte em `refused` (`src/core/data/commands.ts:70` `    if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };`); sobrando campos segue para o passo 12.
- R3: `src/core/data/commands.ts:242` `    const held = named(document, collection);` — coleção ausente lança defeito da porta (não recusa).

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `removeField` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`document.collections`, `document.pages`, `document.components`), EST-L01-032 (`history`).

## Resultado
- **Estado final:** a coleção perde o campo e cada item perde o valor daquela chave (`src/core/data/collections.ts:316` `  return { ...collection, fields, items };`); o histórico guarda a etapa.
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha a lista de campos.
- **DOM do canvas:** o canvas redesenha por causa da mudança do documento (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são a coleção e a chave de um campo existente (`src/core/data/commands.ts:243` `    const label = held.fields.find((f) => f.key === field)?.label ?? field;`).
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:724` `      "id": "data-field-remove",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:246` `    return { document: withCollection(document, held.name, removeField(held, field)), message: message('status.data.fieldRemoved', { collection: held.name, label }) };`).
- G5: n/a — o comando não desenha controle: a lixeira do campo vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
