# TRC-timeline.play
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{}`; a porta panel-control `timeline-play` não declara argumentos (`manifest/commands/animation.json:899` `          "args": {}`).
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:202` `  'timeline.play': playCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/timeline/preview.ts:17` `export const playCommand = registerHandler<'timeline.play', EditorUi>('timeline.play', ({ state }) => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:866` `        "predicate": "always",`) e marca o comando como não desfazível (`manifest/commands/animation.json:872` `        "undoable": false`). [nada muda]
3. `src/editor/timeline/preview.ts:18` `  const shown = shownAnimation(state);` — a animação mostrada. [lê: EST-L01-037 via shownAnimation]
4. `src/editor/timeline/preview.ts:19` `  if (shown === null) return { kind: 'change' };` — sem animação mostrada nada muda (R1). [nada muda]
5. `src/editor/timeline/preview.ts:20` `  return { kind: 'change', ui: { ...state.ui, timeline: { ...timelineOf(state.ui), live: true, playing: true } }, message: message('status.timeline.playing', { name: shown.animation.name }) };` — grava a prévia ao vivo e a reprodução, com a mensagem. [escreve: EST-L01-037 via run]
6. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
7. `src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` — sem correções, o documento fica como estava. [lê: EST-L01-030 via run]
8. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store guarda o estado do editor que o resultado trouxe. [escreve: EST-L01-037 via run]
9. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a troca da ui conta como mudança a publicar. [lê: EST-L01-037 via run]
10. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-037 via commit]
11. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-037 via publish]

## Ramos
- R1: `src/editor/timeline/preview.ts:19` `  if (shown === null) return { kind: 'change' };` — sem elemento selecionado ou sem animação no elemento: resultado vazio; com uma animação mostrada segue ao passo 5.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/timeline/preview.ts:17`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o laço que move o playhead enquanto toca é instalado pelo quadro do canvas (`src/editor/canvas/frame.tsx:212` `  useEffect(() => installPlayingLoop(store), [store]);`), fora do trecho.

## Estado
- Lê: EST-L01-030 (o documento, via handlerContext), EST-L01-031 (a seleção, via handlerContext), EST-L01-037 (o estado do editor, via handlerContext, shownAnimation, timelineOf).
- Escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, publish).

## Resultado
- **Estado final:** `ui.timeline.playing` e `ui.timeline.live` ficam verdadeiros (`src/editor/timeline/preview.ts:20` `  return { kind: 'change', ui: { ...state.ui, timeline: { ...timelineOf(state.ui), live: true, playing: true } }, message: message('status.timeline.playing', { name: shown.animation.name }) };`); o documento não muda.
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel Timeline redesenha o estado dos botões.
- **DOM do canvas:** o quadro passa a desenhar a animação mostrada e a andar o playhead (`src/editor/canvas/frame.tsx:173` `        renderer.previewTimeline(s.document, timelinePreview(s));`); o documento não muda (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` com `documentChanged` falso).

## Regras
- G1: n/a — o tratador grava só estado do editor (passo 5), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação e não tem argumentos (`src/editor/timeline/preview.ts:17` `export const playCommand = registerHandler<'timeline.play', EditorUi>('timeline.play', ({ state }) => {`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/animation.json:876` `          "id": "timeline-play",`).
- G4: n/a — o tratador só grava estado do editor (passo 5); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/animation.json:890` `            "region": "dock-timeline",`).
- G6: n/a — o comando não escreve seleção (`src/editor/timeline/preview.ts:20` `  return { kind: 'change', ui: { ...state.ui, timeline: { ...timelineOf(state.ui), live: true, playing: true } }, message: message('status.timeline.playing', { name: shown.animation.name }) };`); a seleção lida é a da store.
- G7: n/a — o resultado não traz patches, então o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
