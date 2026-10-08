# TRC-components.insertInstance
- **Chamada:** `src/app/commands.ts:236` `'components.insertInstance': insertInstanceCommand,`
- **Argumentos:** `{ component: string, parent?: node, index?: integer }` — `component` refere um componente (`manifest/commands/design-system.json:946` `"component": {`); `parent` e `index` são opcionais.
- **Ramos que dependem dos argumentos:** R2 e R3 (o `parent` e o `index` decidem onde a instância entra); o `component` escolhe a definição.

## Passos
1. `src/app/commands.ts:236` `'components.insertInstance': insertInstanceCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta da telha de componente entrega a intenção.
3. `src/editor/input/pointer/effects.ts:219` `closing?.dispatch(dropDoorOf.command.id, { ...dropDoorOf.door.args, ...press.args, parent: dropped.parent, index: dropped.index } as never);` — a porta do arraste entrega a intenção, com `parent` e `index` propostos.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos; um `component` que o projeto não tem é `status.stale` [lê: EST-L01-030 via argumentRefusal].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/design/components.ts:132` `export const insertInstanceCommand = registerHandler('components.insertInstance', ({ state, ids, rules, words }, { component, parent, index }): Outcome<never> => {` — o tratador recebe o contexto e os três argumentos.
8. `src/core/design/components.ts:133` `const definition = componentsOf(state.document).find((c) => c.name === component);` — a definição é achada pelo nome [lê: EST-L01-030 via componentsOf].
9. `src/core/design/components.ts:136` `const at = placement(state, state.selection, rules, parent, index);` — o lugar da instância é decidido por `placement`, com o `parent` e o `index` [lê: EST-L01-030 via placement] [lê: EST-L01-031 via placement].
10. `src/core/design/components.ts:138` `const receiver = at.parent.node;` — o receptor.
11. `src/core/design/components.ts:139` `const locked = lockRefusal(state.document, receiver.id, 'status.locked.insert');` — um receptor trancado recusa [lê: EST-L01-030 via lockRefusal].
12. `src/core/design/components.ts:141` `const make = nodeMaker(state.document, rules, ids, words);` — o gerador de nomes livres é montado.
13. `src/core/design/components.ts:143` `const name = copyName(definition.name, make.taken);` — o nome da instância é o do componente, numerado.
14. `src/core/design/components.ts:145` `const plainCopy = copied(definition.tree, () => ids.next() as NodeId, make, true);` — a árvore da definição é copiada com ids novos.
15. `src/core/design/components.ts:146` `const copiedTree = refreshCopiedIdentities(state.document, [{ source: definition.tree, copy: plainCopy }])[0];` — as identidades da cópia são renovadas [lê: EST-L01-030 via refreshCopiedIdentities].
16. `src/core/design/components.ts:148` `const node = marked({ ...copiedTree, name }, [], definition.name);` — a cópia recebe o nome e a marca de instância.
17. `src/core/design/components.ts:150` `const host = instanceRootOf(state.document, receiver.id);` — o receptor dentro de outra instância recusa [lê: EST-L01-030 via instanceRootOf].
18. `src/core/design/components.ts:152` `const refused = placementRefusal(state.document, rules, receiver.id, [node]);` — o modelo decide se a instância cabe ali [lê: EST-L01-030 via placementRefusal].
19. `src/core/design/components.ts:157` `selection: [node.id],` — a instância nova vira a seleção.
20. `src/core/design/components.ts:158` `message: message('status.placed', { element: node.name, parent: receiver.name, position: at.index + 1, count: receiver.children.length + 1 }),` — a mensagem nomeia o lugar.
21. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o patch [escreve: EST-L01-030 via applyPatches].
22. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
23. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção nova entra [escreve: EST-L01-031 via run].
24. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
25. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/components.ts:140` `if (locked !== null) return { kind: 'refused', message: locked };` — receptor trancado: recusa `status.locked.insert`; livre: segue.
- R2 `src/core/design/components.ts:151` `if (host !== null) return { kind: 'refused', message: message('status.components.inInstance', { name: receiver.name }) };` — receptor dentro de instância: recusa `status.components.inInstance`; fora: segue.
- R3 `src/core/design/components.ts:153` `if (refused !== null) return { kind: 'refused', message: refused };` — lugar que o modelo não aceita: recusa; aceito: o passo 19 devolve a mudança.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/components.ts:132`); a porta do arraste chama `dispatch` no mesmo quadro (`src/editor/input/pointer/effects.ts:219`).

## Estado
- Lê: EST-L01-030 (documento `components`, via argumentRefusal, componentsOf, placement, lockRefusal, refreshCopiedIdentities, instanceRootOf, placementRefusal, commit), EST-L01-031 (a seleção, via placement, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: instância nova na árvore, via applyPatches, publish), EST-L01-031 (a seleção, via run, commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a instância nova entra na árvore (`src/core/design/components.ts:156`) e vira a seleção (`src/core/design/components.ts:157`); a mensagem é `status.placed`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; as Camadas selecionam a instância nova.
- **DOM do canvas:** o canvas redesenha o documento com a instância nova.

## Regras
- G1: n/a — o comando escreve o caminho que `placement` decide (`src/core/design/components.ts:156`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:236` `'components.insertInstance': insertInstanceCommand,` — a telha e o arraste chegam ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/components.ts:158`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/components.ts:158`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/components.ts:132`).

## Medições
- nenhuma
