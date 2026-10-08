# TRC-field.step
- **Chamada:** `src/app/commands.ts:426` `'field.step': stepField,`
- **Argumentos:** `{ direction: enum[up|down], size: enum[step|page], property: property, value: string, modifier?: enum[Shift|Alt] }` — o `value` é o texto que o campo guarda, mesmo vazio; o `modifier` o fator, como o manifesto declara (`manifest/commands/style.json:9654` `"id": "field.step",`).
- **Ramos que dependem dos argumentos:** R1 (o `modifier` multiplica o passo), R2 (o `size` escolhe o passo ou a página), R3 (o `value` vazio parte do valor mostrado).

## Passos
1. `src/app/commands.ts:426` `'field.step': stepField,` — a tabela liga o id ao tratador.
2. `src/editor/shell/field.tsx:324` `      (store.dispatch as Dispatch)(entry.command.id, { ...entry.door.args, property, value: input.current?.value ?? '', ...held });` — o botão de passo entrega a intenção; a roda do campo pela mesma via (`src/editor/shell/field.tsx:133` `      (store.dispatch as Dispatch)(door.command.id as CommandId, { ...door.door.args, property, value: element.value, ...(modifier === undefined ? {} : { modifier }) });`).
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/inspector/number-field.ts:82` `export const stepField = registerHandler('field.step', (context, { property, value, direction, size, modifier }) => {` — o tratador recebe o contexto e a intenção.
8. `src/editor/inspector/number-field.ts:83` `  const delta = (size === 'page' ? PAGE_STEP : STEP) * factorOf(modifier) * (direction === 'up' ? 1 : -1);` — o passo é montado pelo tamanho, o fator e a direção.
9. `src/editor/inspector/number-field.ts:70` `  const value = startOf(context, property, typed);` — o texto, vazio, parte do valor mostrado [lê: EST-L01-030 via startOf].
10. `src/editor/inspector/number-field.ts:61` `      return found === null ? '' : (storedValue(found.node, property, context.rules) ?? context.layout.computed(id as NodeId, property) ?? '');` — o valor mostrado vem do elemento ou da página [lê: EST-L01-030 via storedValue].
11. `src/editor/inspector/number-field.ts:72` `  const read = readValue(context, property, value);` — o texto é lido pelo codec [lê: EST-L01-030 via readValue].
12. `src/editor/inspector/number-field.ts:75` `  const next = read.value.number + delta * (FINE_STEP_UNITS.has(unit) ? FINE_STEP : 1);` — o número move; unidades finas movem um passo fino.
13. `src/editor/inspector/number-field.ts:78` `  const css = nextCss !== null && next < 0 && !context.css.supports(property, nextCss) ? floor : nextCss;` — abaixo de zero, onde o navegador recusa, fica em zero.
14. `src/editor/inspector/number-field.ts:79` `  return css === null ? { kind: 'change' } : writeStyle(context, property, css);` — o valor novo vira uma escrita de estilo.
15. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via run].
16. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
17. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — passos em rajada no mesmo campo e propriedade fundem num só passo [escreve: EST-L01-032 via record]; a rajada que volta ao documento de antes da entrada tira a entrada (`src/core/history/history.ts:40` `if (document !== undefined && deepEqual(applyPatches(document, merged.inverses).document, document)) return { past: history.past.slice(0, -1), future: [] };`, DEF-0508) e o passo seguinte começa uma entrada nova (`src/core/store/store.ts:533` `lastMergeable = history.past.length < before.history.past.length ? null : key;`).
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/editor/inspector/number-field.ts:83` `  const delta = (size === 'page' ? PAGE_STEP : STEP) * factorOf(modifier) * (direction === 'up' ? 1 : -1);` — `modifier` Shift ×10 e Alt ×0.1 (`src/editor/inspector/number-field.ts:49` `export function factorOf(modifier: 'Shift' | 'Alt' | undefined): number {`); nenhum: ×1.
- R2 `src/editor/inspector/number-field.ts:83` `  const delta = (size === 'page' ? PAGE_STEP : STEP) * factorOf(modifier) * (direction === 'up' ? 1 : -1);` — `size` `page`: passo de página; `step`: passo simples.
- R3 `src/editor/inspector/number-field.ts:56` `  if (value.trim() !== '') return value;` — o campo com texto: parte dele; vazio: o passo 10 lê o valor mostrado (`src/editor/inspector/number-field.ts:64` `  return shown.size === 1 ? ([...shown][0] ?? '') : '';`).
- R4 `src/editor/inspector/number-field.ts:71` `  if (value.trim() === '') return { kind: 'change' };` — nenhum valor a mover: `change` sem mudança; com: segue.
- R6 `src/core/history/history.ts:40` `if (document !== undefined && deepEqual(applyPatches(document, merged.inverses).document, document)) return { past: history.past.slice(0, -1), future: [] };` — a rajada fundida que volta ao documento de antes da entrada (seta para cima e seta para baixo): a entrada sai do histórico e a pilha de refazer fica vazia; senão a entrada fundida fica (DEF-0508).
- R5 `src/editor/inspector/number-field.ts:73` `  if (read === null || read.value.kind !== 'length') return { kind: 'refused', message: message('status.value.notSteppable', { property: propertyName(property, context.rules), value: value.trim() }) };` — texto que não é um comprimento (um keyword, calc()): recusa `status.value.notSteppable`; comprimento: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/number-field.ts:82`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, run, startOf, storedValue, readValue, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via run), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (o documento `styles`, via run, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a propriedade do detentor move um passo (fino, ou o do campo) na camada `rules.base` (`src/core/style/set.ts:351`); passos em rajada no mesmo campo fundem num só passo de desfazer, e a rajada que volta ao valor de antes não deixa passo nenhum (R6). A mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo passa a exibir o valor novo.
- **DOM do canvas:** o iframe desenha o elemento com o valor novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:426` `'field.step': stepField,` — o botão, a tecla, a roda e o arraste entregam o texto do campo, mesmo vazio, e a direção ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/inspector/number-field.ts:79`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/inspector/number-field.ts:79`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/inspector/number-field.ts:82`).

## Medições
- nenhuma — o valor mostrado de um campo vazio vem da porta Layout (`src/editor/inspector/number-field.ts:61` `      return found === null ? '' : (storedValue(found.node, property, context.rules) ?? context.layout.computed(id as NodeId, property) ?? '');`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
