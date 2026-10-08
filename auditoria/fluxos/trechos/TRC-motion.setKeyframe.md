# TRC-motion.setKeyframe
- **Chamada:** `src/app/commands.ts:285` `'motion.setKeyframe': setKeyframeCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly action?: string; readonly at?: number; readonly property?: string; readonly value?: string }`; `timeline` é a timeline, `action`/`at` a ação por id ou lugar, `property` a propriedade e `value` o valor escrito (vazio: o valor da vizinhança). As portas panel-control `timeline-motion-add-keyframe` e `timeline-motion-add-property` (`manifest/commands/motion.json:2610` `"id": "timeline-motion-add-keyframe",`) entregam a propriedade.
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (`action`/`at`), R4 (`value`), R5 (`property`/`value`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:2591` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:577` `export const setKeyframeCommand = registerHandler('motion.setKeyframe', (context, { timeline, action, at, property, value }): Outcome<never> => {` — o tratador recebe os cinco campos.
4. `src/core/motion/commands.ts:579` `  const time = playheadOf(context);` — o quadro-chave nasce no cursor. [lê: EST-L08-019 via playheadOf]
5. `src/core/motion/commands.ts:580` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
6. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
7. `src/core/motion/commands.ts:581` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
8. `src/core/motion/commands.ts:582` `  const held = actionOf(found.timeline, action, at);` — a ação pelo id, senão pelo lugar. [lê: EST-L01-030 via actionOf]
9. `src/core/motion/commands.ts:583` `  if (held === null) return { kind: 'change' };` — ação não encontrada: alteração vazia (R2). [nada muda]
10. `src/core/motion/commands.ts:584` `  if (held.effect.kind !== 'animate' && held.effect.kind !== 'split-text') return { kind: 'refused', message: message('status.motion.notKeyed', { name: { key: effectLabel(held.effect.kind) } }) };` — efeito que não guarda trilhas recusa `status.motion.notKeyed` (R3). [nada muda]
11. `src/core/motion/commands.ts:585` `  const named = property.trim();` — a propriedade aparada. [nada muda]
12. `src/core/motion/commands.ts:586` `  const local = Math.round(time) - held.start;` — o tempo local, medido do início da ação. [nada muda]
13. `src/core/motion/commands.ts:587` `  if (local < 0) return { kind: 'refused', message: message('status.motion.recordBeforeAction', { time: (time / 1000).toFixed(2) }) };` — cursor antes do início da ação recusa `status.motion.recordBeforeAction` (R4). [nada muda]
14. `src/core/motion/commands.ts:588` `  const text = value === undefined || value.trim() === '' ? startingValue(held, named, local) : value.trim();` — sem valor, o valor da vizinhança; com valor, ele mesmo (R5). [lê: EST-L01-030 via startingValue]
15. `src/core/motion/commands.ts:554` `function startingValue(action: TimelineAction, property: string, local: number): string | null {` — o valor do quadro-chave anterior mais próximo, senão o primeiro da trilha, senão o valor inicial da propriedade (`src/core/motion/commands.ts:564` `const PART_IDENTITY: Readonly<Record<string, string>> = {`).
16. `src/core/motion/commands.ts:589` `  if (text === null || named === '') return invalid(property);` — propriedade vazia ou valor ilegível vira `status.motion.invalid` (R5). [nada muda]
17. `src/core/motion/commands.ts:591` `  const grown = local > held.duration ? { ...held, duration: local } : held;` — quadro-chave além do fim estende a ação para contê-lo. [nada muda]
18. `src/core/motion/commands.ts:592` `  const next = setKeyframeAt(grown, named, local, text, undefined, () => context.ids.next());` — a ação com o quadro-chave posto na propriedade e no tempo. [lê: EST-L01-030 via setKeyframeAt]
19. `src/core/motion/timeline.ts:104` `export function setKeyframeAt(action: TimelineAction, property: string, time: number, value: string, easing: string | undefined, id: () => string): TimelineAction {` — a trilha nova quando não há, ou valor e aceleração trocados no quadro-chave do tempo. [lê: EST-L01-030 via setKeyframeAt]
20. `src/core/motion/commands.ts:593` `  return commitTimeline(found.index, replaceAction(found.timeline, held.id, () => next), message('status.motion.keyframeSet', { property: named, time: (time / 1000).toFixed(2) }), value ?? property);` — a timeline inteira é lida antes de virar correção. [escreve: EST-L01-030 via run]
21. `src/core/motion/timeline.ts:46` `export function replaceAction(timeline: MotionTimeline, id: string, change: (action: TimelineAction) => TimelineAction): MotionTimeline {` — troca só a ação do id. [lê: EST-L01-030 via replaceAction]
22. `src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };` — a correção substitui a timeline no índice. [escreve: EST-L01-030 via run]
23. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
24. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
25. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
26. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
27. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:581` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 8.
- R2: `src/core/motion/commands.ts:583` `  if (held === null) return { kind: 'change' };` — `action`/`at` que não nomeiam ação: nada muda; nomeada segue ao passo 10.
- R3: `src/core/motion/commands.ts:584` `  if (held.effect.kind !== 'animate' && held.effect.kind !== 'split-text') return { kind: 'refused', message: message('status.motion.notKeyed', { name: { key: effectLabel(held.effect.kind) } }) };` — efeito sem trilhas recusa `status.motion.notKeyed`; animação segue ao passo 11.
- R4: `src/core/motion/commands.ts:587` `  if (local < 0) return { kind: 'refused', message: message('status.motion.recordBeforeAction', { time: (time / 1000).toFixed(2) }) };` — cursor antes do início da ação recusa `status.motion.recordBeforeAction`; dentro dela segue ao passo 14.
- R5: `src/core/motion/commands.ts:588` `  const text = value === undefined || value.trim() === '' ? startingValue(held, named, local) : value.trim();` — `value` vazio toma o valor da vizinhança, senão o escrito; `property` vazia ou valor ilegível (passo 16) vira `status.motion.invalid`.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:577`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.time` via `playheadOf`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** a ação ganha ou atualiza um quadro-chave da propriedade no cursor; o documento muda (passo 23), o histórico ganha um passo (passo 24) e a mensagem é `status.motion.keyframeSet` (passo 20).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha a trilha da propriedade e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:593`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `value` do campo, não o rascunho pendente (`src/core/motion/commands.ts:577`).
- G3: ok — as duas portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:285` `'motion.setKeyframe': setKeyframeCommand,` e enviam só a `property` (com o valor); o tratador decide por eles (`src/core/motion/commands.ts:588`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:593`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; as portas vivem na colocação do painel (`manifest/commands/motion.json:2610` `"id": "timeline-motion-add-keyframe",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
