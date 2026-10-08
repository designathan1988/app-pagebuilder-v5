# ENT-P-motion-0001 — motion.add pela porta inspector-motion-add
- **Comando:** motion.add
- **Porta:** `manifest/commands/motion.json:85` `"id": "inspector-motion-add",`
- **Tratador:** `src/app/commands.ts:264` `'motion.add': addMotionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Trecho:** TRC-motion.add

## Passos
1. `src/editor/shell/panel-field.tsx:157` `  const door = useDoor(entry, args, label);` — o botão lê a porta (o rótulo, a disponibilidade, se é a corrente).
2. `src/editor/shell/panel-field.tsx:159` `  const ready = door.available && !disabled;` — só uma porta disponível despacha.
3. `src/editor/shell/panel-field.tsx:170` `      onClick={() => {` — o toque no botão.
4. `src/editor/shell/panel-field.tsx:171` `        if (!ready) return;` — porta indisponível não despacha.
5. `src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });` — o botão despacha motion.add com os argumentos da porta e os do desenho; esta é a linha de Início da porta.
6. `src/editor/store.ts:232` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
7. `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
8. `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo.
9. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
10. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
11. `src/app/commands.ts:264` `'motion.add': addMotionCommand,` — a tabela liga o id ao tratador; o trecho TRC-motion.add continua daqui.

## Ramos
- A disponibilidade do botão: `src/editor/shell/panel-field.tsx:171` `        if (!ready) return;` — porta indisponível não despacha; disponível segue ao passo 5.
- O gesto aberto na store do editor: `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto, o despacho segue; com gesto e um comando que muda o documento, a gravação é adiada (a linha 224).

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:264` `'motion.add': addMotionCommand,`); entre a leitura do estado e a gravação não há await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`), EST-L05a-001 (a digitação pendente da store).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`), EST-L01-037 (`state.ui`).

## Resultado
- **Estado final:** o comando motion.add corre no contexto da porta; o documento muda, o histórico ganha um passo e a mensagem é a do comando (`src/app/commands.ts:264` `'motion.add': addMotionCommand,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel da interação (ou da linha do tempo) redesenha e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó.

## Regras
- G1: n/a — o tratador grava as interações do próprio nó (`src/core/motion/commands.ts:153` `  patches.push(...writeMotions(found.node, found.path, [...motionsOf(found.node), read.value]));`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:125` `export const addMotionCommand = registerHandler('motion.add', (context, { trigger, timeline }): Outcome<never> => {`); os argumentos vêm do manifesto e do painel.
- G3: n/a — o comando tem uma porta só (`manifest/commands/motion.json:85` `"id": "inspector-motion-add",`).
- G4: n/a — o tratador só devolve correções e mensagem (`src/core/motion/commands.ts:154`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:85` `"id": "inspector-motion-add",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — as correções trocam os campos do nó (`src/core/motion/document.ts:76` `export function writeMotions(node: DocNode, path: readonly (string | number)[], motions: readonly MotionInteraction[]): Patch[] {`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-motion.add
- **Argumentos enviados:** `{}` (vazio)
- R2: o caminho passa pelo lado de espécie válida: sem `trigger` a espécie é o primeiro gatilho aplicável, e a recusa `status.motion.notApplicable` não é alcançada. `src/core/motion/commands.ts:129` `  if (!isTriggerKind(kind) || !triggerApplies(kind, found.node)) return { kind: 'refused', message: message('status.motion.notApplicable', { name: { key: triggerLabel(kind) }, element: found.node.name }) };`
- R5: o caminho passa pelo lado sem nome de timeline, em que `findTimeline` não é consultado e a recusa `status.motion.notFound` não é alcançada. `src/core/motion/commands.ts:136` `    if (findTimeline(context.state.document, timeline) === null) return { kind: 'refused', message: message('status.motion.notFound', { name: timeline }) };`
- R6: o caminho passa pelo lado que cria uma timeline nova, porque `timeline` é indefinido. `src/core/motion/commands.ts:134` `  if (timeline !== undefined && timeline !== '') {`
