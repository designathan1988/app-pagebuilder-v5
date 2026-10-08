# TRC-table.removeColumn
- **Chamada:** `src/app/commands.ts:258` `'table.removeColumn': removeColumnCommand,`
- **Argumentos:** o tratador não recebe argumento (`{}`); a coluna vem da célula selecionada.
- **Ramos que dependem dos argumentos:** nenhum — o comando não tem argumento.

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/table.ts:117` `export const removeColumnCommand = registerHandler('table.removeColumn', ({ state }): Outcome<never> => {` — o tratador recebe o estado.
3. `src/core/elements/table.ts:118` `const at = selectedCell(state);` — a célula que a seleção segura. [lê: EST-L01-031 via selectedCell] [lê: EST-L01-030 via selectedCell]
4. `src/core/elements/table.ts:120` `const refused = locked(state.document, at.table);` [lê: EST-L01-030 via locked]
5. `src/core/elements/table.ts:126` `const released = releaseReferencesPatch(state.document, new Set(leaving));` — o que aponta para as células que saem. [lê: EST-L01-030 via releaseReferencesPatch]
6. `src/core/elements/table.ts:127` `const removed = rowsOf(at.table)` — os patches que removem a célula do índice em cada linha.
7. `src/core/elements/table.ts:134` `return { kind: 'change', patches, selection: next === undefined ? [] : [next.id], message: message('status.table.columnRemoved', { count: removed.length }) };` [escreve: EST-L01-030 via run] [escreve: EST-L01-031 via run]

## Ramos
- R1 `src/core/elements/table.ts:119` `if (at === null) return { kind: 'refused', message: message('status.table.selectCell') };` — sem célula selecionada: recusa; com célula: segue.
- R2 `src/core/elements/table.ts:120` `const refused = locked(state.document, at.table);` — tabela travada (linha 121): recusa; livre: segue.
- R3 `src/core/elements/table.ts:122` `if (at.row.node.children.length <= 1) return { kind: 'refused', message: message('status.table.lastColumn') };` — a última coluna: recusa; havendo mais: segue.
- R4 `src/core/elements/table.ts:133` `const next = row[index + 1] ?? row[index - 1];` — a seleção vai para a célula que toma o lugar da removida, senão a anterior, senão fica vazia.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, selectedCell, locked, releaseReferencesPatch), EST-L01-031 (a seleção, via selectedCell), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via run), EST-L01-031 (a seleção, via run)

## Resultado
- **Estado final:** EST-L01-030 com a coluna removida de cada linha por `src/core/elements/table.ts:134` `return { kind: 'change', patches, selection: next === undefined ? [] : [next.id], message: message('status.table.columnRemoved', { count: removed.length }) };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem; a seleção passa para a célula remanescente pelo campo `selection` do resultado.
- **DOM do canvas:** o iframe redesenha a tabela sem a coluna pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava células da tabela, não um valor de estilo `src/core/elements/table.ts:134` `return { kind: 'change', patches, selection: next === undefined ? [] : [next.id], message: message('status.table.columnRemoved', { count: removed.length }) };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/table.ts:117` `export const removeColumnCommand = registerHandler('table.removeColumn', ({ state }): Outcome<never> => {`
- G4: n/a — a porta é o item do menu de contexto e da command bar, não um ponto do canvas `manifest/commands/elements.json:5490` `"kind": "context-menu",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/table.ts:134` `return { kind: 'change', patches, selection: next === undefined ? [] : [next.id], message: message('status.table.columnRemoved', { count: removed.length }) };`.
- G6: ok — a seleção passa para a célula remanescente pelo campo `selection` do resultado `src/core/elements/table.ts:134` `return { kind: 'change', patches, selection: next === undefined ? [] : [next.id], message: message('status.table.columnRemoved', { count: removed.length }) };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
