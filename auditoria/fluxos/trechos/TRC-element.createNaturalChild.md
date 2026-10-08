# TRC-element.createNaturalChild
- **Chamada:** `src/app/commands.ts:382` `'element.createNaturalChild': createNaturalChildCommand,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:1744` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `hasNaturalChild` (`manifest/commands/structure.json:1746` `"predicate": "hasNaturalChild",`). [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'element.createNaturalChild'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/insert.ts:104` `({ state, rules, ids, words }): Outcome<never> => {` — o tratador recebe o estado e as regras. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext]
5. `src/core/structure/insert.ts:105` `const found = naturalChildToCreate(state, rules);` — o filho natural a criar é procurado. [lê: EST-L01-030 via naturalChildToCreate] [lê: EST-L01-031 via naturalChildToCreate]
6. `src/core/structure/insert.ts:106` `if (found === null || found.type === null) return { kind: 'refused', message: naturalRefusal(state, rules) };` — sem filho natural, recusa.
7. `src/core/structure/insert.ts:108` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.insert');` — o elemento trancado recusa. [lê: EST-L01-030 via lockRefusal]
8. `src/core/structure/insert.ts:110` `const node = newElement(nodeMaker(state.document, rules, ids, words), type);` — o nó novo é feito do tipo natural.
9. `src/core/structure/insert.ts:111` `const index = rules.contentModel.slotIn(at.node.tag ?? '', at.node.children.map((c) => c.tag ?? ''), node.tag ?? '');` — o índice segue a ordem permitida de HTML.
10. `src/core/structure/insert.ts:114` `patches: [{ op: 'add', path: [...at.path, 'children', index], value: node }],` — o remendo põe o nó no índice. [escreve: EST-L01-030 via run]
11. `src/core/structure/insert.ts:115` `selection: [node.id],` — o nó novo vira a seleção. [escreve: EST-L01-031 via run]
12. `src/core/structure/insert.ts:116` `message: message('status.placed', { element: node.name, parent: at.node.name, position: index + 1, count: at.node.children.length + 1 }),` — o recado nomeia o elemento e a posição.
13. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o remendo. [escreve: EST-L01-030 via applyPatches]
14. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção do resultado é a do tratador. [escreve: EST-L01-031 via run]
15. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
16. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção são validados.
17. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com o remendo. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/insert.ts:74` `if (only === undefined || others.length > 0) return null;` — mais de um selecionado ou nenhum: sem filho natural; um só: segue para a lista natural.
- R2 `src/core/structure/insert.ts:77` `if (at === null || natural.length === 0) return null;` — o elemento não tem filhos naturais: `null` e a recusa `status.naturalChild.none` (`src/core/structure/insert.ts:91` `if (at === null || natural.length === 0) return message('status.naturalChild.none', { name: at?.node.name ?? '' });`); com naturais: escolhe o que falta.
- R3 `src/core/structure/insert.ts:83` `return { at, type: missing ?? many ?? null };` — há um natural que só cabe uma vez e falta: ele; senão o primeiro de que cabe muitos.
- R4 `src/core/structure/insert.ts:109` `if (locked !== null) return { kind: 'refused', message: locked };` — elemento trancado: recusa; senão, segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/insert.ts:104`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030, EST-L01-031, EST-L01-033

## Resultado
- **Estado final:** EST-L01-030 com o filho natural do tipo em `at.node` no índice permitido (`src/core/structure/insert.ts:114`), EST-L01-031 com a seleção no nó novo (`src/core/structure/insert.ts:115`) e EST-L01-033 com a mensagem `status.placed` (`src/core/structure/insert.ts:116`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas ganha a linha do nó novo.
- **DOM do canvas:** o nó entra pela lista de remendos que `src/core/store/store.ts:542` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado (`at`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:382` `'element.createNaturalChild': createNaturalChildCommand,` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; devolve remendos (`src/core/structure/insert.ts:114`).
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/insert.ts:116`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/insert.ts:104`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve remendos (`src/core/structure/insert.ts:114`).
