# TRC-motion.removeActions
- **Chamada:** `src/app/commands.ts:274` `'motion.removeActions': removeActionsCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly actions?: readonly string[]; readonly at?: number }`; `timeline` é a timeline, `actions` a lista de ids (a seleção) e `at` o lugar da ação única. A porta panel-control `timeline-motion-actions-delete` não declara argumento próprio (`manifest/commands/motion.json:1748` `"id": "timeline-motion-actions-delete",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (`actions`/`at`), R3 (nada removido)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:1732` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:486` `export const removeActionsCommand = registerHandler('motion.removeActions', (context, { timeline, actions, at }): Outcome<never> => {` — o tratador recebe os três campos.
4. `src/core/motion/commands.ts:487` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
5. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
6. `src/core/motion/commands.ts:488` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
7. `src/core/motion/commands.ts:489` `  const ids = actionIds(found.timeline, actions, at);` — as ações nomeadas pela lista ou pelo lugar. [lê: EST-L01-030 via actionIds]
8. `src/core/motion/commands.ts:480` `function actionIds(timeline: MotionTimeline, ids: unknown, at: number | undefined): ReadonlySet<string> | null {` — a lista de ids, senão a ação do lugar. [lê: EST-L01-030 via actionIds]
9. `src/core/motion/commands.ts:490` `  if (ids === null) return { kind: 'change' };` — sem lista nem lugar válido: alteração vazia (R2). [nada muda]
10. `src/core/motion/commands.ts:491` `  const next = removeActions(found.timeline, ids);` — a timeline sem as ações. [escreve: EST-L01-030 via run]
11. `src/core/motion/timeline.ts:42` `export function removeActions(timeline: MotionTimeline, ids: ReadonlySet<string>): MotionTimeline {` — filtra as ações fora do conjunto. [lê: EST-L01-030 via removeActions]
12. `src/core/motion/commands.ts:492` `  if (next.actions.length === found.timeline.actions.length) return { kind: 'change' };` — nada removido: alteração vazia (R3). [nada muda]
13. `src/core/motion/commands.ts:493` `  return commitTimeline(found.index, next, message('status.motion.actionsRemoved', { timeline: found.timeline.name }));` — a timeline inteira é lida antes de virar correção. [escreve: EST-L01-030 via run]
14. `src/core/motion/commands.ts:101` `function commitTimeline(index: number, next: MotionTimeline, said: Message, value: unknown = null): Outcome<never> {` — lê a timeline e devolve a correção ou a recusa.
15. `src/core/motion/read.ts:391` `export function readTimeline(value: unknown): Read<MotionTimeline> {` — a leitura estrita da timeline antes da correção.
16. `src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };` — a correção substitui a timeline no índice. [escreve: EST-L01-030 via run]
17. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
18. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a mudança do documento é reconhecida. [lê: EST-L01-030 via run]
19. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
20. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
21. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
22. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:488` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 7.
- R2: `src/core/motion/commands.ts:490` `  if (ids === null) return { kind: 'change' };` — sem `actions` válidas nem `at` que nomeie ação: nada muda; com uma lista ou um lugar segue ao passo 10.
- R3: `src/core/motion/commands.ts:492` `  if (next.actions.length === found.timeline.actions.length) return { kind: 'change' };` — nenhuma ação removida (ids que não pertencem à timeline): nada muda; removida alguma segue ao passo 13.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:486`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:203` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** a timeline perde as ações nomeadas; o documento muda (passo 17), o histórico ganha um passo (passo 19) e a mensagem é `status.motion.actionsRemoved` (passo 13).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha as barras sem as ações e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:493`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:486`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:1748` `"id": "timeline-motion-actions-delete",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:493`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:1748` `"id": "timeline-motion-actions-delete",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
