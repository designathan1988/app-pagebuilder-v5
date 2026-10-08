# TRC-timeline.pause
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{}`; a porta panel-control `timeline-pause` não declara argumentos (`manifest/commands/animation.json:943` `          "args": {}`).
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:203` `  'timeline.pause': pauseCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/timeline/preview.ts:23` `export const pauseCommand = registerHandler<'timeline.pause', EditorUi>('timeline.pause', ({ state }) => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:910` `        "predicate": "always",`) e marca o comando como não desfazível (`manifest/commands/animation.json:916` `        "undoable": false`). [nada muda]
3. `src/editor/timeline/preview.ts:24` `  const timeline = timelineOf(state.ui);` — o estado atual da linha do tempo. [lê: EST-L01-037 via timelineOf]
4. `src/editor/timeline/preview.ts:25` `  if (timeline.playing !== true) return { kind: 'change' };` — se não está tocando nada muda (R1). [nada muda]
5. `src/editor/timeline/preview.ts:26` `  const { playing: _dropped, ...rest } = timeline;` — o estado da linha do tempo sem o `playing`. [nada muda]
6. `src/editor/timeline/preview.ts:28` `  return { kind: 'change', ui: { ...state.ui, timeline: rest }, message: message('status.timeline.paused', { time: Math.round(timeline.time) }) };` — grava a linha do tempo parada, com a mensagem do tempo. [escreve: EST-L01-037 via run]
7. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
8. `src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` — sem correções, o documento fica como estava. [lê: EST-L01-030 via run]
9. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store guarda o estado do editor que o resultado trouxe. [escreve: EST-L01-037 via run]
10. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a troca da ui conta como mudança a publicar. [lê: EST-L01-037 via run]
11. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-037 via commit]
12. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-037 via publish]

## Ramos
- R1: `src/editor/timeline/preview.ts:25` `  if (timeline.playing !== true) return { kind: 'change' };` — quando não está tocando o resultado é vazio; quando está segue ao passo 5.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/timeline/preview.ts:23`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await, timer nem quadro entre a leitura e a gravação.

## Estado
- Lê: EST-L01-037 (o estado do editor, via timelineOf).
- Escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, publish).

## Resultado
- **Estado final:** `ui.timeline.playing` sai do estado (a prévia fica congelada no tempo atual) (`src/editor/timeline/preview.ts:28` `  return { kind: 'change', ui: { ...state.ui, timeline: rest }, message: message('status.timeline.paused', { time: Math.round(timeline.time) }) };`); o documento não muda.
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra a mensagem do tempo; o painel Timeline redesenha o estado dos botões.
- **DOM do canvas:** o quadro para de andar o playhead (`src/editor/canvas/frame.tsx:173` `        renderer.previewTimeline(s.document, timelinePreview(s));`); o documento não muda (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` com `documentChanged` falso).

## Regras
- G1: n/a — o tratador grava só estado do editor (passo 6), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação e não tem argumentos (`src/editor/timeline/preview.ts:23` `export const pauseCommand = registerHandler<'timeline.pause', EditorUi>('timeline.pause', ({ state }) => {`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/animation.json:920` `          "id": "timeline-pause",`).
- G4: n/a — o tratador só grava estado do editor (passo 6); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/animation.json:934` `            "region": "dock-timeline",`).
- G6: n/a — o comando não escreve seleção (`src/editor/timeline/preview.ts:28` `  return { kind: 'change', ui: { ...state.ui, timeline: rest }, message: message('status.timeline.paused', { time: Math.round(timeline.time) }) };`); a seleção lida é a da store.
- G7: n/a — o resultado não traz patches, então o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
