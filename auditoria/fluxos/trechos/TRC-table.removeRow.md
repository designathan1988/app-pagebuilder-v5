# TRC-table.removeRow
- **Chamada:** `src/app/commands.ts:260` `'table.removeRow': removeRowCommand,`
- **Argumentos:** o tratador não recebe argumento (`{}`); a linha vem da célula selecionada.
- **Ramos que dependem dos argumentos:** nenhum — o comando não tem argumento.

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/table.ts:146` `export const removeRowCommand = registerHandler('table.removeRow', ({ state }): Outcome<never> => {` — o tratador recebe o estado.
3. `src/core/elements/table.ts:147` `const at = selectedCell(state);` — a célula que a seleção segura. [lê: EST-L01-031 via selectedCell] [lê: EST-L01-030 via selectedCell]
4. `src/core/elements/table.ts:149` `const refused = locked(state.document, at.table);` [lê: EST-L01-030 via locked]
5. `src/core/elements/table.ts:154` `const next = rows[at.row.index + 1] ?? rows[at.row.index - 1];` — a linha seguinte, senão a anterior.
6. `src/core/elements/table.ts:159` `patches: [...releaseReferencesPatch(state.document, subtreeIds(at.row.node)), { op: 'remove', path: at.row.path }],` — o que aponta para a linha sai com ela. [lê: EST-L01-030 via releaseReferencesPatch]
7. `src/core/elements/table.ts:160` `selection: [cell?.id ?? at.table.node.id],` [escreve: EST-L01-031 via run]

## Ramos
- R1 `src/core/elements/table.ts:148` `if (at === null) return { kind: 'refused', message: message('status.table.selectCell') };` — sem célula selecionada: recusa; com célula: segue.
- R2 `src/core/elements/table.ts:149` `const refused = locked(state.document, at.table);` — tabela travada (linha 150): recusa; livre: segue.
- R3 `src/core/elements/table.ts:151` `if (at.group.node.type === BODY && at.group.node.children.length <= 1) return { kind: 'refused', message: message('status.table.lastRow') };` — a última linha do corpo: recusa; havendo mais: segue.
- R4 `src/core/elements/table.ts:155` `const cell = next?.children[Math.min(at.cell.index, next.children.length - 1)];` — a seleção vai para a mesma coluna da linha seguinte, senão a anterior, senão a tabela.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, selectedCell, locked, releaseReferencesPatch), EST-L01-031 (a seleção, via selectedCell), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-031 (a seleção, via run)

## Resultado
- **Estado final:** EST-L01-030 com a linha removida de seu grupo por `src/core/elements/table.ts:159` `patches: [...releaseReferencesPatch(state.document, subtreeIds(at.row.node)), { op: 'remove', path: at.row.path }],` e a seleção na célula remanescente por `src/core/elements/table.ts:160` `selection: [cell?.id ?? at.table.node.id],`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra o nome da linha removida; a seleção passa pelo campo `selection` do resultado.
- **DOM do canvas:** o iframe redesenha a tabela sem a linha pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava a linha da tabela, não um valor de estilo `src/core/elements/table.ts:159` `patches: [...releaseReferencesPatch(state.document, subtreeIds(at.row.node)), { op: 'remove', path: at.row.path }],`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/table.ts:146` `export const removeRowCommand = registerHandler('table.removeRow', ({ state }): Outcome<never> => {`
- G4: n/a — a porta é o item do menu de contexto e da command bar, não um ponto do canvas `manifest/commands/elements.json:5621` `"kind": "context-menu",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/table.ts:159` `patches: [...releaseReferencesPatch(state.document, subtreeIds(at.row.node)), { op: 'remove', path: at.row.path }],`.
- G6: ok — a seleção passa para a célula remanescente pelo campo `selection` do resultado `src/core/elements/table.ts:160` `selection: [cell?.id ?? at.table.node.id],`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
