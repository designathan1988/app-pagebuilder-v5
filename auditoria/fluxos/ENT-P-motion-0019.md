# ENT-P-motion-0019 — motion.update pela porta inspector-motion-event
- **Comando:** motion.update
- **Porta:** `manifest/commands/motion.json:651` `"id": "inspector-motion-event",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:79` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`
- **Trecho:** TRC-motion.update

## Passos
1. `src/editor/shell/panel-field.tsx:82` `  const keep = (event: FormEvent) => {` — o envio do formulário do campo (Enter).
2. `src/editor/shell/panel-field.tsx:85` `    if (!edited) return;` — sem digitação nova, nada é guardado. [lê: EST-L09b-005 via keep]
3. `src/editor/shell/panel-field.tsx:87` `    runWith(accept === undefined ? draft : accept(draft));` — o texto digitado (já passado pelo aceite da porta) entra em `runWith`.
4. `src/editor/shell/panel-field.tsx:77` `    const argument = textArgument(entry, args);` — o argumento livre da porta, o único que nem a porta nem o desenho dão, que recebe o texto.
5. `src/editor/shell/panel-field.tsx:78` `    if (argument === null || chosen === value) return;` — sem argumento livre, ou texto igual ao mostrado, nada é despachado.
6. `src/editor/shell/panel-field.tsx:79` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });` — o campo despacha motion.update com os argumentos da porta, os do desenho e o texto; esta é a linha de Início da porta.
7. `src/editor/store.ts:221` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
8. `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo.
10. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
11. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
12. `src/app/commands.ts:265` `'motion.update': updateMotionCommand,` — a tabela liga o id ao tratador; o trecho TRC-motion.update continua daqui.

## Ramos
- O argumento livre: `src/editor/shell/panel-field.tsx:78` `    if (argument === null || chosen === value) return;` — sem argumento livre, ou texto igual ao mostrado, nada é despachado; com argumento e texto novo, o caminho segue ao passo 6.
- A disponibilidade: `src/editor/shell/panel-field.tsx:89` `  const ready = door.built && !disabled;` — o botão e o campo só correm com a porta construída; a mesma linha de despacho serve todas as portas do comando.
- O gesto aberto na store do editor: `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho segue; com um gesto aberto e um comando que muda o documento, a gravação é adiada (a linha 224) e corre quando o gesto fecha.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:265` `'motion.update': updateMotionCommand,`); entre a leitura do estado e a gravação não há await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`), EST-L09b-005 (a digitação do campo), EST-L05a-001 (a digitação pendente da store).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`), EST-L01-037 (`state.ui`).

## Resultado
- **Estado final:** o comando motion.update corre no contexto da porta; o documento muda, o histórico ganha um passo e a mensagem é a do comando (`src/app/commands.ts:265` `'motion.update': updateMotionCommand,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel da interação (ou da linha do tempo) redesenha e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó.

## Regras
- G1: n/a — o tratador grava as interações do próprio nó (`src/core/motion/commands.ts:244` `  return { kind: 'change', patches: writeMotions(found.node, found.path, motions), message: message('status.motion.updated', { name: { key: triggerLabel(read.value.trigger.kind) }, element: found.node.name }) };`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador lê o argumento `value` do campo, não o rascunho pendente (`src/core/motion/commands.ts:231`).
- G3: ok — as vinte portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:265` `'motion.update': updateMotionCommand,` e enviam só o `field` próprio com o valor; o tratador (`src/core/motion/commands.ts:161`) decide por ele.
- G4: n/a — o tratador só devolve correções e mensagem (`src/core/motion/commands.ts:244`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:651` `"id": "inspector-motion-event",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca o campo `motions` do nó (`src/core/motion/document.ts:76` `export function writeMotions(node: DocNode, path: readonly (string | number)[], motions: readonly MotionInteraction[]): Patch[] {`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-motion.update
- **Argumentos enviados:** `field: "event"`, `interaction`, `value`
- R1: o caminho passa pelo lado que segue ao passo 6, porque `field` e `interaction` vêm preenchidos. `src/core/motion/commands.ts:233` `  if (found === null || interaction === undefined || field === undefined) return { kind: 'change' };`
- R4: o caminho passa pelo ramo do `field` próprio que a porta fixa, decidido dentro de `updatedInteraction`. `src/core/motion/commands.ts:239` `  if (isOutcome(next)) return next;`
- R5: o caminho passa pelo lado que segue ao passo 22 quando o `value` é uma interação válida. `src/core/motion/commands.ts:241` `  if (!read.ok) return invalid(value);`
