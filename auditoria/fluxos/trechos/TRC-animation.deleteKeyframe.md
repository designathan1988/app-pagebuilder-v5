# TRC-animation.deleteKeyframe
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ readonly animation: string; readonly keyframe: number }`; as duas portas não declaram argumentos próprios (`manifest/commands/animation.json:442` `          "args": {}` e `manifest/commands/animation.json:462` `          "args": {}`) e o painel (pela porta panel-control) e a tecla Delete no contexto `timeline` (pela porta shortcut) acrescentam a animação mostrada e o quadro-chave.
- **Ramos que dependem dos argumentos:** R2 (o quadro-chave existe na animação)

## Passos
1. `src/app/commands.ts:198` `  'animation.deleteKeyframe': deleteKeyframeCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta panel-control `timeline-keyframe-delete` (`manifest/commands/animation.json:419` `          "id": "timeline-keyframe-delete",`) despacha o comando. [nada muda]
3. `src/editor/input/keymap.ts:532` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta shortcut `key-delete-in-timeline` (`manifest/commands/animation.json:448` `          "chord": "Delete",`) despacha o mesmo comando pelo teclado no contexto `timeline`. [nada muda]
4. `src/core/animation/animation.ts:314` `export const deleteKeyframeCommand = registerHandler('animation.deleteKeyframe', (context, { animation, keyframe }): Outcome<never> => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:403` `        "predicate": "always",`). [nada muda]
5. `src/core/animation/animation.ts:315` `  const found = targetNode(context);` — resolve o elemento único da seleção. [lê: EST-L01-031 via targetNode] [lê: EST-L01-030 via targetNode]
6. `src/core/animation/animation.ts:316` `  const held = found === null ? null : named(found.node, animation);` — procura a animação pelo nome no nó. [lê: EST-L01-030 via named]
7. `src/core/animation/animation.ts:317` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento ou sem a animação, nada muda (R1). [nada muda]
8. `src/core/animation/animation.ts:318` `  if (!held.keyframes.some((k) => k.offset === keyframe)) return { kind: 'change' };` — sem o quadro-chave do deslocamento pedido, nada muda (R2). [lê: EST-L01-030 via handlerContext]
9. `src/core/animation/animation.ts:319` `  const locked = lockedRefusal(context, found.node);` — elemento travado, ou dentro de um, recusa (R3). [lê: EST-L01-030 via lockedRefusal]
10. `src/core/animation/animation.ts:321` `  const keyframes = held.keyframes.filter((k) => k.offset !== keyframe);` — os quadros-chave sem o apagado. [lê: EST-L01-030 via handlerContext]
11. `src/core/animation/animation.ts:322` `  return { kind: 'change', patches: writeAnimations(found, replaceAnimation(found.node, animation, { ...held, keyframes })), message: message('status.animation.keyframeDeleted', { name: animation, offset: String(keyframe) }) };` — o resultado leva a substituição do nó e a mensagem. [escreve: EST-L01-030 via run]
12. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via run]
13. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a substituição é aplicada ao documento. [escreve: EST-L01-030 via run]
14. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o comando é desfazível: entra um passo de histórico. [escreve: EST-L01-032 via run]
15. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar. [lê: EST-L01-030 via commit]
16. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit]
17. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-030 via publish]

## Ramos
- R1: `src/core/animation/animation.ts:317` `  if (found === null || held === null) return { kind: 'change' };` — sem elemento selecionado ou sem a animação: resultado vazio; com ambos segue ao passo 8.
- R2: `src/core/animation/animation.ts:318` `  if (!held.keyframes.some((k) => k.offset === keyframe)) return { kind: 'change' };` — sem o quadro-chave pedido: resultado vazio; com ele segue ao passo 9.
- R3: `src/core/animation/animation.ts:320` `  if (locked !== null) return { kind: 'refused', message: locked };` — com trava o resultado é a recusa `status.locked.edit`; sem trava segue ao passo 10.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/core/animation/animation.ts:314`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; os despachos em `src/editor/doors/door.tsx:144` e `src/editor/input/keymap.ts:531` não interpõem await, timer nem quadro entre a leitura e a gravação.

## Estado
- Lê: EST-L01-031 (`state.selection`), EST-L01-030 (`state.document`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** a animação perde o quadro-chave do deslocamento pedido; o documento muda (passo 13), o histórico ganha um passo (passo 14) e a mensagem é `status.animation.keyframeDeleted` (passo 11).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline apaga a marca do quadro na trilha e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha a folha `@keyframes` sem o bloco apagado.

## Regras
- G1: n/a — o tratador grava as animações do próprio nó (passo 11), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/animation/animation.ts:314` `export const deleteKeyframeCommand = registerHandler('animation.deleteKeyframe', (context, { animation, keyframe }): Outcome<never> => {`).
- G3: ok — as duas portas de `animation.deleteKeyframe` chegam ao mesmo tratador (`src/app/commands.ts:198` `  'animation.deleteKeyframe': deleteKeyframeCommand,`) com a mesma intenção (a animação mostrada e o quadro-chave), uma pelo botão (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`) e outra pela tecla Delete (`src/editor/input/keymap.ts:532` `    if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G4: n/a — o tratador só devolve correções e mensagem (passo 11); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; as portas vivem na colocação do painel (`manifest/commands/animation.json:433` `            "region": "dock-timeline",`) e no mapa de teclas.
- G6: n/a — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a alteração substitui o nó inteiro (`src/core/animation/animation.ts:215` `  { op: 'replace', path: [...found.path], value: withAnimations(found.node, animations) },`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
