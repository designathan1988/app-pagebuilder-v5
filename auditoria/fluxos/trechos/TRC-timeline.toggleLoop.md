# TRC-timeline.toggleLoop
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{}`; a porta panel-control `timeline-loop` não declara argumentos (`manifest/commands/animation.json:1031` `          "args": {}`).
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:205` `  'timeline.toggleLoop': toggleLoopCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/timeline/preview.ts:39` `export const toggleLoopCommand = registerHandler<'timeline.toggleLoop', EditorUi>('timeline.toggleLoop', ({ state }) => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:998` `        "predicate": "always",`) e marca o comando como não desfazível (`manifest/commands/animation.json:1004` `        "undoable": false`). [nada muda]
3. `src/editor/timeline/preview.ts:40` `  const timeline = timelineOf(state.ui);` — o estado atual da linha do tempo. [lê: EST-L01-037 via timelineOf]
4. `src/editor/timeline/preview.ts:41` `  const { loop: _dropped, ...rest } = timeline;` — o estado da linha do tempo sem o `loop`. [nada muda]
5. `src/editor/timeline/preview.ts:43` `  const next = timeline.loop === true ? rest : { ...rest, loop: true as const };` — o estado novo: sem `loop` se estava ligado, com `loop` se estava desligado (R1). [lê: EST-L01-037 via handlerContext]
6. `src/editor/timeline/preview.ts:44` `  return { kind: 'change', ui: { ...state.ui, timeline: next }, message: message(timeline.loop === true ? 'status.timeline.loopOff' : 'status.timeline.loopOn') };` — grava o estado novo e a mensagem da virada. [escreve: EST-L01-037 via run]
7. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
8. `src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` — sem correções, o documento fica como estava. [lê: EST-L01-030 via run]
9. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store guarda o estado do editor que o resultado trouxe. [escreve: EST-L01-037 via run]
10. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a troca da ui conta como mudança a publicar. [lê: EST-L01-037 via run]
11. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-037 via commit]
12. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-037 via publish]

## Ramos
- R1: `src/editor/timeline/preview.ts:43` `  const next = timeline.loop === true ? rest : { ...rest, loop: true as const };` — com `ui.timeline.loop` verdadeiro o passo 5 tira o campo (repetição desligada, mensagem `status.timeline.loopOff`); sem ele o passo 5 põe `loop: true` (mensagem `status.timeline.loopOn`).

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/timeline/preview.ts:39`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await, timer nem quadro entre a leitura e a gravação.

## Estado
- Lê: EST-L01-037 (o estado do editor, via timelineOf, handlerContext).
- Escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, publish).

## Resultado
- **Estado final:** `ui.timeline.loop` vira o contrário do que estava (`src/editor/timeline/preview.ts:44` `  return { kind: 'change', ui: { ...state.ui, timeline: next }, message: message(timeline.loop === true ? 'status.timeline.loopOff' : 'status.timeline.loopOn') };`); o documento não muda.
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel Timeline redesenha o botão Loop conforme o estado novo.
- **DOM do canvas:** o laço que move o playhead passa a repetir, ou deixa de repetir (`src/editor/canvas/frame.tsx:212` `  useEffect(() => installPlayingLoop(store), [store]);`); o documento não muda (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` com `documentChanged` falso).

## Regras
- G1: n/a — o tratador grava só estado do editor (passo 6), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação e não tem argumentos (`src/editor/timeline/preview.ts:39` `export const toggleLoopCommand = registerHandler<'timeline.toggleLoop', EditorUi>('timeline.toggleLoop', ({ state }) => {`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/animation.json:1008` `          "id": "timeline-loop",`).
- G4: n/a — o tratador só grava estado do editor (passo 6); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/animation.json:1022` `            "region": "dock-timeline",`).
- G6: n/a — o comando não escreve seleção (`src/editor/timeline/preview.ts:44` `  return { kind: 'change', ui: { ...state.ui, timeline: next }, message: message(timeline.loop === true ? 'status.timeline.loopOff' : 'status.timeline.loopOn') };`); a seleção lida é a da store.
- G7: n/a — o resultado não traz patches, então o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
