# TRC-layout.configure
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:654` `export const configureLayout = registerHandler<'layout.configure', EditorUi>('layout.configure', (context, { field, value }) =>`
- **Argumentos:** `{ field: enum [name, semantic, width, height, padding, alignment, distribution, equalize, spacing, repeat], value: string }` — o manifesto (`manifest/commands/layout-composer.json:710` `"field": {`, `manifest/commands/layout-composer.json:726` `"value": {`).
- **Ramos que dependem dos argumentos:** R2, R3, R4 e R5 (o `field` escolhe o ramo; o `value` é julgado por ele).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção (um controle do painel do compositor).
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só configura com um contêiner composto [lê: EST-L01-037 via composerOf].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
9. `src/modules/layout-composer/host/handlers.ts:655` `guarded(context, () => {` — o corpo passa por `guarded`.
10. `src/modules/layout-composer/host/handlers.ts:658` `const breakpoint = activeBreakpoint(context.state);` — o ponto de quebra mostrado é lido [lê: EST-L01-037 via activeBreakpoint].
11. `src/modules/layout-composer/host/handlers.ts:659` `if (!breakpoint.base && field !== 'name' && field !== 'semantic') return { kind: 'refused', message: message('layout.respond.configureAtBase', { breakpoint: breakpointWords(BASE_BREAKPOINT) }) };` — fora do base, só nome e significado (R2).
12. `src/modules/layout-composer/host/handlers.ts:660` `const { state, record, regions } = selected(context);` — as regiões selecionadas são reunidas [lê: EST-L01-030 via selected] [lê: EST-L01-031 via selected] [lê: EST-L01-037 via selected].
13. `src/modules/layout-composer/host/handlers.ts:615` `if (regions.length === 0) throw new LayoutRefusal('nothing-selected');` — sem seleção: recusa (R3).
14. `src/modules/layout-composer/host/handlers.ts:668` `const operations: Operation[] = regions.map((r) => ({ kind: 'configure', id: r.id, values: valuesOf(r, field, value, property) }));` — uma operação por região selecionada (R4).
15. `src/modules/layout-composer/host/handlers.ts:630` `switch (field) {` — `valuesOf` julga o valor pelo campo.
16. `src/modules/layout-composer/host/handlers.ts:669` `const result = execute(record.intent, operations.length === 1 ? (operations[0] as Operation) : { kind: 'compose', operations }, naming(context));` — a álgebra executa as operações (ou uma composta).
17. `src/modules/layout-composer/host/handlers.ts:670` `if (!result.ok) return refusedWith(result.problems);` — operação recusada: sem escrita.
18. `src/modules/layout-composer/host/handlers.ts:671` `const outcome = written(context, result.graph, state.selection);` — o grafo novo é escrito no contêiner.
19. `src/modules/layout-composer/host/handlers.ts:165` `return { patches: [...released, { op: 'replace', path: [...path], value: next }] };` — o contêiner é substituído inteiro [escreve: EST-L01-030 via containerWrite].
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto: recusa `layout.inactive`; composto: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:659` `if (!breakpoint.base && field !== 'name' && field !== 'semantic') return { kind: 'refused', message: message('layout.respond.configureAtBase', { breakpoint: breakpointWords(BASE_BREAKPOINT) }) };` — num tamanho menor um campo que não é nome nem significado: recusa `layout.respond.configureAtBase`; no base ou nome/significado: segue.
- R3 `src/modules/layout-composer/host/handlers.ts:661` `if (field === EQUALIZE) return equalized(context, record.intent, regions, value);` — `equalize` iguala tamanhos ou lacunas; `spacing` (`src/modules/layout-composer/host/handlers.ts:664` `return equalized(context, record.intent, regions, 'gap', Math.round(Number.parseFloat(value)));`) fixa uma lacuna; `repeat` repete a região; qualquer outro campo segue o ramo comum.
- R4 `src/modules/layout-composer/host/handlers.ts:632` `if (value.trim() === '') throw new LayoutRefusal('value', { value, property });` — valor inválido para o campo: recusa `value`; válido: `valuesOf` devolve os valores.
- R5 `src/modules/layout-composer/host/handlers.ts:685` `if (regions.length < 2) throw new LayoutRefusal('distribute-count');` — `equalize` com menos de duas regiões: recusa `distribute-count`; `src/modules/layout-composer/host/handlers.ts:722` `if (!Number.isInteger(count) || count < 2 || count > REPEAT_MOST) throw new LayoutRefusal('repeat-count');` — `repeat` com contagem fora de faixa: recusa `repeat-count`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:654`); os controles do painel não leem arquivo, então `dispatch` roda direto (`src/editor/doors/door.tsx:144`).

## Estado
- Lê: EST-L01-030 (documento), EST-L01-031 (a seleção), EST-L01-037 (estado do editor com o compositor), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento do contêiner recompilado), EST-L01-037 (estado do editor).

## Resultado
- **Estado final:** as regiões selecionadas mudam o valor do campo pedido (`src/modules/layout-composer/host/handlers.ts:668`) ou ganham a regra de igualar/repetir; a mensagem é `layout.status.configured`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel do compositor mostra o valor novo.
- **DOM do canvas:** o contêiner é reescrito com o grafo configurado (`src/modules/layout-composer/host/handlers.ts:165`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:654` `export const configureLayout = registerHandler<'layout.configure', EditorUi>('layout.configure', (context, { field, value }) =>` — um só tratador; as portas enviam só o campo e o valor.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches `src/modules/layout-composer/host/handlers.ts:165`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:673`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:654`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o trecho lê o grafo e devolve patches.
