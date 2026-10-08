# TRC-animation.moveKeyframe
- **Chamada:** `src/editor/input/pointer/panels.ts:86` `    shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, offset, distance: at.x - startX } as never);`
- **Argumentos:** `{ readonly animation: string; readonly keyframe: number; readonly offset?: number; readonly distance?: number }`; a porta panel-drag `panel-drag-keyframe-track` não declara argumentos próprios e o arrasto acrescenta `offset` (o deslocamento sob o ponteiro) e `distance` (o quanto o ponteiro andou).
- **Ramos que dependem dos argumentos:** R2 (offset ausente), R3 (offset igual ao atual), R5 (offset fora do intervalo), R6 (offset já tomado)

## Passos
1. `src/app/commands.ts:196` `  'animation.moveKeyframe': moveKeyframeCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/input/pointer/panels.ts:85` `    shared.open = store.gesture();` — o arrasto abre um gesto e o despacho corre dentro dele, com o deslocamento sob o ponteiro. [escreve: EST-L01-007 via store.gesture]
3. `src/core/animation/animation.ts:280` `export const moveKeyframeCommand = registerHandler('animation.moveKeyframe', (context, { animation, keyframe, offset }): Outcome<never> => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:272` `        "predicate": "always",`). [nada muda]
4. `src/core/animation/animation.ts:281` `  const found = targetNode(context);` — resolve o elemento único da seleção. [lê: EST-L01-031 via targetNode] [lê: EST-L01-030 via targetNode]
5. `src/core/animation/animation.ts:282` `  const held = found === null ? null : named(found.node, animation);` — procura a animação pelo nome no nó. [lê: EST-L01-030 via named]
6. `src/core/animation/animation.ts:283` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento ou sem a animação, nada muda (R1). [nada muda]
7. `src/core/animation/animation.ts:284` `  const moving = held.keyframes.find((k) => k.offset === keyframe);` — o quadro-chave que o arrasto move, pelo deslocamento atual. [lê: EST-L01-030 via handlerContext]
8. `src/core/animation/animation.ts:286` `  if (moving === undefined || offset === undefined || offset === keyframe) return { kind: 'change' };` — sem o quadro, sem deslocamento novo, ou no mesmo lugar, nada muda (R2, R3, R4). [nada muda]
9. `src/core/animation/animation.ts:287` `  const [low, high] = offsetRange();` — o intervalo que os deslocamentos tomam (`interactions.json` `timeline.offsetRange`). [nada muda]
10. `src/core/animation/animation.ts:288` `  if (!Number.isInteger(offset) || offset < low || offset > high) return { kind: 'refused', message: message('status.animation.offsetOutOfRange', { offset: String(offset) }) };` — deslocamento fora do intervalo é recusado (R5). [lê: EST-L01-030 via handlerContext]
11. `src/core/animation/animation.ts:289` `  if (held.keyframes.some((k) => k.offset === offset)) return { kind: 'refused', message: message('status.animation.keyframeTaken', { offset: String(offset) }) };` — deslocamento já tomado por outro quadro é recusado (R6). [lê: EST-L01-030 via handlerContext]
12. `src/core/animation/animation.ts:290` `  const locked = lockedRefusal(context, found.node);` — elemento travado, ou dentro de um, recusa (R7). [lê: EST-L01-030 via lockedRefusal]
13. `src/core/animation/animation.ts:292` `  const keyframes = held.keyframes.map((k) => (k.offset === keyframe ? { ...k, offset } : k)).sort((a, b) => a.offset - b.offset);` — o quadro movido, os quadros de novo em ordem de deslocamento. [lê: EST-L01-030 via handlerContext]
14. `src/core/animation/animation.ts:293` `  return { kind: 'change', patches: writeAnimations(found, replaceAnimation(found.node, animation, { ...held, keyframes })), message: message('status.animation.keyframeMoved', { name: animation, offset: String(offset) }) };` — o resultado leva a substituição do nó e a mensagem. [escreve: EST-L01-030 via run]
15. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via run]
16. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a substituição é aplicada ao documento. [escreve: EST-L01-030 via run]
17. `src/core/store/store.ts:557` `      if (documentChanged && gesture !== null) {` — dentro do gesto as correções entram nele, sem passo de histórico por despacho (`manifest/commands/animation.json:285` `        "transaction": "per-gesture",`). [escreve: EST-L01-030 via run]
18. `src/core/store/store.ts:559` `        gesture.patches.push(...applied.applied);` — o gesto acumula as correções do arrasto. [escreve: EST-L01-007 via run]
19. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado a cada quadro do arrasto. [escreve: EST-L01-030 via commit]
20. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish]

## Ramos
- R1: `src/core/animation/animation.ts:283` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento selecionado ou sem a animação: resultado vazio; com ambos segue ao passo 7.
- R2: `src/core/animation/animation.ts:286` `  if (moving === undefined || offset === undefined || offset === keyframe) return { kind: 'change' };` — o deslocamento ausente (um passo, sem arrasto) deixa o resultado vazio; presente segue ao passo 9.
- R3: `src/core/animation/animation.ts:286` `  if (moving === undefined || offset === undefined || offset === keyframe) return { kind: 'change' };` — o deslocamento igual ao atual deixa o resultado vazio; outro segue ao passo 9.
- R4: `src/core/animation/animation.ts:286` `  if (moving === undefined || offset === undefined || offset === keyframe) return { kind: 'change' };` — um `keyframe` que a animação não tem deixa o resultado vazio; com ele segue ao passo 9.
- R5: `src/core/animation/animation.ts:288` `  if (!Number.isInteger(offset) || offset < low || offset > high) return { kind: 'refused', message: message('status.animation.offsetOutOfRange', { offset: String(offset) }) };` — fora do intervalo é recusado; dentro segue ao passo 11.
- R6: `src/core/animation/animation.ts:289` `  if (held.keyframes.some((k) => k.offset === offset)) return { kind: 'refused', message: message('status.animation.keyframeTaken', { offset: String(offset) }) };` — o deslocamento já tomado é recusado; livre segue ao passo 12.
- R7: `src/core/animation/animation.ts:291` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava o resultado é a recusa `status.locked.edit`; sem trava segue ao passo 13.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/animation/animation.ts:280`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; cada quadro do arrasto despacha em `src/editor/input/pointer/panels.ts:86`, sem await, timer nem quadro interposto pelo próprio trecho.

## Estado
- Lê: EST-L01-031 (`state.selection`), EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-007 (`open`, o gesto que acumula o arrasto).

## Resultado
- **Estado final:** a cada quadro do arrasto a animação tem o quadro no deslocamento novo; no fim do gesto o histórico ganha um passo (o gesto grava um só). O documento muda (passo 16) e a mensagem é `status.animation.keyframeMoved` (passo 14).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline desenha a marca do quadro na posição nova e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha a folha `@keyframes` com o deslocamento novo.

## Regras
- G1: n/a — o tratador grava as animações do próprio nó (passo 14), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/animation/animation.ts:280` `export const moveKeyframeCommand = registerHandler('animation.moveKeyframe', (context, { animation, keyframe, offset }): Outcome<never> => {`); os valores vêm do arrasto.
- G3: n/a — o comando tem uma porta só (`manifest/commands/animation.json:290` `          "id": "panel-drag-keyframe-track",`).
- G4: n/a — o tratador só devolve correções e mensagem (passo 14); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta é um arrasto de painel (`manifest/commands/animation.json:291` `          "kind": "panel-drag",`).
- G6: n/a — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a alteração substitui o nó inteiro (`src/core/animation/animation.ts:215` `  { op: 'replace', path: [...found.path], value: withAnimations(found.node, animations) },`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador; o gesto que ele corre é fechado pelo caminho da porta (`src/editor/input/pointer/panels.ts:85` `    shared.open = store.gesture();`).

## Medições
- nenhuma — o deslocamento sob o ponteiro é calculado pelo caminho da porta (`src/editor/input/pointer/panels.ts:83` `    const offset = offsetFromTrackX(at.x - press.track.left);`), fora do trecho.
