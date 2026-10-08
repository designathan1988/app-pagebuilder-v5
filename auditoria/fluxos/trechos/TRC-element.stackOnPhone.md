# TRC-element.stackOnPhone
- **Chamada:** `src/app/commands.ts:392` `'element.stackOnPhone': stackOnPhoneCommand,`
- **Argumentos:** `{ tracks: property[grid-template-columns], view: property[display], axis: property[flex-direction] }` — os nomes das propriedades que os doors fixam, como o manifesto declara (`manifest/commands/style.json:11186` `"id": "element.stackOnPhone",`).
- **Ramos que dependem dos argumentos:** R4 (o `view` decide grid ou flex).

## Passos
1. `src/app/commands.ts:392` `'element.stackOnPhone': stackOnPhoneCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o mesmo caminho pela tecla do canvas e pelo menu).
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `flexOrGridContainer` é lida [lê: EST-L01-030 via run] [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/direction.ts:95` `export const stackOnPhoneCommand = registerHandler('element.stackOnPhone', (context): Outcome<never> => {` — o tratador recebe o contexto.
8. `src/core/style/direction.ts:97` `  const nodes = state.selection.map((id) => locate(state.document, id)).filter((found) => found !== null);` — os elementos escritos são achados [lê: EST-L01-030 via locate] [lê: EST-L01-031 via handlerContext].
9. `src/core/style/direction.ts:101` `  const locked = firstLockRefusal(state.document, nodes.map((found) => found.node.id as NodeId), 'status.locked.edit');` — a trava é lida [lê: EST-L01-030 via firstLockRefusal].
10. `src/core/style/direction.ts:103` `  const at = narrowest(rules);` — o breakpoint mais estreito do projeto é onde se empilha [lê: EST-L01-030 via narrowest].
11. `src/core/style/direction.ts:104` `  const layer = { breakpoint: at.id, state: rules.baseLayer.state };` — a camada escrita é a do breakpoint estreito.
12. `src/core/style/direction.ts:106` `  for (const holder of styleHolders(context, nodes)) {` — cada detentor é escrito.
13. `src/core/style/direction.ts:107` `    const asked = stackOf(holder.node, rules);` — a propriedade e o valor do empilhamento são lidos da disposição [lê: EST-L01-030 via storedValue].
14. `src/core/style/direction.ts:87` `  return display.includes('grid') ? { property: STACK.tracks ?? '', value: tracksForChildren(1, rules).columns } : { property: STACK.axis ?? '', value: 'column' };` — grid: uma trilha só; flex: a direção em coluna.
15. `src/core/style/direction.ts:108` `    if (heldAt(holder.node, asked.property, layer.breakpoint, layer.state) === asked.value) continue;` — a camada que já guarda o valor não é reescrita.
16. `src/core/style/direction.ts:109` `    patches.push(...writeDeclarations(holder.node, holder.path, layer, { [asked.property]: asked.value }));` — a declaração é escrita no detentor, no breakpoint estreito [escreve: EST-L01-030 via run].
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
18. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/direction.ts:100` `  if (primary === undefined) throw new Error('element.stackOnPhone: nothing is selected');` — seleção vazia: lança o defeito (a disponibilidade não a deixa chegar aqui); com seleção: segue.
- R2 `src/core/style/direction.ts:102` `  if (locked !== null) return { kind: 'refused', message: locked };` — elemento travado, ou dentro de um: recusa `status.locked.edit`; livre: segue.
- R3 `src/core/style/direction.ts:79` `  if (last === undefined) throw new Error('the project names no breakpoint to stack at');` — projeto sem breakpoint: lança o defeito; com: segue.
- R4 `src/core/style/direction.ts:87` `  return display.includes('grid') ? { property: STACK.tracks ?? '', value: tracksForChildren(1, rules).columns } : { property: STACK.axis ?? '', value: 'column' };` — grid: as trilhas viram uma; flex: a direção vira coluna.
- R5 `src/core/style/direction.ts:108` `    if (heldAt(holder.node, asked.property, layer.breakpoint, layer.state) === asked.value) continue;` — a camada estreita já guarda o valor: nada é escrito para esse detentor; diferente: escreve.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/direction.ts:95`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, run, locate, firstLockRefusal, narrowest, storedValue, commit), EST-L01-031 (a seleção, via run, handlerContext, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (o documento `styles` do breakpoint estreito, via run, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** cada detentor fica com uma trilha só (grid) ou com a direção em coluna (flex) no breakpoint mais estreito (`src/core/style/direction.ts:109`), em uma transação e um passo de desfazer; a mensagem é `status.stacked` ou `status.stackedMany`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; a aba do breakpoint estreito passa a mostrar a sobreposição.
- **DOM do canvas:** o iframe desenha os filhos empilhados no breakpoint estreito pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado; o comando mira o breakpoint estreito (`src/core/style/direction.ts:104`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:392` `'element.stackOnPhone': stackOnPhoneCommand,` — as portas enviam só a intenção; os nomes vêm dos doors.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/direction.ts:109`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/direction.ts:109`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/direction.ts:95`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
