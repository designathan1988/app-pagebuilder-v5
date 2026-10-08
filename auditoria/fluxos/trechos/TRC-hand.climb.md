# TRC-hand.climb
- **Chamada:** `src/app/commands.ts:386` `'hand.climb': HAND.climb,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:2057` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `always` (`manifest/commands/structure.json:2059` `"predicate": "always",`).
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'hand.climb'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/hand.ts:147` `    climb: registerHandler<'hand.climb', Ui>('hand.climb', (context) => {` — o tratador recebe o contexto. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext] [lê: EST-L01-037 via handlerContext]
5. `src/core/structure/hand.ts:148` `      const hand = heldHand(context.state);` — a mão que vale agora. [lê: EST-L01-030 via heldHand] [lê: EST-L01-031 via heldHand] [lê: EST-L01-037 via heldHand]
6. `src/core/structure/hand.ts:149` `      if (hand === null) return nothing;` — sem mão, nada muda (`src/core/structure/hand.ts:120` `  const nothing: Outcome<Ui> = { kind: 'change' };`).
7. `src/core/structure/hand.ts:150` `      const receiver = locate(context.state.document, hand.aim.parent);` — o receptor da mira. [lê: EST-L01-030 via locate]
8. `src/core/structure/hand.ts:151` `      if (receiver?.parent == null) return aimed(context, hand);` — o receptor no topo da página não tem nível acima: a mira fica.
9. `src/core/structure/hand.ts:152` `      const index = receiver.parent.children.filter((c) => c.id !== hand.held).findIndex((c) => c.id === receiver.node.id) + 1;` — o índice logo depois do receptor no pai dele, sem o elemento da mão.
10. `src/core/structure/hand.ts:153` `      return aimed(context, { ...hand, aim: { parent: receiver.parent.id, index }, below: [...hand.below, hand.aim] });` — a mira sobe um nível e o anterior entra na escada `below`. [lê: EST-L01-030 via aimed]
11. `src/core/structure/hand.ts:115` `    const hand: HandState = { ...aiming, refusal: refusalOf(context, aiming.held, aiming.aim) };` — a recusa da mira é lida pelo movimento (`src/core/structure/hand.ts:97` `  const outcome = moveSelectionTo({ document, selection: [held] }, context.rules, context.layout, aim.parent, aim.index);`). [lê: EST-L01-030 via refusalOf]
12. `src/core/structure/hand.ts:116` `    return { kind: 'change', ui: { ...context.state.ui, hand }, message: aimMessage(document, hand) };` — o resultado leva o estado do editor com a mão e o recado. [escreve: EST-L01-037 via run]
13. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store adota o estado do editor. [escreve: EST-L01-037 via run]
14. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
15. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
16. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado sem remendos. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/hand.ts:149` `      if (hand === null) return nothing;` — sem mão: `{ kind: 'change' }` sem `ui` nem mensagem, e a store não publica; com mão: segue.
- R2 `src/core/structure/hand.ts:151` `      if (receiver?.parent == null) return aimed(context, hand);` — o receptor no topo da página: a mira fica igual (o `below` não cresce); com nível acima: sobe.
- R3 `src/core/structure/hand.ts:98` `  return outcome.kind === 'refused' ? outcome.message : null;` — a mira que o movimento recusa guarda a recusa; a que passa guarda `null`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/hand.ts:147`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L01-037, EST-L05a-001
- escreve: EST-L01-037 (o estado do editor), EST-L01-033 (a mensagem)

## Resultado
- **Estado final:** EST-L01-037 com `ui.hand.aim` um nível acima e a mira antiga em `ui.hand.below` (`src/core/structure/hand.ts:153`); o documento e a seleção não mudam; a mensagem é a da mira (`src/core/structure/hand.ts:108` `  return message('status.hand.aim', { receiver: receiver?.node.name ?? '', position: hand.aim.index + 1, count, level: hand.below.length + 1, levels });`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status diz o receptor, a posição e o nível; o canvas desenha a mira pelo `heldHand`.
- **DOM do canvas:** nada muda — o resultado não leva `patches` e `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras
- G1: n/a — o comando não grava no documento nem num contexto de edição; escreve `ui.hand` (`src/core/structure/hand.ts:116`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:386` `'hand.climb': HAND.climb,` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; a mira é desenhada pelos leitores de `ui.hand`.
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/hand.ts:116`).
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso (`src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: n/a — sem `patches` o documento não é tocado (`src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos).

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/hand.ts:147`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve `ui` (`src/core/structure/hand.ts:116`).
