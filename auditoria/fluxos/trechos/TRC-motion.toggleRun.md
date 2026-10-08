# TRC-motion.toggleRun
- **Chamada:** `src/app/commands.ts:293` `'motion.toggleRun': toggleRunCommand,`
- **Argumentos:** `{}` — a porta de menu `menu-view-run-interactions` não declara argumento (`manifest/commands/motion.json:3293` `"id": "menu-view-run-interactions",`) e o tratador recebe só o contexto. A porta chama o tratador por `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:3283` `"predicate": "always",`), que não barra nada.
3. `src/editor/motion/state.ts:207` `export const toggleRunCommand = registerHandler<'motion.toggleRun', EditorUi>(` — o tratador é registrado com um `current` que diz se a execução está ligada. O histórico não é desfazível (`manifest/commands/motion.json:3289` `        "undoable": false`).
4. `src/editor/motion/state.ts:210` `    const next = toggle(motionUiOf(state.ui), 'running');` — inverte o campo `running` do estado do painel. [lê: EST-L08-019 via motionUiOf] [escreve: EST-L08-019 via toggle]
5. `src/editor/motion/state.ts:160` `const toggle = (motion: MotionUiState, key: 'recording' | 'snapOff' | 'running'): MotionUiState => {` — liga o campo quando `true`, tira-o quando já está.
6. `src/editor/motion/state.ts:211` `    return { kind: 'change', ui: withMotion(state.ui, next), message: message(next.running === true ? 'status.motion.running' : 'status.motion.stopped') };` — o resultado troca o `ui.motion` e a mensagem diz o estado novo. [escreve: EST-L08-019 via withMotion]
7. `src/editor/motion/state.ts:42` `const withMotion = (ui: EditorUi, motion: MotionUiState): EditorUi => ({ ...ui, motion });` — o `ui` novo com o campo `motion` trocado.
8. `src/editor/motion/state.ts:213` `  (state) => motionUiOf(state.ui).running === true,` — o `current` da porta: acesa enquanto o modo de execução está ligado. [lê: EST-L08-019 via motionUiOf]
9. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — o `ui` do resultado passa ao estado. [escreve: EST-L01-037 via run]
10. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo conta como mudança. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run]
11. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — a mensagem do estado passa a ser a do recado. [escreve: EST-L01-033 via run]
12. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
13. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/editor/motion/state.ts:161` `  if (motion[key] === true) {` — com `running` já `true` o campo sai (desliga); com ele ausente o campo passa a `true` (liga).

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/motion/state.ts:207`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o despacho da porta de menu (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.running`).
- Escreve: EST-L08-019 (`ui.motion.running`), EST-L01-037 (`state.ui`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** `ui.motion.running` inverte; a mensagem é `status.motion.running` ou `status.motion.stopped` (passo 6).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`); os assinantes de documento não, porque o documento não mudou (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- **DOM do editor:** o menu redesenha a marca do item e a barra de status mostra a mensagem.
- **DOM do canvas:** nada muda — o tratador não devolve correção (`src/editor/motion/state.ts:211`); o modo de execução age no canvas por fora deste trecho (`src/editor/motion/runtime/`).

## Regras
- G1: n/a — o tratador grava o estado do painel (`src/editor/motion/state.ts:211`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/editor/motion/state.ts:207`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:3293` `"id": "menu-view-run-interactions",`).
- G4: n/a — o tratador só devolve o `ui` e a mensagem (`src/editor/motion/state.ts:211`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive no menu (`manifest/commands/motion.json:3293` `"id": "menu-view-run-interactions",`).
- G6: ok — a seleção de elementos não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o resultado não traz correção, então o documento do canvas não muda (`src/editor/motion/state.ts:211`).
- INT: n/a — o trecho não escreve no documento; devolve só o estado do editor (`src/editor/motion/state.ts:211`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
