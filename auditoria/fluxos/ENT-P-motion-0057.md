# ENT-P-motion-0057 — motion.moveMarker pela porta panel-drag-motion-marker
- **Comando:** motion.moveMarker
- **Porta:** `manifest/commands/motion.json:2399` `"id": "panel-drag-motion-marker",`
- **Tratador:** `src/app/commands.ts:282` `'motion.moveMarker': moveMarkerCommand,`
- **Início:** `src/editor/input/pointer/events.ts:247` `        gesture.dispatch(step.command as never, step.args as never);`
- **Trecho:** TRC-motion.moveMarker

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
17. `src/app/commands.ts:282` `'motion.moveMarker': moveMarkerCommand,` — a tabela liga o id ao tratador; o trecho TRC-motion.moveMarker continua daqui.

## Ramos
- A ferramenta que aceita a pressão: `src/editor/motion/drag-tool.ts:34` `    if (control === null || entry === undefined || entry.door.kind !== 'panel-drag' || !isMotionDragSource(entry.door.source)) return null;` — fora de uma porta panel-drag da linha do tempo a ferramenta não aceita, e a pressão segue o dono do ponteiro; dentro, segue ao passo 4.
- O limiar do arraste: `src/editor/motion/drag-tool.ts:50` `        if (!moved && Math.abs(point.x - at.x) < DRAG_THRESHOLD) return null;` — um movimento abaixo do limiar não é passo (`null`), então nada é despachado; acima dele o caminho segue ao passo 8.
- O passo do movimento: `src/editor/motion/drag-tool.ts:44` `      return made === null ? null : { command, args: { ...entry.door.args, ...made } };` — quando `motionDragArgs` devolve `null` (a ação, o quadro-chave ou o marcador prensado deixou de existir) nada é despachado; com os argumentos, o caminho segue ao passo 11.
- O que ainda não existe: `src/editor/motion/pointer.ts:57` `  if (found === null) return null;` — sem a timeline nomeada, `motionDragArgs` devolve `null` e nada é despachado.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:282` `'motion.moveMarker': moveMarkerCommand,`); entre a leitura do estado e a gravação não há await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`), EST-L05a-034 (`ps.tooling`, `ps.machine`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`), EST-L05a-034 (`ps.tooling`).

## Resultado
- **Estado final:** o comando motion.moveMarker corre no contexto da porta; o documento muda, o histórico ganha um passo e a mensagem é a do comando (`src/app/commands.ts:282` `'motion.moveMarker': moveMarkerCommand,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel da interação (ou da linha do tempo) redesenha e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó.

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:700`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:692`).
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:2399` `"id": "panel-drag-motion-marker",`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:700`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:2399` `"id": "panel-drag-motion-marker",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- MED-0009 — a borda esquerda da trilha (`data-motion-track`), lida em `src/editor/motion/drag-tool.ts:40` `    const press = motionPress(entry.door.source, args, track.getBoundingClientRect().left, at.x);`, de que os tempos do arraste dependem; valor a medir na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-motion.moveMarker
- **Argumentos enviados:** `timeline`, `marker`, `delta` (ms), `distance` (px)
- R1: `timeline` vem do arraste, existente: o caminho segue ao passo 7. `src/core/motion/commands.ts:694` `  if (isOutcome(found)) return found;`
- R2: `marker` e `delta` vêm do movimento: o caminho segue ao passo 11. `src/core/motion/commands.ts:697` `  if (held === null || moved === null) return { kind: 'change' };`
- R3: com tempo novo, o caminho segue ao passo 14. `src/core/motion/commands.ts:699` `  if (next.markers.find((one) => one.id === held.id)?.time === held.time) return { kind: 'change' };`
