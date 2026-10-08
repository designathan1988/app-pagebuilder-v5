# TRC-layout.stroke
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:463` `export const strokeLayout = registerHandler<'layout.stroke', EditorUi>('layout.stroke', (context, { mode, points, handle }) =>`
- **Argumentos:** `{ mode: enum [auto, draw, cut, merge, subtract, move, nest, select, relate, group], points: json, handle?: string }` — o manifesto (`manifest/commands/layout-composer.json:198` `"mode": {`, `manifest/commands/layout-composer.json:214` `"points": {`, `manifest/commands/layout-composer.json:219` `"handle": {`);
- **Ramos que dependem dos argumentos:** R1, R2, R3, R4 e R5 (o `points` decide o que a leitura é; o `mode` escolhe a leitura; o `handle` decide se é uma alça).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o gesto de canvas, o cursor liberado).
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só compõe com um contêiner aberto [lê: EST-L01-037 via composerOf].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
9. `src/modules/layout-composer/host/handlers.ts:464` `guarded(context, () => {` — o corpo passa por `guarded`.
10. `src/modules/layout-composer/host/handlers.ts:364` `const locked = composerOf(context.state.ui) === null ? null : firstLockRefusal(context.state.document, [composerOf(context.state.ui)?.target as NodeId], 'status.locked.edit');` — a trava do contêiner é lida [lê: EST-L01-030 via firstLockRefusal].
11. `src/modules/layout-composer/host/handlers.ts:366` `return body();` — o corpo roda.
12. `src/modules/layout-composer/host/handlers.ts:465` `const { record, state, container } = composed(context);` — o contêiner composto e seu registro [lê: EST-L01-030 via composed] [lê: EST-L01-037 via composed].
13. `src/modules/layout-composer/host/handlers.ts:466` `if (!Array.isArray(points) || !points.every(isPoint)) throw new Error('layout.stroke: a door hands the stroke as points');` — a forma dos pontos é conferida.
14. `src/modules/layout-composer/host/handlers.ts:470` `const breakpoint = activeBreakpoint(context.state);` — o ponto de quebra mostrado é lido [lê: EST-L01-030 via activeBreakpoint] [lê: EST-L01-037 via activeBreakpoint].
15. `src/modules/layout-composer/host/handlers.ts:479` `const reading = readStroke(record.intent, { points, mode: mode as StrokeMode, handle: handle === undefined ? null : handleOf(handle), radius: hitRadius(context.state), selected: state.selection }, naming(context));` — o traço é lido pela mesma função que o canvas pré-visualizou (R5).
16. `src/modules/layout-composer/gestures/recognize.ts:507` `if (stroke.responsive !== undefined && stroke.responsive !== null) return readResponsive(graph, stroke, stroke.responsive, naming);` — num tamanho menor o traço grava comportamento responsivo.
17. `src/modules/layout-composer/gestures/recognize.ts:508` `if (stroke.handle !== null) return readHandle(graph, stroke, stroke.handle, naming);` — uma alça tem a sua leitura.
18. `src/modules/layout-composer/gestures/recognize.ts:534` `switch (mode) {` — o resto escolhe desenhar, cortar, agrupar, mesclar, subtrair, aninhar, selecionar ou relacionar.
19. `src/modules/layout-composer/gestures/recognize.ts:272` `const result = execute(graph, operation, naming);` — cada leitura executa a operação sobre o grafo.
20. `src/modules/layout-composer/host/handlers.ts:481` `if (reading.selection !== null) {` — uma marca seleciona as regiões que contém inteiras (R2).
21. `src/modules/layout-composer/host/handlers.ts:491` `const graph = inferMeaning(reading.result.graph, { name: (key) => context.words(`layout.template.part.${key}` as MessageId), numbered: (n) => context.words('layout.label.region' as MessageId, { n }), generic: numberedWith(context.words) }, page);` — o significado das regiões é relido.
22. `src/modules/layout-composer/host/handlers.ts:493` `const result = written(context, graph, made.length > 0 ? made : moving(reading, state.selection));` — o grafo é compilado e escrito no contêiner.
23. `src/modules/layout-composer/host/handlers.ts:136` `const built = structured(context, container, record, graph, fresh);` — a estrutura é compilada.
24. `src/modules/layout-composer/host/handlers.ts:181` `const compiled = compile(shown, COMPILER, { previous: fresh ? new Set() : keys, filled: filledRegions(container) });` — o compilador produz a árvore.
25. `src/modules/layout-composer/host/handlers.ts:186` `return materialize(context, withAuthoring(container, { ...record, intent: graph }), compilation, { make, regionType: REGION_TYPE, breakpoints });` — a árvore vira elementos do documento.
26. `src/modules/layout-composer/host/handlers.ts:165` `return { patches: [...released, { op: 'replace', path: [...path], value: next }] };` — o contêiner é substituído inteiro [escreve: EST-L01-030 via run].
27. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
28. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
29. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/modules/layout-composer/host/handlers.ts:471` `if (!breakpoint.base) {` — num tamanho menor que o desenho o traço grava comportamento responsivo (`readStroke` com `responsive`); no tamanho-base segue a leitura normal.
- R2 `src/modules/layout-composer/host/handlers.ts:481` `if (reading.selection !== null) {` — a marca retorna uma seleção: só o estado do editor muda; senão: segue para a escrita.
- R3 `src/modules/layout-composer/host/handlers.ts:487` `if (reading.operation === null || reading.result === null) return refusedWith(reading.problems);` — leitura sem operação: recusa com os problemas; senão: `src/modules/layout-composer/host/handlers.ts:488` `if (!reading.result.ok) return refusedWith(reading.result.problems);` — operação recusada pela álgebra: recusa.
- R4 `src/modules/layout-composer/host/handlers.ts:499` `if (outcome.kind !== 'change' || !dragged || reading.mode === 'repeat') return outcome;` — alça arrastada que não move nem aninha acrescenta ao `outcome` as medidas de tamanho; senão: o `outcome` fica como está.
- R5 `src/modules/layout-composer/gestures/recognize.ts:508` `if (stroke.handle !== null) return readHandle(graph, stroke, stroke.handle, naming);` — com `handle` a leitura é a da alça; sem: a do traço desenhado.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:463`); a prévia quadro a quadro roda no dono do ponteiro (`src/modules/layout-composer/interaction/tool.ts`), fora deste trecho, e o comando roda uma vez na liberação.

## Estado
- Lê: EST-L01-030 (documento), EST-L01-037 (estado do editor com o compositor), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento do contêiner recompilado), EST-L01-037 (estado do editor com a seleção).

## Resultado
- **Estado final:** o contêiner ganha a estrutura compilada do grafo mudado (`src/modules/layout-composer/host/handlers.ts:165`); a mensagem diz o que o gesto fez (`src/modules/layout-composer/host/handlers.ts:494`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel do compositor mostra a nova seleção.
- **DOM do canvas:** os elementos do contêiner são reescritos com os marcadores do compositor (`src/modules/layout-composer/host/handlers.ts:186`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:463` `export const strokeLayout = registerHandler<'layout.stroke', EditorUi>('layout.stroke', (context, { mode, points, handle }) =>` — um só tratador; cada porta (a tela, a alça) envia só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches e estado `src/modules/layout-composer/host/handlers.ts:165`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:165`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a marca escreve a seleção pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:463`).

## Medições
- nenhuma — o raio de acerto vem do zoom do estado (`src/modules/layout-composer/host/handlers.ts:454` `export const hitRadius = (state: Shown): number => HIT_RADIUS / zoomOf(state);`), cujo valor o navegador calcula fora do trecho; nenhum passo do trecho chama API de dimensão, posição, rolagem, estilo calculado, elemento sob um ponto nem ordem de foco.
