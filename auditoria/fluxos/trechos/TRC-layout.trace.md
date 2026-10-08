# TRC-layout.trace
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:878` `export const traceLayout = registerHandler<'layout.trace', EditorUi>('layout.trace', (context, { luminance }) =>`
- **Argumentos:** `{ luminance?: json }` — o manifesto (`manifest/commands/layout-composer.json:1632` `"luminance": {`).
- **Ramos que dependem dos argumentos:** R2 e R3 (a `luminance` decide se a leitura da imagem é aceita; o comando exige uma referência escolhida).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o botão Decalcar do painel).
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só decalca com um contêiner composto [lê: EST-L01-037 via composerOf].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
9. `src/modules/layout-composer/host/handlers.ts:879` `guarded(context, () => {` — o corpo passa por `guarded`.
10. `src/modules/layout-composer/host/handlers.ts:880` `const { record } = composed(context);` — o registro do compositor [lê: EST-L01-030 via composed] [lê: EST-L01-037 via composed].
11. `src/modules/layout-composer/host/handlers.ts:881` `const held = record.intent.reference;` — a imagem de referência guardada é lida [lê: EST-L01-030 via recordOf].
12. `src/modules/layout-composer/host/handlers.ts:882` `if (held === undefined) throw new LayoutRefusal('no-reference');` — sem referência escolhida: recusa `no-reference` (R2).
13. `src/modules/layout-composer/host/handlers.ts:883` `if (!isLuminance(luminance)) throw new LayoutRefusal('trace-reading');` — leitura de imagem inválida: recusa `trace-reading` (R3).
14. `src/modules/layout-composer/host/handlers.ts:884` `const blocks = traceBlocks(luminance);` — os blocos da imagem são achados por cortes recursivos.
15. `src/modules/layout-composer/adapters/reference.ts:74` `export function traceBlocks(image: Luminance, options: TraceOptions = TRACE_DEFAULTS): Cell[] {` — o leitor de blocos.
16. `src/modules/layout-composer/host/handlers.ts:885` `const operation = traceRegions(record.intent, blocks, luminance, held.box, naming(context));` — os blocos viram regiões desenhadas sobre a caixa da referência.
17. `src/modules/layout-composer/adapters/reference.ts:101` `export function traceRegions(graph: LayoutIntent, blocks: readonly Cell[], image: Luminance, box: Box, naming: Naming): Operation {` — a operação de desenhar os blocos.
18. `src/modules/layout-composer/host/handlers.ts:886` `const outcome = operate(context, operation, []);` — a operação roda sobre o grafo.
19. `src/modules/layout-composer/gestures/operations.ts:497` `if (problems.length > 0) return { ok: false, problems };` — operação recusada: sem grafo.
20. `src/modules/layout-composer/host/handlers.ts:165` `return { patches: [...released, { op: 'replace', path: [...path], value: next }] };` — o contêiner é escrito de novo [escreve: EST-L01-030 via run].
21. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
22. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
23. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto: recusa `layout.inactive`; composto: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:882` `if (held === undefined) throw new LayoutRefusal('no-reference');` — sem imagem de referência: recusa `no-reference`; com ela: segue.
- R3 `src/modules/layout-composer/host/handlers.ts:883` `if (!isLuminance(luminance)) throw new LayoutRefusal('trace-reading');` — luminância fora da forma esperada: recusa `trace-reading`; válida: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:878`); a leitura dos pixels (`src/modules/layout-composer/interaction/luminance.ts` `await image.decode()`) roda no painel antes do despacho, fora deste trecho.

## Estado
- Lê: EST-L01-030 (documento), EST-L01-037 (estado do editor com o compositor), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento do contêiner com as regiões decalcadas), EST-L01-037 (estado do editor).

## Resultado
- **Estado final:** os blocos da imagem entram como regiões sobre a caixa da referência (`src/modules/layout-composer/host/handlers.ts:886`); a mensagem é `layout.status.traced` com o número de blocos.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel do compositor mostra as regiões novas.
- **DOM do canvas:** o contêiner é reescrito com as regiões decalcadas (`src/modules/layout-composer/host/handlers.ts:165`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:878` `export const traceLayout = registerHandler<'layout.trace', EditorUi>('layout.trace', (context, { luminance }) =>` — um só tratador; a porta envia só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches `src/modules/layout-composer/host/handlers.ts:165`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:887`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:878`).

## Medições
- nenhuma — a luminância vem do painel (`src/modules/layout-composer/ui/panel.tsx`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
