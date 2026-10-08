# TRC-classes.rename
- **Chamada:** `src/app/commands.ts:230` `'classes.rename': renameClassCommand,`
- **Argumentos:** `{ className: string, nextName: string }` — `className` é a classe atual e `nextName` o nome novo (`manifest/commands/design-system.json:567` `"className": {`). Os dois obrigatórios.
- **Ramos que dependem dos argumentos:** R1 e R2 (o `className` decide R1; o `nextName` decide R2).

## Passos
1. `src/app/commands.ts:230` `'classes.rename': renameClassCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/classes.ts:143` `export const renameClassCommand = registerHandler('classes.rename', ({ state }, { className, nextName }): Outcome<never> => {` — o tratador recebe o estado e os dois argumentos.
7. `src/core/design/classes.ts:144` `const typed = nextName.trim();` — o nome novo é aparado.
8. `src/core/design/classes.ts:145` `const index = classesOf(state.document).findIndex((c) => c.name === className);` — o índice da classe é achado [lê: EST-L01-030 via classesOf].
9. `src/core/design/classes.ts:146` `if (index < 0 || className === typed) return { kind: 'change' };` — classe ausente ou nome igual: `change` sem patch.
10. `src/core/design/classes.ts:147` `if (!isIdentifier(typed)) return { kind: 'refused', message: message('status.classes.badName', { name: typed }) };` — nome que não é identificador é recusado.
11. `src/core/design/classes.ts:148` `if (classesOf(state.document).some((c) => c.name === typed)) return { kind: 'refused', message: message('status.classes.nameTaken', { name: typed }) };` — nome já usado é recusado.
12. `src/core/design/classes.ts:149` `const uses = classUses(state.document, className);` — os elementos que a listam nas páginas [lê: EST-L01-030 via classUses].
13. `src/core/design/classes.ts:150` `const locked = firstLockRefusal(state.document, uses.map((at) => at.node.id as NodeId), 'status.locked.edit');` — um deles trancado recusa [lê: EST-L01-030 via firstLockRefusal].
14. `src/core/design/classes.ts:152` `const patches = renameClassPatches(state.document, className, typed);` — os patches renomeiam a definição e cada uso [lê: EST-L01-030 via renameClassPatches].
15. `src/core/design/classes.ts:138` `...(index < 0 ? [] : [{ op: 'replace' as const, path: ['classes', index, 'name'], value: nextName }]),` — o patch da definição.
16. `src/core/design/classes.ts:139` `...classListers(document, className).map((at): Patch => ({ op: 'replace', path: [...at.path, 'classes'], value: at.node.classes.map(name => name === className ? nextName : name) })),` — o patch de cada elemento (nas páginas e nas definições de componente).
17. `src/core/design/classes.ts:153` `return { kind: 'change', patches, message: message('status.classes.renamed', { oldName: className, name: typed }) };` — o tratador devolve os patches e a mensagem.
18. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
19. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/classes.ts:146` `if (index < 0 || className === typed) return { kind: 'change' };` — classe ausente ou nome novo igual ao atual: `change` sem patch; classe presente e nome diferente: segue.
- R2 `src/core/design/classes.ts:147` `if (!isIdentifier(typed)) return { kind: 'refused', message: message('status.classes.badName', { name: typed }) };` — nome inválido: recusa `status.classes.badName`; válido: segue.
- R3 `src/core/design/classes.ts:148` `if (classesOf(state.document).some((c) => c.name === typed)) return { kind: 'refused', message: message('status.classes.nameTaken', { name: typed }) };` — nome já usado: recusa `status.classes.nameTaken`; livre: segue.
- R4 `src/core/design/classes.ts:151` `if (locked !== null) return { kind: 'refused', message: locked };` — um elemento que a lista trancado: recusa `status.locked.edit`; livres: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/classes.ts:143`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento `classes`, elementos das páginas e das definições, via argumentRefusal, classesOf, classUses, firstLockRefusal, renameClassPatches, commit), EST-L01-031 (a seleção, via commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: `classes[i].name` e `classes` de cada listador, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a definição e cada elemento que a lista ficam com o nome novo (`src/core/design/classes.ts:138`, `src/core/design/classes.ts:139`); a mensagem é `status.classes.renamed`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo de nome da classe e o alvo de estilo (via `targetFollowsClassRename`) acompanham.
- **DOM do canvas:** o canvas redesenha o documento com a classe renomeada.

## Regras
- G1: n/a — o comando escreve caminhos fixos do documento (`src/core/design/classes.ts:139`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:230` `'classes.rename': renameClassCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/classes.ts:153`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/classes.ts:153`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/classes.ts:143`).

## Medições
- nenhuma
