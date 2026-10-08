# ENT-P-text-0008 — text.set pela porta text.set#key-enter-in-element-text-field

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/input/keymap.ts:531` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.set`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — o teclado despacha a porta do manifesto. O `dispatch` é ligado em `src/editor/input/keymap.ts:525` `    const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;`; sem gesto nem rajada, é `store.dispatch`, a store do editor.
2. `src/editor/input/keymap.ts:412` `    const focused = contextOf(event.target);` — o contexto do foco: o campo de texto do inspector nomeia o próprio contexto `element-text-field` (`src/editor/input/keymap.ts:132` `    const own = field ? target.getAttribute('data-key-context') : null;`).
3. `src/editor/input/keymap.ts:476` `    const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a porta `key-enter-in-element-text-field` é achada pelo acorde Enter no contexto `element-text-field` (`manifest/commands/text.json:217` `      "context": "element-text-field",`).
4. `src/editor/input/keymap.ts:505` `    if (!shortcutRunsNow(binding)) return;` — a porta roda.
5. `src/editor/input/keymap.ts:514` `          : focusedArgs(event.target, binding);` — os argumentos da porta vêm do controle focado (o campo), não da edição no canvas. [lê: EST-L01-037 via focusedArgs]
6. `src/editor/input/keymap.ts:199` `  return field !== null && into !== undefined ? { ...own, [into]: field.value } : own;` — o texto do campo preenche o único argumento de texto do comando que o controle e a porta não dão (`content`, `src/editor/input/keymap.ts:197` `  const text = Object.entries(takes).filter(([name, arg]) => (arg.type === 'string' || arg.type === 'json') && !(name in own) && !(name in entry.door.args));`), e `sameCommand` deixa `target` vir do `data-args` do controle. [lê: EST-L01-037 via focusedArgs]
7. `src/editor/input/keymap.ts:526` `    const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do campo e da porta da tecla são juntados; a porta declara `{}` (`manifest/commands/text.json:230` `          "args": {}`).
8. `src/editor/input/keymap.ts:530` `    const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `text.set` não toma a área de transferência, então `clipboard` é `undefined` e o despacho é o da linha 531.
9. `src/editor/store.ts:221` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
10. `src/editor/store.ts:222` `      const changesDocument = UNDOABLE.get(id) === true;` — `text.set` é desfazível (`manifest/commands/text.json:117` `        "undoable": true,`), então `changesDocument` é `true`.
11. `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é gravada; como o comando é do próprio campo, `beforeCommand` devolve o contexto da digitação (`src/editor/input/pending.ts:79` `  if (typing.owns(id, (args ?? {}) as Readonly<Record<string, unknown>>)) return typing.context;`).
12. `src/editor/store.ts:224` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState].
13. `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo, no contexto da digitação.
14. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
15. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca o comando na tabela (`wiring().commands`).
16. `src/app/commands.ts:431` `  'text.set': setTextCommand,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.set`).

## Ramos
- R1 `src/editor/input/keymap.ts:178` `  if (!control || !drawn) return {};` — o foco fora de um controle com `data-door` devolve `{}`; o campo do inspector é um controle desenhado, então os argumentos vêm dele.
- R2 `src/editor/input/keymap.ts:192` `  if (control.getAttribute('aria-disabled') === 'true') return null;` — um controle desabilitado devolve nulo e o teclado para (`src/editor/input/keymap.ts:515` `    if (own === null) return;`); disponível, o caminho segue.
- R3 `src/editor/input/keymap.ts:197` `  const text = Object.entries(takes).filter(([name, arg]) => (arg.type === 'string' || arg.type === 'json') && !(name in own) && !(name in entry.door.args));` — o texto só preenche um argumento quando ele é o único de texto que falta; `text.set` tem `content` como esse argumento, então o valor do campo entra nele.
- R4 `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo, no contexto da digitação; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:230` `        waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/keymap.ts:531` a `src/app/commands.ts:431`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (via argumentRefusal do trecho), EST-L01-031 (via getState), EST-L01-037 (via focusedArgs e getState), EST-L05a-001 (via beforeCommand)
- escreve: nenhum — a gravação entra no trecho `TRC-text.set`

## Resultado
- **Estado final:** EST-L01-030 com o `text` (e o `inline`) do nó pelos patches do trecho `TRC-text.set` (`src/core/text/text.ts:35` `  if (found.node.text !== text) patches.push({ op: 'replace', path: [...found.path, 'text'], value: text });`); em R6 do trecho o documento fica como estava e só a mensagem muda.
- **Re-renderizado:** os assinantes de documento e os assinantes da store, pelo trecho (`src/core/store/store.ts:323` `    for (const listener of [...documentListeners]) listener(change);` e `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra a mensagem do desfecho, pelo trecho (`src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),`), e o campo volta a mostrar o texto do documento.
- **DOM do canvas:** o renderizador aplica os patches ao elemento, pelo trecho (`src/editor/canvas/frame.tsx:81` `    renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: ok `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — o comando do próprio campo roda no contexto em que a digitação começou (`src/editor/input/pending.ts:79` `  if (typing.owns(id, (args ?? {}) as Readonly<Record<string, unknown>>)) return typing.context;`), que chega à store do núcleo em `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);`.
- G2: ok `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é respondida antes (o registro é `src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/input/keymap.ts:531` `    if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta envia só a intenção (o id do comando e o texto do campo) e o tratador único decide; as portas do manifesto chamam a mesma linha `src/app/commands.ts:431` `  'text.set': setTextCommand,`.
- G4: n/a — a porta é uma tecla no campo do inspector, não um ponto do canvas `manifest/commands/text.json:214` `      "kind": "shortcut",`.
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
- **Argumentos enviados:** `{ target, content }` — `target` vem do `data-args` do campo e `content` é o texto que ele guarda (`src/editor/input/keymap.ts:199` `  return field !== null && into !== undefined ? { ...own, [into]: field.value } : own;`).
- R1 `src/core/text/text.ts:21` `  if (!found) throw new Error(` — `target` nomeia o nó do campo, que o documento guarda; então este ramo não é tomado e o caminho segue.
- R2 `src/core/text/text.ts:22` `  if (rules.elements.get(found.node.type)?.content !== 'text') return { kind: 'refused', message: message('status.element.notApplicable', { command: { key: 'command.editText' }, name: found.node.name }) };` — o nó do campo é de conteúdo texto, então o caminho segue.
- R3 `src/core/text/text.ts:27` `  if (runs === null) return { kind: 'refused', message: argumentRefused('content') };` — `content` é o texto do campo, então este ramo não é tomado e o caminho segue.
- R5 `src/core/text/text.ts:31` `  if (runs === 'unsafe') return { kind: 'refused', message: message('status.link.unsafe') };` — o texto do campo é simples, sem endereço de link não permitido, então este ramo não é tomado.
- R6 `src/core/text/text.ts:40` `  if (patches.length === 0) return { kind: 'change', message: message('status.textEdit.cancelled', { name: found.node.name }) };` — com o texto igual ao guardado o caminho para aqui (`change` sem patch); diferente, segue para R7.
