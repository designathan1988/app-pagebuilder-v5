# TRC-layout.respond
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:764` `export const respondLayout = registerHandler<'layout.respond', EditorUi>('layout.respond', (context, { edit, value }) =>`
- **Argumentos:** `{ edit: enum [stack, unstack, columns, hide, show], value?: string }` — o manifesto (`manifest/commands/layout-composer.json:1137` `"edit": {`, `manifest/commands/layout-composer.json:1148` `"value": {`).
- **Ramos que dependem dos argumentos:** R2 e R3 (o `edit` escolhe o ramo; o `value` é o número de colunas no ramo `columns`).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção (um controle da seção de tamanho de tela).
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só responde com um contêiner composto [lê: EST-L01-037 via composerOf].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
9. `src/modules/layout-composer/host/handlers.ts:765` `guarded(context, () => {` — o corpo passa por `guarded`.
10. `src/modules/layout-composer/host/handlers.ts:766` `const breakpoint = activeBreakpoint(context.state);` — o ponto de quebra mostrado é lido [lê: EST-L01-030 via activeBreakpoint] [lê: EST-L01-037 via activeBreakpoint].
11. `src/modules/layout-composer/host/handlers.ts:767` `if (breakpoint.base) return { kind: 'refused', message: message('layout.respond.base') };` — no tamanho-base nada disso se aplica (R1).
12. `src/modules/layout-composer/host/handlers.ts:768` `const { parent, record } = groupOf(context);` — o grupo do comportamento é achado [lê: EST-L01-030 via groupOf] [lê: EST-L01-037 via groupOf].
13. `src/modules/layout-composer/host/handlers.ts:770` `if (edit === 'stack') change = { kind: 'stack', parent };` — `stack` empilha o grupo (R2). `src/modules/layout-composer/host/handlers.ts:772` `else if (edit === 'hide' || edit === 'show') change = { kind: edit, ids: selected(context).regions.map((r) => r.id) };` — `hide`/`show` esconde ou mostra as regiões selecionadas.
14. `src/modules/layout-composer/host/handlers.ts:775` `if (!Number.isInteger(columns) || columns < 1 || columns > 12) throw new LayoutRefusal('value', { value: value ?? '', property: context.words('layout.door.columns' as MessageId) });` — `columns` fora de 1..12: recusa (R3).
15. `src/modules/layout-composer/responsive/continuum.ts:99` `const held = graph.responsive.find((r) => Math.abs(r.maxWidth - maxWidth) < 0.5) ?? { id: nextRuleId(graph), maxWidth, hidden: [] };` — a regra do tamanho é achada ou criada.
16. `src/modules/layout-composer/host/handlers.ts:778` `const outcome = operate(context, responsiveEdit(record.intent, breakpoint.width, change));` — o comportamento é gravado como operação.
17. `src/modules/layout-composer/gestures/operations.ts:497` `if (problems.length > 0) return { ok: false, problems };` — operação recusada: sem grafo.
18. `src/modules/layout-composer/host/handlers.ts:165` `return { patches: [...released, { op: 'replace', path: [...path], value: next }] };` — o contêiner é substituído inteiro [escreve: EST-L01-030 via run].
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/modules/layout-composer/host/handlers.ts:767` `if (breakpoint.base) return { kind: 'refused', message: message('layout.respond.base') };` — no tamanho-base: recusa `layout.respond.base`; num tamanho menor: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:770` `if (edit === 'stack') change = { kind: 'stack', parent };` — o `edit` escolhe: `stack` empilha, `unstack` desempilha, `columns` fixa colunas, `hide`/`show` esconde ou mostra as selecionadas.
- R3 `src/modules/layout-composer/host/handlers.ts:775` `if (!Number.isInteger(columns) || columns < 1 || columns > 12) throw new LayoutRefusal('value', { value: value ?? '', property: context.words('layout.door.columns' as MessageId) });` — colunas fora de 1..12: recusa `value`; dentro: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:764`); os controles do painel não leem arquivo, então `dispatch` roda direto (`src/editor/doors/door.tsx:144`).

## Estado
- Lê: EST-L01-030 (documento), EST-L01-037 (estado do editor com o compositor e a seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento do contêiner com a regra responsiva), EST-L01-037 (estado do editor).

## Resultado
- **Estado final:** a regra do ponto de quebra ganha a mudança pedida (`src/modules/layout-composer/responsive/continuum.ts:99`); a mensagem é `layout.status.responded`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel do compositor mostra a mudança.
- **DOM do canvas:** o contêiner é reescrito com a mídia do ponto de quebra (`src/modules/layout-composer/host/handlers.ts:165`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:764` `export const respondLayout = registerHandler<'layout.respond', EditorUi>('layout.respond', (context, { edit, value }) =>` — um só tratador; as portas enviam só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches `src/modules/layout-composer/host/handlers.ts:165`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:779`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:764`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o trecho lê o grafo e devolve patches.
