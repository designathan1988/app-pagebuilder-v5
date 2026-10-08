# TRC-motion.addAction
- **Chamada:** `src/app/commands.ts:271` `'motion.addAction': addActionCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly kind?: string; readonly placement?: string }`; `timeline` é a timeline, `kind` a espécie da ação e `placement` (`after`, `with` ou `at`) onde ela começa. As três portas panel-control fixam o `placement` (`manifest/commands/motion.json:1090` `"id": "timeline-motion-add-action-after",` … `manifest/commands/motion.json:1146` `"id": "timeline-motion-add-action-at",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (`kind`), R3 (`placement`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:1073` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:299` `export const addActionCommand = registerHandler('motion.addAction', (context, { timeline, kind, placement }): Outcome<never> => {` — o tratador recebe os três campos.
4. `src/core/motion/commands.ts:300` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
5. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
6. `src/core/motion/commands.ts:301` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
7. `src/core/motion/commands.ts:302` `  if (!isEffectKind(kind)) return invalid(kind);` — espécie que o catálogo não tem vira `status.motion.invalid` (R2). [nada muda]
8. `src/core/motion/catalog.ts:165` `export const isEffectKind = (value: string): value is EffectKind => Object.hasOwn(EFFECTS, value);` — a tabela de espécies do catálogo.
9. `src/core/motion/commands.ts:308` `    start: placementStart(found.timeline, (placement ?? 'after') as Placement, playheadOf(context)),` — onde a ação começa: depois de tudo, no início da última, ou no cursor (R3). [lê: EST-L01-030 via placementStart]
10. `src/core/motion/timeline.ts:28` `export function placementStart(timeline: MotionTimeline, placement: Placement, time: number): number {` — o cálculo do início pelo `placement`.
11. `src/core/motion/commands.ts:309` `    duration: EFFECTS[kind].duration,` — a duração padrão da espécie (`src/core/motion/catalog.ts:137` `export const EFFECTS = {`). [nada muda]
12. `src/core/motion/commands.ts:310` `    effect: defaultEffect(kind, id),` — o efeito novo com os valores padrão da espécie (`src/core/motion/catalog.ts:171` `export function defaultEffect(kind: EffectKind, id: () => string): Effect {`). [nada muda]
13. `src/core/motion/commands.ts:312` `  return commitTimeline(found.index, addAction(found.timeline, action), message('status.motion.actionAdded', { name: { key: effectLabel(kind) }, timeline: found.timeline.name }));` — a ação nova entra na timeline e a timeline inteira é lida antes de virar correção. [escreve: EST-L01-030 via run]
14. `src/core/motion/timeline.ts:40` `export const addAction = (timeline: MotionTimeline, action: TimelineAction): MotionTimeline => ({ ...timeline, actions: [...timeline.actions, action] });` — a lista de ações ganha a ação no fim. [lê: EST-L01-030 via addAction]
15. `src/core/motion/commands.ts:101` `function commitTimeline(index: number, next: MotionTimeline, said: Message, value: unknown = null): Outcome<never> {` — lê a timeline e devolve a correção ou a recusa.
16. `src/core/motion/read.ts:391` `export function readTimeline(value: unknown): Read<MotionTimeline> {` — a leitura estrita da timeline antes da correção.
17. `src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };` — a correção substitui a timeline no índice. [escreve: EST-L01-030 via run]
18. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
19. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a mudança do documento é reconhecida. [lê: EST-L01-030 via run]
20. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
21. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
22. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
23. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:301` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 7.
- R2: `src/core/motion/commands.ts:302` `  if (!isEffectKind(kind)) return invalid(kind);` — `kind` que o catálogo não tem vira `status.motion.invalid`; conhecida segue ao passo 9.
- R3: `src/core/motion/commands.ts:308` `    start: placementStart(found.timeline, (placement ?? 'after') as Placement, playheadOf(context)),` — `placement` `at` usa o cursor (`src/core/motion/commands.ts:97` `const playheadOf = <Ui>(context: HandlerContext<Ui>): number => context.motion?.playhead ?? 0;`), `with` o início da última ação, e `after` (o padrão) o fim de tudo.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:299`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.time` via `playheadOf`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** a timeline ganha uma ação nova no lugar pedido; o documento muda (passo 18), o histórico ganha um passo (passo 20) e a mensagem é `status.motion.actionAdded` (passo 13).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha as barras das ações e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); a timeline não muda o desenho até a prévia ou execução.

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:312`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:299`).
- G3: ok — as três portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:271` `'motion.addAction': addActionCommand,` e enviam só o `placement`; o tratador decide por ele (`src/core/motion/commands.ts:308`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:312`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:1090` `"id": "timeline-motion-add-action-after",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
