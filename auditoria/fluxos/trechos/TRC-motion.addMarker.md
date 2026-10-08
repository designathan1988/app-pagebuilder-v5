# TRC-motion.addMarker
- **Chamada:** `src/app/commands.ts:281` `'motion.addMarker': addMarkerCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly name?: string }`; `timeline` é a timeline e `name` o nome do marcador (vazio: um nome padrão numerado). A porta panel-control `timeline-motion-add-marker` não declara argumento próprio (`manifest/commands/motion.json:2323` `"id": "timeline-motion-add-marker",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (nome vazio)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:2306` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:683` `export const addMarkerCommand = registerHandler('motion.addMarker', (context, { timeline, name }): Outcome<never> => {` — o tratador recebe os dois campos.
4. `src/core/motion/commands.ts:685` `  const time = playheadOf(context);` — o marcador nasce no cursor do painel. [lê: EST-L08-019 via playheadOf]
5. `src/core/motion/commands.ts:97` `const playheadOf = <Ui>(context: HandlerContext<Ui>): number => context.motion?.playhead ?? 0;` — o tempo do cursor, 0 sem editor.
6. `src/core/motion/commands.ts:686` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
7. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
8. `src/core/motion/commands.ts:687` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
9. `src/core/motion/commands.ts:688` `  const typed = (name ?? '').trim() || context.words('motion.marker.defaultName', { number: found.timeline.markers.length + 1 });` — sem nome, o padrão numerado pela quantidade de marcadores (R2). [nada muda]
10. `src/core/motion/commands.ts:689` `  return commitTimeline(found.index, addMarker(found.timeline, { id: context.ids.next(), name: typed, time: Math.max(0, Math.round(time)) }), message('status.motion.markerAdded', { name: typed, time: (time / 1000).toFixed(2) }), name ?? '');` — o marcador novo entra na timeline e a timeline inteira é lida antes de virar correção. [escreve: EST-L01-030 via run]
11. `src/core/motion/timeline.ts:265` `export const addMarker = (timeline: MotionTimeline, marker: Marker): MotionTimeline => ({ ...timeline, markers: [...timeline.markers, marker].sort((a, b) => a.time - b.time) });` — a lista de marcadores ganha o novo, em ordem de tempo. [lê: EST-L01-030 via addMarker]
12. `src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };` — a correção substitui a timeline no índice. [escreve: EST-L01-030 via run]
13. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
14. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
15. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
16. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
17. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:687` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 9.
- R2: `src/core/motion/commands.ts:688` `  const typed = (name ?? '').trim() || context.words('motion.marker.defaultName', { number: found.timeline.markers.length + 1 });` — nome vazio toma o padrão numerado; com nome, ele mesmo é o marcador.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:683`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.time` via `playheadOf`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** a timeline ganha um marcador no cursor; o documento muda (passo 13), o histórico ganha um passo (passo 14) e a mensagem é `status.motion.markerAdded` (passo 10).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline desenha o marcador e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); o marcador não muda o desenho da página.

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:689`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `name` do campo, não o rascunho pendente (`src/core/motion/commands.ts:683`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:2323` `"id": "timeline-motion-add-marker",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:689`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:2323` `"id": "timeline-motion-add-marker",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
