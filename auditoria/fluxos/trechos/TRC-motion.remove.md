# TRC-motion.remove
- **Chamada:** `src/app/commands.ts:266` `'motion.remove': removeMotionCommand,`
- **Argumentos:** `{ readonly interaction?: number }`; a porta panel-control `inspector-motion-remove` não declara argumento próprio (`manifest/commands/motion.json:765` `"id": "inspector-motion-remove",`) e o painel acrescenta o índice `interaction`.
- **Ramos que dependem dos argumentos:** R1 (`interaction`), R2 (índice fora da lista)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:749` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:247` `export const removeMotionCommand = registerHandler('motion.remove', (context, { interaction }): Outcome<never> => {` — o tratador recebe o índice.
4. `src/core/motion/commands.ts:248` `  const found = primaryNode(context.state.document, context.state.selection);` — o elemento primário da seleção. [lê: EST-L01-030 via primaryNode] [lê: EST-L01-031 via primaryNode]
5. `src/core/motion/commands.ts:249` `  if (found === null || interaction === undefined) return { kind: 'change' };` — sem elemento ou sem índice a alteração é vazia (R1). [nada muda]
6. `src/core/motion/commands.ts:250` `  const held = motionsOf(found.node)[interaction];` — a interação que o índice nomeia. [lê: EST-L01-030 via motionsOf]
7. `src/core/motion/commands.ts:251` `  if (held === undefined) return { kind: 'change' };` — índice fora da lista: alteração vazia (R2). [nada muda]
8. `src/core/motion/commands.ts:252` `  const locked = lockedRefusal(context, found.node);` — elemento travado recusa (R3). [lê: EST-L01-030 via lockedRefusal]
9. `src/core/nodes/flags.ts:49` `export function firstLockRefusal(document: DocumentJson, ids: readonly NodeId[], key: LockedKey): Message | null {` — a recusa de trava do nó e dos seus ancestrais.
10. `src/core/motion/commands.ts:255` `  const motions = motionsOf(found.node).filter((_one, index) => index !== interaction);` — a lista sem a interação do índice; a timeline do projeto fica intacta (`manifest/commands/motion.json:757` `        "undoable": true,`). [lê: EST-L01-030 via motionsOf]
11. `src/core/motion/commands.ts:256` `  return { kind: 'change', patches: writeMotions(found.node, found.path, motions), message: message('status.motion.removed', { name: { key: triggerLabel(held.trigger.kind) }, element: found.node.name }) };` — o resultado leva a correção e a mensagem. [escreve: EST-L01-030 via run]
12. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
13. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a mudança do documento é reconhecida. [lê: EST-L01-030 via run]
14. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
15. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
16. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
17. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:249` `  if (found === null || interaction === undefined) return { kind: 'change' };` — sem elemento ou sem `interaction`: nada muda; com os dois segue ao passo 6.
- R2: `src/core/motion/commands.ts:251` `  if (held === undefined) return { kind: 'change' };` — `interaction` fora da lista: nada muda; dentro dela segue ao passo 8.
- R3: `src/core/motion/commands.ts:253` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava recusa `status.locked.edit`; sem trava segue ao passo 10.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:247`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:203` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** o nó selecionado perde a interação do índice; o documento muda (passo 12), o histórico ganha um passo (passo 14) e a mensagem é `status.motion.removed` (passo 11); a timeline do projeto permanece.
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Interactions redesenha a lista sem a interação e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó.

## Regras
- G1: n/a — o tratador grava as interações do próprio nó (`src/core/motion/commands.ts:256`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:247`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:765` `"id": "inspector-motion-remove",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:256`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:765` `"id": "inspector-motion-remove",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — correção que troca ou remove o campo `motions` do nó (`src/core/motion/document.ts:76` `export function writeMotions(node: DocNode, path: readonly (string | number)[], motions: readonly MotionInteraction[]): Patch[] {`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
