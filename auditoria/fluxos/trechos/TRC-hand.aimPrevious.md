# TRC-hand.aimPrevious
- **Chamada:** `src/app/commands.ts:385` `'hand.aimPrevious': HAND.aimPrevious,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:1996` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `always` (`manifest/commands/structure.json:1998` `"predicate": "always",`).
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'hand.aimPrevious'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/hand.ts:145` `    aimPrevious: registerHandler<'hand.aimPrevious', Ui>('hand.aimPrevious', (context) => step(context, -1)),` — o tratador chama `step` com `-1`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext] [lê: EST-L01-037 via handlerContext]
5. `src/core/structure/hand.ts:122` `    const hand = heldHand(context.state);` — a mão que vale agora. [lê: EST-L01-030 via heldHand] [lê: EST-L01-031 via heldHand] [lê: EST-L01-037 via heldHand]
6. `src/core/structure/hand.ts:55` `  if (hand === null || hand.on !== state.document) return null;` — nenhuma mão, ou o documento mudou desde a tomada: `null`.
7. `src/core/structure/hand.ts:56` `  return state.selection.length === 1 && state.selection[0] === hand.held ? hand : null;` — a seleção deixou de ser só o elemento na mão: `null`.
8. `src/core/structure/hand.ts:123` `    if (hand === null) return nothing;` — sem mão, nada muda (`src/core/structure/hand.ts:120` `  const nothing: Outcome<Ui> = { kind: 'change' };`).
9. `src/core/structure/hand.ts:124` `    const slots = slotsFor(context.state.document, context.rules, hand.held);` — todos os lugares de encaixe da página, na ordem de leitura. [lê: EST-L01-030 via slotsFor]
10. `src/core/structure/hand.ts:125` `    const at = slots.findIndex((s) => sameAim(s, hand.aim));` — o lugar atual da mira.
11. `src/core/structure/hand.ts:126` `    const next = slots[Math.max(0, Math.min(slots.length - 1, at + by))] ?? hand.aim;` — a mira anda um lugar para trás, presa aos limites.
12. `src/core/structure/hand.ts:127` `    return aimed(context, { ...hand, aim: next, below: [] });` — o estado novo da mira passa por `aimed`. [lê: EST-L01-030 via aimed]
13. `src/core/structure/hand.ts:115` `    const hand: HandState = { ...aiming, refusal: refusalOf(context, aiming.held, aiming.aim) };` — a recusa da mira é lida pelo movimento (`src/core/structure/hand.ts:97` `  const outcome = moveSelectionTo({ document, selection: [held] }, context.rules, context.layout, aim.parent, aim.index);`). [lê: EST-L01-030 via refusalOf]
14. `src/core/structure/hand.ts:116` `    return { kind: 'change', ui: { ...context.state.ui, hand }, message: aimMessage(document, hand) };` — o resultado leva o estado do editor com a mão e o recado da mira. [escreve: EST-L01-037 via run]
15. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store adota o estado do editor. [escreve: EST-L01-037 via run]
16. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
17. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
18. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado sem remendos. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/hand.ts:123` `    if (hand === null) return nothing;` — sem mão: `{ kind: 'change' }` sem `ui` nem mensagem, e a store não publica; com mão: segue.
- R2 `src/core/structure/hand.ts:55` `  if (hand === null || hand.on !== state.document) return null;` — o documento em que a mão foi tomada não é mais o da store: a mira vale `null`; é o mesmo: segue.
- R3 `src/core/structure/hand.ts:126` `    const next = slots[Math.max(0, Math.min(slots.length - 1, at + by))] ?? hand.aim;` — no primeiro lugar a mira fica; senão, recua um.
- R4 `src/core/structure/hand.ts:98` `  return outcome.kind === 'refused' ? outcome.message : null;` — a mira que o movimento recusa guarda a recusa (dita na barra de status); a que passa guarda `null`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/hand.ts:145`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L01-037, EST-L05a-001
- escreve: EST-L01-037 (o estado do editor), EST-L01-033 (a mensagem)

## Resultado
- **Estado final:** EST-L01-037 com `ui.hand.aim` no lugar anterior (`src/core/structure/hand.ts:126`); o documento e a seleção não mudam; a mensagem é a da mira (`src/core/structure/hand.ts:108` `  return message('status.hand.aim', { receiver: receiver?.node.name ?? '', position: hand.aim.index + 1, count, level: hand.below.length + 1, levels });`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status diz o receptor, a posição e o nível; o canvas desenha a mira pelo `heldHand`.
- **DOM do canvas:** nada muda — o resultado não leva `patches` e `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras
- G1: n/a — o comando não grava no documento nem num contexto de edição; escreve `ui.hand` (`src/core/structure/hand.ts:116`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:385` `'hand.aimPrevious': HAND.aimPrevious,` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; a mira é desenhada pelos leitores de `ui.hand`.
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/hand.ts:116`).
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso (`src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: n/a — sem `patches` o documento não é tocado (`src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos).

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/hand.ts:145`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve `ui` (`src/core/structure/hand.ts:116`).
