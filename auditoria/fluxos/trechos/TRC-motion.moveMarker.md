# TRC-motion.moveMarker
- **Chamada:** `src/app/commands.ts:282` `'motion.moveMarker': moveMarkerCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly marker?: string; readonly markerAt?: number; readonly delta?: number; readonly distance?: number }`; `timeline` é a timeline, `marker`/`markerAt` o marcador por id ou por lugar, e o movimento chega como `delta` (ms) ou `distance` (px). A porta panel-drag `panel-drag-motion-marker` não declara argumento próprio (`manifest/commands/motion.json:2399` `"id": "panel-drag-motion-marker",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (`marker`/`markerAt` e `delta`/`distance`), R3 (tempo inalterado)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:2383` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:692` `export const moveMarkerCommand = registerHandler('motion.moveMarker', (context, { timeline, marker, markerAt, delta, distance }): Outcome<never> => {` — o tratador recebe os cinco campos. O manifesto marca a transação por gesto (`manifest/commands/motion.json:2394` `        "transaction": "per-gesture",`).
4. `src/core/motion/commands.ts:693` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
5. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
6. `src/core/motion/commands.ts:694` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
7. `src/core/motion/commands.ts:695` `  const held = markerOf(found.timeline, marker, markerAt);` — o marcador pelo id, senão pelo lugar. [lê: EST-L01-030 via markerOf]
8. `src/core/motion/commands.ts:678` `function markerOf(timeline: MotionTimeline, id: string | undefined, at: number | undefined) {` — o id nomeia o marcador, ou o lugar o nomeia.
9. `src/core/motion/commands.ts:696` `  const moved = deltaOf(delta, distance, dragPixelsPerSecond());` — o deslocamento em ms (R2). [nada muda]
10. `src/core/motion/commands.ts:697` `  if (held === null || moved === null) return { kind: 'change' };` — sem marcador ou sem deslocamento: alteração vazia (R2). [nada muda]
11. `src/core/motion/commands.ts:698` `  const next = moveMarker(found.timeline, held.id, moved);` — a timeline com o marcador movido. [escreve: EST-L01-030 via run]
12. `src/core/motion/timeline.ts:267` `export function moveMarker(timeline: MotionTimeline, id: string, delta: number): MotionTimeline {` — soma o deslocamento ao tempo do marcador, nunca abaixo de 0, e reordena. [lê: EST-L01-030 via moveMarker]
13. `src/core/motion/commands.ts:699` `  if (next.markers.find((one) => one.id === held.id)?.time === held.time) return { kind: 'change' };` — tempo inalterado (preso a 0): alteração vazia (R3). [nada muda]
14. `src/core/motion/commands.ts:700` `  return commitTimeline(found.index, next, message('status.motion.markerMoved', { name: held.name }));` — a timeline inteira é lida antes de virar correção. [escreve: EST-L01-030 via run]
15. `src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };` — a correção substitui a timeline no índice. [escreve: EST-L01-030 via run]
16. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
17. `src/core/store/store.ts:527` `    if (documentChanged && gesture === null && ownedGroup === null) {` — a transação por gesto não abre um passo por despacho. [lê: EST-L01-030 via run]
18. `src/core/store/store.ts:557` `      if (documentChanged && gesture !== null) {` — a correção entra no gesto aberto, que a registra como um passo ao fechar. [escreve: EST-L01-030 via run]
19. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
20. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
21. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:694` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 7.
- R2: `src/core/motion/commands.ts:697` `  if (held === null || moved === null) return { kind: 'change' };` — sem `marker`/`markerAt` que nomeiem marcador, ou sem `delta` nem `distance`: nada muda; com os dois segue ao passo 11.
- R3: `src/core/motion/commands.ts:699` `  if (next.markers.find((one) => one.id === held.id)?.time === held.time) return { kind: 'change' };` — tempo preso a 0 (o marcador já estava no início): nada muda; tempo novo segue ao passo 14.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:692`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o passo do gesto (`src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`).

## Resultado
- **Estado final:** o marcador muda de tempo; o documento muda (passo 16) e a correção entra no gesto aberto (passo 18); a mensagem é `status.motion.markerMoved` (passo 14).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline desenha o marcador na posição nova e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); o marcador não muda o desenho da página.

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:700`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:692`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:2399` `"id": "panel-drag-motion-marker",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:700`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:2399` `"id": "panel-drag-motion-marker",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
