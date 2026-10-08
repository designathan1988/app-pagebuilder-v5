# ENT-P-structure-0067 — hand.take pela porta command-bar
## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta command-bar despacha `entry.command.id` e a intenção `given` na store do editor — o Início da porta.
2. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — o `given` junta os argumentos do manifesto da porta (vazios no manifesto) e os que o lugar acrescenta: nada — a porta manda a intenção vazia.
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
5. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor envolve o despacho (`gestureSafe`).
6. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes e o contexto de edição é capturado. [lê: EST-L05a-001 via beforeCommand]
7. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai direto à store do núcleo. [escreve: EST-L01-037 via dispatch] [escreve: EST-L01-033 via dispatch]
8. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
9. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — chama a regra única de execução.
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
11. `src/app/commands.ts:383` `'hand.take': HAND.take,` — a linha da Chamada do trecho: o tratador do comando.
## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta não construída ou indisponível: não despacha; disponível: segue.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo ou de área de transferência: a chamada é direta; com um deles a porta lê o arquivo ou o conteúdo antes (não é o caso desta porta).
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: despacha direto; com gesto aberto e comando que muda o documento: espera o gesto terminar (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); nenhum `await`, timer, quadro ou ouvinte é criado no trecho desta porta.
## Estado
- lê: EST-L01-030 (o documento, via dispatch), EST-L01-031 (a seleção, via dispatch), EST-L01-037 (o estado do editor, via dispatch), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-037 (o estado do editor, via dispatch), EST-L01-033 (a mensagem, via dispatch)
## Resultado
- **Estado final:** EST-L01-037 com `ui.hand` no elemento tomado (`src/core/structure/hand.ts:141` `const hand: HandState = { held: id, on: state.document, aim: { parent: at.parent.id, index: at.index }, below: [], refusal: null };`); o documento e a seleção não mudam; EST-L01-033 com a mensagem `status.hand.holding` (`src/core/structure/hand.ts:142` `return { kind: 'change', ui: { ...state.ui, hand }, message: message('status.hand.holding', { name: at.node.name }) };`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; o canvas desenha a mão pelo `heldHand` (`src/core/structure/hand.ts:53` `export function heldHand<Ui extends WithHand>(state: StoreState<Ui>): HandState | null {`).
- **DOM do canvas:** nada muda — o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.
## Regras
- G1: n/a — o comando não grava no documento nem num contexto de edição; escreve `ui` (`src/app/commands.ts:383` `'hand.take': HAND.take,`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do despacho.
- G3: ok `src/app/commands.ts:383` `'hand.take': HAND.take,` — um só tratador; esta porta manda só a intenção e chega à mesma linha da Chamada do trecho.
- G4: n/a — o caminho da porta e o tratador não desenham sobre o canvas (`src/app/commands.ts:383` `'hand.take': HAND.take,`).
- G5: n/a — o caminho da porta e o tratador não medem nem desenham painel ou barra (`src/app/commands.ts:383` `'hand.take': HAND.take,`).
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: n/a — sem `patches` o documento não é tocado (`src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`).
## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
## Ramos do trecho
- **Trecho:** TRC-hand.take
- **Argumentos enviados:** nenhum campo — o tipo é `Record<string, never>`
- nenhum — o trecho `TRC-hand.take` não lista ramo que dependa dos argumentos (`manifest/commands/structure.json:1810` `"args": {},`); esta porta manda a intenção vazia.
