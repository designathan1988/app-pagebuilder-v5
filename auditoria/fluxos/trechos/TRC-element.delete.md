# TRC-element.delete
- **Chamada:** `src/app/commands.ts:380` `'element.delete': deleteCommand,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:1478` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `hasSelection` (`manifest/commands/structure.json:1480` `"predicate": "hasSelection",`). [lê: EST-L01-031 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'element.delete'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/remove.ts:48` `export const deleteCommand = registerHandler('element.delete', ({ state }): Outcome<never> => {` — o tratador recebe o estado. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext]
5. `src/core/structure/remove.ts:49` `const roots = selectionRoots(state.document, state.selection);` — as raízes da seleção. [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots]
6. `src/core/structure/remove.ts:53` `const primary = roots.find((r) => r.node.id === primaryId) ?? roots.find((r) => primaryId !== undefined && [...walk(r.node)].some((n) => n.id === primaryId)) ?? roots[0];` — a raiz primária.
7. `src/core/structure/remove.ts:54` `if (primary === undefined) throw new Error('element.delete: the selection names no node of the document');` — sem raiz, defeito da store.
8. `src/core/structure/remove.ts:55` `if (roots.some((r) => r.parent === null)) return { kind: 'refused', message: message('status.delete.root') };` — a raiz da página recusa.
9. `src/core/structure/remove.ts:57` `const locked = firstLockRefusal(state.document, roots.map((r) => r.node.id), 'status.locked.delete');` — raiz trancada recusa. [lê: EST-L01-030 via firstLockRefusal]
10. `src/core/structure/remove.ts:59` `const after = selectionAfter(roots, primary);` — para onde a seleção vai depois.
11. `src/core/structure/remove.ts:64` `    .map((r) => ({ op: 'remove', path: r.path }));` — cada raiz sai, da última para a primeira. [escreve: EST-L01-030 via run]
12. `src/core/structure/remove.ts:67` `const cited = roots.reduce((sum, root) => sum + referencesTo(state.document, root.node.id), 0);` — as referências às raízes são contadas. [lê: EST-L01-030 via referencesTo]
13. `src/core/structure/remove.ts:70` `      ? message('status.deleted.cited', { name: roots.length === 1 ? primary.node.name : String(roots.length), references: String(cited) })` — com referências, o recado diz quantas.
14. `src/core/structure/remove.ts:74` `const going = new Set(roots.flatMap((root) => [...walk(root.node)].map((node) => node.id)));` — todos os ids que saem.
15. `src/core/structure/remove.ts:75` `const released = releaseReferencesPatch(state.document, going);` — as referências que apontavam para eles são soltas no mesmo remendo. [escreve: EST-L01-030 via run]
16. `src/core/structure/remove.ts:79` `    selection: after === null ? [] : [after],` — a seleção passa para o irmão seguinte, senão o anterior, senão o pai. [escreve: EST-L01-031 via run]
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os remendos. [escreve: EST-L01-030 via applyPatches]
18. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção do resultado é a do tratador. [escreve: EST-L01-031 via run]
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
20. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção são validados.
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/remove.ts:55` `if (roots.some((r) => r.parent === null)) return { kind: 'refused', message: message('status.delete.root') };` — alguma raiz é a raiz da página: recusa; senão, segue.
- R2 `src/core/structure/remove.ts:58` `if (locked !== null) return { kind: 'refused', message: locked };` — raiz trancada ou dentro de trancado: recusa; senão, segue.
- R3 `src/core/structure/remove.ts:70` `      ? message('status.deleted.cited', { name: roots.length === 1 ? primary.node.name : String(roots.length), references: String(cited) })` — com referências citando: `status.deleted.cited`; sem: `status.deleted` (`src/core/structure/remove.ts:71` `      : roots.length === 1`) ou `status.deletedMany` para várias.
- R4 `src/core/structure/remove.ts:38` `const next = siblings.slice(primary.index + 1).find((s) => !leaving.has(s.id));` — há irmão seguinte que fica: ele; senão `src/core/structure/remove.ts:45` `return primary.parent?.id ?? null;` devolve o pai que fica.
- R5 `src/core/structure/remove.ts:22` `if (selected.has(node.id)) {` — um selecionado dentro de outro selecionado não é raiz e sai com o que o contém.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/remove.ts:48`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030, EST-L01-031, EST-L01-033

## Resultado
- **Estado final:** EST-L01-030 sem as raízes e suas subárvores (`src/core/structure/remove.ts:64`), com as referências soltas (`src/core/structure/remove.ts:75`), EST-L01-031 com a seleção em `after` (`src/core/structure/remove.ts:79`) e EST-L01-033 com a mensagem de `src/core/structure/remove.ts:68`.
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas perde as linhas que saíram.
- **DOM do canvas:** os nós saem pela lista de remendos que `src/core/store/store.ts:542` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado (`at`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:380` `'element.delete': deleteCommand,` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; devolve remendos (`src/core/structure/remove.ts:64`).
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/remove.ts:68`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/remove.ts:48`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve remendos (`src/core/structure/remove.ts:64`).
