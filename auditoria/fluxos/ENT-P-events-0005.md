# ENT-P-events-0005 — interactions.update pela porta inspector-interaction-value
- **Comando:** interactions.update
- **Porta:** `manifest/commands/events.json:227` `          "id": "inspector-interaction-value",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Início:** `src/editor/shell/panel-field.tsx:79` `    const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });`
- **Trecho:** TRC-interactions.update

## Passos
1. `src/editor/shell/panel-field.tsx:95` `      <form className="panel-field__form" onSubmit={keep}>` — o campo é um formulário de um só input; o Enter o submete e o roda com o que ele guarda.
2. `src/editor/shell/panel-field.tsx:82` `  const keep = (event: FormEvent) => {` — o submetedor do formulário.
3. `src/editor/shell/panel-field.tsx:85` `    if (!edited) return;` — sem digitação desde que o campo mostrou o valor do documento, nada a guardar.
4. `src/editor/shell/panel-field.tsx:87` `    runWith(accept === undefined ? draft : accept(draft));` — o texto guardado é levado ao comando; a porta do valor não passa `accept`, então o rascunho vai como está.
5. `src/editor/shell/panel-field.tsx:76` `  const runWith = (chosen: string) => {` — a rotina que roda a porta com um texto.
6. `src/editor/shell/panel-field.tsx:77` `    const argument = textArgument(entry, args);` — o único argumento do comando que nem a porta nem o desenho dão é `changes`.
7. `src/editor/shell/panel-field.tsx:19` `  const free = Object.keys(entry.command.args).filter((name) => !(name in entry.door.args) && !(name in given));` — a porta fixa `field` e o desenho dá `interaction`; sobra `changes`.
8. `src/editor/shell/panel-field.tsx:78` `    if (argument === null || chosen === value) return;` — sem argumento livre, ou texto igual ao do documento, nada despacha.
9. `src/editor/shell/panel-field.tsx:79` `    const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen });` — o campo despacha interactions.update com `field: "value"`, `interaction` e `changes`; esta é a linha de Início da porta.
10. `src/editor/store.ts:233` `    dispatch: (id, args, context) => {` — o despacho entra na store do editor, que guarda a digitação e prende o contexto. [lê: EST-L05a-038 via gestureSafe]
11. `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
12. `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho segue para a store do núcleo. [escreve: EST-L01-030 via dispatch]
13. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
14. `src/core/store/store.ts:400` `    const entry = table[id];` — o id resolve a entrada da tabela de comandos. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
15. `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,` — a tabela liga o id ao tratador; o trecho TRC-interactions.update continua daqui.

## Ramos
- Sem digitação por guardar: `src/editor/shell/panel-field.tsx:85` `    if (!edited) return;` — lado verdadeiro (nada digitado desde o valor do documento): nada despacha; lado falso: segue.
- Texto igual ao do documento: `src/editor/shell/panel-field.tsx:78` `    if (argument === null || chosen === value) return;` — lado verdadeiro: nada despacha; lado falso: segue ao passo 9.
- O gesto aberto na store do editor: `src/editor/store.ts:238` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue à store do núcleo; com gesto aberto e um comando que muda o documento (interactions.update é desfazível), a gravação é adiada em `src/editor/store.ts:244` `        waiting.push(() => void store.dispatch(id, args, asked));`.

## Fronteiras assíncronas
- nenhuma — a porta e o despacho são síncronos (`src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`); entre a submissão do formulário e a entrega ao tratador não há await, timer nem quadro.

## Estado
- Lê: EST-L05a-001 (a digitação pendente), EST-L05a-038 (o gesto aberto visto pela store do editor).
- Escreve: nenhum no caminho da porta — a gravação do documento entra no trecho TRC-interactions.update.

## Resultado
- **Estado final:** o comando interactions.update corre no contexto da porta; a interação no índice dado passa a ter o valor digitado pelo tratador (`src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o campo volta a mostrar o valor do documento e a aba de interações redescreve o cartão (`src/editor/store.ts:276` `  return useSyncExternalStore(store.subscribe, () => select(store.getState()));`).
- **DOM do canvas:** o quadro é notificado da mudança do documento (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`); a interação não é desenhada nem executada.

## Regras
- G1: n/a — o campo envia o texto no argumento `changes` e a gravação de `interactions` no nó é do tratador (`src/core/events/interactions.ts:357` `      patches: writeInteractions(found, interactions),`); nada lê ponto de quebra, estado, classe-alvo nem quadro-chave.
- G2: ok `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` — com rascunho pendente o registro grava antes; interactions.update é desfazível no manifesto (`manifest/commands/events.json:132` `      "undoable": true,`).
- G3: ok `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,` — as nove portas (esta e as demais) chamam o mesmo tratador e enviam só o `field` próprio com o valor.
- G4: n/a — a porta é um campo do inspetor, na própria coluna, fora do canvas (`manifest/commands/events.json:229` `          "drawnAs": "field",`).
- G5: n/a — o comando muda um campo de uma interação e não desenha controle que cresça painel ou barra (`manifest/commands/events.json:229` `          "drawnAs": "field",`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — o tratador não escreve seleção e a store é a fonte única.
- G7: n/a — o canvas de edição não desenha nem executa a interação (`manifest/features/18-animation-and-events.json:2371` `          "The editing canvas never runs them."`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de ser cometido.

## Limpeza
- nenhuma — a porta não cria ouvinte, timer nem observador; nenhuma linha citada em Passos registra ouvinte.

## Medições
- nenhuma — nenhum passo do caminho da porta lê dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-interactions.update
- **Argumentos enviados:** `field: "value"` (fixo da porta, `manifest/commands/events.json:251` `            "field": "value"`), `interaction` (o índice do cartão, `src/editor/shell/interactions.tsx:131` `            args={{ interaction: index }}`) e `changes` (o texto digitado em `[argument]`).
- R1 (`interaction`): `interaction` é um número; o trecho passa pelo lado em que a interação é encontrada (`src/core/events/interactions.ts:302` `  const held = interactionsOf(found.node)[interaction];`).
- R3 (`changes.pick`): `changes` é o texto digitado, não um objeto com `pick`; o trecho não passa pelo lado da escolha do alvo (`src/core/events/interactions.ts:306` `  if (changes !== null && typeof changes === 'object' && !Array.isArray(changes) && (changes as Record<string, unknown>).pick === true) {`).
- R5 e R6 (`field` e `changes`): `field` é `"value"` e `changes` é uma cadeia; o trecho passa pelo lado do texto (`src/core/events/interactions.ts:312` `  if (typeof changes === 'string') {`) e dentro dele pelo ramo `value` (`src/core/events/interactions.ts:265` `  if (field === 'value') {`), não pelo lado dos valores.
