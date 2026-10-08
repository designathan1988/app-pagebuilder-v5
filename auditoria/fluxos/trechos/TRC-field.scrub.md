# TRC-field.scrub
- **Chamada:** `src/app/commands.ts:427` `'field.scrub': scrubField,`
- **Argumentos:** `{ property: property, value: string, distance: number, modifier?: enum[Shift|Alt] }` — o `value` é o texto que o campo guardava na pressão; o `distance` os px do arraste, como o manifesto declara (`manifest/commands/style.json:9915` `"id": "field.scrub",`).
- **Ramos que dependem dos argumentos:** R1 (o `modifier` multiplica), R2 (o `value` vazio parte do valor mostrado).

## Passos
1. `src/app/commands.ts:427` `'field.scrub': scrubField,` — a tabela liga o id ao tratador.
2. `src/editor/input/pointer/panels.ts:137` `    shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, value: press.value, distance: at.x - startX, ...(held !== null ? { modifier: held } : {}) } as never);` — o rótulo arrastado entrega a intenção a cada passo do arraste.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/inspector/number-field.ts:87` `export const scrubField = registerHandler('field.scrub', (context, { property, value, distance, modifier }) => {` — o tratador recebe o contexto e o arraste.
8. `src/editor/inspector/number-field.ts:88` `  const delta = Math.round(distance / SCRUB_PIXELS_PER_STEP) * STEP * factorOf(modifier);` — o arraste vira passos, pelo fator do modificador.
9. `src/editor/inspector/number-field.ts:89` `  return moved(context, property, value, delta);` — o passo passa à regra única do movimento.
10. `src/editor/inspector/number-field.ts:70` `  const value = startOf(context, property, typed);` — o texto, vazio, parte do valor mostrado [lê: EST-L01-030 via startOf].
11. `src/editor/inspector/number-field.ts:72` `  const read = readValue(context, property, value);` — o texto é lido pelo codec [lê: EST-L01-030 via readValue].
12. `src/editor/inspector/number-field.ts:75` `  const next = read.value.number + delta * (FINE_STEP_UNITS.has(unit) ? FINE_STEP : 1);` — o número move.
13. `src/editor/inspector/number-field.ts:79` `  return css === null ? { kind: 'change' } : writeStyle(context, property, css);` — o valor novo vira uma escrita de estilo.
14. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via run].
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
16. `src/core/store/store.ts:559` `        gesture.patches.push(...applied.applied);` — dentro do gesto do arraste, o patch entra na transação do gesto [escreve: EST-L01-030 via gesture].
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
18. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/editor/inspector/number-field.ts:88` `  const delta = Math.round(distance / SCRUB_PIXELS_PER_STEP) * STEP * factorOf(modifier);` — `modifier` Shift ×10 e Alt ×0.1 (`src/editor/inspector/number-field.ts:49` `export function factorOf(modifier: 'Shift' | 'Alt' | undefined): number {`); nenhum: ×1.
- R2 `src/editor/inspector/number-field.ts:56` `  if (value.trim() !== '') return value;` — o campo com texto: parte dele; vazio: o valor mostrado (`src/editor/inspector/number-field.ts:64` `  return shown.size === 1 ? ([...shown][0] ?? '') : '';`).
- R3 `src/editor/inspector/number-field.ts:71` `  if (value.trim() === '') return { kind: 'change' };` — nenhum valor a mover: `change` sem mudança; com: segue.
- R4 `src/editor/inspector/number-field.ts:73` `  if (read === null || read.value.kind !== 'length') return { kind: 'refused', message: message('status.value.notSteppable', { property: propertyName(property, context.rules), value: value.trim() }) };` — texto que não é um comprimento: recusa `status.value.notSteppable`; comprimento: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/number-field.ts:87`); o arraste repete o despacho a cada passo, mas cada passo roda inteiro dentro do trecho, dentro de um gesto.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, run, startOf, readValue, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via run), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (o documento `styles`, via run, applyPatches, gesture, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a propriedade do detentor move pelos passos do arraste, na camada `rules.base` (`src/core/style/set.ts:351`); os patches entram no gesto (`src/core/store/store.ts:534`) e o gesto grava um passo de desfazer ao fechar. A mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo passa a exibir o valor novo.
- **DOM do canvas:** o iframe desenha o elemento com o valor novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:427` `'field.scrub': scrubField,` — o arraste do rótulo entrega o texto do campo, mesmo vazio, e a distância ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/inspector/number-field.ts:79`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/inspector/number-field.ts:79`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/inspector/number-field.ts:87`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
