# TRC-timeline.setPlayhead
- **Chamada:** `src/editor/input/pointer/panels.ts:78` `    shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, time, distance: at.x - startX } as never);`
- **Argumentos:** `{ readonly time?: number; readonly distance?: number }`; a porta panel-drag `panel-drag-playhead-ruler` não declara argumentos próprios e o arrasto acrescenta `time` (o tempo sob o ponteiro) e `distance` (o quanto o ponteiro andou).
- **Ramos que dependem dos argumentos:** R1 (time ausente), R2 (tempo igual e já ao vivo)

## Passos
1. `src/app/commands.ts:200` `  'timeline.setPlayhead': setPlayheadCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/input/pointer/panels.ts:77` `    shared.open = store.gesture();` — o arrasto da régua abre um gesto e o despacho corre dentro dele. [escreve: EST-L01-007 via store.gesture]
3. `src/editor/timeline/playhead.ts:136` `export const setPlayheadCommand = registerHandler<'timeline.setPlayhead', EditorUi>('timeline.setPlayhead', ({ state }, { time }) => {` — o tratador é registrado; o manifesto pede o predicado `always` (`manifest/commands/animation.json:828` `        "predicate": "always",`) e marca o comando como não desfazível (`manifest/commands/animation.json:834` `        "undoable": false`). [nada muda]
4. `src/editor/timeline/playhead.ts:138` `  if (time === undefined) return { kind: 'change' };` — sem tempo (um passo, sem arrasto) nada muda (R1). [nada muda]
5. `src/editor/timeline/playhead.ts:139` `  const shown = shownAnimation(state);` — a animação mostrada. [lê: EST-L01-037 via shownAnimation]
6. `src/editor/timeline/playhead.ts:140` `  const duration = shown === null ? 0 : durationMs(shown.animation);` — a duração da animação em ms (`durationMs` está em `src/core/animation/animation.ts:89` `export function durationMs(animation: Animation): number {`). [lê: EST-L01-030 via durationMs]
7. `src/editor/timeline/playhead.ts:141` `  const clamped = Math.min(duration, Math.max(0, Math.round(time)));` — o tempo arredondado e preso entre 0 e a duração. [nada muda]
8. `src/editor/timeline/playhead.ts:142` `  const timeline = timelineOf(state.ui);` — o estado atual da linha do tempo. [lê: EST-L01-037 via timelineOf]
9. `src/editor/timeline/playhead.ts:143` `  if (timeline.time === clamped && timeline.live === true) return { kind: 'change' };` — o mesmo tempo já ao vivo não muda nada (R2). [nada muda]
10. `src/editor/timeline/playhead.ts:145` `  return { kind: 'change', ui: { ...state.ui, timeline: { ...timeline, time: clamped, live: true } } };` — grava o tempo e marca a prévia ao vivo. [escreve: EST-L01-037 via run]
11. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — o `run` da store executa o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
12. `src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` — sem correções, o documento fica como estava. [lê: EST-L01-030 via run]
13. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store guarda o estado do editor que o resultado trouxe. [escreve: EST-L01-037 via run]
14. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a troca da ui conta como mudança a publicar. [lê: EST-L01-037 via run]
15. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-037 via commit]
16. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-037 via publish]

## Ramos
- R1: `src/editor/timeline/playhead.ts:138` `  if (time === undefined) return { kind: 'change' };` — o tempo ausente deixa o resultado vazio; presente segue ao passo 5.
- R2: `src/editor/timeline/playhead.ts:143` `  if (timeline.time === clamped && timeline.live === true) return { kind: 'change' };` — o mesmo tempo com a prévia já ao vivo deixa o resultado vazio; outro tempo, ou a prévia ainda não ao vivo, segue ao passo 10.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/timeline/playhead.ts:126`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; cada quadro do arrasto despacha em `src/editor/input/pointer/panels.ts:78`, sem await, timer nem quadro interposto pelo próprio trecho.

## Estado
- Lê: EST-L01-030 (o documento, via handlerContext, durationMs), EST-L01-031 (a seleção, via handlerContext), EST-L01-037 (o estado do editor, via handlerContext, shownAnimation, timelineOf).
- Escreve: EST-L01-037 (o estado do editor, via run, publish), EST-L01-007 (`open`, o gesto que acumula o arrasto).

## Resultado
- **Estado final:** `ui.timeline.time` passa a ser `clamped` e `ui.timeline.live` fica verdadeiro (`src/editor/timeline/playhead.ts:145` `  return { kind: 'change', ui: { ...state.ui, timeline: { ...timeline, time: clamped, live: true } } };`); o documento não muda.
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Timeline redesenha o marcador do playhead na régua.
- **DOM do canvas:** o quadro desenha a animação mostrada no tempo do playhead (`src/editor/canvas/frame.tsx:173` `        renderer.previewTimeline(s.document, timelinePreview(s));`); o documento não muda (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` com `documentChanged` falso).

## Regras
- G1: n/a — o tratador grava só estado do editor (passo 10), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/editor/timeline/playhead.ts:136` `export const setPlayheadCommand = registerHandler<'timeline.setPlayhead', EditorUi>('timeline.setPlayhead', ({ state }, { time }) => {`); o tempo vem do arrasto.
- G3: n/a — o comando tem uma porta só (`manifest/commands/animation.json:838` `          "id": "panel-drag-playhead-ruler",`).
- G4: n/a — o tratador só grava estado do editor (passo 10); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta é um arrasto de painel (`manifest/commands/animation.json:839` `          "kind": "panel-drag",`).
- G6: n/a — o comando não escreve seleção (`src/editor/timeline/playhead.ts:145` `  return { kind: 'change', ui: { ...state.ui, timeline: { ...timeline, time: clamped, live: true } } };`); a seleção lida é a da store.
- G7: n/a — o resultado não traz patches, então o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador; o gesto que ele corre é fechado pelo caminho da porta (`src/editor/input/pointer/panels.ts:77` `    shared.open = store.gesture();`).

## Medições
- nenhuma — o tempo sob o ponteiro é calculado pelo caminho da porta (`src/editor/input/pointer/panels.ts:75` `    const time = playheadTimeFromTrackX(shown.animation, at.x - press.track.left);`), fora do trecho.
