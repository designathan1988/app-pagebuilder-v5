# TRC-motion.editKeyframe
- **Chamada:** `src/app/commands.ts:286` `'motion.editKeyframe': editKeyframeCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly keyframe?: KeyframeRef; readonly at?: number; readonly property?: string; readonly keyframeAt?: number; readonly field?: string; readonly value?: string }`; `timeline` é a timeline, `keyframe` (ou `at`/`property`/`keyframeAt`) nomeia o quadro-chave, `field` diz o que se escreve (`value`, `easing`, `time` ou a propriedade) e `value` o que o campo entrega. As quatro portas panel-control fixam o `field` (`manifest/commands/motion.json:2728` `"id": "timeline-motion-keyframe-value",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (`keyframe`/`at`/`property`/`keyframeAt`), R3 (`field`/`value`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:2711` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:596` `export const editKeyframeCommand = registerHandler('motion.editKeyframe', (context, { timeline, keyframe, at, property, keyframeAt, field, value }): Outcome<never> => {` — o tratador recebe os sete campos.
4. `src/core/motion/commands.ts:597` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
5. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
6. `src/core/motion/commands.ts:598` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
7. `src/core/motion/commands.ts:599` `  const [ref] = keyframeRefs(found.timeline, { keyframes: keyframe === undefined ? undefined : [keyframe], at, property, keyframeAt }) ?? [];` — o quadro-chave pelo id, senão pelo lugar. [lê: EST-L01-030 via keyframeRefs]
8. `src/core/motion/commands.ts:543` `function keyframeRefs(timeline: MotionTimeline, given: { readonly keyframes?: unknown; readonly at?: number | undefined; readonly property?: string | undefined; readonly keyframeAt?: number | undefined }): KeyframeRef[] | null {` — a lista de referências, senão a do lugar (ação, trilha e quadro-chave). [lê: EST-L01-030 via keyframeRefs]
9. `src/core/motion/commands.ts:600` `  if (ref === undefined) return { kind: 'change' };` — quadro-chave não encontrado: alteração vazia (R2). [nada muda]
10. `src/core/motion/commands.ts:604` `    if (text === null || text === '') return invalid(value);` — o campo `value` sem texto vira `status.motion.invalid`; com texto troca o valor (R3). [nada muda]
11. `src/core/motion/timeline.ts:124` `export function editKeyframe(timeline: MotionTimeline, ref: KeyframeRef, change: { readonly value?: string; readonly easing?: string | null; readonly time?: number }): MotionTimeline {` — troca o valor, a aceleração ou o tempo do quadro-chave do id. [lê: EST-L01-030 via editKeyframe]
12. `src/core/motion/commands.ts:610` `    next = editKeyframe(found.timeline, ref, { easing: text === '' ? null : text });` — o campo `easing` vazio tira a aceleração do trecho (R3). [nada muda]
13. `src/core/motion/commands.ts:616` `    next = editKeyframe(found.timeline, ref, { time: time - owner.start });` — o campo `time` é o tempo da timeline; o quadro-chave é medido do início da ação, preso entre os vizinhos (`src/core/motion/timeline.ts:147` `            next = { ...next, time: Math.min(high, Math.max(low, Math.round(change.time))) };`). [lê: EST-L01-030 via editKeyframe]
14. `src/core/motion/commands.ts:621` `    next = replaceAction(found.timeline, ref.action, (owner) =>` — o campo da propriedade renomeia a trilha (R3). [nada muda]
15. `src/core/motion/commands.ts:623` `        ? { ...owner, effect: { ...owner.effect, tracks: owner.effect.tracks.map((track) => (track.id === ref.track ? { ...track, property: renamed } : track)) } }` — a trilha do id ganha a propriedade nova. [nada muda]
16. `src/core/motion/commands.ts:627` `  if (JSON.stringify(next) === JSON.stringify(found.timeline)) return { kind: 'change' };` — valor que não muda a timeline: alteração vazia (R3). [nada muda]
17. `src/core/motion/commands.ts:628` `  return commitTimeline(found.index, next, message('status.motion.keyframeEdited', { timeline: found.timeline.name }), value);` — a timeline inteira é lida antes de virar correção. [escreve: EST-L01-030 via run]
18. `src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };` — a correção substitui a timeline no índice. [escreve: EST-L01-030 via run]
19. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
20. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
21. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
22. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
23. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:598` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 7.
- R2: `src/core/motion/commands.ts:600` `  if (ref === undefined) return { kind: 'change' };` — `keyframe`/`at`/`property`/`keyframeAt` que não nomeiam quadro-chave: nada muda; nomeado segue ao passo 10.
- R3: `src/core/motion/commands.ts:601` `  let next: MotionTimeline;` — `field` `value` troca o valor (passo 10), `easing` a aceleração (passo 12), `time` o tempo (passo 13) e qualquer outro o nome da propriedade (passo 14); `value` que não muda a timeline devolve nada (passo 16).

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:596`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** um quadro-chave muda de valor, aceleração, tempo ou propriedade; o documento muda (passo 19), o histórico ganha um passo (passo 20) e a mensagem é `status.motion.keyframeEdited` (passo 17).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha o quadro-chave e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:628`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `value` do campo, não o rascunho pendente (`src/core/motion/commands.ts:596`).
- G3: ok — as quatro portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:286` `'motion.editKeyframe': editKeyframeCommand,` e enviam só o `field` próprio com o valor; o tratador decide por eles (`src/core/motion/commands.ts:601`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:628`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; as portas vivem na colocação do painel (`manifest/commands/motion.json:2728` `"id": "timeline-motion-keyframe-value",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
