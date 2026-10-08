# TRC-hand.take
- **Chamada:** `src/app/commands.ts:383` `'hand.take': HAND.take,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:1810` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `singleSelection` (`manifest/commands/structure.json:1812` `"predicate": "singleSelection",`). [lê: EST-L01-031 via predicate.test]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'hand.take'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/hand.ts:133` `    take: registerHandler<'hand.take', Ui>('hand.take', ({ state }) => {` — o tratador recebe o estado. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext] [lê: EST-L01-037 via handlerContext]
5. `src/core/structure/hand.ts:134` `      const id = state.selection[0];` — o único selecionado.
6. `src/core/structure/hand.ts:135` `      const at = id === undefined ? null : locate(state.document, id);` — o nó do selecionado. [lê: EST-L01-030 via locate]
7. `src/core/structure/hand.ts:137` `      if (id === undefined || at === null) throw new Error('hand.take: the selection names no node of the document');` — sem nó, defeito da store (a disponibilidade `singleSelection` guarda a porta).
8. `src/core/structure/hand.ts:138` `      if (at.parent === null) return { kind: 'refused', message: message('status.hand.root') };` — a raiz da página recusa.
9. `src/core/structure/hand.ts:139` `      if (at.node.hidden === true) return { kind: 'refused', message: message('status.hand.hidden', { name: at.node.name }) };` — o elemento escondido recusa.
10. `src/core/structure/hand.ts:141` `      const hand: HandState = { held: id, on: state.document, aim: { parent: at.parent.id, index: at.index }, below: [], refusal: null };` — a mão guarda o elemento, o documento em que foi tomado e o próprio lugar. [escreve: EST-L01-037 via run]
11. `src/core/structure/hand.ts:142` `      return { kind: 'change', ui: { ...state.ui, hand }, message: message('status.hand.holding', { name: at.node.name }) };` — o resultado leva o estado do editor com a mão e o recado. [escreve: EST-L01-037 via run]
12. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
13. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
14. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
15. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado sem remendos. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/hand.ts:138` `      if (at.parent === null) return { kind: 'refused', message: message('status.hand.root') };` — a raiz da página: recusa `status.hand.root`; senão, segue.
- R2 `src/core/structure/hand.ts:139` `      if (at.node.hidden === true) return { kind: 'refused', message: message('status.hand.hidden', { name: at.node.name }) };` — o elemento escondido: recusa `status.hand.hidden`; senão, toma.
- R3 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem exatamente um selecionado a porta nem abre; com um selecionado, segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/hand.ts:133`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L01-037, EST-L05a-001
- escreve: EST-L01-037 (o estado do editor), EST-L01-033 (a mensagem)

## Resultado
- **Estado final:** EST-L01-037 com `ui.hand` no elemento tomado (`src/core/structure/hand.ts:141`); o documento e a seleção não mudam; a mensagem `status.hand.holding` (`src/core/structure/hand.ts:142`).
- **Re-renderizado:** os assinantes do estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; o canvas desenha a mão pelo `heldHand` (`src/core/structure/hand.ts:53` `export function heldHand<Ui extends WithHand>(state: StoreState<Ui>): HandState | null {`).
- **DOM do canvas:** nada muda — o resultado não leva `patches` e `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras
- G1: n/a — o comando não grava no documento nem num contexto de edição; escreve `ui.hand` (`src/core/structure/hand.ts:141`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:383` `'hand.take': HAND.take,` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; o indicador da mão é desenhado pelos leitores de `ui.hand`.
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/hand.ts:142`).
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso (`src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: n/a — sem `patches` o documento não é tocado (`src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos).

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/hand.ts:133`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve `ui` (`src/core/structure/hand.ts:142`).
