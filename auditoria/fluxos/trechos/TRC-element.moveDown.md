# TRC-element.moveDown
- **Chamada:** `src/app/commands.ts:371` `'element.moveDown': moveDownCommand,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:560` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `canMoveDown` (`manifest/commands/structure.json:562` `"predicate": "canMoveDown",`). [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'element.moveDown'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/move.ts:316` `export const moveDownCommand = registerHandler('element.moveDown', ({ state }): Outcome<never> => move(state.document, state.selection, 'down'));` — o tratador chama a regra única com a direção `'down'`. [lê: EST-L01-030 via move] [lê: EST-L01-031 via move]
5. `src/core/structure/move.ts:289` `const roots = selectionRoots(document, selection);` — as raízes da seleção. [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots]
6. `src/core/structure/move.ts:294` `const refused = moveRefusal(document, selection, direction);` — a recusa de antes de escrever. [lê: EST-L01-030 via moveRefusal] [lê: EST-L01-031 via moveRefusal]
7. `src/core/structure/move.ts:295` `if (refused !== null) return { kind: 'refused', message: refused };` — recusa antes de escrever: recusa.
8. `src/core/structure/move.ts:296` `const parent = first.parent;` — o pai comum das raízes.
9. `src/core/structure/move.ts:298` `const edge = message(direction === 'up' ? 'status.move.alreadyFirst' : 'status.move.alreadyLast', { parent: parent.name });` — o recado de borda é `status.move.alreadyLast`.
10. `src/core/structure/move.ts:300` `const locked = firstLockRefusal(document, roots.map((r) => r.node.id), 'status.locked.move');` — raiz trancada recusa. [lê: EST-L01-030 via firstLockRefusal]
11. `src/core/structure/move.ts:302` `const { patches, moved } = shiftAmongSiblings(parent, first.path.slice(0, -2), new Set(roots.map((r) => r.node.id)), direction);` — os remendos que passam cada selecionado por um lugar. [escreve: EST-L01-030 via run]
12. `src/core/structure/move.ts:248` `  if (direction === 'down') indexes.reverse();` — na direção `down` a caminhada começa do último filho.
13. `src/core/structure/move.ts:303` `if (patches.length === 0) return { kind: 'refused', message: edge };` — nada move: recusa de borda.
14. `src/core/structure/move.ts:310` `        ? message('status.moved', { name: first.node.name, position: only + 1, count: parent.children.length, parent: parent.name })` — um movido: `status.moved` com a posição; vários: `src/core/structure/move.ts:311` `        : message('status.movedMany', { count: roots.length, parent: parent.name }),` conta.
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os remendos. [escreve: EST-L01-030 via applyPatches]
16. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — o resultado não leva seleção, então ela fica. [lê: EST-L01-031 via run]
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
18. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção são validados.
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/move.ts:270` `  if (first === undefined) return message('refusal.nothingSelected');` — seleção vazia: recusa; com raiz: segue.
- R2 `src/core/structure/move.ts:272` `  if (roots.some((r) => r.parent !== parent)) return message('status.wrap.needsSameParent');` — raízes de pais diferentes: recusa; senão, segue.
- R3 `src/core/structure/move.ts:275` `  if (parent === null) return edge;` — a raiz da página está já no fim: recusa de borda; senão, segue.
- R4 `src/core/structure/move.ts:282` `  return blocked ? edge : null;` — os selecionados juntos contra a borda não movem (`edge`); separados, movem (`null`).
- R5 `src/core/structure/move.ts:301` `if (locked !== null) return { kind: 'refused', message: locked };` — raiz trancada: recusa; senão, segue.
- R6 `src/core/structure/move.ts:303` `if (patches.length === 0) return { kind: 'refused', message: edge };` — nenhum remendo (nada muda): recusa de borda; senão, aplica.
- R7 `src/core/structure/move.ts:252` `    if (node === undefined || other === undefined || !selected.has(node.id) || selected.has(other.id)) continue;` — o selecionado passa pelo irmão não selecionado; dois selecionados juntos nunca se passam.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/move.ts:316`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, move, selectionRoots, moveRefusal, firstLockRefusal, commit), EST-L01-031 (a seleção, via handlerContext, move, selectionRoots, moveRefusal, commit, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-033 (a mensagem, via publish)

## Resultado
- **Estado final:** EST-L01-030 com os selecionados um lugar abaixo, sem deixar o pai (`src/core/structure/move.ts:256`), EST-L01-031 com a seleção como estava (`src/core/store/store.ts:499`) e EST-L01-033 com a mensagem de `src/core/structure/move.ts:308`.
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas reordena as linhas movidas.
- **DOM do canvas:** os nós trocam de lugar pela lista de remendos que `src/core/store/store.ts:542` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado (`at`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/core/structure/move.ts:316` `export const moveDownCommand = registerHandler('element.moveDown', ({ state }): Outcome<never> => move(state.document, state.selection, 'down'));` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; devolve remendos (`src/core/structure/move.ts:256`).
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/move.ts:305`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/move.ts:316`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve remendos (`src/core/structure/move.ts:256`).
