# TRC-style.setBackgroundImage
- **Chamada:** `src/app/commands.ts:408` `'style.setBackgroundImage': setBackgroundImageCommand,`
- **Argumentos:** `{ property: property, value?: json, edit?: json, distance?: number, targets?: nodes }` — como o manifesto declara (`manifest/commands/style.json:7053` `"id": "style.setBackgroundImage",`). O campo do endereço manda `value`; o editor de gradiente manda `edit`.
- **Ramos que dependem dos argumentos:** R3 (o `edit` de remover o gradiente), R4 (`edit` recusado), R5 (o `value` que não é texto), R6 (o endereço), R7 (o valor não tomado).

## Passos
1. `src/app/commands.ts:408` `'style.setBackgroundImage': setBackgroundImageCommand,` — a tabela liga o id ao tratador.
2. `src/editor/shell/field.tsx:989` `(store.dispatch as Dispatch)(entry.command.id, same ? args : { ...args, targets: [...targets] }, context);` — o campo entrega a intenção, com os alvos onde foi digitado.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `editableSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/background-image.ts:25` `export const setBackgroundImageCommand = registerHandler('style.setBackgroundImage', (given, { property, value, edit, targets }) => {` — o tratador recebe o contexto e os argumentos.
8. `src/core/style/background-image.ts:26` `const context = withTargets(given, targets);` — o contexto passa a nomear os alvos [lê: EST-L01-030 via withTargets].
9. `src/core/style/background-image.ts:31` `if (edit !== undefined && edit !== null) {` — a via do editor de gradiente.
10. `src/core/style/background-image.ts:35` `if ((edit as GradientEdit).reset === true) {` — remover o gradiente.
11. `src/core/style/background-image.ts:38` `const rest = splitLayers(storedValue(primary.node, property, rules)).filter((layer) => parseGradient(layer) === null);` — as camadas sem gradiente sobram [lê: EST-L01-030 via storedValue].
12. `src/core/style/background-image.ts:46` `const edited = editedGradient(storedValue(primary.node, property, rules), edit as GradientEdit);` — o gradiente do elemento é editado [lê: EST-L01-030 via storedValue].
13. `src/core/style/background-image.ts:56` `if (typeof value !== 'string') return { kind: 'refused', message: argumentRefused('value') };` — a via do campo do endereço.
14. `src/core/style/background-image.ts:57` `const address = imageAddress(value);` — o endereço é extraído do texto.
15. `src/core/style/background-image.ts:60` `const read = readAddress(address);` — o endereço passa pela regra única.
16. `src/core/style/background-image.ts:65` `const read = readValue(context, property, text);` — o texto é lido pelo codec da propriedade [lê: EST-L01-030 via readValue].
17. `src/core/style/background-image.ts:67` `return writeStyle(context, property, read.css);` — o valor lido vira uma escrita de estilo.
18. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
20. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/background-image.ts:27` `if (context === null) return { kind: 'change' };` — nenhum alvo restou no documento: `change` sem mudança; restou: segue.
- R2 `src/core/style/background-image.ts:28` `if (typeof property !== 'string') throw new Error('style.setBackgroundImage: a door hands the property it edits');` — `property` que não é texto: lança o defeito; texto: segue.
- R3 `src/core/style/background-image.ts:39` `if (rest.length === 0) return removeStyle(context, property);` — sem camada restante: a declaração inteira é removida; com camadas: escreve o resto (`src/core/style/background-image.ts:42` `return writeStyle(context, property, read.css);`).
- R4 `src/core/style/background-image.ts:47` `if ('refused' in edited) {` — gradiente que não existe (`status.gradient.none`), paradas abaixo de duas (`status.gradient.minStops`) ou valor não tomado (`status.value.invalid`): recusa; editado: segue.
- R5 `src/core/style/background-image.ts:56` `if (typeof value !== 'string') return { kind: 'refused', message: argumentRefused('value') };` — `value` que não é texto: recusa nomeando o argumento; texto: segue.
- R6 `src/core/style/background-image.ts:61` `if (!read.ok) return { kind: 'refused', message: read.refusal };` — endereço com esquema não seguro: recusa com o motivo; endereço tomado: segue.
- R7 `src/core/style/background-image.ts:66` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, rules), value: text }) };` — texto que não é imagem, ou o navegador não aceita: recusa `status.value.invalid`; tomado: escreve.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/background-image.ts:25`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a `background-image` do detentor fica com o valor lido na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`. O gradiente removido deixa as outras camadas; sem camada, a declaração sai.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo do endereço passa a exibir o valor.
- **DOM do canvas:** o iframe desenha o elemento com a imagem nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:408` `'style.setBackgroundImage': setBackgroundImageCommand,` — o campo, o editor de gradiente e a alça entregam a mesma intenção ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/background-image.ts:67`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/background-image.ts:67`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/background-image.ts:25`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
