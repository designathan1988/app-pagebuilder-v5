# TRC-hand.drop
- **Chamada:** `src/app/commands.ts:388` `'hand.drop': HAND.drop,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:2139` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `always` (`manifest/commands/structure.json:2141` `"predicate": "always",`).
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'hand.drop'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/hand.ts:163` `    drop: registerHandler<'hand.drop', Ui>('hand.drop', ({ state }) => ({ kind: 'change', ui: { ...state.ui, hand: NO_HAND }, message: message('status.hand.dropped') })),` — o tratador devolve o estado com a mão em `NO_HAND` e o recado. [lê: EST-L01-037 via handlerContext] [escreve: EST-L01-037 via run]
5. `src/core/structure/hand.ts:50` `export const NO_HAND: HandState | null = null;` — a mão largada é `null`.
6. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store adota o estado do editor sem a mão. [escreve: EST-L01-037 via run]
7. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
8. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
9. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado sem remendos. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/hand.ts:163` `    drop: registerHandler<'hand.drop', Ui>('hand.drop', ({ state }) => ({ kind: 'change', ui: { ...state.ui, hand: NO_HAND }, message: message('status.hand.dropped') })),` — o tratador não decide por valor algum: sempre devolve `ui.hand` a `null` e a mensagem `status.hand.dropped`.
- R2 `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — como `ui` é sempre um objeto novo, `changed` é verdadeiro e o estado é publicado.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/hand.ts:163`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L01-037, EST-L05a-001
- escreve: EST-L01-037 (o estado do editor), EST-L01-033 (a mensagem)

## Resultado
- **Estado final:** EST-L01-037 com `ui.hand` em `null` (`src/core/structure/hand.ts:163`); o documento e a seleção não mudam; a mensagem `status.hand.dropped`.
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; o canvas deixa de desenhar a mira (`src/core/structure/hand.ts:53` `export function heldHand<Ui extends WithHand>(state: StoreState<Ui>): HandState | null {` devolve `null`).
- **DOM do canvas:** nada muda — o resultado não leva `patches` e `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras
- G1: n/a — o comando não grava no documento nem num contexto de edição; escreve `ui.hand` (`src/core/structure/hand.ts:163`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:388` `'hand.drop': HAND.drop,` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; deixa de desenhar a mira, pelos leitores de `ui.hand`.
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/hand.ts:163`).
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso (`src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: n/a — sem `patches` o documento não é tocado (`src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos).

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/hand.ts:163`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve `ui` (`src/core/structure/hand.ts:163`).
