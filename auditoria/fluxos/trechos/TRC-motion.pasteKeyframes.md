# TRC-motion.pasteKeyframes
- **Chamada:** `src/app/commands.ts:290` `'motion.pasteKeyframes': pasteKeyframesCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly action?: string; readonly at?: number; readonly keyframes?: readonly CopiedKeyframe[] }`; `timeline` é a timeline, `action`/`at` a ação e `keyframes` a área de transferência do painel. A porta panel-control `timeline-motion-keyframes-paste` não declara argumento próprio (`manifest/commands/motion.json:3089` `"id": "timeline-motion-keyframes-paste",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (`keyframes`), R3 (`action`/`at`), R4 (tempo antes da ação)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:3071` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:661` `export const pasteKeyframesCommand = registerHandler('motion.pasteKeyframes', (context, { timeline, action, at, keyframes }): Outcome<never> => {` — o tratador recebe os quatro campos.
4. `src/core/motion/commands.ts:663` `  const time = playheadOf(context);` — a cola acontece no cursor. [lê: EST-L08-019 via playheadOf]
5. `src/core/motion/commands.ts:664` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
6. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
7. `src/core/motion/commands.ts:665` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
8. `src/core/motion/commands.ts:666` `  const held = actionOf(found.timeline, action, at);` — a ação pelo id, senão pelo lugar. [lê: EST-L01-030 via actionOf]
9. `src/core/motion/commands.ts:667` `  const copied = readCopied(keyframes);` — os quadros-chave da área de transferência lidos estritamente.
10. `src/core/motion/commands.ts:651` `const readCopied = (value: unknown): CopiedKeyframe[] | null => {` — exige propriedade, intervalo e valor de cada um.
11. `src/core/motion/commands.ts:668` `  if (copied === null || copied.length === 0) return { kind: 'refused', message: message('status.motion.nothingCopied') };` — área de transferência vazia recusa `status.motion.nothingCopied` (R2). [nada muda]
12. `src/core/motion/commands.ts:669` `  if (held === null) return { kind: 'change' };` — ação não encontrada: alteração vazia (R3). [nada muda]
13. `src/core/motion/commands.ts:670` `  const next = pasteKeyframes(found.timeline, held.id, time, copied, () => context.ids.next());` — a timeline com os quadros-chave colados a partir do cursor. [escreve: EST-L01-030 via run]
14. `src/core/motion/timeline.ts:252` `export function pasteKeyframes(timeline: MotionTimeline, actionId: string, time: number, copied: readonly CopiedKeyframe[], id: () => string): MotionTimeline | null {` — cada quadro-chave cai no tempo mais o intervalo, a ação crescendo para contê-los; um antes do início devolve null. [lê: EST-L01-030 via pasteKeyframes]
15. `src/core/motion/commands.ts:671` `  if (next === null) return { kind: 'refused', message: message('status.motion.recordBeforeAction', { time: (time / 1000).toFixed(2) }) };` — colar antes do início da ação recusa `status.motion.recordBeforeAction` (R4). [nada muda]
16. `src/core/motion/commands.ts:672` `  return commitTimeline(found.index, next, message('status.motion.keyframesPasted', { timeline: found.timeline.name }));` — a timeline inteira é lida antes de virar correção. [escreve: EST-L01-030 via run]
17. `src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };` — a correção substitui a timeline no índice. [escreve: EST-L01-030 via run]
18. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
19. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
20. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
21. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
22. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:665` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 8.
- R2: `src/core/motion/commands.ts:668` `  if (copied === null || copied.length === 0) return { kind: 'refused', message: message('status.motion.nothingCopied') };` — `keyframes` vazia ou ilegível recusa `status.motion.nothingCopied`; com quadros-chave segue ao passo 12.
- R3: `src/core/motion/commands.ts:669` `  if (held === null) return { kind: 'change' };` — `action`/`at` que não nomeiam ação: nada muda; nomeada segue ao passo 13.
- R4: `src/core/motion/commands.ts:671` `  if (next === null) return { kind: 'refused', message: message('status.motion.recordBeforeAction', { time: (time / 1000).toFixed(2) }) };` — colar num cursor antes do início da ação recusa `status.motion.recordBeforeAction`; dentro dela segue ao passo 16.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:661`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:203` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.time` via `playheadOf`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** a ação ganha os quadros-chave colados a partir do cursor; o documento muda (passo 18), o histórico ganha um passo (passo 19) e a mensagem é `status.motion.keyframesPasted` (passo 16).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha as trilhas com os quadros-chave novos e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:672`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `keyframes` (a área de transferência), não o rascunho pendente (`src/core/motion/commands.ts:661`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:3089` `"id": "timeline-motion-keyframes-paste",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:672`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:3089` `"id": "timeline-motion-keyframes-paste",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
