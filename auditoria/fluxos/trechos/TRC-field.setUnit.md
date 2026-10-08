# TRC-field.setUnit
- **Chamada:** `src/app/commands.ts:428` `'field.setUnit': setFieldUnit,`
- **Argumentos:** `{ property: property, value: string, unit: string }` — o `value` é o texto que o campo guarda e o `unit` a unidade escolhida no menu, como o manifesto declara (`manifest/commands/style.json:9986` `"id": "field.setUnit",`).
- **Ramos que dependem dos argumentos:** R1 (a `unit` de um keyword é o valor), R2 (o `value` que não é comprimento), R3 (a unidade que o navegador não mede).

## Passos
1. `src/app/commands.ts:428` `'field.setUnit': setFieldUnit,` — a tabela liga o id ao tratador.
2. `src/editor/shell/field.tsx:415` `    (store.dispatch as Dispatch)(entry.command.id, { ...entry.door.args, property, value: input.current?.value || shown, unit });` — o menu de unidade entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/inspector/number-field.ts:92` `export const setFieldUnit = registerHandler('field.setUnit', (context, { property, value, unit }) => {` — o tratador recebe o contexto e a unidade.
8. `src/editor/inspector/number-field.ts:94` `  const chosen = readValue(context, property, unit);` — a unidade é lida como um valor da propriedade [lê: EST-L01-030 via readValue].
9. `src/editor/inspector/number-field.ts:96` `  if (chosen?.value.kind === 'keyword') return writeStyle(context, property, chosen.css);` — um keyword (auto, min-content) escrito como ele é.
10. `src/editor/inspector/number-field.ts:97` `  const read = readValue(context, property, value);` — o texto do campo é lido pelo codec [lê: EST-L01-030 via readValue].
11. `src/editor/inspector/number-field.ts:99` `  const converted = measuredConversion(context, property, read.value, unit);` — o comprimento é convertido para a unidade escolhida.
12. `src/editor/inspector/number-field.ts:124` `  const root = context.layout.fontPx(null);` — uma unidade medida (rem, em, %) usa o tamanho de fonte que a página calcula [lê: EST-L01-030 via layout].
13. `src/editor/inspector/number-field.ts:100` `  const css = converted === null ? null : writeValue(property, { kind: 'length', number: converted, unit }, context.rules);` — o comprimento convertido vira CSS.
14. `src/editor/inspector/number-field.ts:102` `  const again = css === null ? null : readValue(context, property, css);` — o convertido é relido, para a propriedade oferecê-lo e o navegador tomá-lo [lê: EST-L01-030 via readValue].
15. `src/editor/inspector/number-field.ts:103` `  return again === null ? refused : writeStyle(context, property, again.css);` — relido: escreve; senão: recusa.
16. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via run].
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
18. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/editor/inspector/number-field.ts:96` `  if (chosen?.value.kind === 'keyword') return writeStyle(context, property, chosen.css);` — a `unit` é um keyword da propriedade: é escrita como valor; é uma unidade: segue.
- R2 `src/editor/inspector/number-field.ts:98` `  if (read === null || read.value.kind !== 'length') return refused;` — o `value` não é um comprimento: recusa `status.value.unitNotConverted`; é: segue.
- R3 `src/editor/inspector/number-field.ts:122` `  if (to !== 'rem' && property !== fontProperty(context.rules)) return null;` — em e % fora de um tamanho de fonte, ou uma unidade que a página não mede: a conversão é nula (`src/editor/inspector/number-field.ts:119` `  if (to !== 'rem' && to !== 'em' && to !== '%') return convertLength(value, to);`); medida: converte sem mudar o tamanho.
- R4 `src/editor/inspector/number-field.ts:103` `  return again === null ? refused : writeStyle(context, property, again.css);` — o convertido não é tomado: recusa `status.value.unitNotConverted`; tomado: escreve.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/number-field.ts:92`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, run, readValue, layout, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via run), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (o documento `styles`, via run, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a propriedade do detentor fica com o mesmo tamanho na unidade escolhida (`src/editor/inspector/number-field.ts:103`), na camada `rules.base`, em uma transação e um passo de desfazer; um keyword é escrito como ele é. A mensagem é a de `writeStyle`, ou `status.value.unitNotConverted`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo passa a exibir o valor na unidade nova.
- **DOM do canvas:** o iframe desenha o elemento com o mesmo tamanho pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:428` `'field.setUnit': setFieldUnit,` — o menu de unidade entrega o mesmo texto e a mesma unidade ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/inspector/number-field.ts:103`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/inspector/number-field.ts:103`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/inspector/number-field.ts:92`).

## Medições
- nenhuma — o tamanho de fonte da página vem da porta Layout (`src/editor/inspector/number-field.ts:126` `  const parentFont = parent === null ? null : context.layout.fontPx(parent.id as NodeId);`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
