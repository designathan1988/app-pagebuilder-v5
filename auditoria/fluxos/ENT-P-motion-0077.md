# ENT-P-motion-0077 — motion.setBehaviour pela porta inspector-motion-behaviour-smooth-scroll
- **Comando:** motion.setBehaviour
- **Porta:** `manifest/commands/motion.json:3431` `"id": "inspector-motion-behaviour-smooth-scroll",`
- **Tratador:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Trecho:** TRC-motion.setBehaviour

## Passos
1. `src/editor/shell/panel-field.tsx:157` `  const door = useDoor(entry, args, label);` — o botão lê a porta (o rótulo, a disponibilidade, se é a corrente).
2. `src/editor/shell/panel-field.tsx:159` `  const ready = door.available && !disabled;` — só uma porta disponível despacha.
3. `src/editor/shell/panel-field.tsx:170` `      onClick={() => {` — o toque no botão.
4. `src/editor/shell/panel-field.tsx:171` `        if (!ready) return;` — porta indisponível não despacha.
5. `src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });` — o botão despacha motion.setBehaviour com os argumentos da porta e os do desenho; esta é a linha de Início da porta.
6. `src/editor/store.ts:233` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
7. `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
8. `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo.
9. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
10. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
11. `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,` — a tabela liga o id ao tratador; o trecho TRC-motion.setBehaviour continua daqui.

## Ramos
- A disponibilidade do botão: `src/editor/shell/panel-field.tsx:171` `        if (!ready) return;` — porta indisponível não despacha; disponível segue ao passo 5.
- O gesto aberto na store do editor: `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto, o despacho segue; com gesto e um comando que muda o documento, a gravação é adiada (a linha 224).

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`); entre a leitura do estado e a gravação não há await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`), EST-L05a-001 (a digitação pendente da store).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`), EST-L01-037 (`state.ui`).

## Resultado
- **Estado final:** o comando motion.setBehaviour corre no contexto da porta; o documento muda, o histórico ganha um passo e a mensagem é a do comando (`src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel da interação (ou da linha do tempo) redesenha e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó.

## Regras
- G1: n/a — o comportamento de execução grava os campos do nó (`src/core/motion/commands.ts:793` `  return { kind: 'change', patches: writeBehaviours(found.node, found.path, next), message: message('status.motion.behaviourSet', { name: { key: behaviourLabel(kind) }, element: found.node.name }) };`) e `sticky`/`scroll-snap` escrevem a camada que a store já escolheu (`src/core/style/set.ts:334` `  const { breakpoint, state: base } = rules.base;`); nenhum captura um contexto de digitação.
- G2: n/a — o tratador lê os argumentos `amount` e `axis`, não o rascunho pendente (`src/core/motion/commands.ts:776`).
- G3: ok — as nove portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,` e enviam só a `behaviour`, o `amount` ou o `axis`; o tratador decide por eles (`src/core/motion/commands.ts:784`).
- G4: n/a — o tratador só devolve correções e mensagem (`src/core/motion/commands.ts:793`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:3431` `"id": "inspector-motion-behaviour-smooth-scroll",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`); o `scroll-snap` troca a seleção só na cópia interna do `writeStyle` (`src/core/motion/commands.ts:771`).
- G7: ok — a correção troca os campos do nó (`src/core/motion/document.ts:80` `export function writeBehaviours(node: DocNode, path: readonly (string | number)[], behaviours: readonly Behaviour[]): Patch[] {`) ou as declarações de estilo (`src/core/style/set.ts:304`), e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-motion.setBehaviour
- **Argumentos enviados:** `behaviour: "smooth-scroll"`
- R1: com elemento primário, o caminho segue ao passo 7. `src/core/motion/commands.ts:780` `  if (found === null) return { kind: 'change' };`
- R3: `behaviour` é fixado pela porta e decide o ramo do estilo (`sticky`/`scroll-snap`) ou o de execução. `src/core/motion/commands.ts:784` `  if (kind === 'sticky' || kind === 'scroll-snap') return styleBehaviour(context, found, kind, amount, axis);`
- R4: com `behaviour` conhecida, o caminho segue ao passo 15. `src/core/motion/commands.ts:785` `  if (!isRuntimeBehaviour(kind)) return invalid(behaviour);`
- R5: com `amount`/`axis` dentro da faixa, o caminho segue ao passo 20. `src/core/motion/commands.ts:789` `  if (!read.ok) return invalid(amount ?? behaviour);`
- R6: com comportamento diferente do atual, o caminho segue ao passo 22. `src/core/motion/commands.ts:792` `  if (JSON.stringify(next) === JSON.stringify(behavioursOf(found.node))) return { kind: 'change' };`
