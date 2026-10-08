# ENT-P-events-0004 — interactions.update pela porta inspector-interaction-target
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:196` `          "id": "inspector-interaction-target",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Trecho:** TRC-interactions.update

## Passos
1. `src/editor/shell/panel-field.tsx:157` `  const door = useDoor(entry, args, label);` — o botão lê a porta (o rótulo, a disponibilidade, se é a corrente). [lê: EST-L01-031 via useDoor] [lê: EST-L01-037 via useDoor]
2. `src/editor/shell/panel-field.tsx:159` `  const ready = door.available && !disabled;` — só uma porta disponível despacha.
3. `src/editor/shell/panel-field.tsx:170` `      onClick={() => {` — o toque no botão do alvo.
4. `src/editor/shell/panel-field.tsx:171` `        if (!ready) return;` — porta indisponível não despacha.
5. `src/editor/shell/panel-field.tsx:172` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });` — o botão despacha interactions.update com os argumentos da porta e os do desenho; esta é a linha de Início da porta.
6. `src/editor/store.ts:221` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
7. `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
8. `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo. [escreve: EST-L01-037 via dispatch]
9. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
10. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
11. `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,` — a tabela liga o id ao tratador; o trecho TRC-interactions.update continua daqui.

## Ramos
- A disponibilidade do botão: `src/editor/shell/panel-field.tsx:171` `        if (!ready) return;` — porta indisponível não despacha; disponível segue ao passo 5.
- O gesto aberto na store do editor: `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue à store do núcleo; com gesto aberto e um comando que muda o documento (interactions.update é desfazível), a gravação é adiada em `src/editor/store.ts:230` `        waiting.push(() => void store.dispatch(id, args, asked));`.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`); entre a leitura do estado e a entrega ao tratador não há await, timer nem quadro.

## Estado
- Lê: EST-L01-031, EST-L01-037 (a seleção e o `ui`, pelo desenho do botão), EST-L05a-001 (a digitação pendente), EST-L05a-038 (o gesto aberto visto pela store do editor).
- Escreve: nenhum no caminho da porta — a marcação da escolha do alvo e a gravação entram no trecho TRC-interactions.update.

## Resultado
- **Estado final:** o comando interactions.update corre no contexto da porta; com `changes: { pick: true }` o tratador grava o índice a escolher no estado do editor (`src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o botão do alvo passa a mostrar que está escolhendo (`src/editor/store.ts:253` `  return useSyncExternalStore(store.subscribe, () => select(store.getState()));`).
- **DOM do canvas:** nada muda no documento neste caminho (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`); a interação não é desenhada nem executada.

## Regras
- G1: n/a — a porta envia os argumentos fixos da porta (o campo e o pedido de escolha); nada lê ponto de quebra, estado, classe-alvo nem quadro-chave (`src/core/events/interactions.ts:307` `  return { kind: 'change', ui: make.makePicking(make.makePicked(context.state.ui), interaction) };`).
- G2: ok `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — com rascunho pendente o registro grava antes; interactions.update é desfazível no manifesto (`manifest/commands/events.json:132` `      "undoable": true,`).
- G3: ok `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,` — as nove portas chamam o mesmo tratador e enviam só o `field` próprio com o valor; esta manda o pedido de escolha.
- G4: n/a — a porta é um botão do inspetor, na própria coluna, fora do canvas (`manifest/commands/events.json:198` `          "drawnAs": "button",`).
- G5: n/a — o comando marca a escolha do alvo e não desenha controle que cresça painel ou barra (`manifest/commands/events.json:198` `          "drawnAs": "button",`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — o tratador não escreve seleção e a store é a fonte única.
- G7: n/a — o canvas de edição não desenha nem executa a interação (`manifest/features/18-animation-and-events.json:2371` `          "The editing canvas never runs them."`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de ser cometido.

## Limpeza
- nenhuma — a porta não cria ouvinte, timer nem observador; nenhuma linha citada em Passos registra ouvinte.

## Medições
- nenhuma — nenhum passo do caminho da porta lê dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-interactions.update
- **Argumentos enviados:** `field: "target"` e `changes: { pick: true }` (fixos da porta, `manifest/commands/events.json:220` `            "field": "target",` e `manifest/commands/events.json:221` `            "changes": {`), e `interaction` (o índice do cartão, `src/editor/shell/interactions.tsx:151` `            <PanelButton entry={TARGET_FIELD} args={{ interaction: index }} pressed={picking} icon={<Icon name="locate-fixed" size="sm" />}>`).
- R1 (`interaction`): `interaction` é um número; o trecho passa pelo lado em que a interação é encontrada (`src/core/events/interactions.ts:302` `  const held = interactionsOf(found.node)[interaction];`).
- R3 (`changes.pick`): `changes` é um objeto com `pick` verdadeiro; o trecho passa pelo lado verdadeiro e devolve só o estado do editor, sem passo de desfazer (`src/core/events/interactions.ts:306` `  if (changes !== null && typeof changes === 'object' && !Array.isArray(changes) && (changes as Record<string, unknown>).pick === true) {`).
- R5 e R6 (`field` e `changes`): `changes` não é cadeia nem objeto de valores, então o trecho não passa por nenhum dos dois lados (`src/core/events/interactions.ts:312` `  if (typeof changes === 'string') {` e `src/core/events/interactions.ts:317` `  } else if (changes !== null && typeof changes === 'object' && !Array.isArray(changes)) {`).
