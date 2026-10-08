# ENT-P-motion-0049 — motion.select pela porta timeline-motion-bar-add
- **Comando:** motion.select
- **Porta:** `manifest/commands/motion.json:2027` `"id": "timeline-motion-bar-add",`
- **Tratador:** `src/app/commands.ts:277` `'motion.select': selectMotionCommand,`
- **Início:** `src/editor/motion/ui/timeline.tsx:143` `      onClick={(event: MouseEvent) => (event.shiftKey ? adding.run() : plain.run())}`
- **Trecho:** TRC-motion.select

## Passos
1. `src/editor/motion/ui/timeline.tsx:131` `  const plain = useDoor(motionDoor(refs[0]), args, title);` — a porta da barra (ou do quadro-chave) sem modificador.
2. `src/editor/motion/ui/timeline.tsx:132` `  const adding = useDoor(motionDoor(refs[1]), args, title);` — a porta da mesma barra com Shift (somar à seleção).
3. `src/editor/motion/ui/timeline.tsx:143` `      onClick={(event: MouseEvent) => (event.shiftKey ? adding.run() : plain.run())}` — o toque escolhe a porta pelo Shift; esta é a linha de Início da porta.
4. `src/editor/doors/door.tsx:93` `  const run = () => {` — o `run` da porta escolhida.
5. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — o `run` despacha motion.select com os argumentos da porta e os do desenho.
6. `src/editor/store.ts:233` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
7. `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
8. `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo.
9. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
10. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
11. `src/app/commands.ts:277` `'motion.select': selectMotionCommand,` — a tabela liga o id ao tratador; o trecho TRC-motion.select continua daqui.

## Ramos
- A porta escolhida pelo Shift: `src/editor/motion/ui/timeline.tsx:143` `      onClick={(event: MouseEvent) => (event.shiftKey ? adding.run() : plain.run())}` — com Shift a porta que soma (`add: true`), sem ele a que substitui; ambas correm pelo mesmo `run` (a linha 92 de door.tsx).
- A disponibilidade: `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — o controlo da barra corre pelo mesmo `run` da porta de menu, que barra a porta não construída ou indisponível antes de despachar.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:277` `'motion.select': selectMotionCommand,`); entre a leitura do estado e a gravação não há await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`), EST-L08-019 (`ui.motion`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`), EST-L01-037 (`state.ui`).

## Resultado
- **Estado final:** nada no documento; o `ui` da store muda (o painel da linha do tempo) e a mensagem é a do comando (`src/app/commands.ts:277` `'motion.select': selectMotionCommand,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel da linha do tempo redesenha.
- **DOM do canvas:** nada muda — o resultado não traz correções e o quadro não redesenha.

## Regras
- G1: n/a — o tratador grava a seleção do painel (`src/editor/motion/state.ts:148`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/editor/motion/state.ts:128`).
- G3: ok — as quatro portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:277` `'motion.select': selectMotionCommand,` e enviam só a lista ou o lugar e o `add`; o tratador decide por eles.
- G4: n/a — o tratador só devolve o `ui` (`src/editor/motion/state.ts:148`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:2027` `"id": "timeline-motion-bar-add",`).
- G6: ok — a seleção de elementos não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`), e o painel apenas deriva da store.
- G7: n/a — o resultado não traz correção, então o documento do canvas não muda (`src/editor/motion/state.ts:148`).
- INT: n/a — o trecho não escreve no documento; devolve só o estado do editor (`src/editor/motion/state.ts:148`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-motion.select
- **Argumentos enviados:** `timeline`, `at`, `add: true` (Shift soma à seleção)
- R1: a seleção vem do lugar (`timeline`+`at`+`property`+`keyframeAt`) que o controlo nomeia, e pode ser vazia. `src/editor/motion/state.ts:139` `  const pickedActions = isIds(actions) ? actions : placedAction;`
- R2: `add` é fixado pela porta e decide somar à seleção ou substituí-la. `src/editor/motion/state.ts:146` `  const nextActions = add === true ? toggleIn(motion.selectedActions ?? [], pickedActions, (a, b) => a === b) : pickedActions;`
