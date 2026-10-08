# ENT-P-text-0007 — text.set pela porta text.set#inspector-text

Fluxo de porta do domínio `text`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-text.set`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — o controle desenhado despacha a porta. O `dispatch` é ligado em `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`, e os argumentos são montados em `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`. O controle desta porta é o campo de texto do inspector, que passa o nó que ele representa como `target` e o texto digitado como `content`.
2. `src/editor/store.ts:221` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:222` `      const changesDocument = UNDOABLE.get(id) === true;` — `text.set` é desfazível (`manifest/commands/text.json:117` `        "undoable": true,`), então `changesDocument` é `true`.
4. `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente de um campo é gravada antes do comando que muda o documento.
5. `src/editor/store.ts:224` `      const edited = heldTyping() === null ? null : editedKey(store.getState());` — [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState].
6. `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `    const entry = table[id];` — `run` busca o comando na tabela (`wiring().commands`).
9. `src/app/commands.ts:431` `  'text.set': setTextCommand,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-text.set`).

## Ramos
- R1 `src/editor/doors/door.tsx:99` `    if (files !== undefined) {` — o comando não declara um argumento de tipo `files`, então `files` é `undefined` e o ramo do escolhedor de vários arquivos não é tomado.
- R2 `src/editor/doors/door.tsx:110` `    if (clipboard !== undefined) {` — o comando não declara um argumento de tipo `clipboard`, então `clipboard` é `undefined` e o ramo da leitura da área de transferência não é tomado.
- R3 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não declara um argumento de tipo `file`, então `file` é `undefined` e o caminho segue para a linha 144.
- R4 `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:230` `        waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:431`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (via argumentRefusal do trecho), EST-L01-031 (via getState), EST-L01-037 (via getState), EST-L05a-001 (via beforeCommand)
- escreve: nenhum — a gravação entra no trecho `TRC-text.set`

## Resultado
- **Estado final:** EST-L01-030 com o `text` (e o `inline`) do nó pelos patches do trecho `TRC-text.set` (`src/core/text/text.ts:35` `  if (found.node.text !== text) patches.push({ op: 'replace', path: [...found.path, 'text'], value: text });`), e EST-L01-037 com o `ui.textEdit` encerrado (`src/editor/canvas/text-edit.ts:187` `  return command.history.undoable ? ended(state.ui) : state.ui;`); em R6 do trecho o documento fica como estava e só a mensagem muda.
- **Re-renderizado:** os assinantes de documento e os assinantes da store, pelo trecho (`src/core/store/store.ts:323` `    for (const listener of [...documentListeners]) listener(change);` e `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra a mensagem do desfecho, pelo trecho (`src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),`), e o campo volta a mostrar o texto do documento.
- **DOM do canvas:** o renderizador aplica os patches ao elemento, pelo trecho (`src/editor/canvas/frame.tsx:81` `    renderer.apply(change.before, change.after, change.patches);`).

## Regras
- G1: n/a — o trecho grava o texto do nó, fora de qualquer camada de estilo `src/core/text/text.ts:35` `  if (found.node.text !== text) patches.push({ op: 'replace', path: [...found.path, 'text'], value: text });`.
- G2: ok `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (o registro é `src/editor/input/pending.ts:76` `export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando e o texto do campo) e o tratador único decide; as portas do manifesto chamam a mesma linha `src/app/commands.ts:431` `  'text.set': setTextCommand,`.
- G4: n/a — a porta é um campo do inspector, não um ponto do canvas `manifest/commands/text.json:188` `      "kind": "inspector-field",`.
- G5: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — o inspector ocupa a própria coluna e o campo encolhe (`min-width: 0`), medido na Fase 6.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/doors/door.tsx:144`.
- G7: ok `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — o texto entra por um patch aplicado pelo único escritor do documento (no trecho).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de publicar (no trecho).

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:431`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-text.set
- **Argumentos enviados:** `{ target, content }` — `target` é o nó do campo e `content` é o texto digitado nele, enviado como string.
- R1 `src/core/text/text.ts:21` `  if (!found) throw new Error(` — `target` nomeia o nó do campo, que o documento guarda; então este ramo não é tomado e o caminho segue.
- R2 `src/core/text/text.ts:22` `  if (rules.elements.get(found.node.type)?.content !== 'text') return { kind: 'refused', message: message('status.element.notApplicable', { command: { key: 'command.editText' }, name: found.node.name }) };` — o nó do campo é de conteúdo texto, então o caminho segue.
- R3 `src/core/text/text.ts:27` `  if (runs === null) return { kind: 'refused', message: argumentRefused('content') };` — `content` é o texto digitado, então este ramo não é tomado e o caminho segue.
- R5 `src/core/text/text.ts:31` `  if (runs === 'unsafe') return { kind: 'refused', message: message('status.link.unsafe') };` — o texto do campo é simples, sem endereço de link não permitido, então este ramo não é tomado.
- R6 `src/core/text/text.ts:40` `  if (patches.length === 0) return { kind: 'change', message: message('status.textEdit.cancelled', { name: found.node.name }) };` — com o texto igual ao guardado o caminho para aqui (`change` sem patch); diferente, segue para R7.
