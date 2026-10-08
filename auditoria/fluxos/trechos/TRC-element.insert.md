# TRC-element.insert
- **Chamada:** `src/app/commands.ts:365` `'element.insert': insertCommand,`
- **Argumentos:** `{ entry: string (tipo palette-entry, refers palette-entry), parent?: NodeId, index?: number }` — o manifesto (`manifest/commands/structure.json:11` `"entry": {`, `manifest/commands/structure.json:17` `"parent": {`, `manifest/commands/structure.json:22` `"index": {`).
- **Ramos que dependem dos argumentos:** R1 (o `parent`, quando dado, decide o receptor e o índice) e R2 (o `index` decide a posição entre os filhos).

## Passos
1. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são conferidos contra o manifesto. [lê: EST-L01-030 via argumentRefusal]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'element.insert'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/insert.ts:217` `export const insertCommand = registerHandler('element.insert', ({ state, ids, rules, words }, { entry, parent, index }): Outcome<never> => {` — o tratador recebe o estado e os três campos. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext]
5. `src/core/structure/insert.ts:218` `const node = paletteNode(nodeMaker(state.document, rules, ids, words), entry);` — o nó novo é feito da entrada da paleta.
6. `src/core/structure/insert.ts:181` `if (item === undefined || make.rules.elements.get(item.element) === undefined) throw new Error(` — entrada desconhecida é defeito da porta.
7. `src/core/structure/insert.ts:219` `const at = placement(state, state.selection, rules, parent, index, node);` — o lugar do nó é decidido. [lê: EST-L01-031 via placement] [lê: EST-L01-030 via placement]
8. `src/core/structure/insert.ts:220` `if (at === null) throw new Error(`element.insert: the document has no node ${String(parent)}`);` — sem lugar, defeito da porta.
9. `src/core/structure/insert.ts:221` `const receiver = at.parent.node;` — o receptor é o pai do lugar.
10. `src/core/structure/insert.ts:223` `const locked = lockRefusal(state.document, receiver.id, 'status.locked.insert');` — o receptor trancado recusa. [lê: EST-L01-030 via lockRefusal]
11. `src/core/structure/insert.ts:226` `const refused = placementRefusal(state.document, rules, receiver.id, [node]);` — a regra de onde elementos podem entrar recusa. [lê: EST-L01-030 via placementRefusal]
12. `src/core/structure/insert.ts:228` `const placed = withSiblingClasses(node, receiver.children);` — o nó herda as classes comuns dos irmãos do mesmo tipo.
13. `src/core/structure/insert.ts:232` `const cell = index === undefined && (at.index === receiver.children.length || beside) ? emptyCell(receiver, rules) : -1;` — o nó no fim de uma grade procura a célula vazia.
14. `src/core/structure/insert.ts:233` `if (cell >= 0) {` — havendo célula vazia, o nó a toma.
15. `src/core/structure/insert.ts:240` `patches: [...releaseReferencesPatch(state.document, leaving), { op: 'remove', path }, { op: 'add', path, value: placed }],` — a célula sai e o nó entra no mesmo remendo. [escreve: EST-L01-030 via run]
16. `src/core/structure/insert.ts:242` `message: message('status.placed', { element: node.name, parent: receiver.name, position: cell + 1, count: receiver.children.length }),` — o recado nomeia o elemento e a posição.
17. `src/core/structure/insert.ts:247` `patches: [{ op: 'add', path: [...at.parent.path, 'children', at.index], value: placed }],` — sem célula, o nó entra no índice da colocação. [escreve: EST-L01-030 via run]
18. `src/core/structure/insert.ts:248` `selection: [node.id],` — o nó novo vira a seleção. [escreve: EST-L01-031 via run]
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os remendos. [escreve: EST-L01-030 via applyPatches]
20. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção do resultado é a do tratador. [escreve: EST-L01-031 via run]
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
22. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção são validados.
23. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/insert.ts:146` `if (parent !== undefined) {` — com `parent`: o lugar é o nó nomeado no índice dado, recusando quando ele falta (`src/core/structure/insert.ts:148` `if (!at) return null;`); sem `parent`: o lugar vem da seleção (`src/core/structure/insert.ts:152` `const primary = selection[0] === undefined ? null : locate(document, selection[0]);`).
- R2 `src/core/structure/insert.ts:150` `return { parent: at, index: index === undefined ? count : Math.max(0, Math.min(index, count)) };` — com `index`: preso entre 0 e o número de filhos; sem: o fim da lista.
- R3 `src/core/structure/insert.ts:224` `if (locked !== null) return { kind: 'refused', message: locked };` — receptor trancado: recusa; senão, segue.
- R4 `src/core/structure/insert.ts:227` `if (refused !== null) return { kind: 'refused', message: refused };` — o modelo de conteúdo recusa: recusa; senão, segue.
- R5 `src/core/structure/insert.ts:233` `if (cell >= 0) {` — há célula vazia na grade: ela é substituída; senão, o nó entra no índice.
- R6 `src/core/structure/insert.ts:163` `if (primary?.parent && incoming !== undefined && sameKind(primary.node, incoming)) {` — um elemento do mesmo tipo do selecionado entra logo depois dele, como irmão.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/insert.ts:217`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, placement, lockRefusal, placementRefusal), EST-L01-031 (a seleção, via handlerContext, placement, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via publish)

## Resultado
- **Estado final:** EST-L01-030 com o nó no receptor, no índice pedido (`src/core/structure/insert.ts:247`), EST-L01-031 com a seleção no nó novo (`src/core/structure/insert.ts:248`) e EST-L01-033 com a mensagem `status.placed` (`src/core/structure/insert.ts:249`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas ganha a linha do nó novo.
- **DOM do canvas:** o nó entra pela lista de remendos que `src/core/store/store.ts:542` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado (`at`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/core/structure/insert.ts:217` `export const insertCommand = registerHandler('element.insert', ({ state, ids, rules, words }, { entry, parent, index }): Outcome<never> => {` — um só tratador; as cinco portas mandam só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve remendos (`src/core/structure/insert.ts:247`).
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/insert.ts:249`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/insert.ts:217`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve remendos (`src/core/structure/insert.ts:247`).
