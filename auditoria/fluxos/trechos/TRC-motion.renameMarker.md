# TRC-motion.renameMarker
- **Chamada:** `src/app/commands.ts:283` `'motion.renameMarker': renameMarkerCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly marker?: string; readonly markerAt?: number; readonly name?: string }`; `timeline` é a timeline, `marker`/`markerAt` o marcador por id ou por lugar e `name` o nome novo. A porta panel-control `timeline-motion-marker-name` não declara argumento próprio (`manifest/commands/motion.json:2465` `"id": "timeline-motion-marker-name",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (`marker`/`markerAt` e `name`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:2448` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:703` `export const renameMarkerCommand = registerHandler('motion.renameMarker', (context, { timeline, marker, markerAt, name }): Outcome<never> => {` — o tratador recebe os quatro campos.
4. `src/core/motion/commands.ts:704` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
5. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
6. `src/core/motion/commands.ts:705` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
7. `src/core/motion/commands.ts:706` `  const held = markerOf(found.timeline, marker, markerAt);` — o marcador pelo id, senão pelo lugar. [lê: EST-L01-030 via markerOf]
8. `src/core/motion/commands.ts:707` `  if (held === null || name.trim() === held.name) return { kind: 'change' };` — sem marcador ou nome igual ao atual: alteração vazia (R2). [nada muda]
9. `src/core/motion/commands.ts:708` `  return commitTimeline(found.index, renameMarker(found.timeline, held.id, name.trim()), message('status.motion.markerRenamed', { name: name.trim() }), name);` — a timeline com o marcador renomeado, lida antes de virar correção. [escreve: EST-L01-030 via run]
10. `src/core/motion/timeline.ts:271` `export const renameMarker = (timeline: MotionTimeline, id: string, name: string): MotionTimeline => ({ ...timeline, markers: timeline.markers.map((marker) => (marker.id === id ? { ...marker, name } : marker)) });` — troca o nome do marcador do id. [lê: EST-L01-030 via renameMarker]
11. `src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };` — a correção substitui a timeline no índice. [escreve: EST-L01-030 via run]
12. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
13. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
14. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
15. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
16. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:705` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 7.
- R2: `src/core/motion/commands.ts:707` `  if (held === null || name.trim() === held.name) return { kind: 'change' };` — sem `marker`/`markerAt` que nomeiem marcador, ou `name` igual ao atual: nada muda; diferente segue ao passo 9.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:703`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** o marcador passa ao nome novo; o documento muda (passo 12), o histórico ganha um passo (passo 13) e a mensagem é `status.motion.markerRenamed` (passo 9).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha o nome do marcador e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); o nome não muda o desenho da página.

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:708`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `name` do campo, não o rascunho pendente (`src/core/motion/commands.ts:703`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:2465` `"id": "timeline-motion-marker-name",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:708`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:2465` `"id": "timeline-motion-marker-name",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
