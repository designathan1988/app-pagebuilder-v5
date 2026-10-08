# ENT-P-motion-0052 — motion.setPlayhead pela porta panel-drag-motion-playhead
- **Comando:** motion.setPlayhead
- **Porta:** `manifest/commands/motion.json:2138` `"id": "panel-drag-motion-playhead",`
- **Tratador:** `src/app/commands.ts:278` `'motion.setPlayhead': setMotionPlayheadCommand,`
- **Início:** `src/editor/input/pointer/events.ts:247` `        gesture.dispatch(step.command as never, step.args as never);`
- **Trecho:** TRC-motion.setPlayhead

## Passos
1. `src/editor/input/pointer/events.ts:64` `    const tool = event.button === 0 && ps.machine.phase === 'idle' && shared.open === null && !shared.spaceDown ? toolPress(toolPoint(event), event.target, store) : null;` — a pressão primária sobre a superfície pergunta às ferramentas instaladas.
2. `src/editor/input/pointer-tools.ts:83` `    const session = tool.press(at, target, state, store);` — a primeira ferramenta que aceita a pressão responde.
3. `src/editor/motion/drag-tool.ts:34` `    if (control === null || entry === undefined || entry.door.kind !== 'panel-drag' || !isMotionDragSource(entry.door.source)) return null;` — só uma porta panel-drag de fonte da linha do tempo é da ferramenta.
4. `src/editor/motion/drag-tool.ts:35` `    const parsed: unknown = JSON.parse(control.getAttribute('data-args') ?? '{}');` — os argumentos do controlo (o data-args).
5. `src/editor/motion/drag-tool.ts:40` `    const press = motionPress(entry.door.source, args, track.getBoundingClientRect().left, at.x);` — a pressão guarda a fonte, os argumentos e a borda esquerda da trilha. [MED-0009]
6. `src/editor/motion/pointer.ts:34` `export const motionPress = (source: MotionDragSource, args: Readonly<Record<string, unknown>>, trackLeft: number, startX: number): MotionPress => ({ source, args, trackLeft, startX });` — a pressão registada.
7. `src/editor/input/pointer/events.ts:240` `      const step = ps.tooling.session.move(toolPoint(event));` — cada movimento pergunta à sessão o passo do arraste.
8. `src/editor/motion/drag-tool.ts:43` `      const made = motionDragArgs(press, state, point.x, point.alt);` — os argumentos que o movimento faz. [lê: EST-L01-030 via motionDragArgs] [lê: EST-L01-037 via motionDragArgs]
9. `src/editor/motion/pointer.ts:41` `export function motionDragArgs(press: MotionPress, state: StoreState<EditorUi>, x: number, free: boolean): Readonly<Record<string, unknown>> | null {` — a única função que lê o estado e a trilha e devolve os argumentos do comando.
10. `src/editor/motion/drag-tool.ts:44` `      return made === null ? null : { command, args: { ...entry.door.args, ...made } };` — o comando do arraste e os argumentos (os da porta sobre os do movimento).
11. `src/editor/input/pointer/events.ts:243` `        ps.tooling.gesture.cancel();` — o gesto aberto é cancelado antes de correr de novo, para o painel seguir o ponteiro. [lê: EST-L05a-038 via gestureSafe]
12. `src/editor/input/pointer/events.ts:244` `        const gesture = store.gesture();` — um gesto novo é aberto a cada movimento.
13. `src/editor/input/pointer/events.ts:247` `        gesture.dispatch(step.command as never, step.args as never);` — o passo é despachado no gesto; esta é a linha de Início da porta. [escreve: EST-L05a-034 via onMove]
14. `src/editor/store.ts:210` `        dispatch: (id, args) => gesture.dispatch(id, args),` — a store do editor encaminha o despacho para o gesto aberto.
15. `src/core/store/store.ts:720` `          return run(id, args, current);` — o gesto entra em `run` com a transação aberta.
16. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
17. `src/app/commands.ts:278` `'motion.setPlayhead': setMotionPlayheadCommand,` — a tabela liga o id ao tratador; o trecho TRC-motion.setPlayhead continua daqui.

## Ramos
- A ferramenta que aceita a pressão: `src/editor/motion/drag-tool.ts:34` `    if (control === null || entry === undefined || entry.door.kind !== 'panel-drag' || !isMotionDragSource(entry.door.source)) return null;` — fora de uma porta panel-drag da linha do tempo a ferramenta não aceita, e a pressão segue o dono do ponteiro; dentro, segue ao passo 4.
- O limiar do arraste: `src/editor/motion/drag-tool.ts:50` `        if (!moved && Math.abs(point.x - at.x) < DRAG_THRESHOLD) return null;` — um movimento abaixo do limiar não é passo (`null`), então nada é despachado; acima dele o caminho segue ao passo 8.
- O passo do movimento: `src/editor/motion/drag-tool.ts:44` `      return made === null ? null : { command, args: { ...entry.door.args, ...made } };` — quando `motionDragArgs` devolve `null` (a ação, o quadro-chave ou o marcador prensado deixou de existir) nada é despachado; com os argumentos, o caminho segue ao passo 11.
- O que ainda não existe: `src/editor/motion/pointer.ts:57` `  if (found === null) return null;` — sem a timeline nomeada, `motionDragArgs` devolve `null` e nada é despachado.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:278` `'motion.setPlayhead': setMotionPlayheadCommand,`); entre a leitura do estado e a gravação não há await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`), EST-L05a-034 (`ps.tooling`, `ps.machine`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`), EST-L05a-034 (`ps.tooling`).

## Resultado
- **Estado final:** nada no documento; o `ui` da store muda (o painel da linha do tempo) e a mensagem é a do comando (`src/app/commands.ts:278` `'motion.setPlayhead': setMotionPlayheadCommand,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel da linha do tempo redesenha.
- **DOM do canvas:** nada muda — o resultado não traz correções e o quadro não redesenha.

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
- MED-0009 — a borda esquerda da trilha (`data-motion-track`), lida em `src/editor/motion/drag-tool.ts:40` `    const press = motionPress(entry.door.source, args, track.getBoundingClientRect().left, at.x);`, de que os tempos do arraste dependem; valor a medir na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-motion.setPlayhead
- **Argumentos enviados:** `time` (ms lidos da régua), `distance` (px)
- R1: `time` vem da régua: o caminho passa pelo lado que segue ao passo 5. `src/editor/motion/state.ts:103` `  if (time === undefined) return { kind: 'change' };`
- R2: com tempo novo, ou prévia desligada, o caminho segue ao passo 8. `src/editor/motion/state.ts:107` `  if (motion.time === clamped && motion.previewing === true) return { kind: 'change' };`
