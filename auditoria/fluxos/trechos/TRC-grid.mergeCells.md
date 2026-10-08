# TRC-grid.mergeCells
- **Chamada:** `src/app/commands.ts:415` `'grid.mergeCells': mergeGridCells,`
- **Argumentos:** `{ property: property[grid-column] }` — o eixo em que a célula se funde, como o manifesto declara (`manifest/commands/style.json:10900` `"id": "grid.mergeCells",`).
- **Ramos que dependem dos argumentos:** nenhum — o `property` só nomeia o eixo; os ramos vêm da grelha e das células livres.

## Passos
1. `src/app/commands.ts:415` `'grid.mergeCells': mergeGridCells,` — a tabela liga o id ao tratador.
2. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — o Ctrl+M do contexto da grelha entrega a intenção.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/canvas/grid-edit.ts:146` `export const mergeGridCells = registerHandler<'grid.mergeCells', EditorUi>('grid.mergeCells', (context, { property }) => {` — o tratador recebe o contexto e o eixo.
8. `src/editor/canvas/grid-edit.ts:148` `  const grid = gridOf(state, rules);` — a grelha editada é achada [lê: EST-L01-030 via gridOf] [lê: EST-L01-031 via gridOf].
9. `src/editor/canvas/grid-edit.ts:149` `  const item = itemOf(state, rules);` — o item selecionado é achado [lê: EST-L01-030 via itemOf] [lê: EST-L01-031 via itemOf].
10. `src/editor/canvas/grid-edit.ts:151` `  const at = covered(item, property, rules);` — o start e o span cobertos pelo item são lidos [lê: EST-L01-030 via covered].
11. `src/editor/canvas/grid-edit.ts:152` `  const standing = holdsCells(grid, property, rules, item, at.start, at.span + 1);` — quem ocupa a célula seguinte é procurado [lê: EST-L01-030 via holdsCells].
12. `src/editor/canvas/grid-edit.ts:153` `  if (standing === null) return spanThrough(context, property, at.span + 1) ?? { kind: 'change' };` — célula livre: o span cresce um, pelo dono único do lugar do item.
13. `src/editor/canvas/grid-edit.ts:106` `  return setGridItemCommand.run(context as never, { property, ...(start === undefined ? {} : { start }), span } as never) as Outcome<EditorUi>;` — o dono único escreve o lugar [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
14. `src/core/style/grid-item.ts:57` `  return writeStyle(context, property, read.css, longhandValues(property, read.value, context.rules));` — o valor lido vira uma escrita de estilo.
15. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via run].
16. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
17. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/editor/canvas/grid-edit.ts:150` `  if (grid === null || item === null) return { kind: 'change' };` — sem grelha editada ou sem item selecionado: `change` sem patch; com: segue.
- R2 `src/editor/canvas/grid-edit.ts:153` `  if (standing === null) return spanThrough(context, property, at.span + 1) ?? { kind: 'change' };` — a célula seguinte está livre: o span cresce um; ocupada: segue para o passo do recado.
- R3 `src/editor/canvas/grid-edit.ts:154` `  return { kind: 'refused', message: message('status.gridEdit.cellTaken', { name: standing.name }) };` — um filho ocupa a célula seguinte: recusa `status.gridEdit.cellTaken` com o seu nome.
- R4 `src/core/style/grid-item.ts:53` `    return { kind: 'refused', message: message(written.refused === 'start' ? 'status.gridItem.noStart' : 'status.gridItem.noSpan') };` — span maior que o navegador aceita: recusa o recado do lugar; válido: escreve.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/canvas/grid-edit.ts:146`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, run, gridOf, itemOf, covered, holdsCells, commit), EST-L01-031 (a seleção, via gridOf, itemOf, commit), EST-L01-037 (o estado do editor, via run), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (o documento `styles`, via run, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** quando a célula seguinte está livre, o `grid-column` do item fica com o span um maior (`src/core/style/grid-item.ts:57`), em uma transação e um passo de desfazer; quando ocupada, nada muda e a mensagem é `status.gridEdit.cellTaken` (`src/editor/canvas/grid-edit.ts:154`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o chrome da grelha redesenha a borda do item.
- **DOM do canvas:** o iframe desenha o item com o span novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` quando a célula estava livre.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:415` `'grid.mergeCells': mergeGridCells,` — a tecla entrega só a intenção ao dono do lugar do item.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/canvas/grid-edit.ts:153`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/canvas/grid-edit.ts:153`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/canvas/grid-edit.ts:146`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
