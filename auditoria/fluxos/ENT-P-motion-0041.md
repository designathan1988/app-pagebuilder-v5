# ENT-P-motion-0041 — motion.updateAction pela porta canvas-click-pick-motion-target
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1549` `"id": "canvas-click-pick-motion-target",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/input/pointer/effects.ts:254` `      if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`
- **Trecho:** TRC-motion.updateAction

## Passos
1. `src/editor/input/pointer/effects.ts:47` `    const entry = clickDoor(press, ps.buttons.button, ps.buttons.count, clickModifier, p.factsOf(press), picking);` — a porta que a pressão nomeia no canvas.
2. `src/editor/input/pointer/effects.ts:57` `    const pickingDoor = entry !== null && entry.door.kind === 'canvas-click' && (entry.door.target === 'pick-target' || entry.door.target === 'pick-motion-target') ? entry : null;` — uma porta que escolhe alvo não corre na pressão.
3. `src/editor/input/pointer/effects.ts:60` `    if (pickingDoor !== null) ps.pickAfter = { entry: pickingDoor, args: argsFor(pickingDoor, press, picking) };` — a escolha guarda a porta e os argumentos para o fim do gesto. [escreve: EST-L05a-034 via run]
4. `src/editor/input/pointer/press.ts:82` `    return picking.motion === null ? { ...entry.door.args } : { ...entry.door.args, timeline: picking.motion.timeline, action: picking.motion.action, value: { kind: 'element', node: press.node } };` — com um alvo sendo escolhido, os argumentos levam a timeline, a ação e o nó.
5. `src/editor/input/pointer/effects.ts:253` `      ps.pickAfter = null;` — no fim do gesto a escolha é retirada. [escreve: EST-L05a-034 via run]
6. `src/editor/input/pointer/effects.ts:254` `      if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);` — a escolha despacha motion.updateAction com esses argumentos; esta é a linha de Início da porta. [lê: EST-L05a-034 via run]
7. `src/editor/store.ts:232` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
8. `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo.
10. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
11. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
12. `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,` — a tabela liga o id ao tratador; o trecho TRC-motion.updateAction continua daqui.

## Ramos
- A porta que a pressão nomeia: `src/editor/input/pointer/effects.ts:57` `    const pickingDoor = entry !== null && entry.door.kind === 'canvas-click' && (entry.door.target === 'pick-target' || entry.door.target === 'pick-motion-target') ? entry : null;` — uma porta de escolher alvo guarda a escolha para o fim do gesto (passo 3) em vez de correr na pressão.
- O fim do gesto: `src/editor/input/pointer/effects.ts:252` `      const picked = ps.pickAfter;` — a escolha guardada, ou nada quando a pressão não escolheu alvo; com escolha, o caminho segue ao passo 6.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`); entre a leitura do estado e a gravação não há await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`), EST-L05a-034 (`ps.pickAfter`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`), EST-L05a-034 (`ps.pickAfter`).

## Resultado
- **Estado final:** o comando motion.updateAction corre no contexto da porta; o documento muda, o histórico ganha um passo e a mensagem é a do comando (`src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel da interação (ou da linha do tempo) redesenha e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó.

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:424`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `value` do campo, não o rascunho pendente (`src/core/motion/commands.ts:413`).
- G3: ok — as treze portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,` e enviam só o `field` próprio com o valor; o tratador decide por ele (`src/core/motion/commands.ts:324`).
- G4: n/a — o tratador só devolve correção, `ui` e mensagem (`src/core/motion/commands.ts:424`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:1549` `"id": "canvas-click-pick-motion-target",`).
- G6: ok — a seleção de elementos não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:424` `    const outcome = commitTimeline(found.index, replaceAction(found.timeline, held.id, () => next), message('status.motion.actionUpdated', { name: { key: effectLabel(next.effect.kind) }, timeline: found.timeline.name }), value);`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-motion.updateAction
- **Argumentos enviados:** `field: "target"`, `timeline`, `action`, `value: { kind: "element", node }`
- R1: `timeline` vem do painel, existente: o caminho segue ao passo 8. `src/core/motion/commands.ts:415` `    if (isOutcome(found)) return found;`
- R2: `action`/`at` nomeiam a ação: o caminho passa pelo lado que segue ao passo 11. `src/core/motion/commands.ts:417` `    if (held === null) return { kind: 'change' };`
- R3: `field`/`value` decidem dentro de `updatedAction`. `src/core/motion/commands.ts:418` `    if (field === 'target' && isRecord(value) && value.pick === true) return { kind: 'change', ui: make.makePicking(make.makePicked(context.state.ui), { timeline: found.timeline.name, action: held.id }) };`
- R4: o caminho passa pelo lado que segue quando `updatedAction` devolve a ação. `src/core/motion/commands.ts:420` `    if (isOutcome(next)) return next;`
