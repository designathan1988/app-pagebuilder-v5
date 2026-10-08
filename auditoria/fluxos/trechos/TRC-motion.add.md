# TRC-motion.add
- **Chamada:** `src/app/commands.ts:264` `'motion.add': addMotionCommand,`
- **Argumentos:** `{ readonly trigger?: string; readonly timeline?: string }`; a porta panel-control `inspector-motion-add` não declara argumento próprio (`manifest/commands/motion.json:85` `"id": "inspector-motion-add",`) e o painel acrescenta `trigger` (a espécie do gatilho) e `timeline` (o nome de uma timeline existente a reusar).
- **Ramos que dependem dos argumentos:** R2 (`trigger`), R5 e R6 (`timeline`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador com o contexto e os argumentos. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/selection/selection.ts:23` `export const singleSelection = registerPredicate('singleSelection', (state) => state.selection.length === 1);` — o manifesto pede o predicado `singleSelection` (`manifest/commands/motion.json:66` `"predicate": "singleSelection",`); sem exatamente um elemento o `run` recusa antes do tratador. [lê: EST-L01-031 via singleSelection]
3. `src/core/motion/commands.ts:125` `export const addMotionCommand = registerHandler('motion.add', (context, { trigger, timeline }): Outcome<never> => {` — o tratador recebe `trigger` e `timeline`.
4. `src/core/motion/commands.ts:126` `  const found = primaryNode(context.state.document, context.state.selection);` — o elemento primário da seleção. [lê: EST-L01-030 via primaryNode] [lê: EST-L01-031 via primaryNode]
5. `src/core/motion/document.ts:233` `export function primaryNode(document: DocumentJson, selection: readonly NodeId[]): { readonly node: DocNode; readonly path: readonly (string | number)[] } | null {` — o id primário localizado no documento. [lê: EST-L01-030 via locate]
6. `src/core/motion/commands.ts:127` `  if (found === null) return { kind: 'change' };` — sem elemento a alteração é vazia (R1). [nada muda]
7. `src/core/motion/commands.ts:128` `  const kind = trigger ?? applicableTriggers(found.node)[0] ?? 'click';` — sem `trigger` a espécie é o primeiro gatilho aplicável. [lê: EST-L01-030 via applicableTriggers]
8. `src/core/motion/catalog.ts:126` `export const applicableTriggers = (node: Pick<DocNode, 'tag'>): readonly TriggerKind[] => TRIGGER_KINDS.filter((kind) => triggerApplies(kind, node));` — filtra os gatilhos pela tag do elemento.
9. `src/core/motion/commands.ts:129` `  if (!isTriggerKind(kind) || !triggerApplies(kind, found.node)) return { kind: 'refused', message: message('status.motion.notApplicable', { name: { key: triggerLabel(kind) }, element: found.node.name }) };` — espécie desconhecida ou que não aplica recusa (R2).
10. `src/core/motion/catalog.ts:122` `export function triggerApplies(kind: TriggerKind, node: Pick<DocNode, 'tag'>): boolean {` — a tag do elemento decide se o gatilho aplica.
11. `src/core/motion/commands.ts:130` `  const locked = lockedRefusal(context, found.node);` — elemento travado, ou dentro de um, recusa (R3). [lê: EST-L01-030 via lockedRefusal]
12. `src/core/nodes/flags.ts:49` `export function firstLockRefusal(document: DocumentJson, ids: readonly NodeId[], key: LockedKey): Message | null {` — a recusa de trava do nó e dos seus ancestrais.
13. `src/core/motion/commands.ts:134` `  if (timeline !== undefined && timeline !== '') {` — com `timeline` nomeado segue o reuso (R6).
14. `src/core/motion/commands.ts:136` `    if (findTimeline(context.state.document, timeline) === null) return { kind: 'refused', message: message('status.motion.notFound', { name: timeline }) };` — nome de timeline que o projeto não tem recusa (R5).
15. `src/core/motion/commands.ts:139` `    name = timelineNameFor(context.state.document, found.node, kind);` — sem `timeline`, o nome sai do elemento e do gatilho (R6, outro lado).
16. `src/core/motion/commands.ts:109` `function timelineNameFor(document: DocumentJson, node: DocNode, trigger: string): string {` — o nome base e o `uniqueTimelineName` (`src/core/motion/document.ts:42` `export function uniqueTimelineName(document: DocumentJson, wanted: string): string {`).
17. `src/core/motion/commands.ts:140` `    const made: MotionTimeline = { id: context.ids.next(), name, actions: [firstAction(context)], markers: [] };` — a timeline nova com uma ação inicial. [lê: EST-L01-030 via firstAction]
18. `src/core/motion/commands.ts:141` `    patches.push(...writeTimelines(context.state.document, [...timelinesOf(context.state.document), made]));` — a correção acrescenta a timeline. [escreve: EST-L01-030 via run]
19. `src/core/motion/commands.ts:144` `  const interaction: MotionInteraction = {` — a interação nova com gatilho, timeline, controle e o `leave` de gatilho pareado. [lê: EST-L01-030 via defaultTrigger]
20. `src/core/motion/commands.ts:151` `  const read = readInteraction(interaction);` — a interação é lida estritamente antes de virar correção.
21. `src/core/motion/read.ts:438` `export function readInteraction(value: unknown): Read<MotionInteraction> {` — a leitura estrita da interação.
22. `src/core/motion/commands.ts:153` `  patches.push(...writeMotions(found.node, found.path, [...motionsOf(found.node), read.value]));` — a correção substitui o nó com a interação acrescentada. [escreve: EST-L01-030 via run]
23. `src/core/motion/commands.ts:154` `  return { kind: 'change', patches, message: message('status.motion.added', { name: { key: triggerLabel(kind) }, element: found.node.name, timeline: name }) };` — o resultado leva as correções e a mensagem. [escreve: EST-L01-030 via run]
24. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — as correções são aplicadas ao documento. [escreve: EST-L01-030 via run]
25. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a mudança do documento é reconhecida. [lê: EST-L01-030 via run]
26. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o comando é desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
27. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
28. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
29. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:127` `  if (found === null) return { kind: 'change' };` — nenhum elemento primário localizado: resultado vazio, nada muda; com elemento segue ao passo 7.
- R2: `src/core/motion/commands.ts:129` `  if (!isTriggerKind(kind) || !triggerApplies(kind, found.node)) return { kind: 'refused', message: message('status.motion.notApplicable', { name: { key: triggerLabel(kind) }, element: found.node.name }) };` — `trigger` desconhecido ou que não aplica na tag do elemento recusa `status.motion.notApplicable`; aplicável segue ao passo 11.
- R3: `src/core/motion/commands.ts:131` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava o resultado é a recusa `status.locked.edit`; sem trava segue ao passo 13.
- R5: `src/core/motion/commands.ts:136` `    if (findTimeline(context.state.document, timeline) === null) return { kind: 'refused', message: message('status.motion.notFound', { name: timeline }) };` — `timeline` nomeado que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 17 (reuso, sem correção de timeline).
- R6: `src/core/motion/commands.ts:134` `  if (timeline !== undefined && timeline !== '') {` — com `timeline` a interação reusa a timeline pelo nome; sem ele (ou vazio) uma timeline nova é criada (passo 17).

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:125`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:203` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro entre a leitura e a gravação.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** o nó selecionado ganha uma interação nova; o documento muda (passo 24), o histórico ganha um passo (passo 26) e a mensagem é `status.motion.added` (passo 23).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Interactions redesenha a lista de interações do elemento e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó.

## Regras
- G1: n/a — o tratador grava as interações do próprio nó (`src/core/motion/commands.ts:153` `  patches.push(...writeMotions(found.node, found.path, [...motionsOf(found.node), read.value]));`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:125` `export const addMotionCommand = registerHandler('motion.add', (context, { trigger, timeline }): Outcome<never> => {`); os argumentos vêm do manifesto e do painel.
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:85` `"id": "inspector-motion-add",`).
- G4: n/a — o tratador só devolve correções e mensagem (`src/core/motion/commands.ts:154`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:85` `"id": "inspector-motion-add",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — as correções trocam os campos do nó (`src/core/motion/document.ts:76` `export function writeMotions(node: DocNode, path: readonly (string | number)[], motions: readonly MotionInteraction[]): Patch[] {`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
