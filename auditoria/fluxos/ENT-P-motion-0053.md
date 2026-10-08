# ENT-P-motion-0053 — motion.zoomTimeline pela porta timeline-motion-zoom-in
- **Comando:** motion.zoomTimeline
- **Porta:** `manifest/commands/motion.json:2187` `"id": "timeline-motion-zoom-in",`
- **Tratador:** `src/app/commands.ts:279` `'motion.zoomTimeline': zoomTimelineCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Trecho:** TRC-motion.zoomTimeline

## Passos
1. `src/editor/shell/panel-field.tsx:157` `  const door = useDoor(entry, args, label);` — o botão lê a porta (o rótulo, a disponibilidade, se é a corrente).
2. `src/editor/shell/panel-field.tsx:159` `  const ready = door.available && !disabled;` — só uma porta disponível despacha.
3. `src/editor/shell/panel-field.tsx:170` `      onClick={() => {` — o toque no botão.
4. `src/editor/shell/panel-field.tsx:171` `        if (!ready) return;` — porta indisponível não despacha.
5. `src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });` — o botão despacha motion.zoomTimeline com os argumentos da porta e os do desenho; esta é a linha de Início da porta.
6. `src/editor/store.ts:232` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
7. `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
8. `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo.
9. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
10. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
11. `src/app/commands.ts:279` `'motion.zoomTimeline': zoomTimelineCommand,` — a tabela liga o id ao tratador; o trecho TRC-motion.zoomTimeline continua daqui.

## Ramos
- A disponibilidade do botão: `src/editor/shell/panel-field.tsx:171` `        if (!ready) return;` — porta indisponível não despacha; disponível segue ao passo 5.
- O gesto aberto na store do editor: `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto, o despacho segue; com gesto e um comando que muda o documento, a gravação é adiada (a linha 224).

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:279` `'motion.zoomTimeline': zoomTimelineCommand,`); entre a leitura do estado e a gravação não há await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`), EST-L05a-001 (a digitação pendente da store).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`), EST-L01-037 (`state.ui`).

## Resultado
- **Estado final:** nada no documento; o `ui` da store muda (o painel da linha do tempo) e a mensagem é a do comando (`src/app/commands.ts:279` `'motion.zoomTimeline': zoomTimelineCommand,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel da linha do tempo redesenha.
- **DOM do canvas:** nada muda — o resultado não traz correções e o quadro não redesenha.

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

## Ramos do trecho
- **Trecho:** TRC-motion.zoomTimeline
- **Argumentos enviados:** `factor: 1.25`
- R1: `factor` é fixado pela porta e decide aproximar ou afastar em `zoomAt`. `src/editor/motion/state.ts:117` `  const next = zoomAt(view, factor, at, { min, max });`
- R2: sem `anchor`, o zoom prende o tempo sob o cursor. `src/editor/motion/state.ts:116` `  const at = anchor ?? ((motion.time - motion.scroll) / 1000) * motion.pixelsPerSecond;`
- R3: abaixo do limite de zoom, o caminho segue ao passo 12. `src/editor/motion/state.ts:118` `  if (next.pixelsPerSecond === motion.pixelsPerSecond && next.scroll === motion.scroll) return { kind: 'change' };`
