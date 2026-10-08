# ENT-P-events-0009 — interactions.update pela porta layers-row-pick-target
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:335` `          "id": "layers-row-pick-target",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/shell/sidebar/layers.tsx:361` `      onClick={() => (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, interaction: picking, changes: { target: node.id } })}`
- **Trecho:** TRC-interactions.update

## Passos
1. `src/editor/shell/sidebar/layers.tsx:351` `  const picking = useEditorState((s) => pickingTarget(s.ui));` — a interação cujo alvo está sendo escolhido, lida do estado do editor. [lê: EST-L01-037 via useEditorState]
2. `src/editor/shell/sidebar/layers.tsx:353` `  if (picking === null || entry === null) return null;` — sem escolha em curso, o controle não é desenhado.
3. `src/editor/shell/sidebar/layers.tsx:359` `      data-args={JSON.stringify({ ...entry.door.args, target: node.id, interaction: picking })}` — os argumentos que o controle representa (o campo, o nó da linha e o índice escolhido).
4. `src/editor/shell/sidebar/layers.tsx:361` `      onClick={() => (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, interaction: picking, changes: { target: node.id } })}` — a linha da camada despacha interactions.update com o índice e o nó da linha; esta é a linha de Início da porta.
5. `src/editor/store.ts:232` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
6. `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
7. `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-037 via dispatch]
8. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
9. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
10. `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,` — a tabela liga o id ao tratador; o trecho TRC-interactions.update continua daqui.

## Ramos
- Sem escolha em curso: `src/editor/shell/sidebar/layers.tsx:353` `  if (picking === null || entry === null) return null;` — sem interação a escolher, o controle não é desenhado e nada despacha; com escolha, segue ao passo 4.
- O gesto aberto na store do editor: `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue à store do núcleo; com gesto aberto e um comando que muda o documento (interactions.update é desfazível), a gravação é adiada em `src/editor/store.ts:243` `        waiting.push(() => void store.dispatch(id, args, asked));`.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`); entre a leitura do estado e a entrega ao tratador não há await, timer nem quadro.

## Estado
- Lê: EST-L01-037 (`ui.pickTarget`, pelo desenho do controle), EST-L05a-001 (a digitação pendente), EST-L05a-038 (o gesto aberto visto pela store do editor).
- Escreve: nenhum no caminho da porta — a limpeza da escolha e a gravação do documento entram no trecho TRC-interactions.update.

## Resultado
- **Estado final:** o comando interactions.update corre no contexto da porta; a interação no índice escolhido passa a ter o alvo do nó da linha, e a escolha é retirada pelo tratador (`src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o cartão da interação passa a mostrar o nó escolhido e o botão do alvo deixa de estar pressionado (`src/editor/store.ts:275` `  return useSyncExternalStore(store.subscribe, () => select(store.getState()));`).
- **DOM do canvas:** o quadro aplica a mudança do documento ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); a interação não é desenhada nem executada.

## Regras
- G1: n/a — a porta envia o índice e o nó em `changes.target` e a gravação de `interactions` no nó é do tratador (`src/core/events/interactions.ts:357` `      patches: writeInteractions(found, interactions),`); nada lê ponto de quebra, estado, classe-alvo nem quadro-chave.
- G2: ok `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — com rascunho pendente o registro grava antes; interactions.update é desfazível no manifesto (`manifest/commands/events.json:132` `      "undoable": true,`).
- G3: ok `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,` — as nove portas chamam o mesmo tratador; esta manda o índice e o nó em `changes`.
- G4: n/a — a porta vive numa linha das Camadas, na própria coluna, fora do canvas (`manifest/commands/events.json:337` `          "drawnAs": "item",`).
- G5: n/a — o comando muda o alvo de uma interação e não desenha controle que cresça painel ou barra (`manifest/commands/events.json:337` `          "drawnAs": "item",`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — o tratador não escreve seleção e a store é a fonte única.
- G7: n/a — o canvas de edição não desenha nem executa a interação (`manifest/features/18-animation-and-events.json:2371` `          "The editing canvas never runs them."`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de ser cometido.

## Limpeza
- nenhuma — a porta não cria ouvinte, timer nem observador; nenhuma linha citada em Passos registra ouvinte.

## Medições
- nenhuma — nenhum passo do caminho da porta lê dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-interactions.update
- **Argumentos enviados:** `field: "target"` (fixo da porta, `manifest/commands/events.json:359` `            "field": "target"`), `interaction` (o índice que estava sendo escolhido, `picking`) e `changes: { target: node.id }` (o nó da linha).
- R1 (`interaction`): `interaction` é um número; o trecho passa pelo lado em que a interação é encontrada (`src/core/events/interactions.ts:302` `  const held = interactionsOf(found.node)[interaction];`).
- R3 (`changes.pick`): `changes` é um objeto com `target`, sem `pick`; o trecho não passa pelo lado da escolha do alvo (`src/core/events/interactions.ts:306` `  if (changes !== null && typeof changes === 'object' && !Array.isArray(changes) && (changes as Record<string, unknown>).pick === true) {`).
- R5 e R6 (`field` e `changes`): `changes` é um objeto de valores; o trecho passa pelo lado dos valores (`src/core/events/interactions.ts:317` `  } else if (changes !== null && typeof changes === 'object' && !Array.isArray(changes)) {`) e dentro dele pelo ramo `target` (`src/core/events/interactions.ts:320` `  if (typeof wanted.target === 'string') {`), não pelo lado do texto.
