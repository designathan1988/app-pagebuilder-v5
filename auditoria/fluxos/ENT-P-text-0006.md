# ENT-P-text-0006 — text.set pela porta text.set#canvas-click-outside-edited-element

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/input/pointer/effects.ts:251` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.set`, que segue daqui.

## Passos
1. `src/editor/input/pointer/effects.ts:251` `      if (kept) store.dispatch(kept.entry.command.id as CommandId, kept.args as never);` — no ramo `commit`/`cancel` do efeito de ponteiro, o texto que o press deixou é gravado depois de o gesto fechar. O `kept` é montado no começo do mesmo efeito em `src/editor/input/pointer/effects.ts:40` `      ps.keeping = ending && endArgs ? { entry: ending, args: endArgs } : null;`, a partir da porta `outside-edited-element` (`src/editor/input/pointer/effects.ts:38` `      const ending = editEndDoor(press, ps.buttons.button, ps.buttons.count, ps.buttons.modifier, p.factsOf(press));`) e dos argumentos da edição (`src/editor/input/pointer/effects.ts:39` `      const endArgs = ending ? editArgs(store.getState(), ending.command) : null;`).
2. `src/editor/canvas/text-edit.ts:222` `    if (names.includes('target')) args.target = node;` — o id do nó editado entra em `target`; `src/editor/canvas/text-edit.ts:227` `    args.content = marked || hasMarks(reading.runs) ? canonical(reading.runs) : plainText(reading.runs);` — o texto entra em `content`. [lê: EST-L01-030 via editArgs] [lê: EST-L01-037 via editArgs] [lê: EST-L05a-019 via ps.keeping]
3. `src/editor/store.ts:233` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
4. `src/editor/store.ts:234` `      const changesDocument = UNDOABLE.get(id) === true;` — `text.set` é desfazível (`manifest/commands/text.json:117` `        "undoable": true,`), então `changesDocument` é `true`.
5. `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente de um campo é gravada antes do comando que muda o documento.
6. `src/editor/store.ts:236` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState].
7. `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — o gesto já fechou (`src/editor/input/pointer/effects.ts:243` `      if (effect === 'commit') closing?.commit();`), então o despacho vai à store do núcleo.
8. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
9. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca o comando na tabela (`wiring().commands`).
10. `src/app/commands.ts:431` `  'text.set': setTextCommand,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.set`).

## Ramos
- R1 `src/editor/input/pointer/press.ts:59` `  if (target === OUTSIDE_EDIT) return (press.on === 'node' || press.on === 'stage' || press.on === 'row') && facts.edited !== null && !(press.on === 'node' && press.node === facts.edited);` — a porta `outside-edited-element` toma um press fora do elemento editado; um press sobre o próprio elemento editado não a toma e `ending` fica nulo.
- R2 `src/editor/input/pointer/effects.ts:39` `      const endArgs = ending ? editArgs(store.getState(), ending.command) : null;` — com uma porta de fim de edição e leitura da edição, `endArgs` é montado; sem leitura, `endArgs` é nulo e o ramo da linha 40 deixa `ps.keeping` nulo.
- R3 `src/editor/input/pointer/effects.ts:251` `      if (kept) store.dispatch(kept.entry.command.id as CommandId, kept.args as never);` — com `kept` não nulo o texto é gravado; nulo (nenhuma edição a terminar), nada é despachado.
- R4 `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — o gesto já fechou, então o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, o despacho entraria na fila `waiting` (`src/editor/store.ts:244` `        waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/pointer/effects.ts:251` a `src/app/commands.ts:431`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (via editArgs e argumentRefusal do trecho), EST-L01-031 (via getState), EST-L01-037 (via editArgs e getState), EST-L05a-001 (via beforeCommand), EST-L05a-019 (via ps.keeping)
- escreve: nenhum — a gravação entra no trecho `TRC-text.set`

## Resultado
- **Estado final:** EST-L01-030 com o `text` (e o `inline`) do nó pelos patches do trecho `TRC-text.set` (`src/core/text/text.ts:35` `  if (found.node.text !== text) patches.push({ op: 'replace', path: [...found.path, 'text'], value: text });`), e EST-L01-037 com o `ui.textEdit` encerrado (`src/editor/canvas/text-edit.ts:187` `  return command.history.undoable ? ended(state.ui) : state.ui;`); em R6 do trecho o documento fica como estava e só a mensagem muda.
- **Re-renderizado:** os assinantes de documento e os assinantes da store, pelo trecho (`src/core/store/store.ts:323` `    for (const listener of [...documentListeners]) listener(change);` e `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra a mensagem do desfecho, pelo trecho (`src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),`), e a moldura volta a ser `aria-hidden` quando a edição acaba (`src/editor/canvas/frame.tsx:264` `      aria-hidden={editing ? undefined : true}`).
- **DOM do canvas:** o renderizador aplica os patches ao elemento, pelo trecho (`src/editor/canvas/frame.tsx:81` `    renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: n/a — o trecho grava o texto do nó, fora de qualquer camada de estilo `src/core/text/text.ts:35` `  if (found.node.text !== text) patches.push({ op: 'replace', path: [...found.path, 'text'], value: text });`.
- G2: ok `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (o registro é `src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`); o press que começou o gesto também gravou, no seu primeiro passo (`src/editor/input/pointer/events.ts:58` `    keepTypingBefore(event.target);`).
- G3: ok `src/editor/input/pointer/effects.ts:251` `      if (kept) store.dispatch(kept.entry.command.id as CommandId, kept.args as never);` — a porta envia só a intenção (o id do comando e os argumentos da edição) e o tratador único decide; as portas do manifesto chamam a mesma linha `src/app/commands.ts:431` `  'text.set': setTextCommand,`.
- G4: ok `src/editor/input/pointer/effects.ts:251` `      if (kept) store.dispatch(kept.entry.command.id as CommandId, kept.args as never);` — a ação parte de um clique no canvas; a barra lateral ocupa a própria coluna (`src/editor/workspace/narrow.ts`), medida na Fase 6.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/editor/input/pointer/effects.ts:251`; as famílias de defeito de painel são medidas na Fase 6.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/input/pointer/effects.ts:251`.
- G7: ok `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — o texto entra por um patch aplicado pelo único escritor do documento (no trecho).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de publicar (no trecho).

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/input/pointer/effects.ts:251` e `src/app/commands.ts:431`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-text.set
- **Argumentos enviados:** `{ target, content }` — `target` é o id do nó editado e `content` é o texto simples ou a árvore de runs da edição (`src/editor/canvas/text-edit.ts:227` `    args.content = marked || hasMarks(reading.runs) ? canonical(reading.runs) : plainText(reading.runs);`), montados por `src/editor/input/pointer/effects.ts:39` `      const endArgs = ending ? editArgs(store.getState(), ending.command) : null;`.
- R1 `src/core/text/text.ts:21` `  if (!found) throw new Error(` — `target` nomeia o nó editado, que o documento guarda; então este ramo não é tomado e o caminho segue.
- R2 `src/core/text/text.ts:22` `  if (rules.elements.get(found.node.type)?.content !== 'text') return { kind: 'refused', message: message('status.element.notApplicable', { command: { key: 'command.editText' }, name: found.node.name }) };` — o nó editado é de conteúdo texto, então o caminho segue.
- R3 `src/core/text/text.ts:27` `  if (runs === null) return { kind: 'refused', message: argumentRefused('content') };` — `content` é texto ou árvore de runs, então este ramo não é tomado e o caminho segue.
- R5 `src/core/text/text.ts:31` `  if (runs === 'unsafe') return { kind: 'refused', message: message('status.link.unsafe') };` — com um endereço de link não permitido no conteúdo, o caminho para aqui; sem ele, segue.
- R6 `src/core/text/text.ts:40` `  if (patches.length === 0) return { kind: 'change', message: message('status.textEdit.cancelled', { name: found.node.name }) };` — com o conteúdo igual ao guardado o caminho para aqui (`change` sem patch); diferente, segue para R7.
