# TRC-style.setFilter
- **Chamada:** `src/app/commands.ts:419` `'style.setFilter': setFilterCommand,`
- **Argumentos:** `{ property: property, functions: json, targets?: nodes }` — como o manifesto declara (`manifest/commands/style.json:8694` `"id": "style.setFilter",`). `functions` é o mapa de nome → argumento de cada função, ou `none` para remover os filtros.
- **Ramos que dependem dos argumentos:** R2 (o `functions` `none` remove a declaração), R3 (o `functions` que não é mapa), R4 (o valor que a propriedade não toma).

## Passos
1. `src/app/commands.ts:419` `'style.setFilter': setFilterCommand,` — a tabela liga o id ao tratador.
2. `src/editor/shell/field.tsx:989` `(store.dispatch as Dispatch)(entry.command.id, same ? args : { ...args, targets: [...targets] }, context);` — o campo entrega a intenção, com os alvos onde foi digitado.
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `editableSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/filter.ts:24` `export const setFilterCommand = registerHandler('style.setFilter', (given, { property, functions, targets }) => {` — o tratador recebe o contexto e os argumentos.
8. `src/core/style/filter.ts:25` `const context = withTargets(given, targets);` — o contexto passa a nomear os alvos [lê: EST-L01-030 via withTargets].
9. `src/core/style/filter.ts:30` `const primary = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);` — o elemento principal é achado [lê: EST-L01-030 via locate].
10. `src/core/style/filter.ts:32` `const value = applyFunctions(storedValue(primary.node, property, rules), functions);` — cada função entra no valor, no seu lugar ou por último [lê: EST-L01-030 via storedValue].
11. `src/core/style/filter.ts:33` `const read = value === null ? null : readValue(context, property, value);` — o valor montado é lido pelo codec [lê: EST-L01-030 via readValue].
12. `src/core/style/filter.ts:35` `return writeStyle(context, property, read.css);` — o valor lido vira uma escrita de estilo.
13. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
14. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
15. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
16. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
17. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/filter.ts:26` `if (context === null) return { kind: 'change' };` — nenhum alvo restou: `change` sem mudança; restou: segue.
- R2 `src/core/style/filter.ts:29` `if (functions === 'none') return removeStyle(context, property);` — `functions` `none`: a declaração inteira sai (`removeStyle`); um mapa: segue.
- R3 `src/core/style/filter.ts:31` `if (primary === null) return { kind: 'change' };` — sem elemento principal: `change` sem mudança; com: segue.
- R4 `src/core/style/filter.ts:34` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, rules), value: value ?? typedText(functions) }) };` — valor que a propriedade não toma, ou função que não é texto: recusa `status.value.invalid`; tomado: escreve.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/filter.ts:24`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a `filter` do detentor fica com o valor montado na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; `none` remove a declaração. A mensagem é a de `writeStyle` ou a de `removeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo do filtro passa a exibir o valor.
- **DOM do canvas:** o iframe desenha o elemento com o filtro novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:419` `'style.setFilter': setFilterCommand,` — as portas entregam o mesmo mapa de funções ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/filter.ts:35`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/filter.ts:35`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/filter.ts:24`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
