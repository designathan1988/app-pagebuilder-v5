# TRC-layout.template
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:827` `export const templateLayout = registerHandler<'layout.template', EditorUi>('layout.template', (context, { template }) =>`
- **Argumentos:** `{ template: enum [dashboard, landing, sidebar, article, gallery] }` — o manifesto (`manifest/commands/layout-composer.json:1447` `"template": {`).
- **Ramos que dependem dos argumentos:** R3 (o `template` escolhe a estrutura embutida; a seleção decide o alvo).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o segmento de modelo do painel).
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só coloca um modelo com um contêiner composto [lê: EST-L01-037 via composerOf].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
9. `src/modules/layout-composer/host/handlers.ts:828` `guarded(context, () => {` — o corpo passa por `guarded`.
10. `src/modules/layout-composer/host/handlers.ts:829` `const { state, record } = composed(context);` — o estado do compositor e o registro [lê: EST-L01-030 via composed] [lê: EST-L01-037 via composed].
11. `src/modules/layout-composer/host/handlers.ts:831` `const made = builtInTemplate(template as BuiltInTemplate, words);` — o modelo embutido é montado nas palavras da pessoa (R3).
12. `src/modules/layout-composer/intent/templates.ts:188` `export function builtInTemplate(kind: BuiltInTemplate, words: (key: string) => string): LayoutTemplate {` — as estruturas embutidas.
13. `src/modules/layout-composer/host/handlers.ts:832` `const one = state.selection.length === 1 ? findRegion(record.intent, state.selection[0] as string) : undefined;` — a região selecionada, se uma só.
14. `src/modules/layout-composer/host/handlers.ts:834` `one !== undefined && one.kind !== 'content' && childrenOf(record.intent, one.id).length === 0` — o alvo é a região vazia selecionada; senão o contêiner inteiro sem regiões.
15. `src/modules/layout-composer/host/handlers.ts:839` `if (target === null) throw new LayoutRefusal('template', { name: made.name });` — sem lugar: recusa `template`.
16. `src/modules/layout-composer/intent/templates.ts:103` `export function placeTemplate(graph: LayoutIntent, template: LayoutTemplate, target: { readonly parent: string | null; readonly box: Box }, values: Readonly<Record<string, number>>, naming: Naming): Operation {` — a operação que coloca o modelo.
17. `src/modules/layout-composer/host/handlers.ts:840` `const outcome = operate(context, placeTemplate(record.intent, made, target, {}, naming(context)), []);` — a operação roda sobre o grafo.
18. `src/modules/layout-composer/gestures/operations.ts:497` `if (problems.length > 0) return { ok: false, problems };` — operação recusada: sem grafo.
19. `src/modules/layout-composer/host/handlers.ts:165` `return { patches: [...released, { op: 'replace', path: [...path], value: next }] };` — o contêiner é escrito de novo [escreve: EST-L01-030 via run].
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto: recusa `layout.inactive`; composto: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:834` `one !== undefined && one.kind !== 'content' && childrenOf(record.intent, one.id).length === 0` — uma região vazia selecionada: o modelo entra dentro dela; sem seleção e sem regiões: entra no contêiner inteiro; qualquer outra: `target` é `null` e a recusa `template`.
- R3 `src/modules/layout-composer/host/handlers.ts:831` `const made = builtInTemplate(template as BuiltInTemplate, words);` — o `template` escolhe a estrutura embutida (dashboard, landing, sidebar, article, gallery).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:827`); o segmento do painel não lê arquivo, então `dispatch` roda direto (`src/editor/doors/door.tsx:144`).

## Estado
- Lê: EST-L01-030 (documento), EST-L01-037 (estado do editor com o compositor e a seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento do contêiner com o modelo), EST-L01-037 (estado do editor).

## Resultado
- **Estado final:** as regiões do modelo entram no alvo, escaladas à sua caixa (`src/modules/layout-composer/host/handlers.ts:840`); a mensagem é `layout.status.templated`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel do compositor mostra os elementos novos.
- **DOM do canvas:** o contêiner é reescrito com a estrutura do modelo (`src/modules/layout-composer/host/handlers.ts:165`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:827` `export const templateLayout = registerHandler<'layout.template', EditorUi>('layout.template', (context, { template }) =>` — um só tratador; a porta envia só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches `src/modules/layout-composer/host/handlers.ts:165`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:841`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:827`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o trecho lê o grafo e devolve patches.
