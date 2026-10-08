# TRC-style.setBorder
- **Chamada:** `src/app/commands.ts:406` `'style.setBorder': setBorderCommand,`
- **Argumentos:** `{ sides: enum[all|top|right|bottom|left], width?: string, style?: string, color?: color, targets?: nodes }` — como o manifesto declara (`manifest/commands/style.json:6103` `"id": "style.setBorder",`).
- **Ramos que dependem dos argumentos:** R2 (um aspecto vazio não entra), R3 (o valor de um aspecto não tomado), R5 (o `sides` escolhe a via inteira ou um lado).

## Passos
1. `src/app/commands.ts:406` `'style.setBorder': setBorderCommand,` — a tabela liga o id ao tratador.
2. `src/editor/shell/field.tsx:989` `(store.dispatch as Dispatch)(entry.command.id, same ? args : { ...args, targets: [...targets] }, context);` — o campo da borda entrega a intenção, com os alvos onde foi digitado.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `editableSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/border.ts:35` `export const setBorderCommand = registerHandler('style.setBorder', (asked, args) => {` — o tratador recebe o contexto e os argumentos.
8. `src/core/style/border.ts:36` `const context = withTargets(asked, args.targets);` — o contexto passa a nomear os alvos [lê: EST-L01-030 via withTargets].
9. `src/core/style/border.ts:38` `const given = ASPECTS.flatMap((aspect) => {` — os aspectos com texto entram na escrita.
10. `src/core/style/border.ts:44` `const target = aspectTarget(args.sides, aspect, context.rules);` — a propriedade de cada aspecto é resolvida pelo `sides` [lê: EST-L01-037 via handlerContext].
11. `src/core/style/border.ts:45` `const read = readValue(context, target, text);` — o texto de cada aspecto é lido pelo codec [lê: EST-L01-030 via readValue].
12. `src/core/style/border.ts:47` `Object.assign(values, declarationsOf(target, read, context.rules));` — os longhands de cada aspecto entram no mapa escrito.
13. `src/core/style/border.ts:50` `return writeStyle(` — a escrita vai pela via de um estilo.
14. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
15. `src/core/style/set.ts:375` `return { kind: 'change', patches, message: said };` — o tratador devolve os patches e a mensagem.
16. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
17. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/border.ts:37` `if (context === null) return { kind: 'change' };` — nenhum alvo restou no documento: `change` sem mudança; restou: segue.
- R2 `src/core/style/border.ts:40` `return typeof text === 'string' && text.trim() !== '' ? [[aspect, text.trim()] as const] : [];` — aspecto vazio ou ausente: não entra na escrita; com texto: entra.
- R3 `src/core/style/border.ts:46` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(target, context.rules), value: text }) };` — valor que o aspecto não toma, ou o navegador não aceita: recusa `status.value.invalid`; tomado: segue.
- R4 `src/core/style/border.ts:25` `if (longhand === undefined) throw new Error(` — `sides` cujo composto não tem o aspecto: lança o defeito; com longhand: escreve.
- R5 `src/core/style/border.ts:49` `if (given.length === 0) return { kind: 'change' };` — nenhum aspecto com texto: `change` sem patch; algum: escreve. O `sides` `all` escreve o composto de cada aspecto (`border-width`…); um lado escreve os longhands daquele lado.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/border.ts:35`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os longhands dos aspectos escritos ficam com os valores lidos na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo da borda passa a exibir o valor.
- **DOM do canvas:** o iframe desenha o elemento com a borda nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:406` `'style.setBorder': setBorderCommand,` — as portas do campo e da alça entregam os mesmos aspectos ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/border.ts:50`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/border.ts:50`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/border.ts:35`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
