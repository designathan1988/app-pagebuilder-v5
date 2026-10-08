# TRC-element.nestIntoPrevious
- **Chamada:** `src/app/commands.ts:377` `'element.nestIntoPrevious': nestIntoPreviousCommand,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:1073` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `canNestIntoPrevious` (`manifest/commands/structure.json:1075` `"predicate": "canNestIntoPrevious",`). [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'element.nestIntoPrevious'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/move.ts:201` `export const nestIntoPreviousCommand = registerHandler('element.nestIntoPrevious', ({ state, rules, layout }): Outcome<never> => {` — o tratador recebe o estado, as regras e a porta de layout. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext]
5. `src/core/structure/move.ts:202` `  const receiver = previousContainer(state, rules);` — o irmão anterior que é contêiner. [lê: EST-L01-030 via previousContainer] [lê: EST-L01-031 via previousContainer]
6. `src/core/structure/move.ts:177` `  if (only === undefined || others.length > 0) return null;` — mais de um selecionado ou nenhum: sem receptor.
7. `src/core/structure/move.ts:204` `  if (receiver === null) throw new Error('element.nestIntoPrevious: the selection has no previous container');` — sem receptor, defeito da store (a disponibilidade guarda a porta).
8. `src/core/structure/move.ts:205` `  return moveSelectionTo(state, rules, layout, receiver.id, receiver.children.length);` — a regra única de movimento leva o selecionado para o fim do receptor. [lê: EST-L01-030 via moveSelectionTo] [lê: EST-L01-031 via moveSelectionTo]
9. `src/core/structure/move.ts:85` `const moved = selectionRoots(state.document, state.selection);` — as raízes da seleção. [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots]
10. `src/core/structure/move.ts:96` `const locked = firstLockRefusal(state.document, roots, 'status.locked.move') ?? lockRefusal(state.document, parent, 'status.locked.insert');` — nó ou receptor trancado recusa. [lê: EST-L01-030 via firstLockRefusal]
11. `src/core/structure/move.ts:101` `const refused = placementRefusal(state.document, rules, parent, moved.map((at) => at.node), new Set(moved.filter((at) => at.parent?.id === parent).map((at) => at.node.id)));` — a regra de onde elementos podem entrar. [lê: EST-L01-030 via placementRefusal]
12. `src/core/structure/move.ts:122` `    patches.push({ op: 'add', path: [...target.path, 'children', start + i], value: at.node });` — o nó chega no fim do receptor. [escreve: EST-L01-030 via run]
13. `src/core/structure/move.ts:168` `  return { kind: 'change', patches, selection: roots, message: said };` — o resultado leva os remendos, a seleção de volta nas raízes e o recado. [escreve: EST-L01-030 via run] [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]
14. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os remendos. [escreve: EST-L01-030 via applyPatches]
15. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção do resultado é a do tratador. [escreve: EST-L01-031 via run]
16. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
17. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção são validados.
18. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/move.ts:177` `  if (only === undefined || others.length > 0) return null;` — mais de um selecionado ou nenhum: sem receptor; um só: segue.
- R2 `src/core/structure/move.ts:180` `  return previous !== undefined && rules.elements.get(previous.type)?.content === 'children' ? previous : null;` — o irmão anterior é contêiner: ele é o receptor; senão `null` e a disponibilidade recusa com `status.nest.noPrevious` (`src/core/structure/move.ts:197` `    return (receiver === null ? null : nestRefusal(state, receiver)) ?? message('status.nest.noPrevious');`).
- R3 `src/core/structure/move.ts:186` `  return node === undefined ? null : instanceMoveRefusal(state.document, [node], receiver.id as NodeId);` — a peça dentro da instância recusa antes (`src/core/structure/move.ts:193` `    return receiver !== null && nestRefusal(state, receiver) === null;`); senão segue.
- R4 `src/core/structure/move.ts:97` `  if (locked !== null) return { kind: 'refused', message: locked };` — nó ou receptor trancado: recusa; senão, segue.
- R5 `src/core/structure/move.ts:155` `if (JSON.stringify(applyPatches(state.document, patches).document) === JSON.stringify(state.document)) return { kind: 'change', selection: roots };` — o nó já no fim do receptor: nada muda; senão, os remendos entram.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/move.ts:201`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, previousContainer, moveSelectionTo, selectionRoots, firstLockRefusal, placementRefusal, commit), EST-L01-031 (a seleção, via handlerContext, previousContainer, moveSelectionTo, selectionRoots, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via run, publish)

## Resultado
- **Estado final:** EST-L01-030 com o selecionado no fim do irmão anterior (`src/core/structure/move.ts:122`), EST-L01-031 com a seleção de volta na raiz (`src/core/structure/move.ts:168`) e EST-L01-033 com a mensagem `status.movedInto` (`src/core/structure/move.ts:167`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas aninha a linha movida.
- **DOM do canvas:** o nó muda de lugar pela lista de remendos que `src/core/store/store.ts:542` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado (`at`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/core/structure/move.ts:201` `export const nestIntoPreviousCommand = registerHandler('element.nestIntoPrevious', ({ state, rules, layout }): Outcome<never> => {` — um só tratador; as portas mandam só a intenção vazia e a mesma regra `moveSelectionTo` decide.
- G4: n/a — o comando não desenha sobre o canvas; devolve remendos (`src/core/structure/move.ts:122`).
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/move.ts:168`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/move.ts:201`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve remendos (`src/core/structure/move.ts:122`).
