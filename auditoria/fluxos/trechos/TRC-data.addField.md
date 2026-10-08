# TRC-data.addField
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ label: string, type: enum }`; a porta `data-field-add` manda o rótulo digitado e o tipo escolhido.
- **Ramos que dependem dos argumentos:** R1 (sem coleção mostrada), R2 (rótulo vazio), R3 (rótulo repetido ou tipo inválido).

## Passos
1. `src/app/commands.ts:157` `  'data.addField': addFieldCommand<EditorUi>(),` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:200` `export function addFieldCommand<Ui extends WithCollection>() {` — a fábrica do tratador. [nada muda]
3. `src/core/data/commands.ts:201` `  return registerHandler<'data.addField', Ui>('data.addField', (context, { label, type }) =>` — o tratador recebe `label` e `type`. [nada muda]
4. `src/core/data/commands.ts:202` `    contentChange(context, (document) => {` — o documento novo é calculado por `contentChange`. [nada muda]
5. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
6. `src/core/data/commands.ts:203` `      const held = shownCollection(document, context.state.ui);` — pega a coleção mostrada. [lê: EST-L01-030 via shownCollection] [lê: EST-L01-037 via shownCollection]
7. `src/core/data/commands.ts:91` `export function shownCollection(document: DocumentJson, ui: WithCollection | undefined): Collection | undefined {` — a coleção escolhida, ou a primeira do projeto. [lê: EST-L01-030 via shownCollection] [lê: EST-L01-037 via shownCollection]
8. `src/core/data/commands.ts:204` `      if (held === undefined) refuse('status.data.noCollection');` — sem coleção, recusa sem mudar nada (R1). [lê: EST-L01-030 via handlerContext]
9. `src/core/data/commands.ts:205` `      if (label.trim() === '') refuse('status.data.fieldLabelEmpty', { collection: held.name });` — rótulo vazio recusa (R2). [lê: EST-L01-030 via handlerContext]
10. `src/core/data/commands.ts:206` `      const next = addField(held, label, fieldType(type));` — acrescenta o campo à coleção. [lê: EST-L01-030 via addField]
11. `src/core/data/commands.ts:85` `const fieldType = (value: unknown): FieldType => {` — o tipo declarado é conferido contra os tipos conhecidos. [nada muda]
12. `src/core/data/collections.ts:274` `export function addField(collection: Collection, label: string, type: FieldType): Collection {` — o campo novo é montado. [nada muda]
13. `src/core/data/collections.ts:277` `  const refused = schemaRefusal(collection.name, fields);` — o esquema é conferido (rótulo repetido recusa) (R3). [nada muda]
14. `src/core/data/commands.ts:207` `      return { document: withCollection(document, held.name, next), message: message('status.data.fieldAdded', { collection: held.name, label: label.trim() }) };` — o documento novo troca a coleção. [escreve: EST-L01-030 via run]
15. `src/core/data/commands.ts:62` `    const after = derivedDocument(before, result.document, data);` — a derivação segue. [lê: EST-L01-030 via contentChange]
16. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
17. `src/core/data/commands.ts:68` `    return { kind: 'change', patches, message: result.message,` — a resposta é a mudança. [nada muda]
18. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
19. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
20. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
21. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-030 via publish]
22. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-037 via publish]

## Ramos
- R1: `src/core/data/commands.ts:204` `      if (held === undefined) refuse('status.data.noCollection');` — sem coleção mostrada (nem escolhida nem primeira no projeto) a resposta é `refused`; havendo coleção segue.
- R2: `src/core/data/commands.ts:205` `      if (label.trim() === '') refuse('status.data.fieldLabelEmpty', { collection: held.name });` — rótulo vazio recusa; rótulo com texto segue.
- R3: `src/core/data/collections.ts:159` `    if (labels.has(label)) return message('status.data.fieldLabelTaken', { collection, label: field.label.trim() });` — rótulo repetido (ou tipo fora da lista) lança `DataRefusal`, que `contentChange` converte em `refused` (`src/core/data/commands.ts:70` `    if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };`) sem gravar; rótulo livre segue para o passo 14.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `derivedDocument` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (`state.document`, via contentChange, shownCollection, handlerContext, addField, publish), EST-L01-037 (`state.ui`, via shownCollection, publish).
- Escreve: EST-L01-030 (`document.collections`, via run, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (`history`, via run).

## Resultado
- **Estado final:** a coleção ganha o campo novo, com a chave derivada do rótulo (`src/core/data/commands.ts:207` `      return { document: withCollection(document, held.name, next), message: message('status.data.fieldAdded', { collection: held.name, label: label.trim() }) };`); o histórico guarda a etapa.
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha a lista de campos.
- **DOM do canvas:** o canvas redesenha por causa da mudança do documento (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o rótulo vem do campo da porta e é lido uma vez (`src/core/data/commands.ts:201` `  return registerHandler<'data.addField', Ui>('data.addField', (context, { label, type }) =>`), sem digitação pendente com contexto.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:546` `      "id": "data-field-add",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:207` `      return { document: withCollection(document, held.name, next), message: message('status.data.fieldAdded', { collection: held.name, label: label.trim() }) };`).
- G5: n/a — o comando não desenha controle: o formulário vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
