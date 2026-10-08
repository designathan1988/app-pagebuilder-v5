# TRC-motion.removeBehaviour
- **Chamada:** `src/app/commands.ts:295` `'motion.removeBehaviour': removeBehaviourCommand,`
- **Argumentos:** `{ readonly behaviour?: string }`; `behaviour` é a espécie a tirar. A porta panel-control `inspector-motion-behaviour-remove` não declara argumento próprio (`manifest/commands/motion.json:3660` `"id": "inspector-motion-behaviour-remove",`).
- **Ramos que dependem dos argumentos:** R1 (`behaviour`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:3644` `"predicate": "always",`), que não barra nada.
3. `src/core/motion/commands.ts:796` `export const removeBehaviourCommand = registerHandler('motion.removeBehaviour', (context, { behaviour }): Outcome<never> => {` — o tratador recebe a espécie.
4. `src/core/motion/commands.ts:797` `  const found = primaryNode(context.state.document, context.state.selection);` — o elemento primário da seleção. [lê: EST-L01-030 via primaryNode] [lê: EST-L01-031 via primaryNode]
5. `src/core/motion/commands.ts:798` `  if (found === null) return { kind: 'change' };` — sem elemento a alteração é vazia (R1). [nada muda]
6. `src/core/motion/commands.ts:799` `  if (!behavioursOf(found.node).some((one) => one.kind === behaviour)) return { kind: 'change' };` — o elemento sem esse comportamento: alteração vazia (R1). [lê: EST-L01-030 via behavioursOf]
7. `src/core/motion/commands.ts:800` `  const locked = lockedRefusal(context, found.node);` — elemento travado recusa (R2). [lê: EST-L01-030 via lockedRefusal]
8. `src/core/nodes/flags.ts:49` `export function firstLockRefusal(document: DocumentJson, ids: readonly NodeId[], key: LockedKey): Message | null {` — a recusa de trava do nó e dos seus ancestrais.
9. `src/core/motion/commands.ts:802` `  const next = behavioursOf(found.node).filter((one) => one.kind !== behaviour);` — a lista sem o comportamento da espécie. [lê: EST-L01-030 via behavioursOf]
10. `src/core/motion/commands.ts:803` `  return { kind: 'change', patches: writeBehaviours(found.node, found.path, next), message: message('status.motion.behaviourRemoved', { name: { key: behaviourLabel(behaviour) }, element: found.node.name }) };` — a correção substitui o nó com os comportamentos restantes. [escreve: EST-L01-030 via run]
11. `src/core/motion/document.ts:80` `export function writeBehaviours(node: DocNode, path: readonly (string | number)[], behaviours: readonly Behaviour[]): Patch[] {` — a correção troca ou remove o campo `behaviours` do nó. [escreve: EST-L01-030 via run]
12. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a correção é aplicada ao documento. [escreve: EST-L01-030 via run]
13. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a mudança do documento é reconhecida. [lê: EST-L01-030 via run]
14. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — comando desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
15. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
16. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
17. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/motion/commands.ts:799` `  if (!behavioursOf(found.node).some((one) => one.kind === behaviour)) return { kind: 'change' };` — `behaviour` que o elemento não tem (ou nenhum elemento primário, passo 5): nada muda; com ele segue ao passo 7.
- R2: `src/core/motion/commands.ts:801` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava recusa `status.locked.edit`; sem trava segue ao passo 9.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/motion/commands.ts:796`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** o elemento perde o comportamento; o documento muda (passo 12), o histórico ganha um passo (passo 14) e a mensagem é `status.motion.behaviourRemoved` (passo 10).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Behaviours redesenha a lista sem o comportamento e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó sem o comportamento.

## Regras
- G1: n/a — o tratador grava os comportamentos do próprio nó (`src/core/motion/commands.ts:803`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:796`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:3660` `"id": "inspector-motion-behaviour-remove",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:803`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:3660` `"id": "inspector-motion-behaviour-remove",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca ou remove o campo `behaviours` do nó (`src/core/motion/document.ts:80` `export function writeBehaviours(node: DocNode, path: readonly (string | number)[], behaviours: readonly Behaviour[]): Patch[] {`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
