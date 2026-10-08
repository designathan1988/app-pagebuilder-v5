# TRC-layout.merge
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:599` `export const mergeLayout = registerHandler<'layout.merge', EditorUi>('layout.merge', (context) =>`
- **Argumentos:** `{}` — o manifesto (`manifest/commands/layout-composer.json:654` `"args": {},`), sem campos.
- **Ramos que dependem dos argumentos:** nenhum (o comando não tem argumento; os ramos dependem da seleção e do ponto de quebra).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o botão Mesclar do painel).
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só mescla com um contêiner composto [lê: EST-L01-037 via composerOf].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
9. `src/modules/layout-composer/host/handlers.ts:600` `guarded(context, () => {` — o corpo passa por `guarded`.
10. `src/modules/layout-composer/host/handlers.ts:601` `const { state, record } = composed(context);` — o estado do compositor e o registro [lê: EST-L01-030 via composed] [lê: EST-L01-037 via composed].
11. `src/modules/layout-composer/host/handlers.ts:602` `if (state.selection.length < 2) return refusedWith([{ code: 'merge-selection', params: {} }]);` — menos de duas regiões: recusa (R1).
12. `src/modules/layout-composer/host/handlers.ts:603` `if (!activeBreakpoint(context.state).base) return drawAtBase();` — num tamanho menor recusa `layout.respond.drawAtBase` (R2).
13. `src/modules/layout-composer/host/handlers.ts:604` `const ids = state.selection.filter((id) => findRegion(record.intent, id) !== undefined);` — só as regiões que existem entram.
14. `src/modules/layout-composer/host/handlers.ts:605` `const outcome = operate(context, { kind: 'merge', ids, span: true }, ids.slice(0, 1));` — a mescla roda sobre o grafo.
15. `src/modules/layout-composer/host/handlers.ts:317` `const result = execute(record.intent, operation, naming(context));` — a álgebra executa a operação.
16. `src/modules/layout-composer/gestures/operations.ts:265` `if (held.some((r) => r.parent !== first.parent)) refuse('merge-siblings');` — irmãos de pais diferentes: recusa (R3).
17. `src/modules/layout-composer/gestures/operations.ts:497` `if (problems.length > 0) return { ok: false, problems };` — operação recusada: sem grafo.
18. `src/modules/layout-composer/host/handlers.ts:319` `return written(context, result.graph, selection ?? state.selection, fresh);` — o grafo novo é escrito no contêiner.
19. `src/modules/layout-composer/host/handlers.ts:165` `return { patches: [...released, { op: 'replace', path: [...path], value: next }] };` — o contêiner é substituído inteiro [escreve: EST-L01-030 via containerWrite].
20. `src/modules/layout-composer/host/handlers.ts:607` `return { ...outcome, message: message('layout.status.merged', { name: findRegion(record.intent, ids[0] as string)?.name ?? '' }) };` — a mensagem nomeia a região resultante.
21. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
22. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
23. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish].

## Ramos
- R1 `src/modules/layout-composer/host/handlers.ts:602` `if (state.selection.length < 2) return refusedWith([{ code: 'merge-selection', params: {} }]);` — menos de duas: recusa `merge-selection`; duas ou mais: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:603` `if (!activeBreakpoint(context.state).base) return drawAtBase();` — num ponto de quebra menor: recusa `layout.respond.drawAtBase`; no base: segue.
- R3 `src/modules/layout-composer/gestures/operations.ts:265` `if (held.some((r) => r.parent !== first.parent)) refuse('merge-siblings');` — regiões de pais diferentes: recusa `merge-siblings`; irmãs: segue. `src/modules/layout-composer/gestures/operations.ts:269` `if (shapes.length !== 1) refuse('merge-disconnected');` — caixa que abrangeria outra região: recusa `merge-disconnected`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:599`); a porta é o botão do painel, sem leitura de arquivo, então `dispatch` roda direto (`src/editor/doors/door.tsx:144`).

## Estado
- Lê: EST-L01-030 (documento), EST-L01-031 (a seleção), EST-L01-037 (estado do editor com o compositor), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento com as regiões mescladas), EST-L01-037 (estado do editor com a seleção).

## Resultado
- **Estado final:** as regiões selecionadas viram uma sobre a caixa que abrangem (`src/modules/layout-composer/host/handlers.ts:605`); a mensagem é `layout.status.merged`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel do compositor mostra a seleção nova.
- **DOM do canvas:** o contêiner é reescrito com a região mesclada (`src/modules/layout-composer/host/handlers.ts:165`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:599` `export const mergeLayout = registerHandler<'layout.merge', EditorUi>('layout.merge', (context) =>` — um só tratador; a porta envia só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches `src/modules/layout-composer/host/handlers.ts:165`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:165`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:599`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o trecho lê o grafo e devolve patches.
