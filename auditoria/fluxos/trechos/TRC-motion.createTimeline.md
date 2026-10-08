# TRC-motion.createTimeline
- **Chamada:** `src/app/commands.ts:267` `'motion.createTimeline': createTimelineCommand,`
- **Argumentos:** `{ readonly name?: string }`; a porta panel-control `timeline-motion-new-timeline` não declara argumento próprio (`manifest/commands/motion.json:822` `"id": "timeline-motion-new-timeline",`) e o campo do painel entrega o nome `name` (vazio: um nome padrão).
- **Ramos que dependem dos argumentos:** R1 (nome que não é identificador), R2 (nome já tomado), R3 (nome vazio)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:805` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:261` `export const createTimelineCommand = registerHandler('motion.createTimeline', (context, { name }): Outcome<never> => {` — o tratador recebe o nome.
4. `src/core/motion/commands.ts:262` `  const typed = (name ?? '').trim();` — o nome aparado, vazio quando o campo não deu nada. [nada muda]
5. `src/core/motion/commands.ts:263` `  const wanted = typed === '' ? uniqueTimelineName(context.state.document, context.words('motion.timeline.defaultName')) : typed;` — sem nome, um nome padrão livre no projeto (R3). [lê: EST-L01-030 via uniqueTimelineName]
6. `src/core/motion/document.ts:42` `export function uniqueTimelineName(document: DocumentJson, wanted: string): string {` — o nome livre, acrescido de um número enquanto tomado.
7. `src/core/motion/commands.ts:264` `  if (!TIMELINE_NAME.test(wanted)) return { kind: 'refused', message: message('status.motion.nameInvalid', { name: wanted }) };` — nome fora da gramática de identificador recusa (R1). [nada muda]
8. `src/core/motion/read.ts:35` `export const TIMELINE_NAME = /^[\p{L}\p{N}][\p{L}\p{N} _.-]{0,63}$/u;` — a gramática do nome.
9. `src/core/motion/commands.ts:265` `  if (findTimeline(context.state.document, wanted) !== null) return { kind: 'refused', message: message('status.motion.nameTaken', { name: wanted }) };` — nome que outra timeline já usa recusa (R2). [lê: EST-L01-030 via findTimeline]
10. `src/core/motion/document.ts:24` `export function findTimeline(document: DocumentJson, name: string): { readonly timeline: MotionTimeline; readonly index: number } | null {` — a busca da timeline pelo nome.
11. `src/core/motion/commands.ts:266` `  const timeline: MotionTimeline = { id: context.ids.next(), name: wanted, actions: [], markers: [] };` — a timeline nova, sem ação e sem marcador. [nada muda]
12. `src/core/motion/commands.ts:267` `  return { kind: 'change', patches: writeTimelines(context.state.document, [...timelinesOf(context.state.document), timeline]), message: message('status.motion.timelineCreated', { name: wanted }) };` — a correção acrescenta a timeline; a mensagem nomeia o nome. [escreve: EST-L01-030 via run]
13. `src/core/motion/document.ts:67` `export function writeTimelines(document: DocumentJson, timelines: readonly MotionTimeline[]): Patch[] {` — a correção escreve a lista de timelines inteira.
14. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
15. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a mudança do documento é reconhecida. [lê: EST-L01-030 via run]
16. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
17. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
18. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
19. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:264` `  if (!TIMELINE_NAME.test(wanted)) return { kind: 'refused', message: message('status.motion.nameInvalid', { name: wanted }) };` — nome fora da gramática recusa `status.motion.nameInvalid`; dentro dela segue ao passo 9.
- R2: `src/core/motion/commands.ts:265` `  if (findTimeline(context.state.document, wanted) !== null) return { kind: 'refused', message: message('status.motion.nameTaken', { name: wanted }) };` — nome que já existe recusa `status.motion.nameTaken`; livre segue ao passo 11.
- R3: `src/core/motion/commands.ts:263` `  const wanted = typed === '' ? uniqueTimelineName(context.state.document, context.words('motion.timeline.defaultName')) : typed;` — nome vazio toma o padrão livre; com nome digitado, ele mesmo é o pedido.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:261`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** o projeto ganha uma timeline nova com `wanted`; o documento muda (passo 14), o histórico ganha um passo (passo 16) e a mensagem é `status.motion.timelineCreated` (passo 12).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha a lista de timelines e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); a lista de timelines não muda o desenho da página.

## Regras
- G1: n/a — o tratador grava a lista de timelines do projeto (`src/core/motion/commands.ts:267`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `name` do campo, não o rascunho pendente (`src/core/motion/commands.ts:261`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:822` `"id": "timeline-motion-new-timeline",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:267`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:822` `"id": "timeline-motion-new-timeline",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca ou acrescenta a lista de timelines (`src/core/motion/document.ts:67` `export function writeTimelines(document: DocumentJson, timelines: readonly MotionTimeline[]): Patch[] {`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
