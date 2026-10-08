# TRC-classes.applyToSimilar
- **Chamada:** `src/app/commands.ts:223` `'classes.applyToSimilar': applyToSimilarCommand,`
- **Argumentos:** `{ className: string, scope?: enum [page, project] }` — `className` é a classe e `scope` o alcance (`manifest/commands/design-system.json:1465` `"className": {`); `scope` é opcional (ausente vale `page`).
- **Ramos que dependem dos argumentos:** R2 e R3 (o `className` decide R2; o `scope` decide R3).

## Passos
1. `src/app/commands.ts:223` `'classes.applyToSimilar': applyToSimilarCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção (a de `page` ou a de `project`).
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `hasSelection` é lida antes do tratador [lê: EST-L01-031 via run].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/classes.ts:210` `export const applyToSimilarCommand = registerHandler('classes.applyToSimilar', (context, { className, scope }): Outcome<never> => {` — o tratador recebe o contexto e os dois argumentos.
7. `src/core/design/classes.ts:212` `const found = selectedNodes(context)[0];` — o elemento principal [lê: EST-L01-030 via selectedNodes] [lê: EST-L01-031 via selectedNodes].
8. `src/core/design/classes.ts:214` `if (!classesOf(state.document).some((c) => c.name === className)) return { kind: 'refused', message: message('status.classes.unknown', { name: className }) };` — classe ausente do projeto recusa `status.classes.unknown` [lê: EST-L01-030 via classesOf].
9. `src/core/design/classes.ts:215` `const onPage = (scope ?? PAGE_SCOPE) === PAGE_SCOPE;` — o alcance: a página ou o projeto [lê: EST-L01-030 via handlerContext].
10. `src/core/design/classes.ts:228` `const [PAGE_SCOPE] = commandOf(applyToSimilarCommand.command).args.scope?.values ?? [];` — `PAGE_SCOPE` é o primeiro valor do argumento `scope` do manifesto (`page`).
11. `src/core/design/classes.ts:216` `const pool = (onPage ? [state.document.pages[found.page]] : state.document.pages).flatMap((page) => (page === undefined ? [] : [...walk(page.tree)])).filter((node) => node.type === found.node.type);` — os elementos do mesmo tipo, na página ou em todas [lê: EST-L01-030 via walk].
12. `src/core/design/classes.ts:217` `const without = pool.filter((node) => !node.classes.includes(className));` — só os que ainda não listam a classe.
13. `src/core/design/classes.ts:219` `const locked = firstLockRefusal(state.document, without.map((node) => node.id as NodeId), 'status.locked.edit');` — um deles trancado recusa [lê: EST-L01-030 via firstLockRefusal].
14. `src/core/design/classes.ts:222` `const at = locate(state.document, node.id) as NonNullable<ReturnType<typeof locate>>;` — a posição de cada um [lê: EST-L01-030 via locate].
15. `src/core/design/classes.ts:223` `return { op: 'replace', path: [...at.path, 'classes'], value: [...node.classes, className] };` — o patch de cada elemento.
16. `src/core/design/classes.ts:225` `return { kind: 'change', patches, message: message('status.classes.appliedToSimilar', { name: className, count: without.length }) };` — o tratador devolve os patches e a mensagem.
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
18. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/classes.ts:213` `if (found === undefined) return { kind: 'change' };` — nada selecionado: `change` sem patch; com seleção: segue.
- R2 `src/core/design/classes.ts:214` `if (!classesOf(state.document).some((c) => c.name === className)) return { kind: 'refused', message: message('status.classes.unknown', { name: className }) };` — classe que o projeto não tem: recusa `status.classes.unknown`; tem: segue.
- R3 `src/core/design/classes.ts:216` `const pool = (onPage ? [state.document.pages[found.page]] : state.document.pages).flatMap((page) => (page === undefined ? [] : [...walk(page.tree)])).filter((node) => node.type === found.node.type);` — `scope` `page` (ou ausente): só a página do elemento; `project`: todas as páginas.
- R4 `src/core/design/classes.ts:218` `if (without.length === 0) return { kind: 'refused', message: message('status.classes.noSimilar', { name: className }) };` — nenhum parecido sem a classe: recusa `status.classes.noSimilar`; algum: segue.
- R5 `src/core/design/classes.ts:220` `if (locked !== null) return { kind: 'refused', message: locked };` — um parecido trancado: recusa `status.locked.edit`; livres: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/classes.ts:210`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento `classes`, árvores das páginas, via selectedNodes, classesOf, handlerContext, walk, firstLockRefusal, locate, commit), EST-L01-031 (a seleção, via run, selectedNodes, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: `classes` de cada elemento parecido, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** cada elemento do tipo que não listava a classe passa a listá-la (`src/core/design/classes.ts:223`); a mensagem é `status.classes.appliedToSimilar`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; a barra de classes do inspector mostra a classe.
- **DOM do canvas:** o canvas redesenha o documento com os estilos da classe nos elementos.

## Regras
- G1: n/a — o comando escreve caminhos fixos do documento (`src/core/design/classes.ts:223`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:223` `'classes.applyToSimilar': applyToSimilarCommand,` — as duas portas (alcance página e alcance projeto) chegam ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/classes.ts:225`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/classes.ts:225`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/classes.ts:210`).

## Medições
- nenhuma
