# TRC-classes.moveInto
- **Chamada:** `src/app/commands.ts:222` `'classes.moveInto': moveIntoClassCommand,`
- **Argumentos:** `{ className: string }` — o argumento `className` do manifesto (`manifest/commands/design-system.json:1406` `"className": {`), obrigatório; a disponibilidade `hasSelection` lê a seleção.
- **Ramos que dependem dos argumentos:** R2 (o `className` decide a recusa por classe desconhecida).

## Passos
1. `src/app/commands.ts:222` `'classes.moveInto': moveIntoClassCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `hasSelection` é lida antes do tratador [lê: EST-L01-031 via run].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/classes.ts:187` `export const moveIntoClassCommand = registerHandler('classes.moveInto', (context, { className }): Outcome<never> => {` — o tratador recebe o contexto e o argumento `className`.
7. `src/core/design/classes.ts:189` `const found = selectedNodes(context)[0];` — o elemento principal [lê: EST-L01-030 via selectedNodes] [lê: EST-L01-031 via selectedNodes].
8. `src/core/design/classes.ts:191` `const index = classesOf(state.document).findIndex((c) => c.name === className);` — o índice da classe é achado [lê: EST-L01-030 via classesOf].
9. `src/core/design/classes.ts:193` `if (Object.keys(found.node.styles).length === 0) return { kind: 'refused', message: message('status.classes.nothingToMove', { element: found.node.name }) };` — sem estilos próprios, recusa `status.classes.nothingToMove`.
10. `src/core/design/classes.ts:194` `const locked = firstLockRefusal(state.document, [found.node.id as NodeId], 'status.locked.edit');` — um elemento trancado recusa [lê: EST-L01-030 via firstLockRefusal].
11. `src/core/design/classes.ts:196` `const styleClass = classesOf(state.document)[index] as StyleClass;` — a classe guardada é lida [lê: EST-L01-030 via classesOf].
12. `src/core/design/classes.ts:198` `{ op: 'replace', path: ['classes', index, 'styles'], value: mergedStyles(styleClass.styles, found.node.styles) },` — os estilos do elemento entram por cima dos da classe [lê: EST-L01-030 via mergedStyles].
13. `src/core/design/classes.ts:172` `function mergedStyles(under: StyleClass['styles'], over: StyleClass['styles']): StyleClass['styles'] {` — `mergedStyles` sobrepõe os dois conjuntos de estilos.
14. `src/core/design/classes.ts:199` `{ op: 'replace', path: [...found.path, 'styles'], value: {} },` — o elemento fica sem estilos próprios.
15. `src/core/design/classes.ts:201` `if (!found.node.classes.includes(className)) patches.push({ op: 'replace', path: [...found.path, 'classes'], value: [...found.node.classes, className] });` — o elemento passa a listar a classe.
16. `src/core/design/classes.ts:202` `return { kind: 'change', patches, message: message('status.classes.moved', { element: found.node.name, name: className }) };` — o tratador devolve os patches e a mensagem.
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
18. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/classes.ts:190` `if (found === undefined) return { kind: 'change' };` — nada selecionado: `change` sem patch; com seleção: segue.
- R2 `src/core/design/classes.ts:192` `if (index < 0) return { kind: 'refused', message: message('status.classes.unknown', { name: className }) };` — classe que o projeto não tem: recusa `status.classes.unknown`; tem: segue.
- R3 `src/core/design/classes.ts:193` `if (Object.keys(found.node.styles).length === 0) return { kind: 'refused', message: message('status.classes.nothingToMove', { element: found.node.name }) };` — sem estilos próprios: recusa `status.classes.nothingToMove`; com estilos: segue.
- R4 `src/core/design/classes.ts:195` `if (locked !== null) return { kind: 'refused', message: locked };` — elemento trancado: recusa `status.locked.edit`; livre: segue.
- R5 `src/core/design/classes.ts:201` `if (!found.node.classes.includes(className)) patches.push({ op: 'replace', path: [...found.path, 'classes'], value: [...found.node.classes, className] });` — já lista a classe: não acrescenta; não lista: acrescenta.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/classes.ts:187`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento `classes`, estilos do elemento, via run, selectedNodes, classesOf, firstLockRefusal, mergedStyles, commit), EST-L01-031 (a seleção, via run, selectedNodes, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: `classes[index].styles`, estilos e classes do elemento, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os estilos do elemento entram na classe (`src/core/design/classes.ts:198`), o elemento fica sem estilos próprios e lista a classe; a mensagem é `status.classes.moved`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; a barra de classes do inspector mostra a classe.
- **DOM do canvas:** o canvas redesenha o documento; a página fica igual (os estilos passam para a classe).

## Regras
- G1: n/a — o comando escreve caminhos fixos do documento (`src/core/design/classes.ts:199`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:222` `'classes.moveInto': moveIntoClassCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/classes.ts:202`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/classes.ts:202`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/classes.ts:187`).

## Medições
- nenhuma
