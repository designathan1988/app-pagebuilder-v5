# TRC-element.promote
- **Chamada:** `src/app/commands.ts:378` `'element.promote': promoteCommand,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:1210` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `canPromote` (`manifest/commands/structure.json:1212` `"predicate": "canPromote",`). [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'element.promote'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/move.ts:226` `export const promoteCommand = registerHandler('element.promote', ({ state, rules, layout }): Outcome<never> => {` — o tratador recebe o estado, as regras e a porta de layout. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext]
5. `src/core/structure/move.ts:227` `  const [only] = state.selection;` — o único selecionado.
6. `src/core/structure/move.ts:228` `  const at = only === undefined ? null : locate(state.document, only);` — o nó do selecionado. [lê: EST-L01-030 via locate]
7. `src/core/structure/move.ts:230` `  if (at === null) throw new Error('element.promote: the selection is not one node of the document');` — sem nó, defeito da store (a disponibilidade `singleSelection` guarda a porta).
8. `src/core/structure/move.ts:231` `  const parent = at.parent === null ? null : locate(state.document, at.parent.id);` — o pai do selecionado.
9. `src/core/structure/move.ts:232` `  if (parent === null || parent.parent === null) return { kind: 'refused', message: message('status.promote.topLevel') };` — filho direto da raiz da página recusa.
10. `src/core/structure/move.ts:233` `  return moveSelectionTo(state, rules, layout, parent.parent.id, parent.index + 1);` — a regra única leva o nó para o avô, logo depois do pai. [lê: EST-L01-030 via moveSelectionTo] [lê: EST-L01-031 via moveSelectionTo]
11. `src/core/structure/move.ts:85` `const moved = selectionRoots(state.document, state.selection);` — as raízes da seleção. [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots]
12. `src/core/structure/move.ts:96` `const locked = firstLockRefusal(state.document, roots, 'status.locked.move') ?? lockRefusal(state.document, parent, 'status.locked.insert');` — nó ou receptor trancado recusa. [lê: EST-L01-030 via firstLockRefusal]
13. `src/core/structure/move.ts:101` `const refused = placementRefusal(state.document, rules, parent, moved.map((at) => at.node), new Set(moved.filter((at) => at.parent?.id === parent).map((at) => at.node.id)));` — a regra de onde elementos podem entrar. [lê: EST-L01-030 via placementRefusal]
14. `src/core/structure/move.ts:122` `    patches.push({ op: 'add', path: [...target.path, 'children', start + i], value: at.node });` — o nó chega no avô, depois do pai. [escreve: EST-L01-030 via run]
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os remendos. [escreve: EST-L01-030 via applyPatches]
16. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção de volta na raiz. [lê: EST-L01-031 via run]
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
18. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção são validados.
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/move.ts:215` `  if (at === null) return message('status.needsSingleSelection');` — sem um só selecionado: a disponibilidade recusa `status.needsSingleSelection`; com um só: segue.
- R2 `src/core/structure/move.ts:217` `  if (parent === null || parent.parent === null) return message('status.promote.topLevel');` — filho direto da raiz da página: a disponibilidade recusa `status.promote.topLevel`; com avô: segue.
- R3 `src/core/structure/move.ts:232` `  if (parent === null || parent.parent === null) return { kind: 'refused', message: message('status.promote.topLevel') };` — o mesmo caso no tratador: recusa; senão, promove.
- R4 `src/core/structure/move.ts:218` `  return instanceMoveRefusal(state.document, [at.node], parent.parent.id as NodeId);` — a peça fora da instância recusa; senão segue.
- R5 `src/core/structure/move.ts:97` `  if (locked !== null) return { kind: 'refused', message: locked };` — nó ou receptor trancado: recusa; senão, segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/move.ts:226`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, locate, moveSelectionTo, selectionRoots, firstLockRefusal, placementRefusal, commit), EST-L01-031 (a seleção, via handlerContext, moveSelectionTo, selectionRoots, commit, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-033 (a mensagem, via publish)

## Resultado
- **Estado final:** EST-L01-030 com o nó no avô, logo depois do pai (`src/core/structure/move.ts:122`), EST-L01-031 com a seleção de volta na raiz (`src/core/store/store.ts:499`) e EST-L01-033 com a mensagem `status.movedInto` (`src/core/structure/move.ts:167`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas sobe a linha movida um nível.
- **DOM do canvas:** o nó muda de lugar pela lista de remendos que `src/core/store/store.ts:542` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado (`at`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/core/structure/move.ts:226` `export const promoteCommand = registerHandler('element.promote', ({ state, rules, layout }): Outcome<never> => {` — um só tratador; as portas mandam só a intenção vazia e a mesma regra `moveSelectionTo` decide.
- G4: n/a — o comando não desenha sobre o canvas; devolve remendos (`src/core/structure/move.ts:122`).
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/move.ts:233`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/move.ts:226`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve remendos (`src/core/structure/move.ts:122`).
