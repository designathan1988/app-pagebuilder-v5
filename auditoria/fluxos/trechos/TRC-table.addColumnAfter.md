# TRC-table.addColumnAfter
- **Chamada:** `src/app/commands.ts:256` `'table.addColumnAfter': addColumnAfterCommand,`
- **Argumentos:** o tratador não recebe argumento (`{}`); a coluna vem da célula selecionada.
- **Ramos que dependem dos argumentos:** nenhum — o comando não tem argumento.

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/table.ts:99` `export const addColumnAfterCommand = registerHandler('table.addColumnAfter', ({ state, rules, ids, words }): Outcome<never> => {` — o tratador recebe o estado, as regras, os ids e a palavra.
3. `src/core/elements/table.ts:100` `const at = selectedCell(state);` — a célula que a seleção segura, com sua linha, grupo e tabela. [lê: EST-L01-031 via selectedCell] [lê: EST-L01-030 via selectedCell]
4. `src/core/elements/table.ts:102` `const refused = locked(state.document, at.table);` [lê: EST-L01-030 via locked]
5. `src/core/elements/table.ts:104` `const patches = addColumn(at.table, nodeMaker(state.document, rules, ids, words), (row) => Math.min(at.cell.index + 1, row.children.length));` — uma célula nova no índice seguinte em cada linha. [lê: EST-L01-030 via nodeMaker]
6. `src/core/elements/table.ts:105` `return { kind: 'change', patches, message: message('status.table.columnCreated', { count: patches.length }) };` [escreve: EST-L01-030 via run]

## Ramos
- R1 `src/core/elements/table.ts:101` `if (at === null) return { kind: 'refused', message: message('status.table.selectCell') };` — sem célula selecionada: recusa; com célula: segue.
- R2 `src/core/elements/table.ts:102` `const refused = locked(state.document, at.table);` — tabela travada (linha 103): recusa; livre: segue.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, selectedCell, locked, nodeMaker), EST-L01-031 (a seleção, via selectedCell), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via run)

## Resultado
- **Estado final:** EST-L01-030 com uma célula nova no índice seguinte em cada linha por `src/core/elements/table.ts:105` `return { kind: 'change', patches, message: message('status.table.columnCreated', { count: patches.length }) };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem com o número de linhas alcançadas.
- **DOM do canvas:** o iframe redesenha a tabela com a coluna pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava células da tabela, não um valor de estilo `src/core/elements/table.ts:105` `return { kind: 'change', patches, message: message('status.table.columnCreated', { count: patches.length }) };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/table.ts:99` `export const addColumnAfterCommand = registerHandler('table.addColumnAfter', ({ state, rules, ids, words }): Outcome<never> => {`
- G4: n/a — a porta é o item do menu de contexto e da command bar, não um ponto do canvas `manifest/commands/elements.json:5359` `"kind": "context-menu",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/table.ts:105` `return { kind: 'change', patches, message: message('status.table.columnCreated', { count: patches.length }) };`.
- G6: n/a — o trecho não escreve a seleção; a seleção fica como a store a tem `src/core/elements/table.ts:105` `return { kind: 'change', patches, message: message('status.table.columnCreated', { count: patches.length }) };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
