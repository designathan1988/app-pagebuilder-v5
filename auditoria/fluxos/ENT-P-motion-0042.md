# ENT-P-motion-0042 — motion.updateAction pela porta layers-row-pick-motion-target
- **Comando:** motion.updateAction
- **Porta:** `manifest/commands/motion.json:1573` `"id": "layers-row-pick-motion-target",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Início:** `src/editor/shell/sidebar/layers.tsx:390` `      onClick={() => (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, args)}`
- **Trecho:** TRC-motion.updateAction

## Passos
1. `src/editor/shell/sidebar/layers.tsx:377` `  const picking = useEditorState((s) => motionPicking(s.ui));` — a ação cujo alvo está sendo escolhido, lida do estado do editor. [lê: EST-L08-019 via motionPicking]
2. `src/editor/shell/sidebar/layers.tsx:379` `  const at = useEditorState((s) => (picking === null ? -1 : (findTimeline(s.document, picking.timeline)?.timeline.actions.findIndex((one) => one.id === picking.action) ?? -1)));` — o lugar da ação na timeline. [lê: EST-L01-030 via useEditorState]
3. `src/editor/shell/sidebar/layers.tsx:382` `  const args = { ...entry.door.args, timeline: picking.timeline, action: picking.action, value: { kind: 'element', node: node.id } };` — os argumentos da porta com a timeline, a ação e o nó da linha.
4. `src/editor/shell/sidebar/layers.tsx:390` `      onClick={() => (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, args)}` — a linha da camada despacha motion.updateAction com esses argumentos; esta é a linha de Início da porta.
5. `src/editor/store.ts:233` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
6. `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
7. `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo.
8. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
9. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
10. `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,` — a tabela liga o id ao tratador; o trecho TRC-motion.updateAction continua daqui.

## Ramos
- Sem escolha em curso: `src/editor/shell/sidebar/layers.tsx:381` `  if (picking === null || entry === null) return null;` — sem ação a escolher, o controlo não é desenhado e nada despacha.
- O lugar da ação: `src/editor/shell/sidebar/layers.tsx:379` `  const at = useEditorState((s) => (picking === null ? -1 : (findTimeline(s.document, picking.timeline)?.timeline.actions.findIndex((one) => one.id === picking.action) ?? -1)));` — `at` é -1 quando a ação não está na timeline; o `data-args` guarda esse valor, mas o despacho envia a timeline, a ação e o nó.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`); entre a leitura do estado e a gravação não há await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`), EST-L08-019 (`ui.motion`).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`), EST-L01-037 (`state.ui`).

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
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:1573` `"id": "layers-row-pick-motion-target",`).
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
