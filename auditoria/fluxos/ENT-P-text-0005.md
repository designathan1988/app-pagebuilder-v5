# ENT-P-text-0005 — text.set pela porta text.set#key-escape-in-text-editing

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:531` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.set`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — o teclado despacha a porta do manifesto. O `dispatch` é ligado em `src/editor/input/keymap.ts:525` `    const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;`; durante a edição do texto não há gesto nem rajada, então é `store.dispatch`, a store do editor.
2. `src/editor/input/keymap.ts:412` `    const focused = contextOf(event.target);` — o contexto do foco: o texto editado no quadro nomeia o próprio contexto, então é `text-editing`. (O Escape de um modal em `src/editor/input/keymap.ts:399` `    if (event.key === 'Escape' && store.getState().ui.dialog !== undefined && store.getState().confirmation === null) {` não é tomado, porque a edição do texto não abre diálogo.)
3. `src/editor/input/keymap.ts:476` `    const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a porta `key-escape-in-text-editing` é achada pelo acorde Escape no contexto `text-editing` (`manifest/commands/text.json:148` `      "chord": "Escape",`).
4. `src/editor/input/keymap.ts:505` `    if (!shortcutRunsNow(binding)) return;` — a porta roda.
5. `src/editor/input/keymap.ts:513` `          ? editArgs(store.getState(), binding.command)` — os argumentos da porta: o nó editado e o texto que a edição guarda. [lê: EST-L01-030 via editArgs] [lê: EST-L01-037 via editArgs]
6. `src/editor/canvas/text-edit.ts:222` `    if (names.includes('target')) args.target = node;` — o id do nó editado entra em `target`; `src/editor/canvas/text-edit.ts:227` `    args.content = marked || hasMarks(reading.runs) ? canonical(reading.runs) : plainText(reading.runs);` — o texto entra em `content`. [lê: EST-L01-030 via editArgs] [lê: EST-L01-037 via editArgs]
7. `src/editor/input/keymap.ts:526` `    const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do campo e da porta da tecla são juntados; a porta declara `{}` (`manifest/commands/text.json:162` `          "args": {}`).
8. `src/editor/input/keymap.ts:530` `    const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `text.set` não toma a área de transferência, então `clipboard` é `undefined` e o despacho é o da linha 531.
9. `src/editor/store.ts:221` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
10. `src/editor/store.ts:222` `      const changesDocument = UNDOABLE.get(id) === true;` — `text.set` é desfazível (`manifest/commands/text.json:117` `        "undoable": true,`), então `changesDocument` é `true`.
11. `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente de um campo é gravada antes do comando que muda o documento.
12. `src/editor/store.ts:224` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState].
13. `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
14. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
15. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca o comando na tabela (`wiring().commands`).
16. `src/app/commands.ts:431` `  'text.set': setTextCommand,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.set`).

## Ramos
- R1 `src/editor/input/keymap.ts:487` `    if (!binding) return;` — nenhum acorde do contexto casa: nada roda; Escape no contexto `text-editing` casa a porta desta entrada.
- R2 `src/editor/input/keymap.ts:505` `    if (!shortcutRunsNow(binding)) return;` — com o comando construído, a porta roda; sem isso o teclado para aqui.
- R3 `src/editor/input/keymap.ts:515` `    if (own === null) return;` — `own` nulo quando o texto editado não guarda leitura; com o texto presente, `editArgs` devolve os argumentos e o caminho segue.
- R4 `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com gesto aberto e comando desfazível, o despacho entra na fila `waiting` (`src/editor/store.ts:230` `        waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/keymap.ts:531` a `src/app/commands.ts:431`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (via editArgs e argumentRefusal do trecho), EST-L01-031 (via getState), EST-L01-037 (via editArgs e getState), EST-L05a-001 (via beforeCommand)
- escreve: nenhum — a gravação entra no trecho `TRC-text.set`

## Resultado
- **Estado final:** EST-L01-030 com o `text` (e o `inline`) do nó pelos patches do trecho `TRC-text.set` (`src/core/text/text.ts:35` `  if (found.node.text !== text) patches.push({ op: 'replace', path: [...found.path, 'text'], value: text });`), e EST-L01-037 com o `ui.textEdit` encerrado (`src/editor/canvas/text-edit.ts:187` `  return command.history.undoable ? ended(state.ui) : state.ui;`).
- **Re-renderizado:** os assinantes de documento e os assinantes da store, pelo trecho (`src/core/store/store.ts:323` `    for (const listener of [...documentListeners]) listener(change);` e `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra a mensagem do desfecho, pelo trecho (`src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),`), e a moldura volta a ser `aria-hidden` quando a edição acaba (`src/editor/canvas/frame.tsx:264` `      aria-hidden={editing ? undefined : true}`).
- **DOM do canvas:** o renderizador aplica os patches ao elemento, pelo trecho (`src/editor/canvas/frame.tsx:81` `    renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: n/a — o trecho grava o texto do nó, fora de qualquer camada de estilo `src/core/text/text.ts:35` `  if (found.node.text !== text) patches.push({ op: 'replace', path: [...found.path, 'text'], value: text });`.
- G2: ok `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (o registro é `src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta envia só a intenção (o id do comando e o texto do campo) e o tratador único decide; as portas do manifesto chamam a mesma linha `src/app/commands.ts:431` `  'text.set': setTextCommand,`.
- G4: n/a — a porta é uma tecla no contexto do texto editado, não um ponto do canvas `manifest/commands/text.json:146` `      "kind": "shortcut",`.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/editor/input/keymap.ts:531`; as famílias de defeito de painel são medidas na Fase 6.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/input/keymap.ts:531`.
- G7: ok `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — o texto entra por um patch aplicado pelo único escritor do documento (no trecho).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de publicar (no trecho).

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/input/keymap.ts:531` e `src/app/commands.ts:431`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-text.set
- **Argumentos enviados:** `{ target, content }` — `target` é o id do nó editado e `content` é o texto simples ou a árvore de runs da edição (`src/editor/canvas/text-edit.ts:227` `    args.content = marked || hasMarks(reading.runs) ? canonical(reading.runs) : plainText(reading.runs);`).
- R1 `src/core/text/text.ts:21` `  if (!found) throw new Error(` — `target` nomeia o nó editado, que o documento guarda; então este ramo não é tomado e o caminho segue.
- R2 `src/core/text/text.ts:22` `  if (rules.elements.get(found.node.type)?.content !== 'text') return { kind: 'refused', message: message('status.element.notApplicable', { command: { key: 'command.editText' }, name: found.node.name }) };` — o nó editado é de conteúdo texto, então o caminho segue.
- R3 `src/core/text/text.ts:27` `  if (runs === null) return { kind: 'refused', message: argumentRefused('content') };` — `content` é texto ou árvore de runs, então este ramo não é tomado e o caminho segue.
- R5 `src/core/text/text.ts:31` `  if (runs === 'unsafe') return { kind: 'refused', message: message('status.link.unsafe') };` — com um endereço de link não permitido no conteúdo, o caminho para aqui; sem ele, segue.
- R6 `src/core/text/text.ts:40` `  if (patches.length === 0) return { kind: 'change', message: message('status.textEdit.cancelled', { name: found.node.name }) };` — com o conteúdo igual ao guardado o caminho para aqui (`change` sem patch); diferente, segue para R7.
