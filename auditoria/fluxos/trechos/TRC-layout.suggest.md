# TRC-layout.suggest
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:815` `export const suggestLayout = registerHandler<'layout.suggest', EditorUi>('layout.suggest', (context, { suggestion }) =>`
- **Argumentos:** `{ suggestion: string }` — o manifesto (`manifest/commands/layout-composer.json:1385` `"suggestion": {`).
- **Ramos que dependem dos argumentos:** R2 e R3 (o `suggestion` decide se a sugestão existe e qual operação vira).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o botão Sugerir do painel).
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só sugere com um contêiner composto [lê: EST-L01-037 via composerOf].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
9. `src/modules/layout-composer/host/handlers.ts:816` `guarded(context, () => {` — o corpo passa por `guarded`.
10. `src/modules/layout-composer/host/handlers.ts:817` `const { record } = composed(context);` — o registro do compositor [lê: EST-L01-030 via composed] [lê: EST-L01-037 via composed].
11. `src/modules/layout-composer/host/handlers.ts:818` `const found = usefulSuggestions(record.intent, context.state.document).find((s) => s.id === suggestion);` — a sugestão oferecida de id pedido é procurada [lê: EST-L01-030 via usefulSuggestions].
12. `src/modules/layout-composer/host/handlers.ts:806` `return suggestions(graph).filter((s) => {` — só as sugestões cuja aceitação muda a página são oferecidas (R2).
13. `src/modules/layout-composer/host/handlers.ts:807` `const result = execute(graph, acceptSuggestion(graph, s), plain);` — cada sugestão é executada de prova sobre o grafo.
14. `src/modules/layout-composer/host/handlers.ts:819` `if (found === undefined) throw new LayoutRefusal('unknown-region', { region: suggestion });` — sugestão não oferecida: recusa `unknown-region` (R3).
15. `src/modules/layout-composer/gestures/structural.ts:115` `export function acceptSuggestion(graph: LayoutIntent, suggestion: Suggestion): Operation {` — a sugestão vira uma operação.
16. `src/modules/layout-composer/host/handlers.ts:820` `const outcome = operate(context, acceptSuggestion(record.intent, found));` — a operação roda sobre o grafo.
17. `src/modules/layout-composer/gestures/operations.ts:497` `if (problems.length > 0) return { ok: false, problems };` — operação recusada: sem grafo.
18. `src/modules/layout-composer/host/handlers.ts:165` `return { patches: [...released, { op: 'replace', path: [...path], value: next }] };` — o contêiner é escrito de novo [escreve: EST-L01-030 via run].
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto: recusa `layout.inactive`; composto: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:810` `return next !== null && next !== now;` — sugestão cuja aceitação compila para a mesma estrutura: não é oferecida; muda a página: é oferecida.
- R3 `src/modules/layout-composer/host/handlers.ts:819` `if (found === undefined) throw new LayoutRefusal('unknown-region', { region: suggestion });` — id que não está entre as oferecidas: recusa `unknown-region`; id oferecido: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:815`); o botão do painel não lê arquivo, então `dispatch` roda direto (`src/editor/doors/door.tsx:144`).

## Estado
- Lê: EST-L01-030 (documento), EST-L01-037 (estado do editor com o compositor), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento do contêiner recompilado), EST-L01-037 (estado do editor).

## Resultado
- **Estado final:** a sugestão aceita é gravada no grafo (`src/modules/layout-composer/host/handlers.ts:820`); a mensagem é `layout.status.suggested`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel do compositor deixa de oferecer a sugestão aceita.
- **DOM do canvas:** o contêiner é reescrito com a estrutura nova (`src/modules/layout-composer/host/handlers.ts:165`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:815` `export const suggestLayout = registerHandler<'layout.suggest', EditorUi>('layout.suggest', (context, { suggestion }) =>` — um só tratador; a porta envia só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches `src/modules/layout-composer/host/handlers.ts:165`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:821`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:815`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o trecho lê o grafo e devolve patches.
