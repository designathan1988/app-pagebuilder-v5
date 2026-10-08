# ENT-P-text-0001 — text.startEdit pela porta text.startEdit#canvas-double-click-text-element

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/input/pointer/effects.ts:61` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.startEdit`, que segue daqui.

## Passos
1. `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — o efeito `press` do ponteiro entrega a porta do manifesto ao gesto aberto. O gesto é o embrulho da store do editor aberto no começo do mesmo efeito (`src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();`), guardado em `shared.open` (`src/editor/input/pointer/common.ts:258` `  open: Gesture | null;`). [lê: EST-L05a-019 via shared.open] [lê: EST-L01-037 via clickDoor] a porta é a de `count` 2 sobre um texto, achada por `src/editor/input/pointer/press.ts:49` `  if (target === 'text-element') return press.on === 'node' && !press.root && facts.textual;`.
2. `src/editor/input/pointer/press.ts:84` `  return entry.door.adapter.selection === 'target' && (press.on === 'node' || press.on === 'captured') ? { ...entry.door.args, target: press.node } : { ...entry.door.args };` — os argumentos da porta: a porta `canvas-double-click-text-element` tem `adapter.selection` `single` (`manifest/commands/text.json:39` `            "selection": "single",`), então `argsFor` devolve só `entry.door.args`, que é `{}` (`manifest/commands/text.json:44` `          "args": {}`).
3. `src/editor/store.ts:204` `    gesture: () => {` — o `store.gesture()` do passo 1 entra no embrulho da store do editor. [lê: EST-L05a-001 via keepTyping] a digitação pendente de um campo é gravada antes de o gesto abrir (`src/editor/store.ts:205` `      keepTyping();`).
4. `src/editor/store.ts:210` `        dispatch: (id, args) => gesture.dispatch(id, args),` — o embrulho repassa o despacho ao gesto da store do núcleo (guardado em `store.gesture()`, `src/editor/store.ts:207` `      const gesture = store.gesture();`).
5. `src/core/store/store.ts:718` `        dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho; o gesto está aberto (`src/core/store/store.ts:719` `          if (open !== current) throw new Error('this gesture is closed');`).
6. `src/core/store/store.ts:720` `          return run(id, args, current);` — o gesto chama `run` com a transação do gesto.
7. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca a porta na tabela de comandos (`wiring().commands`).
8. `src/app/commands.ts:430` `  'text.startEdit': startEdit,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.startEdit`).

## Ramos
- R1 `src/editor/input/pointer/press.ts:64` `const matches = (d: DoorEntry, button: Button, count: number, modifier: string | null) => d.door.kind === 'canvas-click' && d.door.button === button && d.door.count === count && d.door.modifier === modifier;` — com `ps.buttons.count` 2, botão primário e sem modificador, a porta de dois cliques é a que casa; com `count` 1 a porta de dois cliques não casa e `entry` é outra (ou nula), e nada é despachado por esta porta.
- R2 `src/editor/input/pointer/effects.ts:58` `      const deferred = (ofSeveral || insideSelected) && pickingDoor === null;` — para um clique duplo sobre um texto (não é um press plano de `count` 1 sobre uma seleção de vários), `deferred` é falso, então o ramo da linha 61 roda; com `deferred` verdadeiro o clique espera a libertação (`src/editor/input/pointer/effects.ts:59` `      ps.deferredClick = entry && deferred ? { entry, args: argsFor(entry, press, picking) as Record<string, unknown> } : null;`).
- R3 `src/editor/input/pointer/effects.ts:57` `      const pickingDoor = entry !== null && entry.door.kind === 'canvas-click' && (entry.door.target === 'pick-target' || entry.door.target === 'pick-motion-target') ? entry : null;` — a porta desta entrada não tem alvo `pick-target` nem `pick-motion-target`, então `pickingDoor` é nulo e o ramo da linha 61 roda; fosse uma porta de escolha de alvo, o despacho esperaria o fecho do gesto (`src/editor/input/pointer/effects.ts:60` `      if (pickingDoor !== null) ps.pickAfter = { entry: pickingDoor, args: argsFor(pickingDoor, press, picking) };`).
- R4 `src/core/store/store.ts:403` `    if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — `text.startEdit` não é desfazível (`manifest/commands/text.json:21` `        "undoable": false`), então este ramo não para o caminho; um comando desfazível com um grupo de comandos aberto seria recusado.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/pointer/effects.ts:61` a `src/app/commands.ts:430`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-037 (via clickDoor e argsFor), EST-L05a-019 (via shared.open), EST-L05a-001 (via keepTyping)
- escreve: nenhum — a gravação entra no trecho `TRC-text.startEdit`

## Resultado
- **Estado final:** EST-L01-037 com `ui.textEdit.node` igual ao id do texto, pelo trecho `TRC-text.startEdit` (`src/editor/canvas/text-edit.ts:104` `  return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, node: node.id }), message: message('status.textEdit.editing') };`); nas recusas do trecho o estado do editor fica como estava.
- **Re-renderizado:** todo assinante da store, pelo trecho `TRC-text.startEdit` (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a moldura deixa de ser `aria-hidden` enquanto a edição dura, pelo trecho (`src/editor/canvas/frame.tsx:264` `      aria-hidden={editing ? undefined : true}`).
- **DOM do canvas:** o renderizador marca o elemento editado como editável e o foca, pelo trecho (`src/editor/canvas/frame.tsx:126` `  renderer.editText(store.getState().document, edit.node, TEXT_EDITING);`).

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/canvas/text-edit.ts:104` `  return { kind: 'change', ui: withEdit(state.ui, { ...state.ui.textEdit, node: node.id }), message: message('status.textEdit.editing') };`.
- G2: ok `src/editor/store.ts:205` `      keepTyping();` — o gesto que a porta usa grava a digitação pendente ao abrir, antes de o comando rodar (o registro é `src/editor/input/pending.ts:44` `export function keepTyping(): void {`).
- G3: ok `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — a porta envia só a intenção (o id do comando e os argumentos) e o tratador único decide.
- G4: ok `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — a ação parte de um ponto do canvas; a barra lateral ocupa a própria coluna (`src/editor/workspace/narrow.ts`), medida na Fase 6.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/editor/input/pointer/effects.ts:61`; as famílias de defeito de painel são medidas na Fase 6.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/input/pointer/effects.ts:61`.
- G7: n/a — o caminho da porta não altera o documento `src/editor/input/pointer/effects.ts:61`.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/input/pointer/effects.ts:61` e `src/app/commands.ts:430`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-text.startEdit
- **Argumentos enviados:** `{}` — o comando não declara argumentos (`manifest/commands/text.json:9` `      "args": {}`), e a porta `canvas-double-click-text-element` tem `adapter.selection` `single`, então `argsFor` não acrescenta `target` (`src/editor/input/pointer/press.ts:84` `  return entry.door.adapter.selection === 'target' && (press.on === 'node' || press.on === 'captured') ? { ...entry.door.args, target: press.node } : { ...entry.door.args };`).
- nenhum — o trecho não lista ramo que dependa dos argumentos, porque o comando não tem argumentos (`auditoria/fluxos/trechos/TRC-text.startEdit.md`, campo `Ramos que dependem dos argumentos`).
