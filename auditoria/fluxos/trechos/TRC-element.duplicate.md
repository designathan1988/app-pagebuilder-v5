# TRC-element.duplicate
- **Chamada:** `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:1348` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `hasSelection` (`manifest/commands/structure.json:1350` `"predicate": "hasSelection",`). [lê: EST-L01-031 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'element.duplicate'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/duplicate.ts:72` `export const duplicateCommand = registerHandler('element.duplicate', ({ state, ids, rules }): Outcome<never> => {` — o tratador recebe o estado, os ids e as regras. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext]
5. `src/core/structure/duplicate.ts:73` `const roots = selectionRoots(state.document, state.selection);` — as raízes da seleção. [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots]
6. `src/core/structure/duplicate.ts:76` `if (roots.length === 0) throw new Error('element.duplicate: the selection names no node of the document');` — sem raiz, defeito da store.
7. `src/core/structure/duplicate.ts:77` `if (roots.some((r) => r.parent === null)) return { kind: 'refused', message: message('status.duplicate.root') };` — a raiz da página recusa.
8. `src/core/structure/duplicate.ts:79` `const locked = firstLockRefusal(state.document, roots.map((r) => r.node.id), 'status.locked.edit');` — raiz trancada recusa. [lê: EST-L01-030 via firstLockRefusal]
9. `src/core/structure/duplicate.ts:82` `const taken = new Set<string>();` — os nomes tomados.
10. `src/core/structure/duplicate.ts:83` `for (const node of allNodes(state.document)) taken.add(node.name);` — todo nome do documento entra no conjunto. [lê: EST-L01-030 via allNodes]
11. `src/core/structure/duplicate.ts:85` `const raw = roots.map((r) => ({ source: r.node, copy: copyOf(r.node, ids, taken, rules) }));` — cada raiz é copiada inteira com id novo.
12. `src/core/structure/duplicate.ts:86` `const repaired = refreshCopiedIdentities(state.document, raw);` — as referências internas das cópias são acertadas.
13. `src/core/structure/duplicate.ts:97` `.map(({ root, copy }) => ({ op: 'add', path: [...root.path.slice(0, -1), root.index + 1], value: copy }));` — a cópia entra logo depois do original. [escreve: EST-L01-030 via run]
14. `src/core/structure/duplicate.ts:102` `const primary = copies.find(({ root }) => holdsPrimary(root)) ?? copies[0];` — a cópia da raiz que tem a primária vem primeiro.
15. `src/core/structure/duplicate.ts:104` `const selection = [primary.copy.id, ...copies.filter((c) => c !== primary).map((c) => c.copy.id)];` — as cópias viram a seleção. [escreve: EST-L01-031 via run]
16. `src/core/structure/duplicate.ts:109` `message: copies.length === 1 ? message('status.duplicated', { name: primary.root.node.name, copy: primary.copy.name }) : message('status.duplicatedMany', { count: copies.length }),` — o recado: uma cópia pelo nome, várias pela contagem.
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os remendos. [escreve: EST-L01-030 via applyPatches]
18. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção do resultado é a do tratador. [escreve: EST-L01-031 via run]
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
20. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção são validados.
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/duplicate.ts:77` `if (roots.some((r) => r.parent === null)) return { kind: 'refused', message: message('status.duplicate.root') };` — alguma raiz é a raiz da página: recusa; senão, segue.
- R2 `src/core/structure/duplicate.ts:80` `if (locked !== null) return { kind: 'refused', message: locked };` — raiz trancada ou dentro de trancado: recusa; senão, segue.
- R3 `src/core/structure/duplicate.ts:102` `const primary = copies.find(({ root }) => holdsPrimary(root)) ?? copies[0];` — com primária: a cópia dela; sem: a primeira cópia.
- R4 `src/core/structure/duplicate.ts:109` `message: copies.length === 1 ? message('status.duplicated', { name: primary.root.node.name, copy: primary.copy.name }) : message('status.duplicatedMany', { count: copies.length }),` — uma cópia: `status.duplicated` com os nomes; várias: `status.duplicatedMany` com a contagem.
- R5 `src/core/structure/duplicate.ts:50` `if (!valuePredicateHolds(node, POSITIONED, rules)) return node.styles;` — a cópia de um nó posicionado ganha o deslocamento (`src/core/structure/duplicate.ts:55` `if (value !== null) values[property] = `${Math.round(value + OFFSET)}px`;`); senão mantém os estilos.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/duplicate.ts:72`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, selectionRoots, firstLockRefusal, allNodes, commit), EST-L01-031 (a seleção, via handlerContext, selectionRoots, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via publish)

## Resultado
- **Estado final:** EST-L01-030 com uma cópia depois de cada raiz (`src/core/structure/duplicate.ts:97`), EST-L01-031 com a seleção nas cópias (`src/core/structure/duplicate.ts:104`) e EST-L01-033 com a mensagem de `src/core/structure/duplicate.ts:109`.
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas ganha as linhas das cópias.
- **DOM do canvas:** as cópias entram pela lista de remendos que `src/core/store/store.ts:542` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado (`at`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; devolve remendos (`src/core/structure/duplicate.ts:97`).
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/duplicate.ts:109`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/duplicate.ts:72`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve remendos (`src/core/structure/duplicate.ts:97`).
