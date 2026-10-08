# TRC-animation.rename
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ readonly animation: string; readonly name: string }`; a porta panel-control `timeline-animation-name-field` não declara argumentos próprios (`manifest/commands/animation.json:121` `          "args": {}`) e o campo do painel acrescenta o nome atual (`animation`) e o digitado (`name`).
- **Ramos que dependem dos argumentos:** R2 (nome igual ao atual), R3 (nome que não é identificador), R4 (nome já tomado)

## Passos
1. `src/app/commands.ts:193` `  'animation.rename': renameAnimationCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/animation/animation.ts:232` `export const renameAnimationCommand = registerHandler('animation.rename', (context, { animation, name }): Outcome<never> => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:80` `        "predicate": "always",`). [nada muda]
3. `src/core/animation/animation.ts:233` `  const found = targetNode(context);` — resolve o elemento único da seleção. [lê: EST-L01-031 via targetNode] [lê: EST-L01-030 via targetNode]
4. `src/core/animation/animation.ts:234` `  const held = found === null ? null : named(found.node, animation);` — procura a animação pelo nome atual no nó. [lê: EST-L01-030 via named]
5. `src/core/animation/animation.ts:169` `function named(node: DocNode, name: string): Animation | null {` — `named` chama `findAnimation` (`src/core/animation/animation.ts:66` `  return animationsOf(node).find((animation) => animation.name === name) ?? null;`). [lê: EST-L01-030 via named]
6. `src/core/animation/animation.ts:235` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento ou sem a animação, nada muda (R1). [nada muda]
7. `src/core/animation/animation.ts:237` `  if (typed === animation) return { kind: 'change' };` — nome igual ao atual não é mudança (R2). [nada muda]
8. `src/core/animation/animation.ts:238` `  if (!ANIMATION_NAME.test(typed)) return { kind: 'refused', message: message('status.animation.nameInvalid', { name: typed }) };` — nome fora da gramática de identificador é recusado (R3). [lê: EST-L01-030 via handlerContext]
9. `src/core/animation/animation.ts:240` `  if (allAnimationNames(context.state.document).has(typed)) return { kind: 'refused', message: message('status.animation.nameTaken', { name: typed }) };` — nome já usado por qualquer animação do documento é recusado (R4). [lê: EST-L01-030 via allAnimationNames]
10. `src/core/animation/animation.ts:241` `  const locked = lockedRefusal(context, found.node);` — elemento travado, ou dentro de um, recusa (R5). [lê: EST-L01-030 via lockedRefusal]
11. `src/core/animation/animation.ts:243` `  const renamed: Animation = { ...held, name: typed };` — a animação com o nome novo. [nada muda]
12. `src/core/animation/animation.ts:245` `  const interactions = (found.node.interactions ?? []).map((each) => (each.animation === animation ? { ...each, animation: typed } : each));` — as interações que tocavam a animação passam a nomear o nome novo. [lê: EST-L01-030 via handlerContext]
13. `src/core/animation/animation.ts:246` `  const node = { ...withAnimations(found.node, replaceAnimation(found.node, animation, renamed)) };` — o nó com a animação renomeada; `replaceAnimation` está em `src/core/animation/animation.ts:198` `const replaceAnimation = (node: DocNode, name: string, next: Animation | null): readonly Animation[] =>`. [escreve: EST-L01-030 via withAnimations]
14. `src/core/animation/animation.ts:248` `  return { kind: 'change', patches: [{ op: 'replace', path: [...found.path], value: written }], message: message('status.animation.renamed', { oldName: animation, name: typed }) };` — o resultado leva a substituição do nó e a mensagem. [escreve: EST-L01-030 via run]
15. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via run]
16. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a substituição é aplicada ao documento. [escreve: EST-L01-030 via run]
17. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o comando é desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
18. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit]
19. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit]
20. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish]

## Ramos
- R1: `src/core/animation/animation.ts:235` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento selecionado ou sem a animação de nome `animation`: resultado vazio; com ambos segue ao passo 7.
- R2: `src/core/animation/animation.ts:237` `  if (typed === animation) return { kind: 'change' };` — o nome digitado igual ao atual não muda nada; diferente segue ao passo 8.
- R3: `src/core/animation/animation.ts:238` `  if (!ANIMATION_NAME.test(typed)) return { kind: 'refused', message: message('status.animation.nameInvalid', { name: typed }) };` — o nome fora da gramática é recusado; dentro dela segue ao passo 9.
- R4: `src/core/animation/animation.ts:240` `  if (allAnimationNames(context.state.document).has(typed)) return { kind: 'refused', message: message('status.animation.nameTaken', { name: typed }) };` — o nome que outra animação já usa é recusado; livre segue ao passo 10.
- R5: `src/core/animation/animation.ts:242` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava o resultado é a recusa `status.locked.edit`; sem trava segue ao passo 11.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/animation/animation.ts:232`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await, timer nem quadro entre a leitura e a gravação.

## Estado
- Lê: EST-L01-031 (`state.selection`), EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** a animação e as interações que a tocavam passam a nomear `typed`; o documento muda (passo 16), o histórico ganha um passo (passo 17) e a mensagem é `status.animation.renamed` (passo 14).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha a linha da animação com o nome novo e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha a folha `@keyframes` com o nome novo.

## Regras
- G1: n/a — o tratador grava as animações do próprio nó (`src/core/animation/animation.ts:246` `  const node = { ...withAnimations(found.node, replaceAnimation(found.node, animation, renamed)) };`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação: recebe `name` já formado (`src/core/animation/animation.ts:232` `export const renameAnimationCommand = registerHandler('animation.rename', (context, { animation, name }): Outcome<never> => {`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/animation.json:98` `      "id": "timeline-animation-name-field",`).
- G4: n/a — o tratador só devolve correções e mensagem (passo 14); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/animation.json:112` `            "region": "dock-timeline",`).
- G6: n/a — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a alteração substitui o nó inteiro (passo 14) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
