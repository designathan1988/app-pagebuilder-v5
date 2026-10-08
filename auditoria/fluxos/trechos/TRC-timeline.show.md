# TRC-timeline.show
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ readonly animation: string }`; a porta panel-control `timeline-animation-row` não declara argumentos próprios (`manifest/commands/animation.json:806` `          "args": {}`) e a linha do painel acrescenta o nome da animação que ela mostra.
- **Ramos que dependem dos argumentos:** R1 (nenhuma animação mostrada), R2 (a animação pedida já é a mostrada)

## Passos
1. `src/app/commands.ts:201` `  'timeline.show': showAnimationCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/timeline/playhead.ts:130` `export const showAnimationCommand = registerHandler<'timeline.show', EditorUi>('timeline.show', ({ state }, { animation }) => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:773` `        "predicate": "always",`) e marca o comando como não desfazível (`manifest/commands/animation.json:779` `        "undoable": false`). [nada muda]
3. `src/editor/timeline/playhead.ts:131` `  const shown = shownAnimation(state);` — a animação que o painel mostra agora. [lê: EST-L01-037 via shownAnimation]
4. `src/editor/timeline/playhead.ts:52` `  const primary = state.selection[0];` — o primeiro elemento da seleção. [lê: EST-L01-037 via shownAnimation]
5. `src/editor/timeline/playhead.ts:54` `  const found = locate(state.document, primary);` — localiza o nó e o caminho. [lê: EST-L01-030 via locate]
6. `src/editor/timeline/playhead.ts:57` `  const chosen = held.find((animation) => animation.name === timelineOf(state.ui).shown) ?? held[0];` — a animação nomeada em `ui.timeline.shown`, ou a primeira do elemento. [lê: EST-L01-037 via shownAnimation]
7. `src/editor/timeline/playhead.ts:132` `  if (shown === null || shown.animation.name === animation) return { kind: 'change' };` — sem elemento com animação, ou já mostrando a pedida, nada muda (R1, R2). [nada muda]
8. `src/editor/timeline/playhead.ts:133` `  return { kind: 'change', ui: { ...state.ui, timeline: { ...timelineOf(state.ui), shown: animation, time: 0 } }, message: message('status.timeline.shown', { name: animation }) };` — grava a animação mostrada e zera o playhead; `timelineOf` está em `src/editor/timeline/playhead.ts:39` `export const timelineOf = (ui: EditorUi): TimelineState => ui.timeline ?? INITIAL_TIMELINE;`. [escreve: EST-L01-037 via run]
9. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
10. `src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` — sem correções, o documento fica como estava. [lê: EST-L01-030 via run]
11. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store guarda o estado do editor que o resultado trouxe. [escreve: EST-L01-037 via run]
12. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a troca da ui conta como mudança a publicar. [lê: EST-L01-037 via run]
13. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-037 via commit]
14. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-037 via publish]

## Ramos
- R1: `src/editor/timeline/playhead.ts:132` `  if (shown === null || shown.animation.name === animation) return { kind: 'change' };` — sem elemento selecionado, sem animação no elemento, ou sem a animação nomeada: resultado vazio; com uma animação a mostrar diferente da pedida segue ao passo 8.
- R2: `src/editor/timeline/playhead.ts:132` `  if (shown === null || shown.animation.name === animation) return { kind: 'change' };` — a animação pedida já sendo a mostrada: resultado vazio; outra segue ao passo 8.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/timeline/playhead.ts:120`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await, timer nem quadro entre a leitura e a gravação.

## Estado
- Lê: EST-L01-030 (o documento, via handlerContext, locate), EST-L01-031 (a seleção, via handlerContext, shownAnimation), EST-L01-037 (o estado do editor, via handlerContext, shownAnimation, timelineOf).
- Escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, publish).

## Resultado
- **Estado final:** `ui.timeline.shown` passa a ser a animação pedida e `ui.timeline.time` volta a 0 (`src/editor/timeline/playhead.ts:133` `  return { kind: 'change', ui: { ...state.ui, timeline: { ...timelineOf(state.ui), shown: animation, time: 0 } }, message: message('status.timeline.shown', { name: animation }) };`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha a trilha da animação mostrada e a barra de status mostra a mensagem.
- **DOM do canvas:** nada muda — o resultado não traz correções, então o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` com `documentChanged` falso).

## Regras
- G1: n/a — o tratador grava só estado do editor (`src/editor/timeline/playhead.ts:133` `  return { kind: 'change', ui: { ...state.ui, timeline: { ...timelineOf(state.ui), shown: animation, time: 0 } }, message: message('status.timeline.shown', { name: animation }) };`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/editor/timeline/playhead.ts:130` `export const showAnimationCommand = registerHandler<'timeline.show', EditorUi>('timeline.show', ({ state }, { animation }) => {`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/animation.json:783` `          "id": "timeline-animation-row",`).
- G4: n/a — o tratador só grava estado do editor (passo 8); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/animation.json:797` `            "region": "dock-timeline",`).
- G6: n/a — o comando não escreve seleção (`src/editor/timeline/playhead.ts:133` `  return { kind: 'change', ui: { ...state.ui, timeline: { ...timelineOf(state.ui), shown: animation, time: 0 } }, message: message('status.timeline.shown', { name: animation }) };`); a seleção lida é a da store.
- G7: n/a — o resultado não traz patches, então o documento e o canvas ficam como estavam (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
