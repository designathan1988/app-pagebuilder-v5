# TRC-motion.zoomTimeline
- **Chamada:** `src/app/commands.ts:279` `'motion.zoomTimeline': zoomTimelineCommand,`
- **Argumentos:** `{ readonly factor?: number; readonly anchor?: number }`; `factor` é o fator do zoom (as portas fixam 1.25 e 0.8, `manifest/commands/motion.json:2187` `"id": "timeline-motion-zoom-in",`) e `anchor` é a posição em px onde o zoom prende o tempo (ausente: o cursor).
- **Ramos que dependem dos argumentos:** R1 (`factor`), R2 (`anchor`), R3 (zoom no limite)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:2177` `"predicate": "always",`), que não barra nada.
3. `src/editor/motion/state.ts:112` `export const zoomTimelineCommand = registerHandler<'motion.zoomTimeline', EditorUi>('motion.zoomTimeline', ({ state }, { factor, anchor }) => {` — o tratador recebe o fator e a âncora. O histórico não é desfazível (`manifest/commands/motion.json:2183` `        "undoable": false`).
4. `src/editor/motion/state.ts:113` `  const motion = motionUiOf(state.ui);` — o estado do painel. [lê: EST-L08-019 via motionUiOf]
5. `src/editor/motion/state.ts:114` `  const [min, max] = pairConstant('motion.zoomRange');` — os limites de zoom do manifesto. [nada muda]
6. `src/manifest/runtime.ts:115` `export function pairConstant(id: string): readonly [number, number] {` — o par (menor, maior) do manifesto.
7. `src/editor/motion/state.ts:115` `  const view = viewOf(motion);` — a vista da régua (px por segundo e rolagem). [lê: EST-L08-019 via viewOf]
8. `src/editor/motion/state.ts:116` `  const at = anchor ?? ((motion.time - motion.scroll) / 1000) * motion.pixelsPerSecond;` — a âncora do zoom, o cursor quando não vem do gesto (R2). [lê: EST-L08-019 via motion]
9. `src/editor/motion/state.ts:117` `  const next = zoomAt(view, factor, at, { min, max });` — a vista nova. [nada muda]
10. `src/core/motion/view.ts:25` `export function zoomAt(view: TimelineView, factor: number, anchorX: number, limits: ZoomLimits): TimelineView {` — o zoom prende o tempo sob a âncora e respeita os limites.
11. `src/editor/motion/state.ts:118` `  if (next.pixelsPerSecond === motion.pixelsPerSecond && next.scroll === motion.scroll) return { kind: 'change' };` — zoom no limite, que não muda px por segundo nem rolagem: alteração vazia (R3). [nada muda]
12. `src/editor/motion/state.ts:119` `  return { kind: 'change', ui: withMotion(state.ui, { ...motion, pixelsPerSecond: next.pixelsPerSecond, scroll: next.scroll }) };` — o resultado troca o zoom e a rolagem. [escreve: EST-L08-019 via withMotion]
13. `src/editor/motion/state.ts:42` `const withMotion = (ui: EditorUi, motion: MotionUiState): EditorUi => ({ ...ui, motion });` — o `ui` novo com o campo `motion` trocado.
14. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — o `ui` do resultado passa ao estado. [escreve: EST-L01-037 via run]
15. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo conta como mudança. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run]
16. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
17. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/editor/motion/state.ts:117` `  const next = zoomAt(view, factor, at, { min, max });` — `factor` maior que 1 aproxima, menor afasta; o `zoomAt` prende o resultado entre `min` e `max` (`src/core/motion/view.ts:26` `  const pixelsPerSecond = Math.min(limits.max, Math.max(limits.min, view.pixelsPerSecond * factor));`).
- R2: `src/editor/motion/state.ts:116` `  const at = anchor ?? ((motion.time - motion.scroll) / 1000) * motion.pixelsPerSecond;` — com `anchor` o zoom prende o tempo sob aquele px; sem ele, sob o cursor.
- R3: `src/editor/motion/state.ts:118` `  if (next.pixelsPerSecond === motion.pixelsPerSecond && next.scroll === motion.scroll) return { kind: 'change' };` — zoom já no limite: nada muda; abaixo do limite segue ao passo 12.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/motion/state.ts:112`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o clique da porta panel-control (`src/editor/shell/panel-field.tsx:203` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.pixelsPerSecond`, `ui.motion.scroll`, `ui.motion.time`).
- Escreve: EST-L08-019 (`ui.motion.pixelsPerSecond`, `ui.motion.scroll`), EST-L01-037 (`state.ui`).

## Resultado
- **Estado final:** `ui.motion.pixelsPerSecond` e `ui.motion.scroll` passam aos valores do `zoomAt` (passo 12); a mensagem não muda.
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`); os assinantes de documento não, porque o documento não mudou (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- **DOM do editor:** o painel Timeline redesenha a régua e as barras no zoom novo.
- **DOM do canvas:** nada muda — o tratador não devolve correção (`src/editor/motion/state.ts:119`).

## Regras
- G1: n/a — o tratador grava a vista do painel (`src/editor/motion/state.ts:119`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/editor/motion/state.ts:112`).
- G3: ok — as duas portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:279` `'motion.zoomTimeline': zoomTimelineCommand,` e enviam só o `factor`; o tratador decide por ele.
- G4: n/a — o tratador só devolve o `ui` (`src/editor/motion/state.ts:119`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:2187` `"id": "timeline-motion-zoom-in",`).
- G6: ok — a seleção de elementos não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o resultado não traz correção, então o documento do canvas não muda (`src/editor/motion/state.ts:119`).
- INT: n/a — o trecho não escreve no documento; devolve só o estado do editor (`src/editor/motion/state.ts:119`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
