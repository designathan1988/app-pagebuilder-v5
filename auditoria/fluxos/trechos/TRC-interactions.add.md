# TRC-interactions.add
- **Chamada:** `src/app/commands.ts:261` `'interactions.add': addInteractionCommand,`
- **Argumentos:** o tratador recebe `{ trigger, action, target, options }` — `trigger` e `action` são enums declarados pelo manifesto, `target` é um `NodeId`, `options` é um objeto JSON (`src/generated/commands.ts:159`).
- **Ramos que dependem dos argumentos:** R2 (`trigger`), R3 (`action`), R4 (`target` e `options`).

## Passos
1. O despacho resolve o tratador na tabela pelo id e o chama: `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o contexto montado lê o estado da store `[lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]`.
2. `src/core/events/interactions.ts:207` `export const addInteractionCommand = registerHandler('interactions.add',` — o tratador entra com os quatro argumentos.
3. `src/core/events/interactions.ts:208` `const found = targetNode(context);` — resolve o nó primário da seleção `[lê: EST-L01-030 via targetNode] [lê: EST-L01-031 via targetNode]`.
4. `src/core/events/interactions.ts:102` `const primary = context.state.selection[0];` — lê a seleção `[lê: EST-L01-031 via targetNode]`.
5. `src/core/events/interactions.ts:104` `const found = locate(context.state.document, primary);` — localiza o nó no documento `[lê: EST-L01-030 via locate]`.
6. `src/core/document/model.ts:290` `export function locate(doc: DocumentJson, id: NodeId): Location | null {` — devolve o nó, o pai, o índice e o caminho de patches.
7. `src/core/events/interactions.ts:209` `if (found === null) return { kind: 'change' };` — sem nó primário, nada muda (R1).
8. `src/core/events/interactions.ts:210` `const chosenTrigger = trigger ?? applicableTriggers(found.node)[0] ?? 'click';` — o gatilho pedido, senão o primeiro aplicável, senão `click` (R2).
9. `src/core/events/interactions.ts:54` `export const applicableTriggers = (node: DocNode): readonly string[] => TRIGGERS.filter((trigger) => trigger !== 'form-submit' || isForm(node));` — `form-submit` só é oferecido a um `form`.
10. `src/core/events/interactions.ts:211` `if (!applicableTriggers(found.node).includes(chosenTrigger)) return { kind: 'refused', message: message('status.interactions.notApplicable',` — gatilho que não se aplica é recusado (R2).
11. `src/core/events/interactions.ts:212` `const chosenAction = action ?? applicableActions(found.node)[0] ?? 'show';` — a ação pedida, senão a primeira aplicável (R3).
12. `src/core/events/interactions.ts:57` `export const applicableActions = (node: DocNode): readonly string[] => (animationsOf(node).length === 0 ? ACTIONS.filter((action) => action !== 'play-animation') : ACTIONS);` — `play-animation` só onde o nó tem animação.
13. `src/core/animation/animation.ts:28` `export const animationsOf = (node: DocNode): readonly Animation[] => node.animations ?? NONE;` — lê as animações do nó `[lê: EST-L01-030 via animationsOf]`.
14. `src/core/events/interactions.ts:213` `if (!applicableActions(found.node).includes(chosenAction)) return { kind: 'refused', message: message('status.interactions.notApplicable',` — ação que não se aplica é recusada (R3).
15. `src/core/events/interactions.ts:214` `const locked = lockedRefusal(context, found.node);` — a trava do elemento ou de um ancestral `[lê: EST-L01-030 via lockedRefusal]`.
16. `src/core/events/interactions.ts:107` `const lockedRefusal = <Ui>(context: HandlerContext<Ui>, node: DocNode) => firstLockRefusal(context.state.document, [node.id as NodeId], 'status.locked.edit');`
17. `src/core/nodes/flags.ts:49` `export function firstLockRefusal(document: DocumentJson, ids: readonly NodeId[], key: LockedKey): Message | null {` — devolve a primeira recusa de trava na ordem dos ids (R5).
18. `src/core/events/interactions.ts:216` `const held = options !== null && typeof options === 'object' && !Array.isArray(options) ? (options as Record<string, unknown>) : {};` — normaliza `options` para um registro (R4).
19. `src/core/events/interactions.ts:217` `const timing = optionsOfChanges(held);` — lê `once` e `delay` como inteiro em milissegundos.
20. `src/core/events/interactions.ts:220` `const address = typeof held.address === 'string' ? readAddress(held.address) : null;` — o endereço passa pela regra única.
21. `src/core/elements/address.ts:44` `export function readAddress(typed: string): Address {` — normaliza (um domínio sem esquema vira `https://`) ou recusa (R4).
22. `src/core/events/interactions.ts:222` `const interaction: Interaction = withOptions(` — monta a interação e aplica as opções `[lê: EST-L04b-007 via withOptions]`.
23. `src/core/events/interactions.ts:236` `const nodeIds = new Set([...allNodes(context.state.document)].map((one) => one.id as string));` — colhe os ids do documento `[lê: EST-L01-030 via allNodes]`.
24. `src/core/events/interactions.ts:237` `const problem = interactionProblems(interaction, nodeIds)[0];` — valida a interação como o validador do documento `[lê: EST-L04b-006 via interactionProblems]`.
25. `src/core/events/interactions.ts:239` `if (interaction.animation !== undefined && !animationsOf(found.node).some((one) => one.name === interaction.animation)) return { kind: 'refused', message: message('status.interactions.notApplicable', { name: interaction.animation }) };` — animação que o nó não tem é recusada (R4).
26. `src/core/events/interactions.ts:242` `patches: writeInteractions(found, [...interactionsOf(found.node), interaction]),` — o patch que acrescenta a interação nova `[escreve: EST-L01-030 via writeInteractions]`.
27. `src/core/events/interactions.ts:112` `return [{ op: 'replace', path: [...found.path], value: interactions.length === 0 ? rest : { ...rest, interactions } }];` — o patch substitui o nó no seu próprio caminho.
28. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o patch ao documento `[escreve: EST-L01-030 via applyPatches]`.
29. `src/core/store/store.ts:535` `const ran: StoreState<Ui> = {` — monta o estado novo com o documento mudado.
30. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — publica a mudança `[escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]`.

## Ramos
- R1 — sem nó para agir: `src/core/events/interactions.ts:209` `if (found === null) return { kind: 'change' };`. Valores: a seleção vazia (`primary === undefined`, `src/core/events/interactions.ts:103` `if (primary === undefined) return null;`) ou um id que o documento não tem; resultado: nenhuma mudança.
- R2 — gatilho: `src/core/events/interactions.ts:210` `const chosenTrigger = trigger ?? applicableTriggers(found.node)[0] ?? 'click';` e `src/core/events/interactions.ts:211` `if (!applicableTriggers(found.node).includes(chosenTrigger)) return { kind: 'refused', message: message('status.interactions.notApplicable',`. Lado aplicável (`trigger` ausente ou em `applicableTriggers`): segue com o gatilho escolhido; lado não aplicável (por exemplo `form-submit` num nó cujo `tag` não é `form`): recusa `status.interactions.notApplicable` e o documento fica intacto.
- R3 — ação: `src/core/events/interactions.ts:212` `const chosenAction = action ?? applicableActions(found.node)[0] ?? 'show';` e `src/core/events/interactions.ts:213` `if (!applicableActions(found.node).includes(chosenAction)) return { kind: 'refused', message: message('status.interactions.notApplicable',`. Lado aplicável: segue com a ação; lado não aplicável (`play-animation` num nó sem animação): recusa.
- R4 — `options` e `target`: `src/core/events/interactions.ts:216` `const held = options !== null && typeof options === 'object' && !Array.isArray(options) ? (options as Record<string, unknown>) : {};`, `src/core/events/interactions.ts:218` `if (timing === null) return { kind: 'refused', message: message('status.interactions.badOptions', { text: String(held.delay) }) };`, `src/core/events/interactions.ts:221` `if (address !== null && !address.ok) return { kind: 'refused', message: address.refusal };`, `src/core/events/interactions.ts:238` `if (problem !== undefined) return { kind: 'refused', message: message('status.interactions.badOptions', { text: problem.field }) };`. Lado aceito: a interação é gravada com os campos que os argumentos trazem (`target` só entra quando é texto, `src/core/events/interactions.ts:226`); lado recusado: atraso fora de `0..MAX_DELAY`, endereço não permitido, campo fora do modelo, ou `target` que não nomeia um elemento (`src/core/events/interactions.ts:236`).
- R5 — nó travado: `src/core/events/interactions.ts:215` `if (locked !== null) return { kind: 'refused', message: locked };`. Lado travado: recusa com a mensagem da trava; lado livre: segue.

## Fronteiras assíncronas
- nenhuma — nenhuma das funções chamadas pelo tratador (`src/core/events/interactions.ts:207` `export const addInteractionCommand = registerHandler('interactions.add',`) contém `await`, timer, quadro ou ouvinte; o tratador é síncrono e devolve um `Outcome`.

## Estado
- Lidos: EST-L01-030 (`context.state.document`), EST-L01-031 (`context.state.selection`), EST-L04b-006 (via `interactionProblems`), EST-L04b-007 (via `withOptions`).
- Escritos: EST-L01-030 (o documento, pelo patch de `writeInteractions`; nenhum campo de `ui` é tocado).

## Resultado
- **Estado final:** `src/core/store/store.ts:535` `const ran: StoreState<Ui> = {` — o documento passa a listar a interação nova no nó selecionado; a seleção não muda.
- **Re-renderizado:** `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes da store são notificados.
- **DOM do editor:** `src/editor/store.ts:253` `return useSyncExternalStore(store.subscribe, () => select(store.getState()));` — o painel do inspetor redescreve os cartões das interações do elemento.
- **DOM do canvas:** `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` — o canvas é notificado da mudança do documento; a interação não é desenhada nem executada.

## Regras
- G1: n/a — o trecho grava `interactions` no caminho do próprio nó e não lê ponto de quebra, estado, classe-alvo nem quadro-chave (`src/core/events/interactions.ts:112`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `interactions.add` é desfazível no manifesto (`manifest/commands/events.json:55` `"undoable": true,`), então a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:261` `'interactions.add': addInteractionCommand,` — a única porta do comando (`manifest/commands/events.json:63` `"id": "inspector-interaction-add",`) despacha só a intenção para este tratador.
- G4: n/a — a ação nasce no painel do inspetor, na própria coluna, fora do canvas (`manifest/commands/events.json:77` `"region": "inspector-interactions",`).
- G5: n/a — o comando acrescenta uma interação e não desenha controle que cresça painel ou barra (`manifest/commands/events.json:65` `"drawnAs": "button",`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — o trecho não escreve seleção e a store é a fonte única.
- G7: n/a — o canvas de edição não desenha nem executa a interação (`manifest/features/18-animation-and-events.json:2371` `"The editing canvas never runs them."`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de ser cometido.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador; nenhuma linha citada em Passos registra ouvinte.

## Medições
- nenhuma — nenhum passo lê dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco.
