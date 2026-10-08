# TRC-element.moveTo
- **Chamada:** `src/app/commands.ts:366` `'element.moveTo': moveToCommand,`
- **Argumentos:** `{ parent: NodeId, index: number }` — o manifesto (`manifest/commands/structure.json:167` `"parent": {`, `manifest/commands/structure.json:172` `"index": {`).
- **Ramos que dependem dos argumentos:** R7 (o `parent` decide o receptor e as recusas de destino) e R8 (o `index` decide a posição entre os filhos).

## Passos
1. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são conferidos contra o manifesto. [lê: EST-L01-030 via argumentRefusal]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'element.moveTo'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/move.ts:35` `export const moveToCommand = registerHandler('element.moveTo', ({ state, rules, layout }, { parent, index }): Outcome<never> => moveSelectionTo(state, rules, layout, parent, index));` — o tratador chama a regra única de movimento. [lê: EST-L01-030 via moveSelectionTo] [lê: EST-L01-031 via moveSelectionTo]
5. `src/core/structure/move.ts:85` `const moved = selectionRoots(state.document, state.selection);` — as raízes da seleção. [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots]
6. `src/core/structure/move.ts:87` `if (moved.length === 0) return { kind: 'refused', message: message('refusal.nothingSelected') };` — sem raiz, recusa.
7. `src/core/structure/move.ts:88` `const receiver = locate(state.document, parent);` — o receptor é o nó nomeado. [lê: EST-L01-030 via locate]
8. `src/core/structure/move.ts:89` `if (!receiver) throw new Error(`element.moveTo: the document has no node ${parent}`);` — sem receptor, defeito da porta.
9. `src/core/structure/move.ts:91` `for (const at of moved) if (!at.parent) return { kind: 'refused', message: message('status.element.notApplicable', { command: { key: 'command.moveTo' }, name: at.node.name }) };` — a página não se move.
10. `src/core/structure/move.ts:96` `const locked = firstLockRefusal(state.document, roots, 'status.locked.move') ?? lockRefusal(state.document, parent, 'status.locked.insert');` — nó ou receptor trancado recusa. [lê: EST-L01-030 via firstLockRefusal]
11. `src/core/structure/move.ts:99` `for (const at of moved) for (const inner of walk(at.node)) if (inner.id === parent) return { kind: 'refused', message: message('status.refused.intoItself') };` — um pai dentro do que se move recusa.
12. `src/core/structure/move.ts:101` `const refused = placementRefusal(state.document, rules, parent, moved.map((at) => at.node), new Set(moved.filter((at) => at.parent?.id === parent).map((at) => at.node.id)));` — a regra de onde elementos podem entrar. [lê: EST-L01-030 via placementRefusal]
13. `src/core/structure/move.ts:104` `const instanced = instanceMoveRefusal(state.document, moved.map((at) => at.node), parent);` — a peça fica na instância; a instância não entra noutra. [lê: EST-L01-030 via instanceMoveRefusal]
14. `src/core/structure/move.ts:113` `    const patch: Patch = { op: 'remove', path: now.path };` — cada nó movido sai do lugar, achado de novo no documento que as remoções deixaram. [escreve: EST-L01-030 via run]
15. `src/core/structure/move.ts:120` `const start = Math.max(0, Math.min(index, target.node.children.length));` — o índice é preso entre 0 e o número de filhos.
16. `src/core/structure/move.ts:122` `    patches.push({ op: 'add', path: [...target.path, 'children', start + i], value: at.node });` — os nós chegam na ordem da seleção, do índice em diante. [escreve: EST-L01-030 via run]
17. `src/core/structure/move.ts:155` `if (JSON.stringify(applyPatches(state.document, patches).document) === JSON.stringify(state.document)) return { kind: 'change', selection: roots };` — um movimento que deixa tudo onde estava nada muda.
18. `src/core/structure/move.ts:166` `        ? message('status.moved', { name: first.node.name, position: start + 1, count, parent: receiver.node.name })` — um nó junto de si: `status.moved`; `src/core/structure/move.ts:167` `        : message('status.movedInto', { name: first.node.name, receiver: receiver.node.name, position: start + 1, count });` num outro pai: `status.movedInto`.
19. `src/core/structure/move.ts:168` `return { kind: 'change', patches, selection: roots, message: said };` — o resultado leva os remendos, as raízes de novo selecionadas e o recado. [escreve: EST-L01-030 via run] [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os remendos. [escreve: EST-L01-030 via applyPatches]
21. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção do resultado é a do tratador. [escreve: EST-L01-031 via run]
22. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
23. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção são validados.
24. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/move.ts:87` `if (moved.length === 0) return { kind: 'refused', message: message('refusal.nothingSelected') };` — seleção vazia: recusa; com raiz: segue.
- R2 `src/core/structure/move.ts:91` `for (const at of moved) if (!at.parent) return { kind: 'refused', message: message('status.element.notApplicable', { command: { key: 'command.moveTo' }, name: at.node.name }) };` — a raiz da página: recusa; senão, segue.
- R3 `src/core/structure/move.ts:97` `if (locked !== null) return { kind: 'refused', message: locked };` — nó ou receptor trancado: recusa; senão, segue.
- R4 `src/core/structure/move.ts:99` `for (const at of moved) for (const inner of walk(at.node)) if (inner.id === parent) return { kind: 'refused', message: message('status.refused.intoItself') };` — um pai dentro do que se move: recusa; senão, segue.
- R5 `src/core/structure/move.ts:102` `if (refused !== null) return { kind: 'refused', message: refused };` — o modelo de conteúdo recusa: recusa; senão, segue.
- R6 `src/core/structure/move.ts:105` `if (instanced !== null) return { kind: 'refused', message: instanced };` — a peça fora da instância: recusa; senão, segue.
- R7 `src/core/structure/move.ts:155` `if (JSON.stringify(applyPatches(state.document, patches).document) === JSON.stringify(state.document)) return { kind: 'change', selection: roots };` — todo nó fica onde estava: nenhuma mudança; senão, os remendos entram.
- R8 `src/core/structure/move.ts:163` `    moved.length !== 1 || !first` — vários movidos: `status.movedMany` (`src/core/structure/move.ts:164` `      ? message('status.movedMany', { count: moved.length, parent: receiver.node.name })`); um só: `status.moved` ou `status.movedInto`.
- R9 `src/core/structure/move.ts:128` `  for (const [i, at] of moved.entries()) {` — um nó posicionado cuja caixa contenedora muda tem as suas bordas reescritas (`src/core/structure/move.ts:147` `      values[property] = `${Math.round(which === '-' ? page - nextStart : nextEnd - page)}px`;`).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/move.ts:35`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, moveSelectionTo, selectionRoots, locate, firstLockRefusal, placementRefusal, instanceMoveRefusal, commit), EST-L01-031 (a seleção, via handlerContext, moveSelectionTo, selectionRoots, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via run, publish)

## Resultado
- **Estado final:** EST-L01-030 com as raízes no receptor, a partir de `start` (`src/core/structure/move.ts:122`), EST-L01-031 com a seleção de volta nas raízes (`src/core/structure/move.ts:168`) e EST-L01-033 com a mensagem de `src/core/structure/move.ts:162`.
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas reordena as linhas movidas.
- **DOM do canvas:** os nós mudam de lugar pela lista de remendos que `src/core/store/store.ts:542` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado (`at`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/core/structure/move.ts:35` `export const moveToCommand = registerHandler('element.moveTo', ({ state, rules, layout }, { parent, index }): Outcome<never> => moveSelectionTo(state, rules, layout, parent, index));` — cada porta manda só a intenção (o pai e o índice) e a mesma regra `moveSelectionTo` decide.
- G4: n/a — o comando não desenha sobre o canvas; devolve remendos (`src/core/structure/move.ts:122`).
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/move.ts:168`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/move.ts:35`).

## Medições
- nenhuma — a caixa contenedora de um nó posicionado vem da porta `Layout` (`src/core/structure/move.ts:133` `    const from = layout.paddingBox(oldCb);`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
