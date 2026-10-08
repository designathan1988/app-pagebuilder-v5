# TRC-motion.setPlayhead
- **Chamada:** `src/app/commands.ts:278` `'motion.setPlayhead': setMotionPlayheadCommand,`
- **Argumentos:** `{ readonly time?: number; readonly distance?: number }`; `time` é o tempo em ms que o ponteiro leu da régua (`distance` é a medida do arraste, entregue pelo dono do ponteiro). A porta panel-drag `panel-drag-motion-playhead` não declara argumento próprio (`manifest/commands/motion.json:2138` `"id": "panel-drag-motion-playhead",`).
- **Ramos que dependem dos argumentos:** R1 (`time`), R2 (tempo repetido com prévia ligada)

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o manifesto pede o predicado `always` (`manifest/commands/motion.json:2128` `"predicate": "always",`), que não barra nada.
3. `src/editor/motion/state.ts:102` `export const setMotionPlayheadCommand = registerHandler<'motion.setPlayhead', EditorUi>('motion.setPlayhead', ({ state }, { time }) => {` — o tratador recebe o tempo. O histórico não é desfazível (`manifest/commands/motion.json:2134` `        "undoable": false`).
4. `src/editor/motion/state.ts:103` `  if (time === undefined) return { kind: 'change' };` — sem tempo a alteração é vazia (R1). [nada muda]
5. `src/editor/motion/state.ts:104` `  const motion = motionUiOf(state.ui);` — o estado do painel. [lê: EST-L08-019 via motionUiOf]
6. `src/editor/motion/state.ts:106` `  const clamped = Math.min(LONGEST_PLAYHEAD, Math.max(0, Math.round(time)));` — o tempo arredondado e preso entre 0 e o mais longo. [nada muda]
7. `src/editor/motion/state.ts:107` `  if (motion.time === clamped && motion.previewing === true) return { kind: 'change' };` — o mesmo tempo com a prévia já ligada: alteração vazia (R2). [nada muda]
8. `src/editor/motion/state.ts:108` `  return { kind: 'change', ui: withMotion(state.ui, { ...motion, time: clamped, previewing: true }) };` — o resultado move o cursor e liga a prévia. [escreve: EST-L08-019 via withMotion]
9. `src/editor/motion/state.ts:42` `const withMotion = (ui: EditorUi, motion: MotionUiState): EditorUi => ({ ...ui, motion });` — o `ui` novo com o campo `motion` trocado.
10. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — o `ui` do resultado passa ao estado. [escreve: EST-L01-037 via run]
11. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo conta como mudança. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run]
12. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
13. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/editor/motion/state.ts:103` `  if (time === undefined) return { kind: 'change' };` — sem `time`: nada muda; com `time` segue ao passo 5.
- R2: `src/editor/motion/state.ts:107` `  if (motion.time === clamped && motion.previewing === true) return { kind: 'change' };` — o tempo igual ao atual com a prévia já ligada: nada muda; tempo novo ou prévia desligada segue ao passo 8.

## Fronteiras assíncronas
- nenhuma — o tratador (`src/editor/motion/state.ts:102`) e o `run` da store (`src/core/store/store.ts:378`) são síncronos; o passo do arraste (`src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`) não interpõe await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L08-019 (`ui.motion.time`, `ui.motion.previewing`).
- Escreve: EST-L08-019 (`ui.motion.time`, `ui.motion.previewing`), EST-L01-037 (`state.ui`).

## Resultado
- **Estado final:** `ui.motion.time` passa a `clamped` e `ui.motion.previewing` fica ligado (passo 8); a mensagem não muda.
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`); os assinantes de documento não, porque o documento não mudou (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- **DOM do editor:** o painel Timeline redesenha o cursor no tempo novo.
- **DOM do canvas:** o preview desenha a timeline no cursor — o desenho do canvas muda pelo estado do editor, sem correção de documento (`src/editor/motion/state.ts:108`).

## Regras
- G1: n/a — o tratador grava o cursor do painel (`src/editor/motion/state.ts:108`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/editor/motion/state.ts:102`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:2138` `"id": "panel-drag-motion-playhead",`).
- G4: n/a — o tratador só devolve o `ui` (`src/editor/motion/state.ts:108`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:2138` `"id": "panel-drag-motion-playhead",`).
- G6: ok — a seleção de elementos não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o resultado não traz correção, então o documento do canvas não muda; o cursor só muda o desenho do editor (`src/editor/motion/state.ts:108`).
- INT: n/a — o trecho não escreve no documento; devolve só o estado do editor (`src/editor/motion/state.ts:108`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
