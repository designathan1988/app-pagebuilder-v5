# TRC-components.updateFromInstance
- **Chamada:** `src/app/commands.ts:219` `'components.updateFromInstance': updateFromInstanceCommand,`
- **Argumentos:** `{}` — o comando não toma argumentos (`manifest/commands/design-system.json:1625` `"args": {},`); a disponibilidade `insideInstance` lê a seleção.
- **Ramos que dependem dos argumentos:** nenhum — o comando não toma argumentos; o documento decide os ramos.

## Passos
1. `src/app/commands.ts:219` `'components.updateFromInstance': updateFromInstanceCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `insideInstance` é lida antes do tratador [lê: EST-L01-031 via insideInstance].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/components.ts:365` `export const updateFromInstanceCommand = registerHandler('components.updateFromInstance', ({ state, ids }): Outcome<never> => {` — o tratador recebe o estado e o gerador de ids.
7. `src/core/design/components.ts:367` `const source = primary === undefined ? null : instanceRootOf(state.document, primary);` — a raiz da instância do elemento principal [lê: EST-L01-030 via instanceRootOf].
8. `src/core/design/components.ts:370` `const index = componentsOf(state.document).findIndex((c) => c.name === name);` — o índice da definição [lê: EST-L01-030 via componentsOf].
9. `src/core/design/components.ts:374` `const definitionTree = copied(source, next, null, true);` — a árvore da instância vira a definição nova, com ids novos.
10. `src/core/design/components.ts:375` `const taken = new Set(state.document.pages.flatMap((page) => [...walk(page.tree)].map((one) => one.name)));` — os nomes usados são reunidos [lê: EST-L01-030 via walk].
11. `src/core/design/components.ts:381` `const rebuilt = (from: DocNode, instance: DocNode | null): DocNode => {` — `rebuilt` reconstrói uma instância sobre a estrutura da editada, preservando id, nome, texto e atributos do elemento do mesmo posto.
12. `src/core/design/components.ts:400` `const visit = (at: DocNode, atPath: (string | number)[]) => {` — `visit` percorre cada página e junta as instâncias a reescrever.
13. `src/core/design/components.ts:409` `state.document.pages.forEach((page, i) => visit(page.tree, ['pages', i, 'tree']));` — a passagem pelas páginas [lê: EST-L01-030 via handlerContext].
14. `src/core/design/components.ts:411` `const locked = firstLockRefusal(state.document, written.map((one) => one.before.id as NodeId), 'status.locked.edit');` — uma instância trancada recusa [lê: EST-L01-030 via firstLockRefusal].
15. `src/core/design/components.ts:416` `const staying = new Set(written.flatMap((one) => [...walk(one.tree)].map((inner) => inner.id)));` — os ids que ficam.
16. `src/core/design/components.ts:417` `const leaving = new Set(written.flatMap((one) => [...walk(one.before)].map((inner) => inner.id as NodeId)).filter((id) => !staying.has(id)));` — os ids que saem.
17. `src/core/design/components.ts:418` `const names = leavingNames(state.document, leaving);` — os nomes dos que saem [lê: EST-L01-030 via leavingNames].
18. `src/core/design/components.ts:420` `const released = leaving.size === 0 ? [] : releaseReferencesPatch(state.document, leaving, names).filter((patch) => !under(patch.path));` — as referências que apontavam para os que saem são soltas no mesmo passo [lê: EST-L01-030 via releaseReferencesPatch].
19. `src/core/design/components.ts:423` `{ op: 'replace', path: ['components', index, 'tree'], value: definitionTree },` — o patch da definição nova.
20. `src/core/design/components.ts:424` `...written.map((one): Patch => ({ op: 'replace', path: one.path, value: leaving.size === 0 ? one.tree : withoutReferencesTo(one.tree, names) })),` — o patch de cada instância reescrita.
21. `src/core/design/components.ts:426` `return { kind: 'change', patches, message: message('status.components.updated', { name, count }) };` — o tratador devolve os patches e a mensagem.
22. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
23. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
24. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
25. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/components.ts:368` `if (source === null || source.component === undefined) return { kind: 'refused', message: message('status.components.notInstance') };` — sem raiz de instância: recusa `status.components.notInstance`; com raiz: segue.
- R2 `src/core/design/components.ts:371` `if (index < 0) return { kind: 'refused', message: message('status.components.notInstance') };` — definição ausente: recusa `status.components.notInstance`; presente: segue.
- R3 `src/core/design/components.ts:412` `if (locked !== null) return { kind: 'refused', message: locked };` — uma instância reescrita trancada: recusa `status.locked.edit`; livres: segue.
- R4 `src/core/design/components.ts:420` `const released = leaving.size === 0 ? [] : releaseReferencesPatch(state.document, leaving, names).filter((patch) => !under(patch.path));` — nada sai: nenhum patch de referência; algo sai: as referências que o apontavam são soltas.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/components.ts:365`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento: `components`, as árvores das páginas, via instanceRootOf, componentsOf, walk, handlerContext, firstLockRefusal, leavingNames, releaseReferencesPatch, commit), EST-L01-031 (a seleção, via insideInstance, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: `components[index].tree` e cada instância reescrita, referências soltas, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a definição passa a ser a instância editada (`src/core/design/components.ts:423`) e cada outra instância é reescrita sobre ela, guardando o que é seu (`src/core/design/components.ts:424`); a mensagem é `status.components.updated`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem.
- **DOM do canvas:** o canvas redesenha o documento com todas as instâncias atualizadas.

## Regras
- G1: n/a — o comando escreve caminhos fixos do documento (`src/core/design/components.ts:423`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:219` `'components.updateFromInstance': updateFromInstanceCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/components.ts:426`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/components.ts:426`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/components.ts:365`).

## Medições
- nenhuma
