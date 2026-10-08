# TRC-element.swapDirection
- **Chamada:** `src/app/commands.ts:391` `'element.swapDirection': swapDirectionCommand,`
- **Argumentos:** `{ flow: property[grid-auto-flow], view: property[display], axis: property[flex-direction] }` — os nomes das propriedades que os doors da própria ordem fixam, como o manifesto declara (`manifest/commands/style.json:11004` `"id": "element.swapDirection",`).
- **Ramos que dependem dos argumentos:** R3 (o `view` decide grid, flex ou nenhum).

## Passos
1. `src/app/commands.ts:391` `'element.swapDirection': swapDirectionCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o mesmo caminho pela tecla do canvas e pelo menu de contexto).
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `flexOrGridContainer` é lida [lê: EST-L01-030 via run] [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/direction.ts:34` `export const swapDirectionCommand = registerHandler('element.swapDirection', (context): Outcome<never> => {` — o tratador recebe o contexto.
8. `src/core/style/direction.ts:36` `  const nodes = state.selection.map((id) => locate(state.document, id)).filter((found) => found !== null);` — os elementos escritos são achados [lê: EST-L01-030 via locate] [lê: EST-L01-031 via handlerContext].
9. `src/core/style/direction.ts:40` `  const asked = laysOut(primary.node, rules);` — a propriedade e o valor oposto são lidos da disposição do elemento.
10. `src/core/style/direction.ts:62` `  const display = storedValue(node, DISPLAY, rules);` — o `display` do elemento é lido pelo nome que o door carrega [lê: EST-L01-030 via storedValue].
11. `src/core/style/direction.ts:66` `    return { property: FLOW, value: flow.includes('column') ? flow.replace('column', 'row') : flow.replace('row', 'column') };` — grid: o `grid-auto-flow` vira o oposto de linha e coluna.
12. `src/core/style/direction.ts:70` `    return { property: DIRECTION, value: OPPOSITE[direction] ?? 'column' };` — flex: o `flex-direction` vira o oposto de um quarto de volta.
13. `src/core/style/direction.ts:42` `  const written = writeStyle(context, asked.property, asked.value);` — o valor oposto vira uma escrita de estilo.
14. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via run].
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
16. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
18. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/direction.ts:39` `  if (primary === undefined) throw new Error('element.swapDirection: nothing is selected');` — seleção vazia: lança o defeito (a disponibilidade não a deixa chegar aqui); com seleção: segue.
- R2 `src/core/style/direction.ts:41` `  if (asked === null) return { kind: 'refused', message: message('status.swap.notContainer', { name: primary.node.name }) };` — o `display` não dispõe filhos: recusa `status.swap.notContainer`; dispõe: segue.
- R3 `src/core/style/direction.ts:64` `  if (display.includes('grid')) {` — grid: o `grid-auto-flow`; flex (`src/core/style/direction.ts:68` `  if (display.includes('flex')) {`): o `flex-direction`; nenhum: `null` do passo 11 e a recusa do ramo R2.
- R4 `src/core/style/direction.ts:43` `  if (written.kind !== 'change') return written;` — a escrita não mudou nada (ou foi recusada): devolve-a; mudou: segue para a mensagem.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/direction.ts:34`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, run, locate, storedValue, commit), EST-L01-031 (a seleção, via run, handlerContext, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (o documento `styles`, via run, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a disposição do detentor fica com o valor oposto na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é `status.swapped` ou `status.swappedMany`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem.
- **DOM do canvas:** o iframe desenha os filhos na direção nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:391` `'element.swapDirection': swapDirectionCommand,` — as portas enviam só a intenção; os nomes das propriedades vêm dos doors.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/direction.ts:43`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/direction.ts:43`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/direction.ts:34`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
