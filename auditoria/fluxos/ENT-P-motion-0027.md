# ENT-P-motion-0027 — motion.addAction pela porta timeline-motion-add-action-after
- **Comando:** motion.addAction
- **Porta:** `manifest/commands/motion.json:1090` `"id": "timeline-motion-add-action-after",`
- **Tratador:** `src/app/commands.ts:271` `'motion.addAction': addActionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:79` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`
- **Trecho:** TRC-motion.addAction

## Passos
1. `src/editor/shell/panel-field.tsx:82` `  const keep = (event: FormEvent) => {` — o envio do formulário do campo (Enter).
2. `src/editor/shell/panel-field.tsx:85` `    if (!edited) return;` — sem digitação nova, nada é guardado. [lê: EST-L09b-005 via keep]
3. `src/editor/shell/panel-field.tsx:87` `    runWith(accept === undefined ? draft : accept(draft));` — o texto digitado (já passado pelo aceite da porta) entra em `runWith`.
4. `src/editor/shell/panel-field.tsx:77` `    const argument = textArgument(entry, args);` — o argumento livre da porta, o único que nem a porta nem o desenho dão, que recebe o texto.
5. `src/editor/shell/panel-field.tsx:78` `    if (argument === null || chosen === value) return;` — sem argumento livre, ou texto igual ao mostrado, nada é despachado.
6. `src/editor/shell/panel-field.tsx:79` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });` — o campo despacha motion.addAction com os argumentos da porta, os do desenho e o texto; esta é a linha de Início da porta.
7. `src/editor/store.ts:233` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
8. `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo.
10. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
11. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
12. `src/app/commands.ts:271` `'motion.addAction': addActionCommand,` — a tabela liga o id ao tratador; o trecho TRC-motion.addAction continua daqui.

## Ramos
- O argumento livre: `src/editor/shell/panel-field.tsx:78` `    if (argument === null || chosen === value) return;` — sem argumento livre, ou texto igual ao mostrado, nada é despachado; com argumento e texto novo, o caminho segue ao passo 6.
- A disponibilidade: `src/editor/shell/panel-field.tsx:89` `  const ready = door.built && !disabled;` — o botão e o campo só correm com a porta construída; a mesma linha de despacho serve todas as portas do comando.
- O gesto aberto na store do editor: `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho segue; com um gesto aberto e um comando que muda o documento, a gravação é adiada (a linha 224) e corre quando o gesto fecha.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:271` `'motion.addAction': addActionCommand,`); entre a leitura do estado e a gravação não há await, timer nem quadro.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-031 (`state.selection`), EST-L09b-005 (a digitação do campo), EST-L05a-001 (a digitação pendente da store).
- Escreve: EST-L01-030 (`state.document`), EST-L01-032 (`state.history`), EST-L01-033 (`state.message`), EST-L01-037 (`state.ui`).

## Resultado
- **Estado final:** o comando motion.addAction corre no contexto da porta; o documento muda, o histórico ganha um passo e a mensagem é a do comando (`src/app/commands.ts:271` `'motion.addAction': addActionCommand,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel da interação (ou da linha do tempo) redesenha e a barra de status mostra a mensagem.
- **DOM do canvas:** o quadro aplica a mudança ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`), que redesenha o nó.

## Regras
- G1: n/a — o tratador grava a timeline do projeto (`src/core/motion/commands.ts:312`), não uma camada de estilo, e não lê o contexto de edição.
- G2: n/a — o tratador não lê campo de digitação (`src/core/motion/commands.ts:299`).
- G3: ok — as três portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:271` `'motion.addAction': addActionCommand,` e enviam só o `placement`; o tratador decide por ele (`src/core/motion/commands.ts:308`).
- G4: n/a — o tratador só devolve correção e mensagem (`src/core/motion/commands.ts:312`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle; a porta vive na colocação do painel (`manifest/commands/motion.json:1090` `"id": "timeline-motion-add-action-after",`).
- G6: ok — o resultado não traz seleção, que fica como estava (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: ok — a correção troca uma timeline inteira no índice (`src/core/motion/commands.ts:104` `  return { kind: 'change', patches: [writeTimeline(index, read.value)], message: said };`) e o canvas aplica `before`/`after`/`patches` (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`).
- INT: ok — o documento inteiro é validado antes do commit (`src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-motion.addAction
- **Argumentos enviados:** `placement: "after"`, `timeline`, `kind` (a espécie digitada)
- R1: `timeline` vem do painel, existente: o caminho segue ao passo 7. `src/core/motion/commands.ts:301` `  if (isOutcome(found)) return found;`
- R2: `kind` é o texto digitado; conhecido, o caminho segue ao passo 9. `src/core/motion/commands.ts:302` `  if (!isEffectKind(kind)) return invalid(kind);`
- R3: `placement` é fixado pela porta e decide o início da ação em `placementStart`. `src/core/motion/commands.ts:308` `    start: placementStart(found.timeline, (placement ?? 'after') as Placement, playheadOf(context)),`
