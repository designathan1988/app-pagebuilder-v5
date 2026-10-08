# TRC-motion.renameTimeline
- **Chamada:** `src/app/commands.ts:268` `'motion.renameTimeline': renameTimelineCommand,`
- **Argumentos:** `{ readonly timeline?: string; readonly name?: string }`; `timeline` é o nome atual e `name` o nome novo. A porta panel-control `timeline-motion-timeline-name` não declara argumento próprio (`manifest/commands/motion.json:885` `"id": "timeline-motion-timeline-name",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (nome igual), R3 (nome fora da gramática), R4 (nome já tomado)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:867` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:270` `export const renameTimelineCommand = registerHandler('motion.renameTimeline', (context, { timeline, name }): Outcome<never> => {` — o tratador recebe os dois nomes.
4. `src/core/motion/commands.ts:271` `  const found = timelineNamed(context, timeline);` — a timeline que o nome nomeia. [lê: EST-L01-030 via timelineNamed]
5. `src/core/motion/commands.ts:92` `function timelineNamed<Ui>(context: HandlerContext<Ui>, name: unknown): { readonly timeline: MotionTimeline; readonly index: number } | Outcome<never> {` — o acha-ou-recusa pelo nome. [lê: EST-L01-030 via findTimeline]
6. `src/core/motion/commands.ts:272` `  if (isOutcome(found)) return found;` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [nada muda]
7. `src/core/motion/commands.ts:273` `  const typed = name.trim();` — o nome novo aparado. [nada muda]
8. `src/core/motion/commands.ts:274` `  if (typed === found.timeline.name) return { kind: 'change' };` — nome igual ao atual: alteração vazia (R2). [nada muda]
9. `src/core/motion/commands.ts:275` `  if (!TIMELINE_NAME.test(typed)) return { kind: 'refused', message: message('status.motion.nameInvalid', { name: typed }) };` — nome fora da gramática recusa (R3). [nada muda]
10. `src/core/motion/read.ts:35` `export const TIMELINE_NAME = /^[\p{L}\p{N}][\p{L}\p{N} _.-]{0,63}$/u;` — a gramática do nome.
11. `src/core/motion/commands.ts:276` `  if (findTimeline(context.state.document, typed) !== null) return { kind: 'refused', message: message('status.motion.nameTaken', { name: typed }) };` — nome que outra timeline já usa recusa (R4). [lê: EST-L01-030 via findTimeline]
12. `src/core/motion/commands.ts:277` `  return { kind: 'change', patches: renameTimelinePatches(context.state.document, found.timeline.name, typed), message: message('status.motion.timelineRenamed', { oldName: found.timeline.name, name: typed }) };` — a correção renomeia a timeline e cada referência. [escreve: EST-L01-030 via run]
13. `src/core/motion/document.ts:87` `export function renameTimelinePatches(document: DocumentJson, from: string, to: string): Patch[] {` — a timeline renomeada e as interações e ações que a citavam.
14. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
15. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a mudança do documento é reconhecida. [lê: EST-L01-030 via run]
16. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
17. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
18. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
19. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:272` `  if (isOutcome(found)) return found;` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 7.
- R2: `src/core/motion/commands.ts:274` `  if (typed === found.timeline.name) return { kind: 'change' };` — nome novo igual ao atual: nada muda; diferente segue ao passo 9.
- R3: `src/core/motion/commands.ts:275` `  if (!TIMELINE_NAME.test(typed)) return { kind: 'refused', message: message('status.motion.nameInvalid', { name: typed }) };` — nome fora da gramática recusa `status.motion.nameInvalid`; dentro dela segue ao passo 11.
- R4: `src/core/motion/commands.ts:276` `  if (findTimeline(context.state.document, typed) !== null) return { kind: 'refused', message: message('status.motion.nameTaken', { name: typed }) };` — nome que já existe recusa `status.motion.nameTaken`; livre segue ao passo 12.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:270`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** a timeline e cada referência a ela passam ao nome novo; o documento muda (passo 14), o histórico ganha um passo (passo 16) e a mensagem é `status.motion.timelineRenamed` (passo 12).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha os nomes das timelines e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); o nome não muda o desenho da página.

## Regras
- G1: n/a — o tratador renomeia a timeline e as referências (`src/core/motion/commands.ts:277`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `name` do campo, não o rascunho pendente (`src/core/motion/commands.ts:270`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:885` `"id": "timeline-motion-timeline-name",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:277`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:885` `"id": "timeline-motion-timeline-name",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — `renameTimelinePatches` devolve listas de timelines e de interações (`src/core/motion/document.ts:87` `export function renameTimelinePatches(document: DocumentJson, from: string, to: string): Patch[] {`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
