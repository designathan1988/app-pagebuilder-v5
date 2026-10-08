# ENT-P-events-0001 — interactions.add pela porta inspector-interaction-add
- **Comando:** interactions.add
- **Porta:** `manifest/commands/events.json:63` `"id": "inspector-interaction-add",`
- **Tratador:** `src/app/commands.ts:261` `'interactions.add': addInteractionCommand,`
- **Início:** `src/editor/shell/interactions.tsx:195` `(store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(ADD.command.id as CommandId, { ...ADD.door.args });`
- **Trecho:** TRC-interactions.add

## Passos
1. `src/editor/shell/interactions.tsx:188` `  const state = useEditorState((s) => s);` — a aba lê o estado do editor para desenhar. [lê: EST-L01-031 via useEditorState]
2. `src/editor/shell/interactions.tsx:192` `  const single = state.selection.length === 1;` — só com um elemento selecionado o botão fica habilitado. [lê: EST-L01-031 via useEditorState]
3. `src/editor/shell/interactions.tsx:219` `          onClick={() => {` — o toque no botão Add do painel.
4. `src/editor/shell/interactions.tsx:220` `            if (single) add();` — sem seleção única o toque não faz nada; com ela chama `add`.
5. `src/editor/shell/interactions.tsx:194` `    if (ADD === null) return;` — sem a porta no manifesto, nada despacha.
6. `src/editor/shell/interactions.tsx:195` `    (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(ADD.command.id as CommandId, { ...ADD.door.args });` — o botão despacha interactions.add com os argumentos da porta; esta é a linha de Início da porta.
7. `src/editor/store.ts:233` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
8. `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo. [escreve: EST-L01-030 via dispatch]
10. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
11. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
12. `src/app/commands.ts:261` `'interactions.add': addInteractionCommand,` — a tabela liga o id ao tratador; o trecho TRC-interactions.add continua daqui.

## Ramos
- Seleção única: `src/editor/shell/interactions.tsx:220` `            if (single) add();` — lado falso (nenhum ou vários selecionados): nada despacha; lado verdadeiro: chama `add`.
- A porta existe: `src/editor/shell/interactions.tsx:194` `    if (ADD === null) return;` — lado verdadeiro (sem a porta no manifesto): nada despacha; lado falso: segue ao passo 6.
- O gesto aberto na store do editor: `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue à store do núcleo (o lado desta porta); com gesto aberto e um comando que muda o documento (interactions.add é desfazível), a gravação é adiada em `src/editor/store.ts:244` `        waiting.push(() => void store.dispatch(id, args, asked));`.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:261` `'interactions.add': addInteractionCommand,`); entre a leitura do estado e a entrega ao tratador não há await, timer nem quadro.

## Estado
- Lê: EST-L01-031 (`state.selection`, pelo desenho do botão), EST-L05a-001 (a digitação pendente), EST-L05a-038 (o gesto aberto visto pela store do editor).
- Escreve: nenhum no caminho da porta — a gravação do documento entra no trecho TRC-interactions.add.

## Resultado
- **Estado final:** o comando interactions.add corre no contexto da porta; a interação nova entra no documento pelo tratador (`src/app/commands.ts:261` `'interactions.add': addInteractionCommand,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a aba de interações do inspetor redescreve os cartões do elemento, pelo mesmo aviso ao editor (`src/editor/store.ts:276` `  return useSyncExternalStore(store.subscribe, () => select(store.getState()));`).
- **DOM do canvas:** o quadro aplica a mudança do documento ao renderizador (`src/editor/canvas/frame.tsx:81` `        renderer.apply(change.before, change.after, change.patches);`); a interação não é desenhada nem executada.

## Regras
- G1: n/a — a porta envia os argumentos fixos da porta e a gravação de `interactions` no nó é do tratador (`src/core/events/interactions.ts:242` `      patches: writeInteractions(found, [...interactionsOf(found.node), interaction]),`); nada lê ponto de quebra, estado, classe-alvo nem quadro-chave.
- G2: ok `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — com rascunho pendente o registro grava antes; `interactions.add` é desfazível no manifesto (`manifest/commands/events.json:55` `      "undoable": true,`).
- G3: ok `src/app/commands.ts:261` `'interactions.add': addInteractionCommand,` — a única porta do comando (`manifest/commands/events.json:63` `          "id": "inspector-interaction-add",`) envia só a intenção a este tratador.
- G4: n/a — a porta é um controle do inspetor, na própria coluna, fora do canvas (`manifest/commands/events.json:77` `            "region": "inspector-interactions",`).
- G5: n/a — o comando acrescenta uma interação e não desenha controle que cresça painel ou barra (`manifest/commands/events.json:65` `          "drawnAs": "button",`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — o tratador não escreve seleção e a store é a fonte única.
- G7: n/a — o canvas de edição não desenha nem executa a interação (`manifest/features/18-animation-and-events.json:2371` `          "The editing canvas never runs them."`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de ser cometido.

## Limpeza
- nenhuma — a porta não cria ouvinte, timer nem observador; nenhuma linha citada em Passos registra ouvinte.

## Medições
- nenhuma — nenhum passo do caminho da porta lê dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-interactions.add
- **Argumentos enviados:** `{}` (a porta declara `manifest/commands/events.json:86` `          "args": {}` e o botão envia `{ ...ADD.door.args }`); nenhum campo é enviado.
- R2 (`trigger`): `trigger` vai ausente deste porta; o trecho passa pelo lado em que o gatilho é o primeiro aplicável (`src/core/events/interactions.ts:210` `  const chosenTrigger = trigger ?? applicableTriggers(found.node)[0] ?? 'click';`), sem a recusa `status.interactions.notApplicable`.
- R3 (`action`): `action` vai ausente; o trecho passa pelo lado em que a ação é a primeira aplicável (`src/core/events/interactions.ts:212` `  const chosenAction = action ?? applicableActions(found.node)[0] ?? 'show';`).
- R4 (`target` e `options`): `target` e `options` vão ausentes; o trecho passa pelo lado em que nenhum alvo é gravado e `options` é normalizado a um registro vazio (`src/core/events/interactions.ts:216` `  const held = options !== null && typeof options === 'object' && !Array.isArray(options) ? (options as Record<string, unknown>) : {};`).
