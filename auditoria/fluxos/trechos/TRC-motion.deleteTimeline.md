# TRC-motion.deleteTimeline
- **Chamada:** `src/app/commands.ts:269` `'motion.deleteTimeline': deleteTimelineCommand,`
- **Argumentos:** `{ readonly timeline?: string }`; `timeline` é o nome da timeline a apagar. A porta panel-control `timeline-motion-timeline-delete` não declara argumento próprio (`manifest/commands/motion.json:942` `"id": "timeline-motion-timeline-delete",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (timeline em uso)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:925` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:280` `export const deleteTimelineCommand = registerHandler('motion.deleteTimeline', (context, { timeline }): Outcome<never> => {` — o tratador recebe o nome.
4. `src/core/motion/commands.ts:281` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
5. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
6. `src/core/motion/commands.ts:282` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
7. `src/core/motion/commands.ts:284` `  const uses = timelineUses(context.state.document, found.timeline.name);` — quantas interações a tocam e quantas ações a controlam. [lê: EST-L01-030 via timelineUses]
8. `src/core/motion/document.ts:57` `export function timelineUses(document: DocumentJson, name: string): TimelineUses {` — percorre os elementos e as timelines do documento.
9. `src/core/motion/commands.ts:285` `  if (uses.interactions + uses.actions > 0) return { kind: 'refused', message: message('status.motion.timelineInUse', { name: found.timeline.name, count: uses.interactions + uses.actions }) };` — timeline tocada ou controlada recusa (R2). [nada muda]
10. `src/core/motion/commands.ts:286` `  const kept = timelinesOf(context.state.document).filter((_one, index) => index !== found.index);` — a lista sem a timeline apagada. [lê: EST-L01-030 via timelinesOf]
11. `src/core/motion/commands.ts:287` `  return { kind: 'change', patches: writeTimelines(context.state.document, kept), message: message('status.motion.timelineDeleted', { name: found.timeline.name }) };` — a correção escreve a lista nova. [escreve: EST-L01-030 via run]
12. `src/core/motion/document.ts:67` `export function writeTimelines(document: DocumentJson, timelines: readonly MotionTimeline[]): Patch[] {` — a correção escreve a lista de timelines inteira (ou remove o campo quando fica vazia).
13. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
14. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a mudança do documento é reconhecida. [lê: EST-L01-030 via run]
15. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
16. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
17. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
18. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:282` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 7.
- R2: `src/core/motion/commands.ts:285` `  if (uses.interactions + uses.actions > 0) return { kind: 'refused', message: message('status.motion.timelineInUse', { name: found.timeline.name, count: uses.interactions + uses.actions }) };` — timeline tocada por alguma interação ou controlada por alguma ação recusa `status.motion.timelineInUse`; sem uso segue ao passo 10.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:280`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** o projeto perde a timeline sem uso; o documento muda (passo 13), o histórico ganha um passo (passo 15) e a mensagem é `status.motion.timelineDeleted` (passo 11).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha a lista de timelines e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); a lista de timelines não muda o desenho da página.

## Regras
- G1: n/a — o tratador grava a lista de timelines do projeto (`src/core/motion/commands.ts:287`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:280`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:942` `"id": "timeline-motion-timeline-delete",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:287`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:942` `"id": "timeline-motion-timeline-delete",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca a lista de timelines (`src/core/motion/document.ts:67` `export function writeTimelines(document: DocumentJson, timelines: readonly MotionTimeline[]): Patch[] {`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
