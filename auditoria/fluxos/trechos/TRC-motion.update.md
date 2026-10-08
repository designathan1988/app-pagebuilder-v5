# TRC-motion.update
- **Chamada:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Argumentos:** `{ readonly interaction?: number; readonly field?: string; readonly value?: unknown }`; `interaction` é o índice da interação no nó, `field` nomeia a opção escrita e `value` é o que o campo ou o menu entrega. Cada porta panel-control fixa o `field` próprio (`manifest/commands/motion.json:175` `"id": "inspector-motion-trigger",` … `manifest/commands/motion.json:679` `"id": "inspector-motion-scroll-start",`).
- **Ramos que dependem dos argumentos:** R1 (`interaction`, `field`), R4 (`field`, `value`), R5 (`value`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:156` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:231` `export const updateMotionCommand = registerHandler('motion.update', (context, { interaction, field, value }): Outcome<never> => {` — o tratador recebe os três campos.
4. `src/core/motion/commands.ts:232` `  const found = primaryNode(context.state.document, context.state.selection);` — o elemento primário da seleção. [lê: EST-L01-030 via primaryNode] [lê: EST-L01-031 via primaryNode]
5. `src/core/motion/commands.ts:233` `  if (found === null || interaction === undefined || field === undefined) return { kind: 'change' };` — sem elemento, sem índice ou sem campo a alteração é vazia (R1). [nada muda]
6. `src/core/motion/commands.ts:234` `  const held = motionsOf(found.node)[interaction];` — a interação que o índice nomeia. [lê: EST-L01-030 via motionsOf]
7. `src/core/motion/commands.ts:235` `  if (held === undefined) return { kind: 'change' };` — índice fora da lista: alteração vazia (R2). [nada muda]
8. `src/core/motion/commands.ts:236` `  const locked = lockedRefusal(context, found.node);` — elemento travado recusa (R3). [lê: EST-L01-030 via lockedRefusal]
9. `src/core/nodes/flags.ts:49` `export function firstLockRefusal(document: DocumentJson, ids: readonly NodeId[], key: LockedKey): Message | null {` — a recusa de trava do nó e dos seus ancestrais.
10. `src/core/motion/commands.ts:238` `  const next = updatedInteraction(context, found.node, held, field, value);` — o campo decide a interação nova. [lê: EST-L01-030 via updatedInteraction]
11. `src/core/motion/commands.ts:161` `function updatedInteraction<Ui>(context: HandlerContext<Ui>, node: DocNode, held: MotionInteraction, field: string, value: unknown): MotionInteraction | Outcome<never> {` — a função que trata cada `field`.
12. `src/core/motion/commands.ts:168` `      if (kind === null || !isTriggerKind(kind) || !triggerApplies(kind, node)) return { kind: 'refused', message: message('status.motion.notApplicable', { name: kind === null ? '' : isTriggerKind(kind) ? { key: triggerLabel(kind) } : kind, element: node.name }) };` — o campo `trigger` recusa uma espécie que não aplica; aplicável troca o gatilho e o `control` (`src/core/motion/catalog.ts:111` `export function defaultTrigger(kind: TriggerKind, firstBreakpoint: string): Trigger {`).
13. `src/core/motion/commands.ts:178` `      if (name === null || findTimeline(context.state.document, name) === null) return { kind: 'refused', message: message('status.motion.notFound', { name: name ?? '' }) };` — o campo `timeline` recusa um nome que o projeto não tem. [lê: EST-L01-030 via findTimeline]
14. `src/core/motion/commands.ts:187` `    case 'scope': {` — o campo `scope` vazio tira o escopo, fora da gramática de classe recusa. [nada muda]
15. `src/core/motion/commands.ts:198` `    case 'delay': {` — o campo `delay` lê um tempo (`src/core/motion/commands.ts:65` `export function readTime(value: unknown): number | null {`); 0 tira o atraso.
16. `src/core/motion/commands.ts:203` `    case 'breakpoints': {` — o campo `breakpoints` lê uma lista e recusa um nome de breakpoint que o projeto não tem.
17. `src/core/motion/commands.ts:218` `    default: {` — os parâmetros do gatilho (`key`, `threshold`, `milliseconds`, `direction`, `axis`, `breakpoint`, `seconds`, `state`, `event`) são lidos aqui pelo próprio nome (`src/core/motion/commands.ts:158` `const TRIGGER_PARAMETERS = ['key', 'threshold', 'milliseconds', DIRECTION, 'axis', 'breakpoint', 'seconds', 'state', 'event'] as const;`).
18. `src/core/motion/commands.ts:239` `  if (isOutcome(next)) return next;` — quando o campo devolve uma recusa, ela é o resultado (R4).
19. `src/core/motion/commands.ts:240` `  const read = readInteraction(next);` — a interação nova é lida estritamente antes de virar correção.
20. `src/core/motion/read.ts:438` `export function readInteraction(value: unknown): Read<MotionInteraction> {` — a leitura estrita da interação.
21. `src/core/motion/commands.ts:241` `  if (!read.ok) return invalid(value);` — interação que a leitura recusa vira `status.motion.invalid` (R5).
22. `src/core/motion/commands.ts:242` `  if (JSON.stringify(read.value) === JSON.stringify(held)) return { kind: 'change' };` — valor que não muda a interação: alteração vazia (R6). [nada muda]
23. `src/core/motion/commands.ts:243` `  const motions = motionsOf(found.node).map((one, index) => (index === interaction ? read.value : one));` — a lista troca só a interação do índice. [lê: EST-L01-030 via motionsOf]
24. `src/core/motion/commands.ts:244` `  return { kind: 'change', patches: writeMotions(found.node, found.path, motions), message: message('status.motion.updated', { name: { key: triggerLabel(read.value.trigger.kind) }, element: found.node.name }) };` — o resultado leva a correção e a mensagem. [escreve: EST-L01-030 via run]
25. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
26. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a mudança do documento é reconhecida. [lê: EST-L01-030 via run]
27. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
28. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
29. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
30. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:233` `  if (found === null || interaction === undefined || field === undefined) return { kind: 'change' };` — sem elemento, sem `interaction` ou sem `field`: nada muda; com os três segue ao passo 6.
- R2: `src/core/motion/commands.ts:235` `  if (held === undefined) return { kind: 'change' };` — `interaction` fora da lista de interações: nada muda; dentro dela segue ao passo 8.
- R3: `src/core/motion/commands.ts:237` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava recusa `status.locked.edit`; sem trava segue ao passo 10.
- R4: `src/core/motion/commands.ts:239` `  if (isOutcome(next)) return next;` — quando `updatedInteraction` devolve uma recusa (`status.motion.notApplicable`, `status.motion.notFound`) ela é o resultado; quando devolve a interação segue ao passo 19.
- R5: `src/core/motion/commands.ts:241` `  if (!read.ok) return invalid(value);` — interação que a leitura estrita recusa vira `status.motion.invalid`; válida segue ao passo 22.
- R6: `src/core/motion/commands.ts:242` `  if (JSON.stringify(read.value) === JSON.stringify(held)) return { kind: 'change' };` — valor que não muda a interação: nada muda; mudado segue ao passo 23.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:231`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`, `state.rules`), EST-L01-031 (`state.selection`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** a interação do índice muda; o documento muda (passo 25), o histórico ganha um passo (passo 27) e a mensagem é `status.motion.updated` (passo 24).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Interactions redesenha os campos da interação e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó.

## Regras
- G1: n/a — o tratador grava as interações do próprio nó (`src/core/motion/commands.ts:244` `  return { kind: 'change', patches: writeMotions(found.node, found.path, motions), message: message('status.motion.updated', { name: { key: triggerLabel(read.value.trigger.kind) }, element: found.node.name }) };`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `value` do campo, não o rascunho pendente (`src/core/motion/commands.ts:231`).
- G3: ok — as vinte portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:265` `'motion.update': updateMotionCommand,` e enviam só o `field` próprio com o valor; o tratador (`src/core/motion/commands.ts:161`) decide por ele.
- G4: n/a — o tratador só devolve correções e mensagem (`src/core/motion/commands.ts:244`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:175` `"id": "inspector-motion-trigger",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca o campo `motions` do nó (`src/core/motion/document.ts:76` `export function writeMotions(node: DocNode, path: readonly (string | number)[], motions: readonly MotionInteraction[]): Patch[] {`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
