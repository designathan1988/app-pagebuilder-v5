# TRC-motion.toggleSnap
- **Chamada:** `src/app/commands.ts:280` `'motion.toggleSnap': toggleSnapCommand,`
- **Argumentos:** `{}` — a porta panel-control `timeline-motion-snap` não declara argumento (`manifest/commands/motion.json:2261` `"id": "timeline-motion-snap",`) e o tratador recebe só o contexto (o primeiro parâmetro).
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:2251` `"predicate": "always",`), que não barra nada.
3. `src/editor/motion/state.ts:178` `export const toggleSnapCommand = registerHandler<'motion.toggleSnap', EditorUi>(` — o tratador é registrado com um `current` (sexto parâmetro de `registerHandler`) que diz se ele está ligado. O histórico não é desfazível (`manifest/commands/motion.json:2257` `        "undoable": false`).
4. `src/editor/motion/state.ts:181` `    const next = toggle(motionUiOf(state.ui), 'snapOff');` — inverte o campo `snapOff` do estado do painel. [lê: EST-L08-019 via motionUiOf] [escreve: EST-L08-019 via toggle]
5. `src/editor/motion/state.ts:160` `const toggle = (motion: MotionUiState, key: 'recording' | 'snapOff' | 'running'): MotionUiState => {` — liga o campo quando `true`, tira-o quando já está (o encaixe é ligado por padrão).
6. `src/editor/motion/state.ts:182` `    return { kind: 'change', ui: withMotion(state.ui, next), message: message(next.snapOff === true ? 'status.motion.snapOff' : 'status.motion.snapOn') };` — o resultado troca o `ui.motion` e a mensagem diz o estado novo. [escreve: EST-L08-019 via withMotion]
7. `src/editor/motion/state.ts:42` `const withMotion = (ui: EditorUi, motion: MotionUiState): EditorUi => ({ ...ui, motion });` — o `ui` novo com o campo `motion` trocado.
8. `src/editor/motion/state.ts:184` `  (state) => motionUiOf(state.ui).snapOff !== true,` — o `current` da porta: acesa enquanto o encaixe não está desligado. [lê: EST-L08-019 via motionUiOf]
9. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — o `ui` do resultado passa ao estado. [escreve: EST-L01-037 via run]
10. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo conta como mudança. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run]
11. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — a mensagem do estado passa a ser a do recado. [escreve: EST-L01-033 via run]
12. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
13. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/editor/motion/state.ts:161` `  if (motion[key] === true) {` — com `snapOff` já `true` o campo sai; com ele ausente o campo passa a `true`.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/motion/state.ts:178`) e o `run` da store (`src/core/store/store.ts:399` `  const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {`) são síncronos; o clique da porta panel-control (`src/editor/shell/panel-field.tsx:203` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.snapOff`).
- Escreve: EST-L08-019 (`ui.motion.snapOff`), EST-L01-037 (`state.ui`), EST-L01-033 (`state.message`).

## Resultado
- **Estado final:** `ui.motion.snapOff` inverte; a mensagem é `status.motion.snapOff` ou `status.motion.snapOn` (passo 6).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`); os assinantes de documento não, porque o documento não mudou (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- **DOM do editor:** o painel Timeline redesenha o botão de encaixe (pressionado ou não) e a barra de status mostra a mensagem.
- **DOM do canvas:** nada muda — o tratador não devolve correção (`src/editor/motion/state.ts:182`).

## Regras
- G1: n/a — o tratador grava o estado do painel (`src/editor/motion/state.ts:182`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/editor/motion/state.ts:178`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:2261` `"id": "timeline-motion-snap",`).
- G4: n/a — o tratador só devolve o `ui` e a mensagem (`src/editor/motion/state.ts:182`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:2261` `"id": "timeline-motion-snap",`).
- G6: ok — a seleção de elementos não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o resultado não traz correção, então o documento do canvas não muda (`src/editor/motion/state.ts:182`).
- INT: n/a — o trecho não escreve no documento; devolve só o estado do editor (`src/editor/motion/state.ts:182`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
