# ENT-P-events-0011 — interactions.remove pela porta inspector-interaction-remove
- **Comando:** interactions.remove
- **Porta:** `manifest/commands/events.json:421` `          "id": "inspector-interaction-remove",`
- **Tratador:** `src/app/commands.ts:263` `'interactions.remove': removeInteractionCommand,`
- **Início:** `src/editor/shell/panel-field.tsx:203` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`
- **Trecho:** TRC-interactions.remove

## Passos
1. `src/editor/shell/panel-field.tsx:188` `  const door = useDoor(entry, args, label);` — o botão lê a porta (o rótulo, a disponibilidade, se é a corrente). [lê: EST-L01-031 via useDoor] [lê: EST-L01-037 via useDoor]
2. `src/editor/shell/panel-field.tsx:190` `  const ready = door.available && !disabled;` — só uma porta disponível despacha.
3. `src/editor/shell/panel-field.tsx:201` `      onClick={() => {` — o toque no botão Remove do cartão.
4. `src/editor/shell/panel-field.tsx:202` `        if (!ready) return;` — porta indisponível não despacha.
5. `src/editor/shell/panel-field.tsx:203` `        const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });` — o botão despacha interactions.remove com os argumentos da porta e os do desenho; esta é a linha de Início da porta.
6. `src/editor/store.ts:233` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
7. `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
8. `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo. [escreve: EST-L01-030 via dispatch]
9. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
10. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
11. `src/app/commands.ts:263` `'interactions.remove': removeInteractionCommand,` — a tabela liga o id ao tratador; o trecho TRC-interactions.remove continua daqui.

## Ramos
- A disponibilidade do botão: `src/editor/shell/panel-field.tsx:202` `        if (!ready) return;` — porta indisponível não despacha; disponível segue ao passo 5.
- O gesto aberto na store do editor: `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue à store do núcleo; com gesto aberto e um comando que muda o documento (interactions.remove é desfazível), a gravação é adiada em `src/editor/store.ts:244` `        waiting.push(() => void store.dispatch(id, args, asked));`.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:263` `'interactions.remove': removeInteractionCommand,`); entre a leitura do estado e a entrega ao tratador não há await, timer nem quadro.

## Estado
- Lê: EST-L01-031, EST-L01-037 (a seleção e o `ui`, pelo desenho do botão), EST-L05a-001 (a digitação pendente), EST-L05a-038 (o gesto aberto visto pela store do editor).
- Escreve: nenhum no caminho da porta — a gravação do documento entra no trecho TRC-interactions.remove.

## Resultado
- **Estado final:** o comando interactions.remove corre no contexto da porta; o documento deixa de listar a interação removida pelo tratador (`src/app/commands.ts:263` `'interactions.remove': removeInteractionCommand,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a aba de interações deixa de desenhar o cartão removido (`src/editor/store.ts:276` `  return useSyncExternalStore(store.subscribe, () => select(store.getState()));`).
- **DOM do canvas:** o quadro aplica a mudança do documento ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); a interação não é desenhada nem executada.

## Regras
- G1: n/a — a porta envia o índice da interação no próprio argumento da porta; a gravação de `interactions` no nó é do tratador (`src/core/events/interactions.ts:374` `  return { kind: 'change', patches: writeInteractions(found, interactions), message: message('status.interactions.removed',`); nada lê ponto de quebra, estado, classe-alvo nem quadro-chave.
- G2: ok `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — com rascunho pendente o registro grava antes; interactions.remove é desfazível no manifesto (`manifest/commands/events.json:413` `      "undoable": true,`).
- G3: ok `src/app/commands.ts:263` `'interactions.remove': removeInteractionCommand,` — a única porta do comando (`manifest/commands/events.json:421` `          "id": "inspector-interaction-remove",`) envia só a intenção a este tratador.
- G4: n/a — a porta é um botão do inspetor, na própria coluna, fora do canvas (`manifest/commands/events.json:423` `          "drawnAs": "icon-button",`).
- G5: n/a — o comando remove uma interação e não desenha controle que cresça painel ou barra (`manifest/commands/events.json:423` `          "drawnAs": "icon-button",`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — o tratador não escreve seleção e a store é a fonte única.
- G7: n/a — o canvas de edição não desenha nem executa a interação (`manifest/features/18-animation-and-events.json:2371` `          "The editing canvas never runs them."`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de ser cometido.

## Limpeza
- nenhuma — a porta não cria ouvinte, timer nem observador; nenhuma linha citada em Passos registra ouvinte.

## Medições
- nenhuma — nenhum passo do caminho da porta lê dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-interactions.remove
- **Argumentos enviados:** `interaction` (o índice do cartão, `src/editor/shell/interactions.tsx:116` `        {REMOVE !== null ? <PanelButton entry={REMOVE} args={{ interaction: index }} label={t('command.interactions.remove')} icon={<Icon name="trash" size="sm" />} /> : null}`); a porta não fixa mais nenhum campo (`manifest/commands/events.json:444` `          "args": {}`).
- R1 (`interaction`): `interaction` é um número; o trecho passa pelo lado em que o índice é aceito (`src/core/events/interactions.ts:368` `  if (found === null || typeof interaction !== 'number') return { kind: 'change' };`).
- R2 (`interaction`): `interaction` nomeia uma interação da lista; o trecho passa pelo lado em que a interação é encontrada (`src/core/events/interactions.ts:369` `  const held = interactionsOf(found.node)[interaction];`), sem sair por `src/core/events/interactions.ts:370` `  if (held === undefined) return { kind: 'change' };`.
