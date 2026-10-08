# TRC-motion.toggleRecord
- **Chamada:** `src/app/commands.ts:291` `'motion.toggleRecord': toggleRecordCommand,`
- **Argumentos:** `{}` — a porta panel-control `timeline-motion-record` não declara argumento (`manifest/commands/motion.json:3135` `"id": "timeline-motion-record",`) e o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:3123` `"predicate": "always",`), que não barra nada.
3. `src/editor/motion/state.ts:167` `export const toggleRecordCommand = registerHandler<'motion.toggleRecord', EditorUi>(` — o tratador é registrado com um `current` que diz se ele está ligado. O histórico não é desfazível (`manifest/commands/motion.json:3131` `        "undoable": false`).
4. `src/editor/motion/state.ts:170` `    const motion = motionUiOf(state.ui);` — o estado do painel. [lê: EST-L08-019 via motionUiOf]
5. `src/editor/motion/state.ts:171` `    if (motion.recording !== true && shownTimeline(state) === null) return { kind: 'refused', message: message('status.motion.noTimeline') };` — ligar a gravação sem timeline mostrada recusa `status.motion.noTimeline` (R1). [lê: EST-L01-030 via shownTimeline] [lê: EST-L01-031 via shownTimeline] [lê: EST-L01-037 via shownTimeline]
6. `src/editor/motion/state.ts:47` `export function shownTimeline(state: StoreState<EditorUi>): string | null {` — a timeline nomeada, ou a primeira que o elemento toca, ou a primeira do projeto.
7. `src/editor/motion/state.ts:172` `    const next = toggle(motion, 'recording');` — inverte o campo `recording` do estado do painel. [escreve: EST-L08-019 via toggle]
8. `src/editor/motion/state.ts:160` `const toggle = (motion: MotionUiState, key: 'recording' | 'snapOff' | 'running'): MotionUiState => {` — liga o campo quando `true`, tira-o quando já está.
9. `src/editor/motion/state.ts:173` `    return { kind: 'change', ui: withMotion(state.ui, next), message: message(next.recording === true ? 'status.motion.recordOn' : 'status.motion.recordOff') };` — o resultado troca o `ui.motion` e a mensagem diz o estado novo. [escreve: EST-L08-019 via withMotion]
10. `src/editor/motion/state.ts:42` `const withMotion = (ui: EditorUi, motion: MotionUiState): EditorUi => ({ ...ui, motion });` — o `ui` novo com o campo `motion` trocado.
11. `src/editor/motion/state.ts:175` `  (state) => motionUiOf(state.ui).recording === true,` — o `current` da porta: acesa enquanto a gravação está ligada. [lê: EST-L08-019 via motionUiOf]
12. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — o `ui` do resultado passa ao estado. [escreve: EST-L01-037 via run]
13. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo conta como mudança. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run]
14. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — a mensagem do estado passa a ser a do recado. [escreve: EST-L01-033 via run]
15. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
16. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/editor/motion/state.ts:171` `    if (motion.recording !== true && shownTimeline(state) === null) return { kind: 'refused', message: message('status.motion.noTimeline') };` — ligar a gravação sem timeline mostrada recusa `status.motion.noTimeline`; desligar, ou com timeline, segue ao passo 7.
- R2: `src/editor/motion/state.ts:161` `  if (motion[key] === true) {` — com `recording` já `true` o campo sai (desliga); com ele ausente o campo passa a `true` (liga).

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/motion/state.ts:167`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o clique da porta panel-control (`src/editor/shell/panel-field.tsx:203` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.recording`).
- Escreve: EST-L08-019 (`ui.motion.recording`), EST-L01-037 (`state.ui`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** `ui.motion.recording` inverte; a mensagem é `status.motion.recordOn` ou `status.motion.recordOff` (passo 9).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`); os assinantes de documento não, porque o documento não mudou (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- **DOM do editor:** o painel Timeline redesenha o botão de gravação e a barra de status mostra a mensagem.
- **DOM do canvas:** nada muda — o tratador não devolve correção (`src/editor/motion/state.ts:173`); a gravação age na próxima escrita de estilo.

## Regras
- G1: n/a — o tratador grava o estado do painel (`src/editor/motion/state.ts:173`), não uma camada de estilo, e não lê o contexto de edição (a gravação é lida por `motionContext`, `src/editor/motion/state.ts:59` `export function motionContext(state: StoreState<EditorUi>): MotionEditorContext {`).
- G2: n/a — o tratador não lê campo de digitação (`src/editor/motion/state.ts:167`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:3135` `"id": "timeline-motion-record",`).
- G4: n/a — o tratador só devolve o `ui` e a mensagem (`src/editor/motion/state.ts:173`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:3135` `"id": "timeline-motion-record",`).
- G6: ok — a seleção de elementos não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o resultado não traz correção, então o documento do canvas não muda (`src/editor/motion/state.ts:173`).
- INT: n/a — o trecho não escreve no documento; devolve só o estado do editor (`src/editor/motion/state.ts:173`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
