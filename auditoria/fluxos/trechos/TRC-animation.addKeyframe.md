# TRC-animation.addKeyframe
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ readonly animation: string; readonly offset: number }`; a porta panel-control `timeline-add-keyframe` não declara argumentos próprios (`manifest/commands/animation.json:240` `          "args": {}`) e o painel acrescenta a animação mostrada e o deslocamento pedido.
- **Ramos que dependem dos argumentos:** R2 (deslocamento fora do intervalo), R3 (deslocamento já tomado)

## Passos
1. `src/app/commands.ts:195` `  'animation.addKeyframe': addKeyframeCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/animation/animation.ts:267` `export const addKeyframeCommand = registerHandler('animation.addKeyframe', (context, { animation, offset }): Outcome<never> => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:199` `        "predicate": "always",`). [nada muda]
3. `src/core/animation/animation.ts:268` `  const found = targetNode(context);` — resolve o elemento único da seleção. [lê: EST-L01-031 via targetNode] [lê: EST-L01-030 via targetNode]
4. `src/core/animation/animation.ts:269` `  const held = found === null ? null : named(found.node, animation);` — procura a animação pelo nome no nó. [lê: EST-L01-030 via named]
5. `src/core/animation/animation.ts:270` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento ou sem a animação, nada muda (R1). [nada muda]
6. `src/core/animation/animation.ts:271` `  const [low, high] = offsetRange();` — o intervalo que os deslocamentos tomam (`interactions.json` `timeline.offsetRange`), em `src/core/animation/animation.ts:327` `function offsetRange(): readonly [number, number] {`. [nada muda]
7. `src/core/animation/animation.ts:272` `  if (!Number.isInteger(offset) || offset < low || offset > high) return { kind: 'refused', message: message('status.animation.offsetOutOfRange', { offset: String(offset) }) };` — deslocamento que não é inteiro dentro do intervalo é recusado (R2). [lê: EST-L01-030 via handlerContext]
8. `src/core/animation/animation.ts:273` `  if (held.keyframes.some((k) => k.offset === offset)) return { kind: 'refused', message: message('status.animation.keyframeTaken', { offset: String(offset) }) };` — deslocamento que um quadro-chave já toma é recusado (R3). [lê: EST-L01-030 via handlerContext]
9. `src/core/animation/animation.ts:274` `  const locked = lockedRefusal(context, found.node);` — elemento travado, ou dentro de um, recusa (R4). [lê: EST-L01-030 via lockedRefusal]
10. `src/core/animation/animation.ts:276` `  const next: Animation = { ...held, keyframes: insertKeyframe(held.keyframes, { offset, easing: '', declarations: {} }) };` — o quadro-chave novo vazio entra em ordem de deslocamento (`src/core/animation/animation.ts:190` `const insertKeyframe = (keyframes: readonly Keyframe[], keyframe: Keyframe): readonly Keyframe[] => [...keyframes, keyframe].sort((a, b) => a.offset - b.offset);`). [lê: EST-L01-030 via handlerContext]
11. `src/core/animation/animation.ts:277` `  return { kind: 'change', patches: writeAnimations(found, replaceAnimation(found.node, animation, next)), message: message('status.animation.keyframeAdded', { name: animation, offset: String(offset) }) };` — o resultado leva a substituição do nó e a mensagem. [escreve: EST-L01-030 via run]
12. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via run]
13. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a substituição é aplicada ao documento. [escreve: EST-L01-030 via run]
14. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o comando é desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
15. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit]
16. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit]
17. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish]

## Ramos
- R1: `src/core/animation/animation.ts:270` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento selecionado ou sem a animação: resultado vazio; com ambos segue ao passo 6.
- R2: `src/core/animation/animation.ts:272` `  if (!Number.isInteger(offset) || offset < low || offset > high) return { kind: 'refused', message: message('status.animation.offsetOutOfRange', { offset: String(offset) }) };` — o deslocamento fora do intervalo `timeline.offsetRange` é recusado (`status.animation.offsetOutOfRange`); dentro dele segue ao passo 8.
- R3: `src/core/animation/animation.ts:273` `  if (held.keyframes.some((k) => k.offset === offset)) return { kind: 'refused', message: message('status.animation.keyframeTaken', { offset: String(offset) }) };` — o deslocamento já tomado é recusado (`status.animation.keyframeTaken`); livre segue ao passo 9.
- R4: `src/core/animation/animation.ts:275` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava o resultado é a recusa `status.locked.edit`; sem trava segue ao passo 10.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/animation/animation.ts:267`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await, timer nem quadro entre a leitura e a gravação.

## Estado
- Lê: EST-L01-031 (`state.selection`), EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** a animação ganha um quadro-chave vazio no deslocamento pedido; o documento muda (passo 13), o histórico ganha um passo (passo 14) e a mensagem é `status.animation.keyframeAdded` (passo 11).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline desenha a marca do quadro-chave novo na trilha e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); o quadro-chave vazio não escreve declaração, então o desenho do nó fica como estava até um valor ser escrito.

## Regras
- G1: n/a — o tratador grava as animações do próprio nó (passo 11), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/animation/animation.ts:267` `export const addKeyframeCommand = registerHandler('animation.addKeyframe', (context, { animation, offset }): Outcome<never> => {`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/animation.json:217` `          "id": "timeline-add-keyframe",`).
- G4: n/a — o tratador só devolve correções e mensagem (passo 11); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/animation.json:231` `            "region": "dock-timeline",`).
- G6: n/a — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a alteração substitui o nó inteiro (`src/core/animation/animation.ts:215` `  { op: 'replace', path: [...found.path], value: withAnimations(found.node, animations) },`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
