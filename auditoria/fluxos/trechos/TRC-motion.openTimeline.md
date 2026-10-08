# TRC-motion.openTimeline
- **Chamada:** `src/app/commands.ts:270` `'motion.openTimeline': openTimelineCommand,`
- **Argumentos:** `{ readonly timeline?: string }`; `timeline` é o nome da timeline a mostrar. A porta panel-control `timeline-motion-timeline-row` não declara argumento próprio (`manifest/commands/motion.json:994` `"id": "timeline-motion-timeline-row",`).
- **Ramos que dependem dos argumentos:** R1 (`timeline`), R2 (timeline que já está mostrada)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:982` `"predicate": "always",`), que não barra nada.
3. `src/editor/motion/state.ts:84` `export const openTimelineCommand = registerHandler<'motion.openTimeline', EditorUi>('motion.openTimeline', ({ state }, { timeline }) => {` — o tratador recebe o nome; o histórico não é desfazível (`manifest/commands/motion.json:990` `        "undoable": false`).
4. `src/editor/motion/state.ts:85` `  if (findTimeline(state.document, timeline) === null) return { kind: 'refused', message: message('status.motion.notFound', { name: timeline }) };` — nome que o projeto não tem recusa `status.motion.notFound` (R1). [lê: EST-L01-030 via findTimeline]
5. `src/core/motion/document.ts:24` `export function findTimeline(document: DocumentJson, name: string): { readonly timeline: MotionTimeline; readonly index: number } | null {` — a busca da timeline pelo nome.
6. `src/editor/motion/state.ts:86` `  const motion = motionUiOf(state.ui);` — o estado do painel da linha do tempo. [lê: EST-L08-019 via motionUiOf]
7. `src/editor/motion/state.ts:41` `export const motionUiOf = (ui: EditorUi): MotionUiState => ui.motion ?? initialMotionUi();` — o campo `ui.motion` ou os valores iniciais.
8. `src/editor/motion/state.ts:87` `  if (motion.timeline === timeline) return { kind: 'change' };` — a mesma timeline já mostrada: alteração vazia (R2). [nada muda]
9. `src/editor/motion/state.ts:89` `  const { selectedActions: _a, selectedKeyframes: _k, previewing: _p, playing: _q, ...rest } = motion;` — a timeline nova começa a 0, sem seleção, sem prévia e sem execução. [lê: EST-L08-019 via motion]
10. `src/editor/motion/state.ts:94` `  return { kind: 'change', ui: withMotion(state.ui, { ...rest, timeline, time: 0 }), message: message('status.motion.timelineOpened', { name: timeline }) };` — o resultado troca o `ui.motion` e a mensagem. [escreve: EST-L08-019 via withMotion]
11. `src/editor/motion/state.ts:42` `const withMotion = (ui: EditorUi, motion: MotionUiState): EditorUi => ({ ...ui, motion });` — o `ui` novo com o campo `motion` trocado.
12. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — o `ui` do resultado passa ao estado. [escreve: EST-L01-037 via run]
13. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo conta como mudança, mesmo sem correção. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run]
14. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — a mensagem do estado passa a ser a do recado. [escreve: EST-L01-033 via run]
15. `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento inteiro é validado antes de commitar (`manifest/commands/motion.json:990` `        "undoable": false`). [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
16. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
17. `src/core/store/store.ts:321` `    if (next.document !== before.document) {` — como o documento não mudou, os assinantes de documento não são chamados.
18. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/editor/motion/state.ts:85` `  if (findTimeline(state.document, timeline) === null) return { kind: 'refused', message: message('status.motion.notFound', { name: timeline }) };` — `timeline` que o projeto não tem recusa `status.motion.notFound`; existente segue ao passo 6.
- R2: `src/editor/motion/state.ts:87` `  if (motion.timeline === timeline) return { kind: 'change' };` — a timeline pedida já é a mostrada: nada muda; outra segue ao passo 9.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/motion/state.ts:84`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o despacho da porta panel-control (`src/editor/shell/panel-field.tsx:203` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion`).
- Escreve: EST-L08-019 (`ui.motion.timeline`, `ui.motion.time`), EST-L01-037 (`state.ui`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** `ui.motion.timeline` passa ao nome pedido, o tempo a 0 e a seleção do painel, a prévia e a execução saem; a mensagem é `status.motion.timelineOpened` (passo 10).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`); os assinantes de documento não, porque o documento não mudou (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- **DOM do editor:** o painel Timeline passa a desenhar a timeline do nome e a barra de status mostra a mensagem.
- **DOM do canvas:** nada muda — o tratador não devolve correção (`src/editor/motion/state.ts:94`).

## Regras
- G1: n/a — o tratador grava o estado do painel (`src/editor/motion/state.ts:94` `  return { kind: 'change', ui: withMotion(state.ui, { ...rest, timeline, time: 0 }), message: message('status.motion.timelineOpened', { name: timeline }) };`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/editor/motion/state.ts:84`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:994` `"id": "timeline-motion-timeline-row",`).
- G4: n/a — o tratador só devolve o `ui` e a mensagem (`src/editor/motion/state.ts:94`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:994` `"id": "timeline-motion-timeline-row",`).
- G6: ok — a seleção de elementos não muda, e as vistas seguem a store (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o resultado não traz correção, então o documento do canvas não muda (`src/editor/motion/state.ts:94`).
- INT: n/a — o trecho não escreve no documento; devolve só o estado do editor (`src/editor/motion/state.ts:94`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
