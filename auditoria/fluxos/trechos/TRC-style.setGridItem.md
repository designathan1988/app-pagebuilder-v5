# TRC-style.setGridItem
- **Chamada:** `src/app/commands.ts:417` `'style.setGridItem': setGridItemCommand,`
- **Argumentos:** `{ property: property, start?: integer, span?: integer }` — o `property` é `grid-column` ou `grid-row`; o `start` e o `span` que o door deixar fora são lidos do valor que o elemento guarda, como o manifesto declara (`manifest/commands/style.json:10432` `"id": "style.setGridItem",`).
- **Ramos que dependem dos argumentos:** R1 (o `property`/`start`/`span` com tipo errado), R3 (o `start` abaixo de 1), R4 (o `span` abaixo de 1).

## Passos
1. `src/app/commands.ts:417` `'style.setGridItem': setGridItemCommand,` — a tabela liga o id ao tratador.
2. `src/editor/shell/inspector-controls.tsx:284` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, { property, [half]: number });` — o campo do lugar do item entrega a intenção.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `editableSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/grid-item.ts:42` `export const setGridItemCommand = registerHandler('style.setGridItem', (context, { property, start, span }) => {` — o tratador recebe o contexto e os argumentos.
8. `src/core/style/grid-item.ts:47` `const primary = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);` — o elemento principal é achado [lê: EST-L01-030 via locate].
9. `src/core/style/grid-item.ts:51` `const written = gridItemValue(storedPlace(primary.node, property, rules), start, span);` — a metade deixada fora é lida dos longhands do elemento [lê: EST-L01-030 via storedPlace].
10. `src/core/style/grid-item.ts:55` `const read = readValue(context, property, written);` — o valor montado é lido pelo codec [lê: EST-L01-030 via readValue].
11. `src/core/style/grid-item.ts:57` `return writeStyle(context, property, read.css, longhandValues(property, read.value, context.rules));` — o valor lido vira uma escrita de estilo.
12. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
13. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
14. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
15. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
16. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/grid-item.ts:43` `if (typeof property !== 'string' || (start !== undefined && typeof start !== 'number') || (span !== undefined && typeof span !== 'number')) {` — argumento com tipo errado: recusa nomeando o argumento; bom: segue.
- R2 `src/core/style/grid-item.ts:48` `if (primary === null) return { kind: 'change' };` — seleção vazia: `change` sem patch; com: segue.
- R3 `src/core/style/grid-item.ts:53` `    return { kind: 'refused', message: message(written.refused === 'start' ? 'status.gridItem.noStart' : 'status.gridItem.noSpan') };` — `start` abaixo de 1: recusa `status.gridItem.noStart`; `span` abaixo de 1: recusa `status.gridItem.noSpan`; válidos: segue.
- R4 `src/core/style/grid-item.ts:56` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, rules), value: written }) };` — valor que a propriedade não toma: recusa `status.value.invalid`; tomado: escreve.
- R5 `src/core/style/grid-item.ts:32` `function gridItemValue(now: { readonly start: number | null; readonly span: number }, start: number | undefined, span: number | undefined): string | { readonly refused: 'start' } | { readonly refused: 'span' } {` — o `start` deixado fora é o do elemento; o `span` deixado fora é o seu; um `span` de 1 escreve só o `start`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/grid-item.ts:42`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os longhands do `grid-column` (ou `grid-row`) do detentor ficam com o `start` e o `span` novos na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; os campos do lugar passam a exibir o start e o span.
- **DOM do canvas:** o iframe desenha o item na célula nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:417` `'style.setGridItem': setGridItemCommand,` — as portas entregam o mesmo `property` e `start`/`span` ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/grid-item.ts:57`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/grid-item.ts:57`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/grid-item.ts:42`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
