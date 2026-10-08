# TRC-style.set
- **Chamada:** `src/app/commands.ts:389` `'style.set': setStyleCommand,`
- **Argumentos:** `{ property: property, value: string, targets?: nodes }` — `property` é o tipo `property` (obrigatório), `value` texto (obrigatório) e `targets` lista de nós opcional, como o manifesto declara (`manifest/commands/style.json:5` `"id": "style.set",`).
- **Ramos que dependem dos argumentos:** R2 (o valor de `targets`), R3 (a `property` de uma receita), R4 (o `value` não tomado pela propriedade).

## Passos
1. `src/app/commands.ts:389` `'style.set': setStyleCommand,` — a tabela liga o id ao tratador.
2. `src/editor/shell/field.tsx:564` `(store.dispatch as Dispatch)(command, same ? { property, value } : { property, value, targets: [...targets] }, context);` — o campo entrega a intenção, com os alvos onde foi digitado.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `editableSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador no contexto capturado.
7. `src/core/style/set.ts:397` `export const setStyleCommand = registerHandler('style.set', (given, { property, value, targets }) => {` — o tratador recebe o contexto e os argumentos.
8. `src/core/style/set.ts:399` `const context = withTargets(given, targets);` — o contexto passa a nomear os alvos [lê: EST-L01-030 via withTargets].
9. `src/core/style/set.ts:393` `const named = targets.filter((id): id is string => typeof id === 'string' && locate(given.state.document, id as NodeId) !== null);` — só sobram os alvos ainda no documento [lê: EST-L01-030 via locate].
10. `src/core/style/set.ts:403` `const recipe = context.rules.recipeFacts.get(property);` — uma receita é procurada para a propriedade [lê: EST-L01-037 via handlerContext].
11. `src/core/style/set.ts:409` `return writePropertyText(context, property, value);` — o texto é escrito pela via de uma propriedade inteira.
12. `src/core/style/set.ts:382` `const read = readValue(context, property, value);` — o texto é lido pelo codec da propriedade [lê: EST-L01-030 via readValue].
13. `src/core/style/set.ts:384` `return writeStyle(context, property, read.css, longhandValues(property, read.value, context.rules));` — o valor lido vira uma escrita de estilo.
14. `src/core/style/set.ts:306` `const nodes = state.selection.map((id) => locate(state.document, id)).filter((found) => found !== null);` — os elementos escritos são achados [lê: EST-L01-030 via locate].
15. `src/core/style/set.ts:309` `const locked = firstLockRefusal(state.document, nodes.map((found) => found.node.id as NodeId), 'status.locked.edit');` — a trava é lida [lê: EST-L01-030 via firstLockRefusal].
16. `src/core/style/set.ts:313` `const recorded = recordStyleWrite(context, primary.node, property, css, longhands ?? { [property]: css });` — a Timeline gravando, o valor vira quadro-chave [lê: EST-L01-030 via recordStyleWrite].
17. `src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;` — a camada escrita é a que o editor mostra [lê: EST-L01-037 via handlerContext].
18. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
19. `src/core/style/set.ts:375` `return { kind: 'change', patches, message: said };` — o tratador devolve os patches e a mensagem.
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
21. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história, fundido quando cabe [escreve: EST-L01-032 via record].
22. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
23. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/set.ts:398` `if (typeof property !== 'string' || typeof value !== 'string') throw new Error('style.set: a door hands a property and the text of its value');` — argumento que não é texto: lança o defeito (a store o relata em `status.change.failed`); texto: segue para o passo 9.
- R2 `src/core/style/set.ts:400` `if (context === null) return { kind: 'change' as const };` — nenhum alvo restou no documento: `change` sem mudança; restou: segue.
- R3 `src/core/style/set.ts:407` `if (clash !== undefined) return { kind: 'refused', message: message('status.recipe.conflict', { recipe: propertyName(property, context.rules), property: propertyName(clash.property, context.rules) }) };` — receita que colide com declaração própria do elemento: recusa `status.recipe.conflict`; sem colisão: segue.
- R4 `src/core/style/set.ts:383` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, context.rules), value }) };` — valor que a propriedade não toma, ou o navegador não aceita: recusa `status.value.invalid`; tomado: escreve. Os longhands escritos sozinhos (`background-position-x` e `-y`, `grid-column-start` e os outros três lados da grade, `transition-property`, `transition-behavior`) têm codec registrado (`src/core/style/codecs.ts:681` `const positionAxis = registerCodec('position-axis', { read: (text, facts) => lengthPercentage.read(text, facts), write: (value) => lengthPercentage.write(value) });`, `src/core/style/codecs.ts:669` `const gridLine = registerCodec('grid-line', { read: (text, facts) => (text.includes('/') ? null : cssText(text, facts)), write: writeCssText });`, `src/core/style/codecs.ts:670` `const propertyList = registerCodec('property-list', { read: cssText, write: writeCssText });`, `src/core/style/codecs.ts:671` `const keywordList = registerCodec('keyword-list', {`) e seguem este mesmo ramo; antes do DEF-0509 todo valor deles caía na recusa.
- R5 `src/core/style/set.ts:308` `if (primary === undefined) return { kind: 'change' };` — seleção vazia: `change` sem patch; com seleção: segue.
- R6 `src/core/style/set.ts:310` `if (locked !== null) return { kind: 'refused', message: locked };` — elemento travado, ou dentro de um: recusa `status.locked.edit`; livre: segue.
- R7 `src/core/style/set.ts:314` `if (recorded !== null) return recorded;` — a Timeline gravando: o valor entra num quadro-chave; fora dela: segue.
- R8 `src/core/style/set.ts:320` `if (keyframe !== null && primary !== undefined && keyframe.node === primary.node.id) {` — o playhead sobre um quadro-chave do elemento principal: escreve as declarações do quadro (`src/core/style/set.ts:322` `const patches = writeKeyframeDeclarations(primary.node, primary.path, keyframe.animation, keyframe.keyframe, values);`); senão: segue.
- R9 `src/core/style/set.ts:333` `if (misplaced !== null) return { kind: 'refused', message: misplaced };` — o estado editado não vale para todo elemento escrito: recusa; vale: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/set.ts:397` `export const setStyleCommand = registerHandler('style.set', (given, { property, value, targets }) => {`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** cada elemento escrito tem a propriedade com o valor novo na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é `status.style.set`, `status.style.setMany` ou `status.style.setComponent`. A seleção e o `ui` não mudam (`src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo do inspector passa a exibir o valor.
- **DOM do canvas:** o iframe desenha o elemento com o estilo novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada e a classe do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:389` `'style.set': setStyleCommand,` — toda porta (o Enter do campo, o passo, o scrub, o menu de unidade) entrega o texto e a direção ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/set.ts:375`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/set.ts:375`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/set.ts:397`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; a leitura do valor usa o codec do próprio documento.
