# TRC-motion.resizeAction
- **Chamada:** `src/app/commands.ts:276` `'motion.resizeAction': resizeActionCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly action?: string; readonly at?: number; readonly edge?: string; readonly delta?: number; readonly distance?: number }`; `timeline` é a timeline, `action`/`at` a ação, `edge` a borda arrastada (`start` ou `end`) e o movimento chega como `delta` (ms) ou `distance` (px). As duas portas panel-drag fixam o `edge` (`manifest/commands/motion.json:1903` `"id": "panel-drag-motion-bar-start",` … `manifest/commands/motion.json:1925` `"id": "panel-drag-motion-bar-end",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (`action`/`at` e `delta`/`distance`), R3 (ação instantânea), R4 (nada mudou)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:1886` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:516` `export const resizeActionCommand = registerHandler('motion.resizeAction', (context, { timeline, action, at, edge, delta, distance }): Outcome<never> => {` — o tratador recebe os seis campos. O manifesto marca a transação por gesto (`manifest/commands/motion.json:1898` `        "transaction": "per-gesture",`).
4. `src/core/motion/commands.ts:517` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
5. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
6. `src/core/motion/commands.ts:518` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
7. `src/core/motion/commands.ts:519` `  const held = actionOf(found.timeline, action, at);` — a ação pelo id, senão pelo lugar. [lê: EST-L01-030 via actionOf]
8. `src/core/motion/commands.ts:520` `  const moved = deltaOf(delta, distance, dragPixelsPerSecond());` — o deslocamento em ms (R2). [nada muda]
9. `src/core/motion/commands.ts:497` `const deltaOf = (delta: number | undefined, distance: number | undefined, pixelsPerSecond: number): number | null =>` — o `delta` em ms, senão a `distance` convertida, senão nada.
10. `src/core/motion/commands.ts:521` `  if (held === null || moved === null) return { kind: 'change' };` — sem ação ou sem deslocamento: alteração vazia (R2). [nada muda]
11. `src/core/motion/commands.ts:522` `  if (!EFFECTS[held.effect.kind].timed) return { kind: 'refused', message: message('status.motion.instant', { name: { key: effectLabel(held.effect.kind) } }) };` — ação instantânea não tem comprimento a mudar: recusa `status.motion.instant` (R3). [nada muda]
12. `src/core/motion/commands.ts:523` `  const next = resizeAction(found.timeline, held.id, edge, moved, MINIMUM_DURATION);` — a ação redimensionada pela borda. [escreve: EST-L01-030 via run]
13. `src/core/motion/timeline.ts:80` `export function resizeAction(timeline: MotionTimeline, id: string, edge: 'start' | 'end', delta: number, minimum: number): MotionTimeline {` — a borda final guarda o início; a inicial guarda o fim e nunca cai abaixo do mínimo. [lê: EST-L01-030 via resizeAction]
14. `src/core/motion/commands.ts:524` `  const resized = next.actions.find((one) => one.id === held.id);` — a ação redimensionada. [nada muda]
15. `src/core/motion/commands.ts:525` `  if (resized === undefined || (resized.start === held.start && resized.duration === held.duration)) return { kind: 'change' };` — nada mudou no início nem na duração: alteração vazia (R4). [nada muda]
16. `src/core/motion/commands.ts:526` `  return commitTimeline(found.index, next, message('status.motion.actionResized', { name: { key: effectLabel(held.effect.kind) }, duration: (resized.duration / 1000).toFixed(2) }));` — a timeline inteira é lida antes de virar correção. [escreve: EST-L01-030 via run]
17. `src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };` — a correção substitui a timeline no índice. [escreve: EST-L01-030 via run]
18. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
19. `src/core/store/store.ts:527` `    if (documentChanged && gesture === null && ownedGroup === null) {` — a transação por gesto não abre um passo por despacho. [lê: EST-L01-030 via run]
20. `src/core/store/store.ts:557` `      if (documentChanged && gesture !== null) {` — a correção entra no gesto aberto, que a registra como um passo ao fechar. [escreve: EST-L01-030 via run]
21. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
22. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
23. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:518` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 7.
- R2: `src/core/motion/commands.ts:521` `  if (held === null || moved === null) return { kind: 'change' };` — sem `action`/`at` que nomeiem ação, ou sem `delta` nem `distance`: nada muda; com os dois segue ao passo 11.
- R3: `src/core/motion/commands.ts:522` `  if (!EFFECTS[held.effect.kind].timed) return { kind: 'refused', message: message('status.motion.instant', { name: { key: effectLabel(held.effect.kind) } }) };` — ação instantânea recusa `status.motion.instant`; temporizada segue ao passo 12.
- R4: `src/core/motion/commands.ts:525` `  if (resized === undefined || (resized.start === held.start && resized.duration === held.duration)) return { kind: 'change' };` — início e duração iguais (deslocamento absorvido pelo mínimo): nada muda; mudados seguem ao passo 16.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:516`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o passo do gesto (`src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`).

## Resultado
- **Estado final:** a ação muda de início ou de duração pela borda arrastada; o documento muda (passo 18) e a correção entra no gesto aberto (passo 20); a mensagem é `status.motion.actionResized` (passo 16).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha a barra no comprimento novo e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:526`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:516`).
- G3: ok — as duas portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:276` `'motion.resizeAction': resizeActionCommand,` e enviam só o `edge`; o tratador decide por ele (`src/core/motion/timeline.ts:84` `    if (edge === 'end') return withDuration(action, Math.max(minimum, action.duration + shift));`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:526`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:1903` `"id": "panel-drag-motion-bar-start",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
