# TRC-motion.select
- **Chamada:** `src/app/commands.ts:277` `'motion.select': selectMotionCommand,`
- **Argumentos:** `{ readonly actions?: readonly string[]; readonly keyframes?: readonly KeyframeRef[]; readonly timeline?: string; readonly at?: number; readonly property?: string; readonly keyframeAt?: number; readonly add?: boolean }`; `actions`/`keyframes` são as barras e quadros-chave nomeados por id, `timeline`/`at`/`property`/`keyframeAt` os nomeados por lugar e `add` diz se a pressa soma à seleção. As portas panel-control `timeline-motion-bar` e `timeline-motion-keyframe` (`manifest/commands/motion.json:2001` `"id": "timeline-motion-bar",`) fixam o `add`.
- **Ramos que dependem dos argumentos:** R1 (`actions`/`keyframes`), R2 (`add`)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:1991` `"predicate": "always",`), que não barra nada.
3. `src/editor/motion/state.ts:128` `export const selectMotionCommand = registerHandler<'motion.select', EditorUi>('motion.select', ({ state }, { actions, keyframes, timeline, at, property, keyframeAt, add }) => {` — o tratador recebe os sete campos; o histórico não é desfazível (`manifest/commands/motion.json:1997` `        "undoable": false`).
4. `src/editor/motion/state.ts:129` `  const motion = motionUiOf(state.ui);` — o estado do painel. [lê: EST-L08-019 via motionUiOf]
5. `src/editor/motion/state.ts:132` `  const found = timeline === undefined ? null : findTimeline(state.document, timeline);` — a timeline do documento pelo nome, ou nada. [lê: EST-L01-030 via findTimeline]
6. `src/editor/motion/state.ts:133` `  const action = found === null || at === undefined ? undefined : found.timeline.actions[at];` — a ação no lugar pedido. [lê: EST-L01-030 via findTimeline]
7. `src/editor/motion/state.ts:134` `  const tracks = action === undefined || (action.effect.kind !== 'animate' && action.effect.kind !== 'split-text') ? [] : action.effect.tracks;` — as trilhas só existem numa animação.
8. `src/editor/motion/state.ts:135` `  const track = property === undefined ? undefined : tracks.find((one) => one.property === property);` — a trilha da propriedade pedida.
9. `src/editor/motion/state.ts:137` `  const placedKeyframe: KeyframeRef[] = action !== undefined && track !== undefined && keyframe !== undefined ? [{ action: action.id, track: track.id, keyframe: keyframe.id }] : [];` — o quadro-chave no lugar pedido.
10. `src/editor/motion/state.ts:138` `  const placedAction: string[] = action !== undefined && property === undefined ? [action.id] : [];` — a barra no lugar pedido.
11. `src/editor/motion/state.ts:139` `  const pickedActions = isIds(actions) ? actions : placedAction;` — a lista de barras por id, senão a do lugar (R1).
12. `src/editor/motion/state.ts:140` `  const pickedKeyframes = isRefs(keyframes) ? keyframes : placedKeyframe;` — a lista de quadros-chave por id, senão a do lugar (R1).
13. `src/editor/motion/state.ts:146` `  const nextActions = add === true ? toggleIn(motion.selectedActions ?? [], pickedActions, (a, b) => a === b) : pickedActions;` — com `add` a barra nova entra ou sai da seleção; sem ele a seleção é a nova (R2). [lê: EST-L08-019 via motion]
14. `src/editor/motion/state.ts:147` `  const nextKeyframes = add === true ? toggleIn(motion.selectedKeyframes ?? [], pickedKeyframes, same) : pickedKeyframes;` — o mesmo para os quadros-chave (R2).
15. `src/editor/motion/state.ts:148` `  return { kind: 'change', ui: withMotion(state.ui, { ...motion, selectedActions: nextActions, selectedKeyframes: nextKeyframes }) };` — o resultado troca a seleção do painel. [escreve: EST-L08-019 via withMotion]
16. `src/editor/motion/state.ts:42` `const withMotion = (ui: EditorUi, motion: MotionUiState): EditorUi => ({ ...ui, motion });` — o `ui` novo com o campo `motion` trocado.
17. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — o `ui` do resultado passa ao estado. [escreve: EST-L01-037 via run]
18. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo conta como mudança. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run]
19. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
20. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/editor/motion/state.ts:139` `  const pickedActions = isIds(actions) ? actions : placedAction;` — com `actions`/`keyframes` por id a seleção vem deles; sem eles vem do lugar (`timeline`+`at`+`property`+`keyframeAt`), que pode ser vazio.
- R2: `src/editor/motion/state.ts:146` `  const nextActions = add === true ? toggleIn(motion.selectedActions ?? [], pickedActions, (a, b) => a === b) : pickedActions;` — com `add` verdadeiro a escolha soma à seleção e tira o que repete; com `add` ausente a seleção passa a ser só a escolha.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/motion/state.ts:128`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o clique da porta panel-control (`src/editor/motion/ui/timeline.tsx:143` `onClick={(event: MouseEvent) => (event.shiftKey ? adding.run() : plain.run())}`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.selectedActions`, `ui.motion.selectedKeyframes`).
- Escreve: EST-L08-019 (`ui.motion.selectedActions`, `ui.motion.selectedKeyframes`), EST-L01-037 (`state.ui`).

## Resultado
- **Estado final:** a seleção de barras e quadros-chave do painel passa a `nextActions`/`nextKeyframes` (passo 15); a mensagem não muda.
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`); os assinantes de documento não, porque o documento não mudou (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- **DOM do editor:** o painel Timeline redesenha as barras e quadros-chave selecionados.
- **DOM do canvas:** nada muda — o tratador não devolve correção (`src/editor/motion/state.ts:148`).

## Regras
- G1: n/a — o tratador grava a seleção do painel (`src/editor/motion/state.ts:148`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/editor/motion/state.ts:128`).
- G3: ok — as quatro portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:277` `'motion.select': selectMotionCommand,` e enviam só a lista ou o lugar e o `add`; o tratador decide por eles.
- G4: n/a — o tratador só devolve o `ui` (`src/editor/motion/state.ts:148`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle fora do painel; a porta vive na colocação do painel (`manifest/commands/motion.json:2001` `"id": "timeline-motion-bar",`).
- G6: ok — a seleção de elementos não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`), e o painel apenas deriva da store.
- G7: n/a — o resultado não traz correção, então o documento do canvas não muda (`src/editor/motion/state.ts:148`).
- INT: n/a — o trecho não escreve no documento; devolve só o estado do editor (`src/editor/motion/state.ts:148`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
