# TRC-layout.interpret
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:752` `export const interpretLayout = registerHandler<'layout.interpret', EditorUi>('layout.interpret', (context, { strategy }) =>`
- **Argumentos:** `{ strategy: enum [auto, grid, flex, fixed, proportional, masonry] }` — o manifesto (`manifest/commands/layout-composer.json:1070` `"strategy": {`).
- **Ramos que dependem dos argumentos:** R3 (o `strategy` decide a interpretação gravada; o grupo alvo decide R2).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o segmento de estratégia do painel).
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só interpreta com um contêiner composto [lê: EST-L01-037 via composerOf].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
9. `src/modules/layout-composer/host/handlers.ts:753` `guarded(context, () => {` — o corpo passa por `guarded`.
10. `src/modules/layout-composer/host/handlers.ts:754` `const { parent } = groupOf(context);` — o grupo da interpretação é achado [lê: EST-L01-030 via groupOf] [lê: EST-L01-031 via groupOf] [lê: EST-L01-037 via groupOf].
11. `src/modules/layout-composer/host/handlers.ts:746` `if (state.selection.length === 1 && childrenOf(record.intent, first.id).length > 0) return { parent: first.id, record };` — uma região selecionada com filhos é o grupo; senão o grupo é o pai dela (R2).
12. `src/modules/layout-composer/host/handlers.ts:756` `const outcome = operate(context, { kind: 'interpret', parent, strategy: strategy as LayoutStrategy }, undefined, true);` — a interpretação roda como operação nova (`fresh`).
13. `src/modules/layout-composer/host/handlers.ts:317` `const result = execute(record.intent, operation, naming(context));` — a álgebra executa a operação.
14. `src/modules/layout-composer/gestures/operations.ts:460` `const preferences = { ...graph.preferences, [preferenceKey(op.parent)]: op.strategy };` — a preferência do grupo passa a ser a estratégia (R3).
15. `src/modules/layout-composer/gestures/operations.ts:497` `if (problems.length > 0) return { ok: false, problems };` — operação recusada: sem grafo.
16. `src/modules/layout-composer/host/handlers.ts:319` `return written(context, result.graph, selection ?? state.selection, fresh);` — o grafo novo é escrito no contêiner, compilado do zero.
17. `src/modules/layout-composer/host/handlers.ts:136` `const built = structured(context, container, record, graph, fresh);` — a estrutura é compilada sem as chaves antigas.
18. `src/modules/layout-composer/host/handlers.ts:181` `const compiled = compile(shown, COMPILER, { previous: fresh ? new Set() : keys, filled: filledRegions(container) });` — o compilador decide a estrutura pelo custo, sem preferir a anterior.
19. `src/modules/layout-composer/host/handlers.ts:165` `return { patches: [...released, { op: 'replace', path: [...path], value: next }] };` — o contêiner é substituído inteiro [escreve: EST-L01-030 via containerWrite].
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto: recusa `layout.inactive`; composto: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:746` `if (state.selection.length === 1 && childrenOf(record.intent, first.id).length > 0) return { parent: first.id, record };` — uma região selecionada com filhos: o grupo são os filhos dela; senão o grupo é o pai do primeiro selecionado, ou o topo quando nada está selecionado.
- R3 `src/modules/layout-composer/gestures/operations.ts:462` `const sized = op.strategy === 'fixed' || op.strategy === 'proportional' ? op.strategy : null;` — `fixed` ou `proportional` também gravam o tamanho de cada irmão; qualquer outra estratégia só grava a preferência.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:752`); o segmento do painel não lê arquivo, então `dispatch` roda direto (`src/editor/doors/door.tsx:144`).

## Estado
- Lê: EST-L01-030 (documento), EST-L01-031 (a seleção), EST-L01-037 (estado do editor com o compositor), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento do contêiner recompilado pela estratégia), EST-L01-037 (estado do editor).

## Resultado
- **Estado final:** o grupo escolhido passa a ser interpretado pela estratégia (`src/modules/layout-composer/gestures/operations.ts:460`); a mensagem é `layout.status.interpreted`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel do compositor mostra a estratégia.
- **DOM do canvas:** o contêiner é reescrito com a estrutura nova, sem sobras da anterior (`src/modules/layout-composer/host/handlers.ts:181`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:752` `export const interpretLayout = registerHandler<'layout.interpret', EditorUi>('layout.interpret', (context, { strategy }) =>` — um só tratador; a porta envia só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches `src/modules/layout-composer/host/handlers.ts:165`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:757`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:752`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o trecho lê o grafo e devolve patches.
