# TRC-layout.place
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:541` `export const placeLayout = registerHandler<'layout.place', EditorUi>('layout.place', (context, { target: named, dx, dy, edges }) =>`
- **Argumentos:** `{ target?: NodeId, dx: number, dy: number, edges: enum [move, n, s, e, w, ne, nw, se, sw] }` — o manifesto (`manifest/commands/layout-composer.json:556` `"target": {`, `manifest/commands/layout-composer.json:561` `"dx": {`, `manifest/commands/layout-composer.json:566` `"dy": {`, `manifest/commands/layout-composer.json:571` `"edges": {`).
- **Ramos que dependem dos argumentos:** R2 e R3 (o `target` decide de quem é a região; o `dx`, o `dy` e o `edges` decidem o movimento ou o redimensionamento).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o arraste com a ferramenta Selecionar).
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador (a disponibilidade é `always`, sem predicado de domínio).
7. `src/modules/layout-composer/host/handlers.ts:542` `guarded(context, () => {` — o corpo passa por `guarded`.
8. `src/modules/layout-composer/host/handlers.ts:543` `if (!activeBreakpoint(context.state).base) return drawAtBase();` — num tamanho menor recusa `layout.respond.drawAtBase` (R1).
9. `src/modules/layout-composer/host/handlers.ts:544` `const tree = pageShown(context.state)?.tree;` — a árvore da página mostrada [lê: EST-L01-030 via pageShown] [lê: EST-L01-037 via pageShown].
10. `src/modules/layout-composer/host/handlers.ts:546` `const target = typeof named === 'string' ? named : context.state.selection.length === 1 ? context.state.selection[0] : undefined;` — a região alvo vem do argumento, senão da seleção (R2).
11. `src/modules/layout-composer/host/handlers.ts:547` `const owner = tree === undefined || target === undefined ? null : regionOf(tree, target);` — o contêiner composto de que o elemento é região é achado [lê: EST-L01-030 via regionOf].
12. `src/modules/layout-composer/host/handlers.ts:550` `if (owner === null || at === null || held === null || tree === undefined) return refusedWith([{ code: 'not-a-region', params: {} }]);` — elemento que não é região: recusa.
13. `src/modules/layout-composer/host/handlers.ts:551` `if (typeof dx !== 'number' || typeof dy !== 'number' || !PLACE_EDGES.includes(edges as PlaceEdges)) throw new Error('layout.place: a door hands a travel and the edges it moves');` — a forma dos argumentos é conferida.
14. `src/modules/layout-composer/host/handlers.ts:553` `const back = readBack(context, owner.container, namesFromElements(owner.container, held.intent));` — o que a página tem agora é relido primeiro.
15. `src/modules/layout-composer/host/handlers.ts:554` `if (findRegion(back.intent, owner.region) === undefined) return refusedWith([{ code: 'not-a-region', params: {} }]);` — a região sumiu: recusa.
16. `src/modules/layout-composer/host/handlers.ts:558` `const scale = measured === null || !(measured.width > 0) ? 1 : record.intent.viewport.width / measured.width;` — o deslocamento em px da página, em px do contêiner [lê: EST-L01-030 via layout.box].
17. `src/modules/layout-composer/host/handlers.ts:559` `const reading = readPlace(record.intent, owner.region, edges as PlaceEdges, dx * scale, dy * scale, hitRadius(context.state), naming(context));` — o movimento ou o redimensionamento é lido (R3).
18. `src/modules/layout-composer/gestures/recognize.ts:379` `export function readPlace(graph: LayoutIntent, id: string, edges: PlaceEdges, dx: number, dy: number, radius: number, naming: Naming): StrokeReading {` — a leitura da ferramenta Selecionar.
19. `src/modules/layout-composer/host/handlers.ts:560` `if (reading.operation === null || reading.result === null) return refusedWith(reading.problems);` — leitura vazia: recusa. `src/modules/layout-composer/host/handlers.ts:561` `if (!reading.result.ok) return refusedWith(reading.result.problems);` — operação recusada: recusa.
20. `src/modules/layout-composer/host/handlers.ts:562` `const graph = inferMeaning(reading.result.graph, { name: (key) => context.words(`layout.template.part.${key}` as MessageId), numbered: (n) => context.words('layout.label.region' as MessageId, { n }), generic: numberedWith(context.words) }, tree.id === owner.container.id);` — o significado das regiões é relido.
21. `src/modules/layout-composer/host/handlers.ts:564` `const next = structured(context, releasedSizes(context, back.container), record, graph, false);` — o contêiner é compilado de novo, sem os tamanhos declarados.
22. `src/modules/layout-composer/host/handlers.ts:565` `const replaced = containerWrite(context, owner.container, at.path, next);` — o contêiner é escrito [escreve: EST-L01-030 via run].
23. `src/modules/layout-composer/host/handlers.ts:569` `return { kind: 'change', patches: replaced.patches, message: said };` — o `outcome` leva os patches e a mensagem.
24. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
25. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
26. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/modules/layout-composer/host/handlers.ts:543` `if (!activeBreakpoint(context.state).base) return drawAtBase();` — num ponto de quebra menor: recusa `layout.respond.drawAtBase`; no base: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:546` `const target = typeof named === 'string' ? named : context.state.selection.length === 1 ? context.state.selection[0] : undefined;` — com `target`: a região nomeada; sem e com um selecionado: ele; sem nada: `undefined` e a recusa `not-a-region`.
- R3 `src/modules/layout-composer/gestures/recognize.ts:385` `if (edges === 'move') return readMove(graph, stroke, region, 'move', naming);` — `move`: a região anda; as bordas (`n`, `s`, `e`, `w`, cantos): a região é redimensionada `src/modules/layout-composer/gestures/recognize.ts:420` `const resize: Operation = { kind: 'resize-region', id: region.id, box };`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:541`); a porta é o arraste de canvas, sem leitura de arquivo, então `dispatch` roda direto (`src/editor/doors/door.tsx:144`).

## Estado
- Lê: EST-L01-030 (documento), EST-L01-037 (estado do editor com o compositor e a seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento do contêiner recompilado), EST-L01-037 (estado do editor).

## Resultado
- **Estado final:** a região vai para onde foi posta, ou muda de tamanho pelas bordas (`src/modules/layout-composer/host/handlers.ts:559`); a mensagem diz o movimento ou o tamanho (`src/modules/layout-composer/host/handlers.ts:568`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem.
- **DOM do canvas:** o contêiner é reescrito com a região na nova caixa (`src/modules/layout-composer/host/handlers.ts:565`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:541` `export const placeLayout = registerHandler<'layout.place', EditorUi>('layout.place', (context, { target: named, dx, dy, edges }) =>` — um só tratador; as portas enviam só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches `src/modules/layout-composer/host/handlers.ts:565`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:569`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:541`).

## Medições
- nenhuma — a caixa do contêiner vem da porta `Layout` (`src/modules/layout-composer/host/handlers.ts:557` `const measured = context.layout.box(owner.container.id);`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
