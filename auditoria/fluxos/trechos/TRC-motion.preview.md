# TRC-motion.preview
- **Chamada:** `src/app/commands.ts:292` `'motion.preview': previewMotionCommand,`
- **Argumentos:** `{ readonly operation?: string }`; `operation` é `play`, `pause` ou `stop`. As três portas fixam a operação (`manifest/commands/motion.json:3191` `"id": "timeline-motion-play",` … `manifest/commands/motion.json:3247` `"id": "timeline-motion-stop",`).
- **Ramos que dependem dos argumentos:** R2, R3 e R4 (`operation`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:3179` `"predicate": "always",`), que não barra nada.
3. `src/editor/motion/state.ts:189` `export const previewMotionCommand = registerHandler<'motion.preview', EditorUi>(` — o tratador é registrado com um `current` que diz se a prévia toca. O histórico não é desfazível (`manifest/commands/motion.json:3187` `        "undoable": false`).
4. `src/editor/motion/state.ts:192` `    const motion = motionUiOf(state.ui);` — o estado do painel. [lê: EST-L08-019 via motionUiOf]
5. `src/editor/motion/state.ts:193` `    const name = shownTimeline(state);` — a timeline mostrada pelo painel. [lê: EST-L01-030 via shownTimeline] [lê: EST-L01-031 via shownTimeline] [lê: EST-L01-037 via shownTimeline]
6. `src/editor/motion/state.ts:47` `export function shownTimeline(state: StoreState<EditorUi>): string | null {` — a timeline nomeada, ou a primeira que o elemento toca, ou a primeira do projeto.
7. `src/editor/motion/state.ts:194` `    if (name === null) return { kind: 'refused', message: message('status.motion.noTimeline') };` — sem timeline recusa `status.motion.noTimeline` (R1). [nada muda]
8. `src/editor/motion/state.ts:195` `    if (operation === 'play') return { kind: 'change', ui: withMotion(state.ui, { ...motion, previewing: true, playing: true }), message: message('status.motion.previewPlaying', { name }) };` — `play` liga a prévia e a execução (R2). [escreve: EST-L08-019 via withMotion]
9. `src/editor/motion/state.ts:196` `    const { playing: _playing, ...paused } = motion;` — a pausa tira o campo `playing`. [lê: EST-L08-019 via motion]
10. `src/editor/motion/state.ts:198` `    if (operation === 'pause') return motion.playing === true ? { kind: 'change', ui: withMotion(state.ui, paused) } : { kind: 'change' };` — `pause` só muda quando algo tocava (R3). [escreve: EST-L08-019 via withMotion]
11. `src/editor/motion/state.ts:199` `    const { previewing: _previewing, ...stopped } = paused;` — a parada tira também o campo `previewing`. [lê: EST-L08-019 via motion]
12. `src/editor/motion/state.ts:201` `    return { kind: 'change', ui: withMotion(state.ui, { ...stopped, time: 0 }), message: message('status.motion.previewStopped') };` — `stop` desliga a prévia e devolve o cursor a 0 (R4). [escreve: EST-L08-019 via withMotion]
13. `src/editor/motion/state.ts:42` `const withMotion = (ui: EditorUi, motion: MotionUiState): EditorUi => ({ ...ui, motion });` — o `ui` novo com o campo `motion` trocado.
14. `src/editor/motion/state.ts:203` `  (state, args) => args.operation === 'play' && motionUiOf(state.ui).playing === true,` — o `current`: a porta Play está acesa enquanto a prévia toca. [lê: EST-L08-019 via motionUiOf]
15. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — o `ui` do resultado passa ao estado. [escreve: EST-L01-037 via run]
16. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo conta como mudança. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run]
17. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — a mensagem do estado passa a ser a do recado. [escreve: EST-L01-033 via run]
18. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
19. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/editor/motion/state.ts:194` `    if (name === null) return { kind: 'refused', message: message('status.motion.noTimeline') };` — sem timeline mostrada recusa `status.motion.noTimeline`; com ela segue ao passo 8.
- R2: `src/editor/motion/state.ts:195` `    if (operation === 'play') return { kind: 'change', ui: withMotion(state.ui, { ...motion, previewing: true, playing: true }), message: message('status.motion.previewPlaying', { name }) };` — `operation` `play` liga a prévia e a execução com `status.motion.previewPlaying`; outro valor segue ao passo 9.
- R3: `src/editor/motion/state.ts:198` `    if (operation === 'pause') return motion.playing === true ? { kind: 'change', ui: withMotion(state.ui, paused) } : { kind: 'change' };` — `operation` `pause` com algo tocando tira `playing`; sem algo tocando nada muda; outro valor (a parada) segue ao passo 11.
- R4: `src/editor/motion/state.ts:201` `    return { kind: 'change', ui: withMotion(state.ui, { ...stopped, time: 0 }), message: message('status.motion.previewStopped') };` — `operation` `stop` desliga a prévia e devolve o cursor a 0, com `status.motion.previewStopped`.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/motion/state.ts:189`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o clique da porta panel-control (`src/editor/shell/panel-field.tsx:203` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro; o passo do cursor prévia (`src/editor/motion/state.ts:218` `export function nextPreviewTime(state: StoreState<EditorUi>, elapsed: number): { readonly time: number; readonly ended: boolean } | null {`) é chamado pelo dono do quadro do canvas, fora deste trecho.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.previewing`, `ui.motion.playing`, `ui.motion.time`).
- Escreve: EST-L08-019 (`ui.motion.previewing`, `ui.motion.playing`, `ui.motion.time`), EST-L01-037 (`state.ui`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** `play` liga `previewing` e `playing`; `pause` tira `playing` quando algo toca; `stop` tira os dois e devolve o tempo a 0 (passos 8, 10, 12).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`); os assinantes de documento não, porque o documento não mudou (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- **DOM do editor:** o painel Timeline redesenha os botões de prévia e a barra de status mostra a mensagem.
- **DOM do canvas:** o preview desenha a timeline no cursor enquanto a prévia está ligada (`src/editor/motion/state.ts:195`); sem correção, o documento do canvas não muda.

## Regras
- G1: n/a — o tratador grava o estado de prévia do painel (`src/editor/motion/state.ts:195`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/editor/motion/state.ts:189`).
- G3: ok — as três portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:292` `'motion.preview': previewMotionCommand,` e enviam só a `operation`; o tratador decide por ela (`src/editor/motion/state.ts:195`).
- G4: n/a — o tratador só devolve o `ui` e a mensagem (`src/editor/motion/state.ts:195`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; as portas vivem na colocação do painel (`manifest/commands/motion.json:3191` `"id": "timeline-motion-play",`).
- G6: ok — a seleção de elementos não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o resultado não traz correção, então o documento do canvas não muda; só o desenho de prévia do editor (`src/editor/motion/state.ts:195`).
- INT: n/a — o trecho não escreve no documento; devolve só o estado do editor (`src/editor/motion/state.ts:195`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
