# TRC-animation.create
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ readonly name: string }`; a porta panel-control `timeline-new-animation` não declara argumentos próprios (`manifest/commands/animation.json:58` `          "args": {}`) e o campo do painel acrescenta `name`.
- **Ramos que dependem dos argumentos:** R2 (nome que não é identificador), R3 (nome já tomado)

## Passos
1. `src/app/commands.ts:192` `  'animation.create': createAnimationCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/animation/animation.ts:218` `export const createAnimationCommand = registerHandler('animation.create', (context, { name }): Outcome<never> => {` — o tratador é registrado; o manifesto pede o predicado `singleSelection` (`manifest/commands/animation.json:17` `        "predicate": "singleSelection",`). [nada muda]
3. `src/core/selection/selection.ts:23` `export const singleSelection = registerPredicate('singleSelection', (state) => state.selection.length === 1);` — sem exatamente um elemento selecionado o `run` recusa antes do tratador. [lê: EST-L01-031 via singleSelection]
4. `src/core/animation/animation.ts:219` `  const found = targetNode(context);` — resolve o elemento único da seleção. [lê: EST-L01-031 via targetNode] [lê: EST-L01-030 via targetNode]
5. `src/core/animation/animation.ts:205` `  const primary = context.state.selection[0];` — o primeiro elemento da seleção. [lê: EST-L01-031 via targetNode]
6. `src/core/document/model.ts:290` `export function locate(doc: DocumentJson, id: NodeId): Location | null {` — `targetNode` chama `locate` (`src/core/animation/animation.ts:207` `  const found = locate(context.state.document, primary);`). [lê: EST-L01-030 via locate]
7. `src/core/animation/animation.ts:220` `  if (found === null) return { kind: 'change' };` — sem elemento a alteração é vazia (R1). [nada muda]
8. `src/core/animation/animation.ts:222` `  if (!ANIMATION_NAME.test(typed)) return { kind: 'refused', message: message('status.animation.nameInvalid', { name: typed }) };` — nome que não é identificador CSS é recusado (R2). [lê: EST-L01-030 via handlerContext]
9. `src/core/animation/animation.ts:224` `  if (allAnimationNames(context.state.document).has(typed)) return { kind: 'refused', message: message('status.animation.nameTaken', { name: typed }) };` — nome já usado por qualquer animação do documento é recusado (R3). [lê: EST-L01-030 via allAnimationNames]
10. `src/core/animation/animation.ts:225` `  const locked = lockedRefusal(context, found.node);` — elemento travado, ou dentro de um, recusa (R4). [lê: EST-L01-030 via lockedRefusal]
11. `src/core/nodes/flags.ts:49` `export function firstLockRefusal(document: DocumentJson, ids: readonly NodeId[], key: LockedKey): Message | null {` — a recusa de trava do nó e dos seus ancestrais. [lê: EST-L01-030 via firstLockRefusal]
12. `src/core/animation/animation.ts:227` `  const animation: Animation = { name: typed, settings: defaultSettings(), keyframes: startKeyframes() };` — a animação nova com os valores padrão do manifesto (duração 1 s e afins). [nada muda]
13. `src/core/animation/animation.ts:228` `  const patch = writeAnimations(found, [...animationsOf(found.node), animation]);` — monta a correção que substitui o nó inteiro com a animação acrescentada. [lê: EST-L01-030 via writeAnimations]
14. `src/core/animation/animation.ts:215` `  { op: 'replace', path: [...found.path], value: withAnimations(found.node, animations) },` — a escrita é uma só substituição do nó. [escreve: EST-L01-030 via writeAnimations]
15. `src/core/animation/animation.ts:229` `  return { kind: 'change', patches: patch, message: message('status.animation.created', { name: typed, element: found.node.name }) };` — o resultado leva a correção e a mensagem de criação. [escreve: EST-L01-030 via run]
16. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via run]
17. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
18. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a mudança do documento é reconhecida. [lê: EST-L01-030 via run]
19. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o comando é desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
20. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit]
21. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit]
22. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish]

## Ramos
- R1: `src/core/animation/animation.ts:220` `  if (found === null) return { kind: 'change' };` — nenhum elemento selecionado ou não localizado: resultado vazio, nada muda; com elemento segue ao passo 8.
- R2: `src/core/animation/animation.ts:222` `  if (!ANIMATION_NAME.test(typed)) return { kind: 'refused', message: message('status.animation.nameInvalid', { name: typed }) };` — o nome fora da gramática de identificador é recusado (`status.animation.nameInvalid`); dentro dela segue ao passo 9.
- R3: `src/core/animation/animation.ts:224` `  if (allAnimationNames(context.state.document).has(typed)) return { kind: 'refused', message: message('status.animation.nameTaken', { name: typed }) };` — o nome que outra animação do documento já usa é recusado (`status.animation.nameTaken`); livre segue ao passo 10.
- R4: `src/core/animation/animation.ts:226` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava o resultado é a recusa `status.locked.edit`; sem trava segue ao passo 12.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/animation/animation.ts:218`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await, timer nem quadro entre a leitura e a gravação.

## Estado
- Lê: EST-L01-031 (`state.selection`), EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** o nó selecionado ganha uma animação nova com nome `typed`; o documento muda (passo 17), o histórico ganha um passo (passo 19) e a mensagem é `status.animation.created` (passo 15).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha a lista de animações do elemento e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó com a folha `@keyframes` nova.

## Regras
- G1: n/a — o tratador grava as animações do próprio nó (`src/core/animation/animation.ts:228` `  const patch = writeAnimations(found, [...animationsOf(found.node), animation]);`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/animation/animation.ts:218` `export const createAnimationCommand = registerHandler('animation.create', (context, { name }): Outcome<never> => {`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/animation.json:35` `      "id": "timeline-new-animation",`).
- G4: n/a — o tratador só devolve correções e mensagem (`src/core/animation/animation.ts:229` `  return { kind: 'change', patches: patch, message: message('status.animation.created', { name: typed, element: found.node.name }) };`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/animation.json:49` `            "region": "dock-timeline",`).
- G6: n/a — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a alteração substitui o nó inteiro (`src/core/animation/animation.ts:215` `  { op: 'replace', path: [...found.path], value: withAnimations(found.node, animations) },`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
