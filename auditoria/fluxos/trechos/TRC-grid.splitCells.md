# TRC-grid.splitCells
- **Chamada:** `src/app/commands.ts:416` `'grid.splitCells': splitGridCells,`
- **Argumentos:** `{ property: property[grid-column] }` — o eixo em que a última célula se separa, como o manifesto declara (`manifest/commands/style.json:10952` `"id": "grid.splitCells",`).
- **Ramos que dependem dos argumentos:** nenhum — o `property` só nomeia o eixo; os ramos vêm do item selecionado.

## Passos
1. `src/app/commands.ts:416` `'grid.splitCells': splitGridCells,` — a tabela liga o id ao tratador.
2. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — o Ctrl+Shift+M do contexto da grelha entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-030 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/canvas/grid-edit.ts:157` `export const splitGridCells = registerHandler<'grid.splitCells', EditorUi>('grid.splitCells', (context, { property }) => {` — o tratador recebe o contexto e o eixo.
8. `src/editor/canvas/grid-edit.ts:159` `  const item = itemOf(state, rules);` — o item selecionado é achado [lê: EST-L01-030 via itemOf] [lê: EST-L01-031 via itemOf] [lê: EST-L01-037 via itemOf].
9. `src/editor/canvas/grid-edit.ts:161` `  const at = covered(item, property, rules);` — o start e o span cobertos pelo item são lidos [lê: EST-L01-030 via covered].
10. `src/editor/canvas/grid-edit.ts:163` `  return spanThrough(context, property, at.span - 1) ?? { kind: 'change' };` — o span cai um, pelo dono único do lugar do item.
11. `src/editor/canvas/grid-edit.ts:106` `  return setGridItemCommand.run(context as never, { property, ...(start === undefined ? {} : { start }), span } as never) as Outcome<EditorUi>;` — o dono único escreve o lugar [lê: EST-L01-030 via run].
12. `src/core/style/grid-item.ts:51` `  const written = gridItemValue(storedPlace(primary.node, property, rules), start, span);` — o start é o do item; o span é o novo [lê: EST-L01-030 via storedPlace].
13. `src/core/style/grid-item.ts:57` `  return writeStyle(context, property, read.css, longhandValues(property, read.value, context.rules));` — o valor lido vira uma escrita de estilo.
14. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
16. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
18. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/editor/canvas/grid-edit.ts:160` `  if (item === null) return { kind: 'change' };` — a seleção não é um item da grelha editada: `change` sem patch; é: segue.
- R2 `src/editor/canvas/grid-edit.ts:162` `  if (at.span <= 1) return { kind: 'refused', message: message('status.gridEdit.nothingToSplit', { name: item.name }) };` — o item cobre uma só célula: recusa `status.gridEdit.nothingToSplit`; cobre mais: separa.
- R3 `src/core/style/grid-item.ts:53` `    return { kind: 'refused', message: message(written.refused === 'start' ? 'status.gridItem.noStart' : 'status.gridItem.noSpan') };` — span abaixo de 1: recusa o recado do lugar; válido: escreve.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/canvas/grid-edit.ts:157`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento), EST-L01-031 (seleção), EST-L01-037 (`ui.gridEdit`, regras), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** o `grid-column` do item fica com o span um menor (`src/core/style/grid-item.ts:57`), em uma transação e um passo de desfazer; um item de uma só célula não muda e a mensagem é `status.gridEdit.nothingToSplit` (`src/editor/canvas/grid-edit.ts:162`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o chrome da grelha redesenha a borda do item.
- **DOM do canvas:** o iframe desenha o item com o span menor pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:416` `'grid.splitCells': splitGridCells,` — a tecla entrega só a intenção ao dono do lugar do item.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/canvas/grid-edit.ts:163`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/canvas/grid-edit.ts:163`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/canvas/grid-edit.ts:157`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
