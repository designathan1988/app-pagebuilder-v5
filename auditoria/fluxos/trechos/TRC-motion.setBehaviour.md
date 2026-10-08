# TRC-motion.setBehaviour
- **Chamada:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Argumentos:** `{ readonly behaviour?: string; readonly amount?: number | string; readonly axis?: string }`; `behaviour` é a espécie, `amount` o valor (número do botão, texto do campo) e `axis` o eixo. As portas fixam `behaviour`/`axis` (`manifest/commands/motion.json:3367` `"id": "inspector-motion-behaviour-sticky",` … `manifest/commands/motion.json:3597` `"id": "inspector-motion-behaviour-axis-y",`).
- **Ramos que dependem dos argumentos:** R1 (`behaviour`), R3 (`behaviour`), R4 (`behaviour`), R5 (`amount`), R6 (`amount`/`axis`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/selection/selection.ts:23` `export const singleSelection = registerPredicate('singleSelection', (state) => state.selection.length === 1);` — o manifesto pede o predicado `singleSelection` (`manifest/commands/motion.json:3349` `"predicate": "singleSelection",`); sem exatamente um elemento o `run` recusa antes do tratador. [lê: EST-L01-031 via singleSelection]
3. `src/core/motion/commands.ts:776` `export const setBehaviourCommand = registerHandler('motion.setBehaviour', (context, { behaviour, amount: given, axis }): Outcome<never> => {` — o tratador recebe os três campos.
4. `src/core/motion/commands.ts:778` `  const amount = given === undefined ? undefined : (readNumber(given) ?? Number.NaN);` — o valor numérico, ou `NaN` quando o texto não é número. [nada muda]
5. `src/core/motion/commands.ts:779` `  const found = primaryNode(context.state.document, context.state.selection);` — o elemento primário da seleção. [lê: EST-L01-030 via primaryNode] [lê: EST-L01-031 via primaryNode]
6. `src/core/motion/commands.ts:780` `  if (found === null) return { kind: 'change' };` — sem elemento a alteração é vazia (R1). [nada muda]
7. `src/core/motion/commands.ts:781` `  const locked = lockedRefusal(context, found.node);` — elemento travado recusa (R2). [lê: EST-L01-030 via lockedRefusal]
8. `src/core/nodes/flags.ts:49` `export function firstLockRefusal(document: DocumentJson, ids: readonly NodeId[], key: LockedKey): Message | null {` — a recusa de trava do nó e dos seus ancestrais.
9. `src/core/motion/commands.ts:784` `  if (kind === 'sticky' || kind === 'scroll-snap') return styleBehaviour(context, found, kind, amount, axis);` — as duas espécies de CSS puro vão pelo dono do estilo (R3). [nada muda]
10. `src/core/motion/commands.ts:745` `function styleBehaviour<Ui>(context: HandlerContext<Ui>, found: Located, kind: 'sticky' | 'scroll-snap', amount: number | undefined, axis: 'x' | 'y' | undefined): Outcome<Ui> {` — escreve as declarações pelo `writeStyle` (`src/core/style/set.ts:304` `export function writeStyle<Ui>(context: HandlerContext<Ui>, property: string, css: string, longhands: Readonly<Record<string, StoredValue>> | null = null): Outcome<Ui> {`), com o quadro-chave e a gravação do cursor desligados (`src/core/motion/commands.ts:746` `  const plain: HandlerContext<Ui> = { ...context, keyframe: null, motion: context.motion === undefined || context.motion === null ? null : { ...context.motion, recording: null } };`). [escreve: EST-L01-030 via run]
11. `src/core/motion/commands.ts:753` `    const [positionProperty, insetProperty] = writesOf('inspector-motion-behaviour-sticky');` — as propriedades da porta do manifesto, nunca escritas à mão (`src/core/motion/commands.ts:739` `function writesOf(door: string): readonly string[] {`). [nada muda]
12. `src/core/motion/commands.ts:757` `    const written = writeStyle(plain, position.property, position.css, { [position.property]: position.css, [inset.property]: inset.css });` — `sticky` escreve posição e topo. [escreve: EST-L01-030 via run]
13. `src/core/motion/commands.ts:771` `  const items = writeStyle({ ...plain, state: { ...plain.state, selection: children } }, align.property, align.css);` — o `scroll-snap` escreve também nos filhos, com a seleção trocada por eles. [escreve: EST-L01-030 via run]
14. `src/core/motion/commands.ts:785` `  if (!isRuntimeBehaviour(kind)) return invalid(behaviour);` — espécie que não é de execução vira `status.motion.invalid` (R4). [nada muda]
15. `src/core/motion/commands.ts:786` `  const base = behavioursOf(found.node).find((one) => one.kind === kind) ?? BEHAVIOUR_DEFAULTS[kind];` — o valor atual do comportamento, senão os padrões da espécie (`src/core/motion/commands.ts:722` `const BEHAVIOUR_DEFAULTS: Readonly<Record<RuntimeBehaviourKind, Behaviour>> = {`). [lê: EST-L01-030 via behavioursOf]
16. `src/core/motion/commands.ts:787` `  const wanted: Behaviour = { ...base, ...(amount === undefined ? {} : { amount }), ...(axis === undefined ? {} : { axis }) };` — o comportamento pedido com o valor e o eixo novos (R5). [nada muda]
17. `src/core/motion/commands.ts:788` `  const read = readBehaviour(wanted);` — o comportamento é lido estritamente antes de virar correção.
18. `src/core/motion/read.ts:474` `export function readBehaviour(value: unknown): Read<Behaviour> {` — a leitura estrita do comportamento, com a faixa de cada espécie.
19. `src/core/motion/commands.ts:789` `  if (!read.ok) return invalid(amount ?? behaviour);` — valor fora da faixa vira `status.motion.invalid` (R5). [nada muda]
20. `src/core/motion/commands.ts:791` `  const next = [...others, read.value];` — a lista com o comportamento lido no fim, sem o de mesmo tipo. [escreve: EST-L01-030 via run]
21. `src/core/motion/commands.ts:792` `  if (JSON.stringify(next) === JSON.stringify(behavioursOf(found.node))) return { kind: 'change' };` — lista igual à atual: alteração vazia (R6). [nada muda]
22. `src/core/motion/commands.ts:793` `  return { kind: 'change', patches: writeBehaviours(found.node, found.path, next), message: message('status.motion.behaviourSet', { name: { key: behaviourLabel(kind) }, element: found.node.name }) };` — a correção substitui o nó com os comportamentos novos. [escreve: EST-L01-030 via run]
23. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
24. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
25. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
26. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
27. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:780` `  if (found === null) return { kind: 'change' };` — nenhum elemento primário localizado: nada muda; com elemento segue ao passo 7.
- R2: `src/core/motion/commands.ts:782` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava recusa `status.locked.edit`; sem trava segue ao passo 9.
- R3: `src/core/motion/commands.ts:784` `  if (kind === 'sticky' || kind === 'scroll-snap') return styleBehaviour(context, found, kind, amount, axis);` — `behaviour` `sticky` ou `scroll-snap` escreve CSS pelo dono do estilo; as demais espécies seguem ao passo 14.
- R4: `src/core/motion/commands.ts:785` `  if (!isRuntimeBehaviour(kind)) return invalid(behaviour);` — `behaviour` que não é espécie de execução vira `status.motion.invalid`; conhecida segue ao passo 15.
- R5: `src/core/motion/commands.ts:789` `  if (!read.ok) return invalid(amount ?? behaviour);` — `amount` fora da faixa da espécie (ou `NaN`) vira `status.motion.invalid`; válido segue ao passo 20.
- R6: `src/core/motion/commands.ts:792` `  if (JSON.stringify(next) === JSON.stringify(behavioursOf(found.node))) return { kind: 'change' };` — comportamento igual ao atual: nada muda; diferente segue ao passo 22.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:776`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:79` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`, `state.rules`), EST-L01-031 (`state.selection`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** o elemento ganha o comportamento com o valor (e o eixo) novos, ou as declarações de `sticky`/`scroll-snap`; o documento muda (passo 23), o histórico ganha um passo (passo 24) e a mensagem é `status.motion.behaviourSet` (passo 22).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Behaviours redesenha o controle e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó com os comportamentos novos.

## Regras
- G1: n/a — o comportamento de execução grava os campos do nó (`src/core/motion/commands.ts:793` `  return { kind: 'change', patches: writeBehaviours(found.node, found.path, next), message: message('status.motion.behaviourSet', { name: { key: behaviourLabel(kind) }, element: found.node.name }) };`) e `sticky`/`scroll-snap` escrevem a camada que a store já escolheu (`src/core/style/set.ts:334` `  const { breakpoint, state: base } = rules.base;`); nenhum captura um contexto de digitação.
- G2: n/a — o tratador lê os argumentos `amount` e `axis`, não o rascunho pendente (`src/core/motion/commands.ts:776`).
- G3: ok — as nove portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,` e enviam só a `behaviour`, o `amount` ou o `axis`; o tratador decide por eles (`src/core/motion/commands.ts:784`).
- G4: n/a — o tratador só devolve correções e mensagem (`src/core/motion/commands.ts:793`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; as portas vivem na colocação do painel (`manifest/commands/motion.json:3367` `"id": "inspector-motion-behaviour-sticky",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`); o `scroll-snap` troca a seleção só na cópia interna do `writeStyle` (`src/core/motion/commands.ts:771`).
- G7: ok — a correção troca os campos do nó (`src/core/motion/document.ts:80` `export function writeBehaviours(node: DocNode, path: readonly (string | number)[], behaviours: readonly Behaviour[]): Patch[] {`) ou as declarações de estilo (`src/core/style/set.ts:304`), e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
