# TRC-motion.updateAction
- **Chamada:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Argumentos:** `{ readonly timeline?: string; readonly action?: string; readonly at?: number; readonly field?: string; readonly value?: unknown }`; `timeline` é a timeline, `action`/`at` a ação por id ou por lugar, `field` a opção escrita e `value` o que o campo entrega. As portas fixam o `field` e uma delas manda `value` com `pick: true` (`manifest/commands/motion.json:1518` `"id": "timeline-motion-action-pick",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (`action`/`at`), R3 (`field`/`value`), R4 (`field`/`value`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:1219` `"predicate": "always",`), que não barra nada.
3. `src/app/commands.ts:146` `const MOTION_UPDATE_ACTION = updateActionCommand<EditorUi>({ makePicking: makeMotionPicking, makePicked: makeMotionPicked });` — a instância do tratador com o construtor do estado de escolha do editor.
4. `src/core/motion/commands.ts:413` `  return registerHandler<'motion.updateAction', Ui>('motion.updateAction', (context, { timeline, action, at, field, value }): Outcome<Ui> => {` — o tratador recebe os cinco campos.
5. `src/core/motion/commands.ts:414` `    const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
6. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
7. `src/core/motion/commands.ts:415` `    if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
8. `src/core/motion/commands.ts:416` `    const held = actionOf(found.timeline, action, at);` — a ação pelo id, senão pelo lugar. [lê: EST-L01-030 via actionOf]
9. `src/core/motion/commands.ts:294` `function actionOf(timeline: MotionTimeline, id: string | undefined, at: number | undefined): TimelineAction | null {` — o id nomeia a ação, ou o lugar a nomeia.
10. `src/core/motion/commands.ts:417` `    if (held === null) return { kind: 'change' };` — ação não encontrada: alteração vazia (R2). [nada muda]
11. `src/core/motion/commands.ts:418` `    if (field === 'target' && isRecord(value) && value.pick === true) return { kind: 'change', ui: make.makePicking(make.makePicked(context.state.ui), { timeline: found.timeline.name, action: held.id }) };` — o campo `target` com `pick` liga o modo de escolha do alvo no canvas (R3). [escreve: EST-L08-019 via makeMotionPicking]
12. `src/editor/motion/state.ts:74` `export const makeMotionPicking = (ui: EditorUi, picking: { readonly timeline: string; readonly action: string }): EditorUi => withMotion(ui, { ...motionUiOf(ui), picking });` — o `ui.motion.picking` com a timeline e a ação do próximo toque.
13. `src/core/motion/commands.ts:419` `    const next = updatedAction(context, held, field, value);` — o campo decide a ação nova. [lê: EST-L01-030 via updatedAction]
14. `src/core/motion/commands.ts:324` `function updatedAction<Ui>(context: HandlerContext<Ui>, action: TimelineAction, field: string, value: unknown): TimelineAction | Outcome<never> {` — a função que trata cada `field`.
15. `src/core/motion/commands.ts:336` `      const changed: TimelineAction = { ...without('easing'), duration: EFFECTS[kind].duration, effect: defaultEffect(kind, id) };` — o campo `kind` troca o efeito pelos padrões da espécie nova (`src/core/motion/catalog.ts:171` `export function defaultEffect(kind: EffectKind, id: () => string): Effect {`).
16. `src/core/motion/commands.ts:342` `      if (isRecord(value) && typeof value.kind === 'string' && isTargetKind(value.kind)) {` — o campo `target` lê um alvo por espécie e valor; um elemento é localizado no documento (`src/core/motion/commands.ts:346` `        if (made.kind === 'element' && locate(context.state.document, made.node) === null) return invalid(made.node);`). [lê: EST-L01-030 via locate]
17. `src/core/motion/commands.ts:367` `    case 'start': {` — o campo `start` lê um tempo (`src/core/motion/commands.ts:65` `export function readTime(value: unknown): number | null {`).
18. `src/core/motion/commands.ts:373` `      if (duration === null || (!EFFECTS[action.effect.kind].timed && duration !== 0)) return invalid(value);` — a duração só vale para ação temporizada.
19. `src/core/motion/commands.ts:403` `      return invalid(field);` — campo desconhecido vira `status.motion.invalid`.
20. `src/core/motion/commands.ts:420` `    if (isOutcome(next)) return next;` — quando o campo devolve uma recusa, ela é o resultado (R4).
21. `src/core/motion/commands.ts:421` `    const cleared = make.makePicked(context.state.ui);` — qualquer outra escrita tira o modo de escolha. [escreve: EST-L08-019 via makeMotionPicked]
22. `src/editor/motion/state.ts:75` `export function makeMotionPicked(ui: EditorUi): EditorUi {` — o `ui` sem o campo `picking`.
23. `src/core/motion/commands.ts:423` `    if (JSON.stringify(next) === JSON.stringify(held)) return { kind: 'change', ...ui };` — valor que não muda a ação: alteração vazia, mas o modo de escolha ainda sai (R5). [nada muda]
24. `src/core/motion/commands.ts:424` `    const outcome = commitTimeline(found.index, replaceAction(found.timeline, held.id, () => next), message('status.motion.actionUpdated', { name: { key: effectLabel(next.effect.kind) }, timeline: found.timeline.name }), value);` — a timeline inteira é lida e a ação trocada. [escreve: EST-L01-030 via run]
25. `src/core/motion/timeline.ts:46` `export function replaceAction(timeline: MotionTimeline, id: string, change: (action: TimelineAction) => TimelineAction): MotionTimeline {` — troca só a ação do id. [lê: EST-L01-030 via replaceAction]
26. `src/core/motion/commands.ts:425` `    return outcome.kind === 'change' ? { ...outcome, ...ui } : outcome;` — a correção leva também o `ui` do modo de escolha. [escreve: EST-L01-037 via run]
27. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
28. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — o `ui` do resultado passa ao estado. [escreve: EST-L01-037 via run]
29. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
30. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
31. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
32. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:415` `    if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 8.
- R2: `src/core/motion/commands.ts:417` `    if (held === null) return { kind: 'change' };` — `action`/`at` que não nomeiam ação: nada muda; nomeada segue ao passo 11.
- R3: `src/core/motion/commands.ts:418` `    if (field === 'target' && isRecord(value) && value.pick === true) return { kind: 'change', ui: make.makePicking(make.makePicked(context.state.ui), { timeline: found.timeline.name, action: held.id }) };` — `field` `target` com `pick` liga o modo de escolha; sem `pick` segue ao passo 13.
- R4: `src/core/motion/commands.ts:420` `    if (isOutcome(next)) return next;` — quando `updatedAction` devolve uma recusa (`status.motion.invalid`, `status.motion.needsClass`, `status.motion.needsComponent`) ela é o resultado; quando devolve a ação segue ao passo 21.
- R5: `src/core/motion/commands.ts:423` `    if (JSON.stringify(next) === JSON.stringify(held)) return { kind: 'change', ...ui };` — valor que não muda a ação: nada no documento, mas o modo de escolha sai; mudada segue ao passo 24.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:413`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; as portas panel-control (`src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`) e a porta de clique no canvas (`src/editor/input/pointer/effects.ts:254` `if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`) não interpõem await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`), EST-L08-019 (`ui.motion.picking`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-037 (`state.ui`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`), EST-L08-019 (`ui.motion.picking`).

## Resultado
- **Estado final:** a ação do id muda; o documento muda (passo 27), o histórico ganha um passo (passo 29) e a mensagem é `status.motion.actionUpdated` (passo 24); o modo de escolha sai (passo 21).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha os campos da ação e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:424`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `value` do campo, não o rascunho pendente (`src/core/motion/commands.ts:413`).
- G3: ok — as treze portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,` e enviam só o `field` próprio com o valor; o tratador decide por ele (`src/core/motion/commands.ts:324`).
- G4: n/a — o tratador só devolve correção, `ui` e mensagem (`src/core/motion/commands.ts:424`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; as portas vivem na colocação do painel (`manifest/commands/motion.json:1238` `"id": "timeline-motion-action-kind",`).
- G6: ok — a seleção de elementos não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:424` `    const outcome = commitTimeline(found.index, replaceAction(found.timeline, held.id, () => next), message('status.motion.actionUpdated', { name: { key: effectLabel(next.effect.kind) }, timeline: found.timeline.name }), value);`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
