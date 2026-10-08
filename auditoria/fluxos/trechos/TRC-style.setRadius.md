# TRC-style.setRadius
- **Chamada:** `src/app/commands.ts:407` `'style.setRadius': setRadiusCommand,`
- **Argumentos:** `{ corners: enum[all|top-left|top-right|bottom-right|bottom-left], value: string, targets?: nodes }` — como o manifesto declara (`manifest/commands/style.json:6751` `"id": "style.setRadius",`).
- **Ramos que dependem dos argumentos:** R2 (o `corners` escolhe todos os cantos ou um) e R3 (o `value` não tomado).

## Passos
1. `src/app/commands.ts:407` `'style.setRadius': setRadiusCommand,` — a tabela liga o id ao tratador.
2. `src/editor/shell/field.tsx:989` `(store.dispatch as Dispatch)(entry.command.id, same ? args : { ...args, targets: [...targets] }, context);` — o campo do raio entrega a intenção, com os alvos onde foi digitado.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `editableSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/border.ts:63` `export const setRadiusCommand = registerHandler('style.setRadius', (given, { corners, value, targets }) => {` — o tratador recebe o contexto e os argumentos.
8. `src/core/style/border.ts:64` `const context = withTargets(given, targets);` — o contexto passa a nomear os alvos [lê: EST-L01-030 via withTargets].
9. `src/core/style/border.ts:66` `const target = corners === 'all' ? 'border-radius' : ` — a propriedade escrita é o composto inteiro ou um canto.
10. `src/core/style/border.ts:67` `const read = readValue(context, target, value);` — o texto é lido pelo codec do alvo [lê: EST-L01-030 via readValue].
11. `src/core/style/border.ts:69` `return writeStyle(context, target, read.css, declarationsOf(target, read, context.rules));` — o valor lido vira uma escrita de estilo.
12. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
13. `src/core/style/set.ts:375` `return { kind: 'change', patches, message: said };` — o tratador devolve os patches e a mensagem.
14. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
15. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
16. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
17. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/border.ts:65` `if (context === null) return { kind: 'change' };` — nenhum alvo restou no documento: `change` sem mudança; restou: segue.
- R2 `src/core/style/border.ts:66` `const target = corners === 'all' ? 'border-radius' : ` — `corners` `all`: escreve o composto `border-radius`; um canto: escreve o longhand daquele canto (`border-top-left-radius` e os demais).
- R3 `src/core/style/border.ts:68` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(target, context.rules), value }) };` — valor que o raio não toma, ou o navegador não aceita: recusa `status.value.invalid`; tomado: escreve.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/border.ts:63`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o raio escrito fica na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo do raio passa a exibir o valor.
- **DOM do canvas:** o iframe desenha o elemento com o raio novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:407` `'style.setRadius': setRadiusCommand,` — as portas entregam os mesmos `corners` e `value` ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/border.ts:69`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/border.ts:69`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/border.ts:63`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
