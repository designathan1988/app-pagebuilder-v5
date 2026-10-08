# TRC-animation.delete
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ readonly animation: string }`; a porta panel-control `timeline-animation-delete` não declara argumentos próprios (`manifest/commands/animation.json:177` `          "args": {}`) e o painel acrescenta o nome da animação mostrada.
- **Ramos que dependem dos argumentos:** R1 (a animação existe no elemento), R3 (interações que a tocam)

## Passos
1. `src/app/commands.ts:194` `  'animation.delete': deleteAnimationCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/animation/animation.ts:251` `export const deleteAnimationCommand = registerHandler('animation.delete', (context, { animation }): Outcome<never> => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:138` `        "predicate": "always",`). [nada muda]
3. `src/core/animation/animation.ts:252` `  const found = targetNode(context);` — resolve o elemento único da seleção. [lê: EST-L01-031 via targetNode] [lê: EST-L01-030 via targetNode]
4. `src/core/animation/animation.ts:253` `  if (found === null || named(found.node, animation) === null) return { kind: 'change' };` — sem elemento ou sem a animação de nome `animation` nada muda (R1). [lê: EST-L01-030 via named]
5. `src/core/animation/animation.ts:254` `  const locked = lockedRefusal(context, found.node);` — elemento travado, ou dentro de um, recusa (R2). [lê: EST-L01-030 via lockedRefusal]
6. `src/core/animation/animation.ts:256` `  const next = animationsOf(found.node).filter((each) => each.name !== animation);` — as animações do nó sem a apagada. [lê: EST-L01-030 via animationsOf]
7. `src/core/animation/animation.ts:259` `  const playing = (found.node.interactions ?? []).filter((each) => !(each.action === 'play-animation' && each.animation === animation));` — as interações que tocavam a animação apagada saem com ela (R3). [lê: EST-L01-030 via handlerContext]
8. `src/core/animation/animation.ts:260` `  const without = withAnimations(found.node, next);` — o nó sem a animação. [escreve: EST-L01-030 via withAnimations]
9. `src/core/animation/animation.ts:263` `  const written = playing.length === (found.node.interactions ?? []).length ? without : playing.length === 0 ? rest : { ...without, interactions: playing };` — o nó escrito conforme as interações que restam (nenhuma mudou, todas saíram, ou algumas ficam). [escreve: EST-L01-030 via run]
10. `src/core/animation/animation.ts:264` `  return { kind: 'change', patches: [{ op: 'replace', path: [...found.path], value: written }], message: message('status.animation.deleted', { name: animation }) };` — o resultado leva a substituição do nó e a mensagem. [escreve: EST-L01-030 via run]
11. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via run]
12. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a substituição é aplicada ao documento. [escreve: EST-L01-030 via run]
13. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o comando é desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
14. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit]
15. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit]
16. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish]

## Ramos
- R1: `src/core/animation/animation.ts:253` `  if (found === null || named(found.node, animation) === null) return { kind: 'change' };` — sem elemento selecionado ou sem a animação: resultado vazio; com ela segue ao passo 5.
- R2: `src/core/animation/animation.ts:255` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava o resultado é a recusa `status.locked.edit`; sem trava segue ao passo 6.
- R3: `src/core/animation/animation.ts:259` `  const playing = (found.node.interactions ?? []).filter((each) => !(each.action === 'play-animation' && each.animation === animation));` — com interações que tocavam a animação, elas saem e o nó é escrito sem elas (passo 9); sem nenhuma, o campo `interactions` do nó sai inteiro.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/animation/animation.ts:251`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await, timer nem quadro entre a leitura e a gravação.

## Estado
- Lê: EST-L01-031 (`state.selection`), EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** o nó perde a animação (e as interações que a tocavam); o documento muda (passo 12), o histórico ganha um passo (passo 13) e a mensagem é `status.animation.deleted` (passo 10).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha a lista de animações e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó sem a animação.

## Regras
- G1: n/a — o tratador grava as animações do próprio nó (`src/core/animation/animation.ts:260` `  const without = withAnimations(found.node, next);`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/animation/animation.ts:251` `export const deleteAnimationCommand = registerHandler('animation.delete', (context, { animation }): Outcome<never> => {`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/animation.json:154` `      "id": "timeline-animation-delete",`).
- G4: n/a — o tratador só devolve correções e mensagem (passo 10); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/animation.json:168` `            "region": "dock-timeline",`).
- G6: n/a — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a alteração substitui o nó inteiro (passo 10) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
