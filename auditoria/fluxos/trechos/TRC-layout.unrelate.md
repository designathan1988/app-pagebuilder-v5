# TRC-layout.unrelate
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:784` `export const unrelateLayout = registerHandler<'layout.unrelate', EditorUi>('layout.unrelate', (context, { constraint }) =>`
- **Argumentos:** `{ constraint: string }` — o manifesto (`manifest/commands/layout-composer.json:1323` `"constraint": {`).
- **Ramos que dependem dos argumentos:** R2 (o `constraint` decide se a regra existe e qual sai).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o controle de remover relação do painel).
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só desfaz relação com um contêiner composto [lê: EST-L01-037 via composerOf].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
9. `src/modules/layout-composer/host/handlers.ts:785` `guarded(context, () => {` — o corpo passa por `guarded`.
10. `src/modules/layout-composer/host/handlers.ts:786` `const { record } = composed(context);` — o registro do compositor [lê: EST-L01-030 via composed] [lê: EST-L01-037 via composed].
11. `src/modules/layout-composer/host/handlers.ts:787` `if (!record.intent.constraints.some((c) => c.id === constraint)) throw new LayoutRefusal('orphan-constraint', { constraint });` — regra de id desconhecido: recusa `orphan-constraint` (R2).
12. `src/modules/layout-composer/host/handlers.ts:788` `const outcome = operate(context, { kind: 'remove-constraint', id: constraint });` — a regra sai do grafo.
13. `src/modules/layout-composer/gestures/operations.ts:438` `return { ...graph, constraints: graph.constraints.filter((c) => c.id !== op.id) };` — a restrição é filtrada do grafo.
14. `src/modules/layout-composer/host/handlers.ts:165` `return { patches: [...released, { op: 'replace', path: [...path], value: next }] };` — o contêiner é escrito de novo [escreve: EST-L01-030 via run].
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
16. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
17. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto: recusa `layout.inactive`; composto: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:787` `if (!record.intent.constraints.some((c) => c.id === constraint)) throw new LayoutRefusal('orphan-constraint', { constraint });` — id que não é de uma regra do grafo: recusa `orphan-constraint`; id de uma regra: segue e ela sai.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:784`); o controle do painel não lê arquivo, então `dispatch` roda direto (`src/editor/doors/door.tsx:144`).

## Estado
- Lê: EST-L01-030 (documento), EST-L01-037 (estado do editor com o compositor), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento do contêiner sem a regra), EST-L01-037 (estado do editor).

## Resultado
- **Estado final:** a regra de id pedido sai do grafo (`src/modules/layout-composer/host/handlers.ts:788`); as regiões ficam onde estão; a mensagem é `layout.status.unrelated`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel do compositor não lista mais a regra.
- **DOM do canvas:** o contêiner é reescrito sem a declaração da regra (`src/modules/layout-composer/host/handlers.ts:165`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:784` `export const unrelateLayout = registerHandler<'layout.unrelate', EditorUi>('layout.unrelate', (context, { constraint }) =>` — um só tratador; a porta envia só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches `src/modules/layout-composer/host/handlers.ts:165`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:789`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:784`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o trecho lê o grafo e devolve patches.
