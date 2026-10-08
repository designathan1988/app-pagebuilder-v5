# TRC-parts.toggle
- **Chamada:** `src/app/commands.ts:252` `'parts.toggle': togglePartCommand,`
- **Argumentos:** o tratador recebe `{ type }` — a parte alternada (enum: caption, tableHead, tableFoot).
- **Ramos que dependem dos argumentos:** R2 (a parte está na tabela), R3 (a parte está ausente).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/parts.ts:39` `export const togglePartCommand = registerHandler('parts.toggle', ({ state, rules, ids, words }, { type }): Outcome<never> => {` — o tratador recebe o estado, as regras, os ids e a palavra.
3. `src/core/elements/parts.ts:40` `const table = tableOf(state.document, state.selection);` [lê: EST-L01-030 via tableOf] [lê: EST-L01-031 via tableOf]
4. `src/core/elements/parts.ts:42` `const locked = lockRefusal(state.document, table.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
5. `src/core/elements/parts.ts:44` `const index = table.node.children.findIndex((child) => child.type === type);` — procura a parte entre os filhos.
6. `src/core/elements/parts.ts:48` `const released = releaseReferencesPatch(state.document, subtreeIds(part));` — o que aponta para a parte sai com ela. [lê: EST-L01-030 via releaseReferencesPatch]
7. `src/core/elements/parts.ts:49` `return { kind: 'change', patches: [...released, { op: 'remove', path: [...table.path, 'children', index] }], selection: [table.node.id], message: message('status.table.partRemoved', { part: part.name, table: table.node.name }) };` [escreve: EST-L01-030 via run] [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]
8. `src/core/elements/parts.ts:52` `const part = type === CAPTION ? newElement(make, CAPTION) : newElement(make, type, (m) => [newRow(m, type, columns(table.node))]);` — a parte nova, com a linha de células do tipo.
9. `src/core/elements/parts.ts:55` `patches: [{ op: 'add', path: [...table.path, 'children', slotOf(table.node, type)], value: part }],` [escreve: EST-L01-030 via run]

## Ramos
- R1 `src/core/elements/parts.ts:41` `if (table === null) return { kind: 'refused', message: message('status.table.selectPart') };` — sem tabela na seleção: recusa; com tabela: segue.
- R2 `src/core/elements/parts.ts:42` `const locked = lockRefusal(state.document, table.node.id, 'status.locked.edit');` — travada (linha 43): recusa; livre: segue.
- R3 `src/core/elements/parts.ts:45` `if (index >= 0) {` — a parte já existe: remove (linha 49); ausente: acrescenta (linha 53).
- R4 `src/core/elements/parts.ts:52` `const part = type === CAPTION ? newElement(make, CAPTION) : newElement(make, type, (m) => [newRow(m, type, columns(table.node))]);` — a legenda entra sem filhos; o cabeçalho e o rodapé entram com uma linha de células.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento: a tabela, as referências que à parte levam, via tableOf, lockRefusal, releaseReferencesPatch), EST-L01-031 (a seleção, via tableOf)
- escreve: EST-L01-030 (o documento: a parte na tabela, via run), EST-L01-031 (a seleção na tabela, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com a parte removida por `src/core/elements/parts.ts:49` `return { kind: 'change', patches: [...released, { op: 'remove', path: [...table.path, 'children', index] }], selection: [table.node.id], message: message('status.table.partRemoved', { part: part.name, table: table.node.name }) };` ou acrescentada por `src/core/elements/parts.ts:55` `patches: [{ op: 'add', path: [...table.path, 'children', slotOf(table.node, type)], value: part }],`, EST-L01-031 com a seleção na tabela e EST-L01-033 com a mensagem.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem; a seleção fica na tabela pelo campo `selection` do resultado.
- **DOM do canvas:** o iframe redesenha a tabela com a parte pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava a estrutura do nó, não um valor de estilo `src/core/elements/parts.ts:55` `patches: [{ op: 'add', path: [...table.path, 'children', slotOf(table.node, type)], value: part }],`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/parts.ts:39` `export const togglePartCommand = registerHandler('parts.toggle', ({ state, rules, ids, words }, { type }): Outcome<never> => {`
- G4: n/a — a porta é um controle do inspetor, não um ponto do canvas `manifest/commands/elements.json:4835` `"kind": "panel-control",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/parts.ts:55` `patches: [{ op: 'add', path: [...table.path, 'children', slotOf(table.node, type)], value: part }],`.
- G6: ok — a seleção passa a ser a tabela pelo campo `selection` do resultado `src/core/elements/parts.ts:56` `selection: [table.node.id],`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
