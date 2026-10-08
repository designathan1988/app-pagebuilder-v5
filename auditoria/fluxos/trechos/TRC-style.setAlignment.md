# TRC-style.setAlignment
- **Chamada:** `src/app/commands.ts:421` `'style.setAlignment': setAlignmentCommand,`
- **Argumentos:** `{ x: enum[start|center|end], y: enum[start|center|end] }` — a célula da matriz que a pessoa preme, como o manifesto declara (`manifest/commands/style.json:9329` `"id": "style.setAlignment",`).
- **Ramos que dependem dos argumentos:** R1 (o `x` e o `y` escolhem o valor de cada longhand).

## Passos
1. `src/app/commands.ts:421` `'style.setAlignment': setAlignmentCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta da matriz entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `flexOrGridContainer` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/alignment.ts:23` `export const setAlignmentCommand = registerHandler(` — o tratador recebe o contexto e a célula.
8. `src/core/style/alignment.ts:27` `const matrix = rules.compositeFacts.get(MATRIX);` — o composto da matriz é procurado [lê: EST-L01-037 via handlerContext].
9. `src/core/style/alignment.ts:28` `const [justify, align] = matrix?.longhands ?? [];` — os longhands da matriz são os dois eixos.
10. `src/core/style/alignment.ts:30` `const values = { [justify]: PLACE[x], [align]: PLACE[y] };` — a célula vira o valor de cada longhand.
11. `src/core/style/alignment.ts:31` `const outcome = writeStyle(context, MATRIX,` — a escrita vai pela via de um estilo.
12. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
13. `src/core/style/alignment.ts:33` `if (outcome.kind !== 'change' || primary === null) return outcome;` — sem mudança, ou sem principal: devolve o resultado; com: segue.
14. `src/core/style/alignment.ts:35` `const written = coupled(primary.node, primary.parent, values, MATRIX, rules);` — os valores que as couplings fazem são lidos para a mensagem [lê: EST-L01-030 via coupled].
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
16. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
18. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/alignment.ts:29` `if (justify === undefined || align === undefined) throw new Error('properties.json: the alignment matrix writes justify-content and align-items');` — a matriz sem os dois longhands: lança o defeito; com: segue.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o elemento não é contêiner flex ou grid: recusa `status.layout.notFlex`; é: segue.
- R3 `src/core/style/alignment.ts:33` `if (outcome.kind !== 'change' || primary === null) return outcome;` — a escrita não mudou nada, ou não há principal: devolve o resultado sem mensagem própria; mudou: segue para o passo 14.
- R4 `src/core/style/alignment.ts:30` `const values = { [justify]: PLACE[x], [align]: PLACE[y] };` — a célula `start`/`center`/`end` vira `flex-start`/`center`/`flex-end` em cada eixo; a direção invertida da couplings espelha os valores.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/alignment.ts:23`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** `justify-content` e `align-items` do detentor ficam com os valores da célula na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é `status.alignment.set` com os valores depois das couplings.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; a célula prensada fica marcada.
- **DOM do canvas:** o iframe desenha o elemento com os filhos alinhados de novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:421` `'style.setAlignment': setAlignmentCommand,` — as portas da matriz entregam o mesmo `x` e `y` ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/alignment.ts:36`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/alignment.ts:36`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/alignment.ts:23`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
