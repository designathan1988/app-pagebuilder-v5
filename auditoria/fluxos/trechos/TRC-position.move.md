# TRC-position.move
- **Chamada:** `src/app/commands.ts:326` `'position.move': movePositionedCommand,`
- **Argumentos:** `{ dx, dy, modifier? }` — `dx` e `dy` são números obrigatórios (o deslocamento em px de página), `modifier` um enum `Shift`, `Ctrl` opcional, como o manifesto declara (`manifest/commands/geometry.json:443` `"dx": {`).
- **Ramos que dependem dos argumentos:** R3 e R4 (o `dx`/`dy` decide o deslocamento e a mensagem).

## Passos
1. `src/app/commands.ts:326` `'position.move': movePositionedCommand,` — a tabela de comandos liga o id ao tratador.
2. `src/editor/input/pointer/resize.ts:73` `shared.open.dispatch(FREE_DRAG.command.id as CommandId, { ...FREE_DRAG.door.args, dx, dy } as never);` — o arraste livre entrega `dx` e `dy` a cada movimento do ponteiro.
3. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — as setas do contexto `canvas-positioned` entregam `dx`/`dy` iguais a `-1`, `0` ou `1`.
4. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor capta o contexto [lê: EST-L05a-001 via beforeCommand].
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `positionedSelection` é testada.
7. `src/core/geometry/position.ts:63` `return nodes.length > 0 && nodes.every((node) => node !== undefined && valuePredicateHolds(node, POSITIONED, rules, state.document.classes));` — todo elemento selecionado é `absolute` ou `fixed` [lê: EST-L01-030 via valuePredicateHolds].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
9. `src/core/geometry/position.ts:106` `export const movePositionedCommand = registerHandler('position.move', (context, { dx, dy }) => {` — o tratador recebe o contexto e os dois deslocamentos.
10. `src/core/geometry/position.ts:108` `const roots = selectionRoots(state.document, state.selection);` — as raízes da seleção são achadas [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots].
11. `src/core/geometry/position.ts:111` `const locked = firstLockRefusal(state.document, roots.map((at) => at.node.id as NodeId), 'status.locked.move');` — a trava é lida em ordem [lê: EST-L01-030 via firstLockRefusal].
12. `src/core/geometry/position.ts:115` `for (const at of roots) {` — cada raiz é movida.
13. `src/core/geometry/position.ts:116` `const moved = movedInsets(at.node, rules, measuredPlace(context as HandlerContext<unknown>, at.node), dx, dy);` — os insets que movem o elemento são calculados [lê: EST-L01-030 via movedInsets].
14. `src/core/geometry/position.ts:75` `return layout.place(node.id as NodeId, within) as Readonly<Record<string, number>> | null;` — onde o elemento está agora vem do porto de layout [lê: EST-L01-030 via layout.place].
15. `src/core/geometry/position.ts:93` `writes[end] = `${Math.round(from(end) - delta)}px`;` — cada eixo passa pelo inset a que o elemento está ancorado, em px inteiros.
16. `src/core/geometry/position.ts:118` `patches.push(...writeDeclarations(at.node, at.path, rules.base, moved.writes));` — as declarações são escritas na camada ativa [escreve: EST-L01-030 via writeDeclarations].
17. `src/core/geometry/position.ts:120` `return { kind: 'change', patches, message: message('status.position.moved', { name: primary.node.name, parent: primary.parent?.name ?? '', x: shown.x, y: shown.y }) };` — o tratador devolve os patches e a mensagem com as coordenadas.
18. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
19. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a rajada de teclas ou o arraste grava um passo (a coalescência por `target-and-property` dentro de `history.nudgeBurstWindow`) [escreve: EST-L01-032 via record]; a rajada que volta ao documento de antes da entrada (um empurrão para a direita e outro para a esquerda) tira a entrada (`src/core/history/history.ts:40` `if (document !== undefined && deepEqual(applyPatches(document, merged.inverses).document, document)) return { past: history.past.slice(0, -1), future: [] };`, DEF-0508) e o empurrão seguinte começa uma entrada nova (`src/core/store/store.ts:533` `lastMergeable = history.past.length < before.history.past.length ? null : key;`).
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/store/store.ts:417` `const declared = message((command.availability.refusalKey ?? 'common.notAvailableYet') as Message['key']);` — nenhum selecionado é posicionado: a store recusa com `status.position.notPositioned` e o tratador não roda; posicionado: segue para o passo 8.
- R2 `src/core/geometry/position.ts:110` `if (primary === undefined) return { kind: 'change' };` — sem raízes: `change` sem patch; com raízes: segue.
- R3 `src/core/geometry/position.ts:112` `if (locked !== null) return { kind: 'refused', message: locked };` — alguma raiz travada: recusa `status.locked.move`; livres: segue para o passo 12.
- R4 `src/core/geometry/position.ts:92` `if (set(end) && !set(start)) {` — só o inset final (`right`/`bottom`) está posto: move por ele; senão, o passo 98 escreve o inset inicial (`left`/`top`).
- R5 `src/core/geometry/position.ts:91` `const from = (property: string) => pixels(storedValue(node, property, rules)) ?? place?.[property] ?? 0;` — o valor em px do inset, senão onde o elemento está agora; sem medida, zero.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/geometry/position.ts:106` `export const movePositionedCommand = registerHandler('position.move', (context, { dx, dy }) => {`); o arraste repete o despacho, mas cada passo roda inteiro dentro do trecho.

## Estado
- Lê: EST-L01-030 (o documento e as regras, via argumentRefusal, valuePredicateHolds, selectionRoots, firstLockRefusal, movedInsets, layout.place), EST-L01-031 (a seleção, via selectionRoots, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`, via writeDeclarations, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os insets de cada raiz mudam em px inteiros (`src/core/geometry/position.ts:98` `writes[start] = `${next}px`;`); a mensagem é `status.position.moved`. Uma rajada de empurrões que volta ao lugar de antes não deixa passo de desfazer (DEF-0508).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem com o elemento e as coordenadas (`src/core/geometry/position.ts:120`).
- **DOM do canvas:** o iframe desenha o elemento na posição nova pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/position.ts:118`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:326` `'position.move': movePositionedCommand,` — o arraste (`src/editor/input/pointer/resize.ts:73`) e as setas (`src/editor/input/keymap.ts:531`) chamam o mesmo tratador com a mesma forma de intenção `dx`/`dy`.
- G4: n/a — o trecho não desenha painel nem barra sobre o canvas (`src/core/geometry/position.ts:120`).
- G5: n/a — o trecho não altera a geometria de painel nem de barra (`src/core/geometry/position.ts:118`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/geometry/position.ts:106`).

## Medições
- nenhuma — o trecho não chama API de medida; a posição atual do elemento chega pelo porto de layout (`src/core/ports/layout.ts:18` `place(node: NodeId, within: 'parent' | 'viewport'): Place | null;`).
