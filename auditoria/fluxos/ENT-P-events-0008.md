# ENT-P-events-0008 — interactions.update pela porta canvas-click-pick-target
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:311` `          "id": "canvas-click-pick-target",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/input/pointer/effects.ts:254` `      if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);`
- **Trecho:** TRC-interactions.update

## Passos
1. `src/editor/input/pointer/effects.ts:47` `      const entry = clickDoor(press, ps.buttons.button, ps.buttons.count, clickModifier, p.factsOf(press), picking);` — a porta que a pressão nomeia no canvas.
2. `src/editor/input/pointer/effects.ts:57` `      const pickingDoor = entry !== null && entry.door.kind === 'canvas-click' && (entry.door.target === 'pick-target' || entry.door.target === 'pick-motion-target') ? entry : null;` — uma porta que escolhe alvo não corre na pressão.
3. `src/editor/input/pointer/effects.ts:60` `      if (pickingDoor !== null) ps.pickAfter = { entry: pickingDoor, args: argsFor(pickingDoor, press, picking) };` — a escolha guarda a porta e os argumentos para o fim do gesto. [escreve: EST-L05a-034 via run]
4. `src/editor/input/pointer/press.ts:79` `    return picking.interaction === null ? { ...entry.door.args } : { ...entry.door.args, interaction: picking.interaction, changes: { target: press.node } };` — com um alvo sendo escolhido, os argumentos levam o índice da interação e o nó em `changes.target`.
5. `src/editor/input/pointer/effects.ts:253` `      ps.pickAfter = null;` — no fim do gesto a escolha é retirada. [escreve: EST-L05a-034 via run]
6. `src/editor/input/pointer/effects.ts:254` `      if (picked) store.dispatch(picked.entry.command.id as CommandId, picked.args as never);` — a escolha despacha interactions.update com esses argumentos; esta é a linha de Início da porta. [lê: EST-L05a-034 via run]
7. `src/editor/store.ts:232` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
8. `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo. [escreve: EST-L01-030 via dispatch]
10. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
11. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
12. `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,` — a tabela liga o id ao tratador; o trecho TRC-interactions.update continua daqui.

## Ramos
- A porta que a pressão nomeia: `src/editor/input/pointer/effects.ts:57` `      const pickingDoor = entry !== null && entry.door.kind === 'canvas-click' && (entry.door.target === 'pick-target' || entry.door.target === 'pick-motion-target') ? entry : null;` — uma porta de escolher alvo guarda a escolha para o fim do gesto (passo 3) em vez de correr na pressão.
- A escolha guardada: `src/editor/input/pointer/effects.ts:252` `      const picked = ps.pickAfter;` — a escolha da pressão, ou nada quando a pressão não escolheu alvo; com escolha, o caminho segue ao passo 6.
- O gesto aberto na store do editor: `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue à store do núcleo; com gesto aberto e um comando que muda o documento (interactions.update é desfazível), a gravação é adiada em `src/editor/store.ts:243` `        waiting.push(() => void store.dispatch(id, args, asked));`.

## Fronteiras assíncronas
- nenhuma — o despacho da escolha é síncrono (`src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`); entre o fim do gesto e a entrega ao tratador não há await, timer nem quadro. A pressão e o fim do gesto são fases do mesmo `run` do dono do ponteiro, chamadas de forma síncrona (`src/editor/input/pointer/effects.ts:31` `  const run = (effect: Effect) => {`).

## Estado
- Lê: EST-L05a-034 (a escolha guardada, `ps.pickAfter`), EST-L05a-038 (o gesto aberto visto pela store do editor), EST-L05a-001 (a digitação pendente).
- Escreve: EST-L05a-034 (a escolha é retirada no fim do gesto); a gravação do documento entra no trecho TRC-interactions.update.

## Resultado
- **Estado final:** o comando interactions.update corre no contexto da porta; a interação no índice escolhido passa a ter o alvo do nó em que a pressão caiu, pelo tratador (`src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a aba de interações redescreve o cartão e o botão do alvo deixa de estar pressionado (`src/editor/store.ts:275` `  return useSyncExternalStore(store.subscribe, () => select(store.getState()));`).
- **DOM do canvas:** o quadro aplica a mudança do documento ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); a interação não é desenhada nem executada.

## Regras
- G1: n/a — a porta envia o índice e o nó em `changes.target` e a gravação de `interactions` no nó é do tratador (`src/core/events/interactions.ts:357` `      patches: writeInteractions(found, interactions),`); nada lê ponto de quebra, estado, classe-alvo nem quadro-chave.
- G2: ok `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — com rascunho pendente o registro grava antes; interactions.update é desfazível no manifesto (`manifest/commands/events.json:132` `      "undoable": true,`).
- G3: ok `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,` — as nove portas chamam o mesmo tratador; esta manda o índice e o nó em `changes`.
- G4: n/a — a ação nasce de uma pressão no canvas com a intenção do alvo; a porta vive na colocação do manifesto (`manifest/commands/events.json:323` `          "placement": "none",`).
- G5: n/a — o comando muda o alvo de uma interação e não desenha controle que cresça painel ou barra (`manifest/commands/events.json:312` `          "kind": "canvas-click",`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — o tratador não escreve seleção e a store é a fonte única.
- G7: n/a — o canvas de edição não desenha nem executa a interação (`manifest/features/18-animation-and-events.json:2371` `          "The editing canvas never runs them."`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de ser cometido.

## Limpeza
- nenhuma — a porta não cria ouvinte, timer nem observador; nenhuma linha citada em Passos registra ouvinte.

## Medições
- nenhuma — nenhum passo do caminho da porta lê dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o nó da pressão é o que o dono do ponteiro já resolveu.

## Ramos do trecho
- **Trecho:** TRC-interactions.update
- **Argumentos enviados:** `field: "target"` (fixo da porta, `manifest/commands/events.json:331` `            "field": "target"`), `interaction` (o índice que estava sendo escolhido, `picking.interaction`) e `changes: { target: press.node }` (o nó em que a pressão caiu).
- R1 (`interaction`): `interaction` é um número; o trecho passa pelo lado em que a interação é encontrada (`src/core/events/interactions.ts:302` `  const held = interactionsOf(found.node)[interaction];`).
- R3 (`changes.pick`): `changes` é um objeto com `target`, sem `pick`; o trecho não passa pelo lado da escolha do alvo (`src/core/events/interactions.ts:306` `  if (changes !== null && typeof changes === 'object' && !Array.isArray(changes) && (changes as Record<string, unknown>).pick === true) {`).
- R5 e R6 (`field` e `changes`): `changes` é um objeto de valores, não uma cadeia; o trecho passa pelo lado dos valores (`src/core/events/interactions.ts:317` `  } else if (changes !== null && typeof changes === 'object' && !Array.isArray(changes)) {`) e dentro dele pelo ramo `target` (`src/core/events/interactions.ts:320` `  if (typeof wanted.target === 'string') {`), não pelo lado do texto.
