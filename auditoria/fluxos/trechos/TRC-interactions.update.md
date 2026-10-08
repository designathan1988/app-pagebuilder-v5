# TRC-interactions.update
- **Chamada:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Argumentos:** o tratador recebe `{ interaction, field, changes }` — `interaction` é o índice da interação na lista do elemento, `field` é o campo editado, `changes` é o texto digitado ou um objeto de valores (`src/generated/commands.ts:160`).
- **Ramos que dependem dos argumentos:** R1 (`interaction`), R3 (`changes.pick`), R5 e R6 (`field` e `changes`).

## Passos
1. O despacho resolve o tratador na tabela pelo id e o chama: `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o contexto montado lê o estado da store `[lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]`.
2. `src/app/commands.ts:144` `const INTERACTIONS_UPDATE = updateInteractionCommand<EditorUi>({ makePicking, makePicked });` — o tratador é montado para o estado do editor, com os fabricantes de escolha do alvo.
3. `src/core/events/interactions.ts:298` `export function updateInteractionCommand<Ui>(make: PickMaking<Ui>): RegisteredHandler<'interactions.update', Ui> {`
4. `src/core/events/interactions.ts:299` `return registerHandler<'interactions.update', Ui>('interactions.update', (context, { interaction, field, changes }): Outcome<Ui> => {` — o tratador entra com os três argumentos.
5. `src/core/events/interactions.ts:300` `const found = targetNode(context);` — resolve o nó primário da seleção `[lê: EST-L01-030 via targetNode] [lê: EST-L01-031 via targetNode]`.
6. `src/core/events/interactions.ts:301` `if (found === null || typeof interaction !== 'number') return { kind: 'change' };` — sem nó ou sem índice, nada muda (R1).
7. `src/core/events/interactions.ts:302` `const held = interactionsOf(found.node)[interaction];` — a interação no índice dado `[lê: EST-L01-030 via interactionsOf]`.
8. `src/core/events/interactions.ts:303` `if (held === undefined) return { kind: 'change' };` — índice fora da lista, nada muda (R2).
9. `src/core/events/interactions.ts:306` `if (changes !== null && typeof changes === 'object' && !Array.isArray(changes) && (changes as Record<string, unknown>).pick === true) {` — a porta do alvo inicia a escolha (R3).
10. `src/core/events/interactions.ts:307` `return { kind: 'change', ui: make.makePicking(make.makePicked(context.state.ui), interaction) };` — grava o índice a escolher no estado do editor [lê: EST-L01-037 via makePicked] [escreve: EST-L01-037 via makePicking].
11. `src/editor/inspector/pick-target.ts:13` `export const makePicking = <Ui extends { readonly pickTarget?: number | undefined }>(ui: Ui, interaction: number): Ui => ({ ...ui, pickTarget: interaction });`
12. `src/editor/inspector/pick-target.ts:15` `if (ui.pickTarget === undefined) return ui;` — `makePicked` devolve o mesmo objeto quando nada estava escolhido.
13. `src/core/events/interactions.ts:309` `const locked = lockedRefusal(context, found.node);` — a trava do elemento ou de um ancestral `[lê: EST-L01-030 via lockedRefusal]` (R4).
14. `src/core/events/interactions.ts:311` `let next: Interaction = held;` — a interação que será gravada começa na que está.
15. `src/core/events/interactions.ts:312` `if (typeof changes === 'string') {` — o texto digitado é um campo (R5).
16. `src/core/events/interactions.ts:314` `const made = changedByText(found.node, held, field, changes);` — aplica o texto ao campo dado `[lê: EST-L01-030 via changedByText]`.
17. `src/core/events/interactions.ts:250` `if (field === 'trigger') {` — o gatilho só muda para um aplicável (`src/core/events/interactions.ts:251`).
18. `src/core/events/interactions.ts:254` `if (field === 'action') {` — a ação nova leva consigo os valores que precisava (`src/core/events/interactions.ts:257`).
19. `src/core/events/interactions.ts:265` `if (field === 'value') {` — o valor da ação passa por `optionsFrom` (`src/core/events/interactions.ts:266`).
20. `src/core/events/interactions.ts:271` `if (field === 'options') {` — o texto de opções passa por `readOptions` (`src/core/events/interactions.ts:272`).
21. `src/core/events/interactions.ts:189` `function withOptions(interaction: Interaction, options: InteractionOptions): Interaction {` — aplica `once` e `delay` `[lê: EST-L04b-007 via withOptions]`.
22. `src/core/events/interactions.ts:276` `if (field === 'scope') {` — o escopo vazio remove o campo (`src/core/events/interactions.ts:277`); um escopo fora da gramática de classe é recusado (`src/core/events/interactions.ts:282`).
23. `src/core/events/interactions.ts:317` `} else if (changes !== null && typeof changes === 'object' && !Array.isArray(changes)) {` — o objeto de valores é um campo (R6).
24. `src/core/events/interactions.ts:320` `if (typeof wanted.target === 'string') {` — o alvo escolhido precisa existir no documento (`src/core/events/interactions.ts:321`).
25. `src/core/events/interactions.ts:324` `if (typeof wanted.scope === 'string') {`, `src/core/events/interactions.ts:328` `if (typeof wanted.trigger === 'string') {`, `src/core/events/interactions.ts:332` `if (typeof wanted.action === 'string') {` — escopo, gatilho e ação validados como no texto.
26. `src/core/events/interactions.ts:337` `if ('once' in wanted || 'delay' in wanted) {` — as opções como valores (`src/core/events/interactions.ts:338`).
27. `src/core/events/interactions.ts:343` `if (typeof wanted.newTab === 'boolean') {` — o pedido de nova aba só é guardado quando verdadeiro (`src/core/events/interactions.ts:346`).
28. `src/core/events/interactions.ts:348` `} else {` — `changes` de outra forma não muda nada (`src/core/events/interactions.ts:349`).
29. `src/core/events/interactions.ts:351` `const cleared = make.makePicked(context.state.ui);` — a escolha do alvo termina `[lê: EST-L01-037 via makePicked]`.
30. `src/core/events/interactions.ts:353` `if (deepEqualInteraction(next, held)) return { kind: 'change', ...(ui === undefined ? {} : { ui }) };` — sem diferença, nenhum patch (R7).
31. `src/core/events/interactions.ts:354` `const interactions = interactionsOf(found.node).map((each, at) => (at === interaction ? next : each));` — troca a interação no índice dado.
32. `src/core/events/interactions.ts:357` `patches: writeInteractions(found, interactions),` — o patch que grava a interação mudada `[escreve: EST-L01-030 via writeInteractions]`.
33. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o patch ao documento `[escreve: EST-L01-030 via applyPatches]`.
34. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store grava o estado do editor devolvido (a escolha do alvo) `[escreve: EST-L01-037 via run]`.
35. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — publica a mudança `[escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]`.

## Ramos
- R1 — sem alvo ou sem índice: `src/core/events/interactions.ts:301` `if (found === null || typeof interaction !== 'number') return { kind: 'change' };`. Valores: seleção vazia, ou `interaction` não numérico; resultado: nenhuma mudança.
- R2 — índice fora da lista: `src/core/events/interactions.ts:303` `if (held === undefined) return { kind: 'change' };`; resultado: nenhuma mudança.
- R3 — a escolha do alvo: `src/core/events/interactions.ts:306` `if (changes !== null && typeof changes === 'object' && !Array.isArray(changes) && (changes as Record<string, unknown>).pick === true) {`. Lado `pick` verdadeiro (porta `inspector-interaction-target`, `manifest/commands/events.json:222` `"pick": true`): só o estado do editor muda (`src/core/events/interactions.ts:307`), sem passo de desfazer; lado contrário: segue para a gravação.
- R4 — nó travado: `src/core/events/interactions.ts:310` `if (locked !== null) return { kind: 'refused', message: locked };`; lado travado: recusa; lado livre: segue.
- R5 — texto digitado: `src/core/events/interactions.ts:312` `if (typeof changes === 'string') {`. O caminho muda com `field`: `trigger` (`src/core/events/interactions.ts:250`), `action` (`src/core/events/interactions.ts:254`), `value` (`src/core/events/interactions.ts:265`), `options` (`src/core/events/interactions.ts:271`), `scope` (`src/core/events/interactions.ts:276`); qualquer outro campo é recusado (`src/core/events/interactions.ts:285`).
- R6 — valores: `src/core/events/interactions.ts:317` `} else if (changes !== null && typeof changes === 'object' && !Array.isArray(changes)) {`. O caminho muda com as chaves presentes: `target`, `scope`, `trigger`, `action`, `once`/`delay`, `newTab`.
- R7 — sem diferença: `src/core/events/interactions.ts:353` `if (deepEqualInteraction(next, held)) return { kind: 'change', ...(ui === undefined ? {} : { ui }) };`; resultado: nenhum patch e nenhum passo de desfazer, e o estado do editor só muda se a escolha mudou.
- R8 — `changes` de outra forma: `src/core/events/interactions.ts:348` `} else {` e `src/core/events/interactions.ts:349` `return { kind: 'change' };`; resultado: nenhuma mudança.

## Fronteiras assíncronas
- nenhuma — nenhuma das funções chamadas (`src/core/events/interactions.ts:298` `export function updateInteractionCommand<Ui>(make: PickMaking<Ui>): RegisteredHandler<'interactions.update', Ui> {`) contém `await`, timer, quadro ou ouvinte; o tratador é síncrono.

## Estado
- Lidos: EST-L01-030 (`context.state.document`), EST-L01-031 (`context.state.selection`), EST-L01-037 (`context.state.ui`), EST-L04b-007 (via `withOptions`).
- Escritos: EST-L01-030 (o documento, pelo patch de `writeInteractions`), EST-L01-037 (o campo de escolha do alvo, por `makePicking`/`makePicked`).

## Resultado
- **Estado final:** `src/core/store/store.ts:535` `const ran: StoreState<Ui> = {` — o documento passa a listar a interação mudada no índice dado, e o estado do editor perde a escolha do alvo; a seleção não muda.
- **Re-renderizado:** `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes da store são notificados.
- **DOM do editor:** `src/editor/store.ts:276` `return useSyncExternalStore(store.subscribe, () => select(store.getState()));` — o inspetor redescreve os campos da interação e o botão de alvo deixa de estar pressionado.
- **DOM do canvas:** `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` — o canvas é notificado da mudança do documento; a interação não é desenhada nem executada.

## Regras
- G1: n/a — o trecho grava `interactions` no caminho do próprio nó e o campo de escolha no estado do editor; não lê ponto de quebra, estado, classe-alvo nem quadro-chave (`src/core/events/interactions.ts:357`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `interactions.update` é desfazível no manifesto (`manifest/commands/events.json:132` `"undoable": true,`), então a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,` — as nove portas do comando (`inspector-interaction-trigger`, `inspector-interaction-action`, `inspector-interaction-target`, `inspector-interaction-value`, `inspector-interaction-options`, `inspector-interaction-scope`, `canvas-click-pick-target`, `layers-row-pick-target`, `inspector-interaction-new-tab`) despacham para este tratador; a porta decide só o campo e o valor.
- G4: n/a — as portas nascem no painel do inspetor e nas Camadas, em colunas próprias, ou no canvas com a intenção do alvo (`manifest/commands/events.json:77` `"region": "inspector-interactions",`).
- G5: n/a — o comando muda um campo de uma interação e não desenha controle que cresça painel ou barra (`manifest/commands/events.json:142` `"drawnAs": "field",`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — o trecho não escreve seleção e a store é a fonte única.
- G7: n/a — o canvas de edição não desenha nem executa a interação (`manifest/features/18-animation-and-events.json:2371` `"The editing canvas never runs them."`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de ser cometido.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador; nenhuma linha citada em Passos registra ouvinte.

## Medições
- nenhuma — nenhum passo lê dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco.
