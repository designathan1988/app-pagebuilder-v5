# TRC-components.repeat
- **Chamada:** `src/app/commands.ts:238` `'components.repeat': repeatCommand,`
- **Argumentos:** `{}` — o comando não toma argumentos (`manifest/commands/design-system.json:1102` `"args": {},`); a disponibilidade `singleSelection` lê a seleção.
- **Ramos que dependem dos argumentos:** nenhum — o comando não toma argumentos; o documento decide R1 a R5.

## Passos
1. `src/app/commands.ts:238` `'components.repeat': repeatCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta de atalho (Ctrl+Shift+D) entrega a intenção.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `singleSelection` é lida antes do tratador [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/design/components.ts:162` `export const repeatCommand = registerHandler('components.repeat', ({ state, ids, rules, words }): Outcome<never> => {` — o tratador recebe o contexto.
8. `src/core/design/components.ts:163` `const primary = state.selection[0];` — o elemento principal [lê: EST-L01-031 via handlerContext].
9. `src/core/design/components.ts:164` `const found = primary === undefined ? null : locate(state.document, primary);` — a posição dele [lê: EST-L01-030 via locate].
10. `src/core/design/components.ts:166` `if (found.parent === null) return { kind: 'refused', message: message('status.components.root') };` — a raiz da página é recusada.
11. `src/core/design/components.ts:168` `let definition = found.node.component === undefined ? undefined : componentsOf(state.document).find((c) => c.name === found.node.component);` — a definição do componente, quando o nó já é instância [lê: EST-L01-030 via componentsOf].
12. `src/core/design/components.ts:171` `const refusedHere = createRefusal(state.document, found.node.id as NodeId);` — sem componente, o nó é julgado pelo `createRefusal` [lê: EST-L01-030 via createRefusal].
13. `src/core/design/components.ts:173` `const name = componentName(state.document, found.node.name);` — o componente novo toma o nome do elemento [lê: EST-L01-030 via componentName].
14. `src/core/design/components.ts:178` `patches.push(state.document.components === undefined ? { op: 'add', path: ['components'], value: [definition] } : { op: 'add', path: ['components', componentsOf(state.document).length], value: definition });` — a definição entra.
15. `src/core/design/components.ts:179` `patches.push({ op: 'replace', path: found.path, value: marked(found.node, [], name) });` — o nó vira a primeira instância.
16. `src/core/design/components.ts:181` `const locked = lockRefusal(state.document, found.node.id as NodeId, 'status.locked.edit');` — o nó que já é instância é julgado pela trava [lê: EST-L01-030 via lockRefusal].
17. `src/core/design/components.ts:185` `const lockedParent = lockRefusal(state.document, receiver.id, 'status.locked.insert');` — o pai é julgado pela trava [lê: EST-L01-030 via lockRefusal].
18. `src/core/design/components.ts:187` `const make = nodeMaker(state.document, rules, ids, words);` — o gerador de nomes livres é montado.
19. `src/core/design/components.ts:188` `const name = copyName(found.node.name, make.taken);` — o nome da cópia nova.
20. `src/core/design/components.ts:190` `const plainCopy = copied(definition.tree, () => ids.next() as NodeId, make, true);` — a árvore do componente é copiada com ids novos.
21. `src/core/design/components.ts:191` `const copiedTree = refreshCopiedIdentities(state.document, [{ source: definition.tree, copy: plainCopy }])[0];` — as identidades da cópia são renovadas [lê: EST-L01-030 via refreshCopiedIdentities].
22. `src/core/design/components.ts:193` `const node = marked({ ...copiedTree, name }, [], definition.name);` — a cópia recebe o nome e a marca de instância.
23. `src/core/design/components.ts:194` `const refused = placementRefusal(state.document, rules, receiver.id, [node]);` — o modelo decide se a cópia cabe [lê: EST-L01-030 via placementRefusal].
24. `src/core/design/components.ts:196` `patches.push({ op: 'add', path: [...found.path.slice(0, -1), found.index + 1], value: node });` — a cópia entra logo depois do elemento.
25. `src/core/design/components.ts:199` `return { kind: 'change', patches, selection: [node.id], message: message('status.components.repeated', { name: definition.name, count }) };` — o tratador devolve os patches e a seleção nova.
26. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
27. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
28. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção nova entra [escreve: EST-L01-031 via run].
29. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
30. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/components.ts:165` `if (found === null) return { kind: 'change' };` — nada selecionado: `change` sem patch; com nó: segue.
- R2 `src/core/design/components.ts:166` `if (found.parent === null) return { kind: 'refused', message: message('status.components.root') };` — raiz da página: recusa `status.components.root`; outro: segue.
- R3 `src/core/design/components.ts:169` `if (definition === undefined) {` — não é instância ainda: vira componente e primeira instância (passos 12 a 15); é instância: só a trava do nó é lida (passo 16).
- R4 `src/core/design/components.ts:172` `if (refusedHere !== null) return { kind: 'refused', message: refusedHere };` — nó que não pode virar componente: recusa; livre: segue.
- R5 `src/core/design/components.ts:186` `if (lockedParent !== null) return { kind: 'refused', message: lockedParent };` — pai trancado: recusa `status.locked.insert`; livre: segue.
- R6 `src/core/design/components.ts:195` `if (refused !== null) return { kind: 'refused', message: refused };` — cópia que o modelo não aceita: recusa; aceita: o passo 24 devolve a mudança.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/components.ts:162`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento `components`, via locate, componentsOf, createRefusal, componentName, lockRefusal, refreshCopiedIdentities, placementRefusal, commit), EST-L01-031 (a seleção, via run, handlerContext, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: `components` e a cópia nova, via applyPatches, publish), EST-L01-031 (a seleção, via run, commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o elemento ganha uma cópia ligada logo depois (`src/core/design/components.ts:196`), e quando não era instância o componente novo entra (`src/core/design/components.ts:178`); a cópia nova vira a seleção; a mensagem é `status.components.repeated`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o menu de arranjo e as Camadas acompanham a seleção nova.
- **DOM do canvas:** o canvas redesenha o documento com a cópia nova.

## Regras
- G1: n/a — o comando escreve um caminho fixo do documento (`src/core/design/components.ts:196`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:238` `'components.repeat': repeatCommand,` — o atalho, o menu de contexto, o menu de arranjo e a command bar chegam ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/components.ts:199`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/components.ts:199`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/components.ts:162`).

## Medições
- nenhuma
