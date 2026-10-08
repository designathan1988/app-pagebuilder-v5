# TRC-interactions.remove
- **Chamada:** `src/app/commands.ts:263` `'interactions.remove': removeInteractionCommand,`
- **Argumentos:** o tratador recebe `{ interaction }` — o índice da interação a remover na lista do elemento (`src/generated/commands.ts:161`).
- **Ramos que dependem dos argumentos:** R1 e R2 (`interaction`).

## Passos
1. O despacho resolve o tratador na tabela pelo id e o chama: `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o contexto montado lê o estado da store `[lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]`.
2. `src/core/events/interactions.ts:366` `export const removeInteractionCommand = registerHandler('interactions.remove', (context, { interaction }): Outcome<never> => {` — o tratador entra com o índice.
3. `src/core/events/interactions.ts:367` `const found = targetNode(context);` — resolve o nó primário da seleção `[lê: EST-L01-030 via targetNode] [lê: EST-L01-031 via targetNode]`.
4. `src/core/events/interactions.ts:102` `const primary = context.state.selection[0];` — lê a seleção `[lê: EST-L01-031 via targetNode]`.
5. `src/core/events/interactions.ts:104` `const found = locate(context.state.document, primary);` — localiza o nó no documento `[lê: EST-L01-030 via locate]`.
6. `src/core/document/model.ts:290` `export function locate(doc: DocumentJson, id: NodeId): Location | null {` — devolve o nó, o pai, o índice e o caminho de patches.
7. `src/core/events/interactions.ts:368` `if (found === null || typeof interaction !== 'number') return { kind: 'change' };` — sem nó ou sem índice, nada muda (R1).
8. `src/core/events/interactions.ts:369` `const held = interactionsOf(found.node)[interaction];` — a interação no índice dado `[lê: EST-L01-030 via interactionsOf]`.
9. `src/core/events/interactions.ts:370` `if (held === undefined) return { kind: 'change' };` — índice fora da lista, nada muda (R2).
10. `src/core/events/interactions.ts:371` `const locked = lockedRefusal(context, found.node);` — a trava do elemento ou de um ancestral `[lê: EST-L01-030 via lockedRefusal]` (R3).
11. `src/core/events/interactions.ts:107` `const lockedRefusal = <Ui>(context: HandlerContext<Ui>, node: DocNode) => firstLockRefusal(context.state.document, [node.id as NodeId], 'status.locked.edit');`
12. `src/core/nodes/flags.ts:49` `export function firstLockRefusal(document: DocumentJson, ids: readonly NodeId[], key: LockedKey): Message | null {` — devolve a primeira recusa de trava na ordem dos ids.
13. `src/core/events/interactions.ts:373` `const interactions = interactionsOf(found.node).filter((_each, at) => at !== interaction);` — a lista sem a interação do índice.
14. `src/core/events/interactions.ts:374` `return { kind: 'change', patches: writeInteractions(found, interactions), message: message('status.interactions.removed',` — o patch que grava a lista sem a interação `[escreve: EST-L01-030 via writeInteractions]`.
15. `src/core/events/interactions.ts:112` `return [{ op: 'replace', path: [...found.path], value: interactions.length === 0 ? rest : { ...rest, interactions } }];` — com a lista vazia o nó perde o campo `interactions`; senão o campo é a lista nova.
16. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o patch ao documento `[escreve: EST-L01-030 via applyPatches]`.
17. `src/core/store/store.ts:535` `const ran: StoreState<Ui> = {` — monta o estado novo com o documento mudado.
18. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — publica a mudança `[escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]`.

## Ramos
- R1 — sem alvo ou sem índice: `src/core/events/interactions.ts:368` `if (found === null || typeof interaction !== 'number') return { kind: 'change' };`. Valores: seleção vazia (`src/core/events/interactions.ts:103` `if (primary === undefined) return null;`), id que o documento não tem, ou `interaction` não numérico; resultado: nenhuma mudança.
- R2 — índice fora da lista: `src/core/events/interactions.ts:370` `if (held === undefined) return { kind: 'change' };`; resultado: nenhuma mudança.
- R3 — nó travado: `src/core/events/interactions.ts:372` `if (locked !== null) return { kind: 'refused', message: locked };`; lado travado: recusa com a mensagem da trava; lado livre: segue e grava.

## Fronteiras assíncronas
- nenhuma — nenhuma das funções chamadas (`src/core/events/interactions.ts:366` `export const removeInteractionCommand = registerHandler('interactions.remove', (context, { interaction }): Outcome<never> => {`) contém `await`, timer, quadro ou ouvinte; o tratador é síncrono.

## Estado
- Lidos: EST-L01-030 (`context.state.document`), EST-L01-031 (`context.state.selection`).
- Escritos: EST-L01-030 (o documento, pelo patch de `writeInteractions`).

## Resultado
- **Estado final:** `src/core/store/store.ts:535` `const ran: StoreState<Ui> = {` — o documento deixa de listar a interação removida no nó selecionado; a seleção não muda.
- **Re-renderizado:** `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes da store são notificados.
- **DOM do editor:** `src/editor/store.ts:253` `return useSyncExternalStore(store.subscribe, () => select(store.getState()));` — o inspetor redescreve os cartões restantes do elemento.
- **DOM do canvas:** `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` — o canvas é notificado da mudança do documento; a interação não é desenhada nem executada.

## Regras
- G1: n/a — o trecho grava `interactions` no caminho do próprio nó e não lê ponto de quebra, estado, classe-alvo nem quadro-chave (`src/core/events/interactions.ts:112`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `interactions.remove` é desfazível no manifesto (`manifest/commands/events.json:413` `"undoable": true,`), então a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:263` `'interactions.remove': removeInteractionCommand,` — a única porta do comando (`manifest/commands/events.json:421` `"id": "inspector-interaction-remove",`) despacha só a intenção para este tratador.
- G4: n/a — a ação nasce no painel do inspetor, na própria coluna, fora do canvas (`manifest/commands/events.json:77` `"region": "inspector-interactions",`).
- G5: n/a — o comando remove uma interação e não desenha controle que cresça painel ou barra (`manifest/commands/events.json:423` `"drawnAs": "icon-button",`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — o trecho não escreve seleção; o desfazer devolve a seleção anterior ao comando (`manifest/commands/events.json:415` `"undoRestoresSelection": "before-command",`).
- G7: n/a — o canvas de edição não desenha nem executa a interação (`manifest/features/18-animation-and-events.json:2371` `"The editing canvas never runs them."`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de ser cometido.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador; nenhuma linha citada em Passos registra ouvinte.

## Medições
- nenhuma — nenhum passo lê dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco.
